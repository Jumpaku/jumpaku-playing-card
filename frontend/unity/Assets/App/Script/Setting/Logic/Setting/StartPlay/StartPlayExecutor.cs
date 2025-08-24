using App.Script.Play.Component;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace App.Script.Setting.Logic.Setting.StartPlay
{
    public class StartPlayExecutor
    {
        public void Execute(string roomId)
        {
            SceneManager.sceneLoaded += (_, _) =>
            {
                var init = GameObject.Find("PlayInitialize").GetComponent<PlayEntryPoint>();
                init.SetRoomId(roomId);
            };
            SceneManager.LoadScene("PlayScene");
        }
    }
}