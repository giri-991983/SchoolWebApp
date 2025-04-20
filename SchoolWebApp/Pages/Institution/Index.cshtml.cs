using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using SchoolSoft.Data;
using SchoolSoft.Models;
namespace SchoolSoft.Pages.Institution
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public IndexModel(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _environment = environment ?? throw new ArgumentNullException(nameof(environment));
        }

        public IList<SchoolSoft.Models.Institution>? Institutions { get; set; }


        public async Task OnGetAsync()
        {
            Institutions = await _context.Institutions.ToListAsync();
        }
        public async Task<IActionResult> OnPostDeleteInstitutionAsync(int id )
        { 
            if (id <= 0)
            {
                return new JsonResult(new { success = false, message = "Invalid institution ID" });
            }

            try
            {
                var institution = await _context.Institutions.FirstOrDefaultAsync(i => i.InstitutionID == id);
                if (institution == null)
                {
                    return new JsonResult(new { success = false, message = "Institution not found" });
                }

                if (!string.IsNullOrEmpty(institution.LogoUrl))
                {
                    var filePath = Path.Combine(_environment.WebRootPath, institution.LogoUrl.TrimStart('/'));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                _context.Institutions.Remove(institution);
                await _context.SaveChangesAsync();
                return new JsonResult(new { success = true, message = "Institution deleted successfully!" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to delete institution: {ex.Message}" });
            }
        }
    }
}
