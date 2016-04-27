using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection.Emit;
using System.Text;
using System.Web;
using System.Web.Mvc;
using ThisIsIt.Attributes;


namespace ThisIsIt.Controllers
{
    [ExceptionFilter]
    public class TestController : Controller
    {
        public AjaxResult Test(string str)
        {
            throw new Exception();
            return new AjaxResult();
        }

        public ActionResult Test2(string str)
        {
            throw new Exception();
            return View();
        }
    }
}