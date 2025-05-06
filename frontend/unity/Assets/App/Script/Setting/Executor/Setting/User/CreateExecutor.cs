using Api_PB.V1_PB.App_PB.User_PB;
using Api_PB.V1_PB.App_PB.User_PB.UserService_PB;
using App.Script.Shared;
using App.Script.Shared.Api;
using Cysharp.Threading.Tasks;

namespace App.Script.Setting.Executor.Setting.User
{
    public class CreateExecutor
    {
        public class UserData
        {
            public string DisplayName;
            public string UserId;
        }

        public async UniTask<Result<UserData>> Execute(ISession session, string displayName)
        {
            var createResult = await session.Create();
            if (createResult.IsError)
            {
                return Result<UserData>.Error(createResult.ErrorTitle, createResult.ErrorMessage);
            }

            var r = await session.Call(new UserService.CreateUser(new CreateUserRequest
            {
                displayName = displayName,
            }));
            if (r.IsError)
            {
                return Result<UserData>.Error(r.ErrorTitle, r.ErrorMessage);
            }

            return Result<UserData>.Ok(new UserData
            {
                DisplayName = displayName,
                UserId = r.Response.userId,
            });
        }
    }
}