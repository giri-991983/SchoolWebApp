using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
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

        public async Task<IViewComponentResult> InvokeAsync(string viewname, string? FilterIds, int? SelectedIDs = null, IEnumerable<int>? Selected = null)
        {
            
            ViewBag.SelectedIds = Selected ?? (SelectedIDs.HasValue ? new List<int> { SelectedIDs.Value } : new List<int>());
            //ViewBag.CampusID = CampusID; // Pa
            //ViewBag.RenderMode = RenderMode; // Pass RenderMode to the view
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
            else if (viewname == "CampusTypes")
            {
                var campusTypes = await _context.CampusTypes.OrderBy(ct => ct.CampusTypeName).ToListAsync();
                ViewBag.CampusTypes = campusTypes;
            }
            else if (viewname == "Countries")
            {
                var countries = await _context.Countries
                    .OrderBy(c => c.CountryName)
                    .ToListAsync();
                ViewBag.Countries = countries;
            }
            else if (viewname == "States")
            {
                var states = new List<State>();

                if (!string.IsNullOrEmpty(FilterIds))
                {
                    var filterIds = FilterIds.Split(",", StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).Where(id => id != 0).ToList();

                    states = await _context.States
                        .Where(s => filterIds.Contains(s.CountryID))
                        .OrderBy(s => s.StateName)
                        .ToListAsync();
                }
              
                ViewBag.States = states;
            }
            else if (viewname == "Cities")
            {
                var cities = new List<City>();

                if (!string.IsNullOrEmpty(FilterIds))
                {
                    var filterIds = FilterIds.Split(",", StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).Where(id => id != 0).ToList();
                    if (filterIds.Count == 2) // Expecting CountryID and StateID
                    {
                        int countryId = filterIds[0];
                        int stateId = filterIds[1];
                        cities = await _context.Cities
                            .Where(c => c.CountryID == countryId && c.StateID == stateId)
                            .OrderBy(c => c.CityName)
                            .ToListAsync();
                    }
                    else if (filterIds.Count == 1) // Only CountryID provided
                    {
                        int countryId = filterIds[0];
                        cities = await _context.Cities
                            .Where(c => c.CountryID == countryId)
                            .OrderBy(c => c.CityName)
                            .ToListAsync();
                    }
                }
                else
                {
                    cities = await _context.Cities
                        .OrderBy(c => c.CityName)
                        .ToListAsync();
                }
                ViewBag.Cities = cities;
            }
            else if (viewname == "Campuses")
            {
                var campuses = new List<Campus>();
                if (!string.IsNullOrEmpty(FilterIds))
                {
                    var filterids = FilterIds.Split(",").Select(int.Parse).ToArray();
                    campuses = await _context.Campuses
                   .Where(c => filterids.Contains(c.InstitutionID))

                   .OrderBy(c => c.CampuseName)
                   .ToListAsync();

                }
                else
                {
                    campuses = await _context.Campuses
                        .OrderBy(c => c.CampuseName)
                        .ToListAsync();
                }
                ViewBag.Campuses = campuses;

            }

            else if (viewname == "BoardingTypes")
            {

                var boardingTypes = await _context.BoardingTypes
                            .OrderBy(bt => bt.BoardingType)
                           
                            .ToListAsync();
                ViewBag.Items = boardingTypes ?? new List<BoardingTypes>();
            }
    
            ViewBag.selectedIDs = SelectedIDs;

            return View(viewname);
        }

       

    }
}
