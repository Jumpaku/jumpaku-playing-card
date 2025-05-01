using System;
using Api_PB.V1_PB.Health_PB.HealthService_PB;
using App.Script.Shared;
using App.Script.Shared.Dialog;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.SceneManagement;

namespace App.Script.Setting
{
    public class SettingView : SettingService.IView
    {
        private readonly Dialog _dialog;

        public SettingView(Dialog dialog)
        {
            _dialog = dialog;
        }

        public void OnError(ErrorBehaviour errorBehaviour, string title, string message)
        {
            switch (errorBehaviour)
            {
                case ErrorBehaviour.DialogNotice:
                {
                    _dialog.Open(title, message, "close", "ok", _ => _dialog.Close());
                }
                    break;
                default:
                {
                    _dialog.Open(title, message, "close", "ok", _ =>
                    {
                        _dialog.Close();
                        SceneManager.LoadScene("Scenes/SettingScene");
                    });
                }
                    break;
            }
        }

        public void OnServerCheckDone()
        {
            _dialog.Open("OK", "Server is valid.", "close", "ok", _ => _dialog.Close());
        }

        public void OnUserCreateDone(string userId)
        {
        }
    }
}