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
using Newtonsoft.Json;
using ThisIsIt.Attributes;
using ThisIsIt.Overrides;


namespace ThisIsIt.Controllers
{
    public class DataController : Controller
    {
        [ExceptionFilter]
        public string SaveData(string keyName = "", string keyValue = "")
        {
            if (string.IsNullOrEmpty(keyName) || string.IsNullOrEmpty(keyValue))
            {
                return "Hey There";
            }
            else
            {
                var db = new ThisIsItEntities();
                db.DataList.Add(new DataList
                {
                    Flag = keyName,
                    Value = keyValue,
                });
                db.SaveChanges();
                return "Got It";
            }
        }

        public string GetData(string keyName = "")
        {
            var db = new ThisIsItEntities();
            var data = db.DataList.Where(i => i.Flag.Contains(keyName)).OrderByDescending(i => i.CreateTime).ToList();
            return JsonConvert.SerializeObject(data);
        }
    }
}