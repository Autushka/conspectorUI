app.factory('apiProvider', ['dataProvider', 'CONSTANTS', '$q', 'utilsProvider', 'cacheProvider',
	function(dataProvider, CONSTANTS, $q, utilsProvider, cacheProvider) {
		return {
			getUserProfile: function(sUserName) {
				var sPath = CONSTANTS.sServicePath + "Users('" + sUserName + "')?$expand=RoleDetails&$format=json";
				var aUserRoles = [];
				var sCreatedAt = "";
				var sLastModifiedAt = "";
				var bIsInitialPassword = false;
				var onSuccess = function(oData) {
					bIsInitialPassword = oData.d.IsPasswordInitial;
					sLastModifiedAt = oData.d.LastModifiedAt;
					for (var i = 0; i < oData.d.RoleDetails.results.length; i++) {
						aUserRoles.push(oData.d.RoleDetails.results[i]);
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
					bIsInitialPassword: bIsInitialPassword,
					sLastModifiedAt: sLastModifiedAt
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

			resetPasswordWithPRCode: function(oData) {
				var deffered = $q.defer();

				var oSrv = dataProvider.httpRequest({
					sPath: "jsp/account/passwordRecoveryNewPassword.jsp",
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

			resetPassword: function(oData) {
				var deffered = $q.defer();

				var oSrv = dataProvider.httpRequest({
					sPath: "jsp/account/passwordRecovery.jsp",
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

			getAttachments: function(oParameters){
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

			getUser: function(oParameters) {
				var svc = dataProvider.getEntity({
					sPath: "Users",
					sKey: oParameters.sKey,
					sFilter: "GeneralAttributes/IsDeleted eq false",
					bShowSpinner: oParameters.bShowSpinner,
				});
				svc.then(oParameters.onSuccess);
			},	

			createUser: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oUserEntity");
					oParameters.onSuccess(oData);
				};
				var oSvc = dataProvider.createEntity({
					sPath: "Users",
					oData: oParameters.oData,
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
					oParameters.onSuccess(oData);
				};
				var oSvc = dataProvider.updateEntity({
					bShowSpinner: oParameters.bShowSpinner,
					sPath: "Users",
					sKey: oParameters.sKey,
					oData: oParameters.oData,
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
					bGuidNeeded: true
				});

				oSvc.then(onSuccess);
			},

			getOperationLogs: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "OperationLogs",
					sFilter: "GeneralAttributes/IsDeleted eq false",
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
					sFilter: "GeneralAttributes/IsDeleted eq false",
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
					oParameters.onSuccess(oData);
				};
				var oSvc = dataProvider.createEntity({
					sPath: "Projects",
					oData: oParameters.oData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true
				});

				oSvc.then(onSuccess);
			},

			updateProject: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oProjectEntity");
					oParameters.onSuccess(oData);
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
					sFilter: "GeneralAttributes/IsDeleted eq false",
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
					oParameters.onSuccess(oData);
				};
				var oSvc = dataProvider.createEntity({
					sPath: "Phases",
					oData: oParameters.oData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true
				});

				oSvc.then(onSuccess);
			},

			updatePhase: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oPhaseEntity");
					oParameters.onSuccess(oData);
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

			getRoles: function(oParameters) {
				var svc = dataProvider.getEntitySet({
					sPath: "Roles",
					sFilter: "GeneralAttributes/IsDeleted eq false",
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
					bGuidNeeded: false
				});

				oSvc.then(onSuccess);
			},

			updateRole: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oRoleEntity");
					oParameters.onSuccess(oData);
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
					sFilter: "GeneralAttributes/IsDeleted eq false",
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
					oParameters.onSuccess(oData);
				};
				var oSvc = dataProvider.createEntity({
					sPath: "TaskStatuss",
					oData: oParameters.oData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
					bGuidNeeded: true
				});

				oSvc.then(onSuccess);
			},

			updateDeficiencyStatus: function(oParameters) {
				var onSuccess = function(oData) {
					cacheProvider.cleanEntitiesCache("oTaskStatusEntity");
					oParameters.onSuccess(oData);
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
		}
	}
]);