using App.Script.Lib.Reference;
using App.Script.Setting.Logic.Setting.Room;
using App.Script.Setting.Logic.Setting.Server;
using App.Script.Shared;
using App.Script.Shared.Dialog;
using Cysharp.Threading.Tasks;
using UnityEngine;
using CreateExecutor = App.Script.Setting.Logic.Setting.User.CreateExecutor;

namespace App.Script.Setting.Component
{
    public class SettingView : MonoBehaviour
    {
        private LocalData _localData;
        private SettingState _state;
        private Dialog _dialog;
        private SessionManager _sessionManager;
        private ServerSettingPanel _serverSettingPanel;
        private UserSettingPanel _userSettingPanel;
        private RoomSettingPanel _roomSettingPanel;
        private StartPlayPanel _startPlayPanel;
        public async UniTask Init(SettingEntryPoint.InitData initData)
        {
            _localData = new LocalData();
            
            _state = new SettingState();
            _state.UserId.Value = initData.UserId;

            _dialog = GameObject.Find("Dialog").GetComponent<Dialog>();

            _sessionManager = new(new FactoryReference<string>(() => _serverSettingPanel.ServerUrl.Value));
            _sessionManager.OnCreate.Add(_handleTokenChange);
            _sessionManager.OnRefresh.Add(_handleTokenChange);
            _sessionManager.RefreshToken.Value = initData.RefreshToken;
            _sessionManager.AccessToken.Value = initData.AccessToken;

            _serverSettingPanel = GameObject.Find("ServerSettingPanel").GetComponent<ServerSettingPanel>();
            _serverSettingPanel.Init(_sessionManager);
            _serverSettingPanel.OnCheck.Add(_handleServerCheck);
            _serverSettingPanel.OnServerUrlChange.Add(_handleServerUrlChange);
            _serverSettingPanel.ServerUrl.Value = initData.ServerUrl;

            _userSettingPanel = GameObject.Find("UserSettingPanel").GetComponent<UserSettingPanel>();
            _userSettingPanel.Init(_sessionManager);
            _userSettingPanel.OnCreate.Add(_handleUserCreate);
            _userSettingPanel.DisplayName.Value = initData.DisplayName;

            _roomSettingPanel = GameObject.Find("RoomSettingPanel").GetComponent<RoomSettingPanel>();
            _roomSettingPanel.Init(_sessionManager, _state.UserId, initData.RoomId);
            _roomSettingPanel.OnCreate.Add(_handleRoomCreate);
            _roomSettingPanel.OnEnter.Add(_handleRoomEnter);

            _startPlayPanel = GameObject.Find("StartPlayPanel").GetComponent<StartPlayPanel>();
            _startPlayPanel.Init(_roomSettingPanel.RoomId);
        }

        private async UniTask _handleServerUrlChange(string serverUrl)
        {
            var d = _localData.Load();
            d.server.baseUrl = serverUrl;
            _localData.Save(d);
        }

        private async UniTask _handleRoomEnter(EnterExecutor.EnterResult r)
        {
            if (r.IsError)
            {
                _dialog.Open(r.ErrorTitle, r.ErrorMessage, "close", "ok", _ => _dialog.Close());
            }
            else
            {
                _dialog.Open("Entered into the room", "", "close", "ok",
                    _ => _dialog.Close());
            }
        }

        private async UniTask _handleRoomCreate(Logic.Setting.Room.CreateExecutor.CreateResult r)
        {
            if (r.IsError)
            {
                _dialog.Open(r.ErrorTitle, r.ErrorMessage, "close", "ok", _ => _dialog.Close());
            }
            else
            {
                _dialog.Open("Room creation succeeded", "Room creation succeeded", "close", "ok",
                    _ => _dialog.Close());
            }
        }

        private async UniTask _handleUserCreate(CreateExecutor.CreateResult r)
        {
            if (r.IsError)
            {
                _dialog.Open(r.ErrorTitle, r.ErrorMessage, "close", "ok", _ => _dialog.Close());
            }
            else
            {
                var d = _localData.Load();
                d.user.userId = r.UserId;
                d.auth.accessToken = _sessionManager.AccessToken.Value;
                d.auth.refreshToken = _sessionManager.RefreshToken.Value;
                _localData.Save(d);

                _state.UserId.Value = r.UserId;

                _dialog.Open("User creation succeeded", "User creation succeeded", "close", "ok",
                    _ => _dialog.Close());
            }
        }

        private async UniTask _handleServerCheck(CheckExecutor.CheckResult r)
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
        }

        private async UniTask _handleTokenChange(SessionManager.TokenResult v)
        {
            if (v.IsError)
            {
                _dialog.Open(v.ErrorTitle, v.ErrorMessage, "close", "ok", _ => _dialog.Close());
            }
            else
            {
                var d = _localData.Load();
                d.auth.accessToken = v.AccessToken;
                d.auth.refreshToken = v.RefreshToken;
                _localData.Save(d);
            }
        }
    }
}