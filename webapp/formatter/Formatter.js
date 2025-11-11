sap.ui.define([
    "sap/ui/model/type/Time",
    "sap/ui/core/format/DateFormat",
], function (Time, DateFormat) {
    "use strict";
    return {

        formatCarrierUrl: function (sUrl, sCarrname) {
            if (sUrl && sUrl.trim() !== "") {
                return sUrl;
            }
            if (sCarrname && sCarrname.trim() !== "") {
                var cleanName = sCarrname.toLowerCase().replace(/\s+/g, "");
                return "www." + cleanName + ".com";
            }
            return "?"; 
        },

        getCriticalImage: function(sStatusCriticality) {
            debugger
            switch (sStatusCriticality) {
                case 1: 
                    return "/img/criticality/logo_error.png";
                case 2: 
                    return "/img/criticality/logo_warning.png";
                case 3: 
                    return "/img/criticality/logo_success.png";
            }
        },

        formatTableDates: function (oDate) {
            if (!oDate) {
                return "";
            }
            // Convert to JS Date if needed
            var date = new Date(oDate);
            // Format to DD.MM.YYYY (or whatever you prefer)
            var day = String(date.getDate()).padStart(2, "0");
            var month = String(date.getMonth() + 1).padStart(2, "0");
            var year = date.getFullYear();
            return day + "/" + month + "/" + year;
        },

        getCarrierLogo: function (sCarrid) {
            switch (sCarrid) {
                case "LH": // Lufthansa
                    return "img/airlines/lufthansa.png";
                case "AB": // Air Berlin
                    return "img/airlines/Logo_airberlin.svg.png";
                default:
                    return "img/airlines/default_logo.png";
            }
        },

    };
});