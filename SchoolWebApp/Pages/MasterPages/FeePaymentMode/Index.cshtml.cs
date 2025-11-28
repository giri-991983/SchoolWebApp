using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SchoolWebApp.Data;
using SchoolWebApp.Models;

namespace SchoolWebApp.Pages.MasterPages.FeePaymentMode
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public IndexModel(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        //   public IList<FeePayment> FeePayments { get; set; } = new List<FeePayment>();

        public List<Models.FeePaymentModes> FeePaymentModesList { get; set; } = new();
        [BindProperty]
        public FeePaymentModes FeePayment { get; set; }


        public async Task OnGetAsync()
        {
            FeePaymentModesList = await _context.FeePaymentModes
                .OrderBy(f => f.FeePaymentMode)
                .ToListAsync();
        }

       
        public async Task<IActionResult> OnPostAddFeePaymentModeAsync()
        {
            try
            {
                var modeName = FeePayment.FeePaymentMode?.Trim().ToLower();

                // Duplicate Check
                var duplicate = await _context.FeePaymentModes
                    .AnyAsync(f => f.FeePaymentMode.ToLower() == modeName);

                if (duplicate)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "A Fee Payment Mode with this name already exists."
                    });
                }

                // Save
                _context.FeePaymentModes.Add(FeePayment);
                await _context.SaveChangesAsync();

                return new JsonResult(new
                {
                    success = true,
                    message = "Fee Payment Mode created successfully!"
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = "An error occurred while creating the Fee Payment Mode.",
                    error = ex.Message
                });
            }
        }



        // GET

        public async Task<IActionResult> OnGetEditFeePaymentFormAsync(int id)
        {
            try
            {
                var item = await _context.FeePaymentModes.FindAsync(id);

                if (item == null)
                {
                    return new JsonResult(new { success = false, message = "Fee Payment Mode not found." });
                }

                return Partial("_Edit", item);
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = $"Error loading edit form: {ex.Message}"
                });
            }
        }



        


        public async Task<IActionResult> OnPostEditFeePaymentModeAsync()
        {
            try
            {
               
                int id = FeePayment.FeePaymentModeID;
                string mode = FeePayment.FeePaymentMode?.Trim();

                // Validate
                if (id <= 0 || string.IsNullOrWhiteSpace(mode))
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Invalid input submitted."
                    });
                }

                // Duplicate Check (excluding itself)
                bool exists = await _context.FeePaymentModes
           .AnyAsync(f =>
               f.FeePaymentMode.Trim().ToLower() == mode.ToLower() &&
               f.FeePaymentModeID != id);
                if (exists)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = $"Fee Payment Mode '{mode}' already exists."
                    });
                }

                // Fetch existing record
                var itemInDb = await _context.FeePaymentModes.FindAsync(id);
                if (itemInDb == null)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Fee Payment Mode not found."
                    });
                }

                itemInDb.FeePaymentMode = mode;

                await _context.SaveChangesAsync();

                return new JsonResult(new
                {
                    success = true,
                    message = "Fee Payment Mode updated successfully!"
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = "Error updating Fee Payment Mode.",
                    error = ex.Message
                });
            }
        }



        // POST

        public async Task<IActionResult> OnPostDeleteFeePaymentModeAsync(int id)
        {
            try
            {
                var item = await _context.FeePaymentModes.FindAsync(id);


                if (item == null)
                {
                    return new JsonResult(new { success = false, message = "Fee Payment Mode not found." });
                }

                _context.FeePaymentModes.Remove(item);
                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "Fee Payment Mode deleted successfully." });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = "An error occurred while deleting the Fee Payment Mode.",
                    error = ex.Message
                });
            }
        }

    }
}
