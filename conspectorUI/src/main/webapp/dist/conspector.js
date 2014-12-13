var app = angular.module('conspector', ['ui.router', 'viewControllers', 'pascalprecht.translate', 'ngCookies', 'ngTable']);
var viewControllers = angular.module('viewControllers', []);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/signIn");
	
	$stateProvider.state('signIn', {
		url: '/signIn',
		templateUrl: 'apps/conspector/components/userManagement/templates/signInView.html',
		controller: 'signInView'});
//	.state('forgotPassword', {
//		url: '/forgotPassword',
//		templateUrl: 'apps/conspector/views/userManagement/forgotPasswordView.html',
//		controller: 'forgotPasswordView'})
//	.state('resetPassword', {
//		url: '/resetPassword/:pr',
//		templateUrl: 'apps/conspector/views/userManagement/resetPasswordView.html',
//		controller: 'resetPasswordView'})
//	.state('emailActivation', {
//		url: '/emailActivation/:ev',
//		templateUrl: 'apps/conspector/views/userManagement/emailActivationView.html',
//		controller: 'emailActivationView'})
//		
//		
//				
//	.state('app', {
//		url: '/app',			
//		templateUrl: 'apps/conspector/views/appView.html',
//		controller: 'appView'})	
//			
//	.state('app.deficienciesList', {
//		url: '/deficienciesList',
//		templateUrl: 'apps/conspector/views/deficiencies/deficienciesListView.html',
//		controller: 'deficienciesListView'})
//		
//	.state('app.deficienciesListEndUser', {
//		url: '/deficienciesListEndUser',
//		templateUrl: 'apps/conspector/views/deficiencies/deficienciesListEndUserView.html',
//		controller: 'deficienciesListView'})			
//		
//	.state('app.deficiencyDetails', {
//		url: '/deficiencyDetails',
//		templateUrl: 'apps/conspector/views/deficiencies/deficiencyDetailsView.html',
//		controller: 'deficiencyDetailsView'})	
//		
//	.state('app.deficiencyDetailsEndUser', {
//		url: '/deficiencyDetailsEndUser',
//		templateUrl: 'apps/conspector/views/deficiencies/deficiencyDetailsEndUserView.html',
//		controller: 'deficiencyDetailsView'})			
//		
//	.state('deficienciesListPrintForm', {
//		url: '/deficienciesListPrintForm',
//		templateUrl: 'apps/conspector/views/deficiencies/deficienciesListPrintFormView.html',
//		controller: 'deficienciesListPrintFormView'})			
//			
//	.state('app.unitsList', {
//		url: '/unitsList',
//		templateUrl: 'apps/conspector/views/units/unitsListView.html',
//		controller: 'unitsListView'})	
//	.state('app.unitDetails', {
//		url: '/unitDetails',
//		templateUrl: 'apps/conspector/views/units/unitDetailsView.html',
//		controller: 'unitDetailsView'})	
//
//	.state('app.accountsList', {
//		url: '/accountsList',
//		templateUrl: 'apps/conspector/views/accounts/accountsListView.html',
//		controller: 'accountsListView'})	
//	.state('app.accountDetails', {
//		url: '/accountDetails',
//		templateUrl: 'apps/conspector/views/accounts/accountDetailsView.html',
//		controller: 'accountDetailsView'})	
//
//	.state('app.adminArea', {
//		url: '/adminArea',			
//		templateUrl: 'apps/conspector/views/adminArea/adminAreaView.html',
//		controller: 'adminAreaView'})
//	.state('app.adminArea.userManagement', {
//		url: '/userManagement',			
//		templateUrl: 'apps/conspector/views/adminArea/userManagementView.html',
//		controller: 'userManagementView'})
//	.state('app.adminArea.addNewUser', {
//		url: '/addNewUser',			
//		templateUrl: 'apps/conspector/views/adminArea/addNewUserView.html',
//		controller: 'addNewUserView'})
//	.state('app.adminArea.projects', { 
//		url: '/projects',			
//		templateUrl: 'apps/conspector/views/adminArea/projectsView.html',
//		controller: 'projectsView'})
//	.state('app.adminArea.phases', {
//		url: '/phases',			
//		templateUrl: 'apps/conspector/views/adminArea/phasesView.html',
//		controller: 'phasesView'})
//	.state('app.adminArea.statuses', {
//		url: '/statuses',			
//		templateUrl: 'apps/conspector/views/adminArea/statusesView.html',
//		controller: 'statusesView'})
//	.state('app.adminArea.priorities', {
//		url: '/priorities',			
//		templateUrl: 'apps/conspector/views/adminArea/prioritiesView.html',
//		controller: 'prioritiesView'})
//	.state('app.adminArea.accountTypes', {
//		url: '/accountTypes',			
//		templateUrl: 'apps/conspector/views/adminArea/accountTypesView.html',
//		controller: 'accountTypesView'})	
//
//	.state('app.userSettings', {
//		url: '/userSettings',
//		templateUrl: 'apps/conspector/views/userSettings/userSettingsView.html',
//		controller: 'userSettingsView'})
//	.state('app.userSettings.myProfile', {
//		url: '/myProfile',
//		templateUrl: 'apps/conspector/views/userSettings/myProfileView.html',
//		controller: 'myProfileView'})
//	.state('app.userSettings.changePassword', {
//		url: '/changePassword',	
//		templateUrl: 'apps/conspector/views/userSettings/changePasswordView.html',
//		controller: 'changePasswordView'});
}]);




;app.factory('CONSTANTS', ['dataProvider', function(dataProvider) {
	return {
		messageDisplayTime: 5000,
		messageDisplayLayout: 'topCenter',
		currentProject: 'conspector',
		appPathname: "",
		sServicePath: "odata.svc/"
	}
}]);





// var CONSTANTS = (function ($) {
// 	var constants = {};
// 	constants.messageDisplayTime = 5000;
// 	constants.messageDisplayLayout = 'topCenter';
// 	constants.currentProject = 'conspector';
// 	constants.appPathname = "";
// 	constants.sServicePath = "odata.svc/";	
// 	return constants;
// }(jQuery));





;app.controller('mainController', ['$scope', function($scope) {

}]);;app.factory('rolesSettings', [function() {
	return {
		oInitialViews : {systemAdministrator: "#/app/deficienciesList"}
	}
}]);







// var MENUS = (function($) {
// 	var menus = {
// 		navigation : {
// 			aMainNavigationLinks : []
// 		},
// 		oInitialViews : {}
// 	};
// 	menus.navigation.aMainNavigationLinks.push({
// 		role : "",
// 		items : []
// 	});
// 	menus.navigation.aMainNavigationLinks.push({
// 		role : "technicalAdministrator",
// 		items : [ {
// //			linkTE: "Deficiencies",
// //			classes: "mainNavLnk tab-deficiencies",
// //			stateToNavigate: "app.deficienciesList",
// //			globalStateObject: $state,
// //			hash: "#/app/deficienc"
// //		}, {
// //			linkTE: $scope.unitsTE,
// //			classes: "mainNavLnk tab-units",
// //			stateToNavigate: "app.unitsList",
// //			globalStateObject: $state,
// //			hash: "#/app/unit"	
// //		}, {
// //			linkTE: $scope.contractorsTE,
// //			classes: "mainNavLnk tab-clients",
// //			stateToNavigate: "app.accountsList",
// //			globalStateObject: $state,
// //			hash: "#/app/account"
// //		}, {
// //			linkTE: $scope.settingsTE,
// //			classes: "mainNavLnk tab-settings",
// //			stateToNavigate: "app.userSettings.myProfile",
// //			globalStateObject: $state,
// //			hash: "#/app/userSettings"	
// //		}, {
// //			linkTE: $scope.adminPanelTE,
// //			classes: "mainNavLnk tab-admin",
// //			stateToNavigate: "app.adminArea.userManagement",
// //			globalStateObject: $state,
// //			hash: "#/app/adminArea"
// 		} ]
// 	});
// 	menus.navigation.aMainNavigationLinks.push({
// 		role : "user",
// 		items :  [ {
// //			linkTE: $scope.deficienciesTE,
// //			classes: "mainNavLnk tab-deficiencies",
// //			stateToNavigate: "app.deficienciesList",
// //			globalStateObject: $state,
// //			hash: "#/app/deficienc"
// //		}, {
// //			linkTE: $scope.unitsTE,
// //			classes: "mainNavLnk tab-units",
// //			stateToNavigate: "app.unitsList",
// //			globalStateObject: $state,
// //			hash: "#/app/unit"	
// //		}, {
// //			linkTE: $scope.contractorsTE,
// //			classes: "mainNavLnk tab-clients",
// //			stateToNavigate: "app.accountsList",
// //			globalStateObject: $state,
// //			hash: "#/app/account"
// //		}, {
// //			linkTE: $scope.settingsTE,
// //			classes: "mainNavLnk tab-settings",
// //			stateToNavigate: "app.userSettings.myProfile",
// //			globalStateObject: $state,
// //			hash: "#/app/userSettings"	
// 		}]
// 	});
	
// 	menus.oInitialViews.systemAdministrator = "#/app/deficienciesList";
	
	

// //	menus.initialViews.push({
// //		role : "",
// //		initialView : "#/signIn"
// //	});
// //	menus.initialViews.push({
// //		role : "user",
// //		initialView : "#/app/deficienciesList"
// //	});
// //	menus.initialViews.push({
// //		role : "test",
// //		initialView : "#/template/"
// //	});
// //	menus.initialViews.push({
// //		role : "technicalAdministrator",
// //		initialView : "#/app/deficienciesList"
// //	});
// //	
// //	menus.initialViews.push({
// //		role : "endUser",
// //		initialView : "#/app/deficienciesListEndUser"
// //	});	

// 	menus.newUserInitialRole = "user";

// //	menus.appRoles = [ "user", "technicalAdministrator", "endUser" ];

// 	return menus;
// }(jQuery));;//types
app.factory('TYPES', [function() {
	return {
		oEntityCacheStructure: {
			aCachedRequests: [], // array with content {sRequestSettings: "", aEntitiesArray: []}
			oCurrentEntity: {},
			bDisplayMode: true,
			bCreateNewMode: false,
			sListSearchFilter: "",
			oListColumnFilters: {},
			oListSelectCriterias: {}			
		}
	}
}]);
;app.factory('apiProvider', ['dataProvider', function(dataProvider) {
	return {
		getUserProfile: function(sUserName) {
			var sPath = CONSTANTS.sServicePath + "Users('" + sUserName + "')?$expand=User_RoleDetails/RoleDetails&$format=json";
			var aUserRoles = [];
			var bIsInitialPassword = false;
			var onSuccess = function(oData) {
				bIsInitialPassword = oData.d.bIsInitialPassword;
				for (var i = 0; i < oData.d.User_RoleDetails.results.length; i++) {
					aUserRoles.push(oData.d.User_RoleDetails.results[i].RoleDetails.RoleName);
				}
			}

			dataProvider.ajaxRequest({
				sPath: sPath,
				bAsync: false,
				sRequestType: "GET",
				oEventHandlers: {
					onSuccess: onSuccess
				}
			});
			return {sUserName: sUserName, aUserRoles: aUserRoles, bIsInitialPassword: bIsInitialPassword};
		},
	}
}]);;app.factory('cacheProvider', ['TYPES', function(TYPES) {
	return {
		oEntitiesCache: {
			oDeficiencyEntity: TYPES.oEntityCacheStructure,
			oAccountEntity: TYPES.oEntityCacheStructure,
			oUnitEntity: TYPES.oEntityCacheStructure,
			oUserEntity: TYPES.oEntityCacheStructure,
			oRoleEntity: TYPES.oEntityCacheStructure,
			oProjectEntity: TYPES.oEntityCacheStructure,
			oStatusEntity: TYPES.oEntityCacheStructure,
			oPriorityEntity: TYPES.oEntityCacheStructure,
			oVersion: TYPES.oEntityCacheStructure,
			oAccountTypeEntity: TYPES.oEntityCacheStructure
		},

		oUserProfile: {},

		getFromCache: function(sCacheProviderAttribute, sRequestSettings) {
			for (var i = 0; i < this.oEntitiesCache[sCacheProviderAttribute].aCachedRequests.length; i++) {
				if (this.oEntitiesCache[sCacheProviderAttribute].aCachedRequests[i].sRequestSettings === sRequestSettings) {
					return this.oEntitiesCache[sCacheProviderAttribute].aCachedRequests[i].aEntitiesArray;
				}
			}
			return [];
		},

		putToCache: function(sCacheProviderAttribute, sRequestSettings, aArray) {
			this.oEntitiesCache[sCacheProviderAttribute].aCachedRequests.push({
				sRequestSettings: sRequestSettings,
				aEntitiesArray: aArray
			});
		},

		cleanEntitiesCache: function(sForEntity, sRequestSettings) {
			if (sForEntity && !sRequestSettings) {
				this.oEntitiesCache[sForEntity] = TYPES.oEntityCacheStructure;
				return;
			}
			if (sForEntity && sRequestSettings) {
				for (var i = 0; i < this.oEntitiesCache[sForEntity].aCachedRequests.length; i++) {
						if (this.oEntitiesCache[sForEntity].aCachedRequests[i].sRequestSettings === sRequestSettings) {
						this.oEntitiesCache[sForEntity].aCachedRequests.splice(i, 1);
						break;
					}
				};
				return;
			}
			for (var sAttribute in this.oEntitiesCache) {
				this.oEntitiesCache[sAttribute] = TYPES.oEntityCacheStructure;
			}
		}
	}
}]);;app.factory('genericODataFactory', ['$resource', 'CONSTANTS', function($resource, CONSTANTS) {
	var sServicePath = CONSTANTS.sServicePath;

	return $resource("", {}, {
		'getEntitySetWithFilterAndExpand': {
			method: "GET",
			url: sServicePath + ":path" + '?$filter=' + ":filter" + '&$expand=' + ":expand" + '&$format=json'
		},
		'getEntitySetWithFilter': {
			method: "GET",
			url: sServicePath + ":path" + '?$filter=' + ":filter" + '&$format=json'
		},
		'getEntitySetWithExpand': {
			method: "GET",
			url: sServicePath + ":path" + '?$expand=' + ":expand" + '&$format=json'
		},
		'getEntitySet': {
			method: "GET",
			url: sServicePath + ":path" + '?$format=json'
		},
		'post': {
			method: "POST",
			url: sServicePath + ":path"
		},
		'put': {
			method: 'PUT',
			params: {
				key: "@key"
			},
			url: sServicePath + ":path" + "(':key')" + '?$format=json'
		},
		'getEntity': {
			method: 'GET',
			params: {
				key: "@key"
			},
			url: sServicePath + ":path" + "(':key')" + '?$expand=' + ":expand" + '&$format=json'
		},
		'delete': {
			method: 'DELETE',
			params: {
				key: "@key"
			},
			url: sServicePath + ":path" + "(':key')"
		}
	});
}]);

app.factory('dataProvider', ['genericODataFactory', 'utilsProvider', '$q', '$rootScope', function(genericODataFactory, utilsProvider, $q, $rootScope) {
	return {
		commonOnSuccess: function(oParameters) {
			if (oParameters.bShowSpinner) {
				$rootScope.$emit('UNLOAD');
			}
			if (oParameters.bShowSuccessMessage) {
				utilsProvider.displayMessage({
					sText: jQuery.i18n.prop('globalTE.successOperationNoticeTE'),
					sType: 'success'
				});
			}
		},
		commonOnError: function(oParameters, deffered) {
			if (oParameters.bShowSpinner) {
				$rootScope.$emit('UNLOAD');
			}
			if (oParameters.bShowErrorMessage) {
				utilsProvider.displayMessage({
					sText: jQuery.i18n.prop('globalTE.failureOperationNoticeTE'),
					sType: 'error'
				});
			}
			deffered.reject();
		},

		getEntitySet: function(oParameters) { //bShowSpinner, sPath, sFilter, sExpand, oCacheProvider, sCacheProviderAttribute 
			var oOdataSrv = {};
			var deffered = $q.defer();
			var aCacheedEntities = [];
			var sRequestSettings = oParameters.sKey + oParameters.sFilter + oParameters.sExpand;

			//return cash for request with specific settings (key, filter and expand) if required
			if (oParameters.oCacheProvider && oParameters.sCacheProviderAttribute) {
				aCacheedEntities = oParameters.oCacheProvider.getFromCache(oParameters.sCacheProviderAttribute, sRequestSettings);
				if(aCacheedEntities.length){
					return aCacheedEntities;
				}
			}
			if (oParameters.bShowSpinner) {
				$rootScope.$emit('LOAD');
			}
			if (oParameters.sFilter && oParameters.sExpand) {
				oOdataSrv = (new genericODataFactory()).$getEntitySetWithFilterAndExpand({
					path: oParameters.sPath,
					expand: oParameters.sExpand,
					filter: oParameters.sFilter
				});
			}
			if (oParameters.sFilter && !oParameters.sExpand) {
				oOdataSrv = (new genericODataFactory()).$getEntitySetWithFilter({
					path: oParameters.sPath,
					filter: oParameters.sFilter
				});
			}
			if (!oParameters.sFilter && oParameters.sExpand) {
				oOdataSrv = (new genericODataFactory()).$getEntitySetWithExpand({
					path: oParameters.sPath,
					expand: oParameters.sExpand,
				});
			}
			if (!oParameters.sFilter && !oParameters.sExpand) {
				oOdataSrv = (new genericODataFactory()).$getEntitySet({
					path: oParameters.sPath,
				});
			}

			oOdataSrv.then($.proxy(function(oData) {
				//save cash if required
				if(oParameters.oCacheProvider && oParameters.sCacheProviderAttribute && oData.d.results.length){
					oParameters.oCacheProvider.putToCache(oParameters.sCacheProviderAttribute, sRequestSettings, oData.d.results);
				}
				this.commonOnSuccess(oParameters);
				deffered.resolve(oData.d.results);
			}, this), $.proxy(function() {
				this.commonOnError(oParameters, deffered);
			}, this));
			return deffered.promise;
		},

		getEntity: function(oParameters) { //bShowSpinner, sPath, sFilter, sExpand, sKey
			var oOdataSrv = {};
			var deffered = $q.defer();

			if (oParameters.bShowSpinner) {
				$rootScope.$emit('LOAD');
			}

			oOdataSrv = (new genericODataFactory()).$getEntity({
				path: oParameters.sPath,
				expand: oParameters.sExpand,
				key: oParameters.sKey, //TODO: check what should be a proper name for the attribute here and in other methods
			});

			oOdataSrv.then($.proxy(function(oData) {
				this.commonOnSuccess(oParameters);
				deffered.resolve(oData.d);
			}, this), $.proxy(function() {
				this.commonOnError(oParameters, deffered);
			}, this));
			return deffered.promise;
		},

		updateEntity: function(oParameters) {
			var oOdataSrv = {};
			var deffered = $q.defer();

			if (oParameters.bShowSpinner) {
				$rootScope.$emit('LOAD');
			}

			oOdataSrv = (new genericODataFactory(oParameters.oData)).$put({
				path: oParameters.sPath,
				key: oParameters.sKey,
			});

			oOdataSrv.then($.proxy(function(oData) { // }
				this.commonOnSuccess(oParameters);
				deffered.resolve(oData.d);
			}, this), $.proxy(function() {
				this.commonOnError(oParameters, deffered);
			},this));
			return deffered.promise;
		},

		createEntity: function(oParameters) {
			var oOdataSrv = {};
			var deffered = $q.defer();

			if (oParameters.bShowSpinner) {
				$rootScope.$emit('LOAD');
			}

			oOdataSrv = (new genericODataFactory(oParameters.oData)).$post({
				path: oParameters.path,
			});

			oOdataSrv.then($.proxy(function(oData) {
				this.commonOnSuccess(oParameters);
				deffered.resolve(oData.d);
			}, this), $.proxy(function() {
				this.commonOnError(oParameters, deffered);
			}, this));
			return deffered.promise;
		},

		deleteEntity: function(oParameters) {
			var oOdataSrv = {};
			var deffered = $q.defer();

			if (oParameters.bShowSpinner) {
				$rootScope.$emit('LOAD');
			}

			oOdataSrv = (new genericODataFactory()).$delete({
				path: oParameters.sPath,
				key: oParameters.sKey,
			});

			oOdataSrv.then($.proxy(function(oData) {
				this.commonOnSuccess(oParameters);
				deffered.resolve();
			}, this), $.proxy(function() {
				this.commonOnError(oParameters, deffered);
			}, this));
			return deffered.promise;
		},

		httpRequest: function(oParameters) { // //bShowSpinner, sRequestType, sPath, oUrlParameters, bShowSuccessMessage, bShowErrorMessage   
			var sUrlParameters = "";
			var sContentType = 'application/x-www-form-urlencoded';
			var aUrlParameters = [];
			var deffered = {};
			var oHttp = {};

			if(!oParameters.sRequestType){
				oParameters.sRequestType = "GET";
			}
			
			for ( var parameter in oParameters.oUrlParameters) {
				aUrlParameters.push(parameter + "=" + oParameters.oUrlParameters[parameter]);
			}

			for (var i = 0; i < aUrlParameters.length; i++) {
				sUrlParameters = sUrlParameters + aUrlParameters[i];
				if(i !== aUrlParameters.length - 1){
					sUrlParameters = sUrlParameters + "&";
				}
			}
			
			deffered = $q.defer();
			
			if(oParameters.bShowBusyIndicator){
				$rootScope.$emit('LOAD');				
			}
			
			oHttp = $http({
				url: oParameters.sPath,
				method: sRequestType,
				headers: {
					'Content-Type': sContentType
				},
				data: sUrlParameters,
			});

			oHttp.success($.proxy(function(oData, status, headers, config) {
				this.commonOnSuccess(oParameters);
				deffered.resolve(oData);
			}, this));

			oHttp.error($.proxy(function(oData, status, headers, config) {
				this.commonOnError(oParameters, deffered);
				// if (status === 401) {
				// 	window.location.href = "#/signIn/";
				// 	$scope.globalData.userName = jQuery.i18n.prop('mainView.guestTE');
				// }
			}, this));

			return deffered.promise;
		},	

		ajaxRequest: function(oParameters) { // sPath, oData, bAsync, oEventHandlers, sRequestType
			if(!oParameters.sRequestType){
				oParameters.sRequestType = "POST";
			}

			$.ajax({
				type: oParameters.sRequestType,
				async: oParameters.bAsync,
				url: oParameters.sPath,
				data: oParameters.oData,
				beforeSend: function() {
				},
				success: function(data) {
					if (oParameters.oEventHandlers && oParameters.oEventHandlers.onSuccess) {
						oParameters.oEventHandlers.onSuccess(data);
					}
				},
				error: function(data) {
					if (oParameters.oEventHandlers && oParameters.oEventHandlers.onError) {
						oParameters.oEventHandlers.onError(data);
					}
				}
			});
		},			
	}
}]);;app.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.translations('en', {
  	  //signIn
  	  signIn_userName: 'Username',
  	  signIn_password: 'Password',
  	  signIn_logIn: 'Log In',
  	  signIn_languageCode: 'EN',
  	  signIn_forgotPassword: 'Forgot your password?'
  });
  
  $translateProvider.translations('fr', {
   	  //signIn
  	  signIn_userName: 'Utilisateur',
  	  signIn_password: 'Mot de pass',
  	  signIn_logIn: 'Connection',
  	  signIn_languageCode: 'FR',
  	  signIn_forgotPassword: 'Mot de passe oubli\u00E9?' 	
  });
  
//  
//  $scope.setLang = function(langKey) {
//	    // You can change the language during runtime
//	    $translate.use(langKey);
//	  }; 
  
  $translateProvider.preferredLanguage('en');
  $translateProvider.useCookieStorage(); 
}]);;app.factory('utilsProvider', ['ngTableParams', '$translate', function(ngTableParams, $translate) {
	return {
		changeLanguage: function(){
			var sCurrentLanguageKey = $translate.use();
			switch (sCurrentLanguageKey){
				case 'en':
					$translate.use('fr');
					break;
				case 'fr':
					$translate.use('en');
					break;					
			}
		},

		setCookieFromJson: function(sKey, oObj) {
			$.removeCookie(sKey);
			$.cookie(sKey, JSON.stringify(oObj));
		},

		getJsonCookie: function(sKey) {
			if ($.cookie(sKey)) {
				return JSON.parse($.cookie(sKey));
			}
		},

		removeCookie: function(sKey) {
			$.removeCookie(sKey);
		},

		convertJsonArrayToString: function(aObj) {
			sReturn = '[';
			for (var i = 0; i < aObj.length; i++) {
				sReturn = sReturn + '{';
				var aProp = [];
				for (var propt in aObj[i]) {
					aProp.push(propt);
				}
				for (var j = 0; j < aProp.length; j++) {
					if (j != (aProp.length - 1)) {
						sReturn = sReturn + '\"' + aProp[j] + '\":' + '\"' + aObj[i][aProp[j]] + '\", ';
					} else {
						sReturn = sReturn + '\"' + aProp[j] + '\":' + '\"' + aObj[i][aProp[j]] + '\"';
					}
				}
				if (i != (aObj.length - 1)) {
					sReturn = sReturn + '}, ';
				} else {
					sReturn = sReturn + '}';
				}
			}
			sReturn = sReturn + ']';
			return sReturn;
		},

		getParameterByName: function(sName) {
			var sURL = window.location.href.replace("#", "");
			sName = sName.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
			var regexS = "[\\?&]" + sName + "=([^&#]*)";
			var regex = new RegExp(regexS);
			var results = regex.exec(sURL);
			if (results == null)
				return "";
			else
				return decodeURIComponent(results[1].replace(/\+/g, " "));
		},

		displayMessage: function(oParameters) { //sText, sType
			noty({
				text: oParameters.sText,
				type: oParameters.sType,
				layout: CONSTANTS.messageDisplayLayout,
				timeout: CONSTANTS.messageDisplayTime
			});
		},

		messagesHandler: function(aMessages) {
			var bNoErrorMessages = true;

			for (var i = 0; i < aMessages.length; i++) {
				var sMessageCode = aMessages[i].messageCode.toString();
				var sMessageText = jQuery.i18n.prop('messages.m' + aMessages[i].messageCode);

				switch (sMessageCode[i].substring(0, 1)) { // 1 - success; 2 - warning; 3 - error;
					case '1': // success
						this.displayMessage({sText: sMessageText, sType: 'success'});
						break;
					case '2': // error
						this.displayMessage({sText: sMessageText, sType: 'error'});
						bNoErrorMessages = false;
						break;
					case '3': // warning
						this.displayMessage({sText: sMessageText, sType: 'warning'});
						break;
				}
			}
			return bNoErrorMessages;
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
}]);;viewControllers.controller('signInView', ['$scope', '$state', 'utilsProvider', function($scope, $state, utilsProvider) {
	$scope.viewData = {
		userName: "",
		password: ""
	};

	
	$scope.onChangeLanguage = function(){
		utilsProvider.changeLanguage();
	}

	
}]);
