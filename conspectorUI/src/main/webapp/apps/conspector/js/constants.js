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
		}
	}
]);