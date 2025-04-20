using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using SchoolSoft.Data;
using SchoolSoft.Models;
using System;
namespace SchoolSoft.Pages.Zone
{
    public class CreateModel : PageModel
    {
        private readonly ApplicationDbContext _context;


        public CreateModel(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [BindProperty]
        public SchoolSoft.Models.Zone? Zone { get; set; }

        public IList<SchoolSoft.Models.Institution>? Institutions { get; set; }

        public async Task<IActionResult> OnGetAsync()
        {

            Institutions = await _context.Institutions.ToListAsync();
            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return new JsonResult(new { success = false, message = "Validation failed" });
            }
            try
            {
                if (Zone != null)
                {
                    _context.Zones.Add(Zone);
                    await _context.SaveChangesAsync();
                    return new JsonResult(new { success = true, message = "Zone Created successfully" });
                }
                else
                {
                    return new JsonResult(new { success = false, message = $"Failed to create Zone" });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to create Zone: {ex.Message}" });
            }
        }
    }
}