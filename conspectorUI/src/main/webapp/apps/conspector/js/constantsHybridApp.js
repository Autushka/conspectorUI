var oGlobalConstants = {sServicePath: "http://app.conspector.com/odata.svc/"};

app.factory('CONSTANTS', [function() {
	return {
		messageDisplayTime: 5000,
		messageDisplayLayout: 'topCenter',
		currentProject: 'conspector',
		appPathname: "",
		sServicePath: "http://app.conspector.com/odata.svc/",  //http://app.conspector.com/
		sDefaultRoleNameForNewCompany: "systemAdministrator",
		sAppAbsolutePath: "http://app.conspector.com/",
		bIsHybridApplication: true,

		newDeficiencyEN: "New deficiency has been created (mobile)",
		newDeficiencyFR: "Une nouvelle d\u00E9ficience a \u00E9t\u00E9 ajout\u00E9e (mobile)",
		updatedDeficiencyEN: "Deficiency has been modified (mobile)",
		updatedDeficiencyFR: "Une d\u00E9ficience a \u00E9t\u00E9 modifi\u00E9e (mobile)",
		newCommentEN: "New comment has been added (mobile)",
		newCommentFR: "Un commentaire a \u00E9t\u00E9 ajout\u00E9 (mobile)",
		newAttachmentEN: "New attachment has been added (mobile)",
		newAttachmentFR: "Un ficher a \u00E9t\u00E9 ajout\u00E9 (mobile)",		
	}
}]);






