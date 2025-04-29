using System.Collections.Generic;

namespace App.Script.Shared.Api
{
    public interface ISession
    {
        public Dictionary<string, string> AddAuthorization(Dictionary<string, string> requestHeaders);
        public string GetBaseUrl();

        public void OnSend(string method, string url, Dictionary<string, string> headers, string body);

        public void OnReceive(long statusCode, Dictionary<string, string> headers, string body);
    }
}