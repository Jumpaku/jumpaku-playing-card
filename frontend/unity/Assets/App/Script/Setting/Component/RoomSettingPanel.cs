using System.Collections.Generic;
using System.Linq;
using Api_PB.V1_PB.App_PB.Room_PB;
using Api_PB.V1_PB.App_PB.Room_PB.RoomService_PB;
using App.Script.Lib.Reference;
using App.Script.Setting.Logic.Setting.Room;
using App.Script.Shared;
using Cysharp.Threading.Tasks;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace App.Script.Setting.Component
{
    public class RoomSettingPanel : MonoBehaviour
    {
        private IReadonlyReference<string> _userId;

        private SessionManager _sessionManager;

        private TMP_InputField _roomNameInput;

        private TMP_Dropdown _roomSeatsInput;

        private TMP_InputField _roomIdInput;

        private SeatSettingSection _seatSettingSection;

        private readonly Handler<CreateExecutor.CreateResult> _onCreate = new();
        public IAddHandler<CreateExecutor.CreateResult> OnCreate => _onCreate;

        private readonly Handler<EnterExecutor.EnterResult> _onEnter = new();
        public IAddHandler<EnterExecutor.EnterResult> OnEnter => _onEnter;

        public void Init(SessionManager sessionManager, IReadonlyReference<string> userId)
        {
            Debug.Log("RoomSettingPanel/Init");

            _sessionManager = sessionManager;

            _userId = userId;

            _roomNameInput = transform.Find("RoomSetting").Find("NameInput").GetComponent<TMP_InputField>();

            _roomSeatsInput = transform.Find("RoomSetting").Find("SeatsInput").GetComponent<TMP_Dropdown>();

            _roomIdInput = transform.Find("RoomId").Find("RoomIdInput").GetComponent<TMP_InputField>();

            _seatSettingSection = transform.Find("SeatSettingSection").GetComponent<SeatSettingSection>();
            _seatSettingSection.Init(userId, new FactoryReference<string>(() => _roomIdInput.text));

            transform.Find("CreateButton").GetComponent<Button>()
                .onClick
                .AddListener(() => Create().Forget());

            transform.Find("EnterButton").GetComponent<Button>()
                .onClick
                .AddListener(() => Enter().Forget());

            _onCreate.Clear();
        }

        public async UniTask<CreateExecutor.CreateResult> Create()
        {
            Debug.Log("RoomSettingPanel/Create");

            var result = await new CreateExecutor()
                .Execute(_sessionManager.Session, _roomNameInput.text, _roomSeatsInput.value + 1);
            if (!result.IsError)
            {
                _roomIdInput.text = result.Value.room.roomId;
                _seatSettingSection.Prepare(new List<RoomSeat>());
            }

            await _onCreate.Handle(result);
            return result;
        }

        public async UniTask<EnterExecutor.EnterResult> Enter()
        {
            Debug.Log("RoomSettingPanel/Enter");

            var enterResult = await new EnterExecutor()
                .Execute(_sessionManager.Session, _roomIdInput.text);
            if (!enterResult.IsError)
            {
                _seatSettingSection.Prepare(enterResult.Value.room.seatList);
            }

            await _onEnter.Handle(enterResult);
            return enterResult;
        }
    }
}