using App.Script.Lib;
using App.Script.Lib.Reference;
using App.Script.Setting.Logic.Setting.StartPlay;
using App.Script.Shared;
using Cysharp.Threading.Tasks;
using UnityEngine;
using UnityEngine.UI;

namespace App.Script.Setting.Component
{
    public class StartPlayPanel : MonoBehaviour
    {
        private IReadonlyReference<string> _roomId;

        private readonly Handler<Unit> _onStartPlay = new();
        public IAddHandler<Unit> OnStartPlay => _onStartPlay;

        public void Init(IReadonlyReference<string> roomId)
        {
            _roomId = roomId;

            transform.Find("StartPlayButton").GetComponent<Button>()
                .onClick.AddListener(async () => await StartPlay());
        }

        
        public async UniTask StartPlay()
        {
            Debug.Log("SeatSettingSection/StartPlay");
            await _onStartPlay.Handle(Unit.Instance);

            new StartPlayExecutor().Execute(_roomId.Value);
        }
    }
}