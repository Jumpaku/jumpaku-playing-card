using App.Script.Lib.Reference;
using App.Script.Setting.Component;
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
            _sessionManager =
                new SessionManager(new FactoryReference<string>(() => _serverSettingPanel.ServerUrl.Value));

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
                    d.auth.accessToken = v.AccessToken;
                    d.auth.refreshToken = v.RefreshToken;
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
                    d.auth.accessToken = v.AccessToken;
                    d.auth.refreshToken = v.RefreshToken;
                    LocalData.Save(d);
                }
            });

            _serverSettingPanel.Init(_sessionManager);
            _serverSettingPanel.OnCheck.Add(async r =>
            {
                if (r.IsError)
                {
                    _dialog.Open(r.ErrorTitle, r.ErrorMessage, "close", "ok", _ => _dialog.Close());
                }
                else
                {
                    _dialog.Open("Server check succeeded", "Server is valid", "close", "ok",
                        _ => _dialog.Close());
                }
            });

            _userSettingPanel.Init(_sessionManager);
            _userSettingPanel.OnCreate.Add(async r =>
            {
                if (r.IsError)
                {
                    _dialog.Open(r.ErrorTitle, r.ErrorMessage, "close", "ok", _ => _dialog.Close());
                }
                else
                {
                    _dialog.Open("User creation succeeded", "User creation succeeded", "close", "ok",
                        _ => _dialog.Close());
                }

                var d = LocalData.Load();
                d.server.baseUrl = _serverSettingPanel.ServerUrl.Value;
                d.user.userId = r.UserId;
                LocalData.Save(d);
            });
        }
    }
}