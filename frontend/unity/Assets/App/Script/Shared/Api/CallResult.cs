using Api_PB.V1_PB;
using UnityEngine.Networking;

namespace App.Script.Shared.Api
{
    public class CallResult<TResponse>
    {
        public TResponse Response;
        public UnityWebRequest.Result Result;
        public bool IsError => Result != UnityWebRequest.Result.Success;
        public string ErrorTitle;
        public string ErrorMessage;
        public ErrorResponse ErrorResponse;
    }
}