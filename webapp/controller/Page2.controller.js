sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.otcOptimization.controller.Page2", {
		handleRouteMatched: function(oEvent) {
			var sAppId = "App5ef88d3ac4b6e55edf3b6ee0";

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

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		applyFiltersAndSorters: function(sControlId, sAggregationName, chartBindingInfo) {
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
		updateBindingOptions: function(sCollectionId, oBindingData, sSourceId) {
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
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Page2").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			var oView = this.getView(),
				oData = {},
				self = this;
			var oModel = new sap.ui.model.json.JSONModel();
			oView.setModel(oModel, "staticDataModel");
			self.oBindingParameters = {};

			oData["sap_Responsive_Page_0-content-sap_chart_LineChart-1593455241479"] = {};

			oData["sap_Responsive_Page_0-content-sap_chart_LineChart-1593455241479"]["data"] = [{
				"dim0": "Februar",
				"mea0": "25",
				"Week": "55",
				"Month": "80",
				"__id": 0
			}, {
				"dim0": "March",
				"mea0": "23",
				"Week": "65",
				"Month": "75",
				"__id": 1
			}, {
				"dim0": "April",
				"mea0": "26",
				"Week": "70",
				"Month": "85",
				"__id": 2
			}, {
				"dim0": "May",
				"mea0": "21",
				"Week": "40",
				"Month": "63",
				"__id": 3
			}, {
				"dim0": "June",
				"mea0": "24",
				"Week": "50",
				"Month": "68",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_chart_LineChart-1593455241479'] = {
				"path": "/sap_Responsive_Page_0-content-sap_chart_LineChart-1593455241479/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_chart_LineChart-1593455241479"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593456081420-content-sap_chart_LineChart-1593456113171"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593456081420-content-sap_chart_LineChart-1593456113171"]["data"] = [{
				"dim0": "Februar",
				"mea0": "296",
				"Day": "3",
				"Week": "4",
				"Month": "12",
				"__id": 0
			}, {
				"dim0": "March",
				"mea0": "133",
				"Day": "2",
				"Week": "2",
				"Month": "10",
				"__id": 1
			}, {
				"dim0": "April",
				"mea0": "489",
				"Day": "6",
				"Week": "8",
				"Month": "14",
				"__id": 2
			}, {
				"dim0": "May",
				"mea0": "270",
				"Day": "4",
				"Week": "7",
				"Month": "13",
				"__id": 3
			}, {
				"dim0": "June",
				"mea0": "350",
				"Day": "2",
				"Week": "6",
				"Month": "15",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593456081420-content-sap_chart_LineChart-1593456113171'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593456081420-content-sap_chart_LineChart-1593456113171/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593456081420-content-sap_chart_LineChart-1593456113171"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_chart_LineChart-1593455247360"] = {};

			oData["sap_Responsive_Page_0-content-sap_chart_LineChart-1593455247360"]["data"] = [{
				"dim0": "India",
				"mea0": "296",
				"value1": "Februar",
				"Day": "25",
				"Week": "23",
				"Month": "24",
				"__id": 0
			}, {
				"dim0": "Canada",
				"mea0": "133",
				"value1": "March",
				"Day": "19",
				"Week": "18",
				"Month": "21",
				"__id": 1
			}, {
				"dim0": "USA",
				"mea0": "489",
				"value1": "April",
				"Day": "15",
				"Week": "16",
				"Month": "18",
				"__id": 2
			}, {
				"dim0": "Japan",
				"mea0": "270",
				"value1": "May",
				"Day": "41",
				"Week": "42",
				"Month": "41",
				"__id": 3
			}, {
				"dim0": "Germany",
				"mea0": "350",
				"value1": "June",
				"Day": "39",
				"Week": "38",
				"Month": "39",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_chart_LineChart-1593455247360'] = {
				"path": "/sap_Responsive_Page_0-content-sap_chart_LineChart-1593455247360/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_chart_LineChart-1593455247360"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455536060-content-sap_m_Panel-1593455645880-content-sap_chart_LineChart-1593455713925"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455536060-content-sap_m_Panel-1593455645880-content-sap_chart_LineChart-1593455713925"]["data"] = [{
				"dim0": "Februar",
				"mea0": "296",
				"Day": "30",
				"Week": "31",
				"Month": "30",
				"__id": 0
			}, {
				"dim0": "March",
				"mea0": "133",
				"Day": "28",
				"Week": "29",
				"Month": "27",
				"__id": 1
			}, {
				"dim0": "April",
				"mea0": "489",
				"Day": "33",
				"Week": "35",
				"Month": "36",
				"__id": 2
			}, {
				"dim0": "May",
				"mea0": "270",
				"Day": "14",
				"Week": "17",
				"Month": "15",
				"__id": 3
			}, {
				"dim0": "June",
				"mea0": "350",
				"Day": "16",
				"Week": "13",
				"Month": "14",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455536060-content-sap_m_Panel-1593455645880-content-sap_chart_LineChart-1593455713925'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455536060-content-sap_m_Panel-1593455645880-content-sap_chart_LineChart-1593455713925/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455536060-content-sap_m_Panel-1593455645880-content-sap_chart_LineChart-1593455713925"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455789992-content-sap_chart_ColumnChart-1593455823511"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455789992-content-sap_chart_ColumnChart-1593455823511"]["data"] = [{
				"dim0": "India",
				"mea0": "296",
				"Day": "17.06.2020",
				"cost Saving": "67",
				"__id": 0
			}, {
				"dim0": "Canada",
				"mea0": "133",
				"Day": "18.06.2020",
				"cost Saving": "73",
				"__id": 1
			}, {
				"dim0": "USA",
				"mea0": "489",
				"Day": "19.06.2020",
				"cost Saving": "68",
				"__id": 2
			}, {
				"dim0": "Japan",
				"mea0": "270",
				"Day": "20.06.2020",
				"cost Saving": "87",
				"__id": 3
			}, {
				"dim0": "Germany",
				"mea0": "350",
				"Day": "21.06.2020",
				"cost Saving": "79",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455789992-content-sap_chart_ColumnChart-1593455823511'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455789992-content-sap_chart_ColumnChart-1593455823511/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455789992-content-sap_chart_ColumnChart-1593455823511"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455848122-content-sap_chart_ScatterChart-1593455982344"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455848122-content-sap_chart_ScatterChart-1593455982344"]["data"] = [{
				"mea1": 428214.13,
				"mea0": 94383.52,
				"dim0": "1 Percent",
				"Employee": "Tim",
				"Average Orders": "25",
				"Individual Orders": "40",
				"__id": 0
			}, {
				"mea1": 1722148.36,
				"mea0": 274735.17,
				"dim0": "1 Percent",
				"Employee": "Bob",
				"Average Orders": "25",
				"Individual Orders": "21",
				"__id": 1
			}, {
				"mea1": 1331176.706884,
				"mea0": 233160.58,
				"dim0": "1 Percent",
				"Employee": "Ben",
				"Average Orders": "25",
				"Individual Orders": "26",
				"__id": 2
			}, {
				"mea1": 1878466.82,
				"mea0": 235072.19,
				"dim0": "1 Percent",
				"Employee": "Ted",
				"Average Orders": "25",
				"Individual Orders": "25",
				"__id": 3
			}, {
				"mea1": 3386251.94,
				"mea0": 582543.16,
				"dim0": "1 Percent",
				"Employee": "Max",
				"Average Orders": "25",
				"Individual Orders": "13",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455848122-content-sap_chart_ScatterChart-1593455982344'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455848122-content-sap_chart_ScatterChart-1593455982344/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455848122-content-sap_chart_ScatterChart-1593455982344"]["vizProperties"] = {
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

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_chart_LineChart-1593455241479").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593456081420-content-sap_chart_LineChart-1593456113171").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_chart_LineChart-1593455247360").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455536060-content-sap_m_Panel-1593455645880-content-sap_chart_LineChart-1593455713925").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455789992-content-sap_chart_ColumnChart-1593455823511").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455848122-content-sap_chart_ScatterChart-1593455982344").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

		},
		onAfterRendering: function() {

			var oChart,
				self = this,
				oBindingParameters = this.oBindingParameters,
				oView = this.getView();

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_chart_LineChart-1593455241479");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_chart_LineChart-1593455241479']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593456081420-content-sap_chart_LineChart-1593456113171");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593456081420-content-sap_chart_LineChart-1593456113171']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_chart_LineChart-1593455247360");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_chart_LineChart-1593455247360']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455536060-content-sap_m_Panel-1593455645880-content-sap_chart_LineChart-1593455713925");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455536060-content-sap_m_Panel-1593455645880-content-sap_chart_LineChart-1593455713925']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455789992-content-sap_chart_ColumnChart-1593455823511");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455789992-content-sap_chart_ColumnChart-1593455823511']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455848122-content-sap_chart_ScatterChart-1593455982344");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455848122-content-sap_chart_ScatterChart-1593455982344']);

		}
	});
}, /* bExport= */ true);
