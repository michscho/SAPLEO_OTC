/**
 * 1.1.12 - Separation of inquires in manual, automatic, semi-automatic
 */
sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"./utilities",
		"sap/ui/core/routing/History"
	], function (BaseController, MessageBox, Utilities, History) {
		"use strict";
		return BaseController.extend("com.sap.build.standard.otcOptimization.controller.Page1", {
			handleRouteMatched: function (oEvent) {
				var sAppId = "App5eea148c419cc27d5cb86b26";
				var oParams = {};
				if (oEvent.mParameters.data.context) {
					this.sContext = oEvent.mParameters.data.context;
				} else {
					if (this.getOwnerComponent().getComponentData()) {
						var patternConvert = function (oParam) {
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
				var oPath;
				if (this.sContext) {
					oPath = {
						path: "/" + this.sContext,
						parameters: oParams
					};
					this.getView().bindObject(oPath);
				}
			},
			_onRowPress: function (oEvent) {
				var oBindingContext = oEvent.getSource().getBindingContext();
				return new Promise(function (fnResolve) {
					this.doNavigate("Page2", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			},
			doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
				var sPath = oBindingContext ? oBindingContext.getPath() : null;
				var oModel = oBindingContext ? oBindingContext.getModel() : null;
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
					sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet,
						sRouteName);
				}
				if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
					if (sNavigationPropertyName === "") {
						this.oRouter.navTo(sRouteName, {
							context: sPath,
							masterContext: sMasterContext
						}, false);
					} else {
						oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
							if (bindingContext) {
								sPath = bindingContext.getPath();
								if (sPath.substring(0, 1) === "/") {
									sPath = sPath.substring(1);
								}
							} else {
								sPath = "undefined";
							}
							// If the navigation is a 1-n, sPath would be "undefined" 
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
			onInit: function () {
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.oRouter.getTarget("Page1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			},
			/**
			 *@memberOf com.sap.build.standard.otcOptimization.controller.Page1
			 */
			action: function (oEvent) {
				var that = this;
				var actionParameters = JSON.parse(oEvent.getSource().data("wiring").replace(/'/g, "\""));
				var eventType = oEvent.getId();
				var aTargets = actionParameters[eventType].targets || [];
				aTargets.forEach(function (oTarget) {
					var oControl = that.byId(oTarget.id);
					if (oControl) {
						var oParams = {};
						for (var prop in oTarget.parameters) {
							oParams[prop] = oEvent.getParameter(oTarget.parameters[prop]);
						}
						oControl[oTarget.action](oParams);
					}
				});
				var oNavigation = actionParameters[eventType].navigation;
				if (oNavigation) {
					var oParams = {};
					(oNavigation.keys || []).forEach(function (prop) {
						oParams[prop.name] = encodeURIComponent(JSON.stringify({
							value: oEvent.getSource().getBindingContext(oNavigation.model).getProperty(prop.name),
							type: prop.type
						}));
					});
					if (Object.getOwnPropertyNames(oParams).length !== 0) {
						this.getOwnerComponent().getRouter().navTo(oNavigation.routeName, oParams);
					} else {
						this.getOwnerComponent().getRouter().navTo(oNavigation.routeName);
					}
				}
			}
		});
	}, /* bExport= */
	true);