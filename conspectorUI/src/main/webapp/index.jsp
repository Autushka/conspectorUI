<!doctype html>
<html ng-app="conspector" style="height: 100%;">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<link rel="icon" type="image/x-icon" href="favicon.ico">
		<link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
		<link rel="stylesheet" href="bower_components/angular-material/angular-material.min.css">
<!-- 		<link rel="stylesheet" href="bower_components/angular-material/themes/orange-theme.css">
		<link rel="stylesheet" href="bower_components/angular-material/themes/blue-theme.css">
		<link rel="stylesheet" href="bower_components/angular-material/themes/light-blue-dark-theme.css"> -->
		<link rel="stylesheet" href="apps/conspector/js/thirdParty/ng-table.min.css">
		<link rel="stylesheet" href="bower_components/isteven-angular-multiselect/angular-multi-select.css">
		<link rel="stylesheet" href="bower_components/angular-bootstrap-colorpicker/css/colorpicker.min.css">
		<link rel="stylesheet" href="bower_components/ng-tags-input/ng-tags-input.min.css">		
		
		<link rel="stylesheet" href="apps/conspector/css/style.css">

		<script src="bower_components/pubnub/web/pubnub.min.js"></script>
		
		<script src="bower_components/jquery/dist/jquery.min.js"></script>
		<script src="bower_components/angular/angular.min.js"></script>
		<script src="bower_components/angular-route/angular-route.min.js"></script>
		<script src="bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
		<script src="bower_components/angular-animate/angular-animate.min.js"></script>
		<script src="bower_components/angular-translate/angular-translate.min.js"></script>
		<script src="bower_components/angular-cookies/angular-cookies.min.js"></script>
		<script src="bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js"></script>
		<script src="bower_components/angular-resource/angular-resource.min.js"></script>
		<script src="bower_components/angular-ui-utils/ui-utils.min.js"></script>
		<script src="bower_components/hammerjs/hammer.min.js"></script>
		<script src="bower_components/angular-aria/angular-aria.min.js"></script>
		<script src="bower_components/angular-material/angular-material.min.js"></script>
		<script src="bower_components/jshashes/hashes.min.js"></script>
		<script src="bower_components/isteven-angular-multiselect/angular-multi-select.js"></script>
		<script src="bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.min.js"></script>
		<script src="bower_components/datajs/datajs-1.1.2.min.js"></script>
		<script src="bower_components/ng-tags-input/ng-tags-input.min.js"></script>		
		
		<script src="apps/conspector/js/thirdParty/ng-table.js"></script> <!-- standard control has been modified to support multiple tables on the view  TODO: dont forget to minify it-->
		<script src="apps/conspector/js/thirdParty/angular-file-upload-shim.min.js"></script>  <!-- version 2.0.5 is not available on bower  TODO: try to put it on bower-->
		<script src="apps/conspector/js/thirdParty/angular-file-upload.min.js"></script> <!-- version 2.0.5 is not available on bower  TODO: try to put it on bower-->
		<script src="apps/conspector/js/thirdParty/pubnub-angular.js"></script> <!-- was not able to find it as a bower component-->	

			
		<script src="apps/conspector/js/app.js"></script>
		<script src="apps/conspector/js/constants.js"></script>
		<script src="apps/conspector/js/types.js"></script>
		<script src="apps/conspector/js/rolesSettings.js"></script>
		<script src="apps/conspector/js/common/cacheProvider.js"></script>
		<script src="apps/conspector/js/common/utilsProvider.js"></script>
		<script src="apps/conspector/js/common/translateProvider.js"></script>
		<script src="apps/conspector/js/common/dataProvider.js"></script>
		<script src="apps/conspector/js/common/apiProvider.js"></script>
		<script src="apps/conspector/js/common/servicesProvider.js"></script>
		<script src="apps/conspector/js/common/historyProvider.js"></script>		
		<script src="apps/conspector/js/mainController.js"></script>
		
		<script src="apps/conspector/components/userManagement/controllers/signInController.js"></script>
		<script src="apps/conspector/components/userManagement/controllers/forgotPasswordController.js"></script>
		<script src="apps/conspector/components/userManagement/controllers/companySelectionController.js"></script>
		<script src="apps/conspector/components/userManagement/controllers/roleSelectionController.js"></script>
		<script src="apps/conspector/components/userManagement/controllers/initialPasswordResetController.js"></script>
		<script src="apps/conspector/components/userManagement/controllers/passwordResetController.js"></script>
		<script src="apps/conspector/components/generalLayout/controllers/appController.js"></script>
		<script src="apps/conspector/components/deficiencies/controllers/deficienciesListController.js"></script>
		<script src="apps/conspector/components/units/controllers/unitsListController.js"></script>

		<script src="apps/conspector/components/contractors/controllers/contractorsListController.js"></script>
		<script src="apps/conspector/components/contractors/controllers/contractorDetailsWrapperController.js"></script>			
		<script src="apps/conspector/components/contractors/controllers/contractorDetailsController.js"></script>

		<script src="apps/conspector/components/contacts/controllers/contactsListController.js"></script>	
		<script src="apps/conspector/components/contacts/controllers/contactDetailsController.js"></script>	

		<script src="apps/conspector/components/clients/controllers/clientsListController.js"></script>
		<script src="apps/conspector/components/clients/controllers/clientDetailsWrapperController.js"></script>			
		<script src="apps/conspector/components/clients/controllers/clientDetailsController.js"></script>		

		<script src="apps/conspector/components/profileSettings/controllers/profileSettingsController.js"></script>
		<script src="apps/conspector/components/profileSettings/controllers/profileDetailsController.js"></script>
		<script src="apps/conspector/components/profileSettings/controllers/changePasswordController.js"></script>

		<script src="apps/conspector/components/adminPanel/controllers/adminPanelController.js"></script>
		<script src="apps/conspector/components/adminPanel/controllers/companiesListController.js"></script>
		<script src="apps/conspector/components/adminPanel/controllers/usersListController.js"></script>
		<script src="apps/conspector/components/adminPanel/controllers/userDetailsController.js"></script>
		<script src="apps/conspector/components/adminPanel/controllers/projectsListController.js"></script>
		<script src="apps/conspector/components/adminPanel/controllers/phasesListController.js"></script>
		<script src="apps/conspector/components/adminPanel/controllers/rolesListController.js"></script>
		<script src="apps/conspector/components/adminPanel/controllers/operationLogsListController.js"></script>
		<script src="apps/conspector/components/adminPanel/controllers/deficiencyStatusesListController.js"></script>
		<script src="apps/conspector/components/adminPanel/controllers/systemFilesController.js"></script>
		<script src="apps/conspector/components/adminPanel/controllers/accountTypesListController.js"></script>
		<script src="apps/conspector/components/adminPanel/controllers/contactTypesListController.js"></script>		
		<script src="apps/conspector/components/adminPanel/controllers/deficiencyPrioritiesListController.js"></script> 
		
		<!--<script src="dist/conspector.js"></script>
		<script src="dist/conspector.min.js.map"></script>  -->
	</head>
	<body id="body" ng-controller="mainController" style="height: 100%; width: 100%;">
		<div ng-show="$root.showSpinner" layout="row" layout-align="center center" style="position: absolute; z-index: 2; height: 100%; width: 100%;">
			<md-progress-circular md-mode="indeterminate"> </md-progress-circular>
		</div>
		<div ui-view></div>
	</body>
</html>
