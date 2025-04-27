using App.Script.Shared.Dialog;
using UnityEngine;

namespace App.Script.Setting
{
    public class SettingController : MonoBehaviour
    {
        public void OnClickServerCheck()
        {
            Debug.Log("OnClickServerCheck");
        }

        public void OnClickUserCreate()
        {
            Debug.Log("OnClickUserCreate");
        }

        public void OnClickUserUpdate()
        {
            Debug.Log("OnClickUserUpdate");
        }

        public void OnClickRoomCreate()
        {
            Debug.Log("OnClickRoomCreate");
        }

        public void OnClickRoomEnter()
        {
            Debug.Log("OnClickRoomEnter");
        }

        public void OnClickSeatStartPlay()
        {
            Debug.Log("OnClickSeatStartPlay");
            Dialog.Instance.Open("Title", "Message", "Cancel", "Confirm",
                () => { Dialog.Instance.Close(); },
                () => { Dialog.Instance.Close(); });
        }

        public void OnClickSeatSelectSeat(int index)
        {
            Debug.Log($"OnClickSeatSelectSeat({index})");
        }

        public void OnClickSeatLeaveSeat(int index)
        {
            Debug.Log($"OnClickSeatLeaveSeat({index})");
        }
    }
}