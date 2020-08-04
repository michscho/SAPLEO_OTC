/**
 * 1.1.9.2 - baseUrl
 * TOKEN DATA
 * Url with Params
 */
var baseUrl = "https://otc.authentication.eu10.hana.ondemand.com/oauth/token?grant_type=client_credentials";

/**
 * 1.1.9.3 - config 
 * SAP Client ID to verify our requests.
 */
var clientID = "sb-409d575f-6af5-42d2-9e77-6f92b0e702d3!b50035|na-9e50499f-78dd-40ca-ad8d-60acf02cff8b!b30417";
var clientSecret = "YGw1AB6Rsvzpyf/Vtnfu3VFBJFQ=";
var responseType = "token";
var contentType = "application";

/**
 * 1.1.9.4 - Client data
 * Configure Url and body to send
 * More information: https://aiservices-trial-dox.cfapps.eu10.hana.ondemand.com/document-information-extraction/v1
 */
var clientUrl = "https://aiservices-trial-dox.cfapps.eu10.hana.ondemand.com/document-information-extraction/v1/clients";
var body = {
	"value": [{
		"clientId": "c_00",
		"clientName": "client 01"
	}]
};

/**
 * 1.1.9.5 - Client data
 * JOBS DATA
 * More information: https://aiservices-trial-dox.cfapps.eu10.hana.ondemand.com/document-information-extraction/v1
 */
var jobsUrl = "https://aiservices-trial-dox.cfapps.eu10.hana.ondemand.com/document-information-extraction/v1/document/jobs";

/**
 * 1.1.9.6 - getToken
 * SAP needs Token which are valid for 24 hours to make requests.
 * After 24 hours we needs to refresh them.
 */
async function getToken() {
	return axios({
		url: baseUrl,
		method: 'get',
		auth: {
			username: clientID,
			password: clientSecret
		},
		params: {
			response_type: responseType,
			content_type: contentType
		},
		header: {
			'Content-type': 'application/form-url-encode'
		}
	});
}

/**
 * 1.1.9.7 - createClient
 * Normally you need to create Clients and get them
 * In trial we only can create one Client
 */
async function createClient() {
	let response = await getToken();
	return axios({
		url: clientUrl,
		method: 'post',
		headers: {
			Authorization: "Bearer " + response.data.access_token,
			"Access-Control-Allow-Origin": "*"
		},
		data: body
	});
}

/**
 * 1.1.9.10 - getToken
 * Get a list of 10 clients
 */
async function getAllClients() {
	let response = await getToken()
		//console.log(response.data.access_token);
	return axios({
		url: clientUrl + "?limit=10",
		method: 'get',
		headers: {
			Authorization: "Bearer " + response.data.access_token
		}
	});
}

/**
 * 1.1.9.11 - MainPage
 * MainPage with Filters, tables, diagram
 */
sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"./utilities",
		"sap/ui/core/routing/History",
	], function (BaseController, MessageBox, Utilities, History) {
		"use strict";
		getAllClients();
		return BaseController.extend("com.sap.build.standard.otcOptimization.controller.MainPage", {
			handleRouteMatched: function (oEvent) {
				var sAppId = "App5ef88d3ac4b6e55edf3b6ee0";
				var oParams = {
					"expand": "Sender,Receiver,Details,Payment,OrderItem"
				};
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
				if (!this.sContext) {
					this.sContext = "OrderDocumentSet('0000000001')";
				}
				this.sContext = this.sContext + "/";
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
	    	* 1.1.9.12 - MainPage
		    * Filter oModel on Page Header
	    	*/
			_onFioriAnalyticalListPageHeaderActionsSelectionChange: function (oEvent) {
				var oModel = this.getView().getModel("alpModel");
				var item = oEvent.getParameters();
				if (item && item.getKey) {
					var key = item.getKey();
					oModel.setProperty("/filterHeaderOption", key);
				}
			},
			/**
	    	* 1.1.9.13 - MainPage
		    * Filter oModel on Property key
	    	*/
			_onFioriAnalyticalListPageHeaderActionsPress: function (oEvent) {
				var oModel = this.getView().getModel("alpModel");
				var key = oEvent.getSource().getProperty("key");
				oModel.setProperty("/filterHeaderOption", key);
			},
			/**
	    	* 1.1.9.14 - MainPage
		    * Filter oModel on Property key
	    	*/
			_onFioriAnalyticalListPageHeaderActionsPress1: function (oEvent) {
				var oModel = this.getView().getModel("alpModel");
				var key = oEvent.getSource().getProperty("key");
				oModel.setProperty("/filterHeaderOption", key);
			},
			/**
	    	* 1.1.9.15 - MainPage
		    * Navigate to MainPage
	    	*/
			_onButtonPress: function (oEvent) {
				var oBindingContext = oEvent.getSource().getBindingContext();
				return new Promise(function (fnResolve) {
					this.doNavigate("MainPage", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			},
			/**
	    	* 1.1.9.16 - MainPage
		    * Implementation of oRouter
	    	*/
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
	    	* 1.1.9.17 - MainPage
		    * Filter oModel on Property key
	    	*/
			_onFioriAnalyticalListPageContentActionsSelectionChange: function (oEvent) {
				var oModel = this.getView().getModel("alpModel");
				var item = oEvent.getParameters();
				if (item && item.getKey) {
					var key = item.getKey();
					oModel.setProperty("/contentView", key);
				}
			},
			/**
	    	* 1.1.9.18 - MainPage
		    * Filter oModel on Property key
	    	*/
			_onFioriAnalyticalListPageContentActionsPress: function (oEvent) {
				var oModel = this.getView().getModel("alpModel");
				var oSource = oEvent.getSource();
				var key = oEvent.getSource().getProperty("key");
				oModel.setProperty("/contentView", key);
			},
			/**
	    	* 1.1.9.19 - MainPage
		    * Filter oModel on Property key
	    	*/
			_onFioriAnalyticalListPageContentActionsPress1: function (oEvent) {
				var oModel = this.getView().getModel("alpModel");
				var oSource = oEvent.getSource();
				var key = oEvent.getSource().getProperty("key");
				oModel.setProperty("/contentView", key);
			},
			/**
	    	* 1.1.9.20 - MainPage
		    * Filter oModel on Property key
	    	*/
			_onFioriAnalyticalListPageContentActionsPress2: function (oEvent) {
				var oModel = this.getView().getModel("alpModel");
				var oSource = oEvent.getSource();
				var key = oEvent.getSource().getProperty("key");
				oModel.setProperty("/contentView", key);
			},
			/**
	    	* 1.1.9.21 - MainPage
		    * Filter on Chart Press
	    	*/
			_onFioriAnalyticalListPageChartContainerPress: function (oEvent) {
				var oSource = oEvent.getSource();
				var oModel = this.getView().getModel("alpModel");
				var oChartContainer = oSource.getParent().getParent();
				var oChart = oChartContainer.getAggregation("items")[1];
				if (oChart) {
					var oVizFrame = oChart.getAggregation("_vizFrame");
					if (oVizFrame) {
						var bFlag = oModel.getProperty("/showLegendAnalyticalChart");
						oVizFrame.setLegendVisible(!bFlag);
						oModel.setProperty("/showLegendAnalyticalChart", !bFlag);
					}
				}
			},
			/**
	    	* 1.1.9.22 - MainPage
		    * Filter on Chart Press
	    	*/
			_onFioriAnalyticalListPageChartContainerPress1: function (oEvent) {
				var oSource = oEvent.getSource();
				var oChartContainer = oSource.getParent().getParent();
				var oChart = oChartContainer.getAggregation("items")[1];
				if (oChart) {
					var oVizFrame = oChart.getAggregation("_vizFrame");
					if (oVizFrame) {
						oVizFrame.zoom({
							direction: "in"
						});
					}
				}
			},
			/**
	    	* 1.1.9.23 - MainPage
		    * Filter on Chart Press
	    	*/
			_onFioriAnalyticalListPageChartContainerPress2: function (oEvent) {
				var oSource = oEvent.getSource();
				var oChartContainer = oSource.getParent().getParent();
				var oChart = oChartContainer.getAggregation("items")[1];
				if (oChart) {
					var oVizFrame = oChart.getAggregation("_vizFrame");
					if (oVizFrame) {
						oVizFrame.zoom({
							direction: "out"
						});
					}
				}
			},
			/**
	    	* 1.1.9.24 - MainPage
		    * To Fullscreen
	    	*/
			formatFullscreenIconAnalyticalControl: function (bExitFullscreen) {
				if (bExitFullscreen) {
					return "sap-icon://exit-full-screen";
				}
				return "sap-icon://full-screen";
			},
			/**
	    	* 1.1.9.25 - MainPage
		    * Filter on Chart Press
		    * FullScreenOption, Dialog, VBox Aggregation
	    	*/
			_onFioriAnalyticalListPageChartContainerPress3: function (oEvent) {
				var oModel = this.getView().getModel("alpModel");
				var oSource = oEvent.getSource();
				if (!oModel.getProperty("/exitFullscreenChart")) {
					var oVBox = oSource.getParent().getParent().getParent();
					var oAnalyticalPage = oVBox.getParent().getParent().getParent();
					var oDialog = oAnalyticalPage.getDependents()[0];
					var oChartContainer = oSource.getParent().getParent();
					var index = oVBox.indexOfAggregation("items", oChartContainer);
					oModel.setProperty("/positionInParentAggregation", index);
					oVBox.removeAggregation("items", oChartContainer);
					oDialog.addContent(oChartContainer);
					oModel.setProperty("/exitFullscreenChart", true);
					oDialog.open();
				} else {
					var oAnalyticalPage = oSource.getParent().getParent().getParent().getParent();
					var oDialog = oAnalyticalPage.getDependents()[0];
					var oChartContainer = oDialog.getContent()[0];
					oDialog.removeContent(oChartContainer);
					var oVBox = oAnalyticalPage.getAggregation("content");
					var oVBox1 = oVBox.getAggregation("items")[1];
					var itemsVBox1 = oVBox1.getAggregation("items");
					for (var i = 0; i < itemsVBox1.length; i++) {
						var oVBox2 = itemsVBox1[i];
						if (jQuery(oVBox2.getFocusDomRef()).hasClass("sapSmartTemplatesAnalyticalListPageChartContainer")) {
							var index = oModel.getProperty("/positionInParentAggregation");
							oVBox2.insertAggregation("items", oChartContainer, index);
						}
					}
					oModel.setProperty("/exitFullscreenChart", false);
					oDialog.close();
				}
			},
			/**
	    	* 1.1.9.26 - MainPage
		    * Filter on Chart Press
		    * FullScreenOption, Dialog, VBox Aggregation
	    	*/
			_onFioriAnalyticalListPageTablePress: function (oEvent) {
				var oModel = this.getView().getModel("alpModel");
				var oSource = oEvent.getSource();
				if (!oModel.getProperty("/exitFullscreenTable")) {
					var oVBox = oSource.getParent().getParent().getParent();
					var oAnalyticalPage = oVBox.getParent().getParent().getParent();
					var oDialog = oAnalyticalPage.getDependents()[0];
					var oTable = oSource.getParent().getParent();
					var index = oVBox.indexOfAggregation("items", oTable);
					oModel.setProperty("/positionInParentAggregation", index);
					oVBox.removeAggregation("items", oTable);
					oDialog.addContent(oTable);
					oModel.setProperty("/exitFullscreenTable", true);
					oDialog.open();
				} else {
					var oAnalyticalPage = oSource.getParent().getParent().getParent().getParent();
					var oDialog = oAnalyticalPage.getDependents()[0];
					var oTable = oDialog.getContent()[0];
					oDialog.removeContent(oTable);
					var oVBox = oAnalyticalPage.getAggregation("content");
					var oVBox1 = oVBox.getAggregation("items")[1];
					var itemsVBox1 = oVBox1.getAggregation("items");
					for (var i = 0; i < itemsVBox1.length; i++) {
						var oVBox2 = itemsVBox1[i];
						if (jQuery(oVBox2.getFocusDomRef()).hasClass("sapSmartTemplatesAnalyticalListPageTableContainer")) {
							var index = oModel.getProperty("/positionInParentAggregation");
							oVBox2.insertAggregation("items", oTable, index);
						}
					}
					oModel.setProperty("/exitFullscreenTable", false);
					oDialog.close();
				}
			},
			/**
	    	* 1.1.9.27 - MainPage
		    * Navigation
	    	*/
			_onButtonPress1: function (oEvent) {
				var oBindingContext = oEvent.getSource().getBindingContext();
				return new Promise(function (fnResolve) {
					this.doNavigate("MainPage", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			},
				/**
	    	* 1.1.9.28 - MainPage
		    * Navigation to UploadQuoation
	    	*/
			_onOverflowToolbarButtonPress: function (oEvent) {
				var oBindingContext = oEvent.getSource().getBindingContext();
				return new Promise(function (fnResolve) {
					this.doNavigate("UploadQuotation", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			},
			/**
	    	* 1.1.9.29 - MainPage
		    * Navigation to OrderView
	    	*/
			_onRowPress: function (oEvent) {
				var oBindingContext = oEvent.getSource().getBindingContext();
				return new Promise(function (fnResolve) {
					this.doNavigate("OrderView", oBindingContext, fnResolve, "");
				}.bind(this)).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});
			},
			/**
	    	* 1.1.9.30 - MainPage
		    * Filtering of Site
		    * Doesn't work, needs further investigation, future work
	    	*/
			applyFiltersAndSorters: function (sControlId, sAggregationName, chartBindingInfo) {
				if (chartBindingInfo) {
					var oBindingInfo = chartBindingInfo;
				} else {
					var oBindingInfo = this.getView().byId(sControlId).getBindingInfo(sAggregationName);
				}
				var oBindingOptions = this.updateBindingOptions(sControlId);
				this.getView().byId(sControlId).bindAggregation(sAggregationName, {
					model: oBindingInfo.model,
					path: oBindingInfo.path,
					parameters: oBindingInfo.parameters,
					template: oBindingInfo.template,
					templateShareable: true,
					sorter: oBindingOptions.sorters,
					filters: oBindingOptions.filters
				});
			},
			/**
	    	* 1.1.9.30 - MainPage
		    * Binding between Model
	    	*/
			updateBindingOptions: function (sCollectionId, oBindingData, sSourceId) {
				this.mBindingOptions = this.mBindingOptions || {};
				this.mBindingOptions[sCollectionId] = this.mBindingOptions[sCollectionId] || {};
				var aSorters = this.mBindingOptions[sCollectionId].sorters;
				var aGroupby = this.mBindingOptions[sCollectionId].groupby;
				// If there is no oBindingData parameter, we just need the processed filters and sorters from this function
				if (oBindingData) {
					if (oBindingData.sorters) {
						aSorters = oBindingData.sorters;
					}
					if (oBindingData.groupby || oBindingData.groupby === null) {
						aGroupby = oBindingData.groupby;
					}
					// 1) Update the filters map for the given collection and source
					this.mBindingOptions[sCollectionId].sorters = aSorters;
					this.mBindingOptions[sCollectionId].groupby = aGroupby;
					this.mBindingOptions[sCollectionId].filters = this.mBindingOptions[sCollectionId].filters || {};
					this.mBindingOptions[sCollectionId].filters[sSourceId] = oBindingData.filters || [];
				}
				// 2) Reapply all the filters and sorters
				var aFilters = [];
				for (var key in this.mBindingOptions[sCollectionId].filters) {
					aFilters = aFilters.concat(this.mBindingOptions[sCollectionId].filters[key]);
				}
				// Add the groupby first in the sorters array
				if (aGroupby) {
					aSorters = aSorters ? aGroupby.concat(aSorters) : aGroupby;
				}
				var aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, true)] : undefined;
				return {
					filters: aFinalFilters,
					sorters: aSorters
				};
			},
			/**
	    	* 1.1.9.31 - MainPage
		    * Init
		    * GetToken, oRouter, oModel
		    * SetProperty and setModel
		    * Init Model
	    	*/
			onInit: function () {
				getToken();
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.oRouter.getTarget("MainPage").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
				var oView = this.getView();
				var oModel = new sap.ui.model.json.JSONModel();
				oView.setModel(oModel, "alpModel");
				oModel.setProperty("/filterHeaderOption", "visual");
				oModel.setProperty("/exitFullscreenTable", false);
				oModel.setProperty("/contentView", "charttable");
				oModel.setProperty("/exitFullscreenChart", false);
				oModel.setProperty("/showLegendAnalyticalChart", true);
				var oView = this.getView(),
					oData = {},
					self = this;
				var oModel = new sap.ui.model.json.JSONModel();
				oView.setModel(oModel, "staticDataModel");
				self.oBindingParameters = {};
				oData[
					"Fiori_AnalyticalListPage_AnalyticalListPage_0-content-Fiori_AnalyticalListPage_Content-1-chartcontent-Fiori_AnalyticalListPage_ChartContainer-1-charts-sap_chart_BarChart-1593436481346"
				] = {};
				oData[
					"Fiori_AnalyticalListPage_AnalyticalListPage_0-content-Fiori_AnalyticalListPage_Content-1-chartcontent-Fiori_AnalyticalListPage_ChartContainer-1-charts-sap_chart_BarChart-1593436481346"
				]["data"] = [{
					"dim0": "Jan",
					"mea0": "296",
					"# Manually": "196",
					"# Automated": "100",
					"__id": 0
				}, {
					"dim0": "Feb",
					"mea0": "133",
					"# Manually": "83",
					"# Automated": "50",
					"__id": 1
				}, {
					"dim0": "Mar",
					"mea0": "300",
					"# Manually": "150",
					"# Automated": "150",
					"__id": 2
				}, {
					"dim0": "Apr",
					"mea0": "270",
					"# Manually": "90",
					"# Automated": "180",
					"__id": 3
				}, {
					"dim0": "May",
					"mea0": "350",
					"# Manually": "130",
					"# Automated": "220",
					"__id": 4
				}];
				self.oBindingParameters[
					"Fiori_AnalyticalListPage_AnalyticalListPage_0-content-Fiori_AnalyticalListPage_Content-1-chartcontent-Fiori_AnalyticalListPage_ChartContainer-1-charts-sap_chart_BarChart-1593436481346"
				] = {
					"path": "/Fiori_AnalyticalListPage_AnalyticalListPage_0-content-Fiori_AnalyticalListPage_Content-1-chartcontent-Fiori_AnalyticalListPage_ChartContainer-1-charts-sap_chart_BarChart-1593436481346/data",
					"model": "staticDataModel",
					"parameters": {}
				};
				oData[
					"Fiori_AnalyticalListPage_AnalyticalListPage_0-content-Fiori_AnalyticalListPage_Content-1-chartcontent-Fiori_AnalyticalListPage_ChartContainer-1-charts-sap_chart_BarChart-1593436481346"
				]["vizProperties"] = {
					"plotArea": {
						"dataLabel": {
							"visible": true,
							"hideWhenOverlap": true
						}
					}
				};
				oView.getModel("staticDataModel").setData(oData, true);

				function dateDimensionFormatter(oDimensionValue, sTextValue) {
					var oValueToFormat = sTextValue !== undefined ? sTextValue : oDimensionValue;
					if (oValueToFormat instanceof Date) {
						var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
							style: "short"
						});
						return oFormat.format(oValueToFormat);
					}
					return oValueToFormat;
				}
				var aDimensions = oView.byId(
					"Fiori_AnalyticalListPage_AnalyticalListPage_0-content-Fiori_AnalyticalListPage_Content-1-chartcontent-Fiori_AnalyticalListPage_ChartContainer-1-charts-sap_chart_BarChart-1593436481346"
				).getDimensions();
				aDimensions.forEach(function (oDimension) {
					oDimension.setTextFormatter(dateDimensionFormatter);
				});
			},
			/**
	    	* 1.1.9.31 - MainPage
		    * to destroy templates for bound aggregations when templateShareable is true on exit to prevent duplicateId issue
	    	*/
			onExit: function () {
				var aControls = [{
					"controlId": "AnalyticalKpisContent",
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
			},
			/**
	    	* 1.1.9.31 - MainPage
	    	* Binding View
	    	*/
			onAfterRendering: function () {
				var oChart, self = this,
					oBindingParameters = this.oBindingParameters,
					oView = this.getView();
				oChart = oView.byId(
					"Fiori_AnalyticalListPage_AnalyticalListPage_0-content-Fiori_AnalyticalListPage_Content-1-chartcontent-Fiori_AnalyticalListPage_ChartContainer-1-charts-sap_chart_BarChart-1593436481346"
				);
				oChart.bindData(oBindingParameters[
					"Fiori_AnalyticalListPage_AnalyticalListPage_0-content-Fiori_AnalyticalListPage_Content-1-chartcontent-Fiori_AnalyticalListPage_ChartContainer-1-charts-sap_chart_BarChart-1593436481346"
				]);
			},
			/**
			 *@memberOf com.sap.build.standard.otcOptimization.controller.MainPage
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