/*===============================================================================================================
 *  Name of Author: Chirag Patel (Year: 2019)
 *  Organisation: Industry Connect
 *  Project: Boilerplate
 *  Project Description: Practise Project
 *  Module: StoreFunctions - It has all the 'CRUD' front end functionalities for 'Stores' Module 
 *  developed using 'React' for a MVC 'Home Controller' &  'Customers' View working with SQL Database
 ===============================================================================================================*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Header, Image, Modal } from 'semantic-ui-react';

import "isomorphic-fetch";
import { polyfill } from 'es6-promise'; polyfill();


class StoreFunctions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storeId:"",
            storeName: "",
            storeAddress: "",
            storeNameError: "",
            storeAddressError: "",
            dataOperationState: "",
            openAddModal: false,
            openEditModal: false,
            openDeleteModal: false,
            storeDataList: []
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
        fetch('/Boilerplate/Home/GetStoresData')
            .then(response => response.json())
            .then(data => this.setState({ storeDataList: data }));
    }

    // Process before displaying modal for data update...
    preDataOperation(id, typeOfOperation) {

        // Gets the selected record details from in-memory Client-side database ('storeDataList')
        // and sets it's values and displays the modal with values assigned into the 'state' variables.
        let currentRecord = []; 
        // Get the current record...
        if (typeOfOperation == "Add") {
            currentRecord["store_id"] = id,
            currentRecord["store_name"] = "",
            currentRecord["store_address"] = ""
        }
        else {
            currentRecord = this.getCurrentRecord(this.state.storeDataList, id);
        }

        // Set the values into 'state' variables so that it can be displayed in 'Modal'
        this.setState({
            dataOperationState: typeOfOperation,
            storeId: currentRecord["store_id"],
            storeName: currentRecord["store_name"],
            storeAddress: currentRecord["store_address"],
            storeNameError: "",
            storeAddressError:""
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

        let jsonStoreObject;
        let sourceURL;
        let confirmationMessage;

        //Compose a json object to be used in 'All' Modes
        this.jsonStoreObject = {
            "store_id": this.state.storeId,
            "store_name": this.state.storeName,
            "store_address": this.state.storeAddress
        };

        if (this.state.dataOperationState == "Add") {
            this.sourceURL = "/Boilerplate/Home/AddStoresData";
            this.confirmationMessage = "Store Record Added";
        }

        if (this.state.dataOperationState == "Edit") {
            this.sourceURL = "/Boilerplate/Home/UpdateStoresData";
            this.confirmationMessage = "Store Record Updated";
        }

        if (this.state.dataOperationState == "Delete") {
            this.sourceURL = "/Boilerplate/Home/DeleteStoresData";
            this.confirmationMessage = "Store Record Deleted";
        }
        
        // Compose & Dispatch a server call (a method in MVC controller)
        fetch(this.sourceURL, {
            method: 'post',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.jsonStoreObject)
        }).then(response => {
            if (response.ok) {
                if (this.state.dataOperationState == "Add") {
                    this.addStoreListData();
                    this.setState({ openAddModal: false });
                }
                else if (this.state.dataOperationState == "Edit") {
                    this.updateStoreListData(this.state.storeDataList, this.state.storeId);
                    this.setState({ openEditModal: false });
                }
                else if (this.state.dataOperationState == "Delete") {
                    this.deleteStoreListData(this.state.storeId)
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
            if (obj[i].store_id == key) {
                searchedRecord = obj[i];
            }
        }
        return searchedRecord;
    }

    //Add the new record to the client side data, this will eliminate a server trip
    addStoreListData() {
        // The new record will have value specified by database 
        this.loadData();
    }

    //Update the main data list, this will eliminate a server trip
    updateStoreListData(obj, key) {
        // iterate over each element in the array
        for (var i = 0; i < obj.length; i++) {
            // look for the entry with a matching `key` value and update it's values with new values
            if (obj[i].store_id == key) {
                obj[i].store_name = this.state.storeName;
                obj[i].store_address = this.state.storeAddress;
            }
        }
    }

    //Delete the selected record from existing client side data-list, this will eliminate a server trip
    deleteStoreListData(storeId) {
        let existingData = this.state.storeDataList;
        for (var i = 0; i < existingData.length; i++) {
            if (existingData[i].store_id == storeId) {
                existingData.splice(i, 1);
            }
        }
        this.setState({ storeDataList: existingData });
    }


    // Sets the values of elements by setting values in the 'state' variables
    handleChange(event) {
        event.preventDefault();
        this.setState({
            // storeName: event.target.value,
            // storeAddress: event.target.value
            [event.target.name]: event.target.value
        });
    }

    // Does the validations before sending the data to the server (MVC controller method)
    handleSubmit(event) {
        let nameError = false;
        let addressError = false;

        event.preventDefault();
        if ((this.state.storeName.length == 0) || (this.state.storeName.trim() == "")) {
            this.state.storeName = this.state.storeName.trim();
            this.setState({
                storeNameError: "Store name is a required field *"
            })
            nameError = true;
        }
        else if (this.state.storeName.length > 50) {
            this.setState({
                storeNameError: "Store name must be less than 50 chars"
            })
            nameError = true;
        }
        else {
            this.setState({
                storeNameError: ""
            })
            nameError = false;
        }


        if (this.state.storeAddress.length > 300) {
            this.setState({
                storeAddressError: "Store address must be less than 300 chars"
            })
            addressError = true;
        }
        else {
            this.setState({
                storeAddressError: ""
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

        let storeDataList = this.state.storeDataList;

        let tableData = null;

        if (storeDataList != "") {
            tableData = storeDataList.map(service =>
                <tr key={service.store_id}>
                    <td className="four wide">{service.store_name}</td>
                    <td className="four wide">{service.store_address}</td>
                    <td className="eight wide">
                        <div style={{ display: "inline-block" }}>
                        <button className="ui yellow button" onClick={this.preDataOperation.bind(this, service.store_id, "Edit")} >
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
                                Edit Store Details
                            </Modal.Header>
                            <Modal.Content>
                                <form className="ui form" method="post">
                                    <div className="field">
                                        <label>
                                            <div className="three wide">Store Name:</div>
                                            <input
                                                type="text"
                                                name="storeName"
                                                className="thirteen wide"
                                                placeholder="Store Name"
                                                value={this.state.storeName}
                                                onChange={this.handleChange} /><br />
                                            <span style={{ color: "red" }}>{this.state.storeNameError}</span>
                                        </label>
                                    </div>
                                    <div className="field">
                                        <label>
                                            <div className="three wide">Store Address:</div>
                                            <textarea
                                                name="storeAddress"
                                                className="thirteen wide"
                                                placeholder="Store Address"
                                                value={this.state.storeAddress}
                                                onChange={this.handleChange}
                                                rows={8}
                                                cols={25} /><br />
                                            <span style={{ color: "red" }}>{this.state.storeAddressError}</span>
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
                        <button className="ui red button" onClick={this.preDataOperation.bind(this, service.store_id, "Delete")}>
                            <i className="trash icon"></i>
                                DELETE</button>

                            <Modal
                                style={{ height: "190px", width: "650px", top: "175px", left: "250px" }}
                                open={this.state.openDeleteModal} onClose={this.deleteClose}>
                                <Modal.Header><span style={{color: "red" }}>Delete Store?</span></Modal.Header>
                                <Modal.Content>
                                    <p>Are you sure you want to delete the store with id = {this.state.storeId}?</p>
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
                        Add New Store
                    </button>

                    <Modal
                        style={{ height: "450px", width: "650px", top: "50px", left: "250px" }}
                        dimmer={dimmerAdd}
                        open={this.state.openAddModal}
                        onClose={this.addClose}
                    >
                        <Modal.Header style={{ backgroundColor: "blue" }}>
                            Create New Store
                        </Modal.Header>
                        <Modal.Content>
                            <form className="ui form" method="post">
                                <div className="field">
                                    <label>
                                        <div className="three wide">Store Name:</div>
                                        <input
                                            type="text"
                                            name="storeName"
                                            className="thirteen wide"
                                            placeholder="Store Name"
                                            value={this.state.storeName}
                                            onChange={this.handleChange} /><br />
                                        <span style={{ color: "red" }}>{this.state.storeNameError}</span>
                                    </label>
                                </div>
                                <div className="field">
                                    <label>
                                        <div className="three wide">Store Address:</div>
                                        <textarea
                                            name="storeAddress"
                                            className="thirteen wide"
                                            placeholder="Store Address"
                                            value={this.state.storeAddress}
                                            onChange={this.handleChange}
                                            rows={8}
                                            cols={25} /><br />
                                        <span style={{ color: "red" }}>{this.state.storeAddressError}</span>
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
                                <th className="four wide">Store Name</th>
                                <th className="four wide">Store Address</th>
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

export default StoreFunctions;
