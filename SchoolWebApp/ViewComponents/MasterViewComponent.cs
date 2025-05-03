using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolWebApp.Data;
using SchoolWebApp.Models;

namespace SchoolWebApp.ViewComponents
{

    public class MasterViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;

        public MasterViewComponent(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IViewComponentResult> InvokeAsync(string viewname, string? FilterIds, string? SelectedIDs)
        {
            if (viewname == "Institutions")
            {
                var Inst = await _context.Institutions.OrderBy(a => a.InstitutionName).ToListAsync();
                ViewBag.Institutions = Inst;
            }
            else if (viewname == "Zones")
            {
                var zonses = new List<Zone>();

                if (!string.IsNullOrEmpty(FilterIds))
                {
                    var filterids = FilterIds.Split(",").Select(int.Parse).ToArray();
                    zonses = await _context.Zones.Where(a => filterids.Contains(a.InstitutionID)).OrderByDescending(p => p.ZoneID).ToListAsync();
                }
                else
                {
                    zonses = await _context.Zones.OrderByDescending(p => p.ZoneID).ToListAsync();
                }
                ViewBag.ResZones = zonses;
            }

            ViewBag.selectedIDs = (!string.IsNullOrEmpty(SelectedIDs) ? SelectedIDs : "0");

            return View();
        }



    }
}
