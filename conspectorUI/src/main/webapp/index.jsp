<!doctype html>
<html style="height:98%;" ng-app="conspector">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<link rel="icon" type="image/png" href="apps/conspector/img/favicon.ico">
		<link rel="stylesheet" href="bower_components/angular-material/angular-material.min.css">
		<link rel="stylesheet" href="bower_components/angular-material/themes/orange-theme.css">

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
		<script src="bower_components/ng-table/ng-table.min.js"></script>
		<script src="bower_components/jshashes/hashes.min.js"></script>


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


		<script src="apps/conspector/js/mainController.js"></script>
	
			
		<script src="apps/conspector/components/userManagement/controllers/signInController.js"></script>
		<script src="apps/conspector/components/userManagement/controllers/forgotPasswordController.js"></script>
		<script src="apps/conspector/components/userManagement/controllers/roleSelectionController.js"></script>
		<script src="apps/conspector/components/userManagement/controllers/initialPasswordResetController.js"></script>		
		<script src="apps/conspector/components/userManagement/controllers/passwordResetController.js"></script>		

		<script src="apps/conspector/components/generalLayout/controllers/appController.js"></script>							
		<!--<script src="dist/conspector.min.js"></script> -->
	</head>
	<body id="body" ng-controller="mainController">
		<div ng-show="$root.showSpinner" layout="row" layout-sm="column" layout-align="space-around" style="position: absolute; height: 100%; width: 100%;">
			<md-progress-circular md-mode="indeterminate" style="top: 45%;"> </md-progress-circular>
		</div>
		
		<div style="height:100%;" ui-view></div>
	</body>
</html>