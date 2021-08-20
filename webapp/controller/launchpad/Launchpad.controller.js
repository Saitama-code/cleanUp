sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment'
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, MessageToast, JSONModel,Fragment ) {
        "use strict";

        return Controller.extend("cleanup.controller.launchpad.Launchpad", {
            onInit: function () {
                this.user = this.getOwnerComponent().getModel("user");
                console.log(this.user)

                let route = this.getOwnerComponent().getRouter().getRoute("LaunchPad");
                route.attachPatternMatched(this.onRoutePatternMatched, this);

            },
            onRoutePatternMatched: function () {
                sessionStorage.setItem("recycleClean", "1");
            },
            _navTo: function (sRoute) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo(sRoute);
            },
            navToAboutUs: function () {
                this._navTo("AboutUs");
            },
            navToHowToUse: function () {
                this._navTo("HowToUse");
            },
            LaunchRecycle: function () {
                this._navTo("Recycle");
            },
            LaunchReuse: function () {
                this._navTo("Reuse");
            },
            onCleanUpPress: function () {
                MessageToast.show("You are in Home! feel comfortable");
            },
            onExit: function () {
                this.byId("app").setBackgroundImage(null)
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
                this.getOwnerComponent().setModel(new JSONModel({ "name": "GuestL" }), "user");
                this._navTo("home");
            },
            goToProfile:function(){
                 this._navTo("Profile");
            }






            /*    navChangeLanguage: function (oEvent) {
                    // var control = oEvent.getSource();
                    //var state = control.getState();
                    sap.ui.getCore().getConfiguration().setLanguage("hi_IN");
                    var i18nModel = new sap.ui.model.resource.ResourceModel({
    
                        bundleUrl: "i18n/i18n.properties",
    
                        bundleLocale: "hi_IN"
    
                    });
                    //  var i18nModel = new sap.ui.model.resource.ResourceModel({ bundleUrl: "i18n/i18n.properties", bundleLocale: "hi" });
                    sap.ui.getCore().setModel(i18nModel, "i18n");
                }*/
        });
    });
