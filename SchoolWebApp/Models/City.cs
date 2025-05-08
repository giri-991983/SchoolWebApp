using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SchoolWebApp.Models
{
    public class City
    {
        [Key]
        public int CityID { get; set; }

        [Required]
        [ForeignKey("Country")]
        public int CountryID { get; set; }

        [Required]
        [ForeignKey("State")]
        public int StateID { get; set; }

        [Required, StringLength(100)]
        public string CityName { get; set; }

        public virtual Country Country { get; set; }
        public virtual State State { get; set; }
    }
}
