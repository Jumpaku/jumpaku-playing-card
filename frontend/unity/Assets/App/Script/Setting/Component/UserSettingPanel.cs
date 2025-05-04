using System.Collections.Generic;
using Api_PB.V1_PB.Health_PB;
using Api_PB.V1_PB.Health_PB.HealthService_PB;
using App.Script.Lib.Reference;
using App.Script.Setting.Executor.Setting.User;
using App.Script.Shared;
using App.Script.Shared.Api;
using App.Script.Shared.Error;
using Cysharp.Threading.Tasks;
using R3;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace App.Script.Setting.Component
{
    public class UserSettingPanel : MonoBehaviour
    {
        private TMP_InputField _displayNameInput;
        public IReadonlyReference<string> DisplayName;
        private readonly Handler<CreateResult> _onCreate = new();
        public IAddHandler<CreateResult> OnCreate => _onCreate;


        public delegate UniTask<CreateResult> CreateExecutorFunc(UserSettingPanel component);

        private CreateExecutorFunc _createExecutor;

        public class CreateResult
        {
            public bool isError;
            public AppError error;
            public string userId;
            public string displayName;
            public string accessToken;
            public string refreshToken;
        }

        public void Init(CreateExecutorFunc executor)
        {
            _displayNameInput = transform.Find("DisplayName").Find("DisplayNameInput").GetComponent<TMP_InputField>();

            _createExecutor = executor;

            DisplayName = new FactoryReference<string>(() => _displayNameInput.text);

            transform.Find("CreateButton").GetComponent<Button>()
                .onClick
                .AddListener(() => Create().Forget());

            _onCreate.Clear();
        }

        public async UniTask<CreateResult> Create()
        {
            Debug.Log("UserSettingPanel/Create");

            var r = await _createExecutor(this);

            await _onCreate.Handle(r);

            return r;
        }
    }
}