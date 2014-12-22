app.factory('rolesSettings', [
	function() {
		return {
			oInitialViews: {
				systemAdministrator: "#/app/deficienciesList",
				deficiencyManagementUser: "#/app/deficienciesList"
			},
			oDisplayedSections: {
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
				}
			}
		}
	}
]);