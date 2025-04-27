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

       
        public string? ZGUID { get; set; } 

        [Required]
        [StringLength(100)]
        public string? ZoneName { get; set; }

  
        [StringLength(10)]
        public string? ShortCode { get; set; }

        [Required]
        public int Status { get; set; }
        
        public DateTime CreatedDate { get; set; }

        public virtual Institution? Institution { get; set; }       

    }
}
