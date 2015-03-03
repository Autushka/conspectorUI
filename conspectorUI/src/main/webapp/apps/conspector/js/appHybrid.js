var app = angular.module('conspector', ['ui.router', 'viewControllers', 'pascalprecht.translate', 'ngCookies', 'ngTable', 'ngResource', 'ngMaterial', 'angularFileUpload', "pubnub.angular.service", "ngTagsInput", 'angular-loading-bar', 'ngAnimate', 'filtersProvider', 'ngMessages', 'ngCordova', 'ui.bootstrap']);
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
			templateUrl: 'apps/conspector/components/userManagement/templates/signInHybridView.html',
			controller: 'signInView'
		});
		$stateProvider.state('forgotPassword', {
			url: '/forgotPassword',
			templateUrl: 'apps/conspector/components/userManagement/templates/forgotPasswordHybridView.html',
			controller: 'forgotPasswordView'
		})
		$stateProvider.state('initialPasswordReset', {
			url: '/initialPasswordReset',
			templateUrl: 'apps/conspector/components/userManagement/templates/initialPasswordResetHybridView.html',
			controller: 'initialPasswordResetView'
		});
		$stateProvider.state('companySelection', {
			url: '/companySelection',
			templateUrl: 'apps/conspector/components/userManagement/templates/companySelectionHybridView.html',
			controller: 'companySelectionView'
		});
		$stateProvider.state('roleSelection', {
			url: '/roleSelection',
			templateUrl: 'apps/conspector/components/userManagement/templates/roleSelectionHybridView.html',
			controller: 'roleSelectionView'
		});
		$stateProvider.state('resetPassword', {
			url: '/resetPassword/:pr',
			templateUrl: 'apps/conspector/components/userManagement/templates/passwordResetHybridView.html',
			controller: 'passwordResetView'
		});


        $stateProvider.state('mainMenuHybrid', {
            url: '/mainMenuHybrid',
            templateUrl: 'apps/conspector/components/generalLayout/templates/mainMenuHybridView.html',
            controller: 'mainMenuHybridView'
        });		

        // $stateProvider.state('deficienciesListHybrid', {
        //     url: '/deficienciesListHybrid',
        //     templateUrl: 'apps/conspector/components/deficiencies/templates/deficienciesListHybridView.html',
        //     controller: 'deficienciesListHybridView'
        // });         
		$stateProvider.state('deficienciesListHybridWrapper', {//abstract view without controller that contains only ngView holders
			templateUrl: 'apps/conspector/components/deficiencies/templates/deficienciesListHybridWrapperView.html',
			controller: 'deficienciesListHybridWrapperView'
		});

		$stateProvider.state('deficienciesListHybridWrapper.deficienciesSearchHybrid', {//state that contains subviews
			url: '/deficienciesListHybridWrapper',
			views: {
				'deficienciesSearchHybrid': {
					templateUrl: 'apps/conspector/components/deficiencies/templates/deficienciesSearchHybridView.html',
					controller: 'deficienciesSearchHybridView'
				},
				'deficienciesListHybrid': {
					templateUrl: 'apps/conspector/components/deficiencies/templates/deficienciesListHybridView.html',
					controller: 'deficienciesListHybridView'
				},
				'deficienciesListItemsListsHybrid': {
					templateUrl: 'apps/conspector/components/deficiencies/templates/deficienciesListItemsListsHybridView.html',
					controller: 'deficienciesListItemsListsHybridView'
				},			
			}
		});			


		$stateProvider.state('deficiencyQuickAddWrapper', {//abstract view without controller that contains only ngView holders
			templateUrl: 'apps/conspector/components/deficiencies/templates/deficiencyQuickAddWrapperView.html',
			controller: 'deficiencyQuickAddWrapperView'
		});		

		$stateProvider.state('deficiencyQuickAddWrapper.quickAdd', {//state that contains subviews
			url: '/deficiencyQuickAddWrapper',
			views: {
				'deficiencyQuickAdd': {
					templateUrl: 'apps/conspector/components/deficiencies/templates/deficiencyQuickAddView.html',
					controller: 'deficiencyQuickAddView'
				},
				'deficiencyQuickAddItemsLists': {
					templateUrl: 'apps/conspector/components/deficiencies/templates/deficiencyQuickAddItemsListsView.html',
					controller: 'deficiencyQuickAddItemsListsView'
				},
			}
		});			
	}
]);