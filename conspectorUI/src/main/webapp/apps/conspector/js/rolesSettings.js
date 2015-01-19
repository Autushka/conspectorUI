app.factory('rolesSettings', [

	function() {
		return {
			oInitialViews: {
				globalAdministrator: "app.deficienciesList",
				systemAdministrator: "app.deficienciesList",
				managementUser: "app.deficienciesList"
			},
			oDisplayedSections: {
				globalAdministrator: {
					deficiencies: true,
					units: true,
					contractors: true,
					clients: true,
					contacts: true,
					adminPanel: true,
					profileSettings: true
				},
				systemAdministrator: {
					deficiencies: true,
					units: true,
					contractors: true,
					clients: true,
					contacts: true,
					adminPanel: true,
					profileSettings: true
				},
				managementUser: {
					deficiencies: true,
					units: true,
					contractors: true,
					clients: true,
					contacts: true,
					adminPanel: false,
					profileSettings: true
				},
			}
		}
	}
]);