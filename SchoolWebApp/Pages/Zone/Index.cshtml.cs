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
            Institutions = await _context.Institutions.OrderBy(a => a.InstitutionName).ToListAsync();
            Zones = await _context.Zones.OrderBy(a => a.ZoneName).ToListAsync();          
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

        #region
        public async Task<IActionResult> OnGetEditZoneFormAsync(int id)
        {
            try
            {
                 Zone = await _context.Zones.FindAsync(id);
                if (Zone == null)
                {
                    return new JsonResult(new { success = false, message = "Zone not found" });
                }
                Institutions = await _context.Institutions.OrderBy(i => i.InstitutionName).ToListAsync();

                return Partial("~/Pages/Zone/_Edit.cshtml", this);
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to retrieve zone: {ex.Message}" });
            }
        }
        public async Task<IActionResult> OnPostEditZoneAsync()
      
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
    

        #endregion

    }
}