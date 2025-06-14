using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolWebApp.Models
{
    public class ClassRoom
    {
        [Key]
        public int ClassRoomID { get; set; }

        [Required]
        [ForeignKey("Institution")]
        public int InstitutionID { get; set; }

        [Required]
        [ForeignKey("Campus")]
        public int CampusID { get; set; }

        [Required]
        [ForeignKey("CampusType")]
        public int TypeID { get; set; }

       
        [ForeignKey("Classes")]
        public int GradeID { get; set; }

        
        [ForeignKey("CourseBatch")]
        public int CourseBatchID { get; set; }

        [Required]
        [ForeignKey("AcademicYear")]
        public int AcademicYearID { get; set; }

        [Required]
        [StringLength(50)]
        public string ClassRoomName { get; set; }

        [Required]

        public int SeatingCapacity { get; set; }

        [Required]

        public int AvailableSeats { get; set; }

        [Required]
        public int Status { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        // Navigation Properties
        public Institution Institution { get; set; }
        public Campus Campus { get; set; }
        public CampusType CampusType { get; set; }
        public Class Classes { get; set; }
        public CourseBatch CourseBatch { get; set; }
        public AcademicYear AcademicYear { get; set; }
    }
}
