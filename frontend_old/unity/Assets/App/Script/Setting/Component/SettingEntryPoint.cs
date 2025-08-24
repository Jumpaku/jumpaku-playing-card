using System;
using Api_PB.V1_PB.App_PB.User_PB;
using Api_PB.V1_PB.App_PB.User_PB.UserService_PB;
using App.Script.Shared;
using UnityEngine;

namespace App.Script.Setting.Component
{
    public class SettingEntryPoint : MonoBehaviour
    {
        public class InitData
        {
            public string ServerUrl;
            public string AccessToken;
            public string RefreshToken;
            public string UserId;
            public string DisplayName;
            public string RoomId;
        }

        public readonly InitData Data = new();

        public void SetRoomId(string roomId)
        {
            Data.RoomId = roomId;
        }

        public async void Awake()
        {
            var localData = new LocalData();
            var d = localData.Load();
            Data.ServerUrl = d.server.baseUrl;
            if (Data.ServerUrl == "")
            {
                return;
            }

            if (d.user.userId == "" || d.auth.accessToken == "" || d.auth.refreshToken == "")
            {
                return;
            }

            var c = new UserService.GetUser(new GetUserRequest { userId = d.user.userId });
            c.RequestHeaders["Authorization"] = $"Bearer {d.auth.accessToken}";
            var r = await c.Call(Data.ServerUrl);
            if (r.IsError)
            {
                return;
            }

            Data.AccessToken = d.auth.accessToken;
            Data.RefreshToken = d.auth.refreshToken;
            Data.UserId = d.user.userId;
            Data.DisplayName = r.Value.displayName;
        }

        private async void Start()
        {
            var v = GameObject.Find("SettingView").GetComponent<SettingView>();
            await v.Init(Data);
        }
    }
}