//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Mvc.RazorPages;
//using Microsoft.EntityFrameworkCore;
//using SchoolWebApp.Data;
//using SchoolWebApp.Models;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

//namespace SchoolWebApp.Pages.MasterPages.Boards
//{
//    public class IndexModel : PageModel
//    {
//        private readonly ApplicationDbContext _context;

//        public IndexModel(ApplicationDbContext context)
//        {
//            _context = context;
//        }

//        public IList<Board> Boards { get; set; } = new List<Board>();
//        [BindProperty]
//        public int CampusTypeID { get; set; }

//        public async Task OnGetAsync()
//        {
//            Boards = await _context.Boards.ToListAsync();
//        }

//        public async Task<IActionResult> OnGetBoardsByCampusTypeAsync(int campusTypeId)
//        {
//            var boards = await _context.Boards
//                .OrderBy(b => b.BoardID)
//                .ToListAsync();

//            if (campusTypeId > 0)
//            {
//                boards = boards.Where(b => b.CampusTypeID == campusTypeId).ToList();
//            }

//            return Partial("_BoardsTablePartial", boards);
//        }

//        public async Task<IActionResult> OnPostAddBoardAsync(int campusTypeId, string boardName)
//        {
//            if (campusTypeId <= 0)
//            {
//                return new JsonResult(new { success = false, message = "Please select a Campus Type." });
//            }

//            if (string.IsNullOrWhiteSpace(boardName))
//            {
//                return new JsonResult(new { success = false, message = "Board Name is required." });
//            }

//            try
//            {
//                var boardExists = await _context.Boards
//                    .AnyAsync(b => b.BoardName.ToLower().Trim() == boardName.ToLower().Trim() && b.CampusTypeID == campusTypeId);

//                if (boardExists)
//                {
//                    return new JsonResult(new { success = false, message = $"A board with the name '{boardName}' already exists for this Campus Type." });
//                }

//                var newBoard = new Board
//                {
//                    BoardName = boardName,
//                    CampusTypeID = campusTypeId
//                };

//                _context.Boards.Add(newBoard);
//                await _context.SaveChangesAsync();

//                return new JsonResult(new { success = true, message = "Board added successfully!" });
//            }
//            catch (Exception ex)
//            {
//                return new JsonResult(new { success = false, message = $"Failed to add board: {ex.Message}" });
//            }
//        }

//        public async Task<IActionResult> OnGetEditBoardFormAsync(int boardId)
//        {
//            try
//            {
//                var board = await _context.Boards
//                    .FirstOrDefaultAsync(b => b.BoardID == boardId);

//                if (board == null)
//                {
//                    return new JsonResult(new { success = false, message = "Board not found." });
//                }

//                return Partial("_Edit", board);
//            }
//            catch (Exception ex)
//            {
//                return new JsonResult(new { success = false, message = $"Error loading edit form: {ex.Message}" });
//            }
//        }

//        public async Task<IActionResult> OnPostEditBoardAsync(int boardId, string boardName, int campusTypeId)
//        {
//            if (boardId <= 0 || string.IsNullOrWhiteSpace(boardName) || campusTypeId <= 0)
//            {
//                return new JsonResult(new { success = false, message = "Invalid board ID, board name, or campus type." });
//            }

//            try
//            {
//                var board = await _context.Boards
//                    .FirstOrDefaultAsync(b => b.BoardID == boardId);

//                if (board == null)
//                {
//                    return new JsonResult(new { success = false, message = "Board not found." });
//                }

//                var boardExists = await _context.Boards
//                    .AnyAsync(b => b.BoardName.ToLower().Trim() == boardName.ToLower().Trim() && b.CampusTypeID == campusTypeId && b.BoardID != boardId);

//                if (boardExists)
//                {
//                    return new JsonResult(new { success = false, message = $"A board with the name '{boardName}' already exists for this Campus Type." });
//                }

//                board.BoardName = boardName;
//                board.CampusTypeID = campusTypeId;
//                await _context.SaveChangesAsync();

//                return new JsonResult(new { success = true, message = "Board updated successfully!" });
//            }
//            catch (Exception ex)
//            {
//                return new JsonResult(new { success = false, message = $"Error updating board: {ex.Message}" });
//            }
//        }

//        public async Task<IActionResult> OnPostDeleteBoardAsync(int boardId)
//        {
//            try
//            {
//                var board = await _context.Boards
//                    .FirstOrDefaultAsync(b => b.BoardID == boardId);

//                if (board == null)
//                {
//                    return new JsonResult(new { success = false, message = "Board not found." });
//                }

//                _context.Boards.Remove(board);
//                await _context.SaveChangesAsync();

//                return new JsonResult(new { success = true, message = "Board deleted successfully!" });
//            }
//            catch (Exception ex)
//            {
//                return new JsonResult(new { success = false, message = $"Error deleting board: {ex.Message}" });
//            }
//        }
//    }
//}

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SchoolWebApp.Data;
using SchoolWebApp.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolWebApp.Pages.MasterPages.Boards
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public IndexModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public IList<Board> Boards { get; set; } = new List<Board>();
        [BindProperty]
        public int CampusTypeID { get; set; }

        public async Task OnGetAsync()
        {
            Boards = await _context.Boards.ToListAsync();
        }

        public async Task<IActionResult> OnGetBoardsByCampusTypeAsync(int campusTypeId)
        {
            var boards = await _context.Boards
                .OrderBy(b => b.BoardID)
                .ToListAsync();

            if (campusTypeId > 0)
            {
                boards = boards.Where(b => b.CampusTypeID == campusTypeId).ToList();
            }

            return Partial("_BoardsTablePartial", boards);
        }

        public async Task<IActionResult> OnGetCampusTypeNameAsync(int campusTypeId)
        {
            try
            {
                var campusType = await _context.CampusTypes
                    .FirstOrDefaultAsync(ct => ct.CampusTypeID == campusTypeId);

                if (campusType == null)
                {
                    return new JsonResult(new { success = false, message = "Campus Type not found." });
                }

                return new JsonResult(new { success = true, campusTypeName = campusType.CampusTypeName });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Error fetching Campus Type name: {ex.Message}" });
            }
        }

        public async Task<IActionResult> OnPostAddBoardAsync(int campusTypeId, string boardName)
        {
            if (campusTypeId <= 0)
            {
                return new JsonResult(new { success = false, message = "Please select a Campus Type." });
            }

            if (string.IsNullOrWhiteSpace(boardName))
            {
                return new JsonResult(new { success = false, message = "Board Name is required." });
            }

            try
            {
                var boardExists = await _context.Boards
                    .AnyAsync(b => b.BoardName.ToLower().Trim() == boardName.ToLower().Trim() && b.CampusTypeID == campusTypeId);

                if (boardExists)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = $"A board with the name '{boardName}' already exists for this Campus Type."
                    });
                }

                var newBoard = new Board
                {
                    BoardName = boardName.Trim(),
                    CampusTypeID = campusTypeId
                };

                _context.Boards.Add(newBoard);
                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Board added successfully!" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Failed to add board: {ex.Message}" });
            }
        }

        public async Task<IActionResult> OnGetEditBoardFormAsync(int boardId)
        {
            try
            {
                var board = await _context.Boards
                    .FirstOrDefaultAsync(b => b.BoardID == boardId);

                if (board == null)
                {
                    return new JsonResult(new { success = false, message = "Board not found." });
                }

                return Partial("_Edit", board);
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Error loading edit form: {ex.Message}" });
            }
        }

        public async Task<IActionResult> OnPostEditBoardAsync(int boardId, string boardName, int campusTypeId)
        {
            if (boardId <= 0 || string.IsNullOrWhiteSpace(boardName) || campusTypeId <= 0)
            {
                return new JsonResult(new { success = false, message = "Invalid board ID, board name, or campus type." });
            }

            try
            {
                var board = await _context.Boards
                    .FirstOrDefaultAsync(b => b.BoardID == boardId);

                if (board == null)
                {
                    return new JsonResult(new { success = false, message = "Board not found." });
                }

                // Prevent duplicate BoardName within same CampusTypeID, excluding current record
                var boardExists = await _context.Boards
                    .AnyAsync(b => b.BoardID != boardId &&
                                   b.BoardName.ToLower().Trim() == boardName.ToLower().Trim() &&
                                   b.CampusTypeID == campusTypeId);

                if (boardExists)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = $"A board with the name '{boardName}' already exists for this Campus Type."
                    });
                }

                board.BoardName = boardName.Trim();
                board.CampusTypeID = campusTypeId;
                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Board updated successfully!" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Error updating board: {ex.Message}" });
            }
        }

        public async Task<IActionResult> OnPostDeleteBoardAsync(int boardId)
        {
            try
            {
                var board = await _context.Boards
                    .FirstOrDefaultAsync(b => b.BoardID == boardId);

                if (board == null)
                {
                    return new JsonResult(new { success = false, message = "Board not found." });
                }

                _context.Boards.Remove(board);
                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Board deleted successfully!" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { success = false, message = $"Error deleting board: {ex.Message}" });
            }
        }
    }
}