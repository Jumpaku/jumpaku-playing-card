using Api_PB.V1_PB.Health_PB;
using Api_PB.V1_PB.Health_PB.HealthService_PB;
using App.Script.Shared;
using App.Script.Shared.Api;
using Cysharp.Threading.Tasks;
using UnityEngine;
using UnityEngine.Networking;

namespace App.Script.Setting.Logic.Server
{
    public class Check
    {
        public async UniTask<Result<CheckResponse>> Do(Session session)
        {
            var r = await HealthService.Check(session, new CheckRequest());
            switch (r.result)
            {
                case UnityWebRequest.Result.Success:
                    return Result<CheckResponse>.Ok(r.responseBody);
                case UnityWebRequest.Result.ConnectionError:
                    return Result<CheckResponse>.Error("Network Error", r.errorMessage);
                default:
                    return Result<CheckResponse>.Error("Server Error", r.errorMessage);
            }
        }
    }
}