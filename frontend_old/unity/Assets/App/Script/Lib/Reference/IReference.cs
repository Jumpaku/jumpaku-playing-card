namespace App.Script.Lib.Reference
{
    public interface IReference<T> : IReadonlyReference<T>
    {
        public T Value { get; set; }
    }
}