using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using SchoolSoft.Data;
using SchoolSoft.Models;
namespace SchoolSoft.Pages.Institution
{
    public class CreateModel : PageModel
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public CreateModel(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _environment = environment ?? throw new ArgumentNullException(nameof(environment));
        }
        
        [BindProperty]
        public SchoolSoft.Models.Institution? Institution { get; set; }

        [BindProperty]
        public IFormFile? LogoFile { get; set; }

        public List<SelectListItem> PackageTypes { get; set; } = new List<SelectListItem>
        {
            new SelectListItem { Value = "1", Text = "Basic" },
            new SelectListItem { Value = "2", Text = "Standard" },
            new SelectListItem { Value = "3", Text = "Premium" }
        };      

        public IActionResult OnGet()
        {
            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
          
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                Console.WriteLine("ModelState errors: " + string.Join(", ", errors));
                return new JsonResult(new { success = false, message = "Validation failed", errors });
            }
            try
            {
                if (Institution != null)
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

                    _context.Institutions.Add(Institution);
                    await _context.SaveChangesAsync();
                    return new JsonResult(new
                    {
                        success = true,
                        message = "Institution created successfully!",
                        data = new { institutionID = Institution.InstitutionID, logoUrl = Institution.LogoUrl }
                    });
                }
                else
                {
                    return new JsonResult(new { success = false, message = $"Failed to create institution" });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to create institution: {ex.Message}" });
            }
        }

    }
}
