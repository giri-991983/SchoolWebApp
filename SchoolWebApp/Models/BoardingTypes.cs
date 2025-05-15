using System.ComponentModel.DataAnnotations;

namespace SchoolWebApp.Models
{
    public class BoardingTypes
    {
        [Key]
        public int BoardingTypeID { get; set; }
        [Required]
        [StringLength(50)]
        public string BoardingType { get; set; }
    }
}
