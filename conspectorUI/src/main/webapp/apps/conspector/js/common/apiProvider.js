app.factory('apiProvider', ['$rootScope', 'dataProvider', 'CONSTANTS', '$q', 'utilsProvider', 'cacheProvider', 'PubNub',
	function($rootScope, dataProvider, CONSTANTS, $q, utilsProvider, cacheProvider, PubNub) {
		return {
			getUserProfile: function(sUserName) {
				var sPath = CONSTANTS.sServicePath + "Users('" + sUserName + "')?$expand=CompanyDetails,RoleDetails,PhaseDetails/ProjectDetails,ContactDetails/AccountDetails&$format=json";
				var aUserCompanies = [];
				var aUserRoles = [];
				var aUserPhases = [];
				var aUserContacts = [];
				var sCreatedAt = "";
				var sLastModifiedAt = "";
				var bIsInitialPassword = false;
				var sUserContactGuid = ""; //needed for contact management scenario from profile
				var sUserAccountGuid = ""; //needed for contact management scenario from profile
				var onSuccess = function(oData) {
					bIsInitialPassword = oData.d.IsPasswordInitial;
					sLastModifiedAt = oData.d.LastModifiedAt;
					for (var i = 0; i < oData.d.CompanyDetails.results.length; i++) {
						if (!oData.d.CompanyDetails.results[i].GeneralAttributes.IsDeleted) {
							aUserCompanies.push(oData.d.CompanyDetails.results[i]);
						}
					}
					for (var i = 0; i < oData.d.RoleDetails.results.length; i++) {
						if (!oData.d.RoleDetails.results[i].GeneralAttributes.IsDeleted) {
							aUserRoles.push(oData.d.RoleDetails.results[i]);
						}
					}
					for (var i = 0; i < oData.d.PhaseDetails.results.length; i++) {
						if (!oData.d.PhaseDetails.results[i].GeneralAttributes.IsDeleted) {
							oData.d.PhaseDetails.results[i]._sortingSequence = oData.d.PhaseDetails.results[i].GeneralAttributes.SortingSequence;
							oData.d.PhaseDetails.results[i].ProjectDetails._sortingSequence = oData.d.PhaseDetails.results[i].ProjectDetails.GeneralAttributes.SortingSequence;
							aUserPhases.push(oData.d.PhaseDetails.results[i]);
						}
					}
					for (var i = 0; i < oData.d.ContactDetails.results.length; i++) {
						if (!oData.d.ContactDetails.results[i].GeneralAttributes.IsDeleted) {
							aUserContacts.push(oData.d.ContactDetails.results[i]);
						}
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
					aUserRoles: aUserRoles, //will contain list of user roles for the current company
					aAllUserRoles: aUserRoles, //will contain list of user roles for all users compnanies
					aUserPhases: aUserPhases, //will contain list of user phases for the current company
					aAllUserPhases: aUserPhases, //will contain list of user phases for all users compnanies
					aUserCompanies: aUserCompanies,
					bIsInitialPassword: bIsInitialPassword,
					sLastModifiedAt: sLastModifiedAt,
					aGloballySelectedPhasesGuids: [], //will be bopupated in appController
					aAllUserContacts: aUserContacts,
					// sUserContactGuid: sUserContactGuid,
					// sUserAccountGuid: sUserAccountGuid
				};
			},

			getCurrentUserName: function() {
				var sPath = CONSTANTS.sAppAbsolutePath + "rest/account/getCurrentUserName";
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

			getCurrentCompany: function() {
				var sPath = CONSTANTS.sAppAbsolutePath + "rest/account/getCurrentCompany";
				var sCurrentCompany;

				var onSuccess = function(sData) {
					sCurrentCompany = sData;
				}

				dataProvider.ajaxRequest({
					sPath: sPath,
					bAsync: false,
					sRequestType: "GET",
					oEventHandlers: {
						onSuccess: onSuccess
					}
				});

				return sCurrentCompany;
			},

			setCurrentCompany: function(sCompany) {
				dataProvider.ajaxRequest({
					sPath: CONSTANTS.sAppAbsolutePath + "rest/account/setCurrentCompany/" + sCompany,
					bAsync: false,
					sRequestType: "GET",
				});
			},

			getCurrentRole: function() {
				var sPath = CONSTANTS.sAppAbsolutePath + "rest/account/getCurrentRole";
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
				dataProvider.ajaxRequest({
					sPath: CONSTANTS.sAppAbsolutePath + "rest/account/setCurrentRole/" + sRole,
					bAsync: false,
					sRequestType: "GET",
				});
			},

			resetPasswordWithPRCode: function(oParameters) {
				var oSrv = dataProvider.httpRequest({
					sPath: CONSTANTS.sAppAbsolutePath + "rest/account/passwordRecovery/PRCode/" + oParameters.oData.passwordRecoveryCode + "/newPassword/" + oParameters.oData.newPassword,
					sRequestType: "GET",
					bShowSpinner: true,
				});

				oSrv.then(function(oData) {
					oParameters.onSuccess(oData);
				});
			},

			resetPassword: function(oParameters) {
				var oSrv = {};
				var sPath = "";

				if (oParameters.oData.userName) {
					sPath = CONSTANTS.sAppAbsolutePath + "rest/account/passwordRecovery/userName/" + oParameters.oData.userName;
				} else {
					sPath = CONSTANTS.sAppAbsolutePath + "rest/account/passwordRecovery/email/" + oParameters.oData.email;
				}

				oSrv = dataProvider.httpRequest({
					sPath: sPath,
					sRequestType: "GET",
					bShowSpinner: true,
				});

				oSrv.then(function(oData) {
					oParameters.onSuccess(oData);
				});
			},

			hashPassword: function(sPassword) {
				var sHashedPassword = "";
				var sPath = CONSTANTS.sAppAbsolutePath + "rest/account/hashPassword/" + sPassword;
				var onSuccess = function(sData) {
					sHashedPassword = sData;
				}

				dataProvider.ajaxRequest({
					sPath: sPath,
					bAsync: false,
					sRequestType: "GET",
					oEventHandlers: {
						onSuccess: onSuccess
					}
				});
				return sHashedPassword;
			},

			getAttachments: function(oParameters) {
				var sUrl = oParameters.sPath;
				var oSvc = dataProvider.httpRequest({
					sPath: sUrl
				});
				oSvc.then(function(aData) {
					oParameters.onSuccess(aData);
				});
			},

			getUsers: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "Users",
					sExpand: oParameters.sExpand,
					sFilter: "GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oUserEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			getUserWithCompaniesPhasesAndRoles: function(oParameters) {
				var svc = dataProvider.getEntity({
					sPath: "Users",
					sKey: oParameters.sKey,
					sExpand: "CompanyDetails,PhaseDetails/ProjectDetails,RoleDetails,ContactDetails",
					sFilter: "GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
				});
				svc.then(oParameters.onSuccess);
			},

			createUser: function(oParameters) {
				var onSuccess = $.proxy(function(oData) {
					cacheProvider.cleanEntitiesCache("oUserEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				}, this);
				var oSvc = dataProvider.createEntity({
					sPath: "Users",
					sKeyAttribute: "UserName", //needed for links creation
					oData: oParameters.oData,
					aLinks: oParameters.aLinks,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: false
				});

				oSvc.then(onSuccess);
			},

			updateUser: function(oParameters) {
				var onSuccess = $.proxy(function(oData) {
					cacheProvider.cleanEntitiesCache("oUserEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				}, this);
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "Users",
					sKeyAttribute: "UserName",
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					aLinks: oParameters.aLinks,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSvc.then(onSuccess);
			},

			getInterestedUsers: function(oParameters) {
				var onTaskInfoLoaded = function(oData) {
					var aInterestedUsers = [];
					var bAssignedUserAdded = false;
					var bAuthorAdded = false;

					for (var i = oData.AccountDetails.results.length - 1; i >= 0; i--) {
						for (var j = oData.AccountDetails.results[i].ContactDetails.results.length - 1; j >= 0; j--) {
							for (var k = oData.AccountDetails.results[i].ContactDetails.results[j].UserDetails.results.length - 1; k >= 0; k--) {
								if (oData.AccountDetails.results[i].ContactDetails.results[j].UserDetails.results[k].UserName === oData.UserName) {
									bAssignedUserAdded = true;
								}
								if (oData.AccountDetails.results[i].ContactDetails.results[j].UserDetails.results[k].UserName === oData.GeneralAttributes.CreatedBy) {
									bAuthorAdded = true;
								}								
								aInterestedUsers.push(oData.AccountDetails.results[i].ContactDetails.results[j].UserDetails.results[k].UserName);
							}
						};
					}
					if (oData.UserName != cacheProvider.oUserProfile.sUserName && !bAssignedUserAdded) {
						aInterestedUsers.push(oData.UserName);
					}

					if(oData.GeneralAttributes.CreatedBy != cacheProvider.oUserProfile.sUserName && !bAuthorAdded && oData.GeneralAttributes.CreatedBy != oData.UserName){
						aInterestedUsers.push(oData.CreatedBy);
					}
					aInterestedUsers.push("GeneralAdmin");// just for now...for test perposes.

					oParameters.onSuccess(aInterestedUsers);
				};

				this.getDeficiency({
					sKey: oParameters.sEntityGuid,
					sExpand: "AccountDetails/ContactDetails/UserDetails",
					onSuccess: onTaskInfoLoaded
				})
			},

			initializePubNub: function() {
				$rootScope.sSessionGuid = utilsProvider.generateGUID();
				var sChannel = "";

				PubNub.init({
					publish_key: 'pub-c-59bd66cf-9992-42d5-af04-87ec537c73bb',
					subscribe_key: 'sub-c-7606f63c-9908-11e4-a626-02ee2ddab7fe'
				});
				sChannel = "conspectorPubNub" + cacheProvider.oUserProfile.sCurrentCompany;
				PubNub.ngSubscribe({
					channel: sChannel
				});

				$rootScope.$on(PubNub.ngMsgEv(sChannel), function(event, payload) {
					if (payload.message.sSessionGuid === $rootScope.sSessionGuid) {
						return;
					}
					cacheProvider.cleanEntitiesCache(payload.message.sEntityName);
					if (payload.message.sEntityName === "oAccountEntity") {
						cacheProvider.cleanEntitiesCache("oAccountTypeEntity"); //for cases when accountTypes are readed with Accounts;
					}

					switch (payload.message.sEntityName) {
						case "oAccountEntity":
							$rootScope.$broadcast('accountsShouldBeRefreshed');
							break;
						case "oContactEntity":
							$rootScope.$broadcast('contactsShouldBeRefreshed');
							break;
						case "oDeficiencyEntity":
							$rootScope.$broadcast('deficienciesShouldBeRefreshed');
							break;
						case "oUnitEntity":
							$rootScope.$broadcast('unitsShouldBeRefreshed');
							break;
						case "oActivityEntity":
							$rootScope.$broadcast('activitiesShouldBeRefreshed');
							break;
						case "oOperationLogEntity":
							$rootScope.$broadcast('notificationsShouldBeRefreshed');
							$rootScope.getNotificationsNumber();
							break;							
					}
				});
			},			

			pubNubMessage: function(oParameters) {
				PubNub.ngPublish({
					channel: "conspectorPubNub" + cacheProvider.oUserProfile.sCurrentCompany,
					message: {
						sEntityName: oParameters.sEntityName,
						sText: oParameters.sText,
						sUserName: cacheProvider.oUserProfile.sUserName,
						sSessionGuid: $rootScope.sSessionGuid,
					}
				});
			},			

			logEvent: function(oParameters) {
				var oSrv = {};
				var oRequestData = {
					__batchRequests: []
				};
				var aData = [];
				var oData = {};

				for (var i = 0; i < oParameters.aUsers.length; i++) {
					oData = {
						requestUri: "OperationLogs",
						method: "POST",
						data: {
							Guid: utilsProvider.generateGUID(),
							CompanyName: cacheProvider.oUserProfile.sCurrentCompany, 
							UserName: oParameters.aUsers[i],
							Status: "not read",
							EntityName: oParameters.sEntityName,
							EntityGuid: oParameters.sEntityGuid,
							OperationNameEN: oParameters.sOperationNameEN,
							OperationNameFR: oParameters.sOperationNameFR,
							PhaseGuid: oParameters.sPhaseGuid,
							CreatedAt: utilsProvider.dateToDBDate(new Date()),
							GeneralAttributes: {CreatedBy:cacheProvider.oUserProfile.sUserName}
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
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSrv.then($.proxy(function(aData) {
					cacheProvider.cleanEntitiesCache("oOperationLogEntity");
					$rootScope.getNotificationsNumber();
					this.pubNubMessage({sEntityName: "oOperationLogEntity", sText: "New Operation Log..."});
					//this.onSuccessUpdateDeficiency(oParameters);
				}, this));
				// var oData = oParameters.oData;
				// var onSuccess = function(oData) {
				// 	cacheProvider.cleanEntitiesCache("oOperationLogEntity");
				// };
				// oData.OperationContent = JSON.stringify(oParameters.oData.OperationContent);

				// var oSvc = dataProvider.createEntity({
				// 	sPath: "OperationLogs",
				// 	oData: oData,
				// 	bGuidNeeded: true,
				// 	bCompanyNeeded: true
				// });

				// oSvc.then(onSuccess);
			},

			logEvents: function(oParameters) {
				var oSrv = {};
				var oRequestData = {
					__batchRequests: []
				};
				var aData = [];
				var oData = {};

				for (var i = 0; i < oParameters.aData.length; i++) {
					oData = {
						requestUri: "OperationLogs",
						method: "POST",
						data: oParameters.aData[i]
					};

					aData.push(oData);
				}

				dataProvider.constructChangeBlockForBatch({
					oRequestData: oRequestData,
					aData: aData
				});

				oSrv = dataProvider.batchRequest({
					oRequestData: oRequestData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSrv.then($.proxy(function(aData) {
					//this.onSuccessUpdateDeficiency(oParameters);
				}, this));
			},

			getOperationLogs: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "OperationLogs",
					sExpand: oParameters.sExpand,
					sFilter: oParameters.sFilter,
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oOperationLogEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			updateOperationLog: function(oParameters){
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oOperationLogEntity");
					$rootScope.getNotificationsNumber();
					//$rootScope.$emit('notificationsNumberShouldBeRefreshed');
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "OperationLogs",
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bIgnoreLastModifiedAtValidation: true

				});

				oSvc.then(onSuccess);				
			},

			// updateOperationLogs: function(oParameters) {
			// 	var oSrv = {};
			// 	var oRequestData = {
			// 		__batchRequests: []
			// 	};
			// 	var aData = [];
			// 	var oData = {};

			// 	for (var i = 0; i < oParameters.aData.length; i++) {
			// 		oData = {
			// 			requestUri: "OperationLogs('" + oParameters.aData[i].Guid + "')",
			// 			method: "PUT",
			// 			data: oParameters.aData[i]
			// 		};

			// 		aData.push(oData);
			// 	}

			// 	dataProvider.constructChangeBlockForBatch({
			// 		oRequestData: oRequestData,
			// 		aData: aData
			// 	});

			// 	oSrv = dataProvider.batchRequest({
			// 		oRequestData: oRequestData,
			// 		bShowSpinner: oParameters.bShowSpinner,
			// 		bShowSuccessMessage: oParameters.bShowSuccessMessage,
			// 		bShowErrorMessage: oParameters.bShowErrorMessage,
			// 	});

			// 	oSrv.then($.proxy(function(aData) {
			// 		//this.onSuccessUpdateDeficiency(oParameters);
			// 	}, this));
			// },

			getProjects: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "Projects",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oProjectEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			getProjectsWithPhases: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "Projects",
					sExpand: "PhaseDetails",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oProjectEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			createProject: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oProjectEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.createEntity({
					sPath: "Projects",
					oData: oParameters.oData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true,
					bCompanyNeeded: true
				});

				oSvc.then(onSuccess);
			},

			updateProject: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oProjectEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "Projects",
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSvc.then(onSuccess);
			},

			getPhases: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "Phases",
					sExpand: oParameters.sExpand, //"ProjectDetails",
					sFilter: oParameters.sFilter,
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oPhaseEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			getPhase: function(oParameters) {
				var svc = dataProvider.getEntity({
					sPath: "Phases",
					sKey: oParameters.sKey,
					sExpand: oParameters.sExpand, //"PhaseDetails/ProjectDetails,AccountTypeDetails",
					sFilter: "GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
				});
				svc.then(oParameters.onSuccess);
			},

			createPhase: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oPhaseEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.createEntity({
					sPath: "Phases",
					oData: oParameters.oData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true,
					bCompanyNeeded: true
				});

				oSvc.then(onSuccess);
			},

			updatePhase: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oPhaseEntity");
					// oUserProfile.aUserPhases
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "Phases",
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSvc.then(onSuccess);
			},

			getCompany: function(oParameters) {
				var svc = dataProvider.getEntity({
					sPath: "Companies",
					sKey: oParameters.sKey,
					sExpand: oParameters.sExpand, //"PhaseDetails/ProjectDetails,AccountTypeDetails",
					sFilter: "GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
				});
				svc.then(oParameters.onSuccess);
			},

			getCompanies: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "Companys",
					sFilter: "GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oCompanyEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			createCompany: function(oParameters) {
				var oSrv = {};
				var oRequestData = {
					__batchRequests: []
				};
				var aData = [];
				var sCreatedAt = "";
				var oCompanyData = angular.copy(oParameters.oData);
				var oRoleData = {};

				if (!oCompanyData.GeneralAttributes) {
					oCompanyData.GeneralAttributes = {};
				}

				oCompanyData.GeneralAttributes.CreatedBy = cacheProvider.oUserProfile.sUserName;
				oCompanyData.GeneralAttributes.LastModifiedBy = cacheProvider.oUserProfile.sUserName;
				oCompanyData.GeneralAttributes.IsDeleted = false;
				oCompanyData.GeneralAttributes.IsArchived = false;

				if (!oCompanyData.GeneralAttributes.SortingSequence) {
					oCompanyData.GeneralAttributes.SortingSequence = 0;
				}

				oCompanyData.CreatedAt = utilsProvider.dateToDBDate(new Date());
				oCompanyData.LastModifiedAt = oCompanyData.CreatedAt;

				var oData = {
					requestUri: "Companys",
					method: "POST",
					data: oCompanyData
				};

				aData.push(oData);

				oRoleData.Guid = utilsProvider.generateGUID();
				oRoleData.RoleName = CONSTANTS.sDefaultRoleNameForNewCompany;
				oRoleData.CompanyName = oParameters.oData.CompanyName;
				oRoleData.CreatedAt = oCompanyData.CreatedAt;
				oRoleData.LastModifiedAt = oCompanyData.LastModifiedAt;
				oRoleData.GeneralAttributes = angular.copy(oCompanyData.GeneralAttributes);
				oRoleData.GeneralAttributes.SortingSequence = 0;

				oData = {
					requestUri: "Roles",
					method: "POST",
					data: oRoleData
				};

				aData.push(oData);

				dataProvider.constructChangeBlockForBatch({
					oRequestData: oRequestData,
					aData: aData
				});

				aData = [];
				oData = {
					requestUri: "Users('" + cacheProvider.oUserProfile.sUserName + "')/$links/CompanyDetails",
					method: "POST",
					data: {
						uri: "Companys('" + oParameters.oData.CompanyName + "')"
					}
				};

				aData.push(oData);

				oData = {
					requestUri: "Users('" + cacheProvider.oUserProfile.sUserName + "')/$links/RoleDetails",
					method: "POST",
					data: {
						uri: "Roles('" + oRoleData.Guid + "')"
					}
				};

				aData.push(oData);

				dataProvider.constructChangeBlockForBatch({
					oRequestData: oRequestData,
					aData: aData
				});

				oSrv = dataProvider.batchRequest({
					oRequestData: oRequestData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSrv.then(function(aData) {
					cacheProvider.cleanEntitiesCache("oCompanyEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(aData);
					}
				});
			},

			updateCompany: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oCompanyEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "Companys",
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSvc.then(onSuccess);
			},

			getRoles: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "Roles",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oRoleEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			createRole: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oRoleEntity");
					oParameters.onSuccess(oData);
				};
				var oSvc = dataProvider.createEntity({
					sPath: "Roles",
					oData: oParameters.oData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true,
					bCompanyNeeded: true
				});

				oSvc.then(onSuccess);
			},

			updateRole: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oRoleEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "Roles",
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSvc.then(onSuccess);
			},

			getDeficiencyStatuses: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "TaskStatuss",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oTaskStatusEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			createDeficiencyStatus: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oTaskStatusEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.createEntity({
					sPath: "TaskStatuss",
					oData: oParameters.oData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true,
					bCompanyNeeded: true
				});

				oSvc.then(onSuccess);
			},

			updateDeficiencyStatus: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oTaskStatusEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "TaskStatuss",
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSvc.then(onSuccess);
			},

			getDeficiencyTaskType: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "TaskTypes",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false and NameEN eq 'Deficiency'",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oTaskTypeEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			getHealthAndSafetyTaskType: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "TaskTypes",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false and NameEN eq 'Health and Safety'",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oTaskTypeEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			getContractorAccountType: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "AccountTypes",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false and NameEN eq 'Contractor'",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oAccountTypeEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			getClientAccountType: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "AccountTypes",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false and NameEN eq 'Client'",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oAccountTypeEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			getAccountTypes: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "AccountTypes",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oAccountTypeEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			getAccountTypesWithAccounts: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "AccountTypes",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					sExpand: "AccountDetails",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oAccountTypeEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(function(aData) {
						var aAccounts = [];
						for (var i = 0; i < aData.length; i++) { // filtering here needed only untill bug 414 in Olingo will be resolved (UI filtering will be replaced by oData filtering)
							aAccounts = [];
							for (var j = 0; j < aData[i].AccountDetails.results.length; j++) {
								if (!aData[i].AccountDetails.results[j].GeneralAttributes.IsDeleted) {
									aAccounts.push(aData[i].AccountDetails.results[j]);
								}
							}
							aData[i].AccountDetails.results = angular.copy(aAccounts);
						}
						oParameters.onSuccess(aData);
					});
				}
			},


			createAccountType: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oAccountTypeEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.createEntity({
					sPath: "AccountTypes",
					oData: oParameters.oData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true,
					bCompanyNeeded: true
				});

				oSvc.then(onSuccess);
			},

			updateAccountType: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oAccountTypeEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "AccountTypes",
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSvc.then(onSuccess);
			},

			getContactTypes: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "ContactTypes",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oContactTypeEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			createContactType: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oContactTypeEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.createEntity({
					sPath: "ContactTypes",
					oData: oParameters.oData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true,
					bCompanyNeeded: true
				});

				oSvc.then(onSuccess);
			},

			updateContactType: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oContactTypeEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "ContactTypes",
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSvc.then(onSuccess);
			},

			getActivityTypes: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "ActivityTypes",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oActivityTypeEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			createActivityType: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oActivityTypeEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.createEntity({
					sPath: "ActivityTypes",
					oData: oParameters.oData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true,
					bCompanyNeeded: true
				});

				oSvc.then(onSuccess);
			},

			updateActivityType: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oActivityTypeEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "ActivityTypes",
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSvc.then(onSuccess);
			},



			getDeficiencyPriorities: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "TaskPrioritys",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oTaskPriorityEntity"
				});
				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			createDeficiencyPriority: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oTaskPriorityEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.createEntity({
					sPath: "TaskPrioritys",
					oData: oParameters.oData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true,
					bCompanyNeeded: true
				});

				oSvc.then(onSuccess);
			},

			updateDeficiencyPriority: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oTaskPriorityEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "TaskPrioritys",
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSvc.then(onSuccess);
			},

			getContractors: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "Accounts",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					sExpand: oParameters.sExpand,
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oAccountEntity"
				});
				if (svc instanceof Array) {
					var aContractors = [];
					for (var i = 0; i < svc.length; i++) { // filtering here needed only untill bug 414 in Olingo will be resolved (UI filtering will be replaced by oData filtering)
						if (svc[i].AccountTypeDetails.NameEN === "Contractor") {
							aContractors.push(svc[i])
						}
					}
					oParameters.onSuccess(aContractors) // data retrived from cache
				} else {
					svc.then(function(aData) {
						var aContractors = [];
						for (var i = 0; i < aData.length; i++) { // filtering here needed only untill bug 414 in Olingo will be resolved (UI filtering will be replaced by oData filtering)
							if (aData[i].AccountTypeDetails.NameEN === "Contractor") {
								aContractors.push(aData[i])
							}
						}
						oParameters.onSuccess(aContractors);
					});
				}
			},

			getClients: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "Accounts",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					sExpand: oParameters.sExpand,
					//sExpand: "PhaseDetails/ProjectDetails,AccountTypeDetails",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oAccountEntity"
				});
				if (svc instanceof Array) {
					var aClients = [];
					for (var i = 0; i < svc.length; i++) { // filtering here needed only untill bug 414 in Olingo will be resolved (UI filtering will be replaced by oData filtering)
						if (svc[i].AccountTypeDetails.NameEN === "Client") {
							aClients.push(svc[i])
						}
					}
					oParameters.onSuccess(aClients) // data retrived from cache
				} else {
					svc.then(function(aData) {
						var aClients = [];
						for (var i = 0; i < aData.length; i++) { // filtering here needed only untill bug 414 in Olingo will be resolved (UI filtering will be replaced by oData filtering)
							if (aData[i].AccountTypeDetails.NameEN === "Client") {
								aClients.push(aData[i])
							}
						}
						oParameters.onSuccess(aClients);
					});
				}
			},

			getAccount: function(oParameters) {
				var svc = dataProvider.getEntity({
					sPath: "Accounts",
					sKey: oParameters.sKey,
					sExpand: oParameters.sExpand, //"PhaseDetails/ProjectDetails,AccountTypeDetails",
					sFilter: "GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
				});
				svc.then(oParameters.onSuccess);
			},

			getAccounts: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "Accounts",
					sExpand: oParameters.sExpand,
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oAccountEntity"
				});
				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			createAccount: function(oParameters) {
				var onSuccess = $.proxy(function(oData) {
					cacheProvider.cleanEntitiesCache("oAccountEntity");
					cacheProvider.cleanEntitiesCache("oAccountTypeEntity"); //for cases when accountTypes are readed with Accounts;
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
					this.pubNubMessage({sEntityName: "oAccountEntity", sText: "Account has been created..."});
				},this);
				var oSvc = dataProvider.createEntity({
					sPath: "Accounts",
					sKeyAttribute: "Guid", //needed for links creation
					oData: oParameters.oData,
					aLinks: oParameters.aLinks,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true,
					bCompanyNeeded: true
				});

				oSvc.then(onSuccess);
			},

			updateAccount: function(oParameters) {
				var onSuccess = $.proxy(function(oData) {
					cacheProvider.cleanEntitiesCache("oAccountEntity");
					cacheProvider.cleanEntitiesCache("oAccountTypeEntity"); //for cases when accountTypes are readed with Accounts;					
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
					this.pubNubMessage({sEntityName: "oAccountEntity", sText: "Account has been updated..."});
				}, this);
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "Accounts",
					sKeyAttribute: "Guid", //
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					aLinks: oParameters.aLinks,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSvc.then(onSuccess);
			},

			getCountriesWithProvinces: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "Countrys",
					sFilter: "GeneralAttributes/IsDeleted eq false",
					sExpand: "ProvinceDetails",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oCountryEntity"
				});
				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			getContacts: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "Contacts",
					sExpand: oParameters.sExpand,
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oContactEntity"
				});
				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			getContact: function(oParameters) {
				var svc = dataProvider.getEntity({
					sPath: "Contacts",
					sKey: oParameters.sKey,
					sExpand: "UserDetails,ContactTypeDetails,AccountDetails/AccountTypeDetails,PhaseDetails/ProjectDetails",
					sFilter: "GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
				});
				svc.then(oParameters.onSuccess);
			},

			updateContact: function(oParameters) {
				var onSuccess = $.proxy(function(oData) {
					cacheProvider.cleanEntitiesCache("oContactEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
					this.pubNubMessage({sEntityName: "oContactEntity", sText: "Contact has been updated..."});
				}, this);
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "Contacts",
					sKeyAttribute: "Guid", //
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					aLinks: oParameters.aLinks,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bIgnoreLastModifiedAtValidation: true
				});

				oSvc.then(onSuccess);
			},

			createContact: function(oParameters) {
				var onSuccess = $.proxy(function(oData) {
					cacheProvider.cleanEntitiesCache("oContactEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
					this.pubNubMessage({sEntityName: "oContactEntity", sText: "Contact has been created..."});					
				}, this);
				var oSvc = dataProvider.createEntity({
					sPath: "Contacts",
					sKeyAttribute: "Guid", //needed for links creation
					oData: oParameters.oData,
					aLinks: oParameters.aLinks,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true,
					bCompanyNeeded: true
				});

				oSvc.then(onSuccess);
			},

			getContactsForAccount: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "Contacts",
					sFilter: "GeneralAttributes/IsDeleted eq false and AccountGuid eq '" + oParameters.sAccountGuid + "'",
					sExpand: "UserDetails,ContactTypeDetails,AccountDetails,PhaseDetails/ProjectDetails",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oContactEntity"
				});
				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			getUnitOptionSets: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "UnitOptionSets",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					sExpand: "PhaseDetails/ProjectDetails",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oUnitOptionSetEntity"
				});
				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			createUnitOptionSet: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oUnitOptionSetEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.createEntity({
					sPath: "UnitOptionSets",
					oData: oParameters.oData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true,
					bCompanyNeeded: true,
					aLinks: oParameters.aLinks,
					sKeyAttribute: "Guid",
				});

				oSvc.then(onSuccess);
			},

			updateUnitOptionSet: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oUnitOptionSetEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "UnitOptionSets",
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					aLinks: oParameters.aLinks,
					sKeyAttribute: "Guid",
				});

				oSvc.then(onSuccess);
			},

			getUnitOptionValues: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "UnitOptions",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					sExpand: "UnitOptionSetDetails",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oUnitOptionValueEntity"
				});
				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			createUnitOptionValue: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oUnitOptionValueEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.createEntity({
					sPath: "UnitOptions",
					oData: oParameters.oData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true,
					bCompanyNeeded: true
				});

				oSvc.then(onSuccess);
			},

			updateUnitOptionValue: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oUnitOptionValueEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "UnitOptions",
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSvc.then(onSuccess);
			},

			getTaskTypes: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "TaskTypes",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oTaskTypeEntity"
				});
				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			createTaskType: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oTaskTypeEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.createEntity({
					sPath: "TaskTypes",
					oData: oParameters.oData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true,
					bCompanyNeeded: true
				});

				oSvc.then(onSuccess);
			},

			updateTaskType: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oTaskTypeEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "TaskTypes",
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSvc.then(onSuccess);
			},

			getActivities: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "Activitys",
					// sExpand: "AccountDetails/AccountTypeDetails, ActivityTypeDetails, ContactDetails, PhaseDetails/ProjectDetails, UnitDetails/PhaseDetails, UserDetails",
					sExpand: oParameters.sExpand,
					//sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					sFilter: oParameters.sFilter,
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oActivityEntity"
				});
				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			getActivity: function(oParameters) {
				var svc = dataProvider.getEntity({
					sPath: "Activitys",
					sKey: oParameters.sKey,
					sExpand: oParameters.sExpand,
					sFilter: "GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
				});
				svc.then(oParameters.onSuccess);
			},

			updateActivity: function(oParameters) {
				var onSuccess = $.proxy(function(oData) {
					cacheProvider.cleanEntitiesCache("oActivityEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
					this.pubNubMessage({sEntityName: "oActivityEntity", sText: "Activity has been updated..."});	
				}, this);
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "Activitys",
					sKeyAttribute: "Guid", //
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					aLinks: oParameters.aLinks,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSvc.then(onSuccess);
			},

			createActivity: function(oParameters) {
				var onSuccess = $.proxy(function(oData) {
					cacheProvider.cleanEntitiesCache("oActivityEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
					this.pubNubMessage({sEntityName: "oActivityEntity", sText: "Activity has been created..."});					
				}, this);
				var oSvc = dataProvider.createEntity({
					sPath: "Activitys",
					sKeyAttribute: "Guid", //needed for links creation
					oData: oParameters.oData,
					aLinks: oParameters.aLinks,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true,
					bCompanyNeeded: true
				});

				oSvc.then(onSuccess);
			},

			getDeficiencies: function(oParameters) {
				var svc = {};
				if (oParameters.bNoCaching) {
					svc = dataProvider.getEntitySet({
						sPath: "Tasks",
						sExpand: oParameters.sExpand,
						//sExpand: "UserDetails,ContactTypeDetails,AccountDetails/AccountTypeDetails,PhaseDetails/ProjectDetails",
						sFilter: oParameters.sFilter,
						bShowSpinner: oParameters.bShowSpinner,
						// oCacheProvider: cacheProvider,
						// sCacheProviderAttribute: "oDeficiencyEntity"
					});
				} else {
					svc = dataProvider.getEntitySet({
						sPath: "Tasks",
						sExpand: oParameters.sExpand,
						//sExpand: "UserDetails,ContactTypeDetails,AccountDetails/AccountTypeDetails,PhaseDetails/ProjectDetails",
						sFilter: oParameters.sFilter,
						bShowSpinner: oParameters.bShowSpinner,
						oCacheProvider: cacheProvider,
						sCacheProviderAttribute: "oDeficiencyEntity"
					});
				}


				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			getDeficiency: function(oParameters) {
				var svc = dataProvider.getEntity({
					sPath: "Tasks",
					sKey: oParameters.sKey,
					sExpand: oParameters.sExpand, //"UserDetails,ContactTypeDetails,AccountDetails,PhaseDetails/ProjectDetails",
					sFilter: "GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
				});
				svc.then(oParameters.onSuccess);
			},

			onSuccessUpdateDeficiency: function(oParameters, oData) {
				cacheProvider.cleanEntitiesCache("oDeficiencyEntity");
				if (oParameters.onSuccess) {
					oParameters.onSuccess(oData);
				}
				this.pubNubMessage({sEntityName: "oDeficiencyEntity", sText: "Deficiency has been updated..."});
			},

			updateDeficiency: function(oParameters) {
				var onSuccess = $.proxy(function(oData) {
					this.onSuccessUpdateDeficiency(oParameters, oData);
				}, this);
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "Tasks",
					sKeyAttribute: "Guid", //
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					aLinks: oParameters.aLinks,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSvc.then(onSuccess);
			},

			updateDeficiencies: function(oParameters) {
				var oSrv = {};
				var oRequestData = {
					__batchRequests: []
				};
				var aData = [];
				var oData = {};

				for (var i = 0; i < oParameters.aData.length; i++) {
					oData = {
						requestUri: "Tasks('" + oParameters.aData[i].Guid + "')",
						method: "PUT",
						data: oParameters.aData[i]
					};

					aData.push(oData);
				}

				dataProvider.constructChangeBlockForBatch({
					oRequestData: oRequestData,
					aData: aData
				});

				oSrv = dataProvider.batchRequest({
					oRequestData: oRequestData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSrv.then($.proxy(function(aData) {
					this.onSuccessUpdateDeficiency(oParameters);
				}, this));
			},

			createDeficiency: function(oParameters) {
				var onSuccess = $.proxy(function(oData) {
					this.onSuccessUpdateDeficiency(oParameters, oData);
				}, this);
				var oSvc = dataProvider.createEntity({
					sPath: "Tasks",
					sKeyAttribute: "Guid", //needed for links creation
					oData: oParameters.oData,
					aLinks: oParameters.aLinks,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true,
					bCompanyNeeded: true
				});

				oSvc.then(onSuccess);
			},

			getUnits: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "Units",
					sExpand: oParameters.sExpand,
					sFilter: oParameters.sFilter,
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oUnitEntity"
				});
				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			getUnit: function(oParameters) {
				var svc = dataProvider.getEntity({
					sPath: "Units",
					sKey: oParameters.sKey,
					sExpand: oParameters.sExpand, //"UserDetails,ContactTypeDetails,AccountDetails,PhaseDetails/ProjectDetails",
					sFilter: "GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
				});
				svc.then(oParameters.onSuccess);
			},

			updateUnit: function(oParameters) {
				var onSuccess = $.proxy(function(oData) {
					cacheProvider.cleanEntitiesCache("oUnitEntity");
					cacheProvider.cleanEntitiesCache("oPhaseEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
					this.pubNubMessage({sEntityName: "oUnitEntity", sText: "Unit has been updated..."});
				},this);
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "Units",
					sKeyAttribute: "Guid", //
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					aLinks: oParameters.aLinks,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSvc.then(onSuccess);
			},

			createUnit: function(oParameters) {
				var onSuccess = $.proxy(function(oData) {
					cacheProvider.cleanEntitiesCache("oUnitEntity");
					cacheProvider.cleanEntitiesCache("oPhaseEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
					this.pubNubMessage({sEntityName: "oUnitEntity", sText: "Unit has been created..."});
				}, this);
				var oSvc = dataProvider.createEntity({
					sPath: "Units",
					sKeyAttribute: "Guid", //needed for links creation
					oData: oParameters.oData,
					aLinks: oParameters.aLinks,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true,
					bCompanyNeeded: true
				});

				oSvc.then(onSuccess);
			},

			updateFileMetadataSet: function(oParameters) {
				var onSuccess = function(oData) {
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "FileMetadataSets",
					sKeyAttribute: "Guid",
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSvc.then(onSuccess);
			},

			getFileMetadatas: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "FileMetadatas",
					sExpand: oParameters.sExpand,
					sFilter: oParameters.sFilter,
					bShowSpinner: oParameters.bShowSpinner,
					// oCacheProvider: cacheProvider,
					// sCacheProviderAttribute: "oFileMetadataEntity"
				});
				if (svc instanceof Array) {
					oParameters.onSuccess(svc); // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			updateFileMetadata: function(oParameters) {
				var onSuccess = function(oData) {
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "FileMetadatas",
					sKeyAttribute: "Guid",
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bIgnoreLastModifiedAtValidation: true
				});

				oSvc.then(onSuccess);
			},

			getEntityComments: function(oParameters) {
				var svc = dataProvider.getEntity({
					sPath: "CommentSets",
					sKey: oParameters.sKey,
					sExpand: oParameters.sExpand, //"UserDetails,ContactTypeDetails,AccountDetails,PhaseDetails/ProjectDetails",
					sFilter: "GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
				});
				svc.then(function(oData) {
					var aComments = [];
					for (var i = 0; i < oData.CommentDetails.results.length; i++) { // filtering here needed only untill bug 414 in Olingo will be resolved (UI filtering will be replaced by oData filtering)
						if (!oData.CommentDetails.results[i].GeneralAttributes.IsDeleted) {
							aComments.push(oData.CommentDetails.results[i]);
						}
					}
					oData.CommentDetails.results = angular.copy(aComments);
					oParameters.onSuccess(oData);
				});
			},

			getEntityAttachments: function(oParameters) {
				var svc = dataProvider.getEntity({
					sPath: "FileMetadataSets",
					sKey: oParameters.sKey,
					sExpand: oParameters.sExpand, //"UserDetails,ContactTypeDetails,AccountDetails,PhaseDetails/ProjectDetails",
					sFilter: "GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
				});
				svc.then(function(oData) {
					var aAttachments = [];
					for (var i = 0; i < oData.FileMetadataDetails.results.length; i++) { // filtering here needed only untill bug 414 in Olingo will be resolved (UI filtering will be replaced by oData filtering)
						if (!oData.FileMetadataDetails.results[i].GeneralAttributes.IsDeleted) {
							aAttachments.push(oData.FileMetadataDetails.results[i]);
						}
					}
					oData.FileMetadataDetails.results = angular.copy(aAttachments);
					oParameters.onSuccess(oData);
				});
			},

			updateEntityAttachment: function(oParameters) {
				var onSuccess = function(oData) {
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "FileMetadatas",
					sKeyAttribute: "Guid", //
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSvc.then(onSuccess);
			},

			updateComment: function(oParameters) {
				var onSuccess = function(oData) {
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "Comments",
					sKeyAttribute: "Guid",
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bIgnoreLastModifiedAtValidation: true
				});

				oSvc.then(onSuccess);
			},

			createComment: function(oParameters) {
				var onSuccess = function(oData) {
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
					//this.logEvent
				};
				var oSvc = dataProvider.createEntity({
					sPath: "Comments",
					sKeyAttribute: "Guid", //needed for links creation
					oData: oParameters.oData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true,
					bCompanyNeeded: false
				});

				oSvc.then(onSuccess);
			},

			generateReport: function(oParameters) {
				$.download('xdocReportsService', oParameters.oReportParameters, "post");
			}
		}
	}
]);