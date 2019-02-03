/*=============================================================================================================================
 *  Name of Author: Chirag Patel (Year: 2019)
 *  Organisation: Industry Connect
 *  Project: Boilerplate
 *  Project Description: Practise Project
 *  Module: This is the only controller to be used for all the functionlities to work with database and views. Client developed
 *  using 'React', calls the methods of this controller, that works with the database & view operations.
 =============================================================================================================================*/


using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Boilerplate.Models;
using Newtonsoft.Json;

namespace Boilerplate.Controllers
{
    public class HomeController : Controller
    {
        Boiler_PlateEntities boilerplateDatabase = new Boiler_PlateEntities();
        

        private string RetriveDataFromPostRequestStream()
        {
            // Retrieve data from 'post' request body
            Stream req = Request.InputStream;
            req.Seek(0, System.IO.SeekOrigin.Begin);
            return new StreamReader(req).ReadToEnd();

        }


        public ActionResult Customers()
        {
            ViewBag.Message = "Customers";
            return View();
        }

        public ActionResult Products()
        {
            ViewBag.Message = "Products";

            return View();
        }

        public ActionResult Stores()
        {
            ViewBag.Message = "Stores";

            return View();
        }
        public ActionResult Sales()
        {
            ViewBag.Message = "Sales";

            return View();
        }

        [HttpGet]
        public JsonResult GetCustomerIdNameList()
        {
            // Returns Customer Id & Customer Names Only - which is used to populate 'select' list
            var custIdNameList = boilerplateDatabase.Customers.Select(c => new { c.customer_id, c.customer_name }).ToList();
            return Json(custIdNameList, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetProductIdNameList()
        {
            // Returns Product Id & Product Names Only - which is used to populate 'select' list
            var prodIdNameList = boilerplateDatabase.Products.Select(p => new { p.product_id, p.product_name }).ToList();
            return Json(prodIdNameList, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetStoreIdNameList()
        {
            // Returns Store Id & Store Names Only - which is used to populate 'select' list
            var storeIdNameList = boilerplateDatabase.Stores.Select(s => new { s.store_id, s.store_name }).ToList();
            return Json(storeIdNameList, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult GetCustomersData()
        {
            // The below way - avoids the - Circular References Error: for retrieved data.
            var customersData = boilerplateDatabase.Customers.Select(c => new { c.customer_id, c.customer_name, c.customer_address }).ToList();
            return Json(customersData, JsonRequestBehavior.AllowGet);
                
        }

        [HttpPost]
        public void AddCustomersData()
        {
            // Retrieve data from 'post' request body
            string jsonData = RetriveDataFromPostRequestStream();

            try
            {
                Customer custFromReq = JsonConvert.DeserializeObject<Customer>(jsonData);
                
                if (ModelState.IsValid)
                {
                    boilerplateDatabase.Customers.Add(custFromReq);
                    boilerplateDatabase.SaveChanges();
                }
                //return true;
            }
            catch (Exception ex)
            {
                // Try and handle malformed POST body
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        public void UpdateCustomersData()
        {
            // Retrieve data from 'post' request body
            string jsonData = RetriveDataFromPostRequestStream();

            try
            {
                Customer custFromReq = JsonConvert.DeserializeObject<Customer>(jsonData);

                Customer custForUpdate = boilerplateDatabase.Customers.FirstOrDefault(cust => cust.customer_id == custFromReq.customer_id);

                custForUpdate.customer_name = custFromReq.customer_name;
                custForUpdate.customer_address = custFromReq.customer_address;
                if (ModelState.IsValid)
                {
                    boilerplateDatabase.SaveChanges();
                }
                //return true;
            }
            catch (Exception ex)
            {
                // Try and handle malformed POST body
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        public void DeleteCustomersData()
        {
            // Retrieve data from 'post' request body
            string jsonData = RetriveDataFromPostRequestStream(); 

            //// Retrieve data from 'post' request body
            Customer custFromReq = JsonConvert.DeserializeObject<Customer>(jsonData);

            try
            {
                boilerplateDatabase.Customers.Remove(boilerplateDatabase.Customers.FirstOrDefault(cust => cust.customer_id == custFromReq.customer_id));
                boilerplateDatabase.SaveChanges();
            }
            catch (Exception ex)
            {
                // Try and handle malformed POST body
                throw new Exception(ex.Message);
            }
        }

        [HttpGet]
        public JsonResult GetProductsData()
        {
            // The below way - avoids the - Circular References Error: for retrieved data.
            var productsData = boilerplateDatabase.Products.Select(p => new { p.product_id, p.product_name, p.product_price }).ToList();
            return Json(productsData, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public void AddProductsData()
        {
            // Retrieve data from 'post' request body
            string jsonData = RetriveDataFromPostRequestStream(); 

            try
            {
                Product prodFromReq = JsonConvert.DeserializeObject<Product>(jsonData);

                if (ModelState.IsValid)
                {
                    boilerplateDatabase.Products.Add(prodFromReq);
                    boilerplateDatabase.SaveChanges();
                }
                //return true;
            }
            catch (Exception ex)
            {
                // Try and handle malformed POST body
                throw new Exception(ex.Message);
            }

        }

        [HttpPost]
        public void UpdateProductsData()
        {
            // Retrieve data from 'post' request body
            string jsonData = RetriveDataFromPostRequestStream();

            try
            {
                Product prodFromReq = JsonConvert.DeserializeObject<Product>(jsonData);

                Product prodForUpdate = boilerplateDatabase.Products.FirstOrDefault(prod => prod.product_id == prodFromReq.product_id);

                prodForUpdate.product_name = prodFromReq.product_name;
                prodForUpdate.product_price = prodFromReq.product_price;

                if (ModelState.IsValid)
                {
                    boilerplateDatabase.SaveChanges();
                }
                //return true;
            }
            catch (Exception ex)
            {
                // Try and handle malformed POST body
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        public void DeleteProductsData()
        {

            //// Retrieve data from 'post' request body
            string jsonData = RetriveDataFromPostRequestStream();

            Product prodFromReq = JsonConvert.DeserializeObject<Product>(jsonData);

            try
            {
                boilerplateDatabase.Products.Remove(boilerplateDatabase.Products.FirstOrDefault(prod => prod.product_id == prodFromReq.product_id));
                boilerplateDatabase.SaveChanges();
            }
            catch (Exception ex)
            {
                // Try and handle malformed POST body
                throw new Exception(ex.Message);
            }
        }


        [HttpGet]
        public JsonResult GetStoresData()
        {
            // The below way - avoids the - Circular References Error: for retrieved data.
            var storeData = boilerplateDatabase.Stores.Select(s => new { s.store_id, s.store_name, s.store_address }).ToList();
            return Json(storeData, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public void AddStoresData()
        {
            // Retrieve data from 'post' request body
            string jsonData = RetriveDataFromPostRequestStream();

            try
            {
                Store storeFromReq = JsonConvert.DeserializeObject<Store>(jsonData);

                if (ModelState.IsValid)
                {
                    boilerplateDatabase.Stores.Add(storeFromReq);
                    boilerplateDatabase.SaveChanges();
                }
                //return true;
            }
            catch (Exception ex)
            {
                // Try and handle malformed POST body
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        public void UpdateStoresData()
        {
            // Retrieve data from 'post' request body
            string jsonData = RetriveDataFromPostRequestStream();

            try
            {
                Store storeFromReq = JsonConvert.DeserializeObject<Store>(jsonData);

                Store storeForUpdate = boilerplateDatabase.Stores.FirstOrDefault(store => store.store_id == storeFromReq.store_id);

                storeForUpdate.store_name = storeFromReq.store_name;
                storeForUpdate.store_address = storeFromReq.store_address;

                if (ModelState.IsValid)
                {
                    boilerplateDatabase.SaveChanges();
                }
                //return true;
            }
            catch (Exception ex)
            {
                // Try and handle malformed POST body
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        public void DeleteStoresData()
        {
            // Retrieve data from 'post' request body
            string jsonData = RetriveDataFromPostRequestStream();

            //// Retrieve data from 'post' request body
            Store storeFromReq = JsonConvert.DeserializeObject<Store>(jsonData);

            try
            {
                boilerplateDatabase.Stores.Remove(boilerplateDatabase.Stores.FirstOrDefault(store => store.store_id == storeFromReq.store_id));
                boilerplateDatabase.SaveChanges();
            }
            catch (Exception ex)
            {
                // Try and handle malformed POST body
                throw new Exception(ex.Message);
            }
        }



        [HttpGet]
        public JsonResult GetSalesData()
        {

            // The below code avoids the error for 'circular reference while serializing'
            // The value of 'date_sold' field returns a 'number' value which has to be converted to date & afterwards to "yyyy/MM/dd" format.

            var salesData = boilerplateDatabase.Sales1.AsEnumerable()
                            .Select(s => new { s.sales_id, s.customer_id, s.product_id, s.store_id, date_sold =  s.date_sold.ToString("yyyy/MM/dd") });
            
           // Console.Write(salesData);
            return Json(salesData, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public void AddSalesData()
        {
            // Retrieve data from 'post' request body
            string jsonData = RetriveDataFromPostRequestStream();

            try
            {
                Sales salesFromReq = JsonConvert.DeserializeObject<Sales>(jsonData);

                if (ModelState.IsValid)
                {
                    boilerplateDatabase.Sales1.Add(salesFromReq);
                    boilerplateDatabase.SaveChanges();
                }
                //return true;
            }
            catch (Exception ex)
            {
                // Try and handle malformed POST body
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        public void UpdateSalesData()
        {
            // Retrieve data from 'post' request body
            string jsonData = RetriveDataFromPostRequestStream();

            try
            {
                Sales salesFromReq = JsonConvert.DeserializeObject<Sales>(jsonData);

                Sales salesForUpdate = boilerplateDatabase.Sales1.FirstOrDefault(sale => sale.sales_id == salesFromReq.sales_id);

                salesForUpdate.product_id = salesFromReq.product_id;
                salesForUpdate.customer_id = salesFromReq.customer_id;
                salesForUpdate.store_id = salesFromReq.store_id;
                salesForUpdate.date_sold = salesFromReq.date_sold;

                if (ModelState.IsValid)
                {
                    boilerplateDatabase.SaveChanges();
                }
                //return true;
            }
            catch (Exception ex)
            {
                // Try and handle malformed POST body
                throw new Exception(ex.Message);
            }
        }

        [HttpPost]
        public void DeleteSalesData()
        {
            // Retrieve data from 'post' request body
            string jsonData = RetriveDataFromPostRequestStream();

            //// Retrieve data from 'post' request body
            Sales salesFromReq = JsonConvert.DeserializeObject<Sales>(jsonData);

            try
            {
                boilerplateDatabase.Sales1.Remove(boilerplateDatabase.Sales1.FirstOrDefault(sale => sale.sales_id == salesFromReq.sales_id));
                boilerplateDatabase.SaveChanges();
            }
            catch (Exception ex)
            {
                // Try and handle malformed POST body
                throw new Exception(ex.Message);
            }
        }

    }
}