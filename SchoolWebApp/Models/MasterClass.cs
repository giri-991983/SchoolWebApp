using System.ComponentModel.DataAnnotations;

namespace SchoolWebApp.Models
{
    public class MasterClass
    {
        [Key]
        public int MasterClassID { get; set; }

        [Required]
        public int StageNo { get; set; }

        [Required]
        [StringLength(50)]
        public string StageName { get; set; } 

        [Required]
        [StringLength(50)]
        public string ClassName { get; set; }

        [Required]
        public int ClassSno { get; set; }

        [Required]
        public int BoardID { get; set; }
    }
}
