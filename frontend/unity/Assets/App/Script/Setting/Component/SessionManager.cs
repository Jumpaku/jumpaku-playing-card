using Api_PB.V1_PB;
using Api_PB.V1_PB.App_PB.Authentication_PB;
using Api_PB.V1_PB.App_PB.Authentication_PB.AuthenticationService_PB;
using Api_PB.V1_PB.ErrorResponse_PB;
using App.Script.Lib;
using App.Script.Lib.Reference;
using App.Script.Shared;
using App.Script.Shared.Api;
using Cysharp.Threading.Tasks;
using UnityEngine.Networking;

namespace App.Script.Setting.Component
{
    class Session : ISession
    {
        public IReadonlyReference<string> BaseUrl;
        public ValueReference<string> AccessToken;
        public ValueReference<string> RefreshToken;

        public async UniTask<CallResult<TOut>> Call<TOut>(ICaller<TOut> caller)
        {
            caller.RequestHeaders.Add("Authorization", $"Bearer {AccessToken.Value}");
            var r = await caller.Call(BaseUrl.Value);
            if (r.Result == UnityWebRequest.Result.ProtocolError &&
                r.ErrorResponse.errorCode == ErrorCode_String.AccessTokenExpired)
            {
                var refreshResult = await Refresh();
                if (refreshResult.IsError)
                {
                    return new CallResult<TOut>
                    {
                        Result = refreshResult.Result,
                        ErrorTitle = refreshResult.ErrorTitle,
                        ErrorMessage = refreshResult.ErrorMessage,
                        ErrorResponse = refreshResult.ErrorResponse,
                    };
                }

                caller.RequestHeaders.Add("Authorization", $"Bearer {AccessToken.Value}");
                r = await caller.Call(BaseUrl.Value);
            }

            return r;
        }

        public async UniTask<CallResult<LogoutResponse>> Invalidate()
        {
            var caller = new AuthenticationService.Logout(new LogoutRequest());
            caller.RequestHeaders.Add("Authorization", $"Bearer {AccessToken.Value}");
            var r = await caller.Call(BaseUrl.Value);
            if (r.IsError)
            {
                return r;
            }

            AccessToken.Value = "";
            RefreshToken.Value = "";

            return r;
        }

        public async UniTask<CallResult<TemporaryRegisterLoginResponse>> Create()
        {
            var caller = new AuthenticationService.TemporaryRegisterLogin(new TemporaryRegisterLoginRequest
            {
                clientType = ClientType_String.Mobile
            });
            var r = await caller.Call(BaseUrl.Value);
            if (r.IsError)
            {
                return r;
            }

            AccessToken.Value = r.Response.accessToken;
            RefreshToken.Value = r.Response.refreshToken;

            return r;
        }

        public async UniTask<CallResult<RefreshResponse>> Refresh()
        {
            var caller = new AuthenticationService.Refresh(new RefreshRequest());
            caller.RequestHeaders.Add("Authorization", $"Bearer {RefreshToken.Value}");
            var r = await caller.Call(BaseUrl.Value);
            if (r.IsError)
            {
                return r;
            }

            AccessToken.Value = r.Response.accessToken;
            RefreshToken.Value = r.Response.refreshToken;

            return r;
        }
    }

    public class SessionManager
    {
        public class TokenData
        {
            public string AccessToken;
            public string RefreshToken;
        }

        private readonly ValueReference<string> _accessToken = new("");
        private readonly ValueReference<string> _refreshToken = new("");
        private readonly IReadonlyReference<string> _baseUrl;

        public ISession Session => new Session
        {
            BaseUrl = _baseUrl,
            AccessToken = _accessToken,
            RefreshToken = _refreshToken,
        };

        public SessionManager(IReadonlyReference<string> baseUrl)
        {
            _baseUrl = baseUrl;
        }

        private Handler<Result<TokenData>> _onRefresh = new();
        public IAddHandler<Result<TokenData>> OnRefresh => _onRefresh;
        private Handler<Result<TokenData>> _onCreate = new();
        public IAddHandler<Result<TokenData>> OnCreate => _onCreate;
        private Handler<Result<Unit>> _onInvalidate = new();
        public IAddHandler<Result<Unit>> OnInvalidate => _onInvalidate;

        public async UniTask<Result<TokenData>> Refresh()
        {
            var r = await Session.Refresh();
            var result = r.IsError
                ? Result<TokenData>.Error(r.ErrorTitle, r.ErrorMessage)
                : Result<TokenData>.Ok(new TokenData
                {
                    AccessToken = r.Response.accessToken,
                    RefreshToken = r.Response.refreshToken,
                });
            await _onRefresh.Handle(result);
            return result;
        }

        public async UniTask<Result<TokenData>> Create()
        {
            var r = await Session.Create();
            var result = r.IsError
                ? Result<TokenData>.Error(r.ErrorTitle, r.ErrorMessage)
                : Result<TokenData>.Ok(new TokenData
                {
                    AccessToken = r.Response.accessToken,
                    RefreshToken = r.Response.refreshToken,
                });
            await _onCreate.Handle(result);
            return result;
        }

        public async UniTask<Result<Unit>> Invalidate()
        {
            var r = await Session.Invalidate();
            var result = r.IsError ? Result<Unit>.Error(r.ErrorTitle, r.ErrorMessage) : Result<Unit>.Ok(Unit.Instance);
            await _onInvalidate.Handle(result);
            return result;
        }
    }
}