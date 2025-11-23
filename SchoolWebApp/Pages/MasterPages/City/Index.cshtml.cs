using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SchoolWebApp.Data;
using SchoolWebApp.Models;

namespace SchoolWebApp.Pages.MasterPages.City
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;
        private object message;

        public IndexModel(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public List<Models.City> Cities { get; set; } = new();
        public List<Models.State> States { get; set; } = new();
        public List<Models.Country> Countries { get; set; } = new();

        [BindProperty]
        public Models.City City { get; set; }

        public async Task OnGetAsync()
        {
            Countries = await _context.Countries.OrderBy(c => c.CountryName).ToListAsync();
            States = await _context.States.OrderBy(s => s.StateName).ToListAsync();
            Cities = await _context.Cities
                .Include(c => c.State)
                .ThenInclude(s => s.Country)
                .OrderBy(c => c.CityName)
                .ToListAsync();
        }

        public async Task<IActionResult> OnGetStatesByCountryAsync(int countryId)
        {
            try
            {
                var states = await _context.States
                    .Where(s => s.CountryID == countryId)
                    .OrderBy(s => s.StateName)
                    .Select(s => new { s.StateID, s.StateName })
                    .ToListAsync();

                var stateOptions = "<option value=''>Select State</option>" +
                    string.Join("", states.Select(s => $"<option value='{s.StateID}'>{s.StateName}</option>"));
                return Content(stateOptions, "text/html");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Failed to load states: {ex.Message}" });
            }
        }

        public async Task<IActionResult> OnGetCitiesByStateAsync(int? countryId, int? stateId)
        {
            if (!countryId.HasValue || !stateId.HasValue)
            {
                return BadRequest(new { success = false, message = "Both country and state must be selected." });
            }

            try
            {
                var filteredCities = await _context.Cities
                    .Include(c => c.State)
                    .ThenInclude(s => s.Country)
                    .Where(c => c.State.CountryID == countryId && c.StateID == stateId)
                    .OrderBy(c => c.CityName)
                    .ToListAsync();

                return Partial("_CityTablePartial", filteredCities);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to load cities: " + ex.Message });
            }
        }

        public async Task<IActionResult> OnPostCreateCityAsync()
        {
            try
            {
                var trimmedName = City.CityName?.Trim().ToLower().Replace(" ", "");

                var exists = await _context.Cities
                    .AnyAsync(c => c.CityName.Trim().ToLower().Replace(" ", "") == trimmedName
                                && c.StateID == City.StateID);

                if (exists)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "A city with this name already exists in this state."
                    });
                }

                _context.Cities.Add(City);
                await _context.SaveChangesAsync();

                return new JsonResult(new
                {
                    success = true,
                    message = "City created successfully!"
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = "An error occurred while creating the city.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> OnGetEditFormAsync(int id)
        {
            try
            {
                var city = await _context.Cities
                    .Include(c => c.State)
                    .ThenInclude(s => s.Country)
                    .FirstOrDefaultAsync(c => c.CityID == id);

                if (city == null)
                    return Content("City not found");

                return Partial("_Edit", city);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to load city: " + ex.Message });
            }
        }

        public async Task<IActionResult> OnPostEditCityAsync(int cityId, string cityName, int stateId)
        {
            try
            {
                var trimmedName = cityName?.Trim().ToLower().Replace(" ", "");

                var exists = await _context.Cities
                    .AnyAsync(c => c.CityName.Trim().ToLower().Replace(" ", "") == trimmedName
                                && c.StateID == stateId
                                && c.CityID != cityId);

                if (exists)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "A city with this name already exists in this state."
                    });
                }

                var cityInDb = await _context.Cities.FindAsync(cityId);
                if (cityInDb == null)
                    return new JsonResult(new { success = false, message = "City not found" });

                cityInDb.CityName = cityName;
                cityInDb.StateID = stateId;

                await _context.SaveChangesAsync();

                return new JsonResult(new { success = true, message = "City updated successfully" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = "An error occurred while updating the city.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> OnPostDeleteCityAsync(int id)
        {
            try
            {
                var city = await _context.Cities.FindAsync(id);
                if (city == null)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "City not found."
                    });
                }

                _context.Cities.Remove(city);
                await _context.SaveChangesAsync();

                return new JsonResult(new
                {
                    success = true,
                    message = "City deleted successfully."
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = "An error occurred while deleting the city.",
                    error = ex.Message
                });
            }
        }

        public async Task<IActionResult> OnGetStatesForEditAsync(int cityId)
        {
            try
            {
                var city = await _context.Cities.FindAsync(cityId);
                var states = await _context.States
                    .OrderBy(s => s.StateName)
                    .ToListAsync();

                var result = states.Select(s => new
                {
                    stateID = s.StateID,
                    stateName = s.StateName,
                    isSelected = (city != null && s.StateID == city.StateID)
                });

                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Failed to load states: " + ex.Message });
            }
        }
    }
}