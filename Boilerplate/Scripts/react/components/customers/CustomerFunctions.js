/*===============================================================================================================
 *  Name of Author: Chirag Patel (Year: 2019)
 *  Organisation: Industry Connect
 *  Project: Boilerplate
 *  Project Description: Practise Project
 *  Module: CustomerFunctions - It has all the 'CRUD' front end functionalities for 'Customers' Module 
 *  developed using 'React' for a MVC 'Home Controller' &  'Customers' View working with SQL Database
 ===============================================================================================================*/


import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Header, Image, Modal } from 'semantic-ui-react';

import "isomorphic-fetch";
import { polyfill } from 'es6-promise'; polyfill();


class CustomerFunctions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customerId:"",
            customerName: "",
            customerAddress: "",
            customerNameError: "",
            customerAddressError: "",
            dataOperationState: "",
            openAddModal: false,
            openEditModal: false,
            openDeleteModal: false,
            customerDataList: []
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
        // ajax call logic - This function loads all the data from database.
        // The below syntax is the to be BEST used for data access.
        fetch('/Boilerplate/Home/GetCustomersData')
            .then(response => response.json())
            .then(data => this.setState({ customerDataList: data }));
    }

    // Process before displaying modal for data update...
    preDataOperation(id, typeOfOperation) {

        // Gets the selected record details from in-memory Client-side database ('customerDataList')
        // and sets it's values and displays the modal with values assigned into the 'state' variables.
        let currentRecord = []; 
        // Get the current record...
        if (typeOfOperation == "Add") {
            currentRecord["customer_id"] = id,
            currentRecord["customer_name"] = "",
            currentRecord["customer_address"] = ""
        }
        else {
            currentRecord = this.getCurrentRecord(this.state.customerDataList, id);
        }

        // Set the values into 'state' variables so that it can be displayed in 'Modal'
        this.setState({
            dataOperationState: typeOfOperation,
            customerId: currentRecord["customer_id"],
            customerName: currentRecord["customer_name"],
            customerAddress: currentRecord["customer_address"],
            customerNameError: "",
            customerAddressError:""
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

        let jsonCustomerObject;
        let sourceURL;
        let confirmationMessage;

        //Compose a json object to be used in 'All' Modes
        this.jsonCustomerObject = {
            "customer_id": this.state.customerId,
            "customer_name": this.state.customerName,
            "customer_address": this.state.customerAddress
        };

        if (this.state.dataOperationState == "Add") {
            this.sourceURL = "/Boilerplate/Home/AddCustomersData";
            this.confirmationMessage = "Customer Record Added";
        }

        if (this.state.dataOperationState == "Edit") {
            this.sourceURL = "/Boilerplate/Home/UpdateCustomersData";
            this.confirmationMessage = "Customer Record Updated";
        }

        if (this.state.dataOperationState == "Delete") {
            this.sourceURL = "/Boilerplate/Home/DeleteCustomersData";
            this.confirmationMessage = "Customer Record Deleted";
        }
        
        // Compose & Dispatch a server call (a method in MVC controller)
        fetch(this.sourceURL, {
            method: 'post',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.jsonCustomerObject)
        }).then(response => {
            if (response.ok) {
                if (this.state.dataOperationState == "Add") {
                    this.addCustomerListData();
                    this.setState({ openAddModal: false });
                }
                else if (this.state.dataOperationState == "Edit") {
                    this.updateCustomerListData(this.state.customerDataList, this.state.customerId);
                    this.setState({ openEditModal: false });
                }
                else if (this.state.dataOperationState == "Delete") {
                    this.deleteCustomerListData(this.state.customerId)
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
            if (obj[i].customer_id == key) {
                searchedRecord = obj[i];
            }
        }
        return searchedRecord;
    }

    //Add the new record to the client side data, this will eliminate a server trip
    addCustomerListData() {
        // The new record will have value specified by database 
        this.loadData();
    }

    //Update the main data list, this will eliminate a server trip
    updateCustomerListData(obj, key) {
        // iterate over each element in the array
        for (var i = 0; i < obj.length; i++) {
            // look for the entry with a matching `key` value and update it's values with new values
            if (obj[i].customer_id == key) {
                obj[i].customer_name = this.state.customerName;
                obj[i].customer_address = this.state.customerAddress;
            }
        }
    }

    //Delete the selected record from existing client side data-list, this will eliminate a server trip
    deleteCustomerListData(customerId) {
        let existingData = this.state.customerDataList;
        for (var i = 0; i < existingData.length; i++) {
            if (existingData[i].customer_id == customerId) {
                existingData.splice(i, 1);
            }
        }
        this.setState({ customerDataList: existingData });
    }


    // Sets the values of elements by setting values in the 'state' variables
    handleChange(event) {
        event.preventDefault();
        this.setState({
            // customerName: event.target.value,
            // customerAddress: event.target.value
            [event.target.name]: event.target.value
        });
    }

    // Does the validations before sending the data to the server (MVC controller method)
    handleSubmit(event) {
        let nameError = false;
        let addressError = false;

        event.preventDefault();
        if ((this.state.customerName.length == 0) || (this.state.customerName.trim() == "")) {
            this.state.customerName = this.state.customerName.trim();
            this.setState({
                customerNameError: "Customer name is a required field *"
            })
            nameError = true;
        }
        else if (this.state.customerName.length > 50) {
            this.setState({
                customerNameError: "Customer name must be less than 50 chars"
            })
            nameError = true;
        }
        else {
            this.setState({
                customerNameError: ""
            })
            nameError = false;
        }


        if (this.state.customerAddress.length > 300) {
            this.setState({
                customerAddressError: "Customer address must be less than 300 chars"
            })
            addressError = true;
        }
        else {
            this.setState({
                customerAddressError: ""
            })
            addressError = false;

        }
        // If no errors in either 'Name' or 'Address'
        if ((nameError === false) && (addressError === false)) {
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

        let customerDataList = this.state.customerDataList;

        let tableData = null;

        if (customerDataList != "") {
            tableData = customerDataList.map(service =>
                <tr key={service.customer_id}>
                    <td className="four wide">{service.customer_name}</td>
                    <td className="four wide">{service.customer_address}</td>
                    <td className="eight wide">
                        <div style={{ display: "inline-block" }}>
                        <button className="ui yellow button" onClick={this.preDataOperation.bind(this, service.customer_id, "Edit")} >
                            <i className="edit outline icon"></i>
                            EDIT
                        </button>

                        <Modal
                            style={{ height: "450px", width: "650px", top: "50px", left: "250px" }}
                            dimmer={dimmer}
                            open={this.state.openEditModal}
                            onClose={this.editClose}
                        >
                            <Modal.Header style={{ backgroundColor: "yellow" }}>
                                Edit Customer Details
                            </Modal.Header>
                            <Modal.Content>
                                <form className="ui form" method="post">
                                    <div className="field">
                                        <label>
                                            <div className="three wide">Customer Name:</div>
                                            <input
                                                type="text"
                                                name="customerName"
                                                className="thirteen wide"
                                                placeholder="Customer Name"
                                                value={this.state.customerName}
                                                onChange={this.handleChange} /><br />
                                            <span style={{ color: "red" }}>{this.state.customerNameError}</span>
                                        </label>
                                    </div>
                                    <div className="field">
                                        <label>
                                            <div className="three wide">Customer Address:</div>
                                            <textarea
                                                name="customerAddress"
                                                className="thirteen wide"
                                                placeholder="Customer Address"
                                                value={this.state.customerAddress}
                                                onChange={this.handleChange}
                                                rows={8}
                                                cols={25} /><br />
                                            <span style={{ color: "red" }}>{this.state.customerAddressError}</span>
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
                        <button className="ui red button" onClick={this.preDataOperation.bind(this, service.customer_id, "Delete")}>
                            <i className="trash icon"></i>
                                DELETE</button>

                            <Modal
                                style={{ height: "190px", width: "650px", top: "175px", left: "250px" }}
                                open={this.state.openDeleteModal} onClose={this.deleteClose}>
                                <Modal.Header><span style={{color: "red" }}>Delete Customer?</span></Modal.Header>
                                <Modal.Content>
                                    <p>Are you sure you want to delete the customer with id = {this.state.customerId}?</p>
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
                        Add New Customer
                    </button>

                    <Modal
                        style={{ height: "450px", width: "650px", top: "50px", left: "250px" }}
                        dimmer={dimmerAdd}
                        open={this.state.openAddModal}
                        onClose={this.addClose}
                    >
                        <Modal.Header style={{ backgroundColor: "blue" }}>
                            Create New Customer
                        </Modal.Header>
                        <Modal.Content>
                            <form className="ui form" method="post">
                                <div className="field">
                                    <label>
                                        <div className="three wide">Customer Name:</div>
                                        <input
                                            type="text"
                                            name="customerName"
                                            className="thirteen wide"
                                            placeholder="Customer Name"
                                            value={this.state.customerName}
                                            onChange={this.handleChange} /><br />
                                        <span style={{ color: "red" }}>{this.state.customerNameError}</span>
                                    </label>
                                </div>
                                <div className="field">
                                    <label>
                                        <div className="three wide">Customer Address:</div>
                                        <textarea
                                            name="customerAddress"
                                            className="thirteen wide"
                                            placeholder="Customer Address"
                                            value={this.state.customerAddress}
                                            onChange={this.handleChange}
                                            rows={8}
                                            cols={25} /><br />
                                        <span style={{ color: "red" }}>{this.state.customerAddressError}</span>
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
                                <th className="four wide">Customer Name</th>
                                <th className="four wide">Customer Address</th>
                                <th className="eight wide">Actions</th>
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

export default CustomerFunctions;
