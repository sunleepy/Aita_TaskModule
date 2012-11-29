using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Text;
using System.IO;
using System.Diagnostics;
using System.Web.Script.Serialization;

namespace Aita.Task.Web.Handlers
{
    /// <summary>
    /// Summary description for UrlMapHandler
    /// </summary>
    public class UrlMapHandler : IHttpHandler
    {
        private IDictionary<string, string> _urlDict = new Dictionary<string, string>();
        private string api = "https://taobao-tech-d2:9008";
        public UrlMapHandler()
        {
            _urlDict.Add("url_userInfo", string.Format("{0}/sys/userinfo", api));
            _urlDict.Add("url_findUser", string.Format("{0}/sys/autoprompt", api));
            _urlDict.Add("url_createTask", string.Format("{0}/EnterpriseTask/CreateTask", api));
            _urlDict.Add("url_updateTask", string.Format("{0}/EnterpriseTask/UpdateTask", api));
            _urlDict.Add("url_changeCompleted", string.Format("{0}/EnterpriseTask/ChangeCompleted", api));
            _urlDict.Add("url_changePriority", string.Format("{0}/EnterpriseTask/ChangePriority", api));
            _urlDict.Add("url_changeDueTime", string.Format("{0}/EnterpriseTask/ChangeDueTime", api));
            _urlDict.Add("url_taskInfo", string.Format("{0}/EnterpriseTask/TaskInfo", api));
            _urlDict.Add("url_getTasksByCreator", string.Format("{0}/EnterpriseTask/GetTasksByCreator", api));
            _urlDict.Add("url_getTasksByAssignee", string.Format("{0}/EnterpriseTask/GetTasksByAssignee", api));
            _urlDict.Add("url_getRelatedTasks", string.Format("{0}/EnterpriseTask/GetRelatedTasks", api));
        }

        public void ProcessRequest(HttpContext context)
        {
            var url = context.Request.QueryString["url"];
            var parameters = GetParameters(context.Request);

            Debug.WriteLine("----Parameters:");
            foreach (var parameter in parameters)
            {
                Debug.WriteLine(parameter.Key, parameter.Value);
            }

            var result = PostData(_urlDict[url], parameters);

            Debug.WriteLine("----Result:");
            Debug.Write(result);

            context.Response.ContentType = "text/plain";
            context.Response.Write(result);
        }

        /// <summary>
        /// Send a http post request to a given url with given data.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        private string PostData(string url, IDictionary<string, object> data)
        {
            string content = "";

            //send http post request.
            ServicePointManager.ServerCertificateValidationCallback = (srvPoint, certificate, chain, errors) => true;
            var request = HttpWebRequest.Create(url) as HttpWebRequest;
            request.Headers.Add(HttpRequestHeader.AcceptEncoding, "gzip,deflate");
            request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";

            //set post data
            var parameters = new StringBuilder();
            foreach (var item in data)
            {
                parameters.Append("&" + string.Format("{0}={1}", item.Key, item.Value != null ? HttpUtility.UrlEncode(item.Value.ToString()) : null));
            }
            var payload = Encoding.UTF8.GetBytes(parameters.ToString().Substring(1));
            request.ContentLength = payload.Length;

            using (var requestStream = request.GetRequestStream())
            {
                requestStream.Write(payload, 0, payload.Length);
                requestStream.Close();
            }

            //Send request
            var response = request.GetResponse() as HttpWebResponse;

            //read response into memory stream
            MemoryStream memoryStream;
            using (Stream responseStream = response.GetResponseStream())
            {
                memoryStream = new MemoryStream();

                byte[] buffer = new byte[1024];
                int byteCount;
                do
                {
                    byteCount = responseStream.Read(buffer, 0, buffer.Length);
                    memoryStream.Write(buffer, 0, byteCount);
                } while (byteCount > 0);
            }

            //get result content from memory stream.
            memoryStream.Seek(0, SeekOrigin.Begin);
            var encoding = Encoding.UTF8;
            var charset = response.CharacterSet;
            if (charset != null)
            {
                encoding = Encoding.GetEncoding(charset);
            }
            using (var streamReader = new StreamReader(memoryStream, encoding))
            {
                content = streamReader.ReadToEnd();
                streamReader.Close();
            }

            return content;
        }
        private IDictionary<string, object> GetParameters(HttpRequest request)
        {
            IDictionary<string, object> parameters = new Dictionary<string, object>();
            foreach (var key in request.Params.Keys)
            {
                parameters.Add(key.ToString(), request.Params[key.ToString()]);
            }
            return parameters;
        }
        private string GetClientPostData(Stream stream)
        {
            var content = string.Empty;
            stream.Seek(0, SeekOrigin.Begin);
            var encoding = Encoding.UTF8;
            using (var streamReader = new StreamReader(stream, encoding))
            {
                content = streamReader.ReadToEnd();
                streamReader.Close();
            }

            return content;
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