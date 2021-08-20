sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "cleanup/model/models",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, Device, models, JSONModel) {
    "use strict";

    return UIComponent.extend("cleanup.Component", {

        metadata: {
            manifest: "json"
        },

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // enable routing
            this.getRouter().initialize();

            // set the device model
            this.setModel(models.createDeviceModel(), "device");
            var token = {
                "name": "Vibhu",
                "password": "demopass",
                "firstName": "Vibhu",
                "lastName": "Bro"
            }

            var oModel = new JSONModel(token);
            this.setModel(oModel, "user");

            //:::MARKET::://

            // var product = {
            //     "product": [
            //         {
            //             "ProductPicUrl": "https://5.imimg.com/data5/NO/EE/MY-956419/pvc-pipe-500x500.jpg",
            //             "owner": "utkarsh",
            //             "name": "PVC PIPES",
            //             "comment": "it is in good condition",
            //             "quantity": "2KG"
            //         },
            //         {
            //             "ProductPicUrl": "https://www.havells.com/HavellsProductImages/HavellsIndia/Content/Consumer/Flexible-Cables/lifeline-hrfr/90m/Red/cover.png",
            //             "owner": "kajal",
            //             "name": "Havells Wire",
            //             "comment": "it is in nice condition",
            //             "quantity": "500 meters"
            //         },
            //         {
            //             "ProductPicUrl": "https://5.imimg.com/data5/VY/OJ/MY-9625223/paving-stone-500x500.jpg",
            //             "owner": "kajal",
            //             "name": "Havells Optic Cable",
            //             "comment": "Not broken, bought 3 yars ago but not used",
            //             "quantity": "500meters"
            //         }
            //     ]
            // }
            // this.setModel(new JSONModel(product), "marketItem");

            var marketItems = new JSONModel("model/marketItems.json", false);
            marketItems.attachRequestCompleted(
                function () {
                    console.log(marketItems)
                    this.setModel(marketItems, "marketItem");
                }, this);


        }
    });
});
