/*=============================================================================================================================
 *  Name of Author: Chirag Patel (Year: 2019)
 *  Organisation: Industry Connect
 *  Project: Boilerplate
 *  Project Description: Practise Project
 *  Module: Sales - It uses 'SaleFunctions' module and passes the details to the main 'index.js' for display
 =============================================================================================================================*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
var SaleFunctions = require('./SaleFunctions').default;

class Sales extends React.Component {

    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div>
                <h1>Sales</h1>
                <SaleFunctions />
            </div>);
    }
}

export default Sales;


