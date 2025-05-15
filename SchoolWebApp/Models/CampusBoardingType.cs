using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolWebApp.Models
{
    public class CampusBoardingType
    {
        [Key]
        public int CampusBoardingTypeID { get; set; }
        [Required]
        [ForeignKey("Institution")]
        public int InstitutionID { get; set; }
        [Required]
        [ForeignKey("Campus")]
        public int CampusID { get; set; }
        [Required]
        [ForeignKey("BoardingType")]
        public int BoardingTypeID { get; set; }
        public bool IsActive { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; } 

        // Navigation properties
        public Institution Institution { get; set; }
        public Campus Campus { get; set; }
        public BoardingTypes BoardingType { get; set; }


    }
}
