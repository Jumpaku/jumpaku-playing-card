using System;
using System.Collections.Generic;
using Cysharp.Threading.Tasks;

namespace App.Script.Shared
{
    public delegate UniTask HandlerFunc<T>(T value);

    public interface IAddHandler<T>
    {
        public void Add(HandlerFunc<T> h);

        public void AddOnce(HandlerFunc<T> h);
    }

    public class Handler<T> : IAddHandler<T>
    {
        private readonly List<HandlerFunc<T>> _handler = new();
        private readonly List<HandlerFunc<T>> _handlerOnce = new();

        public void Add(HandlerFunc<T> h)
        {
            _handler.Add(h);
        }

        public void AddOnce(HandlerFunc<T> h)
        {
            _handlerOnce.Add(h);
        }

        public void Clear()
        {
            _handler.Clear();
            _handlerOnce.Clear();
        }

        public async UniTask Handle(T value)
        {
            var hs = new List<HandlerFunc<T>>();
            hs.AddRange(_handler);
            hs.AddRange(_handlerOnce);

            _handlerOnce.Clear();

            await UniTask.WhenAll(hs.Select(h => h(value)));
        }
    }
}