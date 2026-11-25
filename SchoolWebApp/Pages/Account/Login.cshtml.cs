using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace SchoolWebApp.Pages.Account
{
    [AllowAnonymous]
    public class LoginModel : PageModel
    {
        private readonly IAuthenticationSchemeProvider _schemes;

        public LoginModel(IAuthenticationSchemeProvider schemes)
        {
            _schemes = schemes;
        }

        public string? ReturnUrl { get; set; }
        public bool GoogleConfigured { get; set; }
        public string? Error { get; set; }

        public async Task OnGetAsync(string? returnUrl = null, string? error = null)
        {
            ReturnUrl = returnUrl;
            Error = error;
            GoogleConfigured = await _schemes.GetSchemeAsync(GoogleDefaults.AuthenticationScheme) != null;
        }

        public async Task<IActionResult> OnPostAsync(string? returnUrl = null)
        {
            if (await _schemes.GetSchemeAsync(GoogleDefaults.AuthenticationScheme) == null)
            {
                return RedirectToPage();
            }

            var target = Url.IsLocalUrl(returnUrl) ? returnUrl! : Url.Content("~/");
            return Challenge(new AuthenticationProperties { RedirectUri = target },
                GoogleDefaults.AuthenticationScheme);
        }
    }
}
