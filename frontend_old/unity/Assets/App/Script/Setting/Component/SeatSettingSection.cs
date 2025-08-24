using System.Collections.Generic;
using Api_PB.V1_PB.App_PB.Room_PB;
using App.Script.Lib;
using App.Script.Lib.Reference;
using App.Script.Setting.Logic.Setting.Room;
using App.Script.Shared;
using Cysharp.Threading.Tasks;
using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

namespace App.Script.Setting.Component
{
    public class SeatSettingSection : MonoBehaviour
    {
        private SessionManager _sessionManager;
        private IReadonlyReference<string> _userId;
        private IReadonlyReference<string> _roomId;
        private class Seat
        {
            public TMP_Text UserName;
            public GameObject SeatObject;
            public Button SelectButton;
            public Button LeaveButton;
            public string SeatId;
        }

        private readonly List<Seat> _seatList = new() { new(), new(), new(), new(), new(), new() };

        public void Init(
            SessionManager sessionManager,
            IReadonlyReference<string> userId,
            IReadonlyReference<string> roomId
        )
        {
            _sessionManager = sessionManager;

            _userId = userId;

            _roomId = roomId;

            var seatList = transform.Find("SeatSettingList");

            for (int i = 0; i < seatList.childCount; i++)
            {
                var index = i;
                var seat = seatList.GetChild(index);

                _seatList[i].LeaveButton = seat.Find("LeaveButton").GetComponent<Button>();
                _seatList[i].LeaveButton.onClick.AddListener(async () => await LeaveSeat(index));

                _seatList[i].SelectButton = seat.Find("SelectButton").GetComponent<Button>();
                _seatList[i].SelectButton.onClick.AddListener(async () => await SelectSeat(index));

                _seatList[i].UserName = seat.Find("UserNameLabel").GetComponent<TMP_Text>();

                _seatList[i].SeatObject = seat.gameObject;
                _seatList[i].SeatObject.SetActive(false);
            }
        }

        public void Prepare(List<RoomSeat> seatList)
        {
            Debug.Log("SeatSettingSection/Prepare");

            var activeSeatCount = seatList.Count;
            for (int i = 0; i < _seatList.Count; i++)
            {
                var s = _seatList[i];
                if (i >= activeSeatCount)
                {
                    s.SeatObject.SetActive(false);
                    continue;
                }

                s.SeatObject.SetActive(true);
                var memberExists = seatList[i].memberExists;
                s.UserName.text = memberExists ? seatList[i].member.userName : "User Name";
                s.SelectButton.interactable = !memberExists;
                s.LeaveButton.interactable = memberExists && seatList[i].member.userId == _userId.Value;
                s.SeatId = seatList[i].seatId;
            }
        }
        public async UniTask<SelectSeatExecutor.SelectSeatResult> SelectSeat(int seatIndex)
        {
            Debug.Log($"SeatSettingSection/SelectSeat({seatIndex})");
            var result =
                await new SelectSeatExecutor()
                    .Execute(_sessionManager.Session, _roomId.Value, _seatList[seatIndex].SeatId);

            if (!result.IsError)
            {
                Prepare(result.Value.seatList);
            }

            return result;
        }

        public async UniTask<LeaveSeatExecutor.LeaveSeatResult> LeaveSeat(int seatIndex)
        {
            Debug.Log($"SeatSettingSection/LeaveSeat({seatIndex})");
            var result =
                await new LeaveSeatExecutor()
                    .Execute(_sessionManager.Session, _roomId.Value, _seatList[seatIndex].SeatId);

            if (!result.IsError)
            {
                Prepare(result.Value.seatList);
            }

            return result;
        }
    }
}