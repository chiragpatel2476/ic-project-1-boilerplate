using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;


/// <summary>
/// Original namespace 'DataAccessLayer.DataValidations' has been changed to have access to the base 'Store' class on same namespace layer...
/// This is only for validation purpose...
/// </summary>



namespace Boilerplate.Models

{
    [MetadataType(typeof(StoreMetaData))]
    public partial class Store
    {
    }


    public class StoreMetaData
    {
        [Required]
        public int store_id { get; set; }

        [Display(Name = "Store Name")]
        [Required (ErrorMessage = "Please provide store name"), MaxLength (50, ErrorMessage = "Store name can not be more than 50 chars") ]
        public string store_name { get; set; }

        [Display(Name = "Store Address")]
        [StringLength(300, ErrorMessage = "Address can not be more than 300 chars")]
        public string store_address { get; set; }

    }
}