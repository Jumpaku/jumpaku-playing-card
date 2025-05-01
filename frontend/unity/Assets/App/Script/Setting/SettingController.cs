using System;
using System.Collections;
using App.Script.Setting.Logic;
using App.Script.Shared.Dialog;
using Cysharp.Threading.Tasks;
using TMPro;
using UnityEngine;
using UnityEngine.Networking;

namespace App.Script.Setting
{
    public class SettingController : MonoBehaviour
    {
        private SettingService _service;

        private TMP_InputField _serverUrlInput;

        private void Start()
        {
            Init();
        }

        public void Init()
        {
            _service = new(new SettingView(Dialog.Instance));
            _serverUrlInput = GameObject.Find("ServerUrlInput").GetComponent<TMP_InputField>();
        }

        public void OnClickServerCheck()
        {
            Debug.Log("OnClickServerCheck");
            _service.ServerCheck(_serverUrlInput.text).Forget();
        }

        public void OnClickUserCreate()
        {
            Debug.Log("OnClickUserCreate");
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