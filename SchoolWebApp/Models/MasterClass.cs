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
        public string StageName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string ClassName { get; set; } = string.Empty;

        [Required]
        public int ClassSno { get; set; }

        [Required]
        public int BoardID { get; set; }
    }
}
