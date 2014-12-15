app.factory('apiProvider', ['dataProvider', 'CONSTANTS',
	function(dataProvider, CONSTANTS) {
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

				dataProvider.ajaxRequest({ //TODO: add busy indicator here as well if needed
					sPath: sPath,
					bAsync: false,
					sRequestType: "GET",
					oEventHandlers: {
						onSuccess: onSuccess
					}
				});
				return {
					sUserName: sUserName,
					aUserRoles: aUserRoles,
					bIsInitialPassword: bIsInitialPassword
				};
			},

			getCurrentUserName: function() {
				var sPath = "jsp/account/getCurrentUserName.jsp";
				var sCurrentUserName;

				var onSuccess = function(sData) {
					sCurrentUserName = sData;
				}

				dataProvider.ajaxRequest({
					sPath: sPath,
					bAsync: false,
					sRequestType: "GET",
					oEventHandlers: {
						onSuccess: onSuccess
					}
				});

				return sCurrentUserName;
			},

			getCurrentRole: function() {
				var sPath = "jsp/account/getCurrentRole.jsp";
				var sCurrentRole;

				var onSuccess = function(sData) {
					sCurrentRole = sData;
				}

				dataProvider.ajaxRequest({
					sPath: sPath,
					bAsync: false,
					sRequestType: "GET",
					oEventHandlers: {
						onSuccess: onSuccess
					}
				});

				return sCurrentRole;
			},

			setCurrentRole: function(sRole) {
				var oSrv = dataProvider.httpRequest({
					sPath: "jsp/account/setCurrentRole.jsp",
					sRequestType: "POST",
					oUrlParameters: {role: sRole},
					bShowSpinner: false
				});
			},
		}
	}
]);