using System;
using Localdata_PB.LocalData_PB;
using UnityEngine;

namespace App.Script.Shared
{
    public class LocalData
    {
        private static string LocalDataKey => "localData";

        private Localdata_PB.LocalData _cache;

        private void _clear()
        {
            Save(new Localdata_PB.LocalData
            {
                server = new Server(),
                auth = new Authentication(),
                user = new User(),
            });
        }

        public Localdata_PB.LocalData Load()
        {
            if (_cache != null)
            {
                return _cache;
            }

            if (!PlayerPrefs.HasKey(LocalDataKey))
            {
                _clear();
            }

            var json = PlayerPrefs.GetString(LocalDataKey);
            Debug.Log($"LocalData.Load: {json}");
            return _cache = JsonUtility.FromJson<Localdata_PB.LocalData>(json);
        }

        public void Save(Localdata_PB.LocalData localData)
        {
            if (localData.user == null)
            {
                throw new ArgumentNullException(nameof(localData.user), "localData.user == null");
            }

            if (localData.auth == null)
            {
                throw new ArgumentNullException(nameof(localData.auth), "localData.auth == null");
            }

            if (localData.server == null)
            {
                throw new ArgumentNullException(nameof(localData.server), "localData.server == null");
            }

            var json = JsonUtility.ToJson(_cache = localData);
            Debug.Log($"LocalData.Save: {json}");
            PlayerPrefs.SetString(LocalDataKey, json);
            PlayerPrefs.Save();
        }
    }
}