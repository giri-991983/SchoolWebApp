


//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Mvc.RazorPages;
//using Microsoft.EntityFrameworkCore;
//using SchoolWebApp.Data;
//using SchoolWebApp.Models;
//using System.Collections.Generic;
//using System.Threading.Tasks;

//namespace SchoolWebApp.Pages.MasterPages.CampusType
//{
//    public class IndexModel : PageModel
//    {
//        private readonly ApplicationDbContext _context;

//        public IndexModel(ApplicationDbContext context)
//        {
//            _context = context;
//        }

//        public IList<Models.CampusType> CampusTypes { get; set; } = new List<Models.CampusType>();
//        public Models.CampusType NewCampusType { get; set; } = new Models.CampusType();

//        public async Task OnGetAsync()
//        {
//            CampusTypes = await _context.CampusTypes.ToListAsync();
//        }

//        public async Task<IActionResult> OnPostCreateCampusTypeAsync(string campusTypeName)
//        {
//            if (string.IsNullOrWhiteSpace(campusTypeName))
//            {
//                return new JsonResult(new { success = false, message = "Campus Type Name is required." });
//            }
//            if (campusTypeName.Length > 50)
//            {
//                return new JsonResult(new { success = false, message = "Campus Type Name must be less than 50 characters." });
//            }
//            var existingCampusType = await _context.CampusTypes
//                .FirstOrDefaultAsync(ct => ct.CampusTypeName == campusTypeName);
//            if (existingCampusType != null)
//            {
//                return new JsonResult(new { success = false, message = "This Campus Type already exists." });
//            }

//            var campusType = new Models.CampusType { CampusTypeName = campusTypeName };
//            _context.CampusTypes.Add(campusType);
//            await _context.SaveChangesAsync();

//            return new JsonResult(new { success = true, message = "Campus Type created successfully!", id = campusType.CampusTypeID });
//        }

//        public async Task<IActionResult> OnGetEditCampusTypeFormAsync(int campusTypeId)
//        {
//            var campusType = await _context.CampusTypes.FirstOrDefaultAsync(ct => ct.CampusTypeID == campusTypeId);
//            if (campusType == null)
//            {
//                return new JsonResult(new { success = false, message = "Campus Type not found." });
//            }
//            return Partial("_Edit", campusType);
//        }

//        public async Task<IActionResult> OnPostEditCampusTypeAsync(int campusTypeId, string campusTypeName)
//        {
//            var campusType = await _context.CampusTypes.FindAsync(campusTypeId);
//            if (campusType == null)
//            {
//                return new JsonResult(new { success = false, message = "Campus Type not found." });
//            }
//            if (string.IsNullOrWhiteSpace(campusTypeName))
//            {
//                return new JsonResult(new { success = false, message = "Campus Type Name is required." });
//            }
//            if (campusTypeName.Length > 50)
//            {
//                return new JsonResult(new { success = false, message = "Campus Type Name must be less than 50 characters." });
//            }
//            var existingCampusType = await _context.CampusTypes
//                .FirstOrDefaultAsync(ct => ct.CampusTypeName == campusTypeName && ct.CampusTypeID != campusTypeId);
//            if (existingCampusType != null)
//            {
//                return new JsonResult(new { success = false, message = "This Campus Type already exists." });
//            }

//            campusType.CampusTypeName = campusTypeName;
//            await _context.SaveChangesAsync();

//            return new JsonResult(new { success = true, message = "Campus Type updated successfully!" });
//        }

//        public async Task<IActionResult> OnPostDeleteCampusTypeAsync(int campusTypeid)
//        {
//            var campusType = await _context.CampusTypes.FindAsync(campusTypeid);
//            if (campusType == null)
//            {
//                return new JsonResult(new { success = false, message = "Campus Type not found." });
//            }

//            _context.CampusTypes.Remove(campusType);
//            await _context.SaveChangesAsync();

//            return new JsonResult(new { success = true, message = "Campus Type deleted successfully!" });
//        }
//    }
//}


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
