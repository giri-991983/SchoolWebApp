using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolWebApp.Models
{
    public class Zone
    {
        [Key]
        public int ZoneID { get; set; }

        [Required]
        [ForeignKey("Institution")]
        public int InstitutionID { get; set; }

        [Required]
        [StringLength(50)]
        public string ZGUID { get; set; } 

        [Required]
        [StringLength(100)]
        public string ZoneName { get; set; }

  
        [StringLength(10)]
        public string? ShortCode { get; set; }

        [Required]
        public int Status { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        public virtual Institution? Institution { get; set; }
        public static string GetStatusBadge(int status)
        {
            return status == 1
                ? "<span class='badge bg-success'>Active</span>"
                : "<span class='badge bg-danger'>Inactive</span>";
        }


    }
}
