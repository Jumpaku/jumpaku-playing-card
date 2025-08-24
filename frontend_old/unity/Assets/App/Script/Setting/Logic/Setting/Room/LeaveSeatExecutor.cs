using Api_PB.V1_PB;
using Api_PB.V1_PB.App_PB.Room_PB;
using Api_PB.V1_PB.App_PB.Room_PB.RoomService_PB;
using App.Script.Shared.Api;
using Cysharp.Threading.Tasks;
using PBRoom = Api_PB.V1_PB.App_PB.Room_PB.Room;

namespace App.Script.Setting.Logic.Setting.Room
{
    public class LeaveSeatExecutor
    {
        public class LeaveSeatResult
        {
            public PBRoom Value;
            public bool IsError;
            public string ErrorTitle;
            public string ErrorMessage;
            public ErrorResponse ErrorResponse;
        }

        public async UniTask<LeaveSeatResult> Execute(ISession session, string roomId, string seatId)
        {
            var leaveResult = await session
                .Call(new RoomService.LeaveSeat(new LeaveSeatRequest { roomId = roomId, seatId = seatId }));
            if (leaveResult.IsError)
            {
                return new LeaveSeatResult
                {
                    IsError = leaveResult.IsError,
                    ErrorTitle = leaveResult.ErrorTitle,
                    ErrorMessage = leaveResult.ErrorMessage,
                    ErrorResponse = leaveResult.ErrorResponse,
                };
            }

            var r = await session
                .Call(new RoomService.Get(new GetRequest { roomId = roomId }));
            if (r.IsError)
            {
                return new LeaveSeatResult
                {
                    IsError = r.IsError,
                    ErrorTitle = r.ErrorTitle,
                    ErrorMessage = r.ErrorMessage,
                    ErrorResponse = r.ErrorResponse,
                };
            }

            return new LeaveSeatResult { Value = r.Value.room };
        }
    }
}