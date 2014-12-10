app.factory('apiProvider', function(dataProvider) {
	return {
		getUserProfile: function(sUserName) {
			var sPath = CONSTANTS.sServicePath + "Users('" + sUserName + "')?$expand=User_RoleDetails/RoleDetails&$format=json";
			var aUserRoles = [];
			var bIsInitialPassword = false;
			var onSuccess = function(oData) {
				bIsInitialPassword = oData.d.bIsInitialPassword;
				for (var i = 0; i < oData.d.User_RoleDetails.results.length; i++) {
					aUserRoles.push(oData.d.User_RoleDetails.results[i].RoleDetails.RoleName);
				}
			}

			dataProvider.ajaxRequest({
				sPath: sPath,
				bAsync: false,
				sRequestType: "GET",
				oEventHandlers: {
					onSuccess: onSuccess
				}
			});

			return {sUserName: sUserName, aUserRoles: aUserRoles, bIsInitialPassword: bIsInitialPassword};
		},
	}
});