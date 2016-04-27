using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace ThisIsIt.Core
{
    public class CookieHandler
    {
        public static readonly string CookieUserName = "Username";

        public const string DefaultCreaterName = "Guest";


        public static void SetCookie(string keyName, string keyValue, int expiryDays)
        {
            var cookie = new HttpCookie(keyName, keyValue)
            {
                Expires = DateTime.Now.AddDays(expiryDays)
            };
            HttpContext.Current.Response.Cookies.Set(cookie);
        }

        public static string GetCookie(string keyName)
        {
            return HttpContext.Current.Response.Cookies[keyName] != null
                ? HttpContext.Current.Response.Cookies[keyName].Value
                : string.Empty;
        }

        public static void DeleteCookie(string keyName)
        {
            if (HttpContext.Current.Response.Cookies[keyName] != null)
            {
                HttpContext.Current.Response.Cookies[keyName].Expires = DateTime.Now.AddDays(-1);
            }
        }

        public static void SetUserName(string userName)
        {
            userName = string.IsNullOrEmpty(userName) ? DefaultCreaterName : userName;
            SetCookie(CookieUserName, userName, 9999);
        }

        public static string GetUserName()
        {
            return GetCookie(CookieUserName);
        }
    }
}