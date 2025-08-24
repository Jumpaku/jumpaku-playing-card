using Api_PB.V1_PB;
using Api_PB.V1_PB.App_PB.Room_PB;
using Api_PB.V1_PB.App_PB.Room_PB.RoomService_PB;
using App.Script.Shared.Api;
using Cysharp.Threading.Tasks;

namespace App.Script.Setting.Logic.Setting.Room
{
    public class EnterExecutor
    {
        public class EnterResult
        {
            public EnterResponse Value;
            public bool IsError;
            public string ErrorTitle;
            public string ErrorMessage;
            public ErrorResponse ErrorResponse;
        }

        public async UniTask<EnterResult> Execute(ISession session, string roomId)
        {
            var r = await session.Call(new RoomService.Enter(new EnterRequest()
            {
                roomId = roomId
            }));
            if (r.IsError)
            {
                return new EnterResult
                {
                    IsError = r.IsError,
                    ErrorTitle = r.ErrorTitle,
                    ErrorMessage = r.ErrorMessage,
                    ErrorResponse = r.ErrorResponse,
                };
            }

            return new EnterResult { Value = r.Value };
        }
    }
}