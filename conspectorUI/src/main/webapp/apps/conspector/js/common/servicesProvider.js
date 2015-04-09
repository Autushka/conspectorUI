app.factory('servicesProvider', ['$rootScope', '$state', 'ngTableParams', '$translate', 'utilsProvider', 'cacheProvider', 'apiProvider', 'dataProvider', 'rolesSettings', '$cookieStore', '$window', '$filter', '$mdDialog', '$upload', 'CONSTANTS', '$cordovaKeyboard', '$rootScope',
	function($rootScope, $state, ngTableParams, $translate, utilsProvider, cacheProvider, apiProvider, dataProvider, rolesSettings, $cookieStore, $window, $filter, $mdDialog, $upload, CONSTANTS, $cordovaKeyboard, $rootScope) {
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

			logIn: function(oParameters) {
				var oSrv = {};
				var SHA512 = new Hashes.SHA512;

				var sPath = CONSTANTS.sAppAbsolutePath + "rest/account/login/" + oParameters.oData.userName + "/" + SHA512.hex(oParameters.oData.password);
				var onSuccess = $.proxy(function(oData) {
					var bNoErrorMessages = this.messagesHandler(oData.messages);
					if (bNoErrorMessages) {
						// if (bRememberUserName) {
						// 	var oObjToStore = {
						// 		sUserName: oParameters.userName
						// 	};

						// 	if (CONSTANTS.bIsHybridApplication) {
						// 		oObjToStore.sPassword = oParameters.password;
						// 	}
						// 	$cookieStore.put("userName", oObjToStore);
						// } else {
						// 	$cookieStore.remove("userName");
						// }
						if (oParameters.onSuccess) {
							oParameters.onSuccess();
						}

						this.onLogInSuccessHandler(oParameters.oData.userName);
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
				var sPath = CONSTANTS.sAppAbsolutePath + "rest/system/initializeSessionVariables";
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
				var sOperation = "Log In";
				if (CONSTANTS.bIsHybridApplication) {
					sOperation = "Log In (mobile)";
				}

				apiProvider.logEvent({
					aUsers: ["GeneralAdmin"],
					sEntityName: "",
					sEntityGuid: "",
					sOperationNameEN: sOperation,
				});
			},

			logLogOut: function() {
				var sOperation = "Log Out";
				if (CONSTANTS.bIsHybridApplication) {
					sOperation = "Log Out (mobile)";
				}

				apiProvider.logEvent({
					aUsers: ["GeneralAdmin"],
					sEntityName: "",
					sEntityGuid: "",
					sOperationNameEN: sOperation,
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

			setUserContactForCurrentCompany: function(sCurrentCompany) {
				var oUserContactForCurrentCompany = [];
				//cacheProvider.oUserProfile.aAllUserPhases = angular.copy(cacheProvider.oUserProfile.aAllUserPhases);
				for (var i = 0; i < cacheProvider.oUserProfile.aAllUserContacts.length; i++) {
					if (cacheProvider.oUserProfile.aAllUserContacts[i].CompanyName === sCurrentCompany) {
						oUserContactForCurrentCompany = cacheProvider.oUserProfile.aAllUserContacts[i];
					}
				}

				cacheProvider.oUserProfile.oUserContact = angular.copy(oUserContactForCurrentCompany);
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
					apiProvider.initializePubNub();
					this.initializeGetNotificationsFunction();
					$rootScope.getNotificationsNumber();
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

				if (CONSTANTS.bIsHybridApplication) {
					//alert(oDeviceInfo);
					//alert(oDeviceInfo.sDeviceToken);
					if (oDeviceInfo && oDeviceInfo.sDeviceToken) {
						var onSuccess = function(aData) {
							if (!aData.length) {
								apiProvider.createUserDevice({
									oData: {
										UserName: sUserName,
										DeviceToken: oDeviceInfo.sDeviceToken,
										BadgeNumber: 0
									}
								});
							}else{
								oDeviceInfo.sGuid = aData[0].Guid;
							}
						}

						apiProvider.getUserDevices({
							sFilter: "DeviceToken eq '" + oDeviceInfo.sDeviceToken + "' and UserName eq '" + sUserName + "'",
							onSuccess: onSuccess
						});
					}
				}

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
					this.setUserContactForCurrentCompany(sCurrentCompany);
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
					this.setUserContactForCurrentCompany(sCurrentCompany);
				}
				sCurrentRole = apiProvider.getCurrentRole();
				if (!sCurrentRole) {
					$state.go("roleSelection");
					return;

				} else {
					//cacheProvider.oUserProfile.sCurrentRole = sCurrentRole;
					apiProvider.initializePubNub();
					this.initializeGetNotificationsFunction();
					$rootScope.getNotificationsNumber();
					rolesSettings.setCurrentRole(sCurrentRole);
				}
			},

			messagesHandler: function(aMessages) {
				var bNoErrorMessages = true;

				if (CONSTANTS.bIsHybridApplication) {
					$cordovaKeyboard.close();
				}

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

			addCommentForEntity: function(oParameters) {
				var oRequestData = {
					__batchRequests: []
				};
				var aData = [];
				var oData = {};
				var sCommentSetGuid = "";
				var oSrv = {};

				var addComment = function(oData) {
					onSuccess = function() {
						oParameters.onSuccess();
					};

					apiProvider.createComment({
						oData: oData,
						bShowSpinner: true,
						//bShowSuccessMessage: true,
						bShowErrorMessage: true,
						onSuccess: onSuccess
					});
				};

				if (!oParameters.sParentEntityCommentSetGuid) {
					sCommentSetGuid = utilsProvider.generateGUID();
					oData = {
						requestUri: "CommentSets",
						method: "POST",
						data: {
							Guid: sCommentSetGuid,
							GeneralAttributes: {
								IsDeleted: false
							},
							LastModifiedAt: utilsProvider.dateToDBDate(new Date())
						}
					};

					aData.push(oData);

					if (oParameters.sParentEntityGuid) {
						oData = {
							requestUri: oParameters.sPath + "('" + oParameters.sParentEntityGuid + "')",
							method: "PUT",
							data: {

								CommentSetGuid: sCommentSetGuid
							}
						};

						aData.push(oData);
					}

					dataProvider.constructChangeBlockForBatch({
						oRequestData: oRequestData,
						aData: aData
					});

					oSrv = dataProvider.batchRequest({
						oRequestData: oRequestData,
					});

					var onCommentSetCreated = function(oData) {
						$rootScope.sCommentSetGuid = oData.Guid;
						$rootScope.sCommentSetLastModifiedAt = oData.LastModifiedAt;

						oParameters.oData.CommentSetGuid = oData.Guid;
						addComment(oParameters.oData);
					}

					oSrv.then(function(aData) {
						onCommentSetCreated(aData[0].__changeResponses[0].data)
					});
				} else {
					oParameters.oData.CommentSetGuid = oParameters.sParentEntityCommentSetGuid;
					addComment(oParameters.oData);
				}
			},


			uploadAttachmentsForEntity: function(oParameters) {
				var oRequestData = {
					__batchRequests: []
				};
				var aData = [];
				var oData = {};
				var sFileMetadataSetGuid = "";
				var oSrv = {};
				var sEntityName = "";

				var uploadFiles = $.proxy(function(sFileMetadataSetGuid) {
					var iCounter = 0; //needed because files are sent async
					if (!oParameters.sParentEntityGuid) {
						if (CONSTANTS.bIsHybridApplication) {
							oParameters.sParentEntityGuid = "quickAddApp";
						} else {
							oParameters.sParentEntityGuid = "attachmentsBeforeSave";
						}
					}

					for (var i = 0; i < oParameters.aFiles.length; i++) {
						var file = oParameters.aFiles[i];
						var sPath = this.costructUploadUrl({
							sPath: CONSTANTS.sAppAbsolutePath + "rest/file/v1v2/createUploadUrlWithFileMetadataSetGuid/Deficiency/" + oParameters.sParentEntityGuid + "/_attachments_/" + sFileMetadataSetGuid,
						});

						var oUpload = {};
						if (CONSTANTS.bIsHybridApplication) {
							$rootScope.$emit('LOAD');

							$.ajax({
								url: sPath,
								data: file,
								cache: false,
								contentType: false,
								processData: false,
								type: 'POST',
								success: $.proxy(function(data) {
									iCounter++;
									if (iCounter === (oParameters.aFiles.length)) {
										oParameters.onSuccess();
										switch (oParameters.sPath) {
											case "Tasks":
												sEntityName = "oDeficiencyEntity";
												break;
										}
										apiProvider.pubNubMessage({
											sEntityName: sEntityName,
											sText: "New attachemnts added..."
										});
									}
								}, this)
							});
						} else {
							oUpload = $upload.upload({
								url: sPath,
								file: file,
							});

							oUpload.progress(function($event) {
								if (oParameters.onProgress) {
									oParameters.onProgress($event);
								}
							});

							oUpload.success($.proxy(function() {
								iCounter++;
								if (iCounter === (oParameters.aFiles.length)) {
									oParameters.onSuccess();
									switch (oParameters.sPath) {
										case "Tasks":
											sEntityName = "oDeficiencyEntity";
											break;
									}
									apiProvider.pubNubMessage({
										sEntityName: sEntityName,
										sText: "New attachemnts added..."
									});
								}
							}, this));
						}
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

					if (oParameters.sParentEntityGuid) {
						oData = {
							requestUri: oParameters.sPath + "('" + oParameters.sParentEntityGuid + "')",
							method: "PUT",
							data: {
								FileMetadataSetGuid: sFileMetadataSetGuid
							}
						};

						aData.push(oData);
					}


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
				var sUrl = "rest/file/v2/delete/" + sGuid;
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

			constructImageUrl: function(sFileMetadataGuid) {
				return CONSTANTS.sAppAbsolutePath + "rest/file/v2/get/" + sFileMetadataGuid;
			},

			constructUserAvatarUrl: function(email) {
                var MD5 = new Hashes.MD5;
                if (email === "") {
                    email = "deficien@cyDetails.com";
                }
                return sAvatarUrl = "http://www.gravatar.com/avatar/" + MD5.hex(email) + ".png?d=identicon";
            },

			constructLogoUrl: function() {
				// var onSuccessCompanyLoaded = function(oData){
				// 	if(oData.LogoFileMetadataSetDetails && oData.LogoFileMetadataSetDetails.FileMetadataDetails && oData.LogoFileMetadataSetDetails.FileMetadataDetails.results.length){
				// 		$rootScope.sLogoUrl = CONSTANTS.sAppAbsolutePath + "rest/file/v2/get/" + Data.LogoFileMetadataSetDetails.FileMetadataDetails.results[0].Guid;
				// 	}else{
				// 		$rootScope.sLogoUrl = CONSTANTS.sAppAbsolutePath + "apps/conspector/img/logo_conspector.png";
				// 	}
				// }

				// apiProvider.getCompany({
				// 	sKey: cacheProvider.oUserProfile.sCurrentCompany,
				// 	sExpand: "LogoFileMetadataSetDetails/FileMetadataDetails",
				// 	onSuccess: onSuccessCompanyLoaded
				// });

				var sUrl = CONSTANTS.sAppAbsolutePath + "rest/file/v1/list/companyDependentSettings/" + cacheProvider.oUserProfile.sCurrentCompany + "/_logo_";
				var oSvc = dataProvider.httpRequest({
					sPath: sUrl
				});
				oSvc.then(function(aData) {
					if (aData[0]) {
						$rootScope.sLogoUrl = CONSTANTS.sAppAbsolutePath + "rest/file/v2/get/" + aData[0].guid;
					} else {
						$rootScope.sLogoUrl = CONSTANTS.sAppAbsolutePath + "apps/conspector/img/logo_conspector.png";
					}
				});
			},

			constructMenuIconUrl: function() {
				var sUrl = "";
				// var oSvc = dataProvider.httpRequest({
				// 	sPath: sUrl
				// });
				$rootScope.sMenuIconUrl = CONSTANTS.sAppAbsolutePath + "apps/conspector/img/mobileMenuIcon_tiny.svg";
				// oSvc.then(function(aData) {
				// 	if (aData[0]) {
				// 		$rootScope.sMenuIconUrl = CONSTANTS.sAppAbsolutePath + "rest/file/get/" + aData[0].guid;
				// 	} else {

				// 	}
				// });
			},

			processListOfComments: function(oParameters) { //
				var sAuthor = "";
				var sAvatarUrl = "";
				var sUserName = "";
				var bAllowedEditMode = false;
				var aComments = [];

				var oData = angular.copy(oParameters.oData);

				if (!oData.CommentDetails) {
					return [];
				}

				for (var i = 0; i < oData.CommentDetails.results.length; i++) {
					sAuthor = "";
					sAvatarUrl = "";
					sUserName = "";

					if (oData.CommentDetails.results[i].GeneralAttributes.IsDeleted) {
						continue;
					}
					if (oData.CommentDetails.results[i].ContactDetails) {
						if (oData.CommentDetails.results[i].ContactDetails.FirstName) {
							sAuthor = oData.CommentDetails.results[i].ContactDetails.FirstName + " ";
						}
						if (oData.CommentDetails.results[i].ContactDetails.LastName) {
							sAuthor = sAuthor + oData.CommentDetails.results[i].ContactDetails.LastName;
						}
					}
					var MD5 = new Hashes.MD5;
					if (oData.CommentDetails.results[i].ContactDetails && oData.CommentDetails.results[i].ContactDetails.UserDetails && oData.CommentDetails.results[i].ContactDetails.UserDetails.results[0]) {
						var sUserEmailHash = MD5.hex(oData.CommentDetails.results[i].ContactDetails.UserDetails.results[0].EMail);
					} else {
						var sUserEmailHash = MD5.hex("deficien@cyDetails.com");
					}
					sAvatarUrl = "http://www.gravatar.com/avatar/" + sUserEmailHash + ".png?d=identicon&s=60";


					//here assumption is made that only one user can be assigned to contact...
					if (oData.CommentDetails.results[i].ContactDetails && oData.CommentDetails.results[i].ContactDetails.UserDetails && oData.CommentDetails.results[i].ContactDetails.UserDetails.results) {
						if (oData.CommentDetails.results[i].ContactDetails.UserDetails.results.length) {
							if (oData.CommentDetails.results[i].ContactDetails.UserDetails.results[0].AvatarFileGuid) {
								sAvatarUrl = this.constructImageUrl(oData.CommentDetails.results[i].ContactDetails.UserDetails.results[0].AvatarFileGuid);
							}
							sUserName = oData.CommentDetails.results[i].ContactDetails.UserDetails.results[0].UserName;
						}
					}
					bAllowedEditMode = (sUserName === cacheProvider.oUserProfile.sUserName) ? true : false;

					aComments.push({
						_guid: oData.CommentDetails.results[i].Guid,
						_lastModifiedAt: oData.CommentDetails.results[i].LastModifiedAt,
						_createdAt: oData.CommentDetails.results[i].CreatedAt,
						sCreatedAt: utilsProvider.dBDateToSting(oData.CommentDetails.results[i].CreatedAt),
						sText: oData.CommentDetails.results[i].Text,
						sAuthor: sAuthor,
						sAvatarUrl: sAvatarUrl,
						_editMode: false,
						_allowEditMode: bAllowedEditMode,
						_userName: sUserName,
					});
				}
				$rootScope.iCommentsNumber = aComments.length; //to refresh info for parent entity details view...
				return aComments;
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
							oMultiSelectItem.icon = "<img src='" + $window.location.origin + $window.location.pathname + "rest/file/v2/get/";
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

			initializeGetNotificationsFunction: function() {
				$rootScope.getNotificationsNumber = function() {
					var onNotificationsLoaded = function(iData) {
						$rootScope.iNotificationsNumber = iData;
					};
					apiProvider.getOperationLogs({
						//sExpand: "PhaseDetails/ProjectDetails",
						sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and UserName eq '" + cacheProvider.oUserProfile.sUserName + "' and Status eq 'not read' and GeneralAttributes/IsDeleted eq false",
						//sOtherUrlParams: "$count",
						bAddCountUrlParam: true,
						onSuccess: onNotificationsLoaded
					});
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

						var oFilters = angular.copy(params.filter()); // making sure that filtering happens ignoring special chars
						for (var sFilter in oFilters) {
							if (oFilters.hasOwnProperty(sFilter)) {
								oFilters[sFilter] = utilsProvider.replaceSpecialChars(oFilters[sFilter]);
							}
						}

						var aFilteredData = oFilters ? $filter('filter')(aInitialData, oFilters) : aInitialData;

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
				$rootScope.sGalleryPhotosLocation = $window.location.origin + $window.location.pathname + "rest/file/v2/get/";
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
				//var oUserContact = angular.copy(cacheProvider.oUserProfile.oUserContact),
				cacheProvider.oUserProfile = apiProvider.getUserProfile(cacheProvider.oUserProfile.sUserName);
				cacheProvider.oUserProfile.sCurrentCompany = sCurrentCompany;
				cacheProvider.oUserProfile.sCurrentRole = sCurrentRole;
				cacheProvider.oUserProfile.aGloballySelectedPhasesGuids = aGloballySelectedPhasesGuids;
				this.setUserPhasesForCurrentCompany(sCurrentCompany);
				this.setUserContactForCurrentCompany(sCurrentCompany);
				this.setUserContactForCurrentCompany(sCurrentCompany);
			}
		}
	}
]);