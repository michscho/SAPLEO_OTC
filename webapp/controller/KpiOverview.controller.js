sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.otcOptimization.controller.KpiOverview", {
		handleRouteMatched: function(oEvent) {
			var sAppId = "App5efa215104d5c13a7dfaf6bd";

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
			this.oRouter.getTarget("KpiOverview").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			var oView = this.getView(),
				oData = {},
				self = this;
			var oModel = new sap.ui.model.json.JSONModel();
			oView.setModel(oModel, "staticDataModel");
			self.oBindingParameters = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276706239-content-sap_m_Panel-1-content-sap_chart_LineChart-1"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276706239-content-sap_m_Panel-1-content-sap_chart_LineChart-1"]["data"] = [{
				"dim0": "Februar",
				"mea0": "25",
				"Week": "55",
				"Month": "80",
				"Day": "22.06.2020",
				"Total Time Automized": "68",
				"__id": 0
			}, {
				"dim0": "March",
				"mea0": "23",
				"Week": "65",
				"Month": "75",
				"Day": "23.06.2020",
				"Total Time Automized": "67",
				"__id": 1
			}, {
				"dim0": "April",
				"mea0": "26",
				"Week": "70",
				"Month": "85",
				"Day": "24.06.2020",
				"Total Time Automized": "65",
				"__id": 2
			}, {
				"dim0": "May",
				"mea0": "21",
				"Week": "40",
				"Month": "63",
				"Day": "25.06.2020",
				"Total Time Automized": "71",
				"__id": 3
			}, {
				"dim0": "June",
				"mea0": "24",
				"Week": "50",
				"Month": "68",
				"Day": "26.06.2020",
				"Total Time Automized": "69",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276706239-content-sap_m_Panel-1-content-sap_chart_LineChart-1'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276706239-content-sap_m_Panel-1-content-sap_chart_LineChart-1/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276706239-content-sap_m_Panel-1-content-sap_chart_LineChart-1"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276706239-content-sap_m_Panel-2-content-sap_chart_LineChart-1"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276706239-content-sap_m_Panel-2-content-sap_chart_LineChart-1"]["data"] = [{
				"dim0": "Februar",
				"mea0": "296",
				"Day": "22.06.2020",
				"Week": "4",
				"Month": "12",
				"Average Time Saved": "14",
				"__id": 0
			}, {
				"dim0": "March",
				"mea0": "133",
				"Day": "23.06.2020",
				"Week": "2",
				"Month": "10",
				"Average Time Saved": "15",
				"__id": 1
			}, {
				"dim0": "April",
				"mea0": "489",
				"Day": "24.06.2020",
				"Week": "8",
				"Month": "14",
				"Average Time Saved": "15",
				"__id": 2
			}, {
				"dim0": "May",
				"mea0": "270",
				"Day": "25.06.2020",
				"Week": "7",
				"Month": "13",
				"Average Time Saved": "16",
				"__id": 3
			}, {
				"dim0": "June",
				"mea0": "350",
				"Day": "26.06.2020",
				"Week": "6",
				"Month": "15",
				"Average Time Saved": "15",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276706239-content-sap_m_Panel-2-content-sap_chart_LineChart-1'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276706239-content-sap_m_Panel-2-content-sap_chart_LineChart-1/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276706239-content-sap_m_Panel-2-content-sap_chart_LineChart-1"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276761573-content-sap_m_Panel-1-content-sap_chart_LineChart-1"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276761573-content-sap_m_Panel-1-content-sap_chart_LineChart-1"]["data"] = [{
				"dim0": "India",
				"mea0": "296",
				"value1": "Februar",
				"Day": "22.06.2020",
				"Week": "23",
				"Month": "24",
				"Error Rate": "39",
				"__id": 0
			}, {
				"dim0": "Canada",
				"mea0": "133",
				"value1": "March",
				"Day": "23.06.2020",
				"Week": "18",
				"Month": "21",
				"Error Rate": "38",
				"__id": 1
			}, {
				"dim0": "USA",
				"mea0": "489",
				"value1": "April",
				"Day": "24.06.2020",
				"Week": "16",
				"Month": "18",
				"Error Rate": "40",
				"__id": 2
			}, {
				"dim0": "Japan",
				"mea0": "270",
				"value1": "May",
				"Day": "25.06.2020",
				"Week": "42",
				"Month": "41",
				"Error Rate": "39",
				"__id": 3
			}, {
				"dim0": "Germany",
				"mea0": "350",
				"value1": "June",
				"Day": "26.06.2020",
				"Week": "38",
				"Month": "39",
				"Error Rate": "39",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276761573-content-sap_m_Panel-1-content-sap_chart_LineChart-1'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276761573-content-sap_m_Panel-1-content-sap_chart_LineChart-1/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276761573-content-sap_m_Panel-1-content-sap_chart_LineChart-1"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276761573-content-sap_m_Panel-2-content-sap_chart_LineChart-1"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276761573-content-sap_m_Panel-2-content-sap_chart_LineChart-1"]["data"] = [{
				"dim0": "Februar",
				"mea0": "296",
				"Day": "22.06.2020",
				"Week": "31",
				"Month": "30",
				"Error Rate in %": "15",
				"__id": 0
			}, {
				"dim0": "March",
				"mea0": "133",
				"Day": "23.06.2020",
				"Week": "29",
				"Month": "27",
				"Error Rate in %": "14",
				"__id": 1
			}, {
				"dim0": "April",
				"mea0": "489",
				"Day": "24.06.2020",
				"Week": "35",
				"Month": "36",
				"Error Rate in %": "14",
				"__id": 2
			}, {
				"dim0": "May",
				"mea0": "270",
				"Day": "25.06.2020",
				"Week": "17",
				"Month": "15",
				"Error Rate in %": "13",
				"__id": 3
			}, {
				"dim0": "June",
				"mea0": "350",
				"Day": "26.06.2020",
				"Week": "13",
				"Month": "14",
				"Error Rate in %": "14",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276761573-content-sap_m_Panel-2-content-sap_chart_LineChart-1'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276761573-content-sap_m_Panel-2-content-sap_chart_LineChart-1/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276761573-content-sap_m_Panel-2-content-sap_chart_LineChart-1"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276828403-content-sap_chart_LineChart-1"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276828403-content-sap_chart_LineChart-1"]["data"] = [{
				"dim0": "India",
				"mea0": "296",
				"Cost Saving per Day": "25",
				"per Week": "25",
				"Day": "22.06.2020",
				"Cost Saving": "79",
				"__id": 0
			}, {
				"dim0": "Canada",
				"mea0": "133",
				"Cost Saving per Day": "26",
				"per Week": "24",
				"Day": "23.06.2020",
				"Cost Saving": "78",
				"__id": 1
			}, {
				"dim0": "USA",
				"mea0": "489",
				"Cost Saving per Day": "27",
				"per Week": "26",
				"Day": "24.06.2020",
				"Cost Saving": "78",
				"__id": 2
			}, {
				"dim0": "Japan",
				"mea0": "270",
				"Cost Saving per Day": "28",
				"per Week": "23",
				"Day": "25.06.2020",
				"Cost Saving": "77",
				"__id": 3
			}, {
				"dim0": "Germany",
				"mea0": "350",
				"Day": "26.06.2020",
				"Cost Saving": "77",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276828403-content-sap_chart_LineChart-1'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276828403-content-sap_chart_LineChart-1/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276828403-content-sap_chart_LineChart-1"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594281919705-content-sap_chart_LineChart-1"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594281919705-content-sap_chart_LineChart-1"]["data"] = [{
				"dim0": "India",
				"mea0": "296",
				"Average Productivity": "11.035",
				"Month": "Calendar week 23",
				"Week": "Calendar week 23",
				"Day": "22.06.2020",
				"__id": 0
			}, {
				"dim0": "Canada",
				"mea0": "133",
				"Month": "Calendar week 24",
				"Average Productivity": "10.783",
				"Week": "Calendar week 24",
				"Day": "23.06.2020",
				"__id": 1
			}, {
				"dim0": "USA",
				"mea0": "489",
				"Month": "Calendar week 25",
				"Average Productivity": "10.852",
				"Week": "Calendar week 25",
				"Day": "24.06.2020",
				"__id": 2
			}, {
				"dim0": "Japan",
				"mea0": "270",
				"Month": "Calendar week 26",
				"Average Productivity": "10.923",
				"Week": "Calendar week 26",
				"Day": "25.06.2020",
				"__id": 3
			}, {
				"dim0": "Germany",
				"mea0": "350",
				"Month": "Calendar week 27",
				"Average Productivity": "10.985",
				"Week": "Calendar week 27",
				"Day": "26.06.2020",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594281919705-content-sap_chart_LineChart-1'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594281919705-content-sap_chart_LineChart-1/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594281919705-content-sap_chart_LineChart-1"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276726549-content-sap_m_Panel-1-content-sap_chart_LineChart-1"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276726549-content-sap_m_Panel-1-content-sap_chart_LineChart-1"]["data"] = [{
				"dim0": "Februar",
				"mea0": "25",
				"Week": "Calendar week 23",
				"Month": "80",
				"Total Time Automized": "64",
				"__id": 0
			}, {
				"dim0": "March",
				"mea0": "23",
				"Week": "Calendar week 24",
				"Month": "75",
				"Total Time Automized": "71",
				"__id": 1
			}, {
				"dim0": "April",
				"mea0": "26",
				"Week": "Calendar week 25",
				"Month": "85",
				"Total Time Automized": "68",
				"__id": 2
			}, {
				"dim0": "May",
				"mea0": "21",
				"Week": "Calendar week 26",
				"Month": "63",
				"Total Time Automized": "65",
				"__id": 3
			}, {
				"dim0": "June",
				"mea0": "24",
				"Week": "Calendar week 27",
				"Month": "68",
				"Total Time Automized": "70",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276726549-content-sap_m_Panel-1-content-sap_chart_LineChart-1'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276726549-content-sap_m_Panel-1-content-sap_chart_LineChart-1/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276726549-content-sap_m_Panel-1-content-sap_chart_LineChart-1"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276726549-content-sap_m_Panel-2-content-sap_chart_LineChart-1"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276726549-content-sap_m_Panel-2-content-sap_chart_LineChart-1"]["data"] = [{
				"dim0": "Februar",
				"mea0": "296",
				"Day": "3",
				"Week": "Calendar week 23",
				"Month": "12",
				"Average Time Saved": "14",
				"__id": 0
			}, {
				"dim0": "March",
				"mea0": "133",
				"Day": "2",
				"Week": "Calendar week 24",
				"Month": "10",
				"Average Time Saved": "14",
				"__id": 1
			}, {
				"dim0": "April",
				"mea0": "489",
				"Day": "6",
				"Week": "Calendar week 25",
				"Month": "14",
				"Average Time Saved": "13",
				"__id": 2
			}, {
				"dim0": "May",
				"mea0": "270",
				"Day": "4",
				"Week": "Calendar week 26",
				"Month": "13",
				"Average Time Saved": "14",
				"__id": 3
			}, {
				"dim0": "June",
				"mea0": "350",
				"Day": "2",
				"Week": "Calendar week 27",
				"Month": "15",
				"Average Time Saved": "15",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276726549-content-sap_m_Panel-2-content-sap_chart_LineChart-1'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276726549-content-sap_m_Panel-2-content-sap_chart_LineChart-1/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276726549-content-sap_m_Panel-2-content-sap_chart_LineChart-1"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276770383-content-sap_m_Panel-1-content-sap_chart_LineChart-1"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276770383-content-sap_m_Panel-1-content-sap_chart_LineChart-1"]["data"] = [{
				"dim0": "India",
				"mea0": "296",
				"value1": "Februar",
				"Day": "25",
				"Week": "Calendar week 23",
				"Month": "24",
				"Error Rate": "41",
				"__id": 0
			}, {
				"dim0": "Canada",
				"mea0": "133",
				"value1": "March",
				"Day": "19",
				"Week": "Calendar week 24",
				"Month": "21",
				"Error Rate": "40",
				"__id": 1
			}, {
				"dim0": "USA",
				"mea0": "489",
				"value1": "April",
				"Day": "15",
				"Week": "Calendar week 25",
				"Month": "18",
				"Error Rate": "41",
				"__id": 2
			}, {
				"dim0": "Japan",
				"mea0": "270",
				"value1": "May",
				"Day": "41",
				"Week": "Calendar week 26",
				"Month": "41",
				"Error Rate": "38",
				"__id": 3
			}, {
				"dim0": "Germany",
				"mea0": "350",
				"value1": "June",
				"Day": "39",
				"Week": "Calendar week 27",
				"Month": "39",
				"Error Rate": "37",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276770383-content-sap_m_Panel-1-content-sap_chart_LineChart-1'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276770383-content-sap_m_Panel-1-content-sap_chart_LineChart-1/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276770383-content-sap_m_Panel-1-content-sap_chart_LineChart-1"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276770383-content-sap_m_Panel-2-content-sap_chart_LineChart-1"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276770383-content-sap_m_Panel-2-content-sap_chart_LineChart-1"]["data"] = [{
				"dim0": "Februar",
				"mea0": "296",
				"Day": "30",
				"Week": "Calendar week 23",
				"Month": "30",
				"Error Rate": "15",
				"__id": 0
			}, {
				"dim0": "March",
				"mea0": "133",
				"Day": "28",
				"Week": "Calendar week 24",
				"Month": "27",
				"Error Rate": "15",
				"__id": 1
			}, {
				"dim0": "April",
				"mea0": "489",
				"Day": "33",
				"Week": "Calendar week 25",
				"Month": "36",
				"Error Rate": "14",
				"__id": 2
			}, {
				"dim0": "May",
				"mea0": "270",
				"Day": "14",
				"Week": "Calendar week 26",
				"Month": "15",
				"Error Rate": "14",
				"__id": 3
			}, {
				"dim0": "June",
				"mea0": "350",
				"Day": "16",
				"Week": "Calendar week 27",
				"Month": "14",
				"Error Rate": "14",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276770383-content-sap_m_Panel-2-content-sap_chart_LineChart-1'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276770383-content-sap_m_Panel-2-content-sap_chart_LineChart-1/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276770383-content-sap_m_Panel-2-content-sap_chart_LineChart-1"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276824067-content-sap_chart_LineChart-1"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276824067-content-sap_chart_LineChart-1"]["data"] = [{
				"dim0": "India",
				"mea0": "296",
				"Cost Saving per Day": "25",
				"per Week": "25",
				"Week": "Calendar week 23",
				"Cost Saving": "75",
				"__id": 0
			}, {
				"dim0": "Canada",
				"mea0": "133",
				"Cost Saving per Day": "26",
				"per Week": "24",
				"Week": "Calendar week 24",
				"Cost Saving": "76",
				"__id": 1
			}, {
				"dim0": "USA",
				"mea0": "489",
				"Cost Saving per Day": "27",
				"per Week": "26",
				"Week": "Calendar week 25",
				"Cost Saving": "77",
				"__id": 2
			}, {
				"dim0": "Japan",
				"mea0": "270",
				"Cost Saving per Day": "28",
				"per Week": "23",
				"Week": "Calendar week 26",
				"Cost Saving": "79",
				"__id": 3
			}, {
				"dim0": "Germany",
				"mea0": "350",
				"Week": "Calendar week 27",
				"Cost Saving": "77",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276824067-content-sap_chart_LineChart-1'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276824067-content-sap_chart_LineChart-1/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276824067-content-sap_chart_LineChart-1"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594281733173-content-sap_chart_LineChart-1"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594281733173-content-sap_chart_LineChart-1"]["data"] = [{
				"dim0": "India",
				"mea0": "296",
				"Average Productivity": "11",
				"Month": "Calendar week 23",
				"Week": "Calendar week 23",
				"__id": 0
			}, {
				"dim0": "Canada",
				"mea0": "133",
				"Month": "Calendar week 24",
				"Average Productivity": "10.5",
				"Week": "Calendar week 24",
				"__id": 1
			}, {
				"dim0": "USA",
				"mea0": "489",
				"Month": "Calendar week 25",
				"Average Productivity": "10.3",
				"Week": "Calendar week 25",
				"__id": 2
			}, {
				"dim0": "Japan",
				"mea0": "270",
				"Month": "Calendar week 26",
				"Average Productivity": "10.7",
				"Week": "Calendar week 26",
				"__id": 3
			}, {
				"dim0": "Germany",
				"mea0": "350",
				"Month": "Calendar week 27",
				"Average Productivity": "11",
				"Week": "Calendar week 27",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594281733173-content-sap_chart_LineChart-1'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594281733173-content-sap_chart_LineChart-1/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594281733173-content-sap_chart_LineChart-1"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276734225-content-sap_m_Panel-1-content-sap_chart_LineChart-1"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276734225-content-sap_m_Panel-1-content-sap_chart_LineChart-1"]["data"] = [{
				"dim0": "Februar",
				"mea0": "25",
				"Week": "55",
				"Month": "Februar",
				"Total Time Saved": "80",
				"__id": 0
			}, {
				"dim0": "March",
				"mea0": "23",
				"Week": "65",
				"Month": "March",
				"Total Time Saved": "75",
				"__id": 1
			}, {
				"dim0": "April",
				"mea0": "26",
				"Week": "70",
				"Month": "April",
				"Total Time Saved": "85",
				"__id": 2
			}, {
				"dim0": "May",
				"mea0": "21",
				"Week": "40",
				"Month": "May",
				"Total Time Saved": "63",
				"__id": 3
			}, {
				"dim0": "June",
				"mea0": "24",
				"Week": "50",
				"Month": "June",
				"Total Time Saved": "68",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276734225-content-sap_m_Panel-1-content-sap_chart_LineChart-1'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276734225-content-sap_m_Panel-1-content-sap_chart_LineChart-1/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276734225-content-sap_m_Panel-1-content-sap_chart_LineChart-1"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276734225-content-sap_m_Panel-2-content-sap_chart_LineChart-1"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276734225-content-sap_m_Panel-2-content-sap_chart_LineChart-1"]["data"] = [{
				"dim0": "Februar",
				"mea0": "296",
				"Day": "3",
				"Week": "4",
				"Month": "Februar",
				"Average Time Saved": "12",
				"__id": 0
			}, {
				"dim0": "March",
				"mea0": "133",
				"Day": "2",
				"Week": "2",
				"Month": "March",
				"Average Time Saved": "10",
				"__id": 1
			}, {
				"dim0": "April",
				"mea0": "489",
				"Day": "6",
				"Week": "8",
				"Month": "April",
				"Average Time Saved": "14",
				"__id": 2
			}, {
				"dim0": "May",
				"mea0": "270",
				"Day": "4",
				"Week": "7",
				"Month": "May",
				"Average Time Saved": "13",
				"__id": 3
			}, {
				"dim0": "June",
				"mea0": "350",
				"Day": "2",
				"Week": "6",
				"Month": "June",
				"Average Time Saved": "15",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276734225-content-sap_m_Panel-2-content-sap_chart_LineChart-1'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276734225-content-sap_m_Panel-2-content-sap_chart_LineChart-1/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276734225-content-sap_m_Panel-2-content-sap_chart_LineChart-1"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276778066-content-sap_m_Panel-1-content-sap_chart_LineChart-1"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276778066-content-sap_m_Panel-1-content-sap_chart_LineChart-1"]["data"] = [{
				"dim0": "India",
				"mea0": "296",
				"value1": "Februar",
				"Day": "25",
				"Week": "23",
				"Month": "Februar",
				"Error Rate": "24",
				"__id": 0
			}, {
				"dim0": "Canada",
				"mea0": "133",
				"value1": "March",
				"Day": "19",
				"Week": "18",
				"Month": "March",
				"Error Rate": "21",
				"__id": 1
			}, {
				"dim0": "USA",
				"mea0": "489",
				"value1": "April",
				"Day": "15",
				"Week": "16",
				"Month": "April",
				"Error Rate": "18",
				"__id": 2
			}, {
				"dim0": "Japan",
				"mea0": "270",
				"value1": "May",
				"Day": "41",
				"Week": "42",
				"Month": "May",
				"Error Rate": "41",
				"__id": 3
			}, {
				"dim0": "Germany",
				"mea0": "350",
				"value1": "June",
				"Day": "39",
				"Week": "38",
				"Month": "June",
				"Error Rate": "39",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276778066-content-sap_m_Panel-1-content-sap_chart_LineChart-1'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276778066-content-sap_m_Panel-1-content-sap_chart_LineChart-1/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276778066-content-sap_m_Panel-1-content-sap_chart_LineChart-1"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276778066-content-sap_m_Panel-2-content-sap_chart_LineChart-1"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276778066-content-sap_m_Panel-2-content-sap_chart_LineChart-1"]["data"] = [{
				"dim0": "Februar",
				"mea0": "296",
				"Day": "30",
				"Week": "31",
				"Month": "Februar",
				"Error Rate": "30",
				"__id": 0
			}, {
				"dim0": "March",
				"mea0": "133",
				"Day": "28",
				"Week": "29",
				"Month": "March",
				"Error Rate": "27",
				"__id": 1
			}, {
				"dim0": "April",
				"mea0": "489",
				"Day": "33",
				"Week": "35",
				"Month": "April",
				"Error Rate": "36",
				"__id": 2
			}, {
				"dim0": "May",
				"mea0": "270",
				"Day": "14",
				"Week": "17",
				"Month": "May",
				"Error Rate": "15",
				"__id": 3
			}, {
				"dim0": "June",
				"mea0": "350",
				"Day": "16",
				"Week": "13",
				"Month": "June",
				"Error Rate": "14",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276778066-content-sap_m_Panel-2-content-sap_chart_LineChart-1'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276778066-content-sap_m_Panel-2-content-sap_chart_LineChart-1/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276778066-content-sap_m_Panel-2-content-sap_chart_LineChart-1"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276817505-content-sap_chart_LineChart-1"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276817505-content-sap_chart_LineChart-1"]["data"] = [{
				"dim0": "India",
				"mea0": "296",
				"Cost Saving per Day": "25",
				"per Week": "25",
				"Month": "Februar",
				"Cost Saving": "40",
				"__id": 0
			}, {
				"dim0": "Canada",
				"mea0": "133",
				"Cost Saving per Day": "26",
				"per Week": "24",
				"Month": "March",
				"Cost Saving": "38",
				"__id": 1
			}, {
				"dim0": "USA",
				"mea0": "489",
				"Cost Saving per Day": "27",
				"per Week": "26",
				"Month": "April",
				"Cost Saving": "44",
				"__id": 2
			}, {
				"dim0": "Japan",
				"mea0": "270",
				"Cost Saving per Day": "28",
				"per Week": "23",
				"Month": "May",
				"Cost Saving": "73",
				"__id": 3
			}, {
				"dim0": "Germany",
				"mea0": "350",
				"Month": "June",
				"Cost Saving": "78",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276817505-content-sap_chart_LineChart-1'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276817505-content-sap_chart_LineChart-1/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276817505-content-sap_chart_LineChart-1"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276892726-content-sap_chart_LineChart-1594281435720"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276892726-content-sap_chart_LineChart-1594281435720"]["data"] = [{
				"dim0": "India",
				"mea0": "296",
				"Average Productivity": "11",
				"Month": "Februar",
				"__id": 0
			}, {
				"dim0": "Canada",
				"mea0": "133",
				"Month": "March",
				"Average Productivity": "12",
				"__id": 1
			}, {
				"dim0": "USA",
				"mea0": "489",
				"Month": "April",
				"Average Productivity": "10",
				"__id": 2
			}, {
				"dim0": "Japan",
				"mea0": "270",
				"Month": "May",
				"Average Productivity": "10",
				"__id": 3
			}, {
				"dim0": "Germany",
				"mea0": "350",
				"Month": "June",
				"Average Productivity": "11",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276892726-content-sap_chart_LineChart-1594281435720'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276892726-content-sap_chart_LineChart-1594281435720/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276892726-content-sap_chart_LineChart-1594281435720"]["vizProperties"] = {
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

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276706239-content-sap_m_Panel-1-content-sap_chart_LineChart-1").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276706239-content-sap_m_Panel-2-content-sap_chart_LineChart-1").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276761573-content-sap_m_Panel-1-content-sap_chart_LineChart-1").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276761573-content-sap_m_Panel-2-content-sap_chart_LineChart-1").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276828403-content-sap_chart_LineChart-1").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594281919705-content-sap_chart_LineChart-1").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276726549-content-sap_m_Panel-1-content-sap_chart_LineChart-1").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276726549-content-sap_m_Panel-2-content-sap_chart_LineChart-1").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276770383-content-sap_m_Panel-1-content-sap_chart_LineChart-1").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276770383-content-sap_m_Panel-2-content-sap_chart_LineChart-1").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276824067-content-sap_chart_LineChart-1").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594281733173-content-sap_chart_LineChart-1").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276734225-content-sap_m_Panel-1-content-sap_chart_LineChart-1").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276734225-content-sap_m_Panel-2-content-sap_chart_LineChart-1").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276778066-content-sap_m_Panel-1-content-sap_chart_LineChart-1").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276778066-content-sap_m_Panel-2-content-sap_chart_LineChart-1").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276817505-content-sap_chart_LineChart-1").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276892726-content-sap_chart_LineChart-1594281435720").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

		},
		onAfterRendering: function() {

			var oChart,
				self = this,
				oBindingParameters = this.oBindingParameters,
				oView = this.getView();

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276706239-content-sap_m_Panel-1-content-sap_chart_LineChart-1");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276706239-content-sap_m_Panel-1-content-sap_chart_LineChart-1']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276706239-content-sap_m_Panel-2-content-sap_chart_LineChart-1");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276706239-content-sap_m_Panel-2-content-sap_chart_LineChart-1']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276761573-content-sap_m_Panel-1-content-sap_chart_LineChart-1");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276761573-content-sap_m_Panel-1-content-sap_chart_LineChart-1']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276761573-content-sap_m_Panel-2-content-sap_chart_LineChart-1");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276761573-content-sap_m_Panel-2-content-sap_chart_LineChart-1']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276828403-content-sap_chart_LineChart-1");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594276828403-content-sap_chart_LineChart-1']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594281919705-content-sap_chart_LineChart-1");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-1-content-sap_m_Panel-1594281919705-content-sap_chart_LineChart-1']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276726549-content-sap_m_Panel-1-content-sap_chart_LineChart-1");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276726549-content-sap_m_Panel-1-content-sap_chart_LineChart-1']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276726549-content-sap_m_Panel-2-content-sap_chart_LineChart-1");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276726549-content-sap_m_Panel-2-content-sap_chart_LineChart-1']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276770383-content-sap_m_Panel-1-content-sap_chart_LineChart-1");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276770383-content-sap_m_Panel-1-content-sap_chart_LineChart-1']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276770383-content-sap_m_Panel-2-content-sap_chart_LineChart-1");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276770383-content-sap_m_Panel-2-content-sap_chart_LineChart-1']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276824067-content-sap_chart_LineChart-1");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594276824067-content-sap_chart_LineChart-1']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594281733173-content-sap_chart_LineChart-1");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-3-content-sap_m_Panel-1594281733173-content-sap_chart_LineChart-1']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276734225-content-sap_m_Panel-1-content-sap_chart_LineChart-1");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276734225-content-sap_m_Panel-1-content-sap_chart_LineChart-1']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276734225-content-sap_m_Panel-2-content-sap_chart_LineChart-1");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276734225-content-sap_m_Panel-2-content-sap_chart_LineChart-1']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276778066-content-sap_m_Panel-1-content-sap_chart_LineChart-1");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276778066-content-sap_m_Panel-1-content-sap_chart_LineChart-1']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276778066-content-sap_m_Panel-2-content-sap_chart_LineChart-1");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276778066-content-sap_m_Panel-2-content-sap_chart_LineChart-1']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276817505-content-sap_chart_LineChart-1");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276817505-content-sap_chart_LineChart-1']);

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276892726-content-sap_chart_LineChart-1594281435720");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_Panel-1593455459317-content-sap_m_IconTabBar-1594276574629-items-sap_m_IconTabFilter-5-content-sap_m_Panel-1594276892726-content-sap_chart_LineChart-1594281435720']);

		}
	});
}, /* bExport= */ true);
