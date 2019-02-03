/*===============================================================================================================
 *  Name of Author: Chirag Patel (Year: 2019)
 *  Organisation: Industry Connect
 *  Project: Boilerplate
 *  Project Description: Practise Project
 *  Module: SaleFunctions - It has all the 'CRUD' front end functionalities for 'Sales' Module 
 *  developed using 'React' for a MVC 'Home Controller' &  'Customers' View working with SQL Database
 ===============================================================================================================*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Header, Image, Modal } from 'semantic-ui-react';

import "isomorphic-fetch";
import { polyfill } from 'es6-promise';import { isDate, isNullOrUndefined } from 'util';
 polyfill();


class SaleFunctions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            saleId:"",
            productId: "",
            customerId: "",
            storeId: "",
            dateSold: "",
            productIdError: "",
            customerIdError: "",
            storeIdError: "",
            dateSoldError: "",
            dataOperationState: "",
            openAddModal: false,
            openEditModal: false,
            openDeleteModal: false,
            saleDataList: [],
            customerIdNameList: [],
            productIdNameList: [],
            storeIdNameList: [],
            customerSelectOptions: [],
            productSelectOptions: [],
            storeSelectOptions:[]
        };

        this.loadData = this.loadData.bind(this);
        this.preDataOperation = this.preDataOperation.bind(this);
       // this.preDelete = this.preDelete.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);

        this.addShow = dimmerAdd => () => this.setState({ dimmerAdd, openAddModal: true })
        this.addClose = () => this.setState({ openAddModal: false })

        this.editShow = dimmer => () => this.setState({ dimmer, openEditModal: true })
        this.editClose = () => this.setState({ openEditModal: false })

        this.deleteShow = () => this.setState({  openDeleteModal: true })
        this.deleteClose = () => this.setState({ openDeleteModal: false })
    }

    // First ever time when DOM is rendered on the screen...
    componentDidMount() {
        
        this.loadData();
    }

    

    loadData() {

        let selOptLists1 = [];
        let selOptLists2 = [];
        let selOptLists3 = [];
        // ajax call logic - This function loads all the data from database.
        // The below syntax is the to be BEST used for data access.
        fetch('/Boilerplate/Home/GetCustomerIdNameList')
            .then(response => response.json())
            .then(data => {
                selOptLists1.push(<option key="" value=""></option>);
                for (var i = 0; i < data.length; i++) {
                    selOptLists1.push(<option key={data[i].customer_id} value={data[i].customer_id}> {data[i].customer_name} </option>);
                }
                this.setState({ customerSelectOptions: selOptLists1 });
                this.setState({ customerIdNameList: data });
            });
        
        fetch('/Boilerplate/Home/GetProductIdNameList')
            .then(response => response.json())
            .then(data => {
                    selOptLists2.push(<option key="" value=""></option>);
                    for (var i = 0; i < data.length; i++) {
                        selOptLists2.push(<option key={data[i].product_id} value={data[i].product_id}> {data[i].product_name} </option>);
                    }
                    this.setState({ productSelectOptions: selOptLists2 });
                    this.setState({ productIdNameList: data });
            });
           

        fetch('/Boilerplate/Home/GetStoreIdNameList')
            .then(response => response.json())
            .then(data => {
                    selOptLists3.push(<option key="" value=""></option>);
                    for (var i = 0; i < data.length; i++) {
                        selOptLists3.push(<option key={data[i].store_id} value={data[i].store_id}> {data[i].store_name} </option>);
                    }
                    this.setState({ storeSelectOptions: selOptLists3 });
                    this.setState({ storeIdNameList: data })
            });
           

        fetch('/Boilerplate/Home/GetSalesData')
            .then(response => response.json())
            .then(data => this.setState({ saleDataList: data }));
        
    }


    // Process before displaying modal for data update...
    preDataOperation(id, typeOfOperation) {

        // Gets the selected record details from in-memory Client-side database ('saleDataList')
        // and sets it's values and displays the modal with values assigned into the 'state' variables.
        let currentRecord = []; 
        // Get the current record...
        if (typeOfOperation == "Add") {
            currentRecord["sales_id"] = id,
            currentRecord["product_id"] = "",
            currentRecord["customer_id"] = "",
            currentRecord["store_id"] = "",
            currentRecord["date_sold"] = ""
        }
        else {
            currentRecord = this.getCurrentRecord(this.state.saleDataList, id);
        }

        // Set the values into 'state' variables so that it can be displayed in 'Modal'
        this.setState({
            dataOperationState: typeOfOperation,
            saleId: currentRecord["sales_id"],
            productId: currentRecord["product_id"],
            customerId: currentRecord["customer_id"],
            storeId: currentRecord["store_id"],
            dateSold: currentRecord["date_sold"],
            productIdError: "",
            customerIdError: "",
            storeIdError: "",
            dateSoldError: "",
        });

        if (typeOfOperation == "Add") {
            this.setState({ openAddModal: true });
        }
        if (typeOfOperation == "Edit") {
            this.setState({ openEditModal: true });
        }
        if (typeOfOperation == "Delete") {
            this.setState({ openDeleteModal: true });
        }

    }


    // Delete Confirmed
    deleteRecord() {

        this.sendDataOperationRequest();
    }

    // Prepares and sends the request to the server for all the data operations 
    // like 'add', 'update' & 'delete'
    sendDataOperationRequest() {

        let jsonSaleObject;
        let sourceURL;
        let confirmationMessage;

        //Compose a json object to be used in 'All' Modes
        this.jsonSaleObject = {
            "sales_id": this.state.saleId,
            "product_id": this.state.productId,
            "customer_id": this.state.customerId,
            "store_id": this.state.storeId,
            "date_sold": this.state.dateSold
        };

        if (this.state.dataOperationState == "Add") {
            this.sourceURL = "/Boilerplate/Home/AddSalesData";
            this.confirmationMessage = "Sale Record Added";
        }

        if (this.state.dataOperationState == "Edit") {
            this.sourceURL = "/Boilerplate/Home/UpdateSalesData";
            this.confirmationMessage = "Sale Record Updated";
        }

        if (this.state.dataOperationState == "Delete") {
            this.sourceURL = "/Boilerplate/Home/DeleteSalesData";
            this.confirmationMessage = "Sale Record Deleted";
        }
        
        // Compose & Dispatch a server call (a method in MVC controller)
        fetch(this.sourceURL, {
            method: 'post',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.jsonSaleObject)
        }).then(response => {
            if (response.ok) {
                if (this.state.dataOperationState == "Add") {
                    this.addSaleListData();
                    this.setState({ openAddModal: false });
                }
                else if (this.state.dataOperationState == "Edit") {
                    this.updateSaleListData(this.state.saleDataList, this.state.saleId);
                    this.setState({ openEditModal: false });
                }
                else if (this.state.dataOperationState == "Delete") {
                    this.deleteSaleListData(this.state.saleId)
                    this.setState({ openDeleteModal: false });
                } 
                alert(this.confirmationMessage);
                this.forceUpdate();     // Refreshes the screen by re-rending
                }
            }); 
    }

    //return an array of values that match on a certain key
    getCurrentRecord(obj, key) {

        var searchedRecord = [];
        // iterate over each element in the array
        for (var i = 0; i < obj.length; i++) {
            // look for the entry with a matching `code` value
            if (obj[i].sales_id == key) {
                searchedRecord = obj[i];
            }
        }
        return searchedRecord;
    }

    //return the value from 2nd field, by searching values of first field
    getNameById(obj, key) {

        let currentRecord;
        let keyFromData;
        let valueForKey;
        let retValue = "";
        
        // iterate over each element in the array
        for (var i = 0; i < obj.length; i++) {
            currentRecord = obj[i];
            keyFromData = Object.keys(currentRecord)[0]
            valueForKey = currentRecord[keyFromData];
            
            if (valueForKey == key) {

                keyFromData = Object.keys(currentRecord)[1];
                retValue = currentRecord[keyFromData];
            }
        }
        return retValue;

    }

    // This function should return the date in "dd MMM yyyy" or "dd MMMM yyyy" format
    // partOrFullMonthName: '1' returns short month name & '2' returns full month name
    getDateWithMonthNames(dateValue, partOrFullMonthName) {
        let retValue;
        let shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let fullMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let objDate = new Date(dateValue);
        
        if (!isNullOrUndefined(dateValue)) {
            if (partOrFullMonthName == 1) {
                retValue = objDate.getDate().toString() + " " + shortMonthNames[objDate.getMonth()].toString() + " " + objDate.getFullYear().toString();
            }
            else {
                retValue = objDate.getDate().toString() + " " + fullMonthNames[objDate.getMonth()].toString() + " " + objDate.getFullYear().toString();
            }
        }
        

        return retValue;
    }

    //Recreate the client side recordset
    addSaleListData() {
        // The new record will have value specified by database 
        this.loadData();
    }

    //Update the main data list, this will eliminate a server trip
    updateSaleListData(obj, key) {
        // iterate over each element in the array
        for (var i = 0; i < obj.length; i++) {
            // look for the entry with a matching `key` value and update it's values with new values
            if (obj[i].sales_id == key) {
                obj[i].product_id = this.state.productId;
                obj[i].customer_id = this.state.customerId;
                obj[i].store_id = this.state.storeId;
                obj[i].date_sold = this.state.dateSold;
            }
        }
    }

    //Delete the selected record from existing client side data-list, this will eliminate a server trip
    deleteSaleListData(saleId) {
        let existingData = this.state.saleDataList;
        for (var i = 0; i < existingData.length; i++) {
            if (existingData[i].sales_id == saleId) {
                existingData.splice(i, 1);
            }
        }
        this.setState({ saleDataList: existingData });
    }


    // Sets the values of elements by setting values in the 'state' variables
    handleChange(event) {
        event.preventDefault();
        this.setState({
            // productId: event.target.value,
            // customerId: event.target.value
            [event.target.name]: event.target.value
        });
    }

    // Does the validations before sending the data to the server (MVC controller method)
    handleSubmit(event) {

        let productError = false;
        let customerError = false;
        let storeError = false;
        let dateError = false;
        let dateRegexExp = /^(19[5-9][0-9]|20[0-4][0-9]|2050)[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])$/igm;        
// Original Expression:  /^(19[5-9][0-9]|20[0-4][0-9]|2050)[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])$/igm

        event.preventDefault();

        if ((this.state.productId.trim == '') || (this.state.productId.length == 0)) {
            this.state.productId = this.state.productId.trim();
            this.setState({
                productIdError: "Product name is a required field *"
            })
            productError = true;
        }
        else {
            this.setState({
                productIdError: ""
            })
            productError = false;
        }

        if ((this.state.customerId.trim == '') || (this.state.customerId.length == 0)) {
            this.state.customerId = this.state.customerId.trim();
            this.setState({
                customerIdError: "Customer name is a required field *"
            })
            customerError = true;
        }
        else {
            this.setState({
                customerIdError: ""
            })
            customerError = false;
        }

        if ((this.state.storeId.trim == '') || (this.state.storeId.length == 0)) {
            this.state.storeId = this.state.storeId.trim();
            this.setState({
                storeIdError: "Store name is a required field *"
            })
            storeError = true;
        }
        else {
            this.setState({
                storeIdError: ""
            })
            storeError = false;
        }


        if ((this.state.dateSold.length == 0) || (this.state.dateSold.trim == '')) {
            this.state.dateSold = this.state.dateSold.trim();
            this.setState({
                dateSoldError: "Date of sale is a required field *"
            })
            dateError = true;
        }
        else if (!(dateRegexExp.test(this.state.dateSold))) {
            this.setState({
                dateSoldError: "Please provide date in strict 'YYYY/MM/DD' format."
            })
            dateError = true;
        }
        else {
            this.setState({
                dateSoldError: ""
            })
            dateError = false;
        }
        // If no errors in either 'Name' or 'Address'
        if ((productError === false) && (customerError === false) && (storeError === false) && (dateError === false)) {
            this.sendDataOperationRequest();
            return true
        }
        return false;
    }

    // Renders the components into DOM (or screen)
    render() {

        const { openAddModal, dimmerAdd } = this.state;
        const { openEditModal, dimmer } = this.state;
        const { openDeleteModal } = this.state

        let saleDataList = this.state.saleDataList;
        let tableData = null;

        if (saleDataList != "") {
            tableData = saleDataList.map(service =>
                <tr key={service.sales_id}>
                    <td className="three wide">{this.getNameById(this.state.customerIdNameList, service.customer_id)}</td>
                    <td className="three wide">{this.getNameById(this.state.productIdNameList, service.product_id)}</td>
                    <td className="three wide">{this.getNameById(this.state.storeIdNameList, service.store_id)}</td>
                    <td className="three wide">{this.getDateWithMonthNames(service.date_sold, 1)}</td>
                    <td className="four wide">
                        <div style={{ display: "inline-block" }}>
                        <button className="ui yellow button" onClick={this.preDataOperation.bind(this, service.sales_id, "Edit")} >
                            <i className="edit outline icon"></i>
                            EDIT
                        </button>

                            <Modal
                                style={{ height: "500px", width: "650px", top: "50px", left: "250px" }}
                                dimmer={dimmer}
                                open={this.state.openEditModal}
                                onClose={this.editClose}
                            >
                                <Modal.Header style={{ backgroundColor: "blue" }}>
                                    Edit Sale Details
                        </Modal.Header>
                                <Modal.Content>
                                    <form className="ui form" method="post">
                                        <div className="field">
                                            <label>
                                                <div className="three wide">Customer Name:</div>
                                                <select
                                                    name="customerId"
                                                    className="thirteen wide"
                                                    placeholder="Customer Name"
                                                    value={this.state.customerId}
                                                    onChange={this.handleChange}
                                                >
                                                    {this.state.customerSelectOptions}
                                                </select>
                                                <div style={{ color: "red" }}>{this.state.customerIdError}</div>
                                            </label>
                                        </div>
                                        <div className="field">
                                            <label>
                                                <div className="three wide">Product Name:</div>
                                                <select
                                                    name="productId"
                                                    className="thirteen wide"
                                                    placeholder="Product Name"
                                                    value={this.state.productId}
                                                    onChange={this.handleChange}
                                                >
                                                    {this.state.productSelectOptions}
                                                </select>
                                                <div style={{ color: "red" }}>{this.state.productIdError}</div>
                                            </label>
                                        </div>
                                        <div className="field">
                                            <label>
                                                <div className="three wide">Store Name:</div>
                                                <select
                                                    name="storeId"
                                                    className="thirteen wide"
                                                    placeholder="Store Name"
                                                    value={this.state.storeId}
                                                    onChange={this.handleChange}
                                                >
                                                    {this.state.storeSelectOptions}
                                                </select>
                                                <div style={{ color: "red" }}>{this.state.storeIdError}</div>
                                            </label>
                                        </div>
                                        <div className="field">
                                            <label>
                                                <div className="three wide">Sale Date:</div>
                                                <input
                                                    type="text"
                                                    name="dateSold"
                                                    className="thirteen wide"
                                                    placeholder="Sale Date: YYYY/MM/DD"
                                                    value={this.state.dateSold}
                                                    onChange={this.handleChange}
                                                />
                                                <div style={{ color: "red" }}>{this.state.dateSoldError}</div>
                                            </label>
                                        </div>
                                    </form>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button color='black' onClick={this.editClose}>
                                        Cancel
                                </Button>
                                    <Button
                                        positive
                                        icon='checkmark'
                                        labelPosition='right'
                                        content="Edit"
                                        type="submit"
                                        onClick={this.handleSubmit}
                                    />
                                </Modal.Actions>
                            </Modal>

                        </div>
                        <div style={{ display: "inline-block" }}>
                        <button className="ui red button" onClick={this.preDataOperation.bind(this, service.sales_id, "Delete")}>
                            <i className="trash icon"></i>
                                DELETE</button>

                            <Modal
                                style={{ height: "190px", width: "650px", top: "175px", left: "250px" }}
                                open={this.state.openDeleteModal} onClose={this.deleteClose}>
                                <Modal.Header><span style={{color: "red" }}>Delete Sale?</span></Modal.Header>
                                <Modal.Content>
                                    <p>Are you sure you want to delete the sale with id = {this.state.saleId}?</p>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button color='black' onClick={this.deleteClose}>No</Button>
                                    <Button negative icon='times' labelPosition='right' content='Delete'
                                        onClick={this.deleteRecord}/>
                                </Modal.Actions>
                            </Modal>

                        </div>
                    </td>
                </tr>
            )
        }
        return (
            
            <React.Fragment>
                
                <div style={{marginTop: "5px", marginBottom: "25px"}}>
                    <button className="ui blue button" onClick={this.preDataOperation.bind(this, 0, "Add")} >
                        <i className="plus square icon"></i>
                        Create New Sale
                    </button>
                    <Modal
                        style={{ height: "500px", width: "650px", top: "50px", left: "250px" }}
                        dimmer={dimmer}
                        open={this.state.openAddModal}
                        onClose={this.addClose}
                    >
                        <Modal.Header style={{ backgroundColor: "blue" }}>
                            Add Sale Details
                        </Modal.Header>
                        <Modal.Content>
                            <form className="ui form" method="post">
                                <div className="field">
                                    <label>
                                        <div className="three wide">Customer Name:</div>
                                        <select
                                            name="customerId"
                                            className="thirteen wide"
                                            placeholder="Customer Name"
                                            value={this.state.customerId}
                                            onChange={this.handleChange}
                                        >
                                            {this.state.customerSelectOptions}
                                        </select>
                                        <div style={{ color: "red" }}>{this.state.customerIdError}</div>
                                    </label>
                                </div>
                                <div className="field">
                                    <label>
                                        <div className="three wide">Product Name:</div>
                                        <select
                                            name="productId"
                                            className="thirteen wide"
                                            placeholder="Product Name"
                                            value={this.state.productId}
                                            onChange={this.handleChange}
                                        >
                                            {this.state.productSelectOptions}
                                        </select>
                                        <div style={{ color: "red" }}>{this.state.productIdError}</div>
                                    </label>
                                </div>
                                <div className="field">
                                    <label>
                                        <div className="three wide">Store Name:</div>
                                        <select
                                            name="storeId"
                                            className="thirteen wide"
                                            placeholder="Store Name"
                                            value={this.state.storeId}
                                            onChange={this.handleChange}
                                        >
                                            {this.state.storeSelectOptions}
                                        </select>
                                        <div style={{ color: "red" }}>{this.state.storeIdError}</div>
                                    </label>
                                </div>
                                <div className="field">
                                    <label>
                                        <div className="three wide">Sale Date:</div>
                                        <input
                                            type="text"
                                            name="dateSold"
                                            className="thirteen wide"
                                            placeholder="Sale Date: YYYY/MM/DD"
                                            value={this.state.dateSold}
                                            onChange={this.handleChange}
                                        />
                                        <div style={{ color: "red" }}>{this.state.dateSoldError}</div>
                                    </label>
                                </div>
                            </form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='black' onClick={this.addClose}>
                                Cancel
                                </Button>
                            <Button
                                positive
                                icon='checkmark'
                                labelPosition='right'
                                content="Create"
                                type="submit"
                                onClick={this.handleSubmit}
                            />
                        </Modal.Actions>
                    </Modal>
                    
                </div>
                <div>
                    <table className="ui striped table">
                        <thead>
                            <tr>
                                <th className="three wide">Customer</th>
                                <th className="three wide">Product</th>
                                <th className="three wide">Store</th>
                                <th className="three wide">Date Sold</th>
                                <th className="four wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData}
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        )
    }
}

export default SaleFunctions;
