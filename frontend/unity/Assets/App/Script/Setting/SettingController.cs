using App.Script.Shared.Dialog;
using TMPro;
using UnityEngine;

namespace App.Script.Setting
{
    public class SettingController : MonoBehaviour
    {

        private TMP_InputField _serverUrlInput;
        private TMP_InputField _displayNameInput;

        private void Start()
        {
            Init();
        }

        public void Init()
        {
            _serverUrlInput = GameObject.Find("ServerUrlInput").GetComponent<TMP_InputField>();
            _displayNameInput = GameObject.Find("DisplayNameInput").GetComponent<TMP_InputField>();
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
                _ => { Dialog.Instance.Close(); });
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