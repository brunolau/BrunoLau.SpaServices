﻿using Jering.Javascript.NodeJS;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
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
        /// <returns></returns>
        public static INodeJSService BuildNewInstance(IDictionary<string, string> environmentVariables)
        {
            var services = new ServiceCollection();
            services.AddNodeJS();
            ServiceProvider serviceProvider = services.BuildServiceProvider();

            if (environmentVariables != null)
            {
                services.Configure<NodeJSProcessOptions>(options => options.EnvironmentVariables = environmentVariables);
            }

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
            var hostEnv = serviceProvider.GetService<IHostingEnvironment>();
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
