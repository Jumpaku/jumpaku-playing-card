using System.Linq;
using Api_PB.V1_PB;
using Api_PB.V1_PB.App_PB.Authentication_PB;
using Api_PB.V1_PB.App_PB.Authentication_PB.AuthenticationService_PB;
using Api_PB.V1_PB.ErrorResponse_PB;
using App.Script.Lib;
using App.Script.Lib.Reference;
using App.Script.Shared;
using App.Script.Shared.Api;
using Cysharp.Threading.Tasks;
using UnityEngine;
using UnityEngine.Networking;

namespace App.Script.Setting.Component
{
    class Session : ISession
    {
        public IReadonlyReference<string> BaseUrl;
        public IReference<string> AccessToken;
        public IReference<string> RefreshToken;

        public async UniTask<CallResult<TOut>> Call<TOut>(ICaller<TOut> caller)
        {
            caller.RequestHeaders["Authorization"] = $"Bearer {AccessToken.Value}";

            _logRequest(caller);
            var r = await caller.Call(BaseUrl.Value);
            _logResponse(caller);

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

                caller.RequestHeaders["Authorization"] = $"Bearer {AccessToken.Value}";
                r = await caller.Call(BaseUrl.Value);
            }

            return r;
        }

        public async UniTask<CallResult<Unit>> Invalidate()
        {
            var caller = new AuthenticationService.Logout(new LogoutRequest());
            caller.RequestHeaders["Authorization"] = $"Bearer {AccessToken.Value}";
            _logRequest(caller);
            var r = await caller.Call(BaseUrl.Value);
            _logResponse(caller);
            if (r.IsError)
            {
                return r.MapResponse<Unit>();
            }

            AccessToken.Value = "";
            RefreshToken.Value = "";

            return r.MapResponse(_ => Unit.Instance);
        }

        public async UniTask<CallResult<TokenData>> Create()
        {
            var caller = new AuthenticationService.TemporaryRegisterLogin(new TemporaryRegisterLoginRequest
            {
                clientType = ClientType_String.Mobile
            });

            _logRequest(caller);
            var r = await caller.Call(BaseUrl.Value);
            _logResponse(caller);
            if (r.IsError)
            {
                return r.MapResponse<TokenData>();
            }

            AccessToken.Value = r.Value.accessToken;
            RefreshToken.Value = r.Value.refreshToken;

            return r.MapResponse(_ => new TokenData
            {
                AccessToken = r.Value.accessToken,
                RefreshToken = r.Value.refreshToken
            });
        }

        public async UniTask<CallResult<TokenData>> Refresh()
        {
            var caller =
                new AuthenticationService.Refresh(new RefreshRequest { clientType = ClientType_String.Mobile });
            caller.RequestHeaders["Authorization"] = $"Bearer {RefreshToken.Value}";

            _logRequest(caller);
            var r = await caller.Call(BaseUrl.Value);
            _logResponse(caller);
            if (r.IsError)
            {
                return r.MapResponse<TokenData>();
            }

            return r.MapResponse(_ => new TokenData
            {
                AccessToken = r.Value.accessToken,
                RefreshToken = r.Value.refreshToken
            });
        }

        private void _logRequest<TOut>(ICaller<TOut> caller)
        {
            var s = caller.RequestHeaders.ToList().Select(e => $"{e.Key}: {e.Value}");
            Debug.Log(
                $"{caller.Method}: {caller.RequestUrl(BaseUrl.Value)}\n{caller.RequestBody}\n{string.Join("\n", s.ToArray())}");
        }

        private void _logResponse<TOut>(ICaller<TOut> caller)
        {
            var s = caller.ResponseHeaders.ToList().Select(e => $"{e.Key}: {e.Value}");
            Debug.Log(
                $"{caller.ResponseCode}\n{caller.ResponseBody}\n{string.Join("\n", s.ToArray())}");
        }
    }

    public class SessionManager
    {
        public class TokenResult
        {
            public string AccessToken;
            public string RefreshToken;
            public bool IsError;
            public string ErrorTitle;
            public string ErrorMessage;
            public ErrorResponse ErrorResponse;
        }

        public class InvalidateResult
        {
            public bool IsError;
            public string ErrorTitle;
            public string ErrorMessage;
            public ErrorResponse ErrorResponse;
        }

        public readonly IReference<string> AccessToken = new ValueReference<string>("");
        public readonly IReference<string> RefreshToken = new ValueReference<string>("");
        private readonly IReadonlyReference<string> _baseUrl;
        public bool Available => _baseUrl != null && _baseUrl.Value != "";

        public ISession Session => new Session
        {
            BaseUrl = _baseUrl,
            AccessToken = AccessToken,
            RefreshToken = RefreshToken,
        };

        public SessionManager(IReadonlyReference<string> baseUrl)
        {
            _baseUrl = baseUrl;
        }

        private readonly Handler<TokenResult> _onRefresh = new();
        public IAddHandler<TokenResult> OnRefresh => _onRefresh;
        private readonly Handler<TokenResult> _onCreate = new();
        public IAddHandler<TokenResult> OnCreate => _onCreate;
        private readonly Handler<InvalidateResult> _onInvalidate = new();
        public IAddHandler<InvalidateResult> OnInvalidate => _onInvalidate;

        public async UniTask<TokenResult> Refresh()
        {
            var r = await Session.Refresh();
            var tokenResult = r.IsError
                ? new TokenResult
                {
                    IsError = true,
                    ErrorTitle = r.ErrorTitle,
                    ErrorMessage = r.ErrorMessage,
                    ErrorResponse = r.ErrorResponse,
                }
                : new TokenResult
                {
                    AccessToken = r.Value.AccessToken,
                    RefreshToken = r.Value.RefreshToken,
                };
            await _onRefresh.Handle(tokenResult);
            return tokenResult;
        }

        public async UniTask<TokenResult> Create()
        {
            var r = await Session.Create();
            var tokenResult = r.IsError
                ? new TokenResult
                {
                    IsError = true,
                    ErrorTitle = r.ErrorTitle,
                    ErrorMessage = r.ErrorMessage,
                    ErrorResponse = r.ErrorResponse,
                }
                : new TokenResult
                {
                    AccessToken = r.Value.AccessToken,
                    RefreshToken = r.Value.RefreshToken,
                };
            await _onCreate.Handle(tokenResult);
            return tokenResult;
        }

        public async UniTask<InvalidateResult> Invalidate()
        {
            var r = await Session.Invalidate();
            var invalidateResult = r.IsError
                ? new InvalidateResult
                {
                    IsError = true,
                    ErrorTitle = r.ErrorTitle,
                    ErrorMessage = r.ErrorMessage,
                    ErrorResponse = r.ErrorResponse,
                }
                : new InvalidateResult { };
            await _onInvalidate.Handle(invalidateResult);
            return invalidateResult;
        }
    }
}