using BrunoLau.SpaServices.Common;
using Jering.Javascript.NodeJS;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading;

namespace BrunoLau.SpaServices.Webpack
{
    /// <summary>
    /// Extension methods that can be used to enable Webpack dev middleware support.
    /// </summary>
    public static class WebpackDevMiddleware
    {
        private const string DefaultConfigFile = "webpack.config.js";

        private static readonly JsonSerializerOptions jsonSerializerOptions = new JsonSerializerOptions
        {
            // Note that the aspnet-webpack JS code specifically expects options to be serialized with
            // PascalCase property names, so it's important to be explicit about this contract resolver
            PropertyNamingPolicy = null,

            // No need for indentation
            WriteIndented = false
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

            // Ideally, this would be relative to the application's PathBase (so it could work in virtual directories)
            // but it's not clear that such information exists during application startup, as opposed to within the context
            // of a request.
            var hmrEndpoint = !string.IsNullOrEmpty(options.HotModuleReplacementEndpoint)
                ? options.HotModuleReplacementEndpoint
                : "/__webpack_hmr"; // Matches webpack's built-in default

            // Tell Node to start the server hosting webpack-dev-middleware
            var devServerOptions = new WebpackDevServerArgs
            {
                webpackConfigPath = Path.Combine(projectPath, options.ConfigFile ?? DefaultConfigFile),
                suppliedOptions = options,
                understandsMultiplePublicPaths = true,
                hotModuleReplacementEndpointUrl = hmrEndpoint
            };

            // Perform the webpack-hot-middleware package patch so taht overlay works, until fixed by the package owner
            if (options.TryPatchHotModulePackage)
            {
                PatchHotModuleMiddleware(projectPath);
            }

            // Launch the dev server by using Node interop with hack that fixes aspnet-webpack module to work wil Webpack 5 + webpack-dev-middleware 5
            var devServerInfo = StartWebpackDevServer(environmentVariables, options.ProjectPath, devServerOptions, false);

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

        /// <summary>
        /// Starts the webpack dev server. If the start fails for known reason, modifies the aspnet-webpack module to be compliant with webpack-dev-middleware 5.
        /// For compatibility purposes as the change is rather samll it's easier to modify the existing module than to create new NPM package and enforce anyone to udpate.
        /// </summary>
        private static WebpackDevServerInfo StartWebpackDevServer(IDictionary<string, string> environmentVariables, string projectPath, WebpackDevServerArgs devServerArgs, bool fixAttempted)
        {
            // Unlike other consumers of NodeServices, WebpackDevMiddleware dosen't share Node instances, nor does it
            // use your DI configuration. It's important for WebpackDevMiddleware to have its own private Node instance
            // because it must *not* restart when files change (if it did, you'd lose all the benefits of Webpack
            // middleware). And since this is a dev-time-only feature, it doesn't matter if the default transport isn't
            // as fast as some theoretical future alternative.
            // This should do it by using Jering.Javascript.NodeJS interop
            var nodeJSService = NodeInteropFactory.BuildNewInstance(environmentVariables, projectPath);

            try
            {
                return nodeJSService.InvokeFromStringAsync<WebpackDevServerInfo>(
                    EmbeddedResourceReader.Read(typeof(WebpackDevMiddleware), "/Content/Node/webpack-dev-middleware.js"), //Embedded JS file
                    args: new object[] { JsonSerializer.Serialize(devServerArgs, jsonSerializerOptions) } //Options patched so that they work with aspnet-webpack package
                ).Result;
            }
            catch (Exception ex)
            {
                if (fixAttempted)
                {
                    throw;
                }

                if (ex != null && ex.Message.Contains("Dev Middleware has been initialized using an options object that does not match the API schema."))
                {
                    //Attempt to modify module file so that it doesn't contain arguments not recognized by the webpack-dev-middleware 5
                    try
                    {
                        const string SEARCH_PATTERN = "at validate (";
                        var startIndex = ex.Message.IndexOf(SEARCH_PATTERN);
                        if (startIndex > -1)
                        {
                            startIndex += SEARCH_PATTERN.Length;
                            var endIndex = ex.Message.IndexOf("webpack-dev-middleware", startIndex);
                            var modulesPath = ex.Message.Substring(startIndex, endIndex - startIndex);

                            if (Directory.Exists(modulesPath))
                            {
                                var modulePath = Path.Combine(modulesPath, @"aspnet-webpack\WebpackDevMiddleware.js");
                                if (File.Exists(modulePath))
                                {
                                    var fileContent = File.ReadAllText(modulePath);
                                    fileContent = fileContent.Replace("noInfo: true,", "");
                                    fileContent = fileContent.Replace("watchOptions: webpackConfig.watchOptions", "");
                                    File.WriteAllText(modulePath, fileContent);
                                    nodeJSService.Dispose();

                                    return StartWebpackDevServer(environmentVariables, projectPath, devServerArgs, true);
                                }
                            }
                        }
                    }
                    catch (Exception)
                    { }
                }

                throw;
            }
        }

        /// <summary>
        /// Attempts to patch the webpack-hot-middleware so that it works with Webpack 5
        /// </summary>
        /// <param name="app"></param>
        private static void PatchHotModuleMiddleware(string projectPath)
        {
            var hotModuleDir = Path.Combine(projectPath, @"node_modules\webpack-hot-middleware");
            if (Directory.Exists(hotModuleDir))
            {
                var pathDat = Path.Combine(hotModuleDir, "patchDone.dat");
                if (File.Exists(pathDat))
                {
                    return;
                }

                var middlewarePath = Path.Combine(hotModuleDir, "middleware.js");
                if (File.Exists(middlewarePath))
                {
                    var middlewareContent = File.ReadAllText(middlewarePath);
                    if (!middlewareContent.Contains("//patched by the init script"))
                    {
                        middlewareContent = middlewareContent.Replace("statsResult.toJson({", "statsResult.toJson({errors:true,warnings:true,");
                        middlewareContent = middlewareContent.Replace("function publishStats(action", @"function formatErrors(n){return n&&n.length?'string'==typeof n[0]?n:n.map(function(n){return n.moduleName+' '+n.loc+'\n'+n.message}):[]} function publishStats(action");
                        middlewareContent = middlewareContent.Replace("stats.warnings || []", "formatErrors(stats.warnings), //patched by the init script");
                        middlewareContent = middlewareContent.Replace("stats.errors || []", "formatErrors(stats.errors), //patched by the init script");
                        File.WriteAllText(middlewarePath, middlewareContent);
                        File.WriteAllText(pathDat, "ok");
                    }
                }
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

        private class WebpackDevServerArgs
        {
            public string webpackConfigPath { get; set; }
            public WebpackDevMiddlewareOptions suppliedOptions { get; set; }
            public bool understandsMultiplePublicPaths { get; set; }
            public string hotModuleReplacementEndpointUrl { get; set; }

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