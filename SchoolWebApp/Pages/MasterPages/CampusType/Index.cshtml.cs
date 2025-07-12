

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SchoolWebApp.Data;
using SchoolWebApp.Models;

namespace SchoolWebApp.Pages.MasterPages.CampusType
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public IndexModel(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public IList<Models.CampusType> CampusTypes { get; set; } = new List<Models.CampusType>();

        [BindProperty]
        public Models.CampusType CampusType { get; set; } = new Models.CampusType();

        public async Task OnGetAsync()
        {
            CampusTypes = await _context.CampusTypes.ToListAsync();
        }

        public async Task<IActionResult> OnPostCreateCampusTypeAsync()
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return new JsonResult(new { success = false, message = "Validation failed", errors });
            }

            try
            {
                var existingCampusType = await _context.CampusTypes
                    .FirstOrDefaultAsync(ct => ct.CampusTypeName == CampusType.CampusTypeName);
                if (existingCampusType != null)
                {
                    return new JsonResult(new { success = false, message = "This Campus Type already exists." });
                }

                _context.CampusTypes.Add(CampusType);
                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Campus Type created successfully!", id = CampusType.CampusTypeID });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to create campus type: {ex.Message}" });
            }
        }

        public async Task<IActionResult> OnGetEditCampusTypeFormAsync(int campusTypeId)
        {
            try
            {
                var campusType = await _context.CampusTypes.FindAsync(campusTypeId);
                if (campusType == null)
                {
                    return new JsonResult(new { success = false, message = "Campus Type not found." });
                }

                CampusType = campusType;
                return Partial("_Edit", this);
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to load edit form: {ex.Message}" });
            }
        }

        public async Task<IActionResult> OnPostEditCampusTypeAsync()
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return new JsonResult(new { success = false, message = "Validation failed", errors });
            }

            try
            {
                var existingCampusType = await _context.CampusTypes.FindAsync(CampusType.CampusTypeID);
                if (existingCampusType == null)
                {
                    return new JsonResult(new { success = false, message = "Campus Type not found." });
                }

                var duplicateCampusType = await _context.CampusTypes
                    .FirstOrDefaultAsync(ct => ct.CampusTypeName == CampusType.CampusTypeName && ct.CampusTypeID != CampusType.CampusTypeID);
                if (duplicateCampusType != null)
                {
                    return new JsonResult(new { success = false, message = "This Campus Type already exists." });
                }

                existingCampusType.CampusTypeName = CampusType.CampusTypeName;
                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Campus Type updated successfully!" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to update campus type: {ex.Message}" });
            }
        }

        public async Task<IActionResult> OnPostDeleteCampusTypeAsync(int campusTypeId)
        {
            try
            {
                var campusType = await _context.CampusTypes.FindAsync(campusTypeId);
                if (campusType == null)
                {
                    return new JsonResult(new { success = false, message = "Campus Type not found." });
                }

                _context.CampusTypes.Remove(campusType);
                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Campus Type deleted successfully!" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to delete campus type: {ex.Message}" });
            }
        }
    }
}
