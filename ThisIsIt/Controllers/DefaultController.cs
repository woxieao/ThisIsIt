using System.Web.Mvc;

namespace ThisIsIt.Controllers
{
    public class DefaultController : Controller
    {
        public ActionResult Error(string page = "404", string errorMsg = "Page Not Found")
        {
            return View("ErrorPage/" + page, null, errorMsg);
        }
    }
}