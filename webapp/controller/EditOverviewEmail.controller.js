/**
 * 1.1.4 - Editing of Email
 */
sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.otcOptimization.controller.EditOverviewEmail", {
		handleRouteMatched: function(oEvent) {
			var sAppId = "App5efc5c3a04d5c13a7d081e1e";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function(oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype" && prop.includes("Set")) {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			if (!this.sContext) {
				this.sContext = "BASet('1')";
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		/**
		 * 1.1.4.1 - On Editing Press
		*/
		_onButtonPress: function(oEvent) {

			oEvent = jQuery.extend(true, {}, oEvent);
			return new Promise(function(fnResolve) {
					fnResolve(true);
				})
				.then(function(result) {
					return new Promise(function(fnResolve) {
						sap.m.MessageBox.confirm("Do you confirm the changes?", {
							title: "Action Save",
							actions: ["OK", "Cancel"],
							onClose: function(sActionClicked) {
								fnResolve(sActionClicked === "OK");
							}
						});
					});

				}.bind(this))
				.then(function(result) {
					if (result === false) {
						return false;
					} else {
						var oView = this.getView(),
							oController = this,
							status = true,
							requiredFieldInfo = [];
						if (requiredFieldInfo.length) {
							status = this.handleChangeValuestate(requiredFieldInfo, oView);
						}
						if (status) {
							return new Promise(function(fnResolve, fnReject) {
								var oModel = oController.oModel;

								var fnResetChangesAndReject = function(sMessage) {
									oModel.resetChanges();
									fnReject(new Error(sMessage));
								};
								if (oModel && oModel.hasPendingChanges()) {
									oModel.submitChanges({
										success: function(oResponse) {
											var oBatchResponse = oResponse.__batchResponses[0];
											var oChangeResponse = oBatchResponse.__changeResponses && oBatchResponse.__changeResponses[0];
											if (oChangeResponse && oChangeResponse.data) {
												var sNewContext = oModel.getKey(oChangeResponse.data);
												oView.unbindObject();
												oView.bindObject({
													path: "/" + sNewContext
												});
												if (window.history && window.history.replaceState) {
													window.history.replaceState(undefined, undefined, window.location.hash.replace(encodeURIComponent(oController.sContext), encodeURIComponent(sNewContext)));
												}
												oModel.refresh();
												fnResolve();
											} else if (oChangeResponse && oChangeResponse.response) {
												fnResetChangesAndReject(oChangeResponse.message);
											} else if (!oChangeResponse && oBatchResponse.response) {
												fnResetChangesAndReject(oBatchResponse.message);
											} else {
												oModel.refresh();
												fnResolve();
											}
										},
										error: function(oError) {
											fnReject(new Error(oError.message));
										}
									});
								} else {
									fnResolve();
								}
							});
						}
					}
				}.bind(this))
				.then(function(result) {
					if (result === false) {
						return false;
					} else {
						return new Promise(function(fnResolve) {
							var sTargetPos = "center center";
							sTargetPos = (sTargetPos === "default") ? undefined : sTargetPos;
							sap.m.MessageToast.show("Changes Saved", {
								onClose: fnResolve,
								duration: 0 || 3000,
								at: sTargetPos,
								my: sTargetPos
							});
						});

					}
				}.bind(this))
				.then(function(result) {
					if (result === false) {
						return false;
					} else {

						var oBindingContext = oEvent.getSource().getBindingContext();

						return new Promise(function(fnResolve) {

							this.doNavigate("OverviewEmail", oBindingContext, fnResolve, "");
						}.bind(this));

					}
				}.bind(this)).catch(function(err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
		},
		/**
		 * 1.1.4.2 - Changing state
		*/
		handleChangeValuestate: function(requiredFieldInfo, oView) {
			var status = true;
			if (requiredFieldInfo) {
				requiredFieldInfo.forEach(function(requiredinfo) {
					var input = oView.byId(requiredinfo.id);
					if (input) {
						input.setValueState("None"); //initially set ValueState to None
						if (input.getValue() === '') {
							input.setValueState("Error"); //input is blank set ValueState to error
							status = false;
						} else if (input.getDateValue && !input._bValid) { //since 1.64 ui5 will be providing a function 'isValidValue' that can be used here.
							input.setValueState("Error"); //Invalid Date set ValueState to error
							status = false;
						}
					}
				});
			}
			return status;

		},
		/**
		 * 1.1.4.3 - Routing
		*/
		doNavigate: function(sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet, sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function(bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},
		/**
		 * 1.1.4.4 - Change entities
		*/
		_onButtonPress1: function(oEvent) {

			oEvent = jQuery.extend(true, {}, oEvent);
			return new Promise(function(fnResolve) {
					fnResolve(true);
				})
				.then(function(result) {
					return new Promise(function(fnResolve) {
						var aChangedEntitiesPath, oChangedBindingContext;
						var oModel = this.oModel;
						if (oModel && oModel.hasPendingChanges()) {
							aChangedEntitiesPath = Object.keys(oModel.mChangedEntities);

							for (var j = 0; j < aChangedEntitiesPath.length; j++) {
								oChangedBindingContext = oModel.getContext("/" + aChangedEntitiesPath[j]);
								if (oChangedBindingContext && oChangedBindingContext.bCreated) {
									oModel.deleteCreatedEntry(oChangedBindingContext);
								}
							}
							oModel.resetChanges();
						}
						fnResolve();
					}.bind(this));

				}.bind(this))
				.then(function(result) {
					if (result === false) {
						return false;
					} else {
						var oHistory = History.getInstance();
						var sPreviousHash = oHistory.getPreviousHash();
						var oQueryParams = this.getQueryParameters(window.location);

						if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
							window.history.go(-1);
						} else {
							var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
							oRouter.navTo("default", true);
						}

					}
				}.bind(this)).catch(function(err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
		},
		getQueryParameters: function(oLocation) {
			var oQuery = {};
			var aParams = oLocation.search.substring(1).split("&");
			for (var i = 0; i < aParams.length; i++) {
				var aPair = aParams[i].split("=");
				oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
			}
			return oQuery;

		},
		_onButtonPress2: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("OverviewEmail", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("EditOverviewEmail").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function() {
					if (sap.ui.Device.system.phone) {
						var oPage = oView.getContent()[0];
						if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
							oPage.setShowNavButton(true);
							oPage.attachNavButtonPress(function() {
								this.oRouter.navTo("Inbox", {}, true);
							}.bind(this));
						}
					}
				}.bind(this)
			});

			this.oModel = this.getOwnerComponent().getModel();

		},
		onExit: function() {

			// to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
			var aControls = [{
				"controlId": "sap_uxap_ObjectPageLayout_0-sections-sap_uxap_ObjectPageSection-1-subSections-sap_uxap_ObjectPageSubSection-1-blocks-build_simple_form_Form-1527703095717-formContainers-build_simple_form_FormContainer-1-formElements-build_simple_form_FormElement-2-fields-sap_m_ComboBox-1",
				"groups": ["items"]
			}, {
				"controlId": "sap_uxap_ObjectPageLayout_0-sections-sap_uxap_ObjectPageSection-1-subSections-sap_uxap_ObjectPageSubSection-1-blocks-build_simple_form_Form-1527703095717-formContainers-build_simple_form_FormContainer-1-formElements-build_simple_form_FormElement-1527703370562-fields-sap_m_ComboBox-1",
				"groups": ["items"]
			}, {
				"controlId": "sap_uxap_ObjectPageLayout_0-sections-sap_uxap_ObjectPageSection-1-subSections-sap_uxap_ObjectPageSubSection-1-blocks-build_simple_form_Form-1527703095717-formContainers-build_simple_form_FormContainer-1-formElements-build_simple_form_FormElement-1527703378153-fields-sap_m_ComboBox-1",
				"groups": ["items"]
			}, {
				"controlId": "sap_uxap_ObjectPageLayout_0-sections-sap_uxap_ObjectPageSection-1-subSections-sap_uxap_ObjectPageSubSection-1-blocks-build_simple_form_Form-1527703095717-formContainers-build_simple_form_FormContainer-1-formElements-build_simple_form_FormElement-1527703857584-fields-sap_m_ComboBox-1527704188665",
				"groups": ["items"]
			}, {
				"controlId": "sap_uxap_ObjectPageLayout_0-sections-sap_uxap_ObjectPageSection-1-subSections-sap_uxap_ObjectPageSubSection-1-blocks-build_simple_form_Form-1527703095717-formContainers-build_simple_form_FormContainer-1-formElements-build_simple_form_FormElement-1527703858957-fields-sap_m_ComboBox-1527704329730",
				"groups": ["items"]
			}, {
				"controlId": "sap_uxap_ObjectPageLayout_0-sections-sap_uxap_ObjectPageSection-1-subSections-sap_uxap_ObjectPageSubSection-1-blocks-build_simple_form_Form-1527703095717-formContainers-build_simple_form_FormContainer-1-formElements-build_simple_form_FormElement-1527703861871-fields-sap_m_ComboBox-1527704484173",
				"groups": ["items"]
			}, {
				"controlId": "sap_uxap_ObjectPageLayout_0-sections-sap_uxap_ObjectPageSection-2-subSections-sap_uxap_ObjectPageSubSection-1-blocks-build_simple_Table-1488393318289",
				"groups": ["items"]
			}, {
				"controlId": "sap_uxap_ObjectPageLayout_0-sections-sap_uxap_ObjectPageSection-2-subSections-sap_uxap_ObjectPageSubSection-1-blocks-build_simple_Table-1488393318289-items-build_simple_Row-1-cells-build_simple_TableCell-1488393471964-content-sap_m_ComboBox-1488393494606",
				"groups": ["items"]
			}, {
				"controlId": "sap_uxap_ObjectPageLayout_0-sections-sap_uxap_ObjectPageSection-2-subSections-sap_uxap_ObjectPageSubSection-1-blocks-build_simple_Table-1488393318289-items-build_simple_Row-1-cells-build_simple_TableCell-1488393474746-content-sap_m_ComboBox-1488393501016",
				"groups": ["items"]
			}];
			for (var i = 0; i < aControls.length; i++) {
				var oControl = this.getView().byId(aControls[i].controlId);
				if (oControl) {
					for (var j = 0; j < aControls[i].groups.length; j++) {
						var sAggregationName = aControls[i].groups[j];
						var oBindingInfo = oControl.getBindingInfo(sAggregationName);
						if (oBindingInfo) {
							var oTemplate = oBindingInfo.template;
							oTemplate.destroy();
						}
					}
				}
			}

		}
	});
}, /* bExport= */ true);
