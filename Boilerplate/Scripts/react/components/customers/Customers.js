/*=============================================================================================================================
 *  Name of Author: Chirag Patel (Year: 2019)
 *  Organisation: Industry Connect
 *  Project: Boilerplate
 *  Project Description: Practise Project
 *  Module: Customers - It uses 'CustomerFunctions' module and passes the details to the main 'index.js' for display
 =============================================================================================================================*/



import React, { Component } from 'react';
import ReactDOM from 'react-dom';
var CustomerFunctions = require('./CustomerFunctions').default;

class Customers extends React.Component {

    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div>
                <h1>Customers</h1>
                <CustomerFunctions />
            </div>);
    }
}

export default Customers;


