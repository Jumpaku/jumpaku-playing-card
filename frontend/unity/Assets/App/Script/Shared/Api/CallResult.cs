using Api_PB.V1_PB;
using UnityEngine.Networking;

namespace App.Script.Shared.Api
{
    public class CallResult<TValue>
    {
        public TValue Value;
        public UnityWebRequest.Result Result;
        public bool IsError => Result != UnityWebRequest.Result.Success;
        public string ErrorTitle;
        public string ErrorMessage;
        public ErrorResponse ErrorResponse;

        public delegate T MapResponseFunc<T>(TValue r);

        public CallResult<T> MapResponse<T>(MapResponseFunc<T> f = null)
        {
            return IsError
                ? new CallResult<T>
                {
                    Result = Result,
                    ErrorTitle = ErrorTitle,
                    ErrorMessage = ErrorMessage,
                    ErrorResponse = ErrorResponse,
                }
                : new CallResult<T>
                {
                    Result = Result,
                    Value = f(Value)
                };
        }
    }
}