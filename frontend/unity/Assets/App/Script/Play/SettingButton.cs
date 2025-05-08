using UnityEngine;

namespace App.Script.Play
{
    public class SettingButton : MonoBehaviour
    {
        public void OnClicked()
        {
            Debug.Log("OnClicked");
            var pool = GameObject.Find("CardPool").GetComponent<CardPool>();
            var card = pool.New("13");
            card.transform.SetParent(transform);
        }
    }
}