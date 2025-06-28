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
        public int InstitutionID { get; set; }
        [BindProperty]
        public int CampusID { get; set; }
        [BindProperty]
        public int BoardID { get; set; }
        [BindProperty]
        public List<int> SelectedMasterCourseIDs { get; set; } = new List<int>();
       

        public void OnGet()
        {
        }
        public async Task<IActionResult> OnGetFilterCoursesAsync(int institutionId, int campusId, int boardId)
        {
            var courses = await _context.Courses
                .Include(c => c.Institution)
                .Include(c => c.Campus)
                .Include(c => c.Board)
                .Include(c => c.CourseYears)
                .Where(c => (institutionId == 0 || c.InstitutionID == institutionId) &&
                            (campusId == 0 || c.CampusID == campusId) &&
                            (boardId == 0 || c.BoardID == boardId))
                .ToListAsync();

            return Partial("_CourseTable", courses);
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
            if (InstitutionID <= 0)
            {
                return new JsonResult(new { success = false, message = "Please select an Institution." });
            }

            if (CampusID <= 0)
            {
                return new JsonResult(new { success = false, message = "Please select a Campus." });
            }

            if (BoardID <= 0)
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
                    .Where(mc => mc.BoardID == BoardID && SelectedMasterCourseIDs.Contains(mc.MasterCourseID))
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
                        .AnyAsync(c => c.InstitutionID == InstitutionID &&
                                       c.CampusID == CampusID &&
                                       c.BoardID == BoardID &&
                                       c.CourseName.ToLower().Trim().Replace(" ", "") == masterCourse.CourseName.ToLower().Trim().Replace(" ", ""));

                    if (existingCourse)
                    {
                        duplicateCourses.Add(masterCourse.CourseName);
                        continue;
                    }

                    // Create a new Course
                    var newCourse = new Models.Course
                    {
                        InstitutionID = InstitutionID,
                        CampusID = CampusID,
                        BoardID = BoardID,
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

        public async Task<IActionResult> OnPostDeleteCourseAsync(int courseId)
        {
            if (courseId <= 0)
            {
                return new JsonResult(new { success = false, message = "Invalid Course ID." });
            }

            try
            {


                var course = await _context.Courses
                    .Include(c => c.CourseYears)
                    .FirstOrDefaultAsync(c => c.CourseID == courseId);

                if (course == null)
                {

                    return new JsonResult(new { success = false, message = "Course not found." });
                }

                // Remove related CourseYear records
                _context.CourseYears.RemoveRange(course.CourseYears);

                // Remove the course
                _context.Courses.Remove(course);

                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Course and associated years deleted successfully!" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to delete course: {ex.Message}" });
            }
        }
        public async Task<IActionResult> OnGetEditCourseFormAsync(int courseId)
        {
            try
            {
                var courseDetails = await _context.Courses
                    .FirstOrDefaultAsync(c => c.CourseID == courseId);

                if (courseDetails == null)
                {
                    return new JsonResult(new { success = false, message = "Course not found." });
                }

                return Partial("_Edit", courseDetails);
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Error loading edit form: {ex.Message}" });
            }
        }

        public async Task<IActionResult> OnPostEditCourseAsync(int courseId, string courseName)
        {
            if (courseId <= 0 || string.IsNullOrWhiteSpace(courseName))
            {
                return new JsonResult(new { success = false, message = "Invalid course ID or course name." });
            }

            try
            {
                var courseToUpdate = await _context.Courses
                    .FirstOrDefaultAsync(c => c.CourseID == courseId);

                if (courseToUpdate == null)
                {
                    return new JsonResult(new { success = false, message = "Course not found." });
                }

                var courseExists = await _context.Courses
                    .AnyAsync(c => c.InstitutionID == courseToUpdate.InstitutionID &&
                                  c.CampusID == courseToUpdate.CampusID &&
                                  c.CourseName.ToLower().Trim().Replace(" ", "") == courseName.ToLower().Trim().Replace(" ", "") &&
                                  c.CourseID != courseId);

                if (courseExists)
                {
                    return new JsonResult(new { success = false, message = $"A course with the name '{courseName}' already exists in this institution and campus." });
                }

                courseToUpdate.CourseName = courseName;
                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Course updated successfully!" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Error updating course: {ex.Message}" });
            }
        }
    }
}
