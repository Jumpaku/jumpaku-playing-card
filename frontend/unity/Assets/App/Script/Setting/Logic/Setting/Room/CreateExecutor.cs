using Api_PB.V1_PB;
using Api_PB.V1_PB.App_PB.Room_PB;
using Api_PB.V1_PB.App_PB.Room_PB.RoomService_PB;
using App.Script.Shared.Api;
using Cysharp.Threading.Tasks;

namespace App.Script.Setting.Logic.Setting.Room
{
    public class CreateExecutor
    {
        public class CreateResult
        {
            public CreateResponse Value;
            public bool IsError;
            public string ErrorTitle;
            public string ErrorMessage;
            public ErrorResponse ErrorResponse;
        }

        public async UniTask<CreateResult> Execute(ISession session, string roomName, long seatCount)
        {
            var r = await session.Call(new RoomService.Create(new CreateRequest
            {
                roomName = roomName,
                seatCount = seatCount,
            }));
            if (r.IsError)
            {
                return new CreateResult
                {
                    IsError = r.IsError,
                    ErrorTitle = r.ErrorTitle,
                    ErrorMessage = r.ErrorMessage,
                    ErrorResponse = r.ErrorResponse,
                };
            }

            return new CreateResult { Value = r.Value };
        }
    }
}