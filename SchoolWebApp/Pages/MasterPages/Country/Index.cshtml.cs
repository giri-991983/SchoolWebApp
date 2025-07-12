using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SchoolWebApp.Data;

namespace SchoolWebApp.Pages.MasterPages.Country
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public IndexModel(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }
        public List<Models.Country> Countries { get; set; } = new();

        [BindProperty]
        public Models.Country Country { get; set; }

        public async Task OnGetAsync()
        {
            Countries = await _context.Countries.OrderBy(c => c.CountryName).ToListAsync();
        }
        public async Task<IActionResult> OnPostCreateCountryAsync()
        {

            try
            {

                var countryName = Country.CountryName?.Trim().ToLower();

                // Check for duplicate Country Name
                var duplicate = await _context.Countries
                    .AnyAsync(c => c.CountryName.ToLower() == countryName);

                if (duplicate)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "A country with this name already exists."
                    });
                }


                // Save to DB
                _context.Countries.Add(Country);
                await _context.SaveChangesAsync();

                return new JsonResult(new
                {
                    success = true,
                    message = "Country created successfully!"
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = "An error occurred while creating the country.",
                    error = ex.Message
                });
            }

        }

        public async Task<IActionResult> OnGetEditFormAsync(int id)
        {
            var country = await _context.Countries.FindAsync(id);
            if (country == null)
                return Content("Country not found");

            return Partial("_Edit", country);
        }

        public async Task<IActionResult> OnPostEditCountryAsync()
        {

            var exists = await _context.Countries
                .AnyAsync(c => c.CountryName.Trim().ToLower().Replace(" ", "") == Country.CountryName.Trim().ToLower().Replace(" ", "")
                            && c.CountryID != Country.CountryID);

            if (exists)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = "Country name already exists. Please choose a different name."
                });
            }

            var countryInDb = await _context.Countries.FindAsync(Country.CountryID);
            if (countryInDb == null)
                return new JsonResult(new { success = false, message = "Country not found" });

            countryInDb.CountryName = Country.CountryName;
            countryInDb.CurrencyCode = Country.CurrencyCode;
            countryInDb.CurrencyDecimal = Country.CurrencyDecimal;

            await _context.SaveChangesAsync();

            return new JsonResult(new { success = true, message = "Country updated successfully" });
        }


        public async Task<IActionResult> OnPostDeleteCountryAsync(int id)
        {
            try
            {
                var country = await _context.Countries.FindAsync(id);

                if (country == null)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        message = "Country not found."
                    });
                }

                _context.Countries.Remove(country);
                await _context.SaveChangesAsync();

                return new JsonResult(new
                {
                    success = true,
                    message = "Country deleted successfully."
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = "An error occurred while deleting the country.",
                    error = ex.Message
                });
            }
        }

    }
}
