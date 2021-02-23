using System.Threading;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Jering.Javascript.NodeJS;

namespace BrunoLau.SpaServices.Prerendering
{
    /// <summary>
    /// Default implementation of a DI service that provides convenient access to
    /// server-side prerendering APIs. This is an alternative to prerendering via
    /// the asp-prerender-module tag helper.
    /// </summary>
    public class DefaultSpaPrerenderer : ISpaPrerenderer
    {
        private readonly string _applicationBasePath;
        private readonly CancellationToken _applicationStoppingToken;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly INodeJSService _nodeServices;

        public DefaultSpaPrerenderer(
            INodeJSService nodeServices,
            IApplicationLifetime applicationLifetime,
            IHostingEnvironment hostingEnvironment,
            IHttpContextAccessor httpContextAccessor)
        {
            _applicationBasePath = hostingEnvironment.ContentRootPath;
            _applicationStoppingToken = applicationLifetime.ApplicationStopping;
            _httpContextAccessor = httpContextAccessor;
            _nodeServices = nodeServices;
        }

        public Task<RenderToStringResult> RenderToString(
            string moduleName,
            string exportName = null,
            object customDataParameter = null,
            int timeoutMilliseconds = default(int))
        {
            return Prerenderer.RenderToString(
                _applicationBasePath,
                _nodeServices,
                _applicationStoppingToken,
                new JavaScriptModuleExport(moduleName) { ExportName = exportName },
                _httpContextAccessor.HttpContext,
                customDataParameter,
                timeoutMilliseconds);
        }
    }
}
