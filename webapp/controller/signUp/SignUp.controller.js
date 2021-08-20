sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("cleanup.controller.signUp.SignUp", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sapui5.training.ui.view.Launchpad
		 */
        onInit: function () {
            var model = this.getOwnerComponent().getModel("user");
            console.log(model.getData());
            var locationData = new JSONModel("model/location.json", false);
            locationData.attachRequestCompleted(
                function () {
                    this.getView().setModel(locationData, "location");
                }, this);
            this.getView().setModel(new JSONModel({
                "name":"",
                "firstName":"",
                "lastName":"",
                "phone":"",
                "state":"",
                "district":"",
                "email":""
            }),"NSuser");
            let route = this.getOwnerComponent().getRouter().getRoute("home");
            route.attachPatternMatched(this.onRoutePatternMatched, this);
        },
        onRoutePatternMatched:function(){
             this.getView().setModel(new JSONModel({
                "name":"",
                "firstName":"",
                "lastName":"",
                "phone":"",
                "state":"",
                "district":"",
                "email":""
            }),"NSuser");
        },
        _navTo: function (sRoute) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo(sRoute);
        },
        navToAboutUs: function () {
            this._navTo("AboutUs");
        },
        onHomePress: function () {
            this._navTo("home")
        },

        StateChanged: function (oEvent) {
            var newState = oEvent.getParameters().value;
            var y = this.getView().getModel("location").getData();
            y = y.states;
            for (var i = 0; i < y.length; i++) {
                if (y[i].state == newState) {
                    var dist = y[i].districts;
                    var comboboxDist = []
                    for (var j = 0; j < dist.length; j++) {
                        var mod = {
                            "name": dist[j]
                        }
                        comboboxDist.push(mod);
                    }
                    this.getView().setModel(new JSONModel(comboboxDist), "locationL");
                }
            }

        },
        DistrictChanged: function (oEvent) {
            var newDistrict = oEvent.getParameters().value;
            var state = this.byId("CBstate").getSelectedItem().getText()
            var xx = this.getView().getModel("NSuser").getData();
            xx.district = newDistrict;
            xx.state = state;
            this.getView().getModel("NSuser").setData(xx);
        },

        navToHowToUse: function () {
            this._navTo("HowToUse");
        },
        signUpPressed: function () {
            var x = this.getView().getModel("NSuser").getData();
            if (x.password != x.repassword || x.password == "") {
                MessageToast.show("Passwords not valid")
                return;
            }
            var loginData = this.getOwnerComponent().getModel("loginData").getData();
            for (var i = 0; i < loginData.user.length; i++) {
                if (loginData.user[i].name == x.name) {
                    MessageToast.show("userName already exist")
                    return;
                }
            }
            let attributes = Object.keys(x)
            for(var i=0;i<attributes.length;i++){
                if(attributes[i]==""){
                     MessageToast.show("Please Fill in all details")
                    return;
                }
            }
            
            loginData.user.push(x);
           this.getOwnerComponent().setModel(new JSONModel(loginData),"loginData");
           var nm=this.getOwnerComponent().getModel("loginData").getData();
           console.log(nm);
           this._navTo("home");
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