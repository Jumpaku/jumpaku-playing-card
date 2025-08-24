using App.Script.Play.Component;
using App.Script.Setting.Component;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace App.Script.Play.Logic.Play.Setting
{
    public class SettingExecutor
    {
        public void Execute(string roomId)
        {
            SceneManager.sceneLoaded += (_, _) =>
            {
                var init = GameObject.Find("SettingInitialize").GetComponent<SettingEntryPoint>();
                init.SetRoomId(roomId);
            };
            SceneManager.LoadScene("PlayScene");
        }
    }
}