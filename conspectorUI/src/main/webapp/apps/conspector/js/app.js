var app = angular.module('conspector', ['ui.router', 'viewControllers', 'pascalprecht.translate', 'ngCookies', 'ngTable', 'ngResource', 'ngMaterial']);
var viewControllers = angular.module('viewControllers', []);

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
		$stateProvider.state('roleSelection', {
			url: '/roleSelection',
			templateUrl: 'apps/conspector/components/userManagement/templates/roleSelectionView.html',
			controller: 'roleSelectionView'
		});	
		$stateProvider.state('app', {
			url: '/app',
			templateUrl: 'apps/conspector/components/generalLayout/templates/appView.html',
			controller: 'appView'
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