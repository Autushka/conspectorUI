var app = angular.module('conspector', ['ui.router', 'viewControllers', 'pascalprecht.translate', 'ngCookies', 'ngTable', 'ngResource', 'ngMaterial', 'multi-select', 'angularFileUpload', 'colorpicker.module', "pubnub.angular.service", "ngTagsInput", 'ngAnimate', 'filtersProvider', 'ngMessages', 'ngQuickDate', 'textAngular', 'controlsProvider', 'ngCordova', 'ui.bootstrap', 'ngScrollEvent']);
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

		$stateProvider.state('deficiencyQuickAdd', {
			url: '/deficiencyQuickAdd',
			templateUrl: 'apps/conspector/components/deficiencies/templates/deficiencyQuickAddView.html',
			controller: 'deficiencyQuickAddView'
		});	
	}
]);