namespace SchoolSoft.Pages
{
    public class PageHelpers
    {
        public static string GetPackageBadge(int packageType)
        {
            return packageType switch
            {
                1 => "<span class='badge bg-primary'>Basic</span>",
                2 => "<span class='badge bg-warning text-dark'>Standard</span>",
                3 => "<span class='badge bg-success'>Premium</span>",
                _ => "<span class='badge bg-secondary'>Unknown</span>"
            };
        }

        public static string GetStatusBadge(int status)
        {
            return status == 1
                ? "<span class='badge bg-success'>Active</span>"
                : "<span class='badge bg-danger'>Inactive</span>";
        }

        public static string GetLogoHtml(string logoUrl)
        {
            return !string.IsNullOrEmpty(logoUrl)
                ? $"<img src='{logoUrl}' alt='Logo' class='img-thumbnail' style='width: 50px; height: 50px; object-fit: cover;'>"
                : "<span> - </span>";
        }

        public static string GetWebsiteLink(string websiteUrl)
        {
            return !string.IsNullOrEmpty(websiteUrl)
                ? $"<a href='{websiteUrl}' target='_blank' class='text-decoration-none'>Visit Website</a>"
                : "<span> - </span>";
        }
    }

}
