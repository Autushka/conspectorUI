app.factory('servicesProvider', ['$rootScope', '$state', 'ngTableParams', '$translate', 'utilsProvider', 'cacheProvider', 'apiProvider', 'dataProvider', 'rolesSettings', '$cookieStore', '$window', '$filter', '$mdDialog',
	function($rootScope, $state, ngTableParams, $translate, utilsProvider, cacheProvider, apiProvider, dataProvider, rolesSettings, $cookieStore, $window, $filter, $mdDialog) {
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
				var sPath = "rest/system/initializeSessionVariables"; 
				var onSuccess = $.proxy(function() {
					if (cacheProvider.oUserProfile.sUserName) {
						this.logLogOut(); // log logout operation
					}
					cacheProvider.cleanAllCache();
					$state.go("signIn");
				}, this);

				dataProvider.ajaxRequest({
					sPath: sPath,
					bAsync: false,
					sRequestType: "GET",
					oEventHandlers: {
						onSuccess: onSuccess
					}
				});
			},

			logSuccessLogIn: function() {
				apiProvider.logEvent({
					oData: {
						GeneralAttributes: {},
						OperationName: "login_success",
						OperationContent: {
							sUserName: cacheProvider.oUserProfile.sUserName,
							sCompany: cacheProvider.oUserProfile.sCurrentCompany,
							sRole: cacheProvider.oUserProfile.sCurrentRole,
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
							sCompany: cacheProvider.oUserProfile.sCurrentCompany,
							sRole: cacheProvider.oUserProfile.sCurrentRole
						}
					}
				});
			},

			onNoDefaultViewForTheRole: function() {
				this.logOut(); //cancel login in case of 0 roles assigned to the user
				utilsProvider.displayMessage({
					sText: $translate.instant('global_noDefaultViewForTheRole'),
					sType: "error"
				});
			},

			setUserPhasesForCurrentCompany: function(sCurrentCompany) {
				var aUserPhasesForCurrentCompany = [];
				cacheProvider.oUserProfile.aUserPhases = angular.copy(cacheProvider.oUserProfile.aAllUserPhases);
				for (var i = 0; i < cacheProvider.oUserProfile.aUserPhases.length; i++) {
					if (cacheProvider.oUserProfile.aUserPhases[i].ProjectDetails.CompanyName === sCurrentCompany) {
						aUserPhasesForCurrentCompany.push(cacheProvider.oUserProfile.aUserPhases[i]);
					}
				}

				cacheProvider.oUserProfile.aAllUserPhases = angular.copy(cacheProvider.oUserProfile.aUserPhases); //aAllUserRoles will always contain all user role ignoring current company; needed for switch compmany option
				cacheProvider.oUserProfile.aUserPhases = angular.copy(aUserPhasesForCurrentCompany);
			},

			checkUserRolesAssignment: function(sCurrentCompany) {
				var aUserRolesForCurrentCompany = [];
				cacheProvider.oUserProfile.aUserRoles = angular.copy(cacheProvider.oUserProfile.aAllUserRoles);
				for (var i = 0; i < cacheProvider.oUserProfile.aUserRoles.length; i++) {
					if (cacheProvider.oUserProfile.aUserRoles[i].CompanyName === sCurrentCompany) {
						aUserRolesForCurrentCompany.push(cacheProvider.oUserProfile.aUserRoles[i]);
					}
				}
				cacheProvider.oUserProfile.aAllUserRoles = angular.copy(cacheProvider.oUserProfile.aUserRoles); //aAllUserRoles will always contain all user role ignoring current company; needed for switch compmany option
				cacheProvider.oUserProfile.aUserRoles = angular.copy(aUserRolesForCurrentCompany);

				if (!cacheProvider.oUserProfile.aUserRoles.length) {
					this.logOut(); //cancel login in case of 0 roles assigned to the user
					utilsProvider.displayMessage({
						sText: $translate.instant('global_noRoleAssignment'),
						sType: "error"
					});
					return;
				}

				if (cacheProvider.oUserProfile.aUserRoles.length === 1) {
					sCurrentRole = cacheProvider.oUserProfile.aUserRoles[0].RoleName;
					if (!rolesSettings.oInitialViews[sCurrentRole]) {
						this.onNoDefaultViewForTheRole();
						return;
					}
					cacheProvider.oUserProfile.sCurrentRole = sCurrentRole;
					$rootScope.sCurrentRole = sCurrentRole;
					apiProvider.setCurrentRole(sCurrentRole); //current role is cached here				
					// menu setup for the current role should happen here
					this.logSuccessLogIn(); //log login_success operation 
					$state.go(rolesSettings.oInitialViews[sCurrentRole]);//navigation to the initial view for the role
					return;
				} else {
					$state.go("roleSelection");
					return;
				}
			},

			onLogInSuccessHandler: function(sUserName, sPassword) {
				var sCurrentCompany = "";
				var sCurrentRole = "";
				cacheProvider.oUserProfile = apiProvider.getUserProfile(sUserName);
				cacheProvider.oUserProfile.sCurrentPassword = sPassword;

				if (cacheProvider.oUserProfile.bIsInitialPassword) {
					$state.go("initialPasswordReset");
					return;
				}
				cacheProvider.oUserProfile.sPassword = ""; //current password needed only for initialPassword scenario

				if (!cacheProvider.oUserProfile.aUserCompanies.length) {
					this.logOut(); //cancel login in case of 0 roles assigned to the user
					utilsProvider.displayMessage({
						sText: $translate.instant('global_noCompanyAssignment'),
						sType: "error"
					});
					return;
				}
				if (cacheProvider.oUserProfile.aUserCompanies.length === 1) {
					sCurrentCompany = cacheProvider.oUserProfile.aUserCompanies[0].CompanyName;
					cacheProvider.oUserProfile.sCurrentCompany = sCurrentCompany;
					apiProvider.setCurrentCompany(sCurrentCompany);
					this.setUserPhasesForCurrentCompany(sCurrentCompany);
					this.checkUserRolesAssignment(sCurrentCompany);
				} else {
					$state.go("companySelection");
					return;
				}
			},

			onF5WithCurrentUserHandler: function(sUserName) {
				var sCurrentCompany = "";
				var sCurrentRole = "";
				var aUserRolesForCurrentCompany = [];
				cacheProvider.oUserProfile = apiProvider.getUserProfile(sUserName);				

				if (cacheProvider.oUserProfile.bIsInitialPassword) {
					$state.go("signIn");//here old password needed to reset initial password
					return;
				}

				if (!cacheProvider.oUserProfile.aUserCompanies.length) {
					this.logOut(); //cancel login in case of 0 roles assigned to the user
					utilsProvider.displayMessage({
						sText: $translate.instant('global_noCompanyAssignment'),
						sType: "error"
					});
					return;
				}

				sCurrentCompany = apiProvider.getCurrentCompany();
				if (!sCurrentCompany) {
					$state.go("companySelection");
					return;
				} else {
					cacheProvider.oUserProfile.sCurrentCompany = sCurrentCompany;
					this.setUserPhasesForCurrentCompany(sCurrentCompany);
				}
				sCurrentRole = apiProvider.getCurrentRole();
				if (!sCurrentRole) {
					$state.go("roleSelection");
					return;

				} else {
					cacheProvider.oUserProfile.sCurrentRole = sCurrentRole;
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

			getUserPhasesGuids: function() {
				var aUserPhasesGuids = [];
				for (var i = 0; i < cacheProvider.oUserProfile.aUserPhases.length; i++) {
					aUserPhasesGuids.push(cacheProvider.oUserProfile.aUserPhases[i].Guid);
				}
				return aUserPhasesGuids;
			},

			constructGlobalProjectPhaseSelection: function() { //based on users phases construct array of projects with phases
				var aUserProjectsWithPhases = [];
				var bMatchFound = false;
				var iMatchFoundAt = 0;
				var aUserPhases = angular.copy(cacheProvider.oUserProfile.aUserPhases);

				for (var i = 0; i < aUserPhases.length; i++) {
					bMatchFound = false;
					iMatchFoundAt = 0;
					for (var j = 0; j < aUserProjectsWithPhases.length; j++) {
						if (aUserProjectsWithPhases[j].Guid === aUserPhases[i].ProjectDetails.Guid) {
							bMatchFound = true;
							iMatchFoundAt = j;
							break;
						}
					}
					if (!bMatchFound) {
						aUserPhases[i].ProjectDetails.PhaseDetails = {
							results: []
						};
						aUserPhases[i].ProjectDetails.PhaseDetails.results.push(aUserPhases[i]);
						aUserProjectsWithPhases.push(aUserPhases[i].ProjectDetails);
					} else {
						aUserProjectsWithPhases[iMatchFoundAt].PhaseDetails.results.push(aUserPhases[i]);
					}
				}

				aUserProjectsWithPhases = $filter('orderBy')(aUserProjectsWithPhases, ["_sortingSequence"]);

				for (var i = 0; i < aUserProjectsWithPhases.length; i++) {
					aUserProjectsWithPhases[i].PhaseDetails.results = $filter('orderBy')(aUserProjectsWithPhases[i].PhaseDetails.results, ["_sortingSequence"]);
				}
				return aUserProjectsWithPhases;
			},

			constructGlobalProjectPhaseData: function() {
				var aSelectedPhases = [];
				aSelectedPhases = angular.copy(cacheProvider.oUserProfile.aUserPhases);

				var oGlobalProjectPhaseWrapper = {
					aData: aSelectedPhases, // phases that will be ticked 
					aPhases: []
				};

				var aUserProjectsWithPhases = [];


				aUserProjectsWithPhases = this.constructGlobalProjectPhaseSelection(); //based on users phases construct array of projects with phases

				var aUserPhasesGuids = this.getUserPhasesGuids(); //users phases guids

				this.constructDependentMultiSelectArray({
					oDependentArrayWrapper: {
						aData: aUserProjectsWithPhases
					},
					sSecondLevelAttribute: "PhaseDetails",
					sSecondLevelNameEN: "NameEN",
					sSecondLevelNameFR: "NameFR",
					oParentArrayWrapper: oGlobalProjectPhaseWrapper,
					oNewParentItemArrayWrapper: {
						aData: []
					},
					sNameEN: "NameEN",
					sNameFR: "NameFR",
					sDependentKey: "Guid",
					aParentKeys: aUserPhasesGuids,
					sTargetArrayNameInParent: "aPhases"
				});

				if (oGlobalProjectPhaseWrapper.aData[0]) {
					return oGlobalProjectPhaseWrapper.aData[0].aPhases;
				} else {
					return [];
				}
			},

			constructLogoUrl: function() {
				var sUrl = "rest/file/list/companyDependentSettings/" + cacheProvider.oUserProfile.sCurrentCompany + "/_logo_";
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

			constructDependentMultiSelectArray: function(oParameters) { //oDependentArrayWrapper, oParentArrayWrapper, sSecondLevelAttribute, oNewParentItemArrayWrapper, sNameEN, sNameFR, sSecondLevelNameEN, sSecondLevelNameFR, sDependentKey, sParentKey, aParentKeys, sTargetArrayNameInParent
				var aMultiSelectArray = [];
				var oMultiSelectItem = {}
				for (var i = 0; i < oParameters.oDependentArrayWrapper.aData.length; i++) {
					if (!oParameters.sSecondLevelAttribute) {
						oMultiSelectItem = {};
						if (oParameters.oDependentArrayWrapper.aData[i][oParameters.sNameEN] || oParameters.oDependentArrayWrapper.aData[i][oParameters.sNameFR]) {
							oMultiSelectItem.name = $translate.use() === "en" ? oParameters.oDependentArrayWrapper.aData[i][oParameters.sNameEN] : oParameters.oDependentArrayWrapper.aData[i][oParameters.sNameFR];
							if (!oMultiSelectItem.name) {
								oMultiSelectItem.name = oParameters.oDependentArrayWrapper.aData[i][oParameters.sNameEN];
							}
						}
						if (oParameters.oDependentArrayWrapper.aData[i][oParameters.sDependentIconKey]) {
							oMultiSelectItem.icon = "<img src='" + $window.location.origin + $window.location.pathname + "rest/file/get/";
							oMultiSelectItem.icon = oMultiSelectItem.icon + oParameters.oDependentArrayWrapper.aData[i][oParameters.sDependentIconKey] + "' style='width: 24px; height: 24px;'/>"
						}

						oMultiSelectItem[oParameters.sDependentKey] = oParameters.oDependentArrayWrapper.aData[i][oParameters.sDependentKey];
						aMultiSelectArray.push(oMultiSelectItem);
					} else {
						oMultiSelectItem = {};
						oMultiSelectItem.multiSelectGroup = true;
						var sName = "";
						if (oParameters.oDependentArrayWrapper.aData[i][oParameters.sNameEN] || oParameters.oDependentArrayWrapper.aData[i][oParameters.sNameFR]) {
							sName = $translate.use() === "en" ? oParameters.oDependentArrayWrapper.aData[i][oParameters.sNameEN] : oParameters.oDependentArrayWrapper.aData[i][oParameters.sNameFR];
							if (!sName) {
								sName = oParameters.oDependentArrayWrapper.aData[i][oParameters.sNameEN];
							}
						}
						oMultiSelectItem.name = '<strong>' + sName + '</strong>';
						aMultiSelectArray.push(oMultiSelectItem);
						for (var j = 0; j < oParameters.oDependentArrayWrapper.aData[i][oParameters.sSecondLevelAttribute].results.length; j++) {
							oMultiSelectItem = {};
							if (oParameters.oDependentArrayWrapper.aData[i][oParameters.sSecondLevelAttribute].results[j][oParameters.sSecondLevelNameEN] || oParameters.oDependentArrayWrapper.aData[i][oParameters.sSecondLevelAttribute].results[j][oParameters.sSecondLevelNameFR]) {
								oMultiSelectItem.name = $translate.use() === "en" ? oParameters.oDependentArrayWrapper.aData[i][oParameters.sSecondLevelAttribute].results[j][oParameters.sSecondLevelNameEN] : oParameters.oDependentArrayWrapper.aData[i][oParameters.sSecondLevelAttribute].results[j][oParameters.sSecondLevelNameFR];
								if (!oMultiSelectItem.name) {
									oMultiSelectItem.name = oParameters.oDependentArrayWrapper.aData[i][oParameters.sSecondLevelAttribute].results[j][oParameters.sSecondLevelNameEN];
								}
								oMultiSelectItem.fullName = '<strong>' + sName + '</strong>' + ': ' + oMultiSelectItem.name;
							}
							oMultiSelectItem[oParameters.sDependentKey] = oParameters.oDependentArrayWrapper.aData[i][oParameters.sSecondLevelAttribute].results[j][oParameters.sDependentKey];
							aMultiSelectArray.push(oMultiSelectItem);
						}
						oMultiSelectItem = {};
						oMultiSelectItem.multiSelectGroup = false;
						aMultiSelectArray.push(oMultiSelectItem);
					}
				};

				oParameters.oNewParentItemArrayWrapper.aData = angular.copy(aMultiSelectArray);
				//Initial value ticking (first one in the list)
				// if (!oParameters.sSecondLevelAttribute) {
				// 	if (oParameters.oNewParentItemArrayWrapper.aData[0]) {
				// 		oParameters.oNewParentItemArrayWrapper.aData[0].ticked = true;
				// 	}
				// } else {
				// 	for (var i = 0; i < oParameters.oNewParentItemArrayWrapper.aData.length; i++) {
				// 		if (oParameters.oNewParentItemArrayWrapper.aData[i].multiSelectGroup === undefined) {
				// 			oParameters.oNewParentItemArrayWrapper.aData[i].ticked = true;
				// 			break;
				// 		}
				// 	}
				// }

				for (var i = 0; i < oParameters.oParentArrayWrapper.aData.length; i++) {
					var aArray = [];
					var aArrayItem = {};
					var bMatchFound = false;
					for (var j = 0; j < aMultiSelectArray.length; j++) {
						aArrayItem = {};
						angular.copy(aMultiSelectArray[j], aArrayItem);

						if (!oParameters.aParentKeys) {
							if (oParameters.oParentArrayWrapper.aData[i][oParameters.sParentKey] === aMultiSelectArray[j][oParameters.sDependentKey]) {
								aArrayItem.ticked = true;
								bMatchFound = true;
							}
						} else {
							for (var k = 0; k < oParameters.aParentKeys.length; k++) {
								if (aMultiSelectArray[j][oParameters.sDependentKey] === oParameters.aParentKeys[k]) {
									aArrayItem.ticked = true;
									bMatchFound = true;
								}
							};
						}
						aArray.push(aArrayItem);
					}
					//Initial value ticking (first one in the list)
					// if (!bMatchFound) {
					// 	if (!oParameters.sSecondLevelAttribute && aArray[0]) {
					// 		aArray[0].ticked = true;
					// 	} else {
					// 		for (var j = 0; j < aArray.length; j++) {
					// 			if (aArray[j].multiSelectGroup === undefined) {
					// 				aArray[j].ticked = true;
					// 				break;
					// 			}
					// 		}
					// 	}
					// }
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

			showConfirmationPopup: function(oParameters) {
				var confirm = $mdDialog.confirm()
					.title(oParameters.sHeader)
					.content(oParameters.sContent)
					.ok(oParameters.sOk)
					.cancel(oParameters.sCancel)
					.targetEvent(oParameters.event);
				$mdDialog.show(confirm).then(function() {
					oParameters.onOk();
				}, function() {
					if (oParameters.onCancel) {
						oParameters.onCancel();
					}
				});
			}
		}
	}
]);