namespace App.Script.Lib.Reference
{
    public class PropertyReference<T> : IReference<T>, IReadonlyReference<T>
    {
        public delegate T GetterFunc();

        public delegate void SetterFunc(T value);

        public PropertyReference(GetterFunc get, SetterFunc set)
        {
            _get = get;
            _set = set;
        }

        private readonly GetterFunc _get;
        private readonly SetterFunc _set;

        public T Value
        {
            get => _get();
            set => _set(value);
        }
    }
}