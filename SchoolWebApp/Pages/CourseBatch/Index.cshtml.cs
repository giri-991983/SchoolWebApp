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
                    .Include(cb=>cb.CourseYear)
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
       
        public async Task<IActionResult> OnGetCourseNoOfYearsAsync(int courseId)
        {
            if (courseId <= 0)
                return BadRequest("Invalid Course ID");

            var course = await _context.Courses
         .Where(c => c.CourseID == courseId)
         .Select(c => new { c.NoOfYears, c.NoOfSemesters })
         .FirstOrDefaultAsync();

            if (course == null)
                return NotFound();

            return new JsonResult(course);
        }

       

        public async Task<IActionResult> OnPostCreateCourseBatchAsync()
        {
            var course = await _context.Courses
                .Include(c => c.CourseYears)
                .FirstOrDefaultAsync(c => c.CourseID == CourseBatch.CourseID);

            if (course == null)
                return new JsonResult(new { success = false, message = "Course not found." });

            var startYear = await _context.AcademicYears
                .FirstOrDefaultAsync(a => a.AcademicYearID == CourseBatch.AcademicYearID);

            if (startYear == null)
                return new JsonResult(new { success = false, message = "Invalid Academic Year." });

            int totalYears = course.NoOfYears;
            int totalSemesters = course.NoOfSemesters;
            int semestersPerYear =  totalSemesters / totalYears ;
            int baseStart = int.Parse(startYear.AcademicYear.Split('-')[0]);

            var newBatches = new List<Models.CourseBatch>();
           
            for (int yearNo = 1; yearNo <= totalYears; yearNo++)
            {
                int fromYear = baseStart + (yearNo - 1);
                int toYear = fromYear + 1;
                string academicRange = $"{fromYear}-{toYear}";

                var academic = await _context.AcademicYears
                    .FirstOrDefaultAsync(a => a.AcademicYear == academicRange);

                if (academic == null) continue;

                // Get all semesters for this year
                var courseYearList = await _context.CourseYears
                    .Where(cy => cy.CourseID == CourseBatch.CourseID && cy.YearNo == yearNo)
                    .OrderBy(cy => cy.SemesterNo)
                    .ToListAsync();

                foreach (var courseYear in courseYearList)
                {
                    int semesterNo = courseYear.SemesterNo;

                    bool duplicate = await _context.CourseBatches.AnyAsync(cb =>
                        cb.BatchName.ToLower().Replace(" ", "") == CourseBatch.BatchName.ToLower().Replace(" ", "") &&
                        cb.CourseID == CourseBatch.CourseID &&
                        cb.CourseYearID == courseYear.CourseYearID 
                       /* cb.AcademicYearID == academic.AcademicYearID*/);

                    if (duplicate)
                        continue;

                    newBatches.Add(new Models.CourseBatch
                    {
                        CourseID = CourseBatch.CourseID,
                        CourseYearID = courseYear.CourseYearID,
                        AcademicYearID = academic.AcademicYearID,
                        BatchName = CourseBatch.BatchName,
                        Status = 1,
                        CreatedDate = DateTime.UtcNow
                    });
                }
            }

            if (!newBatches.Any())
                return new JsonResult(new
                {
                    success = false,
                    field = "BatchName",
                    message = $"A course batch with the name '{CourseBatch.BatchName}' already exists for the selected course."
                });
            _context.CourseBatches.AddRange(newBatches);
            await _context.SaveChangesAsync();

            return new JsonResult(new { success = true, message = "Course batches created for all semesters." });
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
        public async Task<IActionResult> OnGetEditCourseBatchFormAsync(int courseBatchId)
        {
            try
            {
                var courseBatch = await _context.CourseBatches
                    .Include(cb => cb.Course)
                    .FirstOrDefaultAsync(cb => cb.CourseBatchID == courseBatchId);

                if (courseBatch == null)
                {
                    return new JsonResult(new { success = false, message = "Course batch not found." });
                }

                return Partial("_Edit", courseBatch);
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Error loading course batch: {ex.Message}" });
            }
        }
        // only one Value
        //public async Task<IActionResult> OnPostEditCourseBatchAsync()
        //{
        //    try
        //    {
        //        var existingBatch = await _context.CourseBatches
        //            .FirstOrDefaultAsync(cb => cb.CourseBatchID == CourseBatch.CourseBatchID);

        //        if (existingBatch == null)
        //        {
        //            return new JsonResult(new { success = false, message = "Course batch not found." });
        //        }

        //        if (string.IsNullOrWhiteSpace(CourseBatch.BatchName))
        //        {
        //            return new JsonResult(new { success = false, field = "BatchName", message = "Batch name cannot be empty." });
        //        }


        //        var isDuplicate = await _context.CourseBatches
        //            .AnyAsync(cb =>
        //                cb.CourseID == existingBatch.CourseID &&
        //                cb.CourseYearID == existingBatch.CourseYearID &&
        //                cb.AcademicYearID == existingBatch.AcademicYearID &&
        //                cb.BatchName.Trim().ToLower().Replace(" ", "") == CourseBatch.BatchName.Trim().ToLower().Replace(" ", "") &&
        //                cb.CourseBatchID != existingBatch.CourseBatchID);

        //        if (isDuplicate)
        //        {
        //            return new JsonResult(new
        //            {
        //                success = false,
        //                field = "BatchName",
        //                message = $"A course batch with the name '{CourseBatch.BatchName}' already exists."
        //            });
        //        }

        //        existingBatch.BatchName = CourseBatch.BatchName;


        //        await _context.SaveChangesAsync();

        //        return new JsonResult(new { success = true, message = "Course batch updated successfully." });
        //    }
        //    catch (Exception ex)
        //    {
        //        return new JsonResult(new { success = false, message = $"Error updating course batch: {ex.Message}" });
        //    }
        //}
        public async Task<IActionResult> OnPostEditCourseBatchAsync()
        {
            try
            {
                // Fetch original CourseBatch row
                var existing = await _context.CourseBatches
                    .FirstOrDefaultAsync(cb => cb.CourseBatchID == CourseBatch.CourseBatchID);

                if (existing == null)
                {
                    return new JsonResult(new { success = false, message = "Course batch not found." });
                }

                var oldBatchName = existing.BatchName.Trim().ToLower().Replace(" ", "");
                var newBatchName = CourseBatch.BatchName;

                // Find all course batches with same CourseID and old BatchName
                var batchGroup = await _context.CourseBatches
                    .Where(cb => cb.CourseID == existing.CourseID &&
                                 cb.BatchName.Trim().ToLower().Replace(" ", "") == oldBatchName)
                    .ToListAsync();

                //Check for duplicate new batch name 
                var isDuplicate = await _context.CourseBatches.AnyAsync(cb =>
                    cb.CourseID == existing.CourseID &&
                    cb.BatchName.Trim().ToLower().Replace(" ", "") == newBatchName.ToLower().Replace(" ", "") &&
                    !batchGroup.Select(bg => bg.CourseBatchID).Contains(cb.CourseBatchID));

                if (isDuplicate)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        field = "BatchName",
                        message = "A batch with the same name already exists."
                    });
                }

                // Update batch name in all group records
                foreach (var batch in batchGroup)
                {
                    batch.BatchName = newBatchName;
                   
                }

                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Batch name updated across all years and semesters." });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = "Error: " + ex.Message });
            }
        }



    }
}
