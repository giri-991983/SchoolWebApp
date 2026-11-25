using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using SchoolWebApp.Auth;
using Microsoft.EntityFrameworkCore;
using SchoolWebApp.Data;
using SchoolWebApp.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddLogging(logging => logging.AddConsole());
builder.Services.AddHttpContextAccessor();
// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("dbcs")));
// ---- Login: Google sign-in, limited to the emails listed under "AdminEmails" ----
var adminEmails = AdminAuth.GetAdminEmails(builder.Configuration);
var googleClientId = builder.Configuration["Authentication:Google:ClientId"];
var googleClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];

var auth = builder.Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.LogoutPath = "/Account/Logout";
        options.AccessDeniedPath = "/Account/AccessDenied";
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        options.SlidingExpiration = true;
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
    });

// Google is only registered once its credentials are configured, so the app still
// starts (and shows a notice on the login page) before they are set.
if (!string.IsNullOrWhiteSpace(googleClientId) && !string.IsNullOrWhiteSpace(googleClientSecret))
{
    auth.AddGoogle(options =>
    {
        options.ClientId = googleClientId;
        options.ClientSecret = googleClientSecret;
        options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.Events.OnTicketReceived = context =>
        {
            var email = context.Principal?.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email) || !adminEmails.Contains(email))
            {
                context.Response.Redirect("/Account/AccessDenied");
                context.HandleResponse();
                return Task.CompletedTask;
            }

            (context.Principal!.Identity as ClaimsIdentity)!
                .AddClaim(new Claim(ClaimTypes.Role, AdminAuth.AdminRole));
            return Task.CompletedTask;
        };
        options.Events.OnRemoteFailure = context =>
        {
            context.Response.Redirect("/Account/Login?error=google");
            context.HandleResponse();
            return Task.CompletedTask;
        };
    });
}

// Every page, controller action and view-component endpoint requires a signed-in
// admin unless it opts out with [AllowAnonymous] (login, logout, access denied, error).
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole(AdminAuth.AdminRole));
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .RequireRole(AdminAuth.AdminRole)
        .Build();
});

// Behind IIS/nginx/a load balancer the app must see the original https scheme and host,
// otherwise Google rejects the redirect URI.
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

builder.Services.AddSingleton<IWebHostEnvironment>(env => builder.Environment);

var app = builder.Build();

app.UseForwardedHeaders();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}


//app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// Define the default route
app.MapControllerRoute(name: "default",
    pattern: "{controller=MasterData}/{action=Index}/{id?}"
    );

app.MapRazorPages();

app.Run();
