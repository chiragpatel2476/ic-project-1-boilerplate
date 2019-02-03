using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

/// <summary>
/// Original namespace 'DataAccessLayer.DataValidations' has been changed to have access to the base 'Sales' class on same namespace layer...
/// This is only for validation purpose...
/// </summary>



namespace Boilerplate.Models
{
    [MetadataType(typeof(SalesMetaData))]
    public partial class Sales
    {
    }

    public class SalesMetaData
    {

        [Required (ErrorMessage = "Sales ID is a required field")]
        public int sales_id { get; set; }

        [Display(Name = "Product")]
        [Required (ErrorMessage = "Product name is a required field *")]
        public int product_id { get; set; }

        [Display(Name = "Customer")]
        [Required (ErrorMessage = "Customer name is a required field *")]
        public int customer_id { get; set; }

        [Display(Name = "Store")]
        [Required (ErrorMessage = "Store name is a required field *")]
        public int store_id { get; set; }


//        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy/MM/dd hh:mm:ss}")]

        [RegularExpression("^(19[5-9][0-9]|20[0-4][0-9]|2050)[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])$", ErrorMessage = "Please provide date in strict 'YYYY/MM/DD' format.")]
        [Display(Name = "Date Sold")]
        [Required (ErrorMessage = "Date of sale is a required field *")]
        private System.DateTime date_sold { get; set; }

    }
}