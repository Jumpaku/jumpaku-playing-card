using System.Collections.Generic;
using Api_PB.V1_PB.App_PB.Room_PB;
using App.Script.Lib.Reference;
using App.Script.Setting.Logic.Setting.Room;
using Cysharp.Threading.Tasks;
using TMPro;
using UnityEngine;
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
        }

        private List<Seat> _seatList = new List<Seat>()
        {
            new Seat(),
            new Seat(),
            new Seat(),
            new Seat(),
            new Seat(),
            new Seat()
        };

        public void Init(IReadonlyReference<string> userId, IReadonlyReference<string> roomId)
        {
            var seatList = transform.Find("SeatList");

            _userId = userId;

            _roomId = roomId;

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

            transform.Find("StartPlayButton").GetComponent<Button>()
                .onClick.AddListener(async () => await StartPlay());
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
            }
        }

        public async UniTask<EnterExecutor.EnterResult> StartPlay()
        {
            Debug.Log("SeatSettingSection/StartPlay");
            return new EnterExecutor.EnterResult();
        }

        public async UniTask<EnterExecutor.EnterResult> SelectSeat(int seatIndex)
        {
            Debug.Log("SeatSettingSection/SelectSeat");
            return new EnterExecutor.EnterResult();
        }

        public async UniTask<EnterExecutor.EnterResult> LeaveSeat(int seatIndex)
        {
            Debug.Log("SeatSettingSection/LeaveSeat");
            return new EnterExecutor.EnterResult();
        }
    }
}