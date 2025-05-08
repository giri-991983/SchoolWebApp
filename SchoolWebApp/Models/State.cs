using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SchoolWebApp.Models
{
    public class State
    {
        [Key]
        public int StateID { get; set; }

        [Required]
        [ForeignKey("Country")]
        public int CountryID { get; set; }

        [Required, StringLength(100)]
        public string StateName { get; set; }

        public virtual Country Country { get; set; }
        public virtual ICollection<City> Cities { get; set; }
    }
}
