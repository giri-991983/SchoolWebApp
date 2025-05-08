using System.ComponentModel.DataAnnotations;

namespace SchoolWebApp.Models
{
    public class Country
    {

        [Key]
        public int CountryID { get; set; }

        [Required, StringLength(100)]
        public string CountryName { get; set; }

        [StringLength(3)]
        public string? CurrencyCode { get; set; } // e.g., "USD", "INR"

        public int? CurrencyDecimal { get; set; } // e.g., 2 for 2 decimal places

        public virtual ICollection<State> States { get; set; }
        public virtual ICollection<City> Cities { get; set; }
    }
}
