sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, MessageToast, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("cleanup.controller.recycle.Recycle", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sapui5.training.ui.view.Launchpad
		 */
        onInit: function () {

            this.open = 0;
            var data = new JSONModel({
                "WastePile": []
            })
            ////console.log(data)
            this.getView().setModel(data);
            ////console.log(this.getView().getModel());



            //evetime recycle is opened triger attachPatternMatched function

            let route = this.getOwnerComponent().getRouter().getRoute("Recycle");
            route.attachPatternMatched(this.onRoutePatternMatched, this);

        },
        onRoutePatternMatched: function () {
            if(sessionStorage.getItem("recycleClean") !=="1"){
                return;
            }
            this.open = 0;
            var data = new JSONModel({
                "WastePile": []
            })
            ////console.log(data)
            this.getView().setModel(data);
           // console.log(sap.ui.getCore().byId("_IDGenTable1"));


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

        //handling addintion of new waste
        handelAddWaste: function () {
            if (!this.showDialog) {
                this.showDialog = sap.ui.xmlfragment("cleanup.view.fragments.AddWaste", this);
            }
            var data = {
                "name": "",
                "quantity": "",
                "remark": "",
                "id": ""
            }
            data.id = this.open++
            var nayaWasteModel = new JSONModel(data);
            this.showDialog.setModel(nayaWasteModel, "newWaste");

            //type of waste model init

            var oData3 = new JSONModel("model/typeOfWaste.json");
            this.showDialog.setModel(oData3, "typeOfWasteModel");

            //flusing values and setting status
            sap.ui.getCore().byId("quantityInput").value = "";
            sap.ui.getCore().byId("quantityInput").setValueState(sap.ui.core.ValueState.Error);
            sap.ui.getCore().byId("quantityInput").setValueStateText("Quantity is a must")
            sap.ui.getCore().byId("TypeOfWasteCB").setSelectedKey("");
            sap.ui.getCore().byId("TypeOfWasteCB").setValueState(sap.ui.core.ValueState.Error);
            sap.ui.getCore().byId("TypeOfWasteCB").setValueStateText("Select an item from List")

            sap.ui.getCore().byId("remarkInput").value = "";
            sap.ui.getCore().byId("remarkInput").setValueState(sap.ui.core.ValueState.Information);
            sap.ui.getCore().byId("remarkInput").setValueStateText("optional")




            this.showDialog.open();
            //////console.log(data);
        },
        handelCancelAddWaste: function () {
            this.showDialog.close();

        },
        handelConfirmAddWaste: function (oEvent) {
            //validation
            var quantityValidation = sap.ui.getCore().byId("quantityInput").getValue();
            var TypeOfWasteValidation = sap.ui.getCore().byId("TypeOfWasteCB").getValue();
            var quantityError = "";
            var typeOfWasteError = "";
            //console.log(quantityValidation, TypeOfWasteValidation);
            if (this.validateQuantity(quantityValidation)) {
                quantityError = ""
            } else {
                quantityError = "Enter Quantity"
            }
            if (this.validiteTypeOfWaste(TypeOfWasteValidation)) {
                typeOfWasteError = ""
            } else {
                typeOfWasteError = "Select a Type of waste from the list"
            }
            if (!(typeOfWasteError === "" && quantityError === "")) {
                var errorStr = "";
                var errorNo = 1;
                if (typeOfWasteError !== "") {
                    errorStr += errorNo.toString() + ". " + typeOfWasteError + "\n";
                    errorNo++;
                }

                if (quantityError !== "") {
                    errorStr += errorNo.toString() + ". " + quantityError;
                    errorNo++;
                }
                MessageBox.error(errorStr);
                return;
            }

            var oModel = oEvent.getSource().getModel("newWaste");
            var oDialogData = oModel.getData();

            var tableItems = this.getView().getModel().oData;
            //console.log(tableItems)
            var flag = 1;
            var matchIndex = 0;
            for (var i = 0; i < tableItems.WastePile.length; i++) {
                if (tableItems.WastePile[i].id == oDialogData.id) {
                    flag = 0;
                    matchIndex = i;
                    break;
                }
            }
            if (flag) {
                tableItems.WastePile.push(oDialogData);
            } else {
                tableItems.WastePile[matchIndex] = oDialogData
            }
            this.getView().setModel(new JSONModel(tableItems));
            this.showDialog.close();
        },
        handelEditDepartment: function (oEvent) {
            var oCurrentData = oEvent.getSource().getBindingContext().getObject();
            var omod = new JSONModel(oCurrentData);
            this.showDialog.setModel(omod, "newWaste");
            this.showDialog.open();
        },
        handelDeleteDepartment: function (oEvent) {
            var ocurrdata = oEvent.getSource().getBindingContext().getObject();
            var oViewData = this.getView().getModel().getData();
            for (var i = 0; i < oViewData.WastePile.length; i++) {
                var temp = oViewData.WastePile[i];
                if (temp.id === ocurrdata.id) {
                    oViewData.WastePile.splice(i, 1);
                    break;
                }
            }
            this.getView().getModel().setData(oViewData);
        },
        validateQuantity: function (str) {
            if (str == "")
                return 0;
            return 1;
        },
        validiteTypeOfWaste: function (str) {

            var model2 = this.showDialog.getModel("typeOfWasteModel");
            var data2 = model2.getData();
            // var str = oEvent.getParameters("value").value;
            //  //console.log(data2.types,str)
            let flag = 0;
            for (var i = 0; i < data2.types.length; i++) {
                if (data2.types[i].name == str) {
                    flag = 1;
                }
            }
            ////console.log(flag)
            return flag;
        },










        handelQuantityChange: function (oEvent) {
            var control = oEvent.getParameter("newValue");
            if (!this.validateQuantity(control)) {
                oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
                oEvent.getSource().setValueStateText("Quantity is a must")
            } else {
                oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
            }
        },
        handelRemarkChange: function (oEvent) {
            var control = oEvent.getParameter("newValue");
            if (control == "") {
                oEvent.getSource().setValueState(sap.ui.core.ValueState.Information);
                oEvent.getSource().setValueStateText("Optional")
            } else {
                oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
                oEvent.getSource().setValueStateText("Thanks for remarks");
            }
        },
        updatedTypeOfWaste: function (oEvent) {
            var str = oEvent.getParameters("value").value;

            if (this.validiteTypeOfWaste(str)) {
                oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
                oEvent.getSource().setValueStateText("Thanks");
                var model = this.showDialog.getModel("newWaste");
                var data = model.getData();
                data.name = str;
                var dataModel = new JSONModel(data);
                this.showDialog.setModel(dataModel, "newWaste")

            } else {
                oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
                oEvent.getSource().setValueStateText("Specify type of waste");
            }
        },
        onSubmitPress: function () {
            var data = this.getView().getModel().getData();
            if (data.WastePile.length == 0) {
                MessageToast.show("Your bin is empty!");
            } else { 
                this.getOwnerComponent().setModel(this.getView().getModel(), "dustbinItems");
                this._navTo("Solution")
            }
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
            },


		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf sapui5.training.ui.view.Launchpad
		 */
        onBeforeRendering: function () {


        },

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
        onExit: function () {

        }

    });

});