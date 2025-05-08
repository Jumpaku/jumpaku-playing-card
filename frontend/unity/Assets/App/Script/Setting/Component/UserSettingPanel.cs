using App.Script.Lib.Reference;
using App.Script.Setting.Logic.Setting.User;
using App.Script.Shared;
using Cysharp.Threading.Tasks;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace App.Script.Setting.Component
{
    public class UserSettingPanel : MonoBehaviour
    {
        private TMP_InputField _displayNameInput;
        public IReadonlyReference<string> DisplayName => new FactoryReference<string>(() => _displayNameInput.text);
        public SessionManager _session;
        private readonly Handler<CreateExecutor.CreateResult> _onCreate = new();
        public IAddHandler<CreateExecutor.CreateResult> OnCreate => _onCreate;


        public delegate UniTask<CreateExecutor.CreateResult> CreateExecutorFunc(UserSettingPanel component);

        private CreateExecutorFunc _createExecutor;

        public void Init(SessionManager session)
        {
            _displayNameInput = transform.Find("DisplayName").Find("DisplayNameInput").GetComponent<TMP_InputField>();

            _session = session;

            transform.Find("CreateButton").GetComponent<Button>()
                .onClick
                .AddListener(() => Create().Forget());

            _onCreate.Clear();
        }

        public async UniTask<CreateExecutor.CreateResult> Create()
        {
            Debug.Log("UserSettingPanel/Create");


            var result = await new CreateExecutor().Execute(_session.Session, DisplayName.Value);

            await _onCreate.Handle(result);
            return result;
        }
    }
}