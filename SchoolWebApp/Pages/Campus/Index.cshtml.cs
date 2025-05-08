using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using SchoolWebApp.Data;
using SchoolWebApp.Models;
using SchoolWebApp.ViewComponents;
using System;
using System.Text.Encodings.Web;


namespace SchoolWebApp.Pages.Campus
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        private readonly IViewComponentHelper _viewComponentHelper;
        private readonly IServiceProvider _serviceProvider;
        private readonly ITempDataDictionaryFactory _tempDataFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;


        public IndexModel(IViewComponentHelper viewComponentHelper, IServiceProvider serviceProvider, ITempDataDictionaryFactory tempDataFactory, IHttpContextAccessor httpContextAccessor, ApplicationDbContext context)
        {
            _viewComponentHelper = viewComponentHelper;
            _serviceProvider = serviceProvider;
            _tempDataFactory = tempDataFactory;
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }


        public List<SchoolWebApp.Models.Campus> Campuses { get; set; } = new();
        public List<SchoolWebApp.Models.Institution> Institutions { get; set; } = new();
        public List<SchoolWebApp.Models.Zone> Zones { get; set; } = new();
        public List<SchoolWebApp.Models.CampusType> CampusTypes { get; set; } = new();
        public List<SelectListItem> Statuses { get; set; } = new()
        {
            new SelectListItem { Value = "1", Text = "Active" },
            new SelectListItem { Value = "0", Text = "Inactive" }
        };
        public List<City> Cities { get; set; } = new();
        public List<State> States { get; set; } = new();
        public List<Country> Countries { get; set; }
        [BindProperty]
        public SchoolWebApp.Models.Campus Campus { get; set; }

        public async Task OnGetAsync()
        {
            Campuses = await _context.Campuses
                .Include(c => c.Zone)
                .Include(c => c.Institution)
                .Include(c => c.CampusType)
                .ToListAsync();

            Institutions = await _context.Institutions.ToListAsync();
            Zones = await _context.Zones.ToListAsync();
            CampusTypes = await _context.CampusTypes.ToListAsync();
        }

        // ? Handler to get Zones by InstitutionID
        public async Task<JsonResult> OnGetZonesByInstitutionAsync(int institutionId)
        {
            var zones = await _context.Zones
                .Where(z => z.InstitutionID == institutionId)
                .Select(z => new { zoneID = z.ZoneID, zoneName = z.ZoneName })
                .ToListAsync();

            return new JsonResult(zones);
        }

        public async Task<IActionResult> OnPostCreateCampusAsync()
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                    );
                return new JsonResult(new { success = false, message = "Validation failed. Please check the following fields:", errors });
            }

            Campus.CreatedDate= DateTime.Now;
            Campus.CGUID = System.Guid.NewGuid().ToString().ToUpper();
           
            Campus.Status = 1;

            _context.Campuses.Add(Campus);
            await _context.SaveChangesAsync();

            return new JsonResult(new { success = true, message = "Campus created successfully" });
        }
        public async Task<IActionResult> OnGetEditCampusFormAsync(int id)
        {
            try
            {
                Campus = await _context.Campuses.FirstOrDefaultAsync(c =>c.CampusID == id);
                if (Campus == null)
                {
                    return new JsonResult(new { success = false, message = "Campus not found" });
                }

                // Load related data for dropdowns
                Institutions = await _context.Institutions.OrderBy(i => i.InstitutionName).ToListAsync();

                // Optionally load other related data if needed (e.g., CampusTypes, Zones)
                CampusTypes = await _context.CampusTypes.OrderBy(ct => ct.CampusTypeName).ToListAsync();
                Zones = await _context.Zones.OrderBy(z => z.ZoneName).ToListAsync();

                return Partial("~/Pages/Campus/_Edit.cshtml", this);
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to retrieve campus: {ex.Message}" });
            }
        }
        public async Task<IActionResult> OnPostEditCampusAsync()
        {
            if (!ModelState.IsValid)
            {
                return new JsonResult(new { success = false, message = "Invalid data" });
            }

            var existingCampus = await _context.Campuses.FindAsync(Campus.CampusID);
            if (existingCampus == null)
            {
                return new JsonResult(new { success = false, message = "Campus not found" });
            }

            _context.Entry(existingCampus).CurrentValues.SetValues(Campus);
            await _context.SaveChangesAsync();

            return new JsonResult(new { success = true, message = "Campus updated successfully" });
        }

        public async Task<IActionResult> OnPostDeleteCampusAsync(int id)
        {
            var campus = await _context.Campuses.FindAsync(id);
            if (campus == null)
            {
                return new JsonResult(new { success = false, message = "Campus not found" });
            }

            _context.Campuses.Remove(campus);
            await _context.SaveChangesAsync();

            return new JsonResult(new { success = true, message = "Campus deleted successfully" });
        }





        public async Task<IActionResult> OnGetLoadComponentAsync(int id)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            var actionContext = new ActionContext(httpContext, httpContext.GetRouteData(), new PageActionDescriptor());

            // Manually initialize the ViewComponentHelper
            var viewContext = new ViewContext(
                actionContext,
                new FakeView(), // You must define this class (see below)
                new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary()),
                _tempDataFactory.GetTempData(httpContext),
                TextWriter.Null,
                new HtmlHelperOptions()
            );

            ((IViewContextAware)_viewComponentHelper).Contextualize(viewContext);

            var html = await _viewComponentHelper.InvokeAsync("Master", new { viewname = "Zones", FilterIds = id.ToString(), SelectedIDs = 0 });

            using var writer = new StringWriter();
            html.WriteTo(writer, HtmlEncoder.Default);

            return Content(writer.ToString(), "text/html");

        }

        

        public async Task<IActionResult> OnGetLoadLocationAsync(string id, string locationType)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            var actionContext = new ActionContext(httpContext, httpContext.GetRouteData(), new PageActionDescriptor());
            var viewContext = new ViewContext(
                actionContext,
                new FakeView(),
                new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary()),
                _tempDataFactory.GetTempData(httpContext),
                TextWriter.Null,
                new HtmlHelperOptions()
            );

            ((IViewContextAware)_viewComponentHelper).Contextualize(viewContext);

            string viewnames;
            string filterIds;

            switch (locationType?.ToLower())
            {
                //case "countries":
                //    viewnames = "Countries";
                //    filterIds = "";
                //    break;

                case "states":
                    viewnames = "States";
                    //if (string.IsNullOrWhiteSpace(id) || !int.TryParse(id, out int countryId) || countryId <= 0)
                    //{
                    //    return Content("<option value=''>Select a country first</option>", "text/html");
                    //}
                    filterIds = id;
                    break;

                case "cities":
                    viewnames = "Cities";
                    //if (string.IsNullOrWhiteSpace(id) || !id.Contains(","))
                    //{
                    //    return Content("/*<option value=''>Select valid country and state</option>*/", "text/html");
                    //}
                    //var ids = id.Split(',');
                    //if (ids.Length != 2 || !int.TryParse(ids[0], out int parsedCountryId) || parsedCountryId <= 0 ||
                    //    !int.TryParse(ids[1], out int parsedStateId) || parsedStateId <= 0)
                    //{
                    //    return Content("/*<option value=''>Select valid country and state</option>*/", "text/html");
                    //}
                    filterIds = id;
                    break;

                default:
                    return BadRequest("Invalid location type specified.");
            }

            var html = await _viewComponentHelper.InvokeAsync("Master", new { viewname = viewnames, FilterIds = filterIds, SelectedIDs = 0 });

            using var writer = new StringWriter();
            html.WriteTo(writer, HtmlEncoder.Default);
            return Content(writer.ToString(), "text/html");
        }

    }



}
