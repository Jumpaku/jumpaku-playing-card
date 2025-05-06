using App.Script.Lib.Reference;
using App.Script.Setting.Component;
using App.Script.Setting.Handler.Setting.Server;
using App.Script.Shared;
using App.Script.Shared.Dialog;
using UnityEngine;

namespace App.Script.Setting
{
    public class SettingView : MonoBehaviour
    {
        private ServerSettingPanel _serverSettingPanel;
        private UserSettingPanel _userSettingPanel;
        private Dialog _dialog;
        private SessionManager _sessionManager;

        private void Start()
        {
            Init();
        }

        public void Init()
        {
            _sessionManager = new SessionManager(new FactoryReference<string>(() => _serverSettingPanel.ServerUrl.Value));

            _serverSettingPanel = GameObject.Find("ServerSettingPanel").GetComponent<ServerSettingPanel>();

            _userSettingPanel = GameObject.Find("UserSettingPanel").GetComponent<UserSettingPanel>();

            _dialog = GameObject.Find("Dialog").GetComponent<Dialog>();

            _sessionManager.OnCreate.Add(async v =>
            {
                if (v.IsError)
                {
                    _dialog.Open(v.ErrorTitle, v.ErrorMessage, "close", "ok", _ => _dialog.Close());
                }
                else
                {
                    var d = LocalData.Load();
                    d.auth.accessToken = v.Value.AccessToken;
                    d.auth.refreshToken = v.Value.RefreshToken;
                    LocalData.Save(d);
                }
            });
            _sessionManager.OnRefresh.Add(async v =>
            {
                if (v.IsError)
                {
                    _dialog.Open(v.ErrorTitle, v.ErrorMessage, "close", "ok", _ => _dialog.Close());
                }
                else
                {
                    var d = LocalData.Load();
                    d.auth.accessToken = v.Value.AccessToken;
                    d.auth.refreshToken = v.Value.RefreshToken;
                    LocalData.Save(d);
                }
            });

            _serverSettingPanel.Init(_sessionManager);
            _serverSettingPanel.OnCheck.Add(async r => new OnCheckHandler(_dialog).Handle(r));

            _userSettingPanel.Init(_sessionManager);
            _userSettingPanel.OnCreate.Add(async r =>
            {
                if (r.isError)
                {
                    _dialog.Open(r.error.Title, r.error.Message, "close", "ok", _ => _dialog.Close());
                }
                else
                {
                    _dialog.Open("User creation succeeded", "User creation succeeded", "close", "ok",
                        _ => _dialog.Close());
                }

                var d = LocalData.Load();
                d.server.baseUrl = _serverSettingPanel.ServerUrl.Value;
                d.user.userId = r.userId;
                d.auth.accessToken = r.accessToken;
                d.auth.refreshToken = r.refreshToken;
                LocalData.Save(d);
            });
        }
    }
}