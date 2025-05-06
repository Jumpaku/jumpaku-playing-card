using Api_PB.V1_PB.App_PB.Authentication_PB;
using Cysharp.Threading.Tasks;

namespace App.Script.Shared.Api
{
    public interface ISession
    {
        public UniTask<CallResult<TOut>> Call<TOut>(ICaller<TOut> caller);

        public UniTask<CallResult<LogoutResponse>> Invalidate();

        public UniTask<CallResult<TemporaryRegisterLoginResponse>> Create();

        public UniTask<CallResult<RefreshResponse>> Refresh();
    }
}