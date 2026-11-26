namespace SchoolWebApp
{
    public class PageHelpers
    {
        public static string GetPackageBadge(int packageType)
        {
            return packageType switch
            {
                1 => "<span class='badge bg-label-primary'>Basic</span>",
                2 => "<span class='badge bg-label-warning'>Standard</span>",
                3 => "<span class='badge bg-label-success'>Premium</span>",
                _ => "<span class='badge bg-label-secondary'>Unknown</span>"
            };
        }

        public static string GetStatusBadge(int status)
        {
            return status == 1
                ? "<span class='badge bg-label-success sc-status'>Active</span>"
                : "<span class='badge bg-label-danger sc-status'>Inactive</span>";
        }

        public static string GetLogoHtml(string logoUrl)
        {
            return !string.IsNullOrEmpty(logoUrl)
                ? $"<img src='{logoUrl}' alt='Logo' class='rounded-3 border' style='width: 40px; height: 40px; object-fit: cover;'>"
                : "<span> - </span>";
        }

        public static string GetWebsiteLink(string websiteUrl)
        {
            return !string.IsNullOrEmpty(websiteUrl)
                ? $"<a href='{websiteUrl}' target='_blank' rel='noopener' class='text-decoration-none'>Visit <i class='ri-external-link-line'></i></a>"
                : "<span> - </span>";
        }
    }

}
