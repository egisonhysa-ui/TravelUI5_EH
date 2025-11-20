sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "flightui5eh/formatter/Formatter",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
], (Controller, Formatter, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("flightui5eh.controller.Main", {
        formatter: Formatter,

        onInit() {
            var oFlightJSONModel = new sap.ui.model.json.JSONModel();
            var that = this;
            //read the data from Back End (READ_GET_ENTITYSET)
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/Flight";
            oDataModel.read(sPath, {
                sorters: [new sap.ui.model.Sorter("Carrid", false)],
                success: function (oresponse) {
                    console.log(oresponse);
                    //attach the data to the model
                    oFlightJSONModel.setData(oresponse.results);
                    //attach the Model to the View
                    that.getView().setModel(oFlightJSONModel, "flightDataModel");
                },
                error: function (oerror) {
                    console.log("error")
                },
            });

        },

        onItemPress: function (oEvent) {

            // Get the row/item that was clicked
            var oItem = oEvent.getParameter("listItem");

            // Get its binding context for the model
            var oCtx = oItem.getBindingContext("flightDataModel");

            var sCarrid = oCtx.getProperty("Carrid");
            console.log("Selected Carrid:", sCarrid);

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Detail", { Carrid: sCarrid });
        },

        onListItemPress: function (oItem) {
            // debugger
            this.getOwnerComponent().getRouter().navTo("Detail2", {
                Carrid: oItem.getSource().getBindingContext("flightDataModel").getProperty().Carrid
            });
        },

        //***************************************************
        //********************Open Create Dialog*************
        //************************************************** */
        onAddNewRecord: function () {
            if (!this.oDialog) {
                this.loadFragment({
                    name: "flightui5eh.Fragment.CreateAirline",
                }).then(
                    function (oDialog) {
                        this.oDialog = oDialog;
                        this.oDialog.open();
                    }.bind(this)
                );
            } else {
                this.oDialog.open();
            }
        },

        onCancelRecord: function () {
            this.oDialog.close();
        },

        onCreateNewRecord: function () {

            var sCarrid = this.getView().byId("carrIDInput").getValue();

            if (!sCarrid) {
                MessageToast.show("The CarrId should not empty");
                return;
            };

            var sCarrname = this.getView().byId("carrNameInput").getValue();
            var sCurrcode = this.getView().byId("currCodeInput").getValue();
            var sUrl = this.getView().byId("URLInput").getValue();

            var addparam = {
                Carrid: sCarrid,
                Carrname: sCarrname,
                Currcode: sCurrcode,
                Url: sUrl
            };

            var that = this;
            var oDataModel = this.getOwnerComponent().getModel();

            this.oDialog.setBusy(true);

            oDataModel.callFunction("/create_airline", {
                method: "POST",
                urlParameters: addparam,
                success: function (oresponse) {

                    that.oDialog.close();
                    that.oDialog.setBusy(false);
                    that.readFlight(that);
                    MessageToast.show("Airline created successfuly");

                },
                error: function (oerror) {
                    MessageToast.show("There was an error");
                    that.oDialog.close();
                    that.oDialog.setBusy(false);
                },
            });

        },

        readFlight: function (that) {
            var oFlightModel = that.getView().getModel("flightDataModel");
            var oDataModel = that.getOwnerComponent().getModel();
            var sPath = "/Flight";

            oDataModel.read(sPath, {
                sorters: [new sap.ui.model.Sorter("Carrid", false)],
                success: function (oresponse) {
                    console.log(oresponse);
                    //attach the data to the model
                    oFlightModel.setData(oresponse.results);
                },
                error: function (oerror) { },
            });
        },

        onDeleteSelected: function () {
            var oTable = this.byId("_IDGenTable1");
            var aSelectedItems = oTable.getSelectedItems();
            oTable.removeSelections();

            if (aSelectedItems.length === 0) {
                sap.m.MessageToast.show("Please select at least one airline to delete.");
                return;
            }

            // Collect IDs
            var aCarrids = aSelectedItems.map(function (oItem) {
                return oItem.getBindingContext("flightDataModel").getProperty("Carrid");
            });

            // Confirmation dialog
            var that = this;
            sap.m.MessageBox.confirm("Are you sure you want to delete selected airlines?", {
                title: "Confirm Deletion",
                actions: ["Yes", "No"],
                onClose: function (sAction) {
                    if (sAction === "Yes") {
                        that._deleteAirlines(aCarrids);
                    }
                }
            });
        },

        _deleteAirlines: function (aCarrids) {
            var oDataModel = this.getOwnerComponent().getModel();
            var that = this;

            // Loop through each Carrid and call the RAP function
            aCarrids.forEach(function (sCarrid) {
                var addparam = {
                    Carrid: sCarrid
                };

                oDataModel.callFunction("/delete_airline", {
                    method: "POST",
                    urlParameters: addparam,
                    success: function () {
                        sap.m.MessageToast.show("Airlines deleted successfully.");
                        that.readFlight(that);
                    },
                    error: function () {
                        sap.m.MessageToast.show("Error deleting airlines.");
                    }
                });
            });
        },

        onModifySaveRecord: function () {
            // Get values from the dialog inputs
            var sCarrid = this.getView().byId("carrIDInput1").getValue();
            var sCarrname = this.getView().byId("carrNameInput1").getValue();
            var sCurrcode = this.getView().byId("currCodeInput1").getValue();
            var sUrl = this.getView().byId("URLInput1").getValue();

            // Validation: Check if required fields are filled
            if (!sCarrid || !sCarrname || !sCurrcode) {
                MessageToast.show("Please fill all required fields");
                return;
            }

            // Prepare parameters for the backend call
            var mParams = {
                Carrid: sCarrid,
                Carrname: sCarrname,
                Currcode: sCurrcode,
                Url: sUrl
            };

            var that = this;
            var oDataModel = this.getOwnerComponent().getModel();

            // Set dialog to busy state
            this.oUpdateDialog.setBusy(true);

            // Call the backend update function
            oDataModel.callFunction("/modify_airline", {
                method: "POST",
                urlParameters: mParams,
                success: function (oData, response) {
                    // Close the dialog
                    that.oUpdateDialog.close();
                    // Remove busy state
                    that.oUpdateDialog.setBusy(false);
                    // Refresh the table data
                    that.readFlight(that);
                    // Show success message
                    MessageToast.show("The Airline Updated Successfully");
                },
                error: function (oError) {
                    // Remove busy state
                    that.oUpdateDialog.setBusy(false);
                    // Show error message
                    MessageToast.show("An error occurred while updating");
                    that.oUpdateDialog.close();
                }
            });

        },

        onModifyRowRecord: function () {

            var oTable = this.getView().byId("_IDGenTable1");
            var oSelectedItem = oTable.getSelectedItem();


            if (!oSelectedItem) {
                MessageToast.show("Please select a row first.");
                return;
            }

            // Get the data of the selected item
            var oContext = oSelectedItem.getBindingContext("flightDataModel");
            var oSelectedData = oContext.getObject();

            // Store selected data in a local model for the dialog
            var oUpdateModel = new sap.ui.model.json.JSONModel(oSelectedData);
            this.getView().setModel(oUpdateModel, "updateModel");

            // Open the update dialog
            if (!this.oUpdateDialog) {
                this.loadFragment({
                    name: "flightui5eh.Fragment.ModifyAirline" // FIXED: Changed to match actual fragment name
                }).then(
                    function (oDialog) {
                        this.oUpdateDialog = oDialog;
                        this.oUpdateDialog.open();
                    }.bind(this)
                );
            } else {
                this.oUpdateDialog.open();
            }

        },

        onCancelModifyRecord: function () {
            this.oUpdateDialog.close();
        },

        onDeleteSingleItem: function (oEvent) {

            var sCarrid = oEvent.getSource().getBindingContext("flightDataModel").getObject().Carrid;

            var that = this;
            sap.m.MessageBox.confirm("Are you sure you want to delete this airline?", {
                title: "Confirm Deletion",
                actions: ["Yes", "No"],
                onClose: function (sAction) {
                    if (sAction === "Yes") {
                        that._deleteSingleAirlines(sCarrid);
                    }
                }
            });

        },

        _deleteSingleAirlines: function (sCarrid) {
            var oDataModel = this.getOwnerComponent().getModel();
            var that = this;

            var addparam = {
                Carrid: sCarrid
            };

            oDataModel.callFunction("/Delete_Item_airline", {
                method: "POST",
                urlParameters: addparam,
                success: function () {
                    sap.m.MessageToast.show("Airline deleted successfully.");
                    that.readFlight(that);
                },
                error: function () {
                    sap.m.MessageToast.show("Error deleting airline.");
                }
            });
        },
    });
});