using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using SchoolWebApp.Data;
using SchoolWebApp.Models;
using System.Text.Encodings.Web;

namespace SchoolWebApp.Pages.ClassRoom
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
        public Models.ClassRoom ClassRoom { get; set; }
        public void OnGet()
        {
        }
        //Fiter Table With Institution,Campus,Board 
        public async Task<IActionResult> OnGetClassRoomsByCampusAndInstitution(int campusId, int institutionId, int boardId)
        {
            try
            {
                // Validate input parameters
                if (campusId < 0 || institutionId < 0 || boardId < 0)
                {
                    return BadRequest("Invalid input parameters.");
                }

                var classRooms = await _context.ClassRooms
                    .Include(c => c.Institution)
                    .Include(c => c.Campus)
                    .Include(c => c.CampusType)
                    .Include(c => c.Classes)
                    //.Include(c => c.CourseBatch)
                    //.Include(c => c.AcademicYear)
                    .Where(c => (campusId == 0 || c.CampusID == campusId) &&
                                (institutionId == 0 || c.InstitutionID == institutionId) &&
                                (boardId == 0 || c.Classes.BoardID == boardId))
                    .OrderBy(c => c.ClassRoomName) 
                    .ToListAsync();

                return Partial("_ClassRoomTable", classRooms);
            }
            catch (Exception ex)
            {
               
                return StatusCode(500, "An error occurred while fetching class room data.");
            }
        }
        //Loading Campus dropdown by Selecting Institution
        public async Task<IActionResult> OnGetLoadCampusesByInstitutionAsync(int institutionId)
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

            // Fetch CampusID(s) for the given InstitutionID
            string filterIds = "";
            if (institutionId > 0)
            {
                var campusIds = await _context.Campuses
                    .Where(c => c.InstitutionID == institutionId)
                    .Select(c => c.CampusID)
                    .Distinct()
                    .ToListAsync();
                filterIds = string.Join(",", campusIds);
            }

            var html = await _viewComponentHelper.InvokeAsync("Master", new { viewname = "Campuses", FilterIds = filterIds });

            using var writer = new StringWriter();
            html.WriteTo(writer, HtmlEncoder.Default);

            return Content(writer.ToString(), "text/html");
        }

        //Loading Class Dropdowm by Selecting institution,campus,board
        public async Task<IActionResult> OnGetLoadClassesByBoardAsync(int boardId, int institutionId, int campusId)
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

                // Fetch ClassID(s) based on BoardID, InstitutionID, and CampusID
                string filterIds = "";
                if (boardId > 0)
                {
                    var query = _context.Classes
                       
                        .Where(cr => cr.BoardID == boardId);

                    if (institutionId > 0)
                    {
                        query = query.Where(cr => cr.InstitutionID == institutionId);
                    }

                    if (campusId > 0)
                    {
                        query = query.Where(cr => cr.CampusID == campusId);
                    }

                    var classIds = await query
                        .Select(cr => cr.ClassID)
                        .Distinct()
                        .ToListAsync();

                    filterIds = string.Join(",", classIds);
                }

                var html = await _viewComponentHelper.InvokeAsync("Master", new { viewname = "Classes", FilterIds = filterIds });

                using var writer = new StringWriter();
                html.WriteTo(writer, HtmlEncoder.Default);

                return Content(writer.ToString(), "text/html");
            }
            catch (Exception ex)
            {
              
                return StatusCode(500, "Failed to load classes.");
            }
        }
        //DropDowm For Boards With Selecting Institution and Campus
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
                    var query = _context.Classes
                        .Where(c => c.InstitutionID == institutionId && c.CampusID == campusId);

                    var boardIds = await query
                        .Select(c => c.BoardID)
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
        public async Task<IActionResult> OnPostAddClassRoomAsync()
        {
            try
            { 

               
                if (ClassRoom.SeatingCapacity < 1)
                {
                    return new JsonResult(new { success = false, message = "Seating capacity must be at least 1." });
                }
                if (ClassRoom.AvailableSeats > ClassRoom.SeatingCapacity)
                {
                    return new JsonResult(new { success = false, message = "Available seats cannot exceed seating capacity." });
                }

                // Check if a classroom with the same name already exists for this institution and campus
                var existingClassRoom = await _context.ClassRooms
                                                     .FirstOrDefaultAsync(cr => cr.ClassRoomName.ToLower().Trim() == ClassRoom.ClassRoomName.ToLower().Trim() &&
                                                     cr.InstitutionID == ClassRoom.InstitutionID &&
                                                     cr.CampusID == ClassRoom.CampusID &&
                                                    
                                                     cr.ClassRoomID != ClassRoom.ClassRoomID);
                if (existingClassRoom != null)
                {
                    return new JsonResult(new { success = false, message = "A class room with this name already exists for the selected institution and campus." });
                }

              
                ClassRoom.CreatedDate = DateTime.Now;
                ClassRoom.Status = 1;
                ClassRoom.TypeID = 1;
                ClassRoom.AcademicYearID = 1;

                // Add to database
                _context.ClassRooms.Add(ClassRoom);
                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Class room added successfully." });
            }
            catch (Exception ex)
            {
                
                return new JsonResult(new { success = false, message = "An error occurred while adding the class room: " + ex.Message });
            }
        }

        public async Task<IActionResult> OnPostDeleteClassRoomAsync(int classRoomId)
        {
            try
            {
                var classRoom = await _context.ClassRooms.FindAsync(classRoomId);
                if (classRoom == null)
                {
                    return new JsonResult(new { success = false, message = "Class Room not found." });
                }

              

                _context.ClassRooms.Remove(classRoom);
                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Class Room deleted successfully." });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = "An error occurred while deleting the Class Room: " + ex.Message });
            }
        }
        // Edit Form
        public async Task<IActionResult> OnGetEditClassRoomFormAsync(int classRoomId)
        {
            var classRoom = await _context.ClassRooms
                .Include(cr => cr.Classes)
                .FirstOrDefaultAsync(cr => cr.ClassRoomID == classRoomId);

            if (classRoom == null)
            {
                return new JsonResult(new { success = false, message = "Class Room not found." });
            }

            return Partial("_Edit", classRoom); 
        }

        // Handle Class Room update
        public async Task<IActionResult> OnPostEditClassRoomAsync()
        {
            try
            {
               
                var classRoom = await _context.ClassRooms.FindAsync(ClassRoom.ClassRoomID);
                if (classRoom == null)
                {
                    return new JsonResult(new { success = false, message = "Class Room not found." });
                }

                // Check for duplicate Class Room name (excluding the current Class Room)
                var duplicateClassRoom = await _context.ClassRooms
                    .FirstOrDefaultAsync(cr => cr.ClassRoomName.ToLower().Trim().Replace(" ", "") == ClassRoom.ClassRoomName.ToLower().Trim().Replace(" ", "") &&
                                              cr.InstitutionID == ClassRoom.InstitutionID &&
                                              cr.CampusID == ClassRoom.CampusID &&

                                              cr.ClassRoomID != ClassRoom.ClassRoomID);
                if (duplicateClassRoom != null)
                {
                    return new JsonResult(new { success = false, message = "A Class Room with this name already exists for the selected institution and campus." });
                }

                // Update fields
                classRoom.ClassRoomName = ClassRoom.ClassRoomName;
              
                classRoom.SeatingCapacity = ClassRoom.SeatingCapacity;
                classRoom.AvailableSeats = ClassRoom.AvailableSeats;

                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Class Room updated successfully." });
            }
            catch (Exception ex)
            {
              
                return new JsonResult(new { success = false, message = "An error occurred while updating the Class Room: " + ex.Message });
            }
        }
    }
}

