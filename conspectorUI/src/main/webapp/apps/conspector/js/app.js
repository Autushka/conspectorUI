var app = angular.module('conspector', ['ui.router', 'viewControllers', 'pascalprecht.translate', 'ngCookies', 'ngTable', 'ngResource', 'ngMaterial', 'multi-select', 'angularFileUpload', 'colorpicker.module', "pubnub.angular.service", "ngTagsInput", 'ngAnimate', 'filtersProvider', 'ngMessages']);
var viewControllers = angular.module('viewControllers', []);

app.config(['$mdThemingProvider', function($mdThemingProvider) {
	$mdThemingProvider.definePalette('conspectorColorPalette', {
		'50': '55b0d0',
		'100': '44a8cb',
		'200': '33a0c6',
		'300': '2298c1',
		'400': '1190bd',
		'500': '0088b8',
		'600': '007da9',
		'700': '00729b',
		'800': '00678c',
		'900': '005c7d',
		'A100': '0088b8',
		'A200': '0088b8',
		'A400': '0088b8',
		'A700': '0088b8',
		'contrastDefaultColor': 'light', // whether, by default, text (contrast)
		// on this palette should be dark or light
		'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
			'200', '300', '400', 'A100'
		],
		'contrastLightColors': undefined // could also specify this if default was 'dark'
	});
	$mdThemingProvider.theme('default')
		.primaryColor('conspectorColorPalette')
		.accentColor('conspectorColorPalette');
	$mdThemingProvider.definePalette('conspectorColorPaletteNavbar', {
		'50': '8e9192',
		'100': '838687',
		'200': '787b7d',
		'300': '6d7072',
		'400': '616567',
		'500': '565a5c',
		'600': '4f5355',
		'700': '484c4d',
		'800': '414446',
		'900': '3a3d3f',
		'A100': '565a5c',
		'A200': '565a5c',
		'A400': '565a5c',
		'A700': '565a5c',
		'contrastDefaultColor': 'light', // whether, by default, text (contrast)
		// on this palette should be dark or light
		'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
			'200', '300', '400', 'A100'
		],
		'contrastLightColors': undefined // could also specify this if default was 'dark'
	});
	$mdThemingProvider.theme('conspectorColorPaletteNavbar')
		.primaryColor('conspectorColorPaletteNavbar')
		.accentColor('conspectorColorPaletteNavbar');

	//   $mdThemingProvider.definePalette('conspectorColorPaletteNavbar', {
	//   '50': '565a5c',
	//   '100': '565a5c',
	//   '200': '565a5c',
	//   '300': '565a5c',
	//   '400': '565a5c',
	//   '500': '565a5c',
	//   '600': '565a5c',
	//   '700': '565a5c',
	//   '800': '565a5c',
	//   '900': '565a5c',
	//   'A100': '565a5c',
	//   'A200': '565a5c',
	//   'A400': '565a5c',
	//   'A700': '565a5c',
	//   'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
	//                                       // on this palette should be dark or light
	//   'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
	//    '200', '300', '400', 'A100'],
	//   'contrastLightColors': undefined    // could also specify this if default was 'dark'
	// });

}]);

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
		$stateProvider.state('resetPassword', {
			url: '/resetPassword/:pr',
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

		$stateProvider.state('app.contractorsList', {
			url: '/contractorsList',
			templateUrl: 'apps/conspector/components/contractors/templates/contractorsListView.html',
			controller: 'contractorsListView'
		});

		$stateProvider.state('app.contractorDetailsWrapper', {//abstract view without controller that contains only ngView holders
			templateUrl: 'apps/conspector/components/contractors/templates/contractorDetailsWrapperView.html',
			controller: 'contractorDetailsWrapperView'
		});

		$stateProvider.state('app.contractorDetailsWrapper.contractorDetails', {//state that contains subviews
			url: '/contractorDetails/:sContractorGuid/:sMode',
			views: {
				'contractorDetails': {
					templateUrl: 'apps/conspector/components/contractors/templates/contractorDetailsView.html',
					controller: 'contractorDetailsView'
				},
				'contractorContacts': {
					templateUrl: 'apps/conspector/components/contacts/templates/contactsListView.html',
					controller: 'contactsListView'
				}
			}
		});

		$stateProvider.state('app.clientsList', {
			url: '/clientsList',
			templateUrl: 'apps/conspector/components/clients/templates/clientsListView.html',
			controller: 'clientsListView'
		});

		$stateProvider.state('app.clientDetailsWrapper', {//abstract view without controller that contains only ngView holders
			templateUrl: 'apps/conspector/components/clients/templates/clientDetailsWrapperView.html',
			controller: 'clientDetailsWrapperView'
		});

		$stateProvider.state('app.clientDetailsWrapper.clientDetails', {//state that contains subviews
			url: '/clientDetails/:sClientGuid/:sMode',
			views: {
				'clientDetails': {
					templateUrl: 'apps/conspector/components/clients/templates/clientDetailsView.html',
					controller: 'clientDetailsView'
				},
				'clientContacts': {
					templateUrl: 'apps/conspector/components/contacts/templates/contactsListView.html',
					controller: 'contactsListView'
				}
			}
		});			

		$stateProvider.state('app.contactsList', {
			url: '/contactsList',
			templateUrl: 'apps/conspector/components/contacts/templates/contactsListView.html',
			controller: 'contactsListView'
		});	

		$stateProvider.state('app.contactDetailsWrapper', {//abstract view without controller that contains only ngView holders
			templateUrl: 'apps/conspector/components/contacts/templates/contactDetailsWrapperView.html',
			controller: 'contactDetailsWrapperView'
		});

		$stateProvider.state('app.contactDetailsWrapper.contactDetails', {//state that contains subviews
			url: '/contactDetails/:sAccountGuid/:sContactGuid/:sMode',
			views: {
				'contactDetails': {
					templateUrl: 'apps/conspector/components/contacts/templates/contactDetailsView.html',
					controller: 'contactDetailsView'
				},
			}
		});					

		$stateProvider.state('app.adminPanel', {
			url: '/adminPanel',
			templateUrl: 'apps/conspector/components/adminPanel/templates/adminPanelView.html',
			controller: 'adminPanelView'
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
			url: '/userDetails/:sUserName/:sMode',
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
		$stateProvider.state('app.adminPanel.contactTypesList', {
			url: '/contactTypesList',
			templateUrl: 'apps/conspector/components/adminPanel/templates/contactTypesListView.html',
			controller: 'contactTypesListView'
		});		
		$stateProvider.state('app.adminPanel.deficiencyPrioritiesList', {
			url: '/deficiencyPrioritiesList',
			templateUrl: 'apps/conspector/components/adminPanel/templates/deficiencyPrioritiesListView.html',
			controller: 'deficiencyPrioritiesListView'
		});
		$stateProvider.state('app.adminPanel.unitOptionSetList', {
			url: '/unitOptionSetList',
			templateUrl: 'apps/conspector/components/adminPanel/templates/unitOptionSetListView.html',
			controller: 'unitOptionSetListView'
		});		
		$stateProvider.state('app.profileSettings', {
			url: '/profileSettings',
			templateUrl: 'apps/conspector/components/profileSettings/templates/profileSettingsView.html',
			controller: 'profileSettingsView'
		});
		$stateProvider.state('app.profileSettings.contactDetails', {
			url: '/profileSettings.contactDetails/:sAccountGuid/:sContactGuid/:sMode',
			templateUrl: 'apps/conspector/components/contacts/templates/contactDetailsView.html',
			controller: 'contactDetailsView'
		});		
		$stateProvider.state('app.profileSettings.profileDetails', {
			url: '/profileDetails',
			templateUrl: 'apps/conspector/components/profileSettings/templates/profileDetailsView.html',
			controller: 'profileDetailsView'
		});
		$stateProvider.state('app.profileSettings.changePassword', {
			url: '/changePassword',
			templateUrl: 'apps/conspector/components/profileSettings/templates/changePasswordView.html',
			controller: 'changePasswordView'
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