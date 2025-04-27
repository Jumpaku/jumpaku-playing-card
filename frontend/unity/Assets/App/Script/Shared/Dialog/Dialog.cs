using System;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace App.Script.Shared.Dialog
{
    public class Dialog : MonoBehaviour
    {
        public static Dialog Instance => GameObject.Find("Dialog").GetComponent<Dialog>();

        private GameObject _dialogPanel;
        private GameObject _titleText;
        private GameObject _messageText;
        private GameObject _cancelButton;
        private GameObject _confirmButton;

        void Start()
        {
            Init();
        }

        void Init()
        {
            _dialogPanel = transform.Find("DialogPanel").gameObject;
            _titleText = _dialogPanel.transform.Find("TitleText").gameObject;
            _messageText = _dialogPanel.transform.Find("MessageText").gameObject;
            _cancelButton = _dialogPanel.transform.Find("CancelButton").gameObject;
            _confirmButton = _dialogPanel.transform.Find("ConfirmButton").gameObject;
        }

        public void Open(string title, string message, string cancelText, string confirmText, Action onCancel,
            Action onConfirm)
        {
            _dialogPanel.SetActive(true);

            _titleText.GetComponent<TextMeshProUGUI>().text = title;
            _messageText.GetComponent<TextMeshProUGUI>().text = message;

            var cancelButton = _cancelButton.GetComponent<Button>();
            cancelButton.onClick.AddListener(() =>
            {
                Debug.Log("Dialog.Cancel");
                cancelButton.onClick.RemoveAllListeners();
                onCancel();
            });
            cancelButton.GetComponentInChildren<TextMeshProUGUI>().text = cancelText;

            var confirmButton = _confirmButton.GetComponent<Button>();
            confirmButton.onClick.AddListener(() =>
            {
                Debug.Log("Dialog.Confirm");
                confirmButton.onClick.RemoveAllListeners();
                onConfirm();
            });
            confirmButton.GetComponentInChildren<TextMeshProUGUI>().text = confirmText;
        }

        public void Close()
        {
            _dialogPanel.SetActive(false);
        }
    }
}