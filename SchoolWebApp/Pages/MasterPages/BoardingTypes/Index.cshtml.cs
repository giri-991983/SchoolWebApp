using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SchoolWebApp.Data;
using SchoolWebApp.Models;

namespace SchoolWebApp.Pages.MasterPages.BoardingTypes
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public IndexModel(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public List<Models.BoardingTypes> BoardingTypesList { get; set; } = new();

        [BindProperty]
        public Models.BoardingTypes BoardingType { get; set; }

        public async Task OnGetAsync()
        {
            BoardingTypesList = await _context.BoardingTypes
                .OrderBy(b => b.BoardingType)
                .ToListAsync();
        }

        public async Task<IActionResult> OnPostCreateBoardingTypeAsync()
        {
            try
            {
                var boardingTypeName = BoardingType.BoardingType?.Trim().ToLower();

                var duplicate = await _context.BoardingTypes
                    .AnyAsync(b => b.BoardingType.ToLower() == boardingTypeName);

                if (duplicate)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "A boarding type with this name already exists."
                    });
                }

                _context.BoardingTypes.Add(BoardingType);
                await _context.SaveChangesAsync();

                return new JsonResult(new
                {
                    success = true,
                    message = "Boarding type created successfully!"
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = "An error occurred while creating the boarding type.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> OnGetEditFormAsync(int id)
        {
            var boardingType = await _context.BoardingTypes.FindAsync(id);
            if (boardingType == null)
                return Content("Boarding type not found");
            BoardingType = boardingType;


            return Partial("_Edit", this);
        }

        public async Task<IActionResult> OnPostEditBoardingTypeAsync()
        {
            //if (BoardingType == null || string.IsNullOrWhiteSpace(BoardingType.BoardingType))
            //{
            //    return new JsonResult(new { success = false, message = "Invalid form data." });
            //}
            if (BoardingType == null)
            {
                return new JsonResult(new { success = false, message = "BoardingType object is null" });
            }

            var normalizedInput = BoardingType.BoardingType.Trim().ToLower().Replace(" ", "");

            var exists = await _context.BoardingTypes
                .AnyAsync(b => b.BoardingType.Trim().ToLower().Replace(" ", "") == normalizedInput &&
                               b.BoardingTypeID != BoardingType.BoardingTypeID);

            if (exists)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = "Boarding type already exists. Please choose a different name."
                });
            }

            var boardingTypeInDb = await _context.BoardingTypes.FindAsync(BoardingType.BoardingTypeID);
            if (boardingTypeInDb == null)
            {
                return new JsonResult(new { success = false, message = "Boarding type not found." });
            }

            boardingTypeInDb.BoardingType = BoardingType.BoardingType;
            await _context.SaveChangesAsync();

            return new JsonResult(new { success = true, message = "Boarding type updated successfully." });
        }


        public async Task<IActionResult> OnPostDeleteBoardingTypeAsync(int id)
        {
            try
            {
                var boardingType = await _context.BoardingTypes.FindAsync(id);

                if (boardingType == null)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Boarding type not found."
                    });
                }

                _context.BoardingTypes.Remove(boardingType);
                await _context.SaveChangesAsync();

                return new JsonResult(new
                {
                    success = true,
                    message = "Boarding type deleted successfully."
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = "An error occurred while deleting the boarding type.",
                    error = ex.Message
                });
            }
        }
    }
}
