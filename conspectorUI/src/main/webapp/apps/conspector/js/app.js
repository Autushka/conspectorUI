var app = angular.module('conspector', ['ui.router', 'viewControllers', 'pascalprecht.translate', 'ngCookies', 'ngTable', 'ngResource', 'ngMaterial', 'multi-select', 'angularFileUpload', 'colorpicker.module']);
var viewControllers = angular.module('viewControllers', []);

app.config(function($mdThemingProvider) {
	$mdThemingProvider.definePalette('amazingPaletteName', {
    '50': '0088b8',
    '100': '0088b8',
    '200': '0088b8',
    '300': '0088b8',
    '400': '0088b8',
    '500': '0088b8',
    '600': '0088b8',
    '700': '0088b8',
    '800': '0088b8',
    '900': '0088b8',
    'A100': '0088b8',
    'A200': '0088b8',
    'A400': '0088b8',
    'A700': '0088b8',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
 	});
  	$mdThemingProvider.theme('default')
    .primaryColor('amazingPaletteName')
    .accentColor('amazingPaletteName');
});

app.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/signIn");

		$stateProvider.state('signIn', {
			url: '/signIn',
			templateUrl: 'apps/conspector/components/userManagement/templates/signInView.html',
			controller: 'signInView'
		});
		$stateProvider.state('forgotPassword', {
			url: '/forgotPassword',
			templateUrl: 'apps/conspector/components/userManagement/templates/forgotPasswordView.html',
			controller: 'forgotPasswordView'
		})
		$stateProvider.state('initialPasswordReset', {
			url: '/initialPasswordReset',
			templateUrl: 'apps/conspector/components/userManagement/templates/initialPasswordResetView.html',
			controller: 'initialPasswordResetView'
		});
		$stateProvider.state('companySelection', {
			url: '/companySelection',
			templateUrl: 'apps/conspector/components/userManagement/templates/companySelectionView.html',
			controller: 'companySelectionView'
		});			
		$stateProvider.state('roleSelection', {
			url: '/roleSelection',
			templateUrl: 'apps/conspector/components/userManagement/templates/roleSelectionView.html',
			controller: 'roleSelectionView'
		});	
		$stateProvider.state('passwordReset', {
			url: '/passwordReset/:pr',
			templateUrl: 'apps/conspector/components/userManagement/templates/passwordResetView.html',
			controller: 'passwordResetView'
		});		
		$stateProvider.state('app', {
			url: '/app',
			templateUrl: 'apps/conspector/components/generalLayout/templates/appView.html',
			controller: 'appView'
		});	
		$stateProvider.state('app.deficienciesList', {
			url: '/deficienciesList',
			templateUrl: 'apps/conspector/components/deficiencies/templates/deficienciesListView.html',
			controller: 'deficienciesListView'
		});	
		$stateProvider.state('app.unitsList', {
			url: '/unitsList',
			templateUrl: 'apps/conspector/components/units/templates/unitsListView.html',
			controller: 'unitsListView'
		});	
		$stateProvider.state('app.constactorsList', {
			url: '/contractorsList',
			templateUrl: 'apps/conspector/components/contractors/templates/contractorsListView.html',
			controller: 'contractorsListView'
		});	
		$stateProvider.state('app.clientsList', {
			url: '/clientsList',
			templateUrl: 'apps/conspector/components/clients/templates/clientsListView.html',
			controller: 'clientsListView'
		});	
		$stateProvider.state('app.adminPanel', {
			url: '/adminPanel',
			templateUrl: 'apps/conspector/components/adminPanel/templates/adminPanelView.html',
			controller: 'adminPanelView'
		});	
		$stateProvider.state('app.profileSettings', {
			url: '/profileSettings',
			templateUrl: 'apps/conspector/components/profileSettings/templates/profileSettingsView.html',
			controller: 'profileSettingsView'
		});	
		$stateProvider.state('app.adminPanel.companiesList', {
			url: '/companiesList',
			templateUrl: 'apps/conspector/components/adminPanel/templates/companiesListView.html',
			controller: 'companiesListView'
		});			
		$stateProvider.state('app.adminPanel.usersList', {
			url: '/usersList',
			templateUrl: 'apps/conspector/components/adminPanel/templates/usersListView.html',
			controller: 'usersListView'
		});	
		$stateProvider.state('app.adminPanel.userDetails', {
			url: '/userDetails/:sUserName/:sMode/:sFromState',
			templateUrl: 'apps/conspector/components/adminPanel/templates/userDetailsView.html',
			controller: 'userDetailsView'
		});			
		$stateProvider.state('app.adminPanel.rolesList', {
			url: '/rolesList',
			templateUrl: 'apps/conspector/components/adminPanel/templates/rolesListView.html',
			controller: 'rolesListView'
		});			
		$stateProvider.state('app.adminPanel.projectsList', {
			url: '/projectsList',
			templateUrl: 'apps/conspector/components/adminPanel/templates/projectsListView.html',
			controller: 'projectsListView'
		});	
		$stateProvider.state('app.adminPanel.phasesList', {
			url: '/phasesList',
			templateUrl: 'apps/conspector/components/adminPanel/templates/phasesListView.html',
			controller: 'phasesListView'
		});				
		$stateProvider.state('app.adminPanel.deficiencyStatusesList', {
			url: '/deficiencyStatusesList',
			templateUrl: 'apps/conspector/components/adminPanel/templates/deficiencyStatusesListView.html',
			controller: 'deficiencyStatusesListView'
		});	
		$stateProvider.state('app.adminPanel.systemFiles', {
			url: '/systemFiles',
			templateUrl: 'apps/conspector/components/adminPanel/templates/systemFilesView.html',
			controller: 'systemFilesView'
		});					
		$stateProvider.state('app.adminPanel.operationLogsList', {
			url: '/operationLogsList',
			templateUrl: 'apps/conspector/components/adminPanel/templates/operationLogsListView.html',
			controller: 'operationLogsListView'
		});	
		$stateProvider.state('app.adminPanel.accountTypesList', {
			url: '/accountTypesList',
			templateUrl: 'apps/conspector/components/adminPanel/templates/accountTypesListView.html',
			controller: 'accountTypesListView'
		});
		$stateProvider.state('app.adminPanel.deficiencyPrioritiesList', {
			url: '/deficiencyPrioritiesList',
			templateUrl: 'apps/conspector/components/adminPanel/templates/deficiencyPrioritiesListView.html',
			controller: 'deficiencyPrioritiesListView'
		});								
									


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
	}
]);
