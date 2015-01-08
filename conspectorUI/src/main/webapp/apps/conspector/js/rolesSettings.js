app.factory('rolesSettings', [
	function() {
		return {
			oInitialViews: {
				globalAdministrator: "app.deficienciesList",
				systemAdministrator: "app.deficienciesList",
				deficiencyManagementUser: "app.deficienciesList"
			},
			oDisplayedSections: {
				globalAdministrator:{
					deficiencies: true,
					units: true,
					contractors: true,
					clients: true,
					adminPanel: true,
					profileSettings: true					
				},					
				systemAdministrator:{
					deficiencies: true,
					units: true,
					contractors: true,
					clients: true,
					adminPanel: true,
					profileSettings: true
				},
				deficiencyManagementUser:{
					deficiencies: true,
					units: true,
					contractors: true,
					clients: true,
					adminPanel: false,
					profileSettings: true					
				},
			}
		}
	}
]);