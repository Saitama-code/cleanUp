sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "sap/ui/core/syncStyleClass",
	'sap/ui/export/library',
	'sap/ui/export/Spreadsheet',
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, MessageToast, JSONModel, Fragment,syncStyleClass,exportLibrary,Spreadsheet) {
        "use strict";

        return Controller.extend("cleanup.controller.solution.Solution", {
            onInit: function () {
                let route = this.getOwnerComponent().getRouter().getRoute("Solution");
                route.attachPatternMatched(this.onRoutePatternMatched, this);

            },
            onRoutePatternMatched: function () {
                this.s = "0";


                var oData1 = new JSONModel("model/masterData.json", false);
                oData1.attachRequestCompleted(
                    function () {
                        //console.log(this.getView())
                        this.getView().setModel(oData1, "masterData");
                        //   console.log(this.getView().getModel("masterData").getData());
                    }, this);
                //new JSONModel("model/masterData.json",false)
                //console.log("odata1   ", oData1);


                // console.log(this.getView().getModel("masterData").getData());




                //   this.dustBinModel = (this.getOwnerComponent().getModel("dustbinItems"));
                // console.log(this.dustBinModel);

                //to retain data in previous screen
                sessionStorage.setItem("recycleClean", "0");



                var y = this.getOwnerComponent().getAggregation("rootControl").getModel("dustbinItems");
                this.getView().setModel(y, "dustbinItems")
                //console.log(this.getView().getModel("dustbinItems"));
                // this.byId("solutionApp").setBackgroundImage("img/dancing.gif")

                //jQuery.sap.delayedCall(5000, this, this.changeBackground);
                //jQuery.sap.intervalCall(500, console.log("sdf"), this)


                //  oData1.attachRequestCompleted(function () {this.mainSolution()})
                oData1.attachRequestCompleted(
                    function () {
                        //console.log(this.getView())
                        this.mainSolution();
                    }, this);

            },
            inArray: function (a, b) {
                for (var i = 0; i < a.length; i++) {
                    //console.log(a[i], b);
                    if (a[i] === b) {
                        //console.log(true);
                        return true;
                    }
                }
                return false;
            }
            ,
            mainSolution: function () {
                var solution = []
                var solutionDS = {
                    "name": "",
                    "quantity": "",
                    "remark": "",
                    "options": {
                        "kabariwala": [],
                        "plants": [],
                        "govContact": []
                    },
                    "optionsList": [
                    ],
                    "solutionProvider": {
                        "broadArea": "",
                        "rating": "",
                        "name": "",
                        "phone": "",
                        "designation": "",
                        "accept": ""
                    }
                }

                var master = this.getView().getModel("masterData").getData();
                // console.log(master, master.getData());

                //let Assume this is user input  :::::::: will use location of user loged in 
                var state = this.getView().getModel("user").getData().state;
                var district = this.getView().getModel("user").getData().district;
                console.log(state,district);
                //to be fetched via something

                var need = {

                }
                //console.log(master)
                var flag = 0, stateIndex = 0;
                for (var i = 0; i < master.states.length; i++) {
                    
                    if (master.states[i].state == state) {
                        stateIndex = i;
                        flag = 1;
                        break;
                    }
                }
                if (flag == 0) {
                    this._navTo("NotYetReached");
                    return;
                }
                flag = 0;
                var districtIndex = 0;
                for (var i = 0; i < master.states[stateIndex].district.length; i++) {
                    console.log(master.states[stateIndex].district[i]);
                    if (master.states[stateIndex].district[i].name == district) {
                        districtIndex = i;
                        flag = 1;
                        break;
                    }
                }
                if (flag == 0) {
                    this._navTo("NotYetReached");
                }

                need = master.states[stateIndex].district[districtIndex];
                // console.log(need);
                // console.log(this.getView().getModel("dustbinItems"));
                var dustbinItems = this.getView().getModel("dustbinItems").oData.WastePile;

                for (var i = 0; i < dustbinItems.length; i++) {
                    let currWaste = dustbinItems[i];
                    //shallow copy
                    let n = {
                        "name": "",
                        "quantity": "",
                        "remark": "",
                        "options": {
                            "kabariwala": [],
                            "plants": [],
                            "govContact": []
                        },
                        "optionsList": [
                        ],
                        "solutionProvider": {
                            "broadArea": "",
                            "rating": "",
                            "name": "",
                            "phone": "",
                            "designation": "",
                            "accept": "",
                            "email":""
                        }
                    }
                    //Object.assign({}, solutionDS);
                    // console.log(n);
                    n.name = currWaste.name;
                    n.quantity = currWaste.quantity;
                    n.remark = currWaste.remark;
                    // console.log(solutionDS.name);
                    // console.log(n.name);
                    // SOLVE FOR CURRENT WASTE START



                    let kabariwala = [];
                    //  console.log(need.kabariwalas[0])
                    for (var j = 0; j < need.kabariwalas.length; j++) {
                        if (this.inArray(need.kabariwalas[j].accept, currWaste.name.toLowerCase())) {
                            kabariwala.push(need.kabariwalas[j]);
                        }
                    }
                    let plant = [];
                    //console.log(need.plants.length);
                    for (var j = 0; j < need.plants.length; j++) {
                        //     console.log(need.plants[j].accept,currWaste.name.toLowerCase)
                        if (this.inArray(need.plants[j].accept, currWaste.name.toLowerCase())) {
                            plant.push(need.plants[j]);
                        }
                    }

                    let optionsList = []
                    let govContact = need.govContact;
                    if (kabariwala.length) {
                        optionsList.push({ "name": "kabariwalas", "key": "kabariwala" });
                    }
                    if (plant.length) {
                        optionsList.push({ "name": "plants", "key": "plants" })
                    }
                    if (govContact.length) {
                        optionsList.push({ "name": "governing Bodies", "key": "govContact" })
                    }
                    n.optionsList = JSON.parse(JSON.stringify(optionsList));//Object.assign({},optionsList);
                    n.options.kabariwala = JSON.parse(JSON.stringify(kabariwala));//Object.assign({},  kabariwala);
                    n.options.plants = JSON.parse(JSON.stringify(plant));//Object.assign({},plant);
                    n.options.govContact = JSON.parse(JSON.stringify(govContact));//Object.assign({}, govContact)
                    //console.log(n);
                    // SOLVE FOR CURRENT WASTE END
                    solution.push(n);
                    //n.optionsList=[];
                    //  n=Object.assign({}, solutionDS);
                }
                //console.log(solution)
                var oModelMain = new JSONModel({ "solution": solution });
                this.getView().setModel(oModelMain, "SolutionModel")
            },
            optionListChange: function (oEvent) {
                var ind = oEvent.getSource().getBindingContext('SolutionModel').getPath().split("/")[2]
                this.row=ind;
                var what = oEvent.mParameters.selectedItem.mProperties.key
                var specificModel
                if (what == "plants") {
                    this.broadArea="plants"
                    var ans = {
                        
                        "ind":ind,
                        "ans": JSON.parse(JSON.stringify(this.getView().getModel("SolutionModel").getData().solution[ind].options.plants))
                    }
                    specificModel = new JSONModel(ans);
                } else if (what === "governing Bodies") {
                    
                    this.broadArea="governing Bodies"
                    var ans = {
                        "ind":ind,
                        "ans": JSON.parse(JSON.stringify(this.getView().getModel("SolutionModel").getData().solution[ind].options.govContact))
                    }
                    specificModel = new JSONModel(ans);
                } else if (what === "kabariwalas") {
                    
                    this.broadArea="kabariwalas"
                    var ans = {
                        "ind":ind,
                        "ans": JSON.parse(JSON.stringify(this.getView().getModel("SolutionModel").getData().solution[ind].options.kabariwala))
                    }
                    specificModel = new JSONModel(ans);
                } else {

                }

                this.getView().setModel(specificModel,"SolutionModel2");
              /*  if (!this.selectKabariwala) {
                    this.selectKabariwala = new sap.ui.xmlfragment("cleanup.view.fragments.selectKabariwala", this);
                }
                this.selectKabariwala.open();


                */
               //console.log(this.getView().getModel("SolutionModel2").getData())
                var oButton = oEvent.getSource(), oView = this.getView();

                if (!this._pDialog) {
                    this._pDialog = Fragment.load({
                        id: oView.getId(),
                        name: "cleanup.view.fragments.selectKabariwala",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }

                this._pDialog.then(function (oDialog) {
                    this._configDialog(oButton, oDialog);
                    oDialog.open();
                }.bind(this));
            },
            _configDialog: function (oButton, oDialog) {
			// Set draggable property
			var bDraggable = oButton.data("draggable");
			oDialog.setDraggable(bDraggable == "true");

			// Set resizable property
			var bResizable = oButton.data("resizable");
			oDialog.setResizable(bResizable == "true");

			// Multi-select if required
			var bMultiSelect = !!oButton.data("multi");
			oDialog.setMultiSelect(bMultiSelect);

			// Remember selections if required
			var bRemember = !!oButton.data("remember");
			oDialog.setRememberSelections(bRemember);

			var sResponsivePadding = oButton.data("responsivePadding");
			var sResponsiveStyleClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--subHeader sapUiResponsivePadding--content sapUiResponsivePadding--footer";

			if (sResponsivePadding) {
				oDialog.addStyleClass(sResponsiveStyleClasses);
			} else {
				oDialog.removeStyleClass(sResponsiveStyleClasses);
			}

			// Set custom text for the confirmation button
			var sCustomConfirmButtonText = oButton.data("confirmButtonText");
			oDialog.setConfirmButtonText(sCustomConfirmButtonText);

			// toggle compact style
			syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
        },
        	handleClose: function (oEvent) {
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([]);

            var aContexts = oEvent.getParameter("selectedContexts");
            var x=this.getView().getModel("SolutionModel").getData().solution[this.row].solutionProvider;
            var tt=aContexts.map(function (oContext) { return oContext.getObject(); })[0]
            x.broadArea=this.broadArea;
            x.name=tt.name;
            x.rating=tt.rating;
            x.accept=tt.accept;
            x.phone=tt.phone;
            x.email=tt.email;
            if(this.broadArea=="governing Bodies"){
                x.designation=tt.Designation
                 x.accept=["ALL types of Waste[Even Hazardous]"]
            }
            console.log(x);
            this.getView().getModel("SolutionModel").getData().solution[this.row].solutionProvider=x;
            this.byId("SolutionTable").getModel("SolutionModel").refresh(true);
            
            console.log(this.byId("SolutionTable").getModel("SolutionModel"),aContexts.map(function (oContext) { return oContext.getObject(); })[0])
			if (aContexts && aContexts.length) {
				MessageToast.show("You have chosen " + aContexts.map(function (oContext) { return oContext.getObject().name; }).join(", "));
			}

        },
        handelCallTrigger:function(oEvent){
            var ind = oEvent.getSource().getBindingContext('SolutionModel').getPath().split("/")[2]
            ind=parseInt(ind);
            var ph=this.getView().getModel("SolutionModel").getData().solution[ind].solutionProvider.phone;
            if(!ph){
                MessageToast.show("Can't Email\n Either Soution provider is Empty or he dosen't have a phone")
                return;
            }
            sap.m.URLHelper.triggerTel(ph);
        },
        handelMailTrigger:function(oEvent){
             var ind = oEvent.getSource().getBindingContext('SolutionModel').getPath().split("/")[2]
            ind=parseInt(ind);
            var xx=this.getView().getModel("SolutionModel").getData().solution[ind]
            var ph=this.getView().getModel("SolutionModel").getData().solution[ind].solutionProvider.email;
            if(!ph){
                MessageToast.show("Can't Email\n Either Soution provider is Empty or he dosen't have mail")
                return;
            }
            //console.log(ph);
            var msg="Kindly help us recycle this waste:\nType of Waste   "+ xx.name+"\n"+ "Quantity of Waste   "+ xx.quantity+"\nRemaks from Waste generator  "+ xx.remark +"\n From CleanUp Team\nWarm Regards";

            sap.m.URLHelper.triggerEmail(ph,"CleanUp For "+ xx.quantity+"KG's "+ xx.name ,msg , false, false, true);

        },



        createColumnConfig: function() {
            	var EdmType = exportLibrary.EdmType;
			return [
				{
					label: 'Waste Type',
					property: 'Waste Type',
					type: EdmType.String,
					scale: 0
				},
				{
					label: 'Quantity',
					property: 'Quantity',
					width: '25'
				},
				{
					label: 'Remarks',
					property: 'Remarks',
					width: '25'
				},
				{
					label: 'Solution Provider Name',
					property: 'Solution Provider Name',
                    type: EdmType.String,
                    width: '25'
				},
				{
					label: 'Broad Area',
					property: 'Broad Area',
                    type: EdmType.String,
                    width: '20'
				},
				{
					label: 'contact 1',
					property: 'contact 1',
                    type: EdmType.String,
                    width: '15'
				},
				{
					label: 'contact 2',
					property: 'contact 2',
                    type: EdmType.String,
                    width: '25'
				}];
		},

		onExport: function() {
			var aCols, aProducts, oSettings, oSheet;

			aCols = this.createColumnConfig();
            aProducts = []
            var data=this.getView().getModel("SolutionModel").getData().solution;
            for(var i=0;i<data.length;i++){
                var n={
                    "Waste Type":data[i].name,
                    "Quantity":data[i].quantity,
                    "Remarks":data[i].remark,
                    "Solution Provider Name":data[i].solutionProvider.name,
                    "Broad Area":data[i].solutionProvider.broadArea,
                    "contact 1":data[i].solutionProvider.phone,
                    "contact 2":data[i].solutionProvider.email
                }
                aProducts.push(n);
            }

			oSettings = {
				workbook: { columns: aCols },
                dataSource: aProducts,
                fileName: "Solution"+(new Date).toString()
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then( function() {
					MessageToast.show('Spreadsheet export has finished');
				})
				.finally(oSheet.destroy);
		},
            //for fragment
            handleSolutionCancel: function (oEvent) {
                oEvent;
            },
            changeBackground: function (y) {
                // this.byId("solutionApp").setBackgroundImage(null)
                //this.byId("solutionApp").setBackgroundColor("#ff8177")
            },
            _navTo: function (sRoute) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo(sRoute);
            },
            navToAboutUs: function () {
                this._navTo("AboutUs");
            },
            addMoreWaste:function(){
                this._navTo("Recycle");
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
            onHomePress: function () {
                this._navTo("LaunchPad")
            },
            onBeforeRendering() {
                // console.log(new Date)
            },
            onAfterRendering() {
                this.getView().setModel(this.getOwnerComponent().getModel("user"),"user");
                //     console.log(new Date)
            }



        });
    });
