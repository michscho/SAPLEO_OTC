/**
 * 1.1.3 - Dialog1.js
 */
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(ManagedObject, MessageBox, Utilities, History) {

	return ManagedObject.extend("com.sap.build.standard.otcOptimization.controller.Dialog1", {
		constructor: function(oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.standard.otcOptimization.view.Dialog1", this);
			this._bInit = false;
		},

		/**
		* 1.1.3.1 - Closing the view.
		*/
		exit: function() {
			delete this._oView;
		},

		/**
		* 1.1.3.2 - Getter View
		*/
		getView: function() {
			return this._oView;
		},

		/**
		* 1.1.3.2 - Getter Control
		*/
		getControl: function() {
			return this._oControl;
		},

		getOwnerComponent: function() {
			return this._oView.getController().getOwnerComponent();
		},

		/**
		* 1.1.3.3 - Controller
		*/
		open: function() {
			var oView = this._oView;
			var oControl = this._oControl;

			if (!this._bInit) {

				// Initialize our fragment
				this.onInit();

				this._bInit = true;

				// connect fragment to the root view of this component (models, lifecycle)
				oView.addDependent(oControl);
			}

			var args = Array.prototype.slice.call(arguments);
			if (oControl.open) {
				oControl.open.apply(oControl, args);
			} else if (oControl.openBy) {
				oControl.openBy.apply(oControl, args);
			}
		},

		/**
		* 1.1.3.3 - Close controller
		*/
		close: function() {
			this._oControl.close();
		},

		/**
		* 1.1.3.4 - Setting route
		*/
		setRouter: function(oRouter) {
			this.oRouter = oRouter;
		},
		getBindingParameters: function() {
			return {};

		},
		
		/**
		* 1.1.3.5 - Dialog
		*/
		onInit: function() {

			this._oDialog = this.getControl();

		},
		onExit: function() {
			this._oDialog.destroy();

		}

	});
}, /* bExport= */ true);
