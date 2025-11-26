sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "flightui5eh/formatter/Formatter",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
], (Controller, Formatter, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("flightui5eh.controller.Detail2", {
        formatter: Formatter,

        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("Detail2").attachPatternMatched(this._onObjectMatched, this);
            this.getView().getModel("FlghDetailModel");
        },

        _onObjectMatched: function (oEvent) {
            //read the url parameters
            var sCarrId = oEvent.getParameter("arguments").Carrid;

            var oDetailJSONModel = new sap.ui.model.json.JSONModel();
            var that = this;
            //read the data from Back End (READ_GET_ENTITY)
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/Flight(Carrid='" + sCarrId + "',IsActiveEntity=true)";

            console.log(oDataModel.sServiceUrl + sPath + "?$expand=to_DetailsEGH");

            oDataModel.read(sPath, {
                urlParameters: {
                    "$expand": "to_DetailsEGH"
                },

                success: function (oresponse) {
                    console.log(oresponse);
                    //attach the data to the model
                    oDetailJSONModel.setData(oresponse);
                    //attach the Model to the View
                    that.getView().setModel(oDetailJSONModel, "FlghDetailModel");
                    console.log(that.getView().getModel("FlghDetailModel"));
                },
                error: function (oerror) { },
            });
        },

        oNavButton_press: function (oEvent) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("main");
        },

        onDeleteSingleDetail: function (oEvent) {

            var sCarrid = oEvent.getSource().getBindingContext("FlghDetailModel").getObject().Carrid;
            var sConnid = oEvent.getSource().getBindingContext("FlghDetailModel").getObject().Connid;

            var that = this;
            sap.m.MessageBox.confirm("Are you sure you want to delete this Detail airline?", {
                title: "Confirm Deletion",
                actions: ["Yes", "No"],
                onClose: function (sAction) {
                    if (sAction === "Yes") {
                        that._deleteSingleDetail(sCarrid, sConnid);
                    }
                }
            });


        },

        _deleteSingleDetail: function (sCarrid, sConnid) {
            var oDataModel = this.getOwnerComponent().getModel();
            var that = this;

            var addparam = {
                Carrid: sCarrid,
                Connid: sConnid
            };

            oDataModel.callFunction("/Delete_Item_Detail", {
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

        readFlight: function (that) {


            var sCarrId = that.getView().getModel("FlghDetailModel").getData().Carrid;

            var oDataModel = that.getOwnerComponent().getModel();
            var oDetailModel = that.getView().getModel("FlghDetailModel");

            var sPath = "/Flight(Carrid='" + sCarrId + "',IsActiveEntity=true)";

            oDataModel.read(sPath, {
                urlParameters: {
                    "$expand": "to_DetailsEGH"
                },
                success: function (oResponse) {
                    console.log(oResponse);

                    // Replace the whole object, including updated details
                    oDetailModel.setData(oResponse);
                },
                error: function (oError) { }
            });

        },

    });
});
