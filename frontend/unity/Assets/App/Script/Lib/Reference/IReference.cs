namespace App.Script.Lib.Reference
{
    public interface IReference<T> : IReadonlyReference<T>
    {
        public new T Value { set; }
    }
}