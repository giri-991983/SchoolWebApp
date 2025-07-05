using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using SchoolWebApp.Data;
using SchoolWebApp.Models;
using System.Text.Encodings.Web;

namespace SchoolWebApp.Pages.CourseBatch
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        private readonly IConfiguration _configuration;
        private readonly IViewComponentHelper _viewComponentHelper;
        private readonly IServiceProvider _serviceProvider;
        private readonly ITempDataDictionaryFactory _tempDataFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;


        public IndexModel(IViewComponentHelper viewComponentHelper, IServiceProvider serviceProvider, ITempDataDictionaryFactory tempDataFactory, IHttpContextAccessor httpContextAccessor, ApplicationDbContext context, IConfiguration configuration)
        {

            _viewComponentHelper = viewComponentHelper;
            _serviceProvider = serviceProvider;
            _tempDataFactory = tempDataFactory;
            _httpContextAccessor = httpContextAccessor;
            _context = context;
            _configuration = configuration;
        }
        [BindProperty]
        public Models.CourseBatch CourseBatch { get; set; }

        public void OnGet()
        {
        }
       // Institution dropdown
        public string GetInstitutionIdsFromCourse()
        {
            try
            {
                var institutionIds = _context.Courses
                    .Select(c => c.InstitutionID)
                    .Distinct()
                    .ToList();

                return string.Join(",", institutionIds);
            }
            catch (Exception ex)
            {
                return string.Empty;
            }
        }
        // Load Campuses Dropdown by Selecting Institution
        public async Task<IActionResult> OnGetLoadCampusesByInstitutionAsync(int institutionId)
        {
            try
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


                string filterIds = "";
                if (institutionId > 0)
                {
                    var campusIds = await _context.Campuses
                        .Where(c => c.InstitutionID == institutionId)
                        .Select(c => c.CampusID)
                        .Distinct()
                        .ToListAsync();
                    if (campusIds == null || !campusIds.Any())
                    {
                        return Content("<option value=''>No Campuses Available</option>", "text/html");
                    }
                    filterIds = string.Join(",", campusIds);

                }

                var html = await _viewComponentHelper.InvokeAsync("Master", new { viewname = "Campuses", FilterIds = filterIds });

                using var writer = new StringWriter();
                html.WriteTo(writer, HtmlEncoder.Default);

                return Content(writer.ToString(), "text/html");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Failed to load campuses: " + ex.Message);
            }
        }

        // Load Boards Dropdown by Selecting Institution and Campus
        public async Task<IActionResult> OnGetLoadBoardsByInstitutionAndCampusAsync(int institutionId, int campusId)
        {
            try
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

                string filterIds = "";
                if (institutionId > 0 && campusId > 0)
                {

                    var campus = await _context.Campuses
                  .Where(c => c.CampusID == campusId && c.InstitutionID == institutionId)
                  .Select(c => c.CampusTypeID)
                  .FirstOrDefaultAsync();

                    if (campus == 0)
                    {
                        // No valid campus found for the institution
                        return Content("<option value=''>No Boards Available</option>", "text/html");
                    }

                    // Get BoardIDs associated with the CampusTypeID
                    var boardIds = await _context.Boards
                        .Where(b => b.CampusTypeID == campus)
                        .Select(b => b.BoardID)
                        .Distinct()
                        .ToListAsync();
                    filterIds = string.Join(",", boardIds);
                }

                var html = await _viewComponentHelper.InvokeAsync("Master", new { viewname = "Boards", FilterIds = filterIds });

                using var writer = new StringWriter();
                html.WriteTo(writer, HtmlEncoder.Default);

                return Content(writer.ToString(), "text/html");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Failed to load boards.");
            }
        }
        // Course DropDown on Filteration
        public async Task<IActionResult> OnGetLoadCoursesByInstitutionAndCampusAsync(int institutionId, int campusId)
        {
            try
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

                string filterIds = "";

                if (institutionId > 0 && campusId > 0)
                {
                    // Get CourseIDs associated with Institution and Campus
                    var courseIds = await _context.Courses
                        .Where(c => c.InstitutionID == institutionId && c.CampusID == campusId )
                        .Select(c => c.CourseID)
                        .Distinct()
                        .ToListAsync();

                    filterIds = string.Join(",", courseIds);
                }

                // Load Courses ViewComponent with the FilterIds
                var html = await _viewComponentHelper.InvokeAsync("Master", new { viewname = "Courses", FilterIds = filterIds });

                using var writer = new StringWriter();
                html.WriteTo(writer, HtmlEncoder.Default);

                return Content(writer.ToString(), "text/html");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Failed to load courses.");
            }
        }

        // Filter Table with Institution, Campus
        // Filter Table with Institution, Campus, and Course
        public async Task<IActionResult> OnGetCourseBatchesByCampusAndInstitutionAsync(int campusId, int institutionId, int courseId)
        {
            try
            {
                // Validate input parameters
                if (campusId <= 0 || institutionId <= 0 || courseId <= 0)
                {
                    return BadRequest("Invalid input parameters.");
                }

                var courseBatches = await _context.CourseBatches
                    .Include(cb => cb.Course)
                    .Include(cb => cb.AcademicYears)
                    .Where(cb => cb.Course.CampusID == campusId &&
                                 cb.Course.InstitutionID == institutionId &&
                                 cb.Course.CourseID == courseId)
                    .OrderBy(cb => cb.BatchName)
                    .ToListAsync();

                return Partial("_CourseBatchTable", courseBatches);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while fetching course batch data.");
            }
        }
        // CourseYear DropDown with CourseID
        public async Task<IActionResult> OnGetCourseYearsAsync(int courseId)
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

            // Fetch Course Years for the given CourseID
            string filterIds = "";
            if (courseId > 0)
            {
                var courseYearIds = await _context.CourseYears
                    .Where(cy => cy.CourseID == courseId)
                    .Select(cy => cy.CourseYearID)
                    .Distinct()
                    .ToListAsync();

                if (courseYearIds == null || !courseYearIds.Any())
                {
                    return Content("<option value=''>No Course Years Available</option>", "text/html");
                }

                filterIds = string.Join(",", courseYearIds);
            }

            var html = await _viewComponentHelper.InvokeAsync("Master", new { viewname = "CourseYears", FilterIds = filterIds });

            using var writer = new StringWriter();
            html.WriteTo(writer, HtmlEncoder.Default);

            return Content(writer.ToString(), "text/html");
        }



        public async Task<IActionResult> OnPostAddCourseBatchAsync()
        {
            try
            {
             
                CourseBatch.Status = 1;
                CourseBatch.CreatedDate = DateTime.Now;

                _context.CourseBatches.Add(CourseBatch);
                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Course Batch added successfully." });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = "An error occurred while adding the Course Batch." });
            }
        }
        public async Task<IActionResult> OnPostDeleteCourseBatchAsync(int courseBatchId)
        {
            try
            {
                var courseBatch = await _context.CourseBatches.FindAsync(courseBatchId);

                if (courseBatch == null)
                {
                    return new JsonResult(new { success = false, message = "Course Batch not found." });
                }

                _context.CourseBatches.Remove(courseBatch);
                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Course Batch deleted successfully." });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = "An error occurred while deleting the Course Batch." });
            }
        }


    }
}
