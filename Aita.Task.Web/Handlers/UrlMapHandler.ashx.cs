using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Text;

namespace Aita.Task.Web.Handlers
{
    /// <summary>
    /// Summary description for UrlMapHandler
    /// </summary>
    public class UrlMapHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            var url = HttpContext.Current.Request.QueryString["url"];

            using (var wc = new WebClient() { Encoding = Encoding.UTF8 })
            {
                var json = wc.DownloadString(url);
                context.Response.ContentType = "text/plain";
                context.Response.Write(json);
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}