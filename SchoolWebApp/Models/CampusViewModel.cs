using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SchoolWebApp.Models
{
    public class CampusViewModel
        {
          public Campus Campus { get; set; }

        public CampusBoardingType CampusBoardingTypes { get; set; }
        public List<int> BoardingTypeIDs { get; set; } = new List<int>();
        //
    }
    }
