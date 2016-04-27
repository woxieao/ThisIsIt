using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace ThisIsIt
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "PicHandler",
                url: "{controller}/{action}/{id}",
                defaults: new {controller = "DrawPic", action = "UploadPic", id = UrlParameter.Optional}
                );
        }
    }
}