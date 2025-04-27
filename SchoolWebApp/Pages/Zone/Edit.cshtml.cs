using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using SchoolWebApp.Data;
using SchoolWebApp.Models;
using System;
namespace SchoolWebApp.Pages.Zone
{
    public class EditModel : PageModel
    {
        private readonly ApplicationDbContext _context;
       

        public EditModel(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [BindProperty]
        public SchoolWebApp.Models.Zone? Zone { get; set; }
        public IList<SchoolWebApp.Models.Institution>? Institutions { get; set; }

        public IList<SelectListItem> Statuses { get; set; } = new List<SelectListItem>
        {
            new SelectListItem { Value = "1", Text = "Active" },
            new SelectListItem { Value = "0", Text = "Inactive" }
        };


        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            Zone = await _context.Zones.FirstOrDefaultAsync(m => m.ZoneID == id);
            Institutions = await _context.Institutions.ToListAsync();
            if (Zone == null)
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
                if (Zone != null)
                {
                    var existingZone = await _context.Zones.FindAsync(Zone.ZoneID);
                    if (existingZone == null)
                    {
                        return new JsonResult(new { success = false, message = "Zone not found" });
                    } 

                    _context.Entry(existingZone).CurrentValues.SetValues(Zone);
                    await _context.SaveChangesAsync();
                    return new JsonResult(new { success = true, message = "Zone updated successfully!" });
                }
                else
                {
                    return new JsonResult(new { success = false, message = $"Failed to update Zone" });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to update Zone: {ex.Message}" });
            }
        }
    }
}