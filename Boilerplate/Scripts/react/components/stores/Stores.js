/*=============================================================================================================================
 *  Name of Author: Chirag Patel (Year: 2019)
 *  Organisation: Industry Connect
 *  Project: Boilerplate
 *  Project Description: Practise Project
 *  Module: Stores - It uses 'StoreFunctions' module and passes the details to the main 'index.js' for display
 =============================================================================================================================*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
var StoreFunctions = require('./StoreFunctions').default;

class Stores extends React.Component {

    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div>
                <h1>Stores</h1>
                <StoreFunctions />
            </div>);
    }
}

export default Stores;


