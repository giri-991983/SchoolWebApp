using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using SchoolWebApp.Data;
using SchoolWebApp.Models;
using System.Text.Encodings.Web;

namespace SchoolWebApp.Pages.Class
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
        public IList<SchoolWebApp.Models.Class> Classes { get; set; } = new List<SchoolWebApp.Models.Class>();
        public IList<SchoolWebApp.Models.ClassStage> ClassStages { get; set; } = new List<SchoolWebApp.Models.ClassStage>();
        [BindProperty]
        public int BoardID { get; set; }
        [BindProperty]
        public int CampusID { get; set; }
        [BindProperty]
        public int InstitutionID { get; set; }
        [BindProperty]
        public List<int> SelectedMasterClassIDs { get; set; } = new List<int>();
        
        public async Task OnGetAsync()
        {
            Classes = await _context.Classes
                .Include(c => c.Institution)
                .Include(c => c.Campus)
                .Include(c => c.ClassStage)
                .Include(c => c.Board)
                .ToListAsync();
          
        }
        // Filtering Classes with values Institution ,Campus and Boarding
        public async Task<IActionResult> OnGetClassesByCampusAddInstitutionAsync( int campusId, int institutionId, int boardId)
        {
            var classes = await _context.Classes
                .Include(c => c.Institution)
                .Include(c => c.Campus)
                .Include(c => c.ClassStage)
                .Include(c => c.Board)
                .OrderBy(c => c.SequenceNo)
                .ToListAsync();
            if (campusId > 0)
            {
                classes = classes.Where(c => c.CampusID == campusId).ToList();
            }
            if (institutionId > 0)
            {
                classes = classes.Where(c => c.InstitutionID == institutionId).ToList();
            }
            if (boardId > 0)
            {
                classes = classes.Where(c => c.BoardID == boardId).ToList();
            }
           

            return Partial("_ClassesTablePartial",classes);
        }

        // Check box for  ClassStages with Selecting BoardId
        public async Task<IActionResult> OnGetMasterClassesAsync(int boardId)
        {
          
            var masterClasses = await _context.MasterClasses
                .Where(mc => mc.BoardID == boardId)
                .OrderBy(mc => mc.StageNo)
                .ThenBy(mc => mc.ClassSno)
                .ToListAsync();

            return Partial("_MasterClassesPartial",masterClasses);
        }
        // Creating Classes
        public async Task<IActionResult> OnPostAddClassesAsync(int InstitutionID, int CampusID, int BoardID, List<int> SelectedMasterClassIDs)
        {
            // Validate inputs: Ensure all required fields are provided
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

            if (SelectedMasterClassIDs == null || !SelectedMasterClassIDs.Any())
            {
                return new JsonResult(new { success = false, message = "Please select at least one stage/class." });
            }


            try
            {
                // Fetch selected MasterClasses from the database
                var masterClasses = await _context.MasterClasses
                    .Where(mc => mc.BoardID == BoardID && SelectedMasterClassIDs.Contains(mc.MasterClassID))
                    .ToListAsync();

                // Check if any MasterClasses were found
                if (!masterClasses.Any())
                {
                    return new JsonResult(new { success = false, message = "No matching master classes found for the selected board and stages." });
                }

                // Begin a transaction to ensure database consistency
                using var transaction = await _context.Database.BeginTransactionAsync();

                // Group MasterClasses by Stage for processing
                var stages = masterClasses.GroupBy(mc => new { mc.StageNo, mc.StageName }).ToList();

                // Step 1: Process ClassStages and check for duplicates
                var stageDict = new Dictionary<string, int>(); // Maps stage key to ClassStageID

                foreach (var stage in stages)
                {
                    var stageKey = $"{stage.Key.StageNo}-{stage.Key.StageName}";
                    // Check if the stage already exists for the given Institution, Campus, and Board
                    var existingStage = await _context.ClassStages
                        .FirstOrDefaultAsync(cs => cs.StageNo == stage.Key.StageNo && cs.StageName == stage.Key.StageName && cs.BoardID == BoardID && cs.InstitutionID == InstitutionID && cs.CampusID == CampusID);

                    int classStageId;
                    if (existingStage == null)
                    {
                        // Create a new ClassStage if it doesn't exist
                        var newStage = new ClassStage
                        {
                            InstitutionID = InstitutionID,
                            CampusID = CampusID,
                            StageNo = stage.Key.StageNo,
                            StageName = stage.Key.StageName,
                            BoardID = BoardID,
                            Status = 1,
                            CreatedDate = DateTime.Now
                        };
                        _context.ClassStages.Add(newStage);
                        await _context.SaveChangesAsync(); // Save to get the ClassStageID
                        classStageId = newStage.ClassStageID;
                        stageDict[stageKey] = classStageId;
                    }
                    else
                    {
                        classStageId = existingStage.ClassStageID;
                        stageDict[stageKey] = classStageId;

                        // Check for duplicates: ClassName under the same ClassStageID, InstitutionID, CampusID, and BoardID
                        var duplicateClasses = new List<string>();
                        foreach (var masterClass in stage)
                        {
                            var classExists = await _context.Classes
                                .AnyAsync(c => c.InstitutionID == InstitutionID && c.CampusID == CampusID && c.BoardID == BoardID && c.ClassStageID == classStageId && c.ClassName == masterClass.ClassName);

                            if (classExists)
                            {
                                duplicateClasses.Add(masterClass.ClassName);
                            }
                        }

                        // If duplicates are found, fetch all existing ClassNames for this stage and return a message
                        if (duplicateClasses.Any())
                        {
                            var existingClassNames = await _context.Classes
                                .Where(c => c.InstitutionID == InstitutionID && c.CampusID == CampusID && c.BoardID == BoardID && c.ClassStageID == classStageId)
                                .Select(c => c.ClassName)
                                .Distinct()
                                .ToListAsync();

                            await transaction.RollbackAsync();
                            var message = $"Stage '{stage.Key.StageName}' already contains the following classes: {string.Join(", ", existingClassNames)}.";
                            return new JsonResult(new { success = false, message = message });
                        }
                    }
                }

                // Step 2: Process Classes (only if no duplicates were found)
                var classesToAdd = new List<Models.Class>();

                foreach (var stage in stages)
                {
                    var stageKey = $"{stage.Key.StageNo}-{stage.Key.StageName}";
                    var classStageId = stageDict[stageKey];

                    foreach (var masterClass in stage)
                    {
                        // Create a new Class entry
                        var newClass = new Models.Class
                        {
                            InstitutionID = InstitutionID,
                            CampusID = CampusID,
                            BoardID = BoardID,
                            ClassStageID = classStageId,
                            ClassName = masterClass.ClassName,
                            SequenceNo = masterClass.ClassSno,
                            Status = 1,
                            CreatedDate = DateTime.Now
                        };
                        classesToAdd.Add(newClass);
                    }
                }

                // Save all Classes at once if there are any to add
                if (classesToAdd.Any())
                {
                    _context.Classes.AddRange(classesToAdd);
                    await _context.SaveChangesAsync();
                }

                // Commit the transaction
                await transaction.CommitAsync();
                return new JsonResult(new { success = true, message = "Classes and stages added successfully!" });
            }
            catch (Exception ex)
            {
                // Handle any errors that occur during the operation
                return new JsonResult(new { success = false, message = $"Failed to add classes: {ex.Message}" });
            }
        }
       

        public async Task<IActionResult> OnPostDeleteClassAsync(int classId)
        {
            try
            {
                // Find the class to delete
                var classToDelete = await _context.Classes
                    .FirstOrDefaultAsync(c => c.ClassID == classId);

                if (classToDelete == null)
                {
                    return new JsonResult(new { success = false, message = "Class not found." });
                }
               

                // Store the ClassStageID to check for related classes later
                var classStageId = classToDelete.ClassStageID;

                // Remove the class
                _context.Classes.Remove(classToDelete);
                await _context.SaveChangesAsync();

                // Check if there are other classes linked to the same ClassStage
                var otherClassesExist = await _context.Classes
                    .AnyAsync(c => c.ClassStageID == classStageId);

                // If no other classes are linked to the ClassStage, delete the ClassStage
                if (!otherClassesExist)
                {
                    var classStageToDelete = await _context.ClassStages
                        .FirstOrDefaultAsync(cs => cs.ClassStageID == classStageId);

                    if (classStageToDelete != null)
                    {
                        _context.ClassStages.Remove(classStageToDelete);
                        await _context.SaveChangesAsync();
                    }
                }

                return new JsonResult(new { success = true, message = "Class deleted successfully!" });
            }
            catch (Exception ex)
            {
               
                return new JsonResult(new { success = false, message = $"Error deleting class: {ex.Message}" });
            }
        }

        // Loading Edit  Class Form
        public async Task<IActionResult> OnGetEditClassFormAsync(int classId)
        {
            try
            {
                var classDetails = await _context.Classes
                    .Include(c => c.ClassStage)
                    .FirstOrDefaultAsync(c => c.ClassID == classId);

                if (classDetails == null)
                {
                    return new JsonResult(new { success = false, message = "Class not found." });
                }

                return Partial("_Edit",classDetails);
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Error loading edit form: {ex.Message}" });
            }
        }

    

        public async Task<IActionResult> OnPostEditClassAsync(int classId, string className)
        {
            // Validate inputs
            if (classId <= 0 || string.IsNullOrWhiteSpace(className))
            {
                return new JsonResult(new { success = false, message = "Invalid class ID or class name." });
            }

            try
            {
                // Fetch the class to update
                var classToUpdate = await _context.Classes
                    .Include(c => c.ClassStage)
                    .FirstOrDefaultAsync(c => c.ClassID == classId);

                if (classToUpdate == null)
                {
                    return new JsonResult(new { success = false, message = "Class not found." });
                }

                // Check for duplicates: ClassName under the same ClassStageID (excluding the current class)
                var classExists = await _context.Classes
                    .AnyAsync(c => c.ClassStageID == classToUpdate.ClassStageID && c.ClassName == className && c.ClassID != classId);

                if (classExists)
                {
                    return new JsonResult(new { success = false, message = $"A class with the name '{className}' already exists in stage '{classToUpdate.ClassStage.StageName}'." });
                }

                // Update the ClassName
                classToUpdate.ClassName = className;
                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Class updated successfully!" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Error updating class: {ex.Message}" });
            }
        }

        // Geting dropdown for Campus with Seletcing Institution
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

    }
}
