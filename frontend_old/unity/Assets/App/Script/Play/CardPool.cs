using System.Collections.Generic;
using Cysharp.Threading.Tasks;
using UnityEngine;
using UnityEngine.AddressableAssets;

namespace App.Script.Play
{
    public class CardPool : MonoBehaviour
    {
        private readonly Dictionary<string, Card> _cardMap = new();

        async void Start()
        {
            await Init();
        }

        private async UniTask Init()
        {
            var prefab = await Addressables.LoadAssetAsync<GameObject>("Assets/App/Prefab/Play/Card.prefab");
            for (int i = 0; i < 54; i++)
            {
                var cardId = i + 1;
                var card = Instantiate(prefab, transform);

                card.transform.position = new Vector3(0, 0, 0);
                var c = card.GetComponent<Card>();
                await c.Init($"{cardId}", Card.Side.Back);
                _cardMap.Add($"{cardId}", c);
            }
        }

        public Card New(string masterCardId)
        {
            var found = _cardMap[masterCardId];
            var go = Instantiate(found.gameObject);
            return go.GetComponent<Card>();
        }
    }
}