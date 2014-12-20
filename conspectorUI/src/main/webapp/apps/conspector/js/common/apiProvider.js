app.factory('apiProvider', ['dataProvider', 'CONSTANTS', '$q', 'utilsProvider', 'cacheProvider',
	function(dataProvider, CONSTANTS, $q, utilsProvider, cacheProvider) {
		return {
			getUserProfile: function(sUserName) {
				var sPath = CONSTANTS.sServicePath + "Users('" + sUserName + "')?$expand=RoleDetails&$format=json";
				var aUserRoles = [];
				var bIsInitialPassword = false;
				var onSuccess = function(oData) {
					bIsInitialPassword = oData.d.IsPasswordInitial;
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
			},

			logEvent: function(oParameters) {
				var oData = {
					GeneralAttributes: {
						IsArchived: false,
						IsDeleted: false,
						SortingSequence: 0,
					}
				};
				oData.Guid = utilsProvider.generateGUID();
				oData.Operation = oParameters.sOperation;
				oData.OperationContent = JSON.stringify(oParameters.oContent);
				oData.UserName = oParameters.sUserName;
				oData.TimeStamp = utilsProvider.dateToDBDate(new Date()); //"/Date(1414263469000)/"; 

				dataProvider.createEntity({
					sPath: "OperationLogs",
					oData: oData
				});
			},

			getProjects: function(oParameters){
				var svc = dataProvider.getEntitySet({
					sPath: "Projects",
					bShowSpinner: oParameters.bShowSpinner,
					oCacheProvider: cacheProvider,
					sCacheProviderAttribute: "oProjectEntity"
				});	

				if(svc instanceof Array){
					oParameters.onSuccess(svc)// data retrived from cache
				}else{
					svc.then(oParameters.onSuccess);
				}		
			},

			createProject: function(oParameters){
				var onSuccess = function(oData){
					cacheProvider.cleanEntitiesCache("oProjectEntity");
					oParameters.onSuccess(oData);
				};
				oParameters.oData.Guid = utilsProvider.generateGUID();
				var oSvc = dataProvider.createEntity({
					sPath: "Projects",
					oData: oParameters.oData,
					bShowSpinner: oParameters.bShowSpinner,
					bShowSuccessMessage: oParameters.bShowSuccessMessage,
					bShowErrorMessage: oParameters.bShowErrorMessage,
				});	

				oSvc.then(onSuccess);
			},

			updateProject: function(oParameters){
				var onSuccess = function(oData){
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
			}
		}
	}
]);