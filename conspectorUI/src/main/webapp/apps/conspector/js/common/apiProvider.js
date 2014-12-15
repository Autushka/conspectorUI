app.factory('apiProvider', ['dataProvider', 'CONSTANTS', '$q',
	function(dataProvider, CONSTANTS, $q) {
		return {
			getUserProfile: function(sUserName) {
				var sPath = CONSTANTS.sServicePath + "Users('" + sUserName + "')?$expand=User_RoleDetails/RoleDetails&$format=json";
				var aUserRoles = [];
				var bIsInitialPassword = false;
				var onSuccess = function(oData) {
					bIsInitialPassword = oData.d.IsPasswordInitial;
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
					oUrlParameters: {
						role: sRole
					},
					bShowSpinner: false
				});
			},

			changeUserPassword: function(oData) {
				var deffered = $q.defer();

				var oSrv = dataProvider.httpRequest({
					sPath: "jsp/account/changeProfileData.jsp",
					oUrlParameters: oData,
					sRequestType: "POST",
					bShowSpinner: true,
					bShowSuccessMessage: false,
					bShowErorrMessage: false
				});

				oSrv.then(function(oData) {
					deffered.resolve(oData);
				});

				return deffered.promise;
			},

			updateUser: function(oParameters) {
				var deffered = $q.defer();

				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "Users",
					sKey: oParameters.sKey,
					oData: oParameters.oData,
				});

				oSvc.then(function(oData) {
					deffered.resolve(oData);
				});
				return deffered.promise;
			}
		}
	}
]);