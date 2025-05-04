using Api_PB.V1_PB.Health_PB;
using Api_PB.V1_PB.Health_PB.HealthService_PB;
using App.Script.Shared.Api;
using Cysharp.Threading.Tasks;

namespace App.Script.Setting.Executor.Setting.Server
{
    public class CheckExecutor
    {
        public class Result
        {
            public string titleText;
            public string messageText;
        }

        public async UniTask<Result> Execute(Session session)
        {
            var r = await HealthService.Check(session, new CheckRequest());
            if (r.IsError)
            {
                return new Result
                {
                    titleText = "Server check failed.",
                    messageText = $"{r.ErrorTitle}:\n    {r.ErrorMessage}",
                };
            }

            return new Result
            {
                titleText = "Server check succeeded.",
                messageText = "Server is valid.",
            };
        }
    }
}