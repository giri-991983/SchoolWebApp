using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SchoolWebApp.Data;

namespace SchoolWebApp.Pages;

public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;
    private readonly ApplicationDbContext _context;

    public IndexModel(ILogger<IndexModel> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public record StatCard(string Label, int? Count, string Icon, string Color, string Page);

    public IList<StatCard> Stats { get; private set; } = new List<StatCard>();

    public bool StatsUnavailable { get; private set; }

    public async Task OnGetAsync()
    {
        try
        {
            Stats = new List<StatCard>
            {
                new("Institutions", await _context.Institutions.CountAsync(), "ri-government-line", "primary", "/Institution/Index"),
                new("Zones", await _context.Zones.CountAsync(), "ri-map-2-line", "info", "/Zone/Index"),
                new("Campuses", await _context.Campuses.CountAsync(), "ri-school-line", "success", "/Campus/Index"),
                new("Classes", await _context.Classes.CountAsync(), "ri-book-2-line", "warning", "/Class/Index"),
                new("Class rooms", await _context.ClassRooms.CountAsync(), "ri-door-open-line", "danger", "/ClassRoom/Index"),
                new("Courses", await _context.Courses.CountAsync(), "ri-book-open-line", "primary", "/Course/Index"),
                new("Course batches", await _context.CourseBatches.CountAsync(), "ri-group-line", "info", "/CourseBatch/Index"),
                new("Academic years", await _context.AcademicYears.CountAsync(), "ri-calendar-2-line", "success", "/MasterPages/AcademicYears/Index"),
            };
        }
        catch (Exception ex)
        {
            // The dashboard should still render if the database is unreachable.
            _logger.LogWarning(ex, "Could not load dashboard counts.");
            StatsUnavailable = true;
            Stats = new List<StatCard>
            {
                new("Institutions", null, "ri-government-line", "primary", "/Institution/Index"),
                new("Zones", null, "ri-map-2-line", "info", "/Zone/Index"),
                new("Campuses", null, "ri-school-line", "success", "/Campus/Index"),
                new("Classes", null, "ri-book-2-line", "warning", "/Class/Index"),
                new("Class rooms", null, "ri-door-open-line", "danger", "/ClassRoom/Index"),
                new("Courses", null, "ri-book-open-line", "primary", "/Course/Index"),
                new("Course batches", null, "ri-group-line", "info", "/CourseBatch/Index"),
                new("Academic years", null, "ri-calendar-2-line", "success", "/MasterPages/AcademicYears/Index"),
            };
        }
    }
}
