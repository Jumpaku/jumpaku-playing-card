namespace App.Script.Lib.Reference
{
    public class FactoryReference<T> : IReadonlyReference<T>
    {
        public delegate T FactoryFunc();

        public FactoryReference(FactoryFunc factory)
        {
            _factory = factory;
        }

        private readonly FactoryFunc _factory;
        public T Value => _factory();
    }
}