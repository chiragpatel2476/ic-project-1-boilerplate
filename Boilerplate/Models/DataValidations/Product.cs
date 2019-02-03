using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

/// <summary>
/// Original namespace 'DataAccessLayer.DataValidations' has been changed to have access to the base 'Product' class on same namespace layer...
/// This is only for validation purpose...
/// </summary>


namespace Boilerplate.Models
{
    [MetadataType(typeof(ProductMetaData))]
    public partial class Product
    {
    }

    public class ProductMetaData
    {
        [Required]
        public int product_id { get; set; }

        [Display(Name = "Product Name")]
        [Required(ErrorMessage = "Product name is a required field *"), MaxLength(50, ErrorMessage = "Product name must be less than 50 chars")]
        public string product_name { get; set; }

        [Display(Name = "Price")]
        [Required(ErrorMessage = "Product price is a required field *"), RegularExpression(@"^(\d*\.)?\d+$",ErrorMessage = "Product price must be a integer or decimal value")]
        public decimal product_price { get; set; }

    }
}