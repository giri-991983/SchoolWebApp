using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using SchoolSoft.Data;
using SchoolSoft.Models;

namespace SchoolSoft.Pages.Institution
{
    public class EditModel : PageModel
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public EditModel(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _environment = environment ?? throw new ArgumentNullException(nameof(environment));
        }    
        public List<SelectListItem> PackageTypes { get; set; } = new List<SelectListItem>
        {
            new SelectListItem { Value = "1", Text = "Basic" },
            new SelectListItem { Value = "2", Text = "Standard" },
            new SelectListItem { Value = "3", Text = "Premium" }
        };
        public List<SelectListItem> Statuses { get; set; } = new List<SelectListItem>
        {
            new SelectListItem { Value = "1", Text = "Active" },
            new SelectListItem { Value = "0", Text = "Inactive" }
        };

        [BindProperty]
        public SchoolSoft.Models.Institution? Institution { get; set; }

        [BindProperty]
        public IFormFile? LogoFile { get; set; }

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            Institution = await _context.Institutions.FirstOrDefaultAsync(m => m.InstitutionID == id);

            if (Institution == null)
            {
                return NotFound();
            }
            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {


            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return new JsonResult(new { success = false, message = "Validation failed", errors });
            }

            try
            {
                if (Institution != null)
                {
                    var existingInstitution = await _context.Institutions.FindAsync(Institution.InstitutionID);
                    if (existingInstitution == null)
                    {
                        return new JsonResult(new { success = false, message = "Institution not found" });
                    }

                    if (LogoFile != null && LogoFile.Length > 0)
                    {
                        var allowedExtensions = new List<string> { ".jpg", ".jpeg", ".png" };

                        var uploadsFolder = Path.Combine(_environment.WebRootPath, "img", "InstitutionLogo");
                        Directory.CreateDirectory(uploadsFolder);
                        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(LogoFile.FileName);
                        var filePath = Path.Combine(uploadsFolder, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await LogoFile.CopyToAsync(stream);
                        }

                        if (!string.IsNullOrEmpty(existingInstitution.LogoUrl))
                        {
                            var oldFilePath = Path.Combine(_environment.WebRootPath, existingInstitution.LogoUrl.TrimStart('/'));
                            if (System.IO.File.Exists(oldFilePath))
                            {
                                System.IO.File.Delete(oldFilePath);
                            }
                        }
                        Institution.LogoUrl = "/img/InstitutionLogo/" + fileName;
                    }
                    else
                    {
                        Institution.LogoUrl = existingInstitution.LogoUrl;
                    }

                    _context.Entry(existingInstitution).CurrentValues.SetValues(Institution);
                    await _context.SaveChangesAsync();
                    return new JsonResult(new { success = true, message = "Institution updated successfully!" });
                }
                else
                {
                    return new JsonResult(new { success = false, message = $"Failed to update institution" });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to update institution: {ex.Message}" });
            }
        }

    }
}
