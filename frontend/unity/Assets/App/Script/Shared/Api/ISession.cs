using Api_PB.V1_PB.App_PB.Authentication_PB;
using App.Script.Lib;
using Cysharp.Threading.Tasks;

namespace App.Script.Shared.Api
{
    public interface ISession
    {
        public UniTask<CallResult<TOut>> Call<TOut>(ICaller<TOut> caller);

        public UniTask<CallResult<Unit>> Invalidate();

        public UniTask<CallResult<TokenData>> Create();

        public UniTask<CallResult<TokenData>> Refresh();
    }
}