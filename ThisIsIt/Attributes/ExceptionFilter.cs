using System;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using ThisIsIt.Overrides;

namespace ThisIsIt.Attributes
{
    public class BaseController : Controller
    {
    }

    public class ExceptionFilter : HandleErrorAttribute
    {
        public override void OnException(ExceptionContext filterContext)
        {
            var ex = filterContext.Exception;
            if (ex is MsgException)
            {
                if (filterContext.Result is AjaxResult)
                {
                    filterContext.Result = new AjaxResult
                    {
                        Result = new AjaxData
                        {
                            Flag = false,
                            Msg = ex.Message
                        }
                    };
                }
                else
                {
                    filterContext.HttpContext.Response.Redirect(
                        $"/Error?page=500&errorMsg={HttpUtility.UrlEncode(ex.Message)}");
                }
            }
            else
            {
                if (filterContext.Result is AjaxResult)
                {
                    filterContext.Result = new AjaxResult
                    {
                        Result = new AjaxData
                        {
                            Flag = false,
                            Msg = "InternalServerError"
                        }
                    };
                }
                else
                {
                    filterContext.HttpContext.Response.StatusCode = (int) HttpStatusCode.InternalServerError;
                    filterContext.HttpContext.Response.Redirect("/Default/Error?page=500&errorMsg=InternalServerError");
                }
            }
            filterContext.ExceptionHandled = true;
            base.OnException(filterContext);
        }
    }

    public class AjaxData
    {
        public string Msg { get; set; }
        public string CallBackUrl { get; set; }
        public bool Flag { get; set; }
        public object Data { get; set; }
    }

    public partial class AjaxResult<T> : ActionResult
    {
        public T Result { get; set; }

        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));
            var response = context.HttpContext.Response;
            response.TrySkipIisCustomErrors = true;
            response.ContentType = "application/json";
            response.Write(JsonConvert.SerializeObject(Result, new JsonSerializerSettings()));
        }
    }

    public partial class AjaxResult : ActionResult
    {
        public AjaxData Result { get; set; }
        private readonly JsonSerializerSettings _jsonSerializerSettings;

        public AjaxResult()
        {
            Result = new AjaxData();
            _jsonSerializerSettings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore
            };
        }

        public AjaxResult(JsonSerializerSettings jsonSerializerSettings) : this()
        {
            _jsonSerializerSettings = jsonSerializerSettings ?? _jsonSerializerSettings;
        }


        public AjaxResult(object result, JsonSerializerSettings jsonSerializerSettings = null)
            : this(jsonSerializerSettings)
        {
            Result.Data = result;
        }

        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));
            var response = context.HttpContext.Response;
            response.TrySkipIisCustomErrors = true;
            response.ContentType = "application/json";
            response.Write(JsonConvert.SerializeObject(Result, new JsonSerializerSettings()));
        }
    }
}