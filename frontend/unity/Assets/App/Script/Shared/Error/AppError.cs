namespace App.Script.Shared.Error
{
    public class AppError
    {
        public static AppError NewDialogNotice(string title, string message)
        {
            return new AppError()
            {
                Behaviour = Behaviour.DialogNotice,
                Title = title,
                Message = message
            };
        }

        public static AppError NewBackToTitle(string title, string message)
        {
            return new AppError()
            {
                Behaviour = Behaviour.DialogNotice,
                Title = title,
                Message = message
            };
        }

        private AppError()
        {
        }

        public Behaviour Behaviour { get; private set; }
        public string Title { get; private set; }
        public string Message { get; private set; }
    }
}