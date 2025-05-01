using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using SchoolWebApp.Data;
using SchoolWebApp.Models;

namespace SchoolWebApp.Pages.Institution
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

        public IList<Models.Institution>? Institutions { get; set; }
        public async Task OnGetAsync()
        {
            Institutions = await _context.Institutions.OrderBy(a => a.InstitutionName).ToListAsync();
        }


        #region Add New Institution Data

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
        public Models.Institution Institution { get; set; }

        [BindProperty]
        public IFormFile? LogoFile { get; set; }

        public async Task<IActionResult> OnPostCreateInstitutionAsync()
        {

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                Console.WriteLine("ModelState errors: " + string.Join(", ", errors));
                return new JsonResult(new { success = false, message = "Validation failed", errors });
            }
            try
            {
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
                    Institution.LogoUrl = "/img/InstitutionLogo/" + fileName;
                }

                Institution.IGUID = System.Guid.NewGuid().ToString().ToUpper();
                Institution.CreatedDate = DateTime.Now;
                Institution.Status = 1;
                _context.Institutions.Add(Institution);
                await _context.SaveChangesAsync();
                return new JsonResult(new
                {
                    success = true,
                    message = "Institution created successfully!",
                    data = new { institutionID = Institution.InstitutionID, logoUrl = Institution.LogoUrl }
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to create institution: {ex.Message}" });
            }
        }

        #endregion


        #region Edit Instutions


       
      public async Task<IActionResult> OnGetEditFormAsync(int id)
        {
          try
              {
        var institution = await _context.Institutions.FindAsync(id);
        if (institution == null)
        {
            return NotFound();
        }

        Institution = institution;
        return Partial("~/Pages/Institution/_Edit.cshtml", this);
    }
    catch (Exception ex)
    {
        // Log the error (optional: use a logging framework)
        return new JsonResult(new
        {
            success = false,
            message = $"An error occurred while loading the edit form: {ex.Message}"
        });
    }
}

        public async Task<IActionResult> OnPostEditInstitutionAsync()
        {


            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return new JsonResult(new { success = false, message = "Validation failed", errors });
            }

            try
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
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to update institution: {ex.Message}" });
            }
        }

        public async Task<IActionResult> OnPostDeleteInstitutionAsync(int id)
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

        #endregion


    }
}
