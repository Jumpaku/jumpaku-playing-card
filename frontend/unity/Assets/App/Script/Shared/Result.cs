namespace App.Script.Shared
{
    public class Result<T>
    {
        public static Result<T> Ok(T value) => new() { IsOk = true, Value = value };

        public static Result<T> Error(string title, string message) =>
            new() { IsOk = false, ErrorTitle = title, ErrorMessage = message };

        public bool IsOk { get; private set; }
        
        public bool IsError => !IsOk;
        public T Value { get; private set; }
        public string ErrorTitle { get; private set; }
        public string ErrorMessage { get; private set; }
    }
}