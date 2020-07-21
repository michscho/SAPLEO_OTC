sap.ui.define([
	"./utilities"
], function() {
	"use strict";

	// class providing static utility methods to retrieve entity default values.

	return {
	getDefaultValuesForEditOverviewEmail: function() {
			return {
				"ID": "id-" + Date.now().toString(),
				"AgreementNo": 0,
				"BPCode": "",
				"BPName": "",
				"ContactPersonCode": 0,
				"StartDate": null,
				"EndDate": null,
				"TerminateDate": "",
				"Description": "",
				"AgreementType": "",
				"Status": "",
				"Owner": "",
				"IgnorePricesInAgreement": "",
				"Renewal": "",
				"RemindUnit": "",
				"RemindTime": "",
				"Remarks": "",
				"AttachmentEntry": "",
				"SettlementProbability": "",
				"AgreementMethod": "",
				"PaymentTerms": "",
				"PriceList": "",
				"SigningDate": null,
				"AmendmentTo": "",
				"Series": 0,
				"DocNum": 0,
				"HandWritten": "",
				"PeriodIndicator": "",
				"PaymentMethod": ""
			};
		}
	};
});
