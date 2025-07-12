using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using SchoolWebApp.Data;
using SchoolWebApp.Models;
using System.Text.Encodings.Web;

namespace SchoolWebApp.Pages.Course
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
        public Models.Course Course { get; set; }
        //[BindProperty]
        //public int InstitutionID { get; set; }
        //[BindProperty]
        //public int CampusID { get; set; }
        //[BindProperty]
        //public int BoardID { get; set; }
        [BindProperty]
        public List<int> SelectedMasterCourseIDs { get; set; } = new List<int>();
       

        public void OnGet()
        {
        }
        public async Task<IActionResult> OnGetFilterCoursesAsync(int institutionId, int campusId, int boardId)
        {
            var courseYears = await _context.CourseYears
                .Include(cy => cy.Course)
                    .ThenInclude(c => c.Institution)
                .Include(cy => cy.Course)
                    .ThenInclude(c => c.Campus)
                .Include(cy => cy.Course)
                    .ThenInclude(c => c.Board)
                .Where(cy => ( cy.Course.InstitutionID == institutionId) &&
                             ( cy.Course.CampusID == campusId) &&
                             ( cy.Course.BoardID == boardId))
                             .ToListAsync();

            return Partial("_CourseTable", courseYears);
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
       
        public async Task<IActionResult> OnGetMasterCoursesAsync(int boardId)
        {
            try
            {
                var masterCourses = await _context.MasterCourses
                    .Where(mc => mc.BoardID == boardId)
                    .OrderBy(mc => mc.CourseName)
                    .ToListAsync();

                return Partial("_MasterCoursePartial", masterCourses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Failed to load master courses: " + ex.Message);
            }
        }


        public async Task<IActionResult> OnPostAddCourseAsync()
        {
            // Validate inputs
            if (Course.InstitutionID <= 0)
            {
                return new JsonResult(new { success = false, message = "Please select an Institution." });
            }

            if (Course.CampusID <= 0)
            {
                return new JsonResult(new { success = false, message = "Please select a Campus." });
            }

            if (Course.BoardID <= 0)
            {
                return new JsonResult(new { success = false, message = "Please select a Board." });
            }

            if (SelectedMasterCourseIDs == null || !SelectedMasterCourseIDs.Any())
            {
                return new JsonResult(new { success = false, message = "Please select at least one master course." });
            }

            try
            {
                // Fetch selected MasterCourses
                var masterCourses = await _context.MasterCourses
                    .Where(mc => mc.BoardID == Course.BoardID && SelectedMasterCourseIDs.Contains(mc.MasterCourseID))
                    .ToListAsync();

                if (!masterCourses.Any())
                {
                    return new JsonResult(new { success = false, message = "No matching master courses found for the selected board." });
                }

                // Begin a transaction
                using var transaction = await _context.Database.BeginTransactionAsync();

                var coursesToAdd = new List<Models.Course>();
                var duplicateCourses = new List<string>();

                foreach (var masterCourse in masterCourses)
                {
                    // Check for duplicate course
                    var existingCourse = await _context.Courses
                        .AnyAsync(c => c.InstitutionID == Course.InstitutionID &&
                                       c.CampusID == Course.CampusID &&
                                       c.BoardID == Course.BoardID &&
                                       c.CourseName.ToLower().Trim().Replace(" ", "") == masterCourse.CourseName.ToLower().Trim().Replace(" ", ""));

                    if (existingCourse)
                    {
                        duplicateCourses.Add(masterCourse.CourseName);
                        continue;
                    }

                    // Create a new Course
                    var newCourse = new Models.Course
                    {
                        InstitutionID = Course.InstitutionID,
                        CampusID = Course.CampusID,
                        BoardID = Course.BoardID,
                        CourseName = masterCourse.CourseName,
                        NoOfYears = masterCourse.NoOfYears,
                        NoOfSemesters = masterCourse.NoOfSemesters,
                        Status = 1, // Active by default
                        CreatedDate = DateTime.Now
                    };
                    coursesToAdd.Add(newCourse);
                }

                if (duplicateCourses.Any())
                {
                    await transaction.RollbackAsync();
                    return new JsonResult(new { success = false, message = $"The following courses already exist: {string.Join(", ", duplicateCourses)}." });
                }

                if (coursesToAdd.Any())
                {
                    _context.Courses.AddRange(coursesToAdd);
                    await _context.SaveChangesAsync();

                    var courseYearsToAdd = new List<Models.CourseYear>();

                    foreach (var course in coursesToAdd)
                    {
                        var masterCourse = masterCourses.First(mc => mc.CourseName == course.CourseName);

                        
                        for (int yearNo = 1; yearNo <= masterCourse.NoOfYears; yearNo++)
                        {
                            int semestersPerYear = masterCourse.NoOfSemesters / masterCourse.NoOfYears;

                            for (int semNo = 1; semNo <= semestersPerYear; semNo++)
                            {
                                var courseYear = new Models.CourseYear
                                {
                                    CourseID = course.CourseID,
                                    CourseYearName = $"Year {yearNo} - Semester {semNo}",
                                    YearNo = yearNo,
                                    SemesterNo = semNo, // Continuous numbering
                                    Status = 1,
                                    CreatedDate = DateTime.Now
                                };

                                courseYearsToAdd.Add(courseYear);
                               
                            }
                        }

                    }

                    // Save CourseYears
                    _context.CourseYears.AddRange(courseYearsToAdd);
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();
                    return new JsonResult(new { success = true, message = "Course(s) added successfully!" });
                }
                else
                {
                    
                    await transaction.RollbackAsync();
                    return new JsonResult(new { success = false, message = "No new courses to add." });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to add courses: {ex.Message}" });
            }
       }

       

        public async Task<IActionResult> OnPostDeleteCourseYearAsync(int courseYearId)
        {
            if (courseYearId <= 0)
            {
                return new JsonResult(new { success = false, message = "Invalid Course Year ID." });
            }

            try
            {
                // Fetch the CourseYear including the related Course
                var courseYear = await _context.CourseYears
                    .Include(cy => cy.Course)
                    .FirstOrDefaultAsync(cy => cy.CourseYearID == courseYearId);

                if (courseYear == null)
                {
                    return new JsonResult(new { success = false, message = "Course Year not found." });
                }

                var courseId = courseYear.CourseID;

                // Delete the selected CourseYear
                _context.CourseYears.Remove(courseYear);
                await _context.SaveChangesAsync();

                // Check if the course has any remaining years
                var remainingYears = await _context.CourseYears
                    .AnyAsync(cy => cy.CourseID == courseId);

                if (!remainingYears)
                {
                    // No more years, delete the course
                    var course = await _context.Courses.FindAsync(courseId);
                    if (course != null)
                    {
                        _context.Courses.Remove(course);
                        await _context.SaveChangesAsync();

                        return new JsonResult(new { success = true, message = "Course year and course deleted successfully!" });
                    }
                }

                return new JsonResult(new { success = true, message = "Course year deleted successfully!" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to delete course year: {ex.Message}" });
            }
        }
        public async Task<IActionResult> OnGetEditCourseFormAsync(int courseId, int courseYearId)
        {
            try
            {
                // Get the CourseYear along with the Course (eager load Course navigation property)
                var courseYearDetails = await _context.CourseYears
                    .Include(cy => cy.Course)
                    .FirstOrDefaultAsync(cy => cy.CourseYearID == courseYearId && cy.CourseID == courseId);

                if (courseYearDetails == null)
                {
                    return new JsonResult(new { success = false, message = "Course or Course Year not found." });
                }

                // Return the partial view with the CourseYear model (Course will be available via navigation property)
                return Partial("_Edit", courseYearDetails);
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Error loading edit form: {ex.Message}" });
            }
        }
        public async Task<IActionResult> OnPostEditCourseAsync(CourseYear courseYearInput)
        {
            try
            {
                // Fetch Course Year with its Course
                var courseYear = await _context.CourseYears
                    .Include(cy => cy.Course)
                    .FirstOrDefaultAsync(cy => cy.CourseYearID == courseYearInput.CourseYearID);

                if (courseYear == null)
                {
                    return new JsonResult(new { success = false, message = "Course Year not found." });
                }

                var courseToUpdate = courseYear.Course;

                if (string.IsNullOrWhiteSpace(courseYearInput.Course.CourseName))
                {
                    return new JsonResult(new { success = false, message = "Course name cannot be empty." });
                }

                if (string.IsNullOrWhiteSpace(courseYearInput.CourseYearName))
                {
                    return new JsonResult(new { success = false, message = "Course Year name cannot be empty." });
                }

                string newCourseName = courseYearInput.Course.CourseName.Trim().ToLower().Replace(" ", "");
                string newCourseYearName = courseYearInput.CourseYearName.Trim().ToLower().Replace(" ", "");

                // Check for Duplicate Course Name
                var isCourseDuplicate = await _context.Courses
                    .AnyAsync(c => c.InstitutionID == courseToUpdate.InstitutionID &&
                                   c.CampusID == courseToUpdate.CampusID &&
                                   c.BoardID == courseToUpdate.BoardID &&
                                   c.CourseName.Trim().ToLower().Replace(" ", "") == newCourseName &&
                                   c.CourseID != courseToUpdate.CourseID);

                if (isCourseDuplicate)
                {
                    return new JsonResult(new { success = false, field = "CourseName", message = $"A course with the name '{courseYearInput.Course.CourseName}' already exists in this institution and campus." });
                 
                }

                // Check for Duplicate Course Year Name within the same Course
                var isCourseYearDuplicate = await _context.CourseYears
                    .AnyAsync(cy => cy.CourseID == courseToUpdate.CourseID &&
                                    cy.CourseYearName.Trim().ToLower().Replace(" ", "") == newCourseYearName &&
                                    cy.CourseYearID != courseYear.CourseYearID);

                if (isCourseYearDuplicate)
                {
                    return new JsonResult(new { success = false, field = "CourseYearName", message = $"A course year with the name '{courseYearInput.CourseYearName}' already exists in this course." });
                }

                // Update Course Name
                courseToUpdate.CourseName = courseYearInput.Course.CourseName;

                // Update Course Year Name
                courseYear.CourseYearName = courseYearInput.CourseYearName;

                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Course and Course Year updated successfully!" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Error updating course: {ex.Message}" });
            }
        }




        // Load Institutions by Campus Type
        public async Task<IActionResult> OnGetLoadInstitutionsByCampusTypeAsync(string campusTypeIds)
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
                List<int> selectedInstitutionIds = new();
                if (!string.IsNullOrEmpty(campusTypeIds))
                {
                    var campusTypeIdList = campusTypeIds
                        .Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(int.Parse)
                        .ToList();

                    selectedInstitutionIds = await _context.Campuses
                        .Where(c => campusTypeIdList.Contains(c.CampusTypeID))
                        .Select(c => c.InstitutionID)
                        .Distinct()
               
                        .ToListAsync();

                    if (!selectedInstitutionIds.Any())
                        return Content("<option value=''>No Institutions Available</option>", "text/html");

                    filterIds = string.Join(",", selectedInstitutionIds);
                }

                var html = await _viewComponentHelper.InvokeAsync("Master", new { viewname = "Institutions", FilterIds = filterIds });

                using var writer = new StringWriter();
                html.WriteTo(writer, HtmlEncoder.Default);
                return Content(writer.ToString(), "text/html");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Failed to load institutions: " + ex.Message);
            }
        }



    }
}
