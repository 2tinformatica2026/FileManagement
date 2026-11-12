using Microsoft.AspNetCore.Mvc;
using FileManagement.Models;
using System.Diagnostics;
namespace FileManagement.Controllers
{
    public class ServicesController : Controller
    {
        private readonly ILogger<ServicesController> _logger;
        private IStringLocalizer<ServicesController> _localizer;
        private IConfiguration _configuration;

        public ServicesController(ILogger<HomeController> logger, IStringLocalizer<HomeController> localizer, IConfiguration configuration)
        {
            _logger = logger;
            _localizer = localizer;
            _configuration = configuration;
        }


        
    }
}
