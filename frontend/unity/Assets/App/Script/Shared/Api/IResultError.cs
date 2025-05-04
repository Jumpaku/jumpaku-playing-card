using Api_PB.V1_PB;
using UnityEngine.Networking;

namespace App.Script.Shared.Api
{
    public interface IResultError
    {
        public UnityWebRequest.Result ErrorKind { get; }
        public bool IsError { get; }
        public string ErrorTitle { get; }
        public string ErrorMessage { get; }
        public ErrorResponse ErrorDetail { get; }
    }
}