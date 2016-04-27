using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace ThisIsIt.Core
{
    public class Common
    {
        public static void LogToSql(string value, string flag = "[Default]")
        {
            using (var db = new ThisIsItEntities())
            {
                db.DataList.Add(new DataList
                {
                    Value = value,
                    Flag = flag
                });
            }
        }

        public static void CheckFilePathIsExist(string fileRealPath)
        {
            var fileInfo = new FileInfo(fileRealPath);
            if (fileInfo.Directory != null && !fileInfo.Directory.Exists)
            {
                fileInfo.Directory.Create();
            }
        }
    }
}