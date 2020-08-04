/**
 * 1.1.13.1 - Json Data
 * Configuration to what to expect from to document extraction job of SAP
 * HeaderFields to find (array)
 * LineItemsFields
 * Client to save
 * Enrichment possible
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
 * 1.1.13.2 - Post Document
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
 * 1.1.13.3 - Fetch Document
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
 * 1.1.13.4 - static fetch document
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

/**
 * 1.1.13.5 - UploadQuotation
 * Upload pdf.
 */
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
		/**
		 * 1.1.13.6 - onChange
		 * Function called when pdf is uploaded 
		 * Transformed to FormData
		 * Data is posted
		 */
		onChange: async function(oEvent) {
			var oUploadCollection = oEvent.getSource();
			var data = new FormData();
        	data.append('file', oEvent.getParameter('files')[0], oEvent.getParameter('files')[0].fileName);
        	data.append("options", JSON.stringify(jsonData));
        	
        	// static fetch for testing reason
        	let a = await fetchDocument();

        	var documentArray = JSON.parse(JSON.stringify( a.data.extraction.headerFields));
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
			
			// post and after it fetch
        	postDocument(data);
			// Header Token
			var oCustomerHeaderToken = new UploadCollectionParameter({
				name: "x-csrf-token",
				value: "securityTokenFromModel"
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},

        /**
		 * 1.1.13.7 - onFileDeleted
		 * Show Toast that File is deleted.
		 */
		onFileDeleted: function(oEvent) {
			this.deleteItemById(oEvent.getParameter("documentId"));
			MessageToast.show("File deleted");
		},
		
		/**
		 * 1.1.13.8 - deleteItemById
		 * Delete specific Id
		 */
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

		/**
		 * 1.1.13.9 - deleteMultipleItems
		 * Delete multipleItems
		 */
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

		/**
		 * 1.1.13.10 - onFilenameLengthExceed
		 * Show Toast.
		 */
		onFilenameLengthExceed: function() {
			MessageToast.show("FilenameLengthExceed.");
		},

		/**
		 * 1.1.13.11 - onFileRenamed
		 * Change data in UploadCollection
		 */
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
			MessageToast.show("FileRenamed.");
		},

		 /**
		 * 1.1.13.12 - onFileRenamed
		 * File exceed
		 */
		onFileSizeExceed: function() {
			MessageToast.show("FileSizeExceed.");
		},

         /**
		 * 1.1.13.13 - onTypeMissmatch
		 * TypeMissmatch
		 */
		onTypeMissmatch: function() {
			MessageToast.show("TypeMissmatch.");
		},

         /**
		 * 1.1.13.14 - onUploadComplete
		 * After Upload change view
		 */
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

		/**
		 * 1.1.13.15 - onBeforeUploadStarts
		 * Before Upload configure
		 */
		onBeforeUploadStarts: function(oEvent) {
			// Header Slug
			var oCustomerHeaderSlug = new UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			MessageToast.show("BeforeUploadStarts.");
		},

		onUploadTerminated: function() {
			/*
			// get parameter file name
			var sFileName = oEvent.getParameter("fileName");
			// get a header parameter (in case no parameter specified, the callback function getHeaderParameter returns all request headers)
			var oRequestHeaders = oEvent.getParameters().getHeaderParameter();
			*/
		},

		/**
		 * 1.1.13.16 - onFileTypeChange
		 * Select Id
		 */
		onFileTypeChange: function(oEvent) {
			this.byId("UploadCollection").setFileType(oEvent.getSource().getSelectedKeys());
		},

        /**
		 * 1.1.13.17 - onSelectAllPress
		 * Make Selectable
		 */
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

		/**
		 * 1.1.13.18 - onSelectAllPress
		 * Make DeSelectable
		 */
		deselectAllItems: function(oUploadCollection) {
			var aItems = oUploadCollection.getItems();
			for (var i = 0; i < aItems.length; i++) {
				oUploadCollection.setSelectedItem(aItems[i], false);
			}
		},

		/**
		 * 1.1.13.19 - getAttachmentTitleText
		 * Show # of Items
		 */
		getAttachmentTitleText: function() {
			var aItems = this.byId("UploadCollection").getItems();
			return "Currently Uploading (" + aItems.length + ")";
		},

		 /**
		 * 1.1.13.20 - onModeChange
		 * Activate Edit / Deactive Edit Mode
		 */
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

         /**
		 * 1.1.13.21 - enableToolbarItems
		 * Toolbar visible
		 */
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
			MessageToast.show("Not implemented yet");
		},

         /**
		 * 1.1.13.22 - onSelectionChange
		 * Only it is enabled if there is a selected item in multi-selection mode
		 */
		onSelectionChange: function() {
			var oUploadCollection = this.byId("UploadCollection");
			if (oUploadCollection.getMode() === ListMode.MultiSelect) {
				if (oUploadCollection.getSelectedItems().length > 0) {
					this.byId("deleteSelectedButton").setEnabled(true);
				} else {
					this.byId("deleteSelectedButton").setEnabled(false);
				}
			}
		},

		 /**
		 * 1.1.13.23 - onAttributePress
		 * Print out event
		 */
		onAttributePress: function(oEvent) {
			MessageToast.show("Attribute press event - " + oEvent.getSource().getTitle() + ": " + oEvent.getSource().getText());
		},
		
		/**
		 * 1.1.13.24 - onAttributePress
		 */
		onMarkerPress: function(oEvent) {
			MessageToast.show("Marker press event - " + oEvent.getSource().getType());
		},

	     /**
		 * 1.1.13.25 - onOpenAppSettings
		 * OpenSettings Dialog
		 */
		onOpenAppSettings: function(oEvent) {
			if (!this.oSettingsDialog) {
				this.oSettingsDialog = sap.ui.xmlfragment("sap.m.sample.UploadCollection.AppSettings", this);
				this.getView().addDependent(this.oSettingsDialog);
			}
			syncStyleClass("sapUiSizeCompact", this.getView(), this.oSettingsDialog);
			this.oSettingsDialog.open();
		},

		/**
		 * 1.1.13.26 - onDialogCloseButton
		 * Close Settings Dialog
		 */
		onDialogCloseButton: function() {
			this.oSettingsDialog.close();
		}
	});
});