sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], function (Controller, MessageToast, JSONModel, Fragment) {
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
                "name": "",
                "firstName": "",
                "lastName": "",
                "phone": "",
                "state": "",
                "district": "",
                "email": "",
                "type": "WG",
                "gDesig": "",
                "accept": []
            }), "NSuser");
            var oData3 = new JSONModel("model/typeOfWaste.json");
            oData3.attachRequestCompleted(
                function () {
                    this.getView().setModel(oData3);
                    console.log(oData3.getData())
                }, this);
            let route = this.getOwnerComponent().getRouter().getRoute("home");
            route.attachPatternMatched(this.onRoutePatternMatched, this);
            
                this.getView().setModel(new JSONModel({}), "locationL");
        },
        onRoutePatternMatched: function () {
            var stateDD=this.byId("CBstate");
            var districtDD=this.byId("CBDistrict");
            stateDD.clearSelection();
            districtDD.clearSelection();
            this.getView().setModel(new JSONModel({
                "name": "",
                "firstName": "",
                "lastName": "",
                "phone": "",
                "state": "",
                "district": "",
                "email": "",
                "type": "WG",
                "gDesig": "",
                "accept": []
            }), "NSuser");
            var oData3 = new JSONModel("model/typeOfWaste.json");
            oData3.attachRequestCompleted(
                function () {
                    this.getView().setModel(oData3);
                    console.log(oData3.getData())
                }, this);
                this.getView().setModel(new JSONModel({}), "locationL");
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
            if (x.firstName == "") {
                MessageToast.show("FirstName required");
                return;
            }
            if (x.district == "") {
                MessageToast.show("Please Choose Location for best use");
                return;
            }



            //now the form is good

            if (x.type == "WG") {



                /*
                "name": "utkarsh",
                "password": "io",
                "state": "Jharkhand",
                "district": "Gumla",
                "firstName": "Utkarsh",
                "lastName": ".",
                "phone": "+911000000001",
                "email": "utkarsh@sap.com"
                NORMAL USER
                */
                loginData.user.push(x);
                this.getOwnerComponent().setModel(new JSONModel(loginData), "loginData");
                //var nm = this.getOwnerComponent().getModel("loginData").getData();
                //console.log(nm);
            }
            else if (x.type == "govContact") {
                var data = x;
                data.name = x.name;
                data.rating = "";
                data.Designation=x.gDesig;
                //creating normal user
                loginData.user.push(data);
                this.getOwnerComponent().setModel(new JSONModel(loginData), "loginData");

                //including in masterData
                this.dbUpdate(x,data,2)
            } else if (x.type == "plants") {
                var data = x;
                data.name = x.name;
                data.rating = 5;
                this.dbUpdate(x,data,3)
            } else {
                var data = x;
                data.name = x.name;
                data.rating = 5;
                this.dbUpdate(x,data,4)
            }


            this._navTo("home");
        },
        typeChanged: function (oEvent) {
            var type = oEvent.oSource.getSelectedButton().getText()
            var dbType =
                console.log(type);
            if (type == "Waste Generator") {
                dbType = "WG";
                this.byId("boxForExtra").setVisible(false)
            }
            else if (type == "Governing Body") {
                dbType = "govContact";
                this.byId("boxForExtra").setVisible(true)
                this.byId("governingBodiesDesigantion").setVisible(true)
                this.byId("addWasteBtn").setVisible(false)
            } else if (type == "Plant") {
                dbType = "plants";
                this.byId("boxForExtra").setVisible(true)
                this.byId("governingBodiesDesigantion").setVisible(false)
                this.byId("addWasteBtn").setVisible(true)
            } else if (type == "Kabariwala") {
                dbType = "kabariwalas";
                this.byId("boxForExtra").setVisible(true)
                this.byId("governingBodiesDesigantion").setVisible(false)
                this.byId("addWasteBtn").setVisible(true)
            }
            this.getView().getModel("NSuser").oData.type = dbType;
        },
        onAddWaste: function (oEvent) {

            var oButton = oEvent.getSource(),
                oView = this.getView();

            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "cleanup.view.fragments.addAccept",
                    controller: this
                }).then(function (oDialog) {
                    oDialog.setModel(oView.getModel());
                    return oDialog;
                });
            }

            this._pDialog.then(function (oDialog) {
                oDialog.setMultiSelect(true);

                oDialog.open();
            }.bind(this));

        },
        onDialogClose: function (oEvent) {
            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts && aContexts.length) {
                var it = aContexts.map(function (oContext) { return oContext.getObject().name.toLowerCase(); });

                this.getView().getModel("NSuser").oData.accept = it;
                console.log(this.getView().getModel("NSuser").oData)
            } else {
                MessageToast.show("No new item was selected.");
            }
            oEvent.getSource().getBinding("items").filter([]);
        },
        dbUpdate:function(x,data,type){
            
                var stateC=x.state;
                var districtC=x.district;
                var stateInd=-1;
                var stateArray= this.getOwnerComponent().getModel("masterData").oData.states
                for(var i=0;i<stateArray.length;i++){
                    if(stateArray[i].state==stateC){
                        stateInd=i;
                        break;
                    }
                }
                if(stateInd==-1){
                    //new state has to be formed in db
                    stateArray.push({
                        "state":stateC,
                        "district":[]
                    })
                    stateInd=stateArray.length-1;
                }

                var ourState = stateArray[stateInd];
                var districtInd=-1;
                for(var i=0;i<ourState.district.length;i++){
                    if(ourState.district[i].name==districtC){
                        districtInd=i;
                        break;
                    }
                }
                if(districtInd==-1){
                    //new district has to be formed
                    ourState.district.push({
                        "name":districtC,
                        "kabariwalas":[],
                        "plants":[],
                        "govContact":[]
                    });
                    districtInd=ourState.district.length-1;
                }   
            if(type==1){
                //WG
                  stateArray[stateInd].district[districtInd].WG.push(data);
            }else if(type==2){
                //govContact
                stateArray[stateInd].district[districtInd].govContact.push(data);
            }else if(type==3){
                //plants
                 stateArray[stateInd].district[districtInd].plants.push(data);
            }else if(type==4){
                //kabariwalas
                 stateArray[stateInd].district[districtInd].kabariwalas.push(data);
            }
            this.getOwnerComponent().getModel("masterData").states=stateArray;
            console.log(this.getOwnerComponent().getModel("masterData").getData())
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