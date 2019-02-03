/*=============================================================================================================================
 *  Name of Author: Chirag Patel (Year: 2019)
 *  Organisation: Industry Connect
 *  Project: Boilerplate
 *  Project Description: Practise Project
 *  Module: Main React Module for display any of the pages. This page uses a 'session variable' created in each individual view
 *  and render the page accordingly.
 =============================================================================================================================*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
var Customers = require('./components/customers/Customers').default;
var Products = require('./components/products/Products').default;
var Stores = require('./components/stores/Stores').default;
var Sales = require('./components/sales/Sales').default;

var DisplayView  = function() {

    if (sessionStorage.getItem("displayComponent") == "Customers") {
        return (<Customers />);
    }
    else if (sessionStorage.getItem("displayComponent") == "Products") {
        return (<Products />);
    }
    else if (sessionStorage.getItem("displayComponent") == "Stores") {
        return (<Stores />);
    }
    else if (sessionStorage.getItem("displayComponent") == "Sales") {
        return (<Sales />);
    }
    else {
        return (<div><h1>Page Not Found. Please Contact Administrator.</h1></div>);
    }
    
}


const app = document.getElementById('main');
ReactDOM.render(
    <DisplayView />
    , app);