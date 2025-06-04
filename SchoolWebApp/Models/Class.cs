using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolWebApp.Models
{
    public class Class
    {
        [Key]
        public int ClassID { get; set; }
        [Required]
        [ForeignKey("Institution")]
        public int InstitutionID { get; set; }

        [Required]
        [ForeignKey("Campus")]
        public int CampusID { get; set; }

        [Required]
        [ForeignKey("ClassStage")]
        public int ClassStageID { get; set; }
        [Required]
        [StringLength(100)]
        public string ClassName { get; set; }

        [Required]
        public int SequenceNo { get; set; }

        [Required]
        [ForeignKey("Board")]
        public int BoardID { get; set; }

        [Required]
        public int Status { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        public Institution Institution { get; set; }
        public Campus Campus { get; set; }
        public ClassStage ClassStage { get; set; }
        public Board Board { get; set; }

    }
}
