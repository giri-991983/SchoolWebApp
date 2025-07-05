using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolWebApp.Models
{
    public class CourseBatch
    {
        [Key]
        public int CourseBatchID { get; set; }

        [Required]
        [ForeignKey("Course")]
        public int CourseID { get; set; }

        [Required]
        [ForeignKey("CourseYear")]

        public int CourseYearID { get; set; }

        [Required]
        [StringLength(100)]
        public string BatchName { get; set; }

        [Required]
        [ForeignKey("AcademicYears")]

        public int AcademicYearID { get; set; }

        [Required]
        public int Status { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; } 
        public Course Course { get; set; }
        public CourseYear CourseYear { get; set; }
        public AcademicYears AcademicYears { get; set; }

    }
}
