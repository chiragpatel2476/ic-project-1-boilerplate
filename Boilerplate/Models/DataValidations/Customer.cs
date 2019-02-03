using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

/// <summary>
/// Original namespace 'DataAccessLayer.DataValidations' has been changed to have access to the base 'Customer' class on same namespace layer...
/// This is only for validation purpose...
/// </summary>

namespace Boilerplate.Models
{
    [MetadataType(typeof(CustomerMetadata))]
    public partial class Customer
    {
    }


    public class CustomerMetadata
    {
        [Required]
        public int customer_id { get; set; }

        [Display(Name = "Customer Name")]
        [Required (ErrorMessage = "Customer name is a required field *"), MaxLength(50, ErrorMessage = "Customer name must be less than 50 chars")]
        public string customer_name { get; set; }

        [Display(Name = "Customer Address")]
        [MaxLength(300, ErrorMessage = "Customer address must be less than 300 chars")]
        public string customer_address { get; set; }
    }

}