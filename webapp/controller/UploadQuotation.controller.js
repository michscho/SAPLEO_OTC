/**
 * Configuration to what to expect from to document extraction job of SAP
 * HeaderFields to find (array)
 * LineItemsFields
 * Client to save
 * Enrichment specifies which configuration and ML to use
 */
var jsonData = {
  "extraction": {
    "headerFields": [
      "documentNumber",
      "taxId",
      "taxName",
      "purchaseOrderNumber",
      "shippingAmount",
      "netAmount",
      "senderAddress",
      "senderName",
      "grossAmount",
      "currencyCode",
      "receiverContact",
      "documentDate",
      "taxAmount",
      "taxRate",
      "receiverName",
      "receiverAddress",
      "deliveryDate",
      "paymentTerms",
      "deliveryNoteNumber",
      "senderBankAccount"
    ],
    "lineItemFields": [
      "description",
      "netAmount",
      "quantity",
      "unitPrice",
      "materialNumber"
    ]
  },
  "clientId": "c_00",
  "documentType": "invoice",
  "receivedDate": "2020-06-17",
  "enrichment": {
    "sender": {
      "top": 5,
      "type": "businessEntity",
      "subtype": "supplier"
    },
    "employee": {
      "type": "employee"
    }
  }
};


/**
 * To send a pdf to SAP Document Extraction you need to send them as form data
 * @param pdfData - Formdata with body and binary pdf
 */
async function postDocument(pdfData) {
    let response = await getToken();
    axios({
        url: jobsUrl,
        method: 'post',
        headers: {
            Authorization: "Bearer " + response.data.access_token,
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
        },
        data: pdfData
    })
        .then(response => {
        	
        console.log(fetchDocument(response.data.id));
    })
        .catch(error => {
            console.log(error)
        });
}

/**
 * Getting response of Document with specific ID
 */
async function fetchDocument(idDoc) {
    let response = await getToken();
    const id = '/' + idDoc;
    return axios({
        url: jobsUrl + id,
        method: 'get',
        headers: {
            Authorization: "Bearer " + response.data.access_token,
            "Access-Control-Allow-Origin": "*"
        },
        params: {
            clientId: 'c_00',
        }
    });
}

/**
 * Getting response of Document
 */
async function fetchDocument() {
    let response = await getToken();
    const id = '/1fe1be3c-9e9e-4646-9875-fc60617548ce';
    return axios({
        url: jobsUrl + id,
        method: 'get',
        headers: {
            Authorization: "Bearer " + response.data.access_token,
            "Access-Control-Allow-Origin": "*"
        },
        params: {
            clientId: 'c_00',
        }
    });
}


sap.ui.define([
	"jquery.sap.global",
	"sap/base/util/deepExtend",
	"sap/ui/core/syncStyleClass",
	"sap/ui/core/mvc/Controller",
	"sap/m/ObjectMarker",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"sap/m/library",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/FileSizeFormat",
	"sap/ui/Device"
], function(jQuery, deepExtend, syncStyleClass, Controller, ObjectMarker, MessageToast, UploadCollectionParameter, MobileLibrary, JSONModel, FileSizeFormat, Device) {
	"use strict";

	var ListMode = MobileLibrary.ListMode,
		ListSeparators = MobileLibrary.ListSeparators;

	return Controller.extend("com.sap.build.standard.otcOptimization.controller.UploadQuotation", {
		onInit: function() {
			
			// set mock data
			var sPath = sap.ui.require.toUrl("com.sap.build.standard.otcOptimization.controller.UploadQuotation");
			this.getView().setModel(new JSONModel(sPath));

			this.getView().setModel(new JSONModel(Device), "device");

			this.getView().setModel(new JSONModel({
				"maximumFilenameLength": 55,
				"maximumFileSize": 1000,
				"mode": ListMode.SingleSelectMaster,
				"uploadEnabled": true,
				"uploadButtonVisible": true,
				"enableEdit": true,
				"enableDelete": true,
				"visibleEdit": true,
				"visibleDelete": true,
				"listSeparatorItems": [
					ListSeparators.All,
					ListSeparators.None
				],
				"showSeparators": ListSeparators.All,
				"listModeItems": [
					{
						"key": ListMode.SingleSelectMaster,
						"text": "Single"
					}, {
						"key": ListMode.MultiSelect,
						"text": "Multi"
					}
				]
			}), "settings");
		

			this.getView().setModel(new JSONModel({
				"items": ["jpg", "txt", "ppt", "doc", "xls", "pdf", "png"],
				"selected": ["jpg", "txt", "ppt", "doc", "xls", "pdf", "png"]
			}), "fileTypes");

			// Sets the text to the label
			this.byId("UploadCollection").addEventDelegate({
				onBeforeRendering: function() {
					this.byId("attachmentTitle").setText(this.getAttachmentTitleText());
				}.bind(this)
			});
		},

		createObjectMarker: function(sId, oContext) {
			var mSettings = null;

			if (oContext.getProperty("type")) {
				mSettings = {
					type: "{type}",
					press: this.onMarkerPress
				};
			}
			return new ObjectMarker(sId, mSettings);
		},

		formatAttribute: function(sValue) {
			if (jQuery.isNumeric(sValue)) {
				return FileSizeFormat.getInstance({
					binaryFilesize: false,
					maxFractionDigits: 1,
					maxIntegerDigits: 3
				}).format(sValue);
			} else {
				return sValue;
			}
		},

		onChange: async function(oEvent) {
			var oUploadCollection = oEvent.getSource();
			console.log("HERE");
			var data = new FormData();
        	data.append('file', oEvent.getParameter('files')[0], oEvent.getParameter('files')[0].fileName);
        	data.append("options", JSON.stringify(jsonData));
        	
        	let a = await fetchDocument();
        	
        	console.log("update OrderAmountSet");
        	
        	
        	
        	
        	var documentArray = JSON.parse(JSON.stringify( a.data.extraction.headerFields));
			console.log("The Array at position 0 is: " + JSON.stringify(documentArray[0]));
			
			console.log("The order Amount Set is");
	
			
			 this.sContext = "OrderDocumentSet('0000000002')";
			
			 var oParams = {
			 		"expand": "Sender,Receiver,Details,Payment,OrderItem"
			 	};
			 var oPath;

			 if (this.sContext) {
			 	oPath = {
			 		path: "/" + this.sContext,
			 		parameters: oParams
			 	};
			 	this.getView().bindObject(oPath);
			 }
			
			
			
			
        	postDocument(data);
			//console.log(data);
			// Header Token
			var oCustomerHeaderToken = new UploadCollectionParameter({
				name: "x-csrf-token",
				value: "securityTokenFromModel"
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},

		onFileDeleted: function(oEvent) {
			this.deleteItemById(oEvent.getParameter("documentId"));
			MessageToast.show("FileDeleted event triggered.");
		},

		deleteItemById: function(sItemToDeleteId) {
			var oData = this.byId("UploadCollection").getModel().getData();
			var aItems = deepExtend({}, oData).items;
			jQuery.each(aItems, function(index) {
				if (aItems[index] && aItems[index].documentId === sItemToDeleteId) {
					aItems.splice(index, 1);
				}
			});
			this.byId("UploadCollection").getModel().setData({
				"items": aItems
			});
			this.byId("attachmentTitle").setText(this.getAttachmentTitleText());
		},

		deleteMultipleItems: function(aItemsToDelete) {
			var oData = this.byId("UploadCollection").getModel().getData();
			var nItemsToDelete = aItemsToDelete.length;
			var aItems = deepExtend({}, oData).items;
			var i = 0;
			jQuery.each(aItems, function(index) {
				if (aItems[index]) {
					for (i = 0; i < nItemsToDelete; i++) {
						if (aItems[index].documentId === aItemsToDelete[i].getDocumentId()) {
							aItems.splice(index, 1);
						}
					}
				}
			});
			this.byId("UploadCollection").getModel().setData({
				"items": aItems
			});
			this.byId("attachmentTitle").setText(this.getAttachmentTitleText());
		},

		onFilenameLengthExceed: function() {
			MessageToast.show("FilenameLengthExceed event triggered.");
		},

		onFileRenamed: function(oEvent) {
			var oData = this.byId("UploadCollection").getModel().getData();
			var aItems = deepExtend({}, oData).items;
			var sDocumentId = oEvent.getParameter("documentId");
			jQuery.each(aItems, function(index) {
				if (aItems[index] && aItems[index].documentId === sDocumentId) {
					aItems[index].fileName = oEvent.getParameter("item").getFileName();
				}
			});
			this.byId("UploadCollection").getModel().setData({
				"items": aItems
			});
			MessageToast.show("FileRenamed event triggered.");
		},

		onFileSizeExceed: function() {
			MessageToast.show("FileSizeExceed event triggered.");
		},

		onTypeMissmatch: function() {
			MessageToast.show("TypeMissmatch event triggered.");
		},

		onUploadComplete: function(oEvent) {
			var oUploadCollection = this.byId("UploadCollection");
			var oData = oUploadCollection.getModel().getData();

			oData.items.unshift({
				"documentId": Date.now().toString(), // generate Id,
				"fileName": oEvent.getParameter("files")[0].fileName,
				"mimeType": "",
				"thumbnailUrl": "",
				"url": "",
				"attributes": [
					{
						"title": "Uploaded By",
						"text": "You",
						"active": false
					},
					{
						"title": "Uploaded On",
						"text": new Date().toLocaleDateString(),
						"active": false
					},
					{
						"title": "File Size",
						"text": "505000",
						"active": false
					}
				],
				"statuses": [
					{
						"title": "",
						"text": "",
						"state": "None"
					}
				],
				"markers": [
					{
					}
				],
				"selected": false
			});
			this.getView().getModel().refresh();

			// Sets the text to the label
			this.byId("attachmentTitle").setText(this.getAttachmentTitleText());

			// delay the success message for to notice onChange message
			setTimeout(function() {
				MessageToast.show("UploadComplete event triggered.");
			}, 4000);
		},

		onBeforeUploadStarts: function(oEvent) {
			// Header Slug
			var oCustomerHeaderSlug = new UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			MessageToast.show("BeforeUploadStarts event triggered.");
		},

		onUploadTerminated: function() {
			/*
			// get parameter file name
			var sFileName = oEvent.getParameter("fileName");
			// get a header parameter (in case no parameter specified, the callback function getHeaderParameter returns all request headers)
			var oRequestHeaders = oEvent.getParameters().getHeaderParameter();
			*/
		},

		onFileTypeChange: function(oEvent) {
			this.byId("UploadCollection").setFileType(oEvent.getSource().getSelectedKeys());
		},

		onSelectAllPress: function(oEvent) {
			var oUploadCollection = this.byId("UploadCollection");
			if (!oEvent.getSource().getPressed()) {
				this.deselectAllItems(oUploadCollection);
				oEvent.getSource().setPressed(false);
				oEvent.getSource().setText("Select all");
			} else {
				this.deselectAllItems(oUploadCollection);
				oUploadCollection.selectAll();
				oEvent.getSource().setPressed(true);
				oEvent.getSource().setText("Deselect all");
			}
			this.onSelectionChange(oEvent);
		},

		deselectAllItems: function(oUploadCollection) {
			var aItems = oUploadCollection.getItems();
			for (var i = 0; i < aItems.length; i++) {
				oUploadCollection.setSelectedItem(aItems[i], false);
			}
		},

		getAttachmentTitleText: function() {
			var aItems = this.byId("UploadCollection").getItems();
			return "Currently Uploading (" + aItems.length + ")";
		},

		onModeChange: function(oEvent) {
			var oSettingsModel = this.getView().getModel("settings");
			if (oEvent.getParameters().selectedItem.getProperty("key") === ListMode.MultiSelect) {
				oSettingsModel.setProperty("/visibleEdit", false);
				oSettingsModel.setProperty("/visibleDelete", false);
				this.enableToolbarItems(true);
			} else {
				oSettingsModel.setProperty("/visibleEdit", true);
				oSettingsModel.setProperty("/visibleDelete", true);
				this.enableToolbarItems(false);
			}
		},

		enableToolbarItems: function(status) {
			this.byId("selectAllButton").setVisible(status);
			this.byId("deleteSelectedButton").setVisible(status);
			this.byId("selectAllButton").setEnabled(status);
			// This is only enabled if there is a selected item in multi-selection mode
			if (this.byId("UploadCollection").getSelectedItems().length > 0) {
				this.byId("deleteSelectedButton").setEnabled(true);
			}
		},

		onDeleteSelectedItems: function() {
			var aSelectedItems = this.byId("UploadCollection").getSelectedItems();
			this.deleteMultipleItems(aSelectedItems);
			if (this.byId("UploadCollection").getSelectedItems().length < 1) {
				this.byId("selectAllButton").setPressed(false);
				this.byId("selectAllButton").setText("Select all");
			}
			MessageToast.show("Delete selected items button press.");
		},

		onSearch: function() {
			MessageToast.show("Search feature isn't available in this sample");
		},

		onSelectionChange: function() {
			var oUploadCollection = this.byId("UploadCollection");
			// Only it is enabled if there is a selected item in multi-selection mode
			if (oUploadCollection.getMode() === ListMode.MultiSelect) {
				if (oUploadCollection.getSelectedItems().length > 0) {
					this.byId("deleteSelectedButton").setEnabled(true);
				} else {
					this.byId("deleteSelectedButton").setEnabled(false);
				}
			}
		},

		onAttributePress: function(oEvent) {
			MessageToast.show("Attribute press event - " + oEvent.getSource().getTitle() + ": " + oEvent.getSource().getText());
		},

		onMarkerPress: function(oEvent) {
			MessageToast.show("Marker press event - " + oEvent.getSource().getType());
		},

		onOpenAppSettings: function(oEvent) {
			if (!this.oSettingsDialog) {
				this.oSettingsDialog = sap.ui.xmlfragment("sap.m.sample.UploadCollection.AppSettings", this);
				this.getView().addDependent(this.oSettingsDialog);
			}
			syncStyleClass("sapUiSizeCompact", this.getView(), this.oSettingsDialog);
			this.oSettingsDialog.open();
		},

		onDialogCloseButton: function() {
			this.oSettingsDialog.close();
		}
	});
});