sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "flightui5eh/formatter/Formatter",
], (Controller, Formatter) => {
    "use strict";

    return Controller.extend("flightui5eh.controller.Detail2", {
        formatter: Formatter,

        onInit: function () {
            // debugger
            this.getOwnerComponent().getRouter().getRoute("Detail2").attachPatternMatched(this._onObjectMatched, this);
            this.getView().getModel("FlghDetailModel");
        },

        _onObjectMatched: function (oEvent) {
            // debugger
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
        }

    });
});
