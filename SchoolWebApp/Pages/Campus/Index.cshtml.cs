using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using SchoolWebApp.Data;
using SchoolWebApp.Models;
using SchoolWebApp.ViewComponents;
using System;
using System.Text.Encodings.Web;
using System.Threading.Tasks;



namespace SchoolWebApp.Pages.Campus
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        private readonly IConfiguration _configuration;
        private readonly IViewComponentHelper _viewComponentHelper;
        private readonly IServiceProvider _serviceProvider;
        private readonly ITempDataDictionaryFactory _tempDataFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;


        public IndexModel(IViewComponentHelper viewComponentHelper, IServiceProvider serviceProvider, ITempDataDictionaryFactory tempDataFactory, IHttpContextAccessor httpContextAccessor, ApplicationDbContext context,IConfiguration configuration)
        {
           
            _viewComponentHelper = viewComponentHelper;
            _serviceProvider = serviceProvider;
            _tempDataFactory = tempDataFactory;
            _httpContextAccessor = httpContextAccessor;
            _context = context;
            _configuration = configuration;
        }


        public List<SchoolWebApp.Models.Campus> Campuses { get; set; } = new();
        public List<SchoolWebApp.Models.Institution> Institutions { get; set; } = new();
        public List<SchoolWebApp.Models.Zone> Zones { get; set; } = new();
        public List<SchoolWebApp.Models.CampusType> CampusTypes { get; set; } = new();
        public List<SchoolWebApp.Models.BoardingTypes> BoardingTypes { get; set; } = new();
        public List<SchoolWebApp.Models.CampusBoardingType> CampusBoardingTypes { get; set; } = new();

        [BindProperty]
        public SchoolWebApp.Models.CampusViewModel CampusVM { get; set; }

        public List<SelectListItem> Statuses { get; set; } = new()
        {
            new SelectListItem { Value = "1", Text = "Active" },
            new SelectListItem { Value = "0", Text = "Inactive" }
        };
        public List<City> Cities { get; set; } = new();
        public List<State> States { get; set; } = new();
        public List<Country> Countries { get; set; }
        public string GoogleMapsApiKey { get; set; } = string.Empty;

        public async Task OnGetAsync()
        {
          
            Campuses = await _context.Campuses
                .Include(c => c.Zone)
                .Include(c => c.Institution)
                .Include(c => c.CampusType)
                  .Include(c => c.CampusBoardingTypes)
                .ThenInclude(cbt => cbt.BoardingType)
                .ToListAsync();
            //CampusBoardingTypes = await _context.CampusBoardingTypes
            //  .Include(cbt => cbt.BoardingType)
            //  .ToListAsync();
            //Institutions = await _context.Institutions.ToListAsync();
            //Zones = await _context.Zones.ToListAsync();
            //CampusTypes = await _context.CampusTypes.ToListAsync();
            //BoardingTypes = await _context.BoardingTypes.ToListAsync();
            //Countries = await _context.Countries.OrderBy(c => c.CountryName).ToListAsync();
            //States = await _context.States.OrderBy(s => s.StateName).ToListAsync();
            //Cities = await _context.Cities.OrderBy(c => c.CityName).ToListAsync();
        }

        public async Task<IActionResult> OnGetZonesByInstitutionAsync(int institutionId)
        {
            if (institutionId <= 0)
            {
                return new JsonResult(new { success = false, message = "Invalid institutionId" });
            }

            try
            {
                var zones = await _context.Zones
                    .Where(z => z.InstitutionID == institutionId)
                    .OrderBy(z => z.ZoneName)
                    .ToListAsync();

             

                var result = zones.Select(z => new { z.ZoneID, z.ZoneName }).ToList();
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                
                return StatusCode(500, new { success = false, message = "Server error while fetching zones" });
            }
        }

        public async Task<IActionResult> OnGetCampusesByInstitutionAndZoneAsync(int institutionId, int zoneId)
        {
            List<Models.Campus> campuses;
            campuses = await _context.Campuses
               .Include(c => c.Institution)
               .Include(c => c.CampusType)
               .Include(c => c.Zone)
               .OrderBy(c => c.CampuseName)
               .ToListAsync();

            if (institutionId > 0)
            {
                campuses = campuses.Where(c => c.InstitutionID == institutionId).ToList();
            }

            if (zoneId > 0)
            {
                campuses = campuses.Where(c => c.ZoneID == zoneId).ToList();
            }

            return Partial("_CampusTablePartial", campuses);
        }


        public async Task<IActionResult> OnPostCreateCampusAsync()
        {
            

            var campus = new SchoolWebApp.Models.Campus
            {
                InstitutionID = CampusVM.Campus.InstitutionID,
                ZoneID = CampusVM.Campus.ZoneID,
                CGUID = Guid.NewGuid().ToString().ToUpper(),
                CampuseName = CampusVM.Campus.CampuseName,
                AffiliationNo = CampusVM.Campus.AffiliationNo,
                SchoolCode = CampusVM.Campus.SchoolCode,
                CampusTypeID = CampusVM.Campus.CampusTypeID,
                PhoneNos = CampusVM.Campus.PhoneNos,
                Address = CampusVM.Campus.Address,
                Locality = CampusVM.Campus.Locality,
                CityID = CampusVM.Campus.CityID,
                StateID = CampusVM.Campus.StateID,
                CountryID = CampusVM.Campus.CountryID,
                PinCode = CampusVM.Campus.PinCode,
                Status = 1,
                CreatedDate = DateTime.Now
            };



            _context.Campuses.Add(campus);
            await _context.SaveChangesAsync();
            foreach (var boardingTypeId in CampusVM.BoardingTypeIDs ?? new List<int>())
            {
                _context.CampusBoardingTypes.Add(new Models.CampusBoardingType
                {

                    InstitutionID = campus.InstitutionID,
                    CampusID = campus.CampusID,
                    BoardingTypeID = boardingTypeId,
                  
                    IsActive = true,
                    CreatedDate = DateTime.Now


                   
                });
            }
            await _context.SaveChangesAsync();
           
            return new JsonResult(new { success = true, message = "Campus created successfully" });
        }
        public async Task<IActionResult> OnGetEditCampusFormAsync(int id)
        {
            try
            {
               
                var campus = await _context.Campuses
                    .Include(c => c.Institution)
                    .Include(c => c.Zone)
                    .Include(c => c.CampusType)
                   .Include(c => c.CampusBoardingTypes) // This now works because the navigation property exists
                    .FirstOrDefaultAsync(c => c.CampusID == id);
               
                if (campus == null)
                {
                    Console.WriteLine("Campus not found");
                    return new JsonResult(new { success = false, message = "Campus not found" });
                }
                var boardingType = await _context.CampusBoardingTypes
                    .Where(b => b.CampusID == id)
                    .Select(b => b.BoardingTypeID)
                    .ToListAsync();

             

                CampusVM = new CampusViewModel
                {
                    Campus = new SchoolWebApp.Models.Campus
                    {
                        CampusID = campus.CampusID,
                        InstitutionID = campus.InstitutionID,
                        ZoneID = campus.ZoneID,
                        CGUID = campus.CGUID ?? string.Empty,
                        CampuseName = campus.CampuseName ?? string.Empty,
                        AffiliationNo = campus.AffiliationNo ?? string.Empty,
                        SchoolCode = campus.SchoolCode ?? string.Empty,
                        CampusTypeID = campus.CampusTypeID,
                        PhoneNos = campus.PhoneNos ?? string.Empty,
                        Address = campus.Address ?? string.Empty,
                        Locality = campus.Locality ?? string.Empty,
                        CityID = campus.CityID,
                        StateID = campus.StateID,
                        CountryID = campus.CountryID,
                        PinCode = campus.PinCode ?? string.Empty,
                        Status = campus.Status,
                        CreatedDate = campus.CreatedDate,
                        Institution = campus.Institution,
                        Zone = campus.Zone,
                        CampusType = campus.CampusType
                    },
                    BoardingTypeIDs = boardingType ?? new List<int>()
                    //CampusBoardingTypes = new SchoolWebApp.Models.CampusBoardingType
                    //{
                    //    BoardingTypeID = boardingType?.BoardingTypeID ?? 0
                    //}
                };

                // Load dropdown data with null checks
                Institutions = await _context.Institutions.OrderBy(i => i.InstitutionName).ToListAsync();
                CampusTypes = await _context.CampusTypes.OrderBy(ct => ct.CampusTypeName).ToListAsync();
                Zones = await _context.Zones.OrderBy(z => z.ZoneName).ToListAsync();
                BoardingTypes = await _context.BoardingTypes.OrderBy(bt => bt.BoardingType).ToListAsync();
                Countries = await _context.Countries.OrderBy(c => c.CountryName).ToListAsync();
                States = await _context.States.OrderBy(s => s.StateName).ToListAsync();
                Cities = await _context.Cities.OrderBy(c => c.CityName).ToListAsync();
                return Partial("~/Pages/Campus/_Edit.cshtml", this);

            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to retrieve campus: {ex.Message}" });
            }
        }

       


        public async Task<IActionResult> OnPostEditCampusAsync(CampusViewModel CampusVM)
        {
            if (CampusVM == null)
            {
                Console.WriteLine("CampusVM is null");
                return new JsonResult(new { success = false, message = "Invalid form data: CampusVM is null" });
            }

            Console.WriteLine($"CampusVM.Campus={(CampusVM.Campus != null ? "not null" : "null")}");
         
            var existingCampus = await _context.Campuses.Include(c => c.CampusBoardingTypes).FirstOrDefaultAsync(c => c.CampusID == CampusVM.Campus.CampusID);
            if (existingCampus == null)
            {
                return new JsonResult(new { success = false, message = "Campus not found" });
            }
            existingCampus.InstitutionID = CampusVM.Campus.InstitutionID;
            existingCampus.ZoneID = CampusVM.Campus.ZoneID;
            existingCampus.CGUID = CampusVM.Campus.CGUID;
            existingCampus.CampuseName = CampusVM.Campus.CampuseName;
            existingCampus.AffiliationNo = CampusVM.Campus.AffiliationNo;
            existingCampus.SchoolCode = CampusVM.Campus.SchoolCode;
            existingCampus.CampusTypeID = CampusVM.Campus.CampusTypeID;
            existingCampus.PhoneNos = CampusVM.Campus.PhoneNos;
            existingCampus.Address = CampusVM.Campus.Address;
            existingCampus.Locality = CampusVM.Campus.Locality;
            existingCampus.CityID = CampusVM.Campus.CityID;
            existingCampus.StateID = CampusVM.Campus.StateID;
            existingCampus.CountryID = CampusVM.Campus.CountryID;
            existingCampus.PinCode = CampusVM.Campus.PinCode;
            existingCampus.Status = CampusVM.Campus.Status;
            var existingBoardingTypes = await _context.CampusBoardingTypes
                            .Where(b => b.CampusID == CampusVM.Campus.CampusID)
                            .ToListAsync();

            var updatedBoardingTypeIds = CampusVM.BoardingTypeIDs ?? new List<int>();

            // Remove unselected boarding types
            var boardingTypesToRemove = existingBoardingTypes
                .Where(bt => !updatedBoardingTypeIds.Contains(bt.BoardingTypeID)).ToList();

            _context.CampusBoardingTypes.RemoveRange(boardingTypesToRemove);

            // Add newly selected boarding types
            var existingBoardingTypeIds = existingBoardingTypes.Select(bt => bt.BoardingTypeID).ToList();
            var boardingTypesToAdd = updatedBoardingTypeIds
                .Where(id => !existingBoardingTypeIds.Contains(id))
                .ToList();

            foreach (var boardingTypeId in boardingTypesToAdd)
            {
                _context.CampusBoardingTypes.Add(new Models.CampusBoardingType
                {
                    InstitutionID = CampusVM.Campus.InstitutionID,
                    CampusID = CampusVM.Campus.CampusID,
                    BoardingTypeID = boardingTypeId,
                    IsActive = true,
                    CreatedDate = DateTime.Now
                });
            }
          
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
            var boardingTypes = await _context.CampusBoardingTypes
                .Where(b => b.CampusID == id)
                .ToListAsync();
            _context.CampusBoardingTypes.RemoveRange(boardingTypes);
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

            var html = await _viewComponentHelper.InvokeAsync("Master", new { viewname = "Zones", FilterIds = id.ToString(), SelectedIDs = (int?)null });
        

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
               

                case "states":
                    viewnames = "States";
                    
                    filterIds = id;
                    break;

                case "cities":
                    viewnames = "Cities";
                   
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

        //public async Task<IActionResult> OnGetSearchCountryByNameAsync(string name)
        //{
        //    if (string.IsNullOrEmpty(name))
        //        return new JsonResult(new { success = false, message = "Country name is required" });

        //    var country = await _context.Countries
        //        .Where(c => c.CountryName.Contains(name) || name.Contains(c.CountryName))
        //        .Select(c => new { c.CountryID, c.CountryName })
        //        .FirstOrDefaultAsync();

        //    if (country == null)
        //        return new JsonResult(new { success = false, message = "Country not found" });

        //    return new JsonResult(new { success = true, country });
        //}

        //public async Task<IActionResult> OnGetSearchStateByNameAsync(string name, int countryId)
        //{
        //    if (string.IsNullOrEmpty(name))
        //        return new JsonResult(new { success = false, message = "State name is required" });

        //    var state = await _context.States
        //        .Where(s => s.CountryID == countryId && (s.StateName.Contains(name) || name.Contains(s.StateName)))
        //        .Select(s => new { s.StateID, s.StateName, s.CountryID })
        //        .FirstOrDefaultAsync();

        //    if (state == null)
        //        return new JsonResult(new { success = false, message = "State not found" });

        //    return new JsonResult(new { success = true, state });
        //}

        //public async Task<IActionResult> OnGetSearchCityByNameAsync(string name, int countryId, int stateId)
        //{
        //    if (string.IsNullOrEmpty(name))
        //        return new JsonResult(new { success = false, message = "City name is required" });

        //    var city = await _context.Cities
        //        .Where(c => c.CountryID == countryId && c.StateID == stateId && (c.CityName.Contains(name) || name.Contains(c.CityName)))
        //        .Select(c => new { c.CityID, c.CityName, c.StateID, c.CountryID })
        //        .FirstOrDefaultAsync();

        //    if (city == null)
        //        return new JsonResult(new { success = false, message = "City not found" });

        //    return new JsonResult(new { success = true, city });
        //}

       
    }



}
