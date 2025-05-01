using Api_PB.V1_PB;
using Api_PB.V1_PB.App_PB.Authentication_PB;
using Api_PB.V1_PB.App_PB.Authentication_PB.AuthenticationService_PB;
using Api_PB.V1_PB.App_PB.User_PB;
using Api_PB.V1_PB.App_PB.User_PB.UserService_PB;
using App.Script.Shared.Api;
using Cysharp.Threading.Tasks;

namespace App.Script.Setting.Logic.User
{
    public class Create
    {
        public async UniTask<string> Do(Session session, string loginId, string password, string displayName)
        {
            await AuthenticationService.PasswordRegister(session, new PasswordRegisterRequest
            {
                loginId = loginId,
                password = password,
            });
            var tokens = await AuthenticationService.PasswordLogin(session, new PasswordLoginRequest
            {
                clientType = ClientType_String.Mobile,
                loginId = loginId,
                password = password,
            });

            session.SetAuthorization(tokens.responseBody.accessToken);

            var u = await UserService.CreateUser(session, new CreateUserRequest
            {
                displayName = displayName,
            });

            return u.responseBody.userId;
        }
    }
}