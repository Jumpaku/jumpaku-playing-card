using System;
using App.Script.Shared;
using Localdata_PB.LocalData_PB;
using UnityEngine;

namespace App.Script.Playground
{
    [Serializable]
    public class Inner
    {
        public string value;
    }

    [Serializable]
    public class Outer
    {
        public Inner inner;
    }

    public class Playground : MonoBehaviour
    {
        async void Start()
        {
            var v = new Outer();
            v.inner = new Inner();
            v.inner.value = "abc";
            Debug.Log(JsonUtility.ToJson(v));
            Debug.Log(JsonUtility.ToJson(v.inner));
        }
    }
}