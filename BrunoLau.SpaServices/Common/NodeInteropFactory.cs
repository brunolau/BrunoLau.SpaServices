using Jering.Javascript.NodeJS;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Text;

namespace BrunoLau.SpaServices.Common
{
    public static class NodeInteropFactory
    {
        /// <summary>
        /// Obtains INodeJSService instance from the service provider
        /// </summary>
        /// <param name="serviceProvider"></param>
        /// <returns></returns>
        public static INodeJSService GetInstance(IServiceProvider serviceProvider)
        {
            INodeJSService retVal;
            try
            {
                retVal = serviceProvider.GetService<INodeJSService>();
            }
            catch (Exception)
            {
                retVal = null;
            }

            return retVal;
        }

        /// <summary>
        /// Builds new INodeJSService instance independent of the app services container
        /// </summary>
        /// <param name="environmentVariables"></param>
        /// <param name="projectPath"></param>
        /// <returns></returns>
        public static INodeJSService BuildNewInstance(IDictionary<string, string> environmentVariables, string projectPath)
        {
            var services = new ServiceCollection();
            services.AddNodeJS();

            services.Configure<NodeJSProcessOptions>(options =>
            {
               if (environmentVariables != null)
                  options.EnvironmentVariables = environmentVariables;

               if (!string.IsNullOrWhiteSpace(projectPath))
                  options.ProjectPath = projectPath;
            });

         
            ServiceProvider serviceProvider = services.BuildServiceProvider();
            return serviceProvider.GetRequiredService<INodeJSService>();
        }

        /// <summary>
        /// Builds new INodeJSService instance independent of the app services container
        /// </summary>
        /// <param name="serviceProvider"></param>
        /// <returns></returns>
        public static INodeJSService BuildNewInstance(IServiceProvider serviceProvider)
        {
            Dictionary<string, string> environmentVariables = new Dictionary<string, string>();
            var hostEnv = serviceProvider.GetService<IHostEnvironment>();
            if (hostEnv != null)
            {
                environmentVariables["NODE_ENV"] = hostEnv.IsDevelopment() ? "development" : "production"; // De-facto standard values for Node
            }

            var services = new ServiceCollection();
            services.AddNodeJS();
            ServiceProvider innerProvider = services.BuildServiceProvider();
            services.Configure<NodeJSProcessOptions>(options => options.EnvironmentVariables = environmentVariables);
            return serviceProvider.GetRequiredService<INodeJSService>();
        }
    }
}
