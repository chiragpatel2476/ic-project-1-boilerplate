/*===============================================================================================================
 *  Name of Author: Chirag Patel (Year: 2019)
 *  Organisation: Industry Connect
 *  Project: Boilerplate
 *  Project Description: Practise Project
 *  Module: ProductFunctions - It has all the 'CRUD' front end functionalities for 'Products' Module 
 *  developed using 'React' for a MVC 'Home Controller' &  'Customers' View working with SQL Database
 ===============================================================================================================*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Header, Image, Modal } from 'semantic-ui-react';

import "isomorphic-fetch";
import { polyfill } from 'es6-promise'; polyfill();


class ProductFunctions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productId:"",
            productName: "",
            productPrice: "",
            productNameError: "",
            productPriceError: "",
            dataOperationState: "",
            openAddModal: false,
            openEditModal: false,
            openDeleteModal: false,
            productDataList: []
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
        fetch('/Boilerplate/Home/GetProductsData')
            .then(response => response.json())
            .then(data => this.setState({ productDataList: data }));
    }

    // Process before displaying modal for data update...
    preDataOperation(id, typeOfOperation) {

        // Gets the selected record details from in-memory Client-side database ('productDataList')
        // and sets it's values and displays the modal with values assigned into the 'state' variables.
        let currentRecord = []; 
        // Get the current record...
        if (typeOfOperation == "Add") {
            currentRecord["product_id"] = id,
            currentRecord["product_name"] = "",
            currentRecord["product_price"] = 0
        }
        else {
            currentRecord = this.getCurrentRecord(this.state.productDataList, id);
        }

        // Set the values into 'state' variables so that it can be displayed in 'Modal'
        this.setState({
            dataOperationState: typeOfOperation,
            productId: currentRecord["product_id"],
            productName: currentRecord["product_name"],
            productPrice: currentRecord["product_price"],
            productNameError: "",
            productPriceError: ""
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

        let jsonProductObject;
        let sourceURL;
        let confirmationMessage;

        //Compose a json object to be used in 'All' Modes
        this.jsonProductObject = {
            "product_id": this.state.productId,
            "product_name": this.state.productName,
            "product_price": this.state.productPrice
        };

        if (this.state.dataOperationState == "Add") {
            this.sourceURL = "/Boilerplate/Home/AddProductsData";
            this.confirmationMessage = "Product Record Added";
        }

        if (this.state.dataOperationState == "Edit") {
            this.sourceURL = "/Boilerplate/Home/UpdateProductsData";
            this.confirmationMessage = "Product Record Updated";
        }

        if (this.state.dataOperationState == "Delete") {
            this.sourceURL = "/Boilerplate/Home/DeleteProductsData";
            this.confirmationMessage = "Product Record Deleted";
        }
        
        // Compose & Dispatch a server call (a method in MVC controller)
        fetch(this.sourceURL, {
            method: 'post',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.jsonProductObject)
        }).then(response => {
            if (response.ok) {
                if (this.state.dataOperationState == "Add") {
                    this.addProductListData();
                    this.setState({ openAddModal: false });
                }
                else if (this.state.dataOperationState == "Edit") {
                    this.updateProductListData(this.state.productDataList, this.state.productId);
                    this.setState({ openEditModal: false });
                }
                else if (this.state.dataOperationState == "Delete") {
                    this.deleteProductListData(this.state.productId)
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
            if (obj[i].product_id == key) {
                searchedRecord = obj[i];
            }
        }
        return searchedRecord;
    }

    //Add the new record to the client side data, this will eliminate a server trip
    addProductListData() {
        // The new record will have value specified by database 
        this.loadData();
    }

    //Update the main data list, this will eliminate a server trip
    updateProductListData(obj, key) {
        // iterate over each element in the array
        for (var i = 0; i < obj.length; i++) {
            // look for the entry with a matching `key` value and update it's values with new values
            if (obj[i].product_id == key) {
                obj[i].product_name = this.state.productName;
                obj[i].product_price = this.state.productPrice;
            }
        }
    }

    //Delete the selected record from existing client side data-list, this will eliminate a server trip
    deleteProductListData(productId) {
        let existingData = this.state.productDataList;
        for (var i = 0; i < existingData.length; i++) {
            if (existingData[i].product_id == productId) {
                existingData.splice(i, 1);
            }
        }
        this.setState({ productDataList: existingData });
    }


    // Sets the values of elements by setting values in the 'state' variables
    handleChange(event) {
        event.preventDefault();
        this.setState({
            // productName: event.target.value,
            // productPrice: event.target.value
            [event.target.name]: event.target.value
        });
    }

    // Does the validations before sending the data to the server (MVC controller method)
    handleSubmit(event) {
        let nameError = false;
        let priceError = false;
        let decimalRegexExp = /^(\d*\.)?\d+$/igm;        // Original Expression:  /^(\d*\.)?\d+$/igm

        event.preventDefault();
        if ((this.state.productName.trim() == '') || (this.state.productName.length == 0)) {
            this.state.productName = this.state.productName.trim();
            this.setState({
                productNameError: "Product name is a required field *"
            })
            nameError = true;
        }
        else if (this.state.productName.length > 50) {
            this.setState({
                productNameError: "Product name must be less than 50 chars"
            })
            nameError = true;
        }
        else {
            this.setState({
                productNameError: ""
            })
            nameError = false;
        }

        if ((this.state.productPrice.length == 0) || (this.state.productPrice.trim == '')) {
            this.state.productPrice = this.state.productPrice.trim();
            this.setState({
                productPriceError: "Product price is a required field *"
            })
            priceError = true;
        }
        else if (!(/^(\d*\.)?\d+$/igm.test(this.state.productPrice))) {

            this.setState({
                productPriceError: "Product price must be a integer or decimal value"
            })
            priceError = true;
        }
        else {
            this.setState({
                productPriceError: ""
            })
            priceError = false;
        }
        // If no errors in either 'Name' or 'Address'
        if ((nameError === false) && (priceError === false)) {
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

        let productDataList = this.state.productDataList;

        let tableData = null;

        if (productDataList != "") {
            tableData = productDataList.map(service =>
                <tr key={service.product_id}>
                    <td className="four wide">{service.product_name}</td>
                    <td className="four wide">{service.product_price}</td>
                    <td className="eight wide">
                        <div style={{ display: "inline-block" }}>
                        <button className="ui yellow button" onClick={this.preDataOperation.bind(this, service.product_id, "Edit")} >
                            <i className="edit outline icon"></i>
                            EDIT
                        </button>

                        <Modal
                            style={{ height: "350px", width: "550px", top: "50px", left: "250px" }}
                            dimmer={dimmer}
                            open={this.state.openEditModal}
                            onClose={this.editClose}
                        >
                            <Modal.Header style={{ backgroundColor: "yellow" }}>
                                Edit Product Details
                            </Modal.Header>
                            <Modal.Content>
                                <form className="ui form" method="post">
                                    <div className="field">
                                        <label>
                                            <div className="three wide">Product Name:</div>
                                            <input
                                                type="text"
                                                name="productName"
                                                className="thirteen wide"
                                                placeholder="Product Name"
                                                value={this.state.productName}
                                                onChange={this.handleChange} /><br />
                                            <span style={{ color: "red" }}>{this.state.productNameError}</span>
                                        </label>
                                    </div>
                                    <div className="field">
                                        <label>
                                                <div className="three wide">Price:</div>
                                            <input
                                                type="text"
                                                name="productPrice"
                                                className="thirteen wide"
                                                placeholder="Product Price"
                                                value={this.state.productPrice}
                                                onChange={this.handleChange}
                                                /><br />
                                            <span style={{ color: "red" }}>{this.state.productPriceError}</span>
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
                        <button className="ui red button" onClick={this.preDataOperation.bind(this, service.product_id, "Delete")}>
                            <i className="trash icon"></i>
                                DELETE</button>

                            <Modal
                                style={{ height: "190px", width: "650px", top: "175px", left: "250px" }}
                                open={this.state.openDeleteModal} onClose={this.deleteClose}>
                                <Modal.Header><span style={{color: "red" }}>Delete Product?</span></Modal.Header>
                                <Modal.Content>
                                    <p>Are you sure you want to delete the product with id = {this.state.productId}?</p>
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
                        Add New Product
                    </button>

                    <Modal
                        style={{ height: "350px", width: "550px", top: "50px", left: "250px" }}
                        dimmer={dimmerAdd}
                        open={this.state.openAddModal}
                        onClose={this.addClose}
                    >
                        <Modal.Header style={{ backgroundColor: "blue" }}>
                            Create New Product
                        </Modal.Header>
                        <Modal.Content>
                            <form className="ui form" method="post">
                                <div className="field">
                                    <label>
                                        <div className="three wide">Product Name:</div>
                                        <input
                                            type="text"
                                            name="productName"
                                            className="thirteen wide"
                                            placeholder="Product Name"
                                            value={this.state.productName}
                                            onChange={this.handleChange} /><br />
                                        <span style={{ color: "red" }}>{this.state.productNameError}</span>
                                    </label>
                                </div>
                                <div className="field">
                                    <label>
                                        <div className="three wide">Price:</div>
                                        <input
                                            type="text"
                                            name="productPrice"
                                            className="thirteen wide"
                                            placeholder="Product Price"
                                            value={this.state.productPrice}
                                            onChange={this.handleChange}
                                         /><br />
                                        <span style={{ color: "red" }}>{this.state.productPriceError}</span>
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
                                <th className="four wide">Product Name</th>
                                <th className="four wide">Product Price</th>
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

export default ProductFunctions;
