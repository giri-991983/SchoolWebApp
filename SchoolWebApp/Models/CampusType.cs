using System.ComponentModel.DataAnnotations;

namespace SchoolSoft.Models
{
    public class CampusType
    {
        [Key]
        public int CampusTypeID { get; set; }

        [Required, StringLength(50)]
        public string CampusTypeName { get; set; }
    }
}
