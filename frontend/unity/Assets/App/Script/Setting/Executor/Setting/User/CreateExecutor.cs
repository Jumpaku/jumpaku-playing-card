using Api_PB.V1_PB;
using Api_PB.V1_PB.App_PB.Authentication_PB;
using Api_PB.V1_PB.App_PB.Authentication_PB.AuthenticationService_PB;
using Api_PB.V1_PB.App_PB.User_PB;
using Api_PB.V1_PB.App_PB.User_PB.UserService_PB;
using App.Script.Shared;
using App.Script.Shared.Api;
using Cysharp.Threading.Tasks;
using UnityEngine.Networking;
using Random = UnityEngine.Random;

namespace App.Script.Setting.Executor.Setting.User
{
    public class CreateExecutor
    {
        public class UserData
        {
            public string DisplayName;
            public string UserId;
            public string AccessToken;
            public string RefreshToken;
        }

        public async UniTask<Result<UserData>> Execute(Session session, string displayName)
        {
            string accessToken;
            string refreshToken;
            {
                var r = await AuthenticationService.TemporaryRegisterLogin(session, new TemporaryRegisterLoginRequest
                {
                    clientType = ClientType_String.Mobile,
                });
                if (r.IsError)
                {
                    return Result<UserData>.Error(r.ErrorTitle, r.errorMessage);
                }

                accessToken = r.responseBody.accessToken;
                refreshToken = r.responseBody.refreshToken;
            }
            {
                session.SetAuthorization(accessToken);
                var r = await UserService.CreateUser(session, new CreateUserRequest
                {
                    displayName = displayName,
                });

                return Result<UserData>.Ok(new UserData
                {
                    DisplayName = displayName,
                    UserId = r.responseBody.userId,
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                });
            }
        }
    }
}