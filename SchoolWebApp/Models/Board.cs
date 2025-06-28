using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolWebApp.Models
{
    public class Board
    {
        [Key]
        public int BoardID { get; set; }

        [Required]
        [StringLength(200)]
        public string BoardName { get; set; } 
        [Required]
        [ForeignKey("CampusType")]
        public int CampusTypeID { get; set; }
        public CampusType CampusType { get; set; }
    }
}
