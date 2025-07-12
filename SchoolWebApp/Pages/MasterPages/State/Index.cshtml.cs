using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SchoolWebApp.Data;
using SchoolWebApp.Models;

namespace SchoolWebApp.Pages.MasterPages.State
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public IndexModel(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public List<Models.State> States { get; set; } = new();
        public List<Models.Country> Countries { get; set; } = new();

        [BindProperty]
        public Models.State State { get; set; }

        public async Task OnGetAsync()
        {
            States = await _context.States
                .Include(s => s.Country)
                .OrderBy(s => s.StateName)
                .ToListAsync();
            Countries = await _context.Countries
                .OrderBy(c => c.CountryName)
                .ToListAsync();
        }

        public async Task<IActionResult> OnGetStatesByCountryAsync(int? countryId)
        {
            try
            {
                var filteredStates = await _context.States
                    .Include(s => s.Country)
                    .Where(s => countryId == null || s.CountryID == countryId)
                    .OrderBy(s => s.StateName)
                    .ToListAsync();

                return Partial("_StateTablePartial", filteredStates);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to load states: " + ex.Message });
            }
        }

        public async Task<IActionResult> OnPostCreateStateAsync()
        {
            try
            {
                var stateName = State.StateName?.Trim().ToLower().Replace(" ", "");

                // Check for duplicate State Name within the same country
                var duplicate = await _context.States
                    .AnyAsync(s => s.StateName.Trim().ToLower().Replace(" ", "") == stateName
                                && s.CountryID == State.CountryID);

                if (duplicate)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "A state with this name already exists in this country."
                    });
                }

                _context.States.Add(State);
                await _context.SaveChangesAsync();

                return new JsonResult(new
                {
                    success = true,
                    message = "State created successfully!"
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = "An error occurred while creating the state.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> OnGetEditFormAsync(int id)
        {
            try
            {
                var state = await _context.States.FindAsync(id);
                if (state == null)
                    return Content("State not found");

                return Partial("_Edit", state);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to load state: " + ex.Message });
            }
        }

        public async Task<IActionResult> OnPostEditStateAsync()
        {
            try
            {
                var exists = await _context.States
                    .AnyAsync(s => s.StateName.Trim().ToLower().Replace(" ", "") == State.StateName.Trim().ToLower().Replace(" ", "")
                                && s.CountryID == State.CountryID
                                && s.StateID != State.StateID);

                if (exists)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "A state with this name already exists in this country."
                    });
                }

                var stateInDb = await _context.States.FindAsync(State.StateID);
                if (stateInDb == null)
                    return new JsonResult(new { success = false, message = "State not found" });

                stateInDb.StateName = State.StateName;
                stateInDb.CountryID = State.CountryID;

                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "State updated successfully" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = "An error occurred while updating the state.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> OnPostDeleteStateAsync(int id)
        {
            try
            {
                var state = await _context.States.FindAsync(id);

                if (state == null)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "State not found."
                    });
                }

                _context.States.Remove(state);
                await _context.SaveChangesAsync();

                return new JsonResult(new
                {
                    success = true,
                    message = "State deleted successfully."
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = "An error occurred while deleting the state.",
                    error = ex.Message
                });
            }
        }
    }
}