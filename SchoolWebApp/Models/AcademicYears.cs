using System.ComponentModel.DataAnnotations;

namespace SchoolWebApp.Models
{
    public class AcademicYears
    {
        [Key]
        public int AcademicYearID { get; set; }

        [Required]
        [StringLength(50)]
        public string AcademicYear { get; set; } 
    }
}
