using System.ComponentModel.DataAnnotations;

namespace SchoolWebApp.Models
{
    public class CourseBatch
    {
        [Key]
        public int CourseBatchID { get; set; }

        [Required]
        public int CourseID { get; set; }

        [Required]
        public int CourseYearID { get; set; }

        [Required]
        [StringLength(100)]
        public string BatchName { get; set; }

        [Required]
        public int AcademicYearID { get; set; }

        [Required]
        public int Status { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; } 

    }
}
