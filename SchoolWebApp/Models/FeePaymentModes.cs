using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolWebApp.Models
{
  
    public class FeePaymentModes
    {
        [Key]
        public int FeePaymentModeID { get; set; }

        [Required, StringLength(50)]
        public string? FeePaymentMode { get; set; } 
    }
}
