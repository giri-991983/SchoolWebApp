using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolWebApp.Models
{
    public class Institution
    {
        //[Key]
        //public int InstitutionID { get; set; }

        //[Required]
        //public string InstitutionName { get; set; }
        //[Required]
        //public string Description { get; set; }

        //[Required]
        //[StringLength(10)]
        //public string ShortCode { get; set; }

        //[Required]
        //[StringLength(50)]
        //[NotMapped]
        //public string IGUID { get; set; } = new Guid().ToString().ToUpper();

        //[Required]
        //public int PackageType { get; set; }

        //[Required]
        //[NotMapped]
        //public int Status { get; set; } = 1;

        //public string? LogoUrl { get; set; } = string.Empty;  // Default to empty string

        //[StringLength(200)]
        //public string? WebsiteUrl { get; set; } = string.Empty; // Default to empty string

        //[Required]
        //[NotMapped]
        //public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Key]
        public int InstitutionID { get; set; }

        [Required]
        public string? InstitutionName { get; set; }

        [Required]
        public string? Description { get; set; }

        [Required]
        [StringLength(10)]
        public string? ShortCode { get; set; }


        public string? IGUID { get; set; }

        [Required]
        public int PackageType { get; set; }

        [Required]
        public int Status { get; set; }

        public string? LogoUrl { get; set; } = string.Empty;  // Default to empty string

        [StringLength(200)]
        public string? WebsiteUrl { get; set; } = string.Empty; // Default to empty string


        public DateTime? CreatedDate { get; set; }
    }

}
