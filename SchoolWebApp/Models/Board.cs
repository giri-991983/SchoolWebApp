using System.ComponentModel.DataAnnotations;

namespace SchoolWebApp.Models
{
    public class Board
    {
        [Key]
        public int BoardID { get; set; }

        [Required]
        [StringLength(200)]
        public string BoardName { get; set; } 
    }
}
