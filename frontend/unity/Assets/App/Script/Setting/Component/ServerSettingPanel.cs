using App.Script.Lib.Reference;
using App.Script.Setting.Executor.Setting.Server;
using App.Script.Shared;
using Cysharp.Threading.Tasks;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace App.Script.Setting.Component
{
    public class ServerSettingPanel : MonoBehaviour
    {
        private SessionManager _sessionManager;

        private TMP_InputField _serverUrlInput;
        public IReadonlyReference<string> ServerUrl => new FactoryReference<string>(() => _serverUrlInput.text);

        private readonly Handler<CheckResult> _onCheck = new();
        public IAddHandler<CheckResult> OnCheck => _onCheck;

        public class CheckResult
        {
            public CheckExecutor.Result Result;
        }

        public void Init(SessionManager sessionManager)
        {
            Debug.Log("ServerSettingPanel/Init");

            _sessionManager = sessionManager;

            _serverUrlInput = transform.Find("ServerUrl").Find("ServerUrlInput").GetComponent<TMP_InputField>();

            transform.Find("CheckButton").GetComponent<Button>()
                .onClick
                .AddListener(() => Check().Forget());

            _onCheck.Clear();
        }

        public async UniTask<CheckResult> Check()
        {
            Debug.Log("ServerSettingPanel/Check");

            var r = await new CheckExecutor().Execute(_sessionManager.Session);

            var result = new CheckResult { Result = r };
            await _onCheck.Handle(result);
            return result;
        }
    }
}