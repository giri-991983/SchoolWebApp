﻿
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolWebApp.Models
{
    public class Campus
    {
        [Key]
        public int CampusID { get; set; }

        [Required]
        [ForeignKey("Institution")]
        public int InstitutionID { get; set; }

        [Required]
        [ForeignKey("Zone")]
        public int ZoneID { get; set; }

        [Required, StringLength(50)]
        public string? CGUID { get; set; }

        [Required, StringLength(100)]
        public string CampuseName { get; set; }

        [Required, StringLength(50)]
        public string AffiliationNo { get; set; }

        [Required, StringLength(50)]
        public string SchoolCode { get; set; }

        [Required]
        [ForeignKey("CampusType")] // Reference the navigation property
        public int CampusTypeID { get; set; } //// Foreign key for CampusType

        [Required, StringLength(100)]
        public string PhoneNos { get; set; }

       
        public string? Address { get; set; }

      
        public string? Locality { get; set; }
        [ForeignKey("City")]
        public int? CityID { get; set; }
        [ForeignKey("State")]
        public int? StateID { get; set; }

        [ForeignKey("Country")]
        public int? CountryID { get; set; }

        [StringLength(50)]
        public string? PinCode { get; set; }

        [Required]
        public int Status { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        public virtual Institution? Institution { get; set; }

        public virtual Zone? Zone { get; set; }

        public virtual CampusType? CampusType { get; set; }
        public virtual City? City { get; set; }
        public virtual State? State { get; set; }
        public virtual Country? Country { get; set; }
        public virtual List<CampusBoardingType> CampusBoardingTypes { get; set; } = new List<CampusBoardingType>();


        //[Key]
        //public int CampusID { get; set; }

        //[Required]
        //[ForeignKey("Institution")]
        //public int InstitutionID { get; set; }

        //[Required]
        //[ForeignKey("Zone")]
        //public int ZoneID { get; set; }

        //[Required, StringLength(50)]
        //public string CGUID { get; set; }

        //[Required, StringLength(100)]
        //public string CampusName { get; set; }

        //[StringLength(50)]
        //public string AffiliationNo { get; set; }

        //[StringLength(20)]
        //public string SchoolCode { get; set; }

        //[Required]
        //[ForeignKey("CampusTypeID")]
        //public int CampusTypeID { get; set; } // Foreign key for CampusType

        //[StringLength(100)]
        //public string PhoneNos { get; set; }

        //[Required, StringLength(200)]
        //public string Address { get; set; }

        //[StringLength(100)]
        //public string Locality { get; set; }

        //[Required]
        //public int CityID { get; set; }

        //[Required]
        //public int StateID { get; set; }

        //[Required, StringLength(50)]
        //public string Country { get; set; }

        //[Required, StringLength(10)]
        //public string PinCode { get; set; }

        //[Required]
        //public bool Status { get; set; }

        //[Required]
        //public DateTime CreatedDate { get; set; }

        //public virtual Institution? Institution { get; set; }

        //public virtual Zone? Zone { get; set; }

        //public virtual CampusType? CampusType { get; set; }

    }
}
