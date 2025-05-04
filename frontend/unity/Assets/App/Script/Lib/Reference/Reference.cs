namespace App.Script.Lib.Reference
{
    public interface IReadonlyReference<T>
    {
        public T Value { get; }
    }

    public interface IReference<T> : IReadonlyReference<T>
    {
        public T Value { get; set; }
    }

    public class ValueReference<T> : IReference<T>
    {
        public ValueReference(T initValue)
        {
            _value = initValue;
        }
        private T _value;

        public T Value
        {
            get => _value;
            set { _value = value; }
        }
    }
    public class FactoryReference<T> : IReadonlyReference<T>
    {
        public delegate T Factory();
        public FactoryReference(Factory factory)
        {
            _factory = factory;
        }
        private Factory _factory;
        public T Value  => _factory(); 
    }
}