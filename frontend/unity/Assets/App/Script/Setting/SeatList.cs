using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace App.Script.Setting
{
    public class SeatList : MonoBehaviour
    {
        private readonly List<GameObject> _seatList = new();

        public static SeatList Get() => GameObject.Find("SeatList").GetComponent<SeatList>();

        void Start()
        {
            Init();
        }

        void Init()
        {
            var controller = GameObject.Find("SettingController").GetComponent<SettingController>();
            for (int i = 0; i < transform.childCount; i++)
            {
                var index = i;
                var seat = transform.GetChild(i);
                seat.Find("SelectButton").GetComponent<Button>()
                    .onClick.AddListener(() => controller.OnClickSeatSelectSeat(index));
                seat.Find("LeaveButton").GetComponent<Button>()
                    .onClick.AddListener(() => controller.OnClickSeatLeaveSeat(index));
                _seatList.Add(seat.gameObject);
                PrepareSeats(0);
            }
        }

        public void PrepareSeats(int seatCount)
        {
            for (int i = 0; i < _seatList.Count; i++)
            {
                _seatList[i].SetActive(i < seatCount);
            }
        }
    }
}