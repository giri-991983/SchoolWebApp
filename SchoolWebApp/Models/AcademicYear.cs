using System.ComponentModel.DataAnnotations;

namespace SchoolWebApp.Models
{
    public class AcademicYear
    {
        [Key]
        public int AcademicYearID { get; set; }

        [Required]
        [StringLength(50)]
        public string YearName { get; set; } // e.
    }
}
