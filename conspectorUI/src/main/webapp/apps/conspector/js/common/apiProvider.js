app.factory('apiProvider', ['dataProvider', 'CONSTANTS', '$q', 'utilsProvider', 'cacheProvider', 'PubNub',
	function(dataProvider, CONSTANTS, $q, utilsProvider, cacheProvider, PubNub) {
		return {
			getUserProfile: function(sUserName) {
				var sPath = CONSTANTS.sServicePath + "Users('" + sUserName + "')?$expand=CompanyDetails,RoleDetails,PhaseDetails/ProjectDetails&$format=json";
				var aUserCompanies = [];
				var aUserRoles = [];
				var aUserPhases = [];
				var sCreatedAt = "";
				var sLastModifiedAt = "";
				var bIsInitialPassword = false;
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
					aGloballySelectedPhasesGuids: [] //will be bopupated in appController
				};
			},

			getCurrentUserName: function() {
				var sPath = "rest/account/getCurrentUserName";
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
				var sPath = "rest/account/getCurrentCompany";
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
					sPath: "rest/account/setCurrentCompany/" + sCompany,
					bAsync: false,
					sRequestType: "GET",
				});
			},

			getCurrentRole: function() {
				var sPath = "rest/account/getCurrentRole";
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
					sPath: "rest/account/setCurrentRole/" + sRole,
					bAsync: false,
					sRequestType: "GET",
				});
			},

			resetPasswordWithPRCode: function(oParameters) {
				var oSrv = dataProvider.httpRequest({
					sPath: "rest/account/passwordRecoveryWithPRCode/" + oParameters.oData.passwordRecoveryCode + "/" + oParameters.oData.newPassword,
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
					sPath = "rest/account/passwordRecovery/userName/" + oParameters.oData.userName;
				} else {
					sPath = "rest/account/passwordRecovery/email/" + oParameters.oData.email;
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
				var sPath = "rest/account/hashPassword/" + sPassword;
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

			getUsersWithCompaniesPhasesAndRoles: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "Users",
					sExpand: "CompanyDetails,PhaseDetails,RoleDetails",
					sFilter: "GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oUserEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc) // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			getUserWithCompaniesPhasesAndRoles: function(oParameters) {
				var svc = dataProvider.getEntity({
					sPath: "Users",
					sKey: oParameters.sKey,
					sExpand: "CompanyDetails,PhaseDetails/ProjectDetails,RoleDetails",
					sFilter: "GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
				});
				svc.then(oParameters.onSuccess);
			},

			createUser: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oUserEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
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
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oUserEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
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

			logEvent: function(oParameters) {
				var oData = oParameters.oData;
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oOperationLogEntity");
				};
				oData.OperationContent = JSON.stringify(oParameters.oData.OperationContent);

				var oSvc = dataProvider.createEntity({
					sPath: "OperationLogs",
					oData: oData,
					bGuidNeeded: true,
					bCompanyNeeded: true
				});

				oSvc.then(onSuccess);
			},

			getOperationLogs: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "OperationLogs",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oOperationLogEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc) // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			getProjects: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "Projects",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oProjectEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc) // data retrived from cache
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
					oParameters.onSuccess(svc) // data retrived from cache
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
					sExpand: "ProjectDetails",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oPhaseEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc) // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
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

			getCompanies: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "Companys",
					sFilter: "GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oCompanyEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc) // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			createCompany: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oCompanyEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.createEntity({
					sPath: "Companys",
					oData: oParameters.oData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: false
				});

				oSvc.then(onSuccess);
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
					oParameters.onSuccess(svc) // data retrived from cache
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
					oParameters.onSuccess(svc) // data retrived from cache
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

			getAccountTypes: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "AccountTypes",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oAccountTypeEntity"
				});

				if (svc instanceof Array) {
					oParameters.onSuccess(svc) // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
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
					oParameters.onSuccess(svc) // data retrived from cache
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

			getDeficiencyPriorities: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "TaskPrioritys",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oTaskPriorityEntity"
				});
				if (svc instanceof Array) {
					oParameters.onSuccess(svc) // data retrived from cache
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

			getContractorsWithPhases: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "Accounts",
					sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false",
					sExpand: "PhaseDetails/ProjectDetails",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oAccountEntity"
				});
				if (svc instanceof Array) {
					oParameters.onSuccess(svc) // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			getContractorWithPhases: function(oParameters) {
				var svc = dataProvider.getEntity({
					sPath: "Accounts",
					sKey: oParameters.sKey,
					sExpand: "PhaseDetails/ProjectDetails",
					sFilter: "GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
				});
				svc.then(oParameters.onSuccess);
			},

			createAccount: function(oParameters) {
				var onSuccess = function(oData) {
					PubNub.ngPublish({
						channel: "conspectorPubNub" + cacheProvider.oUserProfile.sCurrentCompany,
						message: {
							sEntityName: "oAccountEntity",
							sText: "Account has been created...",
							sUserName: cacheProvider.oUserProfile.sUserName,
						}
					});
					cacheProvider.cleanEntitiesCache("oAccountEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
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
				var onSuccess = function(oData) {
					PubNub.ngPublish({
						channel: "conspectorPubNub" + cacheProvider.oUserProfile.sCurrentCompany,
						message: {
							sEntityName: "oAccountEntity",
							sText: "Account has been updated...",
							sUserName: cacheProvider.oUserProfile.sUserName,
						}
					});
					cacheProvider.cleanEntitiesCache("oAccountEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
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
					oParameters.onSuccess(svc) // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

			getContact: function(oParameters) {
				var svc = dataProvider.getEntity({
					sPath: "Contacts",
					sKey: oParameters.sKey,
					sExpand: "UserDetails,ContactTypeDetails,AccountDetails,PhaseDetails/ProjectDetails",
					sFilter: "GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
				});
				svc.then(oParameters.onSuccess);
			},

			updateContact: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oContactEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "Contacts",
					sKeyAttribute: "Guid", //
					sKey: oParameters.sKey,
					oData: oParameters.oData,
					aLinks: oParameters.aLinks,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});

				oSvc.then(onSuccess);
			},

			createContact: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oContactEntity");
					if (oParameters.onSuccess) {
						oParameters.onSuccess(oData);
					}
				};
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
					oParameters.onSuccess(svc) // data retrived from cache
				} else {
					svc.then(oParameters.onSuccess);
				}
			},

		}
	}
]);