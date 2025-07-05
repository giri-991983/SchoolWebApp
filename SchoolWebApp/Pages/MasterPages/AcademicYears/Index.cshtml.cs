using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SchoolWebApp.Data;
using SchoolWebApp.Models;
using System.Text.RegularExpressions;

namespace SchoolWebApp.Pages.MasterPages.AcademicYears
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public IndexModel(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public IList<Models.AcademicYears> AcademicYears { get; set; } = new List<Models.AcademicYears>();

        [BindProperty]
        public Models.AcademicYears AcademicYear { get; set; } = new Models.AcademicYears();

        public async Task OnGetAsync()
        {
            AcademicYears = await _context.AcademicYears.ToListAsync();
        }

        public async Task<IActionResult> OnPostCreateAcademicYearAsync()
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return new JsonResult(new { success = false, message = "Validation failed.", errors });
            }

            try
            {
                if (string.IsNullOrWhiteSpace(AcademicYear.AcademicYear))
                {
                    return new JsonResult(new { success = false, message = "Academic Year is required." });
                }

                if (!Regex.IsMatch(AcademicYear.AcademicYear.Trim(), @"^\d{4}-\d{4}$"))
                {
                    return new JsonResult(new { success = false, message = "Academic Year must be in the format 'YYYY-YYYY' (e.g., 2025-2026)." });
                }

                var years = AcademicYear.AcademicYear.Trim().Split('-');
                if (!int.TryParse(years[0], out int startYear) || !int.TryParse(years[1], out int endYear))
                {
                    return new JsonResult(new { success = false, message = "Academic Year must contain valid years." });
                }

                if (startYear < 1900 || endYear > 2100 || startYear >= endYear)
                {
                    return new JsonResult(new { success = false, message = "Academic Year must be a range between 1900 and 2100 with start year less than end year." });
                }

              
                _context.AcademicYears.Add(AcademicYear);
                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Academic Year created successfully!", id = AcademicYear.AcademicYearID });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to create academic year: {ex.Message}" });
            }
        }

        public async Task<IActionResult> OnGetEditAcademicYearFormAsync(int academicYearId)
        {
            try
            {
                var academicYear = await _context.AcademicYears.FindAsync(academicYearId);
                if (academicYear == null)
                {
                    return new JsonResult(new { success = false, message = "Academic Year not found." });
                }

                AcademicYear = academicYear;
                return Partial("_Edit", this);
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to load edit form: {ex.Message}" });
            }
        }

        public async Task<IActionResult> OnPostEditAcademicYearAsync()
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return new JsonResult(new { success = false, message = "Validation failed.", errors });
            }

            try
            {
                var existingAcademicYear = await _context.AcademicYears.FindAsync(AcademicYear.AcademicYearID);
                if (existingAcademicYear == null)
                {
                    return new JsonResult(new { success = false, message = "Academic Year not found." });
                }

                if (string.IsNullOrWhiteSpace(AcademicYear.AcademicYear))
                {
                    return new JsonResult(new { success = false, message = "Academic Year is required." });
                }

                if (!Regex.IsMatch(AcademicYear.AcademicYear.Trim(), @"^\d{4}-\d{4}$"))
                {
                    return new JsonResult(new { success = false, message = "Academic Year must be in the format 'YYYY-YYYY' (e.g., 2025-2026)." });
                }

                var years = AcademicYear.AcademicYear.Trim().Split('-');
                if (!int.TryParse(years[0], out int startYear) || !int.TryParse(years[1], out int endYear))
                {
                    return new JsonResult(new { success = false, message = "Academic Year must contain valid years." });
                }

                if (startYear < 1900 || endYear > 2100 || startYear >= endYear)
                {
                    return new JsonResult(new { success = false, message = "Academic Year must be a range between 1900 and 2100 with start year less than end year." });
                }

                existingAcademicYear.AcademicYear = AcademicYear.AcademicYear;
                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Academic Year updated successfully!" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to update academic year: {ex.Message}" });
            }
        }

        public async Task<IActionResult> OnPostDeleteAcademicYearAsync(int academicYearId)
        {
            try
            {
                var academicYear = await _context.AcademicYears.FindAsync(academicYearId);
                if (academicYear == null)
                {
                    return new JsonResult(new { success = false, message = "Academic Year not found." });
                }

                _context.AcademicYears.Remove(academicYear);
                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Academic Year deleted successfully!" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to delete academic year: {ex.Message}" });
            }
        }
    }
}