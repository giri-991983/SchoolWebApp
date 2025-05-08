using Microsoft.AspNetCore.Mvc;

namespace SchoolWebApp
{
    [Route("MasterData/[action]")]
    public class MasterDataController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> LoadComponent(int id)
        {
            //  return ViewComponent("MyComponent", new { id = id });
            return ViewComponent("Master", new { viewname = "Zones", FilterIds = id.ToString(), SelectedIDs = 0 });

        }
       
    }
}
