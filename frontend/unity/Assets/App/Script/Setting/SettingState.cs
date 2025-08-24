using Api_PB.V1_PB.App_PB.Room_PB;
using App.Script.Lib.Reference;

namespace App.Script.Setting
{
    public class SettingState
    {
        public readonly IReference<string> UserId = new ValueReference<string>("");
    }
}