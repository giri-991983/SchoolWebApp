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
    }
}