using Api_PB.V1_PB;
using Api_PB.V1_PB.Health_PB;
using Api_PB.V1_PB.Health_PB.HealthService_PB;
using App.Script.Shared.Api;
using Cysharp.Threading.Tasks;

namespace App.Script.Setting.Logic.Setting.Server
{
    public class CheckExecutor
    {
        public class CheckResult
        {
            public bool IsError;
            public string ErrorTitle;
            public string ErrorMessage;
            public ErrorResponse ErrorResponse;
        }

        public async UniTask<CheckResult> Execute(ISession session)
        {
            var r = await session.Call(new HealthService.Check(new CheckRequest()));
            if (r.IsError)
            {
                return new CheckResult
                {
                    IsError = r.IsError,
                    ErrorTitle = r.ErrorTitle,
                    ErrorMessage = r.ErrorMessage,
                    ErrorResponse = r.ErrorResponse,
                };
            }

            return new CheckResult();
        }
    }
}