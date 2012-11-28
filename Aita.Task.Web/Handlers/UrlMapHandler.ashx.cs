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
        public void ProcessRequest(HttpContext context)
        {
            var url = HttpContext.Current.Request.QueryString["url"];
            var parameters = GetParameters(context.Request);

            Debug.WriteLine("----Parameters:");
            foreach (var parameter in parameters)
            {
                Debug.WriteLine(parameter.Key, parameter.Value);
            }

            var result = PostData(url, parameters);

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
            if (request.HttpMethod == "POST")
            {
                var json = GetClientPostData(request.InputStream);
                var serializer = new JavaScriptSerializer();
                var parameters = serializer.Deserialize<Dictionary<string, object>>(json);
                return parameters;
            }
            else
            {
                IDictionary<string, object> parameters = new Dictionary<string, object>();
                foreach (var key in request.Params.Keys)
                {
                    parameters.Add(key.ToString(), request.Params[key.ToString()]);
                }
                return parameters;
            }
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