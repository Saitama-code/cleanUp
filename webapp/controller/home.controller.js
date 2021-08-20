sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, MessageToast, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("cleanup.controller.home", {
            onInit: function () {
                //default guest login
                var token = {
                    "name": "Guest",
                    "password": "io"
                }
                var oData1 = new JSONModel("model/users.json", false);
                oData1.attachRequestCompleted(
                    function () {
                        this.getOwnerComponent().setModel(oData1, "loginData");
                    }, this);
                var oModel = new JSONModel(token);
                this.getOwnerComponent().setModel(oModel, "user");

                let route = this.getOwnerComponent().getRouter().getRoute("home");
                route.attachPatternMatched(this.onRoutePatternMatched, this);
                var ds = {
                    "name": "",
                    "password": ""
                }
                this.getView().setModel(new JSONModel(ds));

            },
            onRoutePatternMatched: function () {
                sessionStorage.setItem("recycleClean", "1");
            },
            _navTo: function (sRoute) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo(sRoute);
            },
            handelSignUp: function () {
                this._navTo("SignUp")
            },
            onHomePress: function () {
                MessageToast.show("Please Sign in");
            },
            onExit: function () {
                this.byId("app").setBackgroundImage(null)
            },
            onLoginTap: function () {
                var token = this.getView().getModel().getData();
                var flag = 0

                var oDialog = this.byId("BusyDialog");
                oDialog.open();
                var oData1=this.getView().getModel("loginData");
                for (var i = 0; i < oData1.oData.user.length; i++) {
                    if (token.name.toLowerCase() == oData1.oData.user[i].name.toLowerCase() && token.password == oData1.oData.user[i].password) {
                        flag = 1;
                        token = oData1.oData.user[i]
                        break;
                    }
                }
                oDialog.close();
                if (flag) {
                    //set the user to that whole component ::: i.e logged in
                    var oModel = new JSONModel(token);
                    this.getOwnerComponent().setModel(oModel, "user");
                    this._navTo("LaunchPad")
                } else {
                    MessageBox.error("Incorrect Credentials");
                }
            }
        });
    });
