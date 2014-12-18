app.factory('servicesProvider', ['$rootScope', 'ngTableParams', '$translate', 'utilsProvider', 'cacheProvider', 'apiProvider', 'dataProvider', 'rolesSettings', '$cookieStore', '$window',
	function($rootScope, ngTableParams, $translate, utilsProvider, cacheProvider, apiProvider, dataProvider, rolesSettings, $cookieStore, $window) {
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
					this.logLogOut(); // log logout operation
					cacheProvider.cleanAllCache();
					window.location.href = "#/signIn/";
				}, this));
			},

			logSuccessLogIn: function() {
				apiProvider.logEvent({
					sOperation: "login_success",
					sUserName: cacheProvider.oUserProfile.sUserName,
					oContent: {
						sUserName: cacheProvider.oUserProfile.sUserName,
						sRole: cacheProvider.oUserProfile.sCurrentRole
					}
				});
			},

			logLogOut: function() {
				apiProvider.logEvent({
					sOperation: "log_out",
					sUserName: cacheProvider.oUserProfile.sUserName,
					oContent: {
						sUserName: cacheProvider.oUserProfile.sUserName,
						sRole: cacheProvider.oUserProfile.sCurrentRole
					}
				});
			},

			onLogInSuccessHandler: function(sUserName, sPassword) {
				cacheProvider.oUserProfile = apiProvider.getUserProfile(sUserName);
				cacheProvider.oUserProfile.sCurrentPassword = sPassword;
				if (!cacheProvider.oUserProfile.aUserRoles.length) {
					this.logOut(); //cancel login in case of 0 roles assigned to the user
					ustilsProvider.displayMessage($translate.instant("noRoleAssignment"), "error");
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
					ustilsProvider.displayMessage($translate.instant("noRoleAssignment"), "error");
					return;
				}

				if (cacheProvider.oUserProfile.bIsInitialPassword) {
					window.location.href = "#/initialPasswordReset";
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

			constructLogoUrl: function() {
				var sUrl = "rest/file/list/settings/settings/_logo_";
				var oSvc = dataProvider.httpRequest({sPath: sUrl});
				oSvc.then(function(aData) {
					if (aData[0]) {
						$rootScope.sLogoUrl = $window.location.origin + $window.location.pathname + "rest/file/get/" + aData[0].rowId;
					} else {
						$rootScope.sLogoUrl = $window.location.origin + $window.location.pathname + "img/logo_conspector.png";
					}
				});
			},

			createNgTableParams: function(oParameters) {
				var oNgTableParams = new ngTableParams({
					page: 1,
					filterDelay: 100,
					count: 1000
				}, {
					groupBy: oParameters.groupTableBy,
					total: oParameters.oTableDataArrays[oParameters.sSourceDataArrayAttribute].length, // length of data
					getData: function($defer, params) {
						params.settings().filterDelay = 10;
						params.settings().setGroupsInfo();
						params.settings().counts = [50, 500, 1000];
						var oFilteredCategoriesData = [];
						if (params.sorting() === undefined || JSON.stringify(params.sorting()) === JSON.stringify({})) {
							oFilteredCategoriesData = oParameters.oTableDataArrays[oParameters.sSourceDataArrayAttribute];
						} else {
							var aSortingBy = params.orderBy();
							if (oParameters.groupTableBy) {
								aSortingBy.unshift(oParameters.groupTableBy);
							}

							oFilteredCategoriesData = $filter('orderBy')(oParameters.oTableDataArrays[oParameters.sSourceDataArrayAttribute], aSortingBy);
						}

						var sSearchCriteria = "";
						if (params.filter().$) {
							sSearchCriteria = params.filter().$;
							for (var property in params.filter()) {
								if (property.indexOf("$") === 0) {
									delete params.filter().property;
								}
							}
						}

						if (params.filter() !== undefined && JSON.stringify(params.filter()) !== JSON.stringify({})) {
							oFilteredCategoriesData = $filter('filter')(oFilteredCategoriesData, params.filter(), function(actual, expected) {
								actual = actual.toString().toLowerCase();
								expected = expected.toString().toLowerCase();
								if (expected.indexOf("=") === 0) {
									expected = expected.slice(1, expected.length);
									return angular.equals(expected, actual);
								} else {
									if (actual.indexOf(expected) >= 0) {
										return true;
									} else {
										return false;
									}
								}
							});
						}

						if (sSearchCriteria) {
							var sSearchCriteriaLowerCase = sSearchCriteria.toLowerCase();
							var aFilteredData = [];
							var bShouldBeAdded = false;
							var sValue = "";
							for (var i = 0; i < oFilteredCategoriesData.length; i++) {
								bShouldBeAdded = false;
								for (var property in oFilteredCategoriesData[i]) {
									if (typeof oFilteredCategoriesData[i][property] === "string") {
										sValue = oFilteredCategoriesData[i][property].toLowerCase();
										if (sValue.indexOf(sSearchCriteriaLowerCase) >= 0 && property.indexOf("_") !== 0 && property.indexOf("$") !== 0) {
											bShouldBeAdded = true;
										}
									}
									if (typeof oFilteredCategoriesData[i][property] === "number") {
										sValue = oFilteredCategoriesData[i][property].toString();
										if (sValue.indexOf(sSearchCriteriaLowerCase) >= 0 && property.indexOf("_") !== 0 && property.indexOf("$") !== 0) {
											bShouldBeAdded = true;
										}
									}
								}
								if (bShouldBeAdded) {
									aFilteredData.push(oFilteredCategoriesData[i]);
								}
							}
							oFilteredCategoriesData = aFilteredData;
							params.filter().$ = sSearchCriteria;
						}

						params.total(oFilteredCategoriesData.length); // set total for recalc pagination

						if (params.total() < (params.page() - 1) * params.count()) { // fix filtering on the page number > 1
							params.page(1);
						}
						$defer.resolve(oParameters.oTableData[oParameters.sTargerObjectAttribute] = oFilteredCategoriesData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					},
					$scope: oParameters.scope
				});
				return oNgTableParams;
			},
		}
	}
]);