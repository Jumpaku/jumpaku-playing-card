using System;
using App.Script.Setting.Component;
using App.Script.Setting.Executor.Setting.Server;
using App.Script.Setting.Executor.Setting.User;
using App.Script.Setting.Handler.Setting.Server;
using App.Script.Shared;
using App.Script.Shared.Api;
using App.Script.Shared.Dialog;
using App.Script.Shared.Error;
using Cysharp.Threading.Tasks;
using UnityEngine;
using UnityEngine.Networking;

namespace App.Script.Setting
{
    public class SettingView : MonoBehaviour
    {
        private ServerSettingPanel _serverSettingPanel;
        private UserSettingPanel _userSettingPanel;
        private Dialog _dialog;

        private void Start()
        {
            Init();
        }

        public void Init()
        {
            _serverSettingPanel = GameObject.Find("ServerSettingPanel").GetComponent<ServerSettingPanel>();

            _userSettingPanel = GameObject.Find("UserSettingPanel").GetComponent<UserSettingPanel>();

            _dialog = GameObject.Find("Dialog").GetComponent<Dialog>();

            _serverSettingPanel.Init(async c =>
            {
                var session = new Session();
                session.SetBaseUrl(c.ServerUrl.Value);
                var r = await new CheckExecutor().Execute(session);
                return new ServerSettingPanel.CheckResult { Result = r };
            });
            _serverSettingPanel.OnCheck.Add(async r => new OnCheckHandler(_dialog).Handle(r));

            _userSettingPanel.Init(async c =>
            {
                var session = new Session();
                session.SetBaseUrl(_serverSettingPanel.ServerUrl.Value);
                var r = await new CreateExecutor().Execute(session, c.DisplayName.Value);
                return r.IsError
                    ? new UserSettingPanel.CreateResult
                    {
                        isError = true,
                        error = AppError.NewDialogNotice(r.ErrorTitle, r.ErrorMessage)
                    }
                    : new UserSettingPanel.CreateResult
                    {
                        isError = false,
                        displayName = r.Value.DisplayName,
                        userId = r.Value.UserId,
                        accessToken = r.Value.AccessToken,
                        refreshToken = r.Value.RefreshToken,
                    };
            });
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