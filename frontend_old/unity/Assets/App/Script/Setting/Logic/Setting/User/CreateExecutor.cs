using Api_PB.V1_PB;
using Api_PB.V1_PB.App_PB.User_PB;
using Api_PB.V1_PB.App_PB.User_PB.UserService_PB;
using App.Script.Shared.Api;
using Cysharp.Threading.Tasks;

namespace App.Script.Setting.Logic.Setting.User
{
    public class CreateExecutor
    {
        public class CreateResult
        {
            public string DisplayName;
            public string UserId;
            public bool IsError;
            public string ErrorTitle;
            public string ErrorMessage;
            public ErrorResponse ErrorResponse;
        }

        public async UniTask<CreateResult> Execute(ISession session, string displayName)
        {
            var createResult = await session.Create();
            if (createResult.IsError)
            {
                return new CreateResult
                {
                    IsError = createResult.IsError,
                    ErrorTitle = createResult.ErrorTitle,
                    ErrorMessage = createResult.ErrorMessage,
                    ErrorResponse = createResult.ErrorResponse,
                };
            }

            var r = await session.Call(new UserService.CreateUser(new CreateUserRequest
            {
                displayName = displayName,
            }));
            if (r.IsError)
            {
                return new CreateResult
                {
                    IsError = createResult.IsError,
                    ErrorTitle = createResult.ErrorTitle,
                    ErrorMessage = createResult.ErrorMessage,
                    ErrorResponse = createResult.ErrorResponse,
                };
            }

            return new CreateResult
            {
                DisplayName = r.Value.displayName,
                UserId = r.Value.userId,
            };
        }
    }
}