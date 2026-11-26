namespace SchoolWebApp.Auth
{
    public static class AdminAuth
    {
        public const string AdminRole = "Admin";

        /// <summary>
        /// Email addresses allowed to sign in, from the "AdminEmails" config section.
        /// </summary>
        public static HashSet<string> GetAdminEmails(IConfiguration config) =>
            new(config.GetSection("AdminEmails").Get<string[]>() ?? Array.Empty<string>(),
                StringComparer.OrdinalIgnoreCase);
    }
}
