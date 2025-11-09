sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/json/JSONModel"
], function (Controller, Filter, FilterOperator, JSONModel) {
  "use strict";

  return Controller.extend("flightui5eh.controller.Detail", {

    onInit: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("Detail").attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function (oEvent) {
      // Get the Carrid value from route arguments
      var sCarridValue = oEvent.getParameter("arguments").Carrid;

      var oFlightJSONModel = new sap.ui.model.json.JSONModel();
      var that = this;

      var oDataModel = this.getOwnerComponent().getModel();
      var sPath = "/FlightDetailsEGH";

      // Apply filter based on Carrid
      var aFilters = [
        new Filter("Carrid", FilterOperator.EQ, sCarridValue)
      ];

      // Read child entity data
      oDataModel.read(sPath, {
        filters: aFilters,
        sorters: [new sap.ui.model.Sorter("Carrid", false)],
        success: function (oResponse) {
          console.log("Child entity response:", oResponse);
          oFlightJSONModel.setData(oResponse.results);
          that.getView().setModel(oFlightJSONModel, "detailDataModel");
        },
        error: function (oError) {
          console.error("Error reading child entity", oError);
        }
      });
    },

    oNavButton_press: function (oEvent) {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("main");
    }

  });
});
