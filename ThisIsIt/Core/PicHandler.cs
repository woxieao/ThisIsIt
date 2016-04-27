using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web;
using ThisIsIt.Models;

namespace ThisIsIt.Core
{
    public class PicHandler
    {
        public const string DefaultWords = "-By XA";

        public static PicList GetPic(int picId)
        {
            var db = new ThisIsItEntities();
            var pic = (from a in db.PicList where a.PicId == picId select a).FirstOrDefault();
            return pic ?? new PicList
            {
                PicId = 0,
                PicFilePath = Config.DefaultPicFilePath
            };
        }

        public static int GetPicCount()
        {
            var db = new ThisIsItEntities();
            return (from a in db.PicList select a).Count();
        }

        public static List<PicList> GetPicList(string createrName)
        {
            var db = new ThisIsItEntities();
            return
                (from a in db.PicList
                    where (a.CreaterName.Contains(createrName) || string.IsNullOrEmpty(createrName))
                    orderby a.LastUseTime descending
                    select a)
                    .ToList();
        }

        private static int GetFontSize(int imgHeight, int imgWidth, string content)
        {
            var fontSize = imgHeight/8;
            double areaSize = fontSize*imgWidth;
            var size = (int) Math.Sqrt(areaSize/content.Length);
            return size > fontSize ? fontSize : size;
        }

        private static List<string> GetWords(int fontSize, int width, string content)
        {
            var strList = new List<string>();
            int index = 0;
            var tempStr = string.Empty;
            for (var i = 0; i < content.Length; i++)
            {
                tempStr += content[i];
                if (fontSize*(++index + 1) >= width || i == content.Length - 1)
                {
                    strList.Add(tempStr);
                    tempStr = string.Empty;
                    index = 0;
                }
            }
            return strList;
        }

        public static Image DrawPicture(string picFilePath, string content , int showPostion = -1,
            bool whiteBackground = false)
        {
            content = string.IsNullOrEmpty(content ) ? DefaultWords:content;
            var image = new Bitmap(picFilePath);
            Graphics g = Graphics.FromImage(image);
            var fontSize = GetFontSize(image.Height, image.Width, content);
            var font = new Font("Arial", fontSize);
            var wrap = fontSize/3;
            fontSize += wrap;
            var brush = new SolidBrush(Color.Black);
            int yLocation;
            switch (showPostion)
            {
                case -1:
                {
                    yLocation = (image.Height*3/4) - fontSize;
                    break;
                }
                default:
                {
                    yLocation = showPostion;
                    break;
                }
            }
            var strList = GetWords(fontSize, image.Width, content);
            //no wrap
            for (var y = 0; y < strList.Count; y++)
            {
                var str = strList[y];
                for (var x = 0; x < str.Length; x++)
                {
                    var xP = x*fontSize;
                    var yP = yLocation + y*(fontSize - wrap);
                    g.DrawString(str[x].ToString(), font, brush, xP, yP);
                }
            }

            //var rf = new RectangleF(0, yLocation, image.Width, image.Height/4);
            //g.DrawString(content, font, brush, rf, new StringFormat
            //{
            //    //  FormatFlags = StringFormatFlags.NoWrap,
            //    Trimming = StringTrimming.None
            //});
            g.Dispose();
            return image;
        }
    }
}