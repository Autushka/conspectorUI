<!doctype html>
<html style="height:98%;" ng-app="projectX">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<link rel="icon" type="image/png" href="apps/conspector/img/favicon.ico">	
	
	<!-- google analytics	 -->
	<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', 'UA-7642837-11', 'cloudbees.net');
		ga('send', 'pageview');

	</script>
	
	<link rel="stylesheet" type="text/css" href="thirdParty/font-awesome-4.1.0/css/font-awesome.min.css" />
	<link rel="stylesheet" type="text/css" href="css/thirdParty/ng-tags-input.css" />	
	<link rel="stylesheet" type="text/css" href="css/thirdParty/ngTable.css" />	
	<link rel="stylesheet" type="text/css" href="css/thirdParty/bootstrap3.2.0.css" />
	<link rel="stylesheet" type="text/css" href="css/thirdParty/colorpicker.css" />
	<link rel="stylesheet" type="text/css" href="css/thirdParty/ng-quick-date.css" />	
	<link rel="stylesheet" type="text/css" href="css/thirdParty/ng-quick-date-default-theme.css" />
	<link rel="stylesheet" type="text/css" href="css/thirdParty/angular-multi-select.css" />	
	<link rel="stylesheet" type="text/css" href="css/main.css" />
	<link rel="stylesheet" type="text/css" href="apps/conspector/css/app.css" />
	<link rel="stylesheet" type="text/css" href="apps/conspector/css/style.css" />		
		
	<script src="js/thirdParty/angular.min.js"></script>
	<script src="js/thirdParty/angular.rout.min.js"></script>
	<script src="js/thirdParty/angular.animate.min.js"></script>  

	<script src="js/thirdParty/ng-tags-input.js"></script> 
	<script src="js/thirdParty/angular-ui-router.js"></script>
	<script src="js/thirdParty/ng-table.js"></script> 
	<script src="js/thirdParty/highlight.js"></script>	 
	<script src="js/thirdParty/ui-bootstrap-tpls-0.11.2.min.js"></script>  
	<script src="js/thirdParty/jQuery.js"></script>
	<script src="js/thirdParty/jquery.noty.packaged.min.js"></script>	
	<script src="js/thirdParty/md5.js"></script> 
	<script src="js/thirdParty/sha512.js"></script>       
	<script src="js/thirdParty/jquery.i18n.properties-min.js"></script>
	<script src="js/thirdParty/jquery.i18n.properties.js"></script>	
	<script src="js/thirdParty/angular-sanitize.js"></script>
	<script src="js/thirdParty/angular-file-upload.js"></script>
	<script src="js/thirdParty/angular-resource.js"></script>
	<script src="js/thirdParty/ng-quick-date.js"></script>						
	<script src="js/thirdParty/bootstrap-colorpicker-module.js"></script>    
	<script src="js/thirdParty/textAngular.min.js"></script>
	<script src="js/thirdParty/angular-multi-select.js"></script>
	
	<script src="apps/conspector/js/thirdParty/jquery.cookie.js"></script>	
	
	<script src="js/controls.js"></script>

	<script src="apps/conspector/js/viewControllers.js"></script>		
	<script src="apps/conspector/js/main.js"></script>
	<script src="js/services.js"></script>	
	<script src="apps/conspector/js/menus.js"></script>
	
	<script src="apps/conspector/js/constants.js"></script>
	<script src="apps/conspector/js/types.js"></script>
	<script src="apps/conspector/js/cashProvider.js"></script>
	<script src="apps/conspector/js/utilsProvider.js"></script>
	<script src="apps/conspector/js/dataProvider.js"></script>	
	<script src="apps/conspector/js/apiProvider.js"></script>				
		
	<script src="apps/conspector/js/customServices.js"></script>	
	<script src="apps/conspector/js/mainController.js"></script> 
	<script src="apps/conspector/js/viewControllers/appController.js"></script>		
		
	<script src="apps/conspector/js/viewControllers/userManagement/signInController.js"></script>
	<script src="apps/conspector/js/viewControllers/userManagement/forgotPasswordController.js"></script>
	<script src="apps/conspector/js/viewControllers/userManagement/resetPasswordController.js"></script>
	<script src="apps/conspector/js/viewControllers/userManagement/emailActivationController.js"></script>

	<script src="apps/conspector/js/viewControllers/userSettings/userSettingsController.js"></script>
	<script src="apps/conspector/js/viewControllers/userSettings/myProfileController.js"></script>
	<script src="apps/conspector/js/viewControllers/userSettings/changePasswordController.js"></script>

	<script src="apps/conspector/js/viewControllers/adminArea/adminAreaController.js"></script>
	<script src="apps/conspector/js/viewControllers/adminArea/addNewUserController.js"></script>
	<script src="apps/conspector/js/viewControllers/adminArea/userManagementController.js"></script>
		
	<script src="apps/conspector/js/viewControllers/deficiencies/deficienciesController.js"></script>
	<script src="apps/conspector/js/viewControllers/deficiencies/deficienciesListController.js"></script>		
	<script src="apps/conspector/js/viewControllers/deficiencies/deficiencyDetailsController.js"></script>
	<script src="apps/conspector/js/viewControllers/deficiencies/deficienciesListPrintFormController.js"></script>
	<script src="apps/conspector/js/viewControllers/popUps/notSavedDataPopUpController.js"></script>
	<script src="apps/conspector/js/viewControllers/popUps/roleSelectorPopUpController.js"></script>	
	

	<script src="apps/conspector/js/viewControllers/units/unitsController.js"></script>
	<script src="apps/conspector/js/viewControllers/units/unitsListController.js"></script>		
	<script src="apps/conspector/js/viewControllers/units/unitDetailsController.js"></script>

	<script src="apps/conspector/js/viewControllers/accounts/accountsController.js"></script>
	<script src="apps/conspector/js/viewControllers/accounts/accountsListController.js"></script>		
	<script src="apps/conspector/js/viewControllers/accounts/accountDetailsController.js"></script>	

	<script src="apps/conspector/js/viewControllers/adminArea/projectsController.js"></script>
	<script src="apps/conspector/js/viewControllers/adminArea/phasesController.js"></script>
	<script src="apps/conspector/js/viewControllers/adminArea/categoriesController.js"></script>
	<script src="apps/conspector/js/viewControllers/adminArea/statusesController.js"></script>
	<script src="apps/conspector/js/viewControllers/adminArea/prioritiesController.js"></script>
	<script src="apps/conspector/js/viewControllers/adminArea/accountTypesController.js"></script>	
	
 	<script src="apps/conspector/js/viewControllers/clientFormController.js"></script>						
	<script src="apps/conspector/js/viewControllers/appController.js"></script>		
</head>

<body id="body" style="height:98%;" ng-controller="mainController" ng-click="$root.hideGallery()">
	<st-photo-gallery>  </st-photo-gallery>	
		<div style="height:100%;" ui-view class=fadeInAnimation></div>
</body>
</html>