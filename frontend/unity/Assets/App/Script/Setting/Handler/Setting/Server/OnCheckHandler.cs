using App.Script.Setting.Component;
using App.Script.Shared.Dialog;

namespace App.Script.Setting.Handler.Setting.Server
{
    public class OnCheckHandler
    {
        private Dialog _dialog;

        public OnCheckHandler(Dialog dialog)
        {
            _dialog = dialog;
        }

        public void Handle(ServerSettingPanel.CheckResult r)
        {
            _dialog.Open(r.Result.titleText, r.Result.messageText, "close", "ok",
                _ => _dialog.Close());
        }
    }
}