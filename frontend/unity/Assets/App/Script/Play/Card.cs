using System;
using Cysharp.Threading.Tasks;
using UnityEngine;
using UnityEngine.AddressableAssets;
using UnityEngine.Serialization;

namespace App.Script.Play
{
    public class Card : MonoBehaviour
    {
        private string _masterCardId;
        private Side _side;
        private Texture2D _frontTexture;
        private Texture2D _backTexture;
        private SpriteRenderer _spriteRenderer;
        
        public enum Side
        {
            Back,
            Front,
        }


        public async UniTask Init(string masterCardId, Side side)
        {
            _masterCardId = masterCardId;
            gameObject.name = "Card" + masterCardId;

            var handleFront = Addressables.LoadAssetAsync<Texture2D>(_getFrontTextureKey());
            var handleBack = Addressables.LoadAssetAsync<Texture2D>(_getBackTextureKey());

            await UniTask.WhenAll(handleFront.ToUniTask(), handleBack.ToUniTask());

            _frontTexture = handleFront.Result;
            _backTexture = handleBack.Result;
            _spriteRenderer = transform.Find("CardSprite").GetComponent<SpriteRenderer>();
            SetSide(side);
        }

        private string _getBackTextureKey()
        {
            return "Assets/App/Texture/Play/cards/cards.055.png";
        }

        private string _getFrontTextureKey()
        {
            var cardName = $"000{_masterCardId}";
            cardName = cardName.Substring(cardName.Length - 3);
            return $"Assets/App/Texture/Play/cards/cards.{cardName}.png";
        }

        public void SetSide(Side side)
        {
            _side = side;
            var sprite = _spriteRenderer.sprite;
            switch (_side)
            {
                case Side.Front:
                {
                    _spriteRenderer.sprite = Sprite.Create(_frontTexture, sprite.rect, sprite.pivot);
                }
                    break;
                case Side.Back:
                {
                    _spriteRenderer.sprite = Sprite.Create(_backTexture, sprite.rect, sprite.pivot);
                }
                    break;
            }
        }
    }
}