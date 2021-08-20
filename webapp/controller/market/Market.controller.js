sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
], function (Controller, MessageToast, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("cleanup.controller.market.Market", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sapui5.training.ui.view.Launchpad
		 */
        onInit: function () {
            this.user_model = this.getOwnerComponent().getModel("user");
           // this.getView().getModel(this.user_model,"user");
            this.marketItem_model = this.getOwnerComponent().getModel("marketItem");
           //this.getView().getModel(this.marketItem_model,"marketItem");
           //console.log(this.getView().getModel("marketItem"));
        },
        _navTo: function (sRoute) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo(sRoute);
        },
        navToAboutUs: function () {
            this._navTo("AboutUs");
        },
        navToMarket: function () {
            this._navTo("Market");
        },
        onHomePress: function () {
            this._navTo("LaunchPad")
        },
        navToHowToUse: function () {
            this._navTo("HowToUse");
        },

        onModeChange: function (oEvent) {
            var sMode = oEvent.getParameter("item").getKey();
            this.byId("gridList").setMode(sMode);
            this.byId("gridList").setHeaderText("GridList with mode " + sMode);
        },

        onSelectionChange: function (oEvent) {
            var bSelected = oEvent.getParameter("selected");
            var ind=oEvent.getParameter("listItem").getBindingContext("marketItem").getPath().split("/")[2]
            console.log(ind);
            var marketItems= this.getView().getModel("marketItem").getData();
            var newModel=new JSONModel(marketItems.product[ind]);
            var currObject=this.getView().setModel(newModel,"currObject");
            //console.log(this.getView().getModel("marketItem"), marketItems.product[ind],new JSONModel(marketItems.product[ind]));
            var oButton = oEvent.getSource(),
                    oView = this.getView();

                if (!this.productOverview) {
                    this.productOverview = Fragment.load({
                        id: oView.getId(),
                        name: "cleanup.view.fragments.ProductOverView",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }

                this.productOverview.then(function (oDialog) {
                   // this._configDialog(oButton, oDialog);
                    oDialog.open();
                }.bind(this));



            console.log(marketItems.product[ind].owner)
            MessageToast.show((bSelected ? "Selected" : "Unselected") + " item with ID " + oEvent.getParameter("listItem").getId());
        },
        handelCall:function(oEvent){
            var owner=this.getView().getModel("currObject").getData().owner;
            var logData=this.getView().getModel("loginData").getData().user;
            var ph=""
             console.log(owner,logData )
            for(var i=0;i<logData.length;i++){
                console.log(logData[i].name)
                if(logData[i].name === owner){
                    ph=logData[i].phone;
                    break;
                }
            }
             console.log(ph)
            if(ph==""){
                MessageToast.show("Can't Call\n Either Soution provider is Empty or he dosen't have a phone")
                return;
            }
            sap.m.URLHelper.triggerTel(ph);
        },
        handelMail:function(oEvent){
            var oowner=this.getView().getModel("currObject");
            var owner=oowner.getData().owner;
            var logData=this.getView().getModel("loginData").getData().user;
            var em=""
             console.log(owner,logData )
            for(var i=0;i<logData.length;i++){
                console.log(logData[i].name)
                if(logData[i].name === owner){
                    em=logData[i].email;
                    break;
                }
            }
            var msg="Hi, I would to like to Buy a product that you have listed in CleaUp\n Can we connect?"
             console.log(em)
            if(em==""){
                MessageToast.show("Can't Email\n He dosen't have an Email")
                return;
            }
            sap.m.URLHelper.triggerEmail(em,"CleanUp For "+ oowner.quantity+"KG's "+ oowner.name ,msg , false, false, true);

        },




        handelCloseObject: function(oEvent){
            this.productOverview.then(function (oDialog) {
                   // this._configDialog(oButton, oDialog);
                    oDialog.close();
                }.bind(this));
        },

        onDelete: function (oEvent) {
            MessageToast.show("Delete item with ID " + oEvent.getParameter("listItem").getId());
        },

        onDetailPress: function (oEvent) {
            MessageToast.show("Request details for item with ID ds " + oEvent.getSource().getId());
        },

        onPress: function (oEvent) {
            
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
        //	onAfterRendering: function() {
        //
        //	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf sapui5.training.ui.view.Launchpad
		 */
        //	onExit: function() {
        //
        //	}

    });

});