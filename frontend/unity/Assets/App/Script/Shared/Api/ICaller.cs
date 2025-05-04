using System.Collections.Generic;
using Cysharp.Threading.Tasks;
using UnityEngine.Networking;

namespace App.Script.Shared.Api
{
    public interface ICaller
    {
        public Dictionary<string, string> RequestHeaders { get; }
        public string RequestUrl { get; }
        public string RequestBody { get; }
        public UnityWebRequest.Result CallResult { get; }
        public Dictionary<string, string> ResponseHeaders { get; }
        public string ResponseCode { get; }
        public string ResponseBody { get; }
        public UniTask<TOut> Call<TOut>(string baseUrl);
    }

    public class CallSession
    {
        
    }
}