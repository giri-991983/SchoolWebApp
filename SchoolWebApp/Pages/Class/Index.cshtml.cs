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


        public async Task<IActionResult> OnGetInstitutionsByCampusAsync(int campusId)
        {
            if (campusId <= 0)
            {
                return new JsonResult(new { success = false, message = "Invalid campusId" });
            }

            try
            {
                var campus = await _context.Campuses
                    .Include(c => c.Institution)
                    .FirstOrDefaultAsync(c => c.CampusID == campusId);

                if (campus == null)
                {
                    return new JsonResult(new { success = false, message = "Campus not found" });
                }

                var institution = await _context.Institutions
                    .Where(i => i.InstitutionID == campus.InstitutionID)
                    .OrderBy(i => i.InstitutionName)
                    .Select(i => new { i.InstitutionID, i.InstitutionName })
                    .ToListAsync();

                return new JsonResult(institution);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Server error while fetching institutions: " + ex.Message });
            }
        }
        public async Task<IActionResult> OnGetMasterClassesAsync(int boardId)
        {
            if (boardId <= 0)
            {
                return Partial("_MasterClassesPartial", new List<MasterClass>());
            }

            var masterClasses = await _context.MasterClasses
                .Where(mc => mc.BoardID == boardId)
                .OrderBy(mc => mc.StageNo)
                .ThenBy(mc => mc.ClassSno)
                .ToListAsync();

            return Partial("_MasterClassesPartial",masterClasses);
        }
        
        public async Task<IActionResult> OnPostAddClassesAsync(int InstitutionID, int CampusID, int BoardID, List<int> SelectedMasterClassIDs)
        {
            // Validate inputs
            if (InstitutionID <= 0 || CampusID <= 0 || BoardID <= 0 || SelectedMasterClassIDs == null || !SelectedMasterClassIDs.Any())
            {
                return new JsonResult(new { success = false, message = "Please select an Institution, Campus, Board, and at least one stage/class." });
            }

            try
            {
                // Fetch selected MasterClasses
                var masterClasses = await _context.MasterClasses
                    .Where(mc => mc.BoardID == BoardID && SelectedMasterClassIDs.Contains(mc.MasterClassID))
                    .ToListAsync();

                if (!masterClasses.Any())
                {
                    return new JsonResult(new { success = false, message = "No matching master classes found for the selected board and stages." });
                }

                // Use a transaction to ensure consistency
                using var transaction = await _context.Database.BeginTransactionAsync();

                // Group MasterClasses by Stage
                var stages = masterClasses.GroupBy(mc => new { mc.StageNo, mc.StageName }).ToList();

                // Step 1: Process ClassStages
                var stageDict = new Dictionary<string, int>(); // Maps stage key to ClassStageID

                foreach (var stage in stages)
                {
                    var stageKey = $"{stage.Key.StageNo}-{stage.Key.StageName}";
                    var existingStage = await _context.ClassStages
                        .FirstOrDefaultAsync(cs => cs.StageNo == stage.Key.StageNo && cs.StageName == stage.Key.StageName && cs.BoardID == BoardID && cs.InstitutionID==InstitutionID && cs.CampusID==CampusID  );

                    if (existingStage == null)
                    {
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
                        stageDict[stageKey] = newStage.ClassStageID;
                    }
                    else
                    {
                        stageDict[stageKey] = existingStage.ClassStageID;
                    }
                }

                // Step 2: Process Classes
                var classesToAdd = new List<Models.Class>();

                foreach (var stage in stages)
                {
                    var stageKey = $"{stage.Key.StageNo}-{stage.Key.StageName}";
                    var classStageId = stageDict[stageKey];

                    foreach (var masterClass in stage)
                    {
                        // Check for duplicates
                        var classExists = await _context.Classes
                            .AnyAsync(c => c.InstitutionID == InstitutionID && c.CampusID == CampusID && c.BoardID == BoardID && c.ClassName == masterClass.ClassName);

                        if (classExists)
                        {
                            await transaction.RollbackAsync();
                            return new JsonResult(new { success = false, message = $"Class '{masterClass.ClassName}' already exists for this Institution, Campus, and Board." });
                        }

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

                // Save all Classes at once
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
                // Simplified error handling
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


        public async Task<IActionResult> OnGetLoadComponentAsync(int id)
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

            // Fetch InstitutionID(s) for the given CampusID
            string filterIds = "";
            if (id > 0)
            {
                var institutionIds = await _context.Campuses
                    .Where(c => c.CampusID == id)
                    .Select(c => c.InstitutionID)
                    .Distinct()
                    .ToListAsync();
                filterIds = string.Join(",", institutionIds);
            }

            var html = await _viewComponentHelper.InvokeAsync("Master", new { viewname = "Institutions", FilterIds = filterIds, SelectedIDs = (int?)null });

            using var writer = new StringWriter();
            html.WriteTo(writer, HtmlEncoder.Default);

            return Content(writer.ToString(), "text/html");
        }

    }
}
