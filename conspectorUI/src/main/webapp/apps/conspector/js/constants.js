var pubnub = PUBNUB.init({
    publish_key: 'pub-c-ca905ca3-be6e-4a5b-96cd-49dc2312a4e6',
    subscribe_key: 'sub-c-8b324682-73df-11e3-9291-02ee2ddab7fe'
});

app.factory('CONSTANTS', [
	function() {
		return {
			messageDisplayTime: 5000,
			messageDisplayLayout: 'topCenter',
			currentProject: 'conspector',
			appPathname: "",
			sServicePath: "odata.svc/",
			sDefaultRoleNameForNewCompany: "systemAdministrator",
			sAppAbsolutePath: "",
			//to delete
			bIsHybridApplication: false,
			//
			newDeficiencyEN: "New deficiency has been created",
			newDeficiencyFR: "Une nouvelle d\u00E9ficience a \u00E9t\u00E9 ajout\u00E9e",
			updatedDeficiencyEN: "Deficiency has been modified",
			updatedDeficiencyFR: "Une d\u00E9ficience a \u00E9t\u00E9 modifi\u00E9e",
			newCommentEN: "New comment has been added",
			newCommentFR: "Un commentaire a \u00E9t\u00E9 ajout\u00E9",
			newAttachmentEN: "New attachment has been added",
			newAttachmentFR: "Un ficher a \u00E9t\u00E9 ajout\u00E9",
		}
	}
]);