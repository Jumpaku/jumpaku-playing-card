using UnityEngine;

namespace App.Script.Setting
{
    [CreateAssetMenu(fileName = "SettingConstant", menuName = "Scriptable Objects/SettingConstant")]
    public class SettingConstant : ScriptableObject
    {
        [SerializeField] public int maxRoomSeatCount;
    }
}