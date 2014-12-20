app.factory('rolesSettings', [
	function() {
		return {
			oInitialViews: {
				systemAdministrator: "#/app/deficienciesList",
				deficiencyManagementUser: "#/app/deficienciesList"
			}
		}
	}
]);