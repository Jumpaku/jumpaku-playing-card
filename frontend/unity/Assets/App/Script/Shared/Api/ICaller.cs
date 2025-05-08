using System.Collections.Generic;
using Cysharp.Threading.Tasks;
using UnityEngine.Networking;

namespace App.Script.Shared.Api
{
    public interface ICaller<TOut>
    {
        public Dictionary<string, string> RequestHeaders { get; }
        public string RequestUrl(string baseUrl);
        public string RequestBody { get; }
        public UnityWebRequest.Result CallResult { get; }
        public Dictionary<string, string> ResponseHeaders { get; }
        public long ResponseCode { get; }
        public string ResponseBody { get; }
        public UniTask<CallResult<TOut>> Call(string baseUrl);
    }
}