using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace ThisIsIt.Models
{
    public class MyJson
    {
        public JsonResult Result;

        public MyJson()
        {
            Result = new JsonResult
            {
                ContentEncoding = Encoding.UTF8,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                MaxJsonLength = int.MaxValue,
                Data = new
                {
                    flag = true,
                    msg = "success"
                }
            };
        }
    }
}