var app = angular.module('projectX', ['customControls', 'ui.router', 'viewControllers', 'ui.bootstrap', 'textAngular', 'ngResource', 'colorpicker.module', 'ngTagsInput', 'ngQuickDate', 'ui.highlight', 'multi-select', 'ngTable', 'angularFileUpload'])

.config(function($stateProvider, $urlRouterProvider) {
	
	$urlRouterProvider.otherwise("/signIn");
	
	$stateProvider.state('signIn', {
		url: '/signIn',
		templateUrl: 'apps/conspector/views/userManagement/signInView.html',
		controller: 'signInView'})
	.state('forgotPassword', {
		url: '/forgotPassword',
		templateUrl: 'apps/conspector/views/userManagement/forgotPasswordView.html',
		controller: 'forgotPasswordView'})
	.state('resetPassword', {
		url: '/resetPassword/:pr',
		templateUrl: 'apps/conspector/views/userManagement/resetPasswordView.html',
		controller: 'resetPasswordView'})
	.state('emailActivation', {
		url: '/emailActivation/:ev',
		templateUrl: 'apps/conspector/views/userManagement/emailActivationView.html',
		controller: 'emailActivationView'})
//	.state('about', {
//		url: '/about',		
//		templateUrl: 'views/aboutView.html',
//		controller: 'aboutView'})
		
		
				
	.state('app', {
		url: '/app',			
		templateUrl: 'apps/conspector/views/appView.html',
		controller: 'appView'})	
			
	.state('app.deficienciesList', {
		url: '/deficienciesList',
		templateUrl: 'apps/conspector/views/deficiencies/deficienciesListView.html',
		controller: 'deficienciesListView'})
		
	.state('app.deficienciesListEndUser', {
		url: '/deficienciesListEndUser',
		templateUrl: 'apps/conspector/views/deficiencies/deficienciesListEndUserView.html',
		controller: 'deficienciesListView'})			
		
	.state('app.deficiencyDetails', {
		url: '/deficiencyDetails',
		templateUrl: 'apps/conspector/views/deficiencies/deficiencyDetailsView.html',
		controller: 'deficiencyDetailsView'})	
		
	.state('app.deficiencyDetailsEndUser', {
		url: '/deficiencyDetailsEndUser',
		templateUrl: 'apps/conspector/views/deficiencies/deficiencyDetailsEndUserView.html',
		controller: 'deficiencyDetailsView'})			
		
	.state('deficienciesListPrintForm', {
		url: '/deficienciesListPrintForm',
		templateUrl: 'apps/conspector/views/deficiencies/deficienciesListPrintFormView.html',
		controller: 'deficienciesListPrintFormView'})			
			
	.state('app.unitsList', {
		url: '/unitsList',
		templateUrl: 'apps/conspector/views/units/unitsListView.html',
		controller: 'unitsListView'})	
	.state('app.unitDetails', {
		url: '/unitDetails',
		templateUrl: 'apps/conspector/views/units/unitDetailsView.html',
		controller: 'unitDetailsView'})	

	.state('app.accountsList', {
		url: '/accountsList',
		templateUrl: 'apps/conspector/views/accounts/accountsListView.html',
		controller: 'accountsListView'})	
	.state('app.accountDetails', {
		url: '/accountDetails',
		templateUrl: 'apps/conspector/views/accounts/accountDetailsView.html',
		controller: 'accountDetailsView'})	

	.state('app.adminArea', {
		url: '/adminArea',			
		templateUrl: 'apps/conspector/views/adminArea/adminAreaView.html',
		controller: 'adminAreaView'})
	.state('app.adminArea.userManagement', {
		url: '/userManagement',			
		templateUrl: 'apps/conspector/views/adminArea/userManagementView.html',
		controller: 'userManagementView'})
	.state('app.adminArea.addNewUser', {
		url: '/addNewUser',			
		templateUrl: 'apps/conspector/views/adminArea/addNewUserView.html',
		controller: 'addNewUserView'})
	.state('app.adminArea.projects', { 
		url: '/projects',			
		templateUrl: 'apps/conspector/views/adminArea/projectsView.html',
		controller: 'projectsView'})
	.state('app.adminArea.phases', {
		url: '/phases',			
		templateUrl: 'apps/conspector/views/adminArea/phasesView.html',
		controller: 'phasesView'})
	.state('app.adminArea.statuses', {
		url: '/statuses',			
		templateUrl: 'apps/conspector/views/adminArea/statusesView.html',
		controller: 'statusesView'})
	.state('app.adminArea.priorities', {
		url: '/priorities',			
		templateUrl: 'apps/conspector/views/adminArea/prioritiesView.html',
		controller: 'prioritiesView'})
	.state('app.adminArea.accountTypes', {
		url: '/accountTypes',			
		templateUrl: 'apps/conspector/views/adminArea/accountTypesView.html',
		controller: 'accountTypesView'})	

	.state('app.userSettings', {
		url: '/userSettings',
		templateUrl: 'apps/conspector/views/userSettings/userSettingsView.html',
		controller: 'userSettingsView'})
	.state('app.userSettings.myProfile', {
		url: '/myProfile',
		templateUrl: 'apps/conspector/views/userSettings/myProfileView.html',
		controller: 'myProfileView'})
	.state('app.userSettings.changePassword', {
		url: '/changePassword',	
		templateUrl: 'apps/conspector/views/userSettings/changePasswordView.html',
		controller: 'changePasswordView'});
});




