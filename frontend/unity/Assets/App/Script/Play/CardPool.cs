using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AddressableAssets;

namespace App.Script.Play
{
    public class CardPool : MonoBehaviour
    {
        private Dictionary<string, Card> _cardMap = new();

        void Start()
        {
            Init();
        }

        private void Init()
        {
            var cardHandle = Addressables.LoadAssetAsync<GameObject>("Assets/App/Prefab/Play/Card.prefab");
            cardHandle.Completed += p =>
            {
                for (int i = 0; i < 54; i++)
                {
                    var cardId = i + 1;
                    var card = Instantiate(p.Result, transform);

                    card.transform.position = new Vector3(-(i % 13), -(i / 13), 0);
                    var c = card.GetComponent<Card>();
                    c.Init($"{cardId}", Card.Side.Back);
                    _cardMap.Add($"{cardId}", c);
                }
            };
        }

        public Card New(string masterCardId)
        {
            var found = _cardMap[masterCardId];
            var go = Instantiate(found.gameObject);
            return go.GetComponent<Card>();
        }
    }
}