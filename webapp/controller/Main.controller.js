sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "flightui5eh/formatter/Formatter",
], (Controller, Formatter) => {
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
        }

    });
});