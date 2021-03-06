using BrunoLau.SpaServices.Common;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;

namespace BrunoLau.SpaServices.Webpack
{
    /// <summary>
    /// Extension methods that can be used to enable Webpack dev middleware support.
    /// </summary>
    public static class WebpackDevMiddleware
    {
        private const string DefaultConfigFile = "webpack.config.js";

        private static readonly JsonSerializerSettings jsonSerializerSettings = new JsonSerializerSettings
        {
            // Note that the aspnet-webpack JS code specifically expects options to be serialized with
            // PascalCase property names, so it's important to be explicit about this contract resolver
            ContractResolver = new DefaultContractResolver(),

            TypeNameHandling = TypeNameHandling.None
        };

        /// <summary>
        /// Enables Webpack dev middleware support. This hosts an instance of the Webpack compiler in memory
        /// in your application so that you can always serve up-to-date Webpack-built resources without having
        /// to run the compiler manually. Since the Webpack compiler instance is retained in memory, incremental
        /// compilation is vastly faster that re-running the compiler from scratch.
        ///
        /// Incoming requests that match Webpack-built files will be handled by returning the Webpack compiler
        /// output directly, regardless of files on disk. If compilation is in progress when the request arrives,
        /// the response will pause until updated compiler output is ready.
        /// </summary>
        /// <param name="appBuilder">The <see cref="IApplicationBuilder"/>.</param>
        /// <param name="options">Options for configuring the Webpack compiler instance.</param>
        public static void UseWebpackDevMiddlewareEx(
            this IApplicationBuilder appBuilder,
            WebpackDevMiddlewareOptions options = null)
        {
            // Prepare options
            if (options == null)
            {
                options = new WebpackDevMiddlewareOptions();
            }

            // Validate options
            if (options.ReactHotModuleReplacement && !options.HotModuleReplacement)
            {
                throw new ArgumentException(
                    "To enable ReactHotModuleReplacement, you must also enable HotModuleReplacement.");
            }

            //Determine project path and environment variables
            string projectPath;
            Dictionary<string, string> environmentVariables = new Dictionary<string, string>();
            if (!string.IsNullOrEmpty(options.ProjectPath))
            {
                projectPath = options.ProjectPath;
            }
            else
            {
                var hostEnv = appBuilder.ApplicationServices.GetService<IHostingEnvironment>();
                if (hostEnv != null)
                {
                    // In an ASP.NET environment, we can use the IHostingEnvironment data to auto-populate a few
                    // things that you'd otherwise have to specify manually
                    projectPath = hostEnv.ContentRootPath;
                    environmentVariables["NODE_ENV"] = hostEnv.IsDevelopment() ? "development" : "production"; // De-facto standard values for Node
                }
                else
                {
                    projectPath = Directory.GetCurrentDirectory();
                }
            }

            if (options.EnvironmentVariables != null)
            {
                foreach (var kvp in options.EnvironmentVariables)
                {
                    environmentVariables[kvp.Key] = kvp.Value;
                }
            }

            // Unlike other consumers of NodeServices, WebpackDevMiddleware dosen't share Node instances, nor does it
            // use your DI configuration. It's important for WebpackDevMiddleware to have its own private Node instance
            // because it must *not* restart when files change (if it did, you'd lose all the benefits of Webpack
            // middleware). And since this is a dev-time-only feature, it doesn't matter if the default transport isn't
            // as fast as some theoretical future alternative.
            // This should do it by using Jering.Javascript.NodeJS interop
            var nodeJSService = NodeInteropFactory.BuildNewInstance(environmentVariables);


            // Ideally, this would be relative to the application's PathBase (so it could work in virtual directories)
            // but it's not clear that such information exists during application startup, as opposed to within the context
            // of a request.
            var hmrEndpoint = !string.IsNullOrEmpty(options.HotModuleReplacementEndpoint)
                ? options.HotModuleReplacementEndpoint
                : "/__webpack_hmr"; // Matches webpack's built-in default

            // Tell Node to start the server hosting webpack-dev-middleware
            var devServerOptions = new
            {
                webpackConfigPath = Path.Combine(projectPath, options.ConfigFile ?? DefaultConfigFile),
                suppliedOptions = options,
                understandsMultiplePublicPaths = true,
                hotModuleReplacementEndpointUrl = hmrEndpoint
            };

            // Launch the dev server by using Node interop
            var devServerInfo = nodeJSService.InvokeFromStringAsync<WebpackDevServerInfo>(
                EmbeddedResourceReader.Read(typeof(WebpackDevMiddleware), "/Content/Node/webpack-dev-middleware.js"), //Embedded JS file
                args: new object[] { JsonConvert.SerializeObject(devServerOptions, jsonSerializerSettings) } //Options patched so that they work with aspnet-webpack package
            ).Result;

            // If we're talking to an older version of aspnet-webpack, it will return only a single PublicPath,
            // not an array of PublicPaths. Handle that scenario.
            if (devServerInfo.PublicPaths == null)
            {
                devServerInfo.PublicPaths = new[] { devServerInfo.PublicPath };
            }

            // Proxy the corresponding requests through ASP.NET and into the Node listener
            // Anything under /<publicpath> (e.g., /dist) is proxied as a normal HTTP request with a typical timeout (100s is the default from HttpClient),
            // plus /__webpack_hmr is proxied with infinite timeout, because it's an EventSource (long-lived request).
            foreach (var publicPath in devServerInfo.PublicPaths)
            {
                appBuilder.UseProxyToLocalWebpackDevMiddleware(publicPath + hmrEndpoint, devServerInfo.Port, Timeout.InfiniteTimeSpan);
                appBuilder.UseProxyToLocalWebpackDevMiddleware(publicPath, devServerInfo.Port, TimeSpan.FromSeconds(100));
            }
        }

        private static void UseProxyToLocalWebpackDevMiddleware(this IApplicationBuilder appBuilder, string publicPath, int proxyToPort, TimeSpan requestTimeout)
        {
            // Note that this is hardcoded to make requests to "localhost" regardless of the hostname of the
            // server as far as the client is concerned. This is because ConditionalProxyMiddlewareOptions is
            // the one making the internal HTTP requests, and it's going to be to some port on this machine
            // because aspnet-webpack hosts the dev server there. We can't use the hostname that the client
            // sees, because that could be anything (e.g., some upstream load balancer) and we might not be
            // able to make outbound requests to it from here.
            // Also note that the webpack HMR service always uses HTTP, even if your app server uses HTTPS,
            // because the HMR service has no need for HTTPS (the client doesn't see it directly - all traffic
            // to it is proxied), and the HMR service couldn't use HTTPS anyway (in general it wouldn't have
            // the necessary certificate).
            var proxyOptions = new ConditionalProxyMiddlewareOptions(
                "http", "localhost", proxyToPort.ToString(), requestTimeout);
            appBuilder.UseMiddleware<ConditionalProxyMiddleware>(publicPath, proxyOptions);
        }

#pragma warning disable CS0649
        class WebpackDevServerInfo
        {
            public int Port { get; set; }
            public string[] PublicPaths { get; set; }

            // For back-compatibility with older versions of aspnet-webpack, in the case where your webpack
            // configuration contains exactly one config entry. This will be removed soon.
            public string PublicPath { get; set; }
        }
    }
#pragma warning restore CS0649
}