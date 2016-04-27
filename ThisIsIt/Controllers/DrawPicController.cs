using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ThisIsIt.Models;
using static ThisIsIt.Core.Common;
using static ThisIsIt.Core.PicHandler;
using static ThisIsIt.Core.CookieHandler;
using static Common.CacheHandler;


namespace ThisIsIt.Controllers
{
    public class DrawPicController : Controller
    {
        private static readonly List<string> FileSuffixLimitList = new List<string>
        {
            "png",
            "gif",
            "bmp",
            "jpg",
            "jpge",
            "ico"
        };


        private string SaveFile(HttpPostedFileBase file)
        {
            if (file == null || file.ContentLength == 0)
            {
                throw new Exception("文件不能为空");
            }
            if (file.ContentLength > Config.UploadPicMaxSize)
            {
                throw new Exception("文件过长");
            }
            var fileSuffix = file.FileName.Substring(file.FileName.LastIndexOf(".", StringComparison.Ordinal)).ToLower();
            var legalFile = FileSuffixLimitList.Any(fileSuffixLimit => "." + fileSuffixLimit == fileSuffix);
            if (!legalFile)
            {
                throw new Exception("文件类型不合法");
            }
            var fileName =
                $"{Guid.NewGuid().ToString("n")}{fileSuffix}";
            var filePath = $"/{Config.PicFileSavePath}/{fileName}";
            var fileRealPath = Server.MapPath($"~{filePath}");
            CheckFilePathIsExist(fileRealPath);
            file.SaveAs(fileRealPath);
            return filePath;
        }

        public ActionResult Index()
        {
            return View("UploadPic");
        }


        public ActionResult UploadFile(HttpPostedFileBase file, string createrName = "")
        {
            try
            {
                createrName = string.IsNullOrEmpty(createrName) ? GetUserName() : createrName;
                SetUserName(createrName);
                var picFilePath = SaveFile(file);
                int picId;
                using (var db = new ThisIsItEntities())
                {
                    var pic = new PicList
                    {
                        PicFilePath = picFilePath,
                        CreaterName = createrName,
                        CreateTime = DateTime.Now,
                        LastUseTime = DateTime.Now
                    };
                    db.PicList.Add(pic);
                    db.SaveChanges();
                    picId = pic.PicId;
                }
                Response.Redirect($"ViewPic?picId={picId}");
                return View("ViewPic");
            }
            catch (Exception ex)
            {
                return View("UploadPic", ex);
            }
        }

        public ActionResult ViewPic(int picId = 0, string content = "SaySomething!")
        {
            var pic = GetPic(picId);
            ViewBag.PicFilePath = pic.PicFilePath;
            ViewBag.PicId = pic.PicId;
            ViewBag.Content = content;
            return View("ViewPic");
        }

        public ActionResult UploadPic()
        {
            return View();
        }

        public ActionResult PicList(string createrName = "")
        {
            var picList = GetPicList(createrName);
            return View(picList);
        }

        public string DrawPic(int picId = 0, string content = DefaultWords, int showPostion = -1,
            bool whiteBackground = false)
        {
            try
            {
                var defaultPicFilePath = Config.DefaultPicFilePath;
                string picFilePath = Server.MapPath($"~{defaultPicFilePath}");
                using (var db = new ThisIsItEntities())
                {
                    var pic = (from a in db.PicList
                        where a.PicId == picId
                        select a).FirstOrDefault();
                    if (pic != null)
                    {
                        pic.LastUseTime = DateTime.Now;
                        picFilePath = Server.MapPath($"~{pic.PicFilePath}");
                    }
                }
                var image = GetCache(DrawPicture, picFilePath, content, showPostion, whiteBackground);
                using (MemoryStream ms = new MemoryStream())
                {
                    image.Save(ms, ImageFormat.Gif);
                    Response.ClearContent();
                    Response.ContentType = "image/Gif";
                    Response.BinaryWrite(ms.ToArray());
                    //image.Dispose();
                    ms.Dispose();
                }
                return string.Empty;
            }
            catch (Exception ex)
            {
                return $"绘制文字时出错:{ex.Message}";
            }
        }

        public ActionResult ModifyLog()
        {
            return View();
        }

        public ActionResult About()
        {
            return View();
        }

        public string CacheTest()
        {
            return null;
        }

        public string Test()
        {
            var db = new ThisIsItEntities();

            var test = db.PicList.Single(i => i.PicId == 4);
            test.PicId = 3;
            db.SaveChanges();
            GetCache(CacheTest);
            var str = "";
            FontFamily[] ffArray = FontFamily.Families;
            foreach (FontFamily ff in ffArray)
            {
                str += ff.Name + "|";
                //Add ff.Name to your drop-down list
            }
            return str;
        }
    }
}