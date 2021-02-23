using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace TestApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }


        public IActionResult Index()
        {
            return View();
        }

        [Route("fetchdata")]
        public IActionResult FetchData()
        {
            return View("~/Views/Home/Index.cshtml");
        }

        [Route("counter")]
        public IActionResult Counter()
        {
            return View("~/Views/Home/Index.cshtml");
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
