using System.Collections.Generic;
using App.Script.Lib.Reference;
using App.Script.Setting.Executor.Setting.Server;
using App.Script.Shared;
using Cysharp.Threading.Tasks;
using R3;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace App.Script.Setting.Component
{
    public class ServerSettingPanel : MonoBehaviour
    {
        private TMP_InputField _serverUrlInput;
        public IReadonlyReference<string> ServerUrl { get; private set; }

        private readonly Handler<CheckResult> _onCheck = new();
        public IAddHandler<CheckResult> OnCheck => _onCheck;
        
        private CheckExecutorFunc _doCheck;

        public delegate UniTask<CheckResult> CheckExecutorFunc(ServerSettingPanel component);

        public class CheckResult
        {
            public CheckExecutor.Result Result;
        }

        public void Init(CheckExecutorFunc doCheck)
        {
            Debug.Log("ServerSettingPanel/Init");

            _doCheck = doCheck;

            _serverUrlInput = transform.Find("ServerUrl").Find("ServerUrlInput").GetComponent<TMP_InputField>();

            ServerUrl = new FactoryReference<string>(() => _serverUrlInput.text);

            transform.Find("CheckButton").GetComponent<Button>()
                .onClick
                .AddListener(() => Check().Forget());

            _onCheck.Clear();
        }

        public async UniTask<CheckResult> Check()
        {
            Debug.Log("ServerSettingPanel/Check");

            var r = await _doCheck(this);

            await _onCheck.Handle(r);

            return r;
        }
    }
}