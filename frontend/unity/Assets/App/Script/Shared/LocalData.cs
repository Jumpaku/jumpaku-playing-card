using Localdata_PB.LocalData_PB;
using UnityEngine;

namespace App.Script.Shared
{
    public static class LocalData
    {
        private static string LocalDataKey => "localData";

        public static void Clear()
        {
            Save(new Localdata_PB.LocalData
            {
                server = new Server(),
                auth = new Authentication(),
                user = new User(),
            });
        }

        public static Localdata_PB.LocalData Load()
        {
            if (!PlayerPrefs.HasKey(LocalDataKey))
            {
                Clear();
            }

            var json = PlayerPrefs.GetString(LocalDataKey);
            Debug.Log($"LocalData.Load: {json}");
            return JsonUtility.FromJson<Localdata_PB.LocalData>(json);
        }

        public static void Save(Localdata_PB.LocalData localData)
        {
            var json = JsonUtility.ToJson(localData);
            Debug.Log($"LocalData.Save: {json}");
            PlayerPrefs.SetString(LocalDataKey, json);
            PlayerPrefs.Save();
        }
    }
}