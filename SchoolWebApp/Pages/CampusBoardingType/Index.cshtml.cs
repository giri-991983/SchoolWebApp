using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using SchoolWebApp.Data;
using SchoolWebApp.Models;
using System.Collections.Generic;
using System.Linq;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace SchoolWebApp.Pages.CampusBoardingType
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

        public List<SchoolWebApp.Models.CampusBoardingType> CampusBoardingTypes { get; set; } = new();
        public List<SchoolWebApp.Models.Institution> Institutions { get; set; } = new();
        public List<SchoolWebApp.Models.Campus> Campuses { get; set; } = new();
        public List<SchoolWebApp.Models.BoardingTypes> BoardingTypes { get; set; } = new();

        [BindProperty]
        public SchoolWebApp.Models.CampusBoardingType CampusBoardingType { get; set; }

        public async Task OnGetAsync()
        {
            CampusBoardingTypes = await _context.CampusBoardingTypes
                .Include(c => c.Institution)
                .Include(c => c.Campus)
                .Include(c => c.BoardingType)
                .ToListAsync();

            Institutions = await _context.Institutions.ToListAsync();
            Campuses = await _context.Campuses.ToListAsync();
            BoardingTypes = await _context.BoardingTypes.ToListAsync();
            
        }

        //public async Task<IActionResult> OnGetLoadCampusesAsync(int institutionId)
        //{
        //    var campuses = await _context.Campuses
        //        .Where(c => c.InstitutionID == institutionId)
        //        .Select(c => new { c.CampusID, c.CampuseName })
        //        .OrderBy(c => c.CampuseName)
        //        .ToListAsync();
        //    return Content(string.Join("", campuses.Select(c =>
        //        $"<option value='{c.CampusID}'>{c.CampuseName}</option>")));
        //}

        public async Task<IActionResult> OnPostCreateAsync()
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
            CampusBoardingType.CreatedDate=DateTime.Now;
            CampusBoardingType.IsActive=true;
            _context.CampusBoardingTypes.Add(CampusBoardingType);
            await _context.SaveChangesAsync();
            return new JsonResult(new { success = true, message = "CampusBoarding created successfully" });
        }

        public async Task<IActionResult> OnGetEditFormAsync(int id)
        {
            var model = await _context.CampusBoardingTypes
                .Include(c => c.Institution)
                .Include(c => c.Campus)
                .Include(c => c.BoardingType)
                .FirstOrDefaultAsync(m => m.CampusBoardingTypeID == id);

            if (model == null)
            {
                return new JsonResult(new { success = false, message = "Campus Boarding Type not found." });
            }

            return Partial("_EditCampusBoardingTypeForm", model);
        }

        public async Task<IActionResult> OnPostEditAsync(int id)
        {
            if (!ModelState.IsValid)
            {
                return new JsonResult(new { success = false, message = "Invalid data" });
            }

            var existingCampusBoardingType = await _context.Campuses.FindAsync(CampusBoardingType.CampusBoardingTypeID);
            if (existingCampusBoardingType == null)
            {
                return new JsonResult(new { success = false, message = "Campus not found" });
            }

            _context.Entry(existingCampusBoardingType).CurrentValues.SetValues(CampusBoardingType);
            await _context.SaveChangesAsync();

            return new JsonResult(new { success = true, message = "Campus updated successfully" });
           
        }

        public async Task<IActionResult> OnPostDeleteAsync(int id)
        {
            var model = await _context.CampusBoardingTypes.FindAsync(id);
            if (model == null)
            {
                return new JsonResult(new { success = false, message = "Campus Boarding Type not found." });
            }

            _context.CampusBoardingTypes.Remove(model);
            await _context.SaveChangesAsync();
            return new JsonResult(new { success = true, message = "Campus Boarding Type deleted successfully!" });
        }


        public async Task<IActionResult> OnGetLoadCampusesAsync(int institutionId)
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

            var html = await _viewComponentHelper.InvokeAsync("Master", new { viewname = "Campuses", FilterIds = institutionId.ToString(), SelectedIDs = (int?)null });

            using var writer = new StringWriter();
            html.WriteTo(writer, HtmlEncoder.Default);

            return Content(writer.ToString(), "text/html");
        }

    }
}