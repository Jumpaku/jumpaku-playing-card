namespace App.Script.Lib.Reference
{
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
}