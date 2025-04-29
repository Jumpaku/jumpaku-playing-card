using System.Collections.Generic;
using UnityEngine;

namespace App.Script.Shared.Api
{
    public class Session : ISession
    {
        private string _baseUrl;
        private string _authorization;

        public Dictionary<string, string> AddAuthorization(Dictionary<string, string> requestHeaders)
        {
            if (string.IsNullOrEmpty(_authorization))
            {
                return requestHeaders;
            }

            requestHeaders["Authorization"] = _authorization;
            return requestHeaders;
        }

        public void SetBaseUrl(string baseUrl)
        {
            _baseUrl = baseUrl;
        }

        public string GetBaseUrl()
        {
            return _baseUrl;
        }

        public void SetAuthorization(string token)
        {
            _authorization = $"Bearer {token}";
        }

        public void OnSend(string method, string url, Dictionary<string, string> headers, string body)
        {
            Debug.Log($"url={url}");
            Debug.Log($"requestHeaders={headers}");
            Debug.Log($"requestBody={body}");
        }

        public void OnReceive(long statusCode, Dictionary<string, string> headers, string body)
        {
            Debug.Log($"statusCode={statusCode}");
            Debug.Log($"responseHeaders={headers}");
            Debug.Log($"responseBody={body}");
        }
    }
}