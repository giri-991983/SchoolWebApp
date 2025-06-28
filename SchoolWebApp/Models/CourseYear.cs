using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolWebApp.Models
{
    public class CourseYear
    {
        [Key]
        public int CourseYearID { get; set; }

        [Required]
       
        [ForeignKey("Course")]
        public int CourseID { get; set; }

        [Required]
        [StringLength(100)]
        public string CourseYearName { get; set; }

        [Required]
        public int YearNo { get; set; }

        [Required]
        public int SemesterNo { get; set; }

        [Required]
        public int Status { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }
        public Course Course { get; set; }

    }
}
