using Api_PB.V1_PB;
using Api_PB.V1_PB.App_PB.Room_PB;
using Api_PB.V1_PB.App_PB.Room_PB.RoomService_PB;
using App.Script.Shared.Api;
using Cysharp.Threading.Tasks;
using PBRoom = Api_PB.V1_PB.App_PB.Room_PB.Room;

namespace App.Script.Setting.Logic.Setting.Room
{
    public class SelectSeatExecutor
    {
        public class SelectSeatResult
        {
            public PBRoom Value;
            public bool IsError;
            public string ErrorTitle;
            public string ErrorMessage;
            public ErrorResponse ErrorResponse;
        }

        public async UniTask<SelectSeatResult> Execute(ISession session, string roomId, string seatId)
        {
            var selectResult = await session
                .Call(new RoomService.TakeSeat(new TakeSeatRequest { roomId = roomId, seatId = seatId }));
            if (selectResult.IsError)
            {
                return new SelectSeatResult
                {
                    IsError = selectResult.IsError,
                    ErrorTitle = selectResult.ErrorTitle,
                    ErrorMessage = selectResult.ErrorMessage,
                    ErrorResponse = selectResult.ErrorResponse,
                };
            }

            var r = await session
                .Call(new RoomService.Get(new GetRequest { roomId = roomId }));
            if (r.IsError)
            {
                return new SelectSeatResult
                {
                    IsError = r.IsError,
                    ErrorTitle = r.ErrorTitle,
                    ErrorMessage = r.ErrorMessage,
                    ErrorResponse = r.ErrorResponse,
                };
            }

            return new SelectSeatResult { Value = r.Value.room };
        }
    }
}