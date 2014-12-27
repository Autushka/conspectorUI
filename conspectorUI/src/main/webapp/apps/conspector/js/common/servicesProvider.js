app.factory('servicesProvider', ['$rootScope', 'ngTableParams', '$translate', 'utilsProvider', 'cacheProvider', 'apiProvider', 'dataProvider', 'rolesSettings', '$cookieStore', '$window', '$filter',
	function($rootScope, ngTableParams, $translate, utilsProvider, cacheProvider, apiProvider, dataProvider, rolesSettings, $cookieStore, $window, $filter) {
		return {
			changeLanguage: function() {
				var sCurrentLanguageKey = $translate.use();
				switch (sCurrentLanguageKey) {
					case 'en':
						$translate.use('fr');
						break;
					case 'fr':
						$translate.use('en');
						break;
				}
				$rootScope.$emit('languageChanged');
			},

			logIn: function(oParameters, bRememberUserName) {
				var SHA512 = new Hashes.SHA512;
				var sCurrentPassword = oParameters.password;
				oParameters.password = SHA512.hex(oParameters.password);
				var oSignInSrv = dataProvider.httpRequest({
					sPath: "jsp/account/login.jsp",
					sRequestType: "POST",
					oUrlParameters: oParameters,
					bShowSpinner: true
				});

				oSignInSrv.then($.proxy(function(oData) {
					var bNoErrorMessages = this.messagesHandler(oData.messages);
					if (bNoErrorMessages) {
						if (bRememberUserName) {
							$cookieStore.put("userName", {
								sUserName: oParameters.userName
							});
						} else {
							$cookieStore.remove("userName");
						}
						this.onLogInSuccessHandler(oParameters.userName, sCurrentPassword);
					}
				}, this));
			},

			logOut: function() {
				var oSignOutSrv = dataProvider.httpRequest({
					sPath: "jsp/initializeSessionVariables.jsp",
					oUrlParameters: {}
				});
				oSignOutSrv.then($.proxy(function(oData) {
					if (cacheProvider.oUserProfile.sUserName) {
						this.logLogOut(); // log logout operation
					}
					cacheProvider.cleanAllCache();
					window.location.href = "#/signIn/";
				}, this));
			},

			logSuccessLogIn: function() {
				apiProvider.logEvent({
					oData: {
						GeneralAttributes: {},
						OperationName: "login_success",
						OperationContent: {
							sUserName: cacheProvider.oUserProfile.sUserName,
							sRole: cacheProvider.oUserProfile.sCurrentRole
						}
					}
				});
			},

			logLogOut: function() {
				apiProvider.logEvent({
					oData: {
						GeneralAttributes: {},
						OperationName: "log_out",
						OperationContent: {
							sUserName: cacheProvider.oUserProfile.sUserName,
							sRole: cacheProvider.oUserProfile.sCurrentRole
						}
					}
				});
			},

			onLogInSuccessHandler: function(sUserName, sPassword) {
				cacheProvider.oUserProfile = apiProvider.getUserProfile(sUserName);
				cacheProvider.oUserProfile.sCurrentPassword = sPassword;
				if (!cacheProvider.oUserProfile.aUserRoles.length) {
					this.logOut(); //cancel login in case of 0 roles assigned to the user
					utilsProvider.displayMessage({
						sText: $translate.instant('global_noRoleAssignment'),
						sType: "error"
					});
					return;
				}

				if (cacheProvider.oUserProfile.bIsInitialPassword) {
					window.location.href = "#/initialPasswordReset";
					return;
				}
				cacheProvider.oUserProfile.sPassword = ""; //current password needed onlyl for initialPassword scenario
				if (cacheProvider.oUserProfile.aUserRoles.length === 1) {
					cacheProvider.oUserProfile.sCurrentRole = cacheProvider.oUserProfile.aUserRoles[0].RoleName;
					apiProvider.setCurrentRole(cacheProvider.oUserProfile.sCurrentRole); //current role is cached here				
					// menu setup for the current role should happen here
					this.logSuccessLogIn(); //log login_success operation 
					window.location.href = rolesSettings.oInitialViews[cacheProvider.oUserProfile.sCurrentRole]; //navigation to the initial view for the role
				} else {
					window.location.href = "#/roleSelection";
					return;
				}
			},

			onF5WithCurrentUserHandler: function(sUserName) {
				var sCurrentRole = "";
				cacheProvider.oUserProfile = apiProvider.getUserProfile(sUserName);

				if (!cacheProvider.oUserProfile.aUserRoles.length) {
					this.logOut(); //cancel login in case of 0 roles assigned to the user
					ustilsProvider.displayMessage({
						sText: $translate.instant('global_noRoleAssignment'),
						sType: "error"
					});
					return;
				}

				if (cacheProvider.oUserProfile.bIsInitialPassword) {
					window.location.href = "#/signIn/";//"#/initialPasswordReset"; here old password needed to reset initial password
					return;
				}

				sCurrentRole = apiProvider.getCurrentRole();
				if (!sCurrentRole) {
					window.location.href = "#/roleSelection";
				} else {
					cacheProvider.oUserProfile.sCurrentRole = sCurrentRole;
					// menu setup for the current role should happen here
				}
			},

			messagesHandler: function(aMessages) {
				var bNoErrorMessages = true;

				for (var i = 0; i < aMessages.length; i++) {
					var sMessageCode = aMessages[i].messageCode.toString();
					var sMessageText = $translate.instant("m" + aMessages[i].messageCode);
					switch (sMessageCode[i].substring(0, 1)) { // 1 - success; 2 - warning; 3 - error;
						case '1': // success
							utilsProvider.displayMessage({
								sText: sMessageText,
								sType: 'success'
							});
							break;
						case '2': // error
							utilsProvider.displayMessage({
								sText: sMessageText,
								sType: 'error'
							});
							bNoErrorMessages = false;
							break;
						case '3': // warning
							utilsProvider.displayMessage({
								sText: sMessageText,
								sType: 'warning'
							});
							break;
					}
				}
				return bNoErrorMessages;
			},

			costructUploadUrl: function(oParameters) {
				var sReturnUrl = ""
				var onSuccess = function(sUrl) {
					sReturnUrl = sUrl;
				};

				dataProvider.ajaxRequest({
					sPath: oParameters.sPath,
					sRequestType: "GET",
					bAsync: false,
					oData: {},
					oEventHandlers: {
						onSuccess: function(sUrl) {
							//return sUrl;
							onSuccess(sUrl);
						}
					}
				});
				return sReturnUrl;
			},

			deleteFileAttachment: function(sGuid) {
				var sUrl = "rest/file/delete/" + sGuid;
				dataProvider.ajaxRequest({
					sPath: sUrl,
					sRequestType: "GET",
					bAsync: false,
					oData: {},
					oEventHandlers: {
						onSuccess: function(sUrl) {
							utilsProvider.displayMessage({
								sText: $translate.instant("global_successOperation"),
								sType: 'success'
							});
						}
					}
				});
			},

			constructLogoUrl: function() {
				var sUrl = "rest/file/list/settings/settings/_logo_";
				var oSvc = dataProvider.httpRequest({
					sPath: sUrl
				});
				oSvc.then(function(aData) {
					if (aData[0]) {
						$rootScope.sLogoUrl = $window.location.origin + $window.location.pathname + "rest/file/get/" + aData[0].guid;
					} else {
						$rootScope.sLogoUrl = $window.location.origin + $window.location.pathname + "img/logo_conspector.png";
					}
				});
			},

			constructDependentMultiSelectArray: function(oParameters) { //oDependentArrayWrapper, oParentArrayWrapper, oNewParentItemArrayWrapper, sNameEN, sNameFR, sDependentKey, sParentKey, sTargetArrayNameInParent
				var aMultiSelectArray = [];
				var oMultiSelectItem = {}
				for (var i = 0; i < oParameters.oDependentArrayWrapper.aData.length; i++) {
					oMultiSelectItem = {};
					if (oParameters.oDependentArrayWrapper.aData[i][oParameters.sNameEN] || oParameters.oDependentArrayWrapper.aData[i][oParameters.sNameFR]) {
						oMultiSelectItem.name = $translate.use() === "en" ? oParameters.oDependentArrayWrapper.aData[i][oParameters.sNameEN] : oParameters.oDependentArrayWrapper.aData[i][oParameters.sNameFR];
						if (!oMultiSelectItem.name) {
							oMultiSelectItem.name = oParameters.oDependentArrayWrapper.aData[i][oParameters.sNameEN];
						}
					}
					if(oParameters.oDependentArrayWrapper.aData[i][oParameters.sDependentIconKey]){
						oMultiSelectItem.icon = "<img src='" + $window.location.origin + $window.location.pathname + "rest/file/get/";
						oMultiSelectItem.icon =  oMultiSelectItem.icon + oParameters.oDependentArrayWrapper.aData[i][oParameters.sDependentIconKey] + "' style='width: 24px; height: 24px;'/>"
					}

					oMultiSelectItem[oParameters.sDependentKey] = oParameters.oDependentArrayWrapper.aData[i][oParameters.sDependentKey];
					aMultiSelectArray.push(oMultiSelectItem);
				};

				oParameters.oNewParentItemArrayWrapper.aData = angular.copy(aMultiSelectArray);
				if (oParameters.oNewParentItemArrayWrapper.aData[0]) {
					oParameters.oNewParentItemArrayWrapper.aData[0].ticked = true;
				}

				for (var i = 0; i < oParameters.oParentArrayWrapper.aData.length; i++) {
					var aArray = [];
					var aArrayItem = {};
					var bMatchFound = false;
					for (var j = 0; j < aMultiSelectArray.length; j++) {
						aArrayItem = {};
						angular.copy(aMultiSelectArray[j], aArrayItem);
						if (oParameters.oParentArrayWrapper.aData[i][oParameters.sParentKey] === aMultiSelectArray[j][oParameters.sDependentKey]) {
							aArrayItem.ticked = true;
							bMatchFound = true;
						}
						aArray.push(aArrayItem);
					}
					if (!bMatchFound && aArray[0]) {
						aArray[0].ticked = true;
					}
					oParameters.oParentArrayWrapper.aData[i][oParameters.sTargetArrayNameInParent] = aArray;
				}
			},

			createNgTable: function(oParameters) {
				var oTableParams = new ngTableParams({
					page: 1, // show first page
					count: 10000, // count per page
					filterDelay: 250,
					sorting: oParameters.oInitialSorting
				}, {
					total: oParameters.oInitialDataArrayWrapper.aData.length,
					sDisplayedDataArrayName: oParameters.sDisplayedDataArrayName,
					getData: function($defer, params) {
						var aInitialData = oParameters.oInitialDataArrayWrapper.aData; // need a wrapper for the array here to be able to pass values by reference
						var aSortedData = params.sorting() ?
							$filter('orderBy')(aInitialData, params.orderBy()) :
							aInitialData;

						var aFilteredData = params.filter() ? $filter('filter')(aSortedData, params.filter()) : aSortedData;

						$defer.resolve(aFilteredData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					},
					counts: []
				});
				return oTableParams;
			},
		}
	}
]);