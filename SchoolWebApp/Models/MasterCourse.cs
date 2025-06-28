using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolWebApp.Models
{
    public class MasterCourse
    {
        [Key]
        public int MasterCourseID { get; set; }

        [Required]
        [ForeignKey("CampusType")]
        public int CampusTypeID { get; set; }

        [Required]
        [ForeignKey("Board")]
        public int BoardID { get; set; }

        [Required]
        [StringLength(100)]
        public string CourseName { get; set; }

        [Required]
        public int NoOfYears { get; set; }

        [Required]
        public int NoOfSemesters { get; set; }

     
        public CampusType CampusType { get; set; }
        public Board Board { get; set; }
    }
}
