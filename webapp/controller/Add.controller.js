sap.ui.define([
	"./BaseController",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (BaseController, History, MT) {
	"use strict";

	return BaseController.extend("myspace.ProductList.controller.Add", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit : function () {
			// Register to the add route matched
			this.getRouter().getRoute("add").attachPatternMatched(this._onRouteMatched, this);
			},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		_onRouteMatched: function() {

			//here goes your logic which will be executed when the "add" route is hit
			//will be done within the next unit
			var oModel = this.getModel();
			oModel.metadataLoaded().then(this._onMetaDataLoaded.bind(this));
		},
		
		_onMetaDataLoaded: function(){
			//create default properties
			var oProperties = {
				ProductID: "" + parseInt(Math.random() * 1000000000,10),	
				ProductTypeCode: "PR",
				TaxTariffCode: 1,
				CurrencyCode: "EUR",
				SupplierID:"0100000000",
				SupplierName: "SAP",
				QuantityUnit:"EA"
			};
			
			//create an entry in Model
			this._oContext = this.getModel().createEntry("/ProductCollection",{ properties:oProperties, success: this._onCreateSuccess.bind(this)});
			
			//bind view to new entry
			this.getView().setBindingContext(this._oContext);
		},
		//on Create Successful
		_onCreateSuccess:function(oProduct){
			//navigate to new Products Object View
			var sId = oProduct.ProductKey;
			this.getRouter().navTo("object",{objectId: sId},true);
			//unbind the view to not show the object view again
			this.getView().unbindObject();
			// show success messge
			var sMessage = this.getResourceBundle().getText("newObjectCreated", [oProduct.ProductName]);
			MT.show(sMessage, {
				closeOnBrowserNavigation : false
			});
		},
		/**
		 * Event handler for the cancel action
		 * @public
		 */
		onCancel: function(){
			this.onNavBack();	
		},
		/**
		 * Event handler for the save action
		 * @public
		 */
		onSave: function(){
			this.getModel().submitChanges();	
		},		
		/**
		 * Event handler for navigating back.
		 * We navigate back in the browser history
		 * @public
		 */
		onNavBack : function() {
			
			this.getModel().deleteCreatedEntry(this._oContext);

			var oHistory = History.getInstance(),
				sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			} else {
				// Otherwise we go backwards with a forward history
				var bReplace = true;
				this.getRouter().navTo("worklist", {}, bReplace);
			}
		}
	});
});