using System;
using Cysharp.Threading.Tasks;
using UnityEngine;
using UnityEngine.AddressableAssets;

namespace App.Script.Play
{
    [Serializable]
    public class Card : MonoBehaviour
    {
        [SerializeField] private string masterCardId;
        [SerializeField] private Side side;
        [SerializeField] private Texture2D frontTexture;
        [SerializeField] private Texture2D backTexture;

        public enum Side
        {
            Unspecified,
            Front,
            Back,
        }


        public void Init(string masterCardId, Side side)
        {
            this.masterCardId = masterCardId;
            gameObject.name = "Card" + masterCardId;

            var handleFront = Addressables.LoadAssetAsync<Texture2D>(GetFrontTextureKey());
            handleFront.Completed += s => { frontTexture = s.Result; };
            var handleBack = Addressables.LoadAssetAsync<Texture2D>(GetBackTextureKey());
            handleBack.Completed += s => { backTexture = s.Result; };

            UniTask.WhenAll(handleFront.ToUniTask(), handleBack.ToUniTask()).GetAwaiter()
                .OnCompleted(() => SetSide(side));
        }

        private string GetBackTextureKey()
        {
            return "Assets/App/Texture/Play/cards/cards.055.png";
        }

        private string GetFrontTextureKey()
        {
            var cardName = $"000{masterCardId}";
            cardName = cardName.Substring(cardName.Length - 3);
            return $"Assets/App/Texture/Play/cards/cards.{cardName}.png";
        }

        void SetSide(Side side)
        {
            this.side = side;
            var spriteRenderer = transform.Find("CardSprite").GetComponent<SpriteRenderer>();
            var sprite = spriteRenderer.sprite;
            switch (this.side)
            {
                case Side.Front:
                {
                    spriteRenderer.sprite = Sprite.Create(frontTexture, sprite.rect, sprite.pivot);
                }
                    break;
                case Side.Back:
                {
                    spriteRenderer.sprite = Sprite.Create(backTexture, sprite.rect, sprite.pivot);
                }
                    break;
            }
        }
    }
}