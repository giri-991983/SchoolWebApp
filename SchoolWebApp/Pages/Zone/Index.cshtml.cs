using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using SchoolWebApp.Data;
using SchoolWebApp.Models;
using System;
namespace SchoolWebApp.Pages.Zone
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;
       

        public IndexModel(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }       
        public IList<SchoolWebApp.Models.Zone>? Zones { get; set; }       
      

        public async Task OnGetAsync()
        {
            Institutions = await _context.Institutions.ToListAsync();
            Zones = await _context.Zones.ToListAsync();          
        }

        public async Task<IActionResult> OnPostDeleteZoneAsync(int id)
        {
            var zone = await _context.Zones.FindAsync(id);
            if (zone == null)
            {
                return new JsonResult(new { success = false, message = "Validation failed" });
                }

            _context.Zones.Remove(zone);
            await _context.SaveChangesAsync();
            return new JsonResult(new { success = true, message = "Zone deleted successfully" });
        }
        #region

        [BindProperty]
        public SchoolWebApp.Models.Zone? Zone { get; set; }

        public IList<SchoolWebApp.Models.Institution>? Institutions { get; set; }

        public async Task<IActionResult> OnPostCreateZoneAsync()
        {
            if (!ModelState.IsValid)
            {
                return new JsonResult(new { success = false, message = "Validation failed" });
            }
            try
            {
                if (Zone != null)
                {
                    Zone.Status = 1;
                    Zone.ZGUID= System.Guid.NewGuid().ToString().ToUpper();
                    Zone.CreatedDate = DateTime.Now;
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

        #endregion
    }
}