using System;
using UnityEngine;

namespace App.Script.Play.Component
{
    public class PlayEntryPoint : MonoBehaviour
    {
        private string _roomId;

        public void SetRoomId(string roomId)
        {
            _roomId = roomId;
        }

        void Awake()
        {
        }

        private void Start()
        {
        }
    }
}