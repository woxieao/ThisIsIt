using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;

namespace ThisIsIt.Models
{
    public class Config
    {
        public static string PicFileSavePath { get; private set; } =
            WebConfigurationManager.AppSettings["PicFileSavePath"];

        public static long UploadPicMaxSize { get; private set; } =
            Convert.ToInt64(WebConfigurationManager.AppSettings["UploadPicMaxSize"]);

        public static string DefaultPicFilePath { get; private set; } =
            WebConfigurationManager.AppSettings["DefaultPicFilePath"];
    }
}