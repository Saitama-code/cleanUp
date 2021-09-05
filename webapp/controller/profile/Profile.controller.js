sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment'
], function (Controller, MessageToast, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("cleanup.controller.profile.Profile", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sapui5.training.ui.view.Launchpad
		 */
        onInit: function () {
           

            let route = this.getOwnerComponent().getRouter().getRoute("Profile");
            route.attachPatternMatched(this.onRoutePatternMatched, this);

        },
        onRoutePatternMatched: function () {
             var locationData = new JSONModel("model/location.json", false);
            locationData.attachRequestCompleted(
                function () {
                    this.getView().setModel(locationData, "location");
                }, this);
            this.getView().setModel(this.getOwnerComponent().getModel("user"), "user");
         /*   var profileDefaultData = this.getView().getModel("user").getData();
            profileDefaultData.district;
            profileDefaultData.district;
            this.getView().setModel({
                "district": profileDefaultData.district,
                "state": profileDefaultData.district
            }, "locationL")*/
            console.log(this.getView().getModel("user").getData())
            this.getView().setModel(this.getView().getModel("user"), "NSuser");
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
                    //var mod=new JSONModel(comboboxDist);
                    this.getView().setModel(new JSONModel({"dist":comboboxDist}), "locationL");
                    console.log(comboboxDist,new JSONModel({"dist":comboboxDist}),this.getView().getModel("locationL"))
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
        _navTo: function (sRoute) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo(sRoute);
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
        onPressProfile: function (oEvent) {

            var oButton = oEvent.getSource(),
                oView = this.getView();
            // create popover
            if (!this._pPopover) {
                this._pPopover = Fragment.load({
                    id: oView.getId(),
                    name: "cleanup.view.fragments.Popover",
                    controller: this
                }).then(function (oPopover) {
                    oView.addDependent(oPopover);
                    // oPopover.bindElement("/ProductCollection/0");
                    return oPopover;
                });
            }
            this._pPopover.then(function (oPopover) {
                oPopover.openBy(oButton);
            });

        },
        handleLogOut: function () {
            // this._navTo("Recycle");
            console.log("Fds");
            this.getOwnerComponent().setModel(new JSONModel({ "user": "GuestL" }), "user");
            this._navTo("home");
        },
        goToProfile: function () {
            MessageToast.show("You in in Your Profile!")
        },

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
        onAfterRendering: function () {
            this.getView().setModel(this.getOwnerComponent().getModel("user"), "user");
            this.getView().setModel(this.getView().getModel("user"), "NSuser");
            var tt = this.byId("EditableProfileBox");
            tt.setProperty("visible", false);
            var profilebox = this.byId("NonEditableProfileBox");
            profilebox.setProperty("visible", true);
        },
        handelSaveChanges: function () {
            var NSuser = this.getView().getModel("NSuser").getData();
            var user = this.getView().getModel("user").getData();
            user.firstName = NSuser.firstName;
            user.lastName = NSuser.lastName;
            user.state = NSuser.state;
            user.district = NSuser.district;
            console.log("user")
            this.getOwnerComponent().setModel(new JSONModel(user), "user")
            this.getView().setModel(new JSONModel(user), "user");
            var tt = this.byId("EditableProfileBox");
            tt.setProperty("visible", false);
            var profilebox = this.byId("NonEditableProfileBox");
            profilebox.setProperty("visible", true);

            MessageToast.show("Updated");

            var pbutton = this.byId("EditProfileBtn");
             pbutton.setProperty("visible", true);
        },
        handelCancelChanges: function () {
           this.getView().setModel(this.getOwnerComponent().getModel("user"), "user");
            this.getView().setModel(this.getView().getModel("user"), "NSuser");
            var tt = this.byId("EditableProfileBox");
            tt.setProperty("visible", false);
            var profilebox = this.byId("NonEditableProfileBox");
            profilebox.setProperty("visible", true);

            MessageToast.show("Cancelled");
             var pbutton = this.byId("EditProfileBtn");
             pbutton.setProperty("visible", true);
        },
        handelEditChanges: function () {
            this.flag=!this.flag;
            var pbutton = this.byId("EditProfileBtn");
            var tt = this.byId("EditableProfileBox");
            var profilebox = this.byId("NonEditableProfileBox");
            if(this.flag){
                tt.setProperty("visible", true);
                profilebox.setProperty("visible", false);
                pbutton.setProperty("visible", false);
            }else{
                tt.setProperty("visible", false);
                profilebox.setProperty("visible", true);
                pbutton.setProperty("visible", true);
            }
        }

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf sapui5.training.ui.view.Launchpad
		 */
        //	onExit: function() {
        //
        //	}

    });

});