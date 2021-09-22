sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
], function (Controller, MessageToast, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("cleanup.controller.sell.Sell", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sapui5.training.ui.view.Launchpad
		 */
        onInit: function () {
            this.userData = this.getOwnerComponent().getModel("user").getData();
            this.marketData = this.getOwnerComponent().getModel("marketItem").getData().product;
            var ownData = [];
            for (var i = 0; i < this.marketData.length; i++) {
                console.log(this.marketData[i].owner, this.userData.name)
                if (this.marketData[i].owner == this.userData.name) {
                    ownData.push(this.marketData[i]);
                }
            }
            var t = { "ownBag": ownData };
            var mod = new JSONModel(t);
            this.getView().setModel(mod, "ownBagItems");
            let route = this.getOwnerComponent().getRouter().getRoute("Sell");
            route.attachPatternMatched(this.onRoutePatternMatched, this);
        },
        onRoutePatternMatched: function (oEvent) {
            this.userData = this.getOwnerComponent().getModel("user").getData();
            this.marketData = this.getOwnerComponent().getModel("marketItem").getData().product;
            var ownData = [];
            for (var i = 0; i < this.marketData.length; i++) {
                console.log(this.marketData[i].owner, this.userData.name)
                if (this.marketData[i].owner == this.userData.name) {
                    ownData.push(this.marketData[i]);
                }
            }
            var t = { "ownBag": ownData };
            this.getView().setModel(new JSONModel(t), "ownBagItems");

        },
        _navTo: function (sRoute) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo(sRoute);
        },
        navToReuse: function(){
            this._navTo("Reuse")
        },
        navToAboutUs: function () {
            this._navTo("AboutUs");
        },
        onHomePress: function () {
            this._navTo("LaunchPad")
        },
        navToHowToUse: function () {
            this._navTo("HowToUse");
        },
        addNewItem: function (oEvent) {
            var username = this.getView().getModel("user").getData().name
            console.log(username);
            this.getView().setModel(new JSONModel({
                "id": new Date().valueOf(),
                "name": "",
                "quantity": "",
                "comment": "",
                "ProductPicUrl": "",
                "owner": username
            }), "currObject")
            var oButton = oEvent.getSource(), oView = this.getView();
            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "cleanup.view.fragments.NewMarketItem",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pDialog.then(function (oDialog) {
                // this._configDialog(oButton, oDialog);
                oDialog.open();
            }.bind(this));
        },
        handelCloseObject: function (oEvent) {
            this._pDialog.then(function (oDialog) {
                // this._configDialog(oButton, oDialog);
                oDialog.close();
            }.bind(this));
        },
        handelPostObject: function (oEvent) {
            var product = this.getView().getModel("currObject").getData();
            this.marketData.push(product);
            
            //this.getOwnerComponent().getModel("").getData().product
            this.getOwnerComponent().setModel(new JSONModel({
                "product": this.marketData
            }), "marketItem")
            console.log("fdsa");
            this._pDialog.then(function (oDialog) {
                oDialog.close();
            }.bind(this));
            this.onRoutePatternMatched("");
        },
        handelDeleteItem:function(oEvent){
            var ind=oEvent.oSource.oParent.getBindingContext('ownBagItems').getPath().split("/")[2]
            ind=parseInt(ind);
            var id=this.getView().getModel("ownBagItems").getData().ownBag[ind].id;
            var marketItemNew=this.getOwnerComponent().getModel("marketItem").getData().product;
            var mainInd=-1;
            for(var i=0;i<marketItemNew.length;i++){
                if(id==marketItemNew[i].id){
                    mainInd=i;
                    break;
                }
            }
            if(mainInd==-1){
                alert("mainInd==-1 found marketDataitems Problem")
                return;
            }
            marketItemNew.splice(mainInd,1);
            this.getOwnerComponent().setModel(new JSONModel({"product":marketItemNew}),"marketItem");
            this.onRoutePatternMatched("");
        },
        handelEdit:function(oEvent){
            var ind = oEvent.oSource.oParent.getBindingContext('ownBagItems').getPath().split("/")[2]
            ind=parseInt(ind);
            var oView=this.getView();
            var oldBagItem=this.getView().getModel("ownBagItems").getData().ownBag[ind];
            this.getView().setModel(new JSONModel(oldBagItem), "currObject")
            //this.getView()
            if (!this._eDialog) {
                console.log("edia");
                this._eDialog = Fragment.load({
                    
                    id: oView.getId(),
                    name: "cleanup.view.fragments.EditMarketItem",
                    controller: this
                }).then(function (eDialog) {
                    oView.addDependent(eDialog);
                    return eDialog;
                });
            }

            this._eDialog.then(function (eDialog) {
                // this._configDialog(oButton, oDialog);
                eDialog.open();
            }.bind(this));
        },
        handelPostEditedObject:function(oEvent){
            var product = this.getView().getModel("currObject").getData();
            var i=-1;
            for(var j=0;j<this.marketData.length;j++){
                if(this.marketData[j].id==product.id){
                    //found the object
                    i=j;
                    break;
                }
            }
            this.marketData[i]=product;
            this.getOwnerComponent().setModel(new JSONModel({
                "product": this.marketData
            }), "marketItem")
            this._eDialog.then(function (eDialog) {
                eDialog.close();
            }.bind(this));
            this.onRoutePatternMatched("");
        },
        handelCloseEditObject:function(){
            this._eDialog.then(function (eDialog) {
                eDialog.close();
            }.bind(this));
            this.onRoutePatternMatched("");
        }
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf sapui5.training.ui.view.Launchpad
		 */
        //	onBeforeRendering: function() {
        //
        //	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf sapui5.training.ui.view.Launchpad
		 */
       /* onAfterRendering: function () {

        },
*/
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf sapui5.training.ui.view.Launchpad
		 */
        //	onExit: function() {
        //
        //	}

    });

});