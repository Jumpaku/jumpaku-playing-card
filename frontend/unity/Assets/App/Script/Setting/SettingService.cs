using System;
using Api_PB.V1_PB.Health_PB.HealthService_PB;
using App.Script.Setting.Executor.Setting.User;
using App.Script.Shared;
using App.Script.Shared.Api;
using App.Script.Shared.Error;
using Cysharp.Threading.Tasks;
using UnityEngine;
using UnityEngine.Networking;
using Behaviour = App.Script.Shared.Error.Behaviour;

namespace App.Script.Setting
{
    public class SettingService
    {
        public interface IView
        {
            public void OnError(Behaviour behaviour, string title, string message);
            public void OnServerCheckDone();
            public void OnUserCreateDone(CreateExecutor.UserData userData);
        }

        private readonly IView _view;
        private readonly Session _session = new();

        public SettingService(IView view)
        {
            _view = view;
        }

        public async UniTask ServerCheck(string serverUrl)
        {
        }

        public async UniTask UserCreate(string serverUrl, string displayName)
        {
            _session.SetBaseUrl(serverUrl);
            var r = await new CreateExecutor().Execute(_session, displayName);
            if (r.IsError)
            {
                _view.OnError(Behaviour.DialogNotice, r.ErrorTitle, r.ErrorMessage);
            }
            else
            {
                _view.OnUserCreateDone(r.Value);
            }
        }
    }
}