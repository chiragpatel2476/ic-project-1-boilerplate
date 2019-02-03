/*=============================================================================================================================
 *  Name of Author: Chirag Patel (Year: 2019)
 *  Organisation: Industry Connect
 *  Project: Boilerplate
 *  Project Description: Practise Project
 *  Module: Products - It uses 'ProductFunctions' module and passes the details to the main 'index.js' for display
 =============================================================================================================================*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
var ProductFunctions = require('./ProductFunctions').default;

class Products extends React.Component {

    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div>
                <h1>Products</h1>
                <ProductFunctions />
            </div>);
    }
}

export default Products;


