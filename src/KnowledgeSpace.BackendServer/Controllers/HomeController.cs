﻿using System.Diagnostics;
using KnowledgeSpace.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace KnowledgeSpace.BackendServer.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public IActionResult Privacy()
        {
            throw new System.NotImplementedException();
        }
    }
}