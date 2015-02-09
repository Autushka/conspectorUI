app.factory('servicesProvider', ['$rootScope', '$state', 'ngTableParams', '$translate', 'utilsProvider', 'cacheProvider', 'apiProvider', 'dataProvider', 'rolesSettings', '$cookieStore', '$window', '$filter', '$mdDialog', '$upload',
	function($rootScope, $state, ngTableParams, $translate, utilsProvider, cacheProvider, apiProvider, dataProvider, rolesSettings, $cookieStore, $window, $filter, $mdDialog, $upload) {
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
				var oSrv = {};
				var SHA512 = new Hashes.SHA512;
				oParameters.password = SHA512.hex(oParameters.password);

				var sPath = "rest/account/login/" + oParameters.userName + "/" + oParameters.password;
				var onSuccess = $.proxy(function(oData) {
					var bNoErrorMessages = this.messagesHandler(oData.messages);
					if (bNoErrorMessages) {
						if (bRememberUserName) {
							$cookieStore.put("userName", {
								sUserName: oParameters.userName
							});
						} else {
							$cookieStore.remove("userName");
						}
						this.onLogInSuccessHandler(oParameters.userName);
					}
				}, this);

				oSrv = dataProvider.httpRequest({
					sPath: sPath,
					bShowSpinner: true,
					sRequestType: "GET",
				});

				oSrv.then(function(oData) {
					onSuccess(oData);
				});
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
				var bCanContinue = false;
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
					bCanContinue = rolesSettings.setCurrentRole(sCurrentRole);
					if (!bCanContinue) {
						this.logOut();
						return;
					}
					this.logSuccessLogIn(); //log login_success operation 
					$state.go(rolesSettings.getRolesInitialState(sCurrentRole)); //navigation to the initial view for the role
					return;
				} else {
					$state.go("roleSelection");
					return;
				}
			},

			onLogInSuccessHandler: function(sUserName) {
				var sCurrentCompany = "";
				var sCurrentRole = "";
				cacheProvider.oUserProfile = apiProvider.getUserProfile(sUserName);

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
					$state.go("signIn"); //here old password needed to reset initial password
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
					//cacheProvider.oUserProfile.sCurrentRole = sCurrentRole;
					rolesSettings.setCurrentRole(sCurrentRole);
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

			uploadAttachmentsForEntity: function(oParameters) {
				var oRequestData = {
					__batchRequests: []
				};
				var aData = [];
				var oData = {};
				var sFileMetadataSetGuid = "";
				var oSrv = {};

				var uploadFiles = $.proxy(function(sFileMetadataSetGuid) {
					var iCounter = 0; //needed because files are sent async
					for (var i = 0; i < oParameters.aFiles.length; i++) {
						var file = oParameters.aFiles[i];
						var sPath = this.costructUploadUrl({
							sPath: "rest/file/createUploadUrlWithFileMetadataSetGuid/Deficiency/" + oParameters.sParentEntityGuid + "/_attachments_/" + sFileMetadataSetGuid,
						});
						var oUpload = $upload.upload({
							url: sPath,
							file: file,
						});

						oUpload.success(function(){
							iCounter++;
							if (iCounter === (oParameters.aFiles.length)) {
								// console.log("Total images: " + oParameters.aFiles.length);
								// console.log("Updated for Index: " + iCounter);
								oUpload.success(oParameters.onSuccess);
							}
						});
					}
				}, this);

				if (!oParameters.sParentEntityFileMetadataSetGuid) {
					sFileMetadataSetGuid = utilsProvider.generateGUID();
					oData = {
						requestUri: "FileMetadataSets",
						method: "POST",
						data: {
							Guid: sFileMetadataSetGuid,
							GeneralAttributes: {
								IsDeleted: false
							},
							LastModifiedAt: utilsProvider.dateToDBDate(new Date())
						}
					};

					aData.push(oData);

					oData = {
						requestUri: "Tasks('" + oParameters.sParentEntityGuid + "')",
						method: "PUT",
						data: {
							FileMetadataSetGuid: sFileMetadataSetGuid
						}
					};

					aData.push(oData);

					dataProvider.constructChangeBlockForBatch({
						oRequestData: oRequestData,
						aData: aData
					});

					oSrv = dataProvider.batchRequest({
						oRequestData: oRequestData,
						//bShowSpinner: oParameters.bShowSpinner,
						//bShowSuccessMessage: oParameters.bShowSuccessMessage,
						//bShowErrorMessage: oParameters.bShowErrorMessage,
					});

					var onFileMetadaSetCreated = function(oData) {
						$rootScope.sFileMetadataSetGuid = oData.Guid;
						$rootScope.sFileMetadataSetLastModifiedAt = oData.LastModifiedAt;
						uploadFiles(sFileMetadataSetGuid);
					}

					oSrv.then(function(aData) {
						onFileMetadaSetCreated(aData[0].__changeResponses[0].data)
					});
				} else {
					uploadFiles(oParameters.sParentEntityFileMetadataSetGuid);
				}
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

			constructUserProjectsPhases: function() { //based on users phases construct array of projects with phases
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

			constructUserProjectsPhasesForMultiSelect: function(oParameters) {
				var aUserPhases = [];
				aUserPhases = angular.copy(cacheProvider.oUserProfile.aUserPhases);

				var oUserProjectsPhasesWrapper = {
					aData: aUserPhases,
					aPhases: []
				};

				var aUserProjectsWithPhases = [];

				aUserProjectsWithPhases = this.constructUserProjectsPhases(); //based on users phases construct array of projects with phases

				var aUserPhasesGuids = oParameters.aSelectedPhases; // phases that will be ticked 

				this.constructDependentMultiSelectArray({
					oDependentArrayWrapper: {
						aData: aUserProjectsWithPhases
					},
					sSecondLevelAttribute: "PhaseDetails",
					sSecondLevelNameEN: "NameEN",
					sSecondLevelNameFR: "NameFR",
					oParentArrayWrapper: oUserProjectsPhasesWrapper,
					oNewParentItemArrayWrapper: {
						aData: []
					},
					sNameEN: "NameEN",
					sNameFR: "NameFR",
					sDependentKey: "Guid",
					aParentKeys: aUserPhasesGuids,
					sTargetArrayNameInParent: "aPhases"
				});

				if (oUserProjectsPhasesWrapper.aData[0]) {
					return oUserProjectsPhasesWrapper.aData[0].aPhases;
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

			getSeletedItemsKeysInMultiSelect: function(oParameters) {
				var aData = [];
				for (var i = 0; i < oParameters.aData.length; i++) {
					if (oParameters.aData[i].ticked === true) {
						aData.push(oParameters.aData[i][oParameters.sKey]);
					}
				}
				return aData;
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
							oMultiSelectItem.icon = oMultiSelectItem.icon + oParameters.oDependentArrayWrapper.aData[i][oParameters.sDependentIconKey] + "' class='cnpMultiSelectIcon'/>"
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
						// oMultiSelectItem.name = '<div class="cnpButtonLabelChild">' + sName + '</div>';
						oMultiSelectItem.name = '<div class="cnpButtonLabelChild">' + sName + '</div>';
						aMultiSelectArray.push(oMultiSelectItem);
						for (var j = 0; j < oParameters.oDependentArrayWrapper.aData[i][oParameters.sSecondLevelAttribute].results.length; j++) {
							oMultiSelectItem = {};
							if (oParameters.oDependentArrayWrapper.aData[i][oParameters.sSecondLevelAttribute].results[j][oParameters.sSecondLevelNameEN] || oParameters.oDependentArrayWrapper.aData[i][oParameters.sSecondLevelAttribute].results[j][oParameters.sSecondLevelNameFR]) {
								oMultiSelectItem.name = $translate.use() === "en" ? oParameters.oDependentArrayWrapper.aData[i][oParameters.sSecondLevelAttribute].results[j][oParameters.sSecondLevelNameEN] : oParameters.oDependentArrayWrapper.aData[i][oParameters.sSecondLevelAttribute].results[j][oParameters.sSecondLevelNameFR];
								if (!oMultiSelectItem.name) {
									oMultiSelectItem.name = oParameters.oDependentArrayWrapper.aData[i][oParameters.sSecondLevelAttribute].results[j][oParameters.sSecondLevelNameEN];
								}
								oMultiSelectItem.fullName = '<div class="cnpButtonLabelParent">' + sName + '</div>' + '<div class="cnpButtonLabelSeparator">' + '&nbsp;-&nbsp;' + '</div>' + '<div class="cnpButtonLabelChild">' + oMultiSelectItem.name + '</div>';
							}
							oMultiSelectItem[oParameters.sDependentKey] = oParameters.oDependentArrayWrapper.aData[i][oParameters.sSecondLevelAttribute].results[j][oParameters.sDependentKey];
							aMultiSelectArray.push(oMultiSelectItem);
						}
						oMultiSelectItem = {};
						oMultiSelectItem.multiSelectGroup = false;
						aMultiSelectArray.push(oMultiSelectItem);
					}
				};

				if (oParameters.oNewParentItemArrayWrapper) { //needed when multiselect is used in the list with possibility to create a new item within the list....
					oParameters.oNewParentItemArrayWrapper.aData = angular.copy(aMultiSelectArray);
				}

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
						if (aArrayItem.multiSelectGroup === undefined) {
							aArrayItem.ticked = false;
						}

						if (oParameters.sParentKey) {
							if (oParameters.oParentArrayWrapper.aData[i][oParameters.sParentKey] === aMultiSelectArray[j][oParameters.sDependentKey]) {
								aArrayItem.ticked = true;
								bMatchFound = true;
							}
						}
						if (oParameters.sParentKeys) {
							for (var k = 0; k < oParameters.oParentArrayWrapper.aData[i][oParameters.sParentKeys].length; k++) {
								if (aMultiSelectArray[j][oParameters.sDependentKey] === oParameters.oParentArrayWrapper.aData[i][oParameters.sParentKeys][k]) {
									aArrayItem.ticked = true;
									bMatchFound = true;
								}
							}
						}
						if (oParameters.aParentKeys) {
							for (var k = 0; k < oParameters.aParentKeys.length; k++) {
								if (aMultiSelectArray[j][oParameters.sDependentKey] === oParameters.aParentKeys[k]) {
									aArrayItem.ticked = true;
									bMatchFound = true;
								}
							}
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
					filterDelay: 10,
					sorting: oParameters.oInitialSorting,
					filter: oParameters.oInitialFilter,
					groupsSettings: oParameters.aInitialGroupsSettings,
				}, {
					groupBy: oParameters.sGroupBy,
					total: oParameters.oInitialDataArrayWrapper.aData.length,
					sDisplayedDataArrayName: oParameters.sDisplayedDataArrayName,
					getData: function($defer, params) {
						var aInitialData = oParameters.oInitialDataArrayWrapper.aData; // need a wrapper for the array here to be able to pass values by reference

						var aFilteredData = params.filter() ? $filter('filter')(aInitialData, params.filter()) : aInitialData;

						var aSortedData = [];

						var aSortingBy = angular.copy(params.orderBy());
						if (oParameters.sGroupsSortingAttribue) {
							aSortingBy.unshift(oParameters.sGroupsSortingAttribue);
						}
						if (aSortingBy === undefined || angular.equals(aSortingBy, {})) {
							aSortedData = aFilteredData;
						} else {
							aSortedData = $filter('orderBy')(aFilteredData, aSortingBy)
						}

						$defer.resolve(aSortedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					},
					counts: []
				});
				return oTableParams;
			},

			setUpPhotoGallery: function(aImages) {
				$rootScope.sGalleryPhotosLocation = $window.location.origin + $window.location.pathname + "rest/file/get/";
				$rootScope.aGalleryData = [];

				for (var i = 0; i < aImages.length; i++) {
					$rootScope.aGalleryData.push({
						sGuid: aImages[i].Guid
					});
				}
				$rootScope.oSelectedPhoto = $rootScope.aGalleryData[0];
				if ($rootScope.aGalleryData[0]) {
					$rootScope.sSelectedPhotoID = $rootScope.aGalleryData[0].sGuid;
				}

				$rootScope.oGalleryListPosition = {
					left: "0px"
				};

				$rootScope.bIsGalleryHidden = false;
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
			},

			refreshUserProfile: function() {
				var sCurrentCompany = cacheProvider.oUserProfile.sCurrentCompany;
				var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
				var aGloballySelectedPhasesGuids = angular.copy(cacheProvider.oUserProfile.aGloballySelectedPhasesGuids);
				cacheProvider.oUserProfile = apiProvider.getUserProfile(cacheProvider.oUserProfile.sUserName);
				cacheProvider.oUserProfile.sCurrentCompany = sCurrentCompany;
				cacheProvider.oUserProfile.sCurrentRole = sCurrentRole;
				cacheProvider.oUserProfile.aGloballySelectedPhasesGuids = aGloballySelectedPhasesGuids;
			}
		}
	}
]);