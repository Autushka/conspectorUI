<!doctype html>
<html ng-app="conspector" style="height: 100%;">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<link rel="icon" type="image/x-icon" href="favicon.ico">
		<link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />

		<link rel="stylesheet" href="bower_components/angular-material/angular-material.min.css">
		<link rel="stylesheet" href="apps/conspector/js/thirdParty/ng-table.min.css">
		<link rel="stylesheet" href="bower_components/isteven-angular-multiselect/angular-multi-select.css">
		<link rel="stylesheet" href="bower_components/angular-bootstrap-colorpicker/css/colorpicker.min.css">
		<link rel="stylesheet" href="bower_components/ng-tags-input/ng-tags-input.min.css">	
		<link rel="stylesheet" href="bower_components/ngQuickDate/dist/ng-quick-date.css">			
		<link rel="stylesheet" href="bower_components/ngQuickDate/dist/ng-quick-date-default-theme.css">
		<link rel='stylesheet' href='bower_components/textAngular/src/textAngular.css'>		
		<link rel='stylesheet' href='bower_components/font-awesome/css/font-awesome.css'>
		<link rel='stylesheet' href='bower_components/angular-loading-bar/build/loading-bar.min.css'>	
		<link rel='stylesheet' href='bower_components/angular-ui-select/dist/select.min.css'>								
		<link rel="stylesheet" href="apps/conspector/css/style.css">
		<link rel="stylesheet" type="text/css" href="apps/conspector/css/photoGallery.css" />

		<script src="bower_components/pubnub/web/pubnub.js"></script>
		
		<!-- COMMON JS DEPENDENCIES -->
		<script src="bower_components/jquery/dist/jquery.min.js"></script>
		<script src="bower_components/angular/angular.min.js"></script>
		<script src="bower_components/angular-route/angular-route.min.js"></script>
		<script src="bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
		<script src="bower_components/angular-animate/angular-animate.min.js"></script>
		<script src="bower_components/angular-translate/angular-translate.min.js"></script>
		
		<script src="bower_components/angular-resource/angular-resource.min.js"></script>
		<script src="bower_components/angular-ui-utils/ui-utils.min.js"></script>
		<script src="bower_components/hammerjs/hammer.min.js"></script>
		<script src="bower_components/angular-aria/angular-aria.min.js"></script>
		<script src="bower_components/angular-material/angular-material.min.js"></script>
		<script src="bower_components/angular-messages/angular-messages.min.js"></script>
		<script src="bower_components/angular-sanitize/angular-sanitize.min.js"></script>			
		<script src="bower_components/angular-bootstrap/ui-bootstrap.min.js"></script>
		<script src="bower_components/jshashes/hashes.min.js"></script>
		<script src="bower_components/ng-tags-input/ng-tags-input.min.js"></script>
		<script src='bower_components/textAngular/dist/textAngular-rangy.min.js'></script>
		<script src='bower_components/textAngular/dist/textAngular-sanitize.min.js'></script>
		<script src='bower_components/textAngular/dist/textAngular.min.js'></script>
		<script src="bower_components/datajs/datajs-1.1.2.min.js"></script>
		<script src="bower_components/angular-ui-select/dist/select.min.js"></script>
		<script src="bower_components/ngstorage/ngStorage.min.js"></script>
		<script src="apps/conspector/js/thirdParty/pubnub-angular.js"></script> 
		<!-- was not able to find it as a bower component-->	

		<!-- MOBILE JS DEPENDENCIES -->
		<script src="bower_components/ngCordova/dist/ng-cordova.js"></script>
	    <!-- <script type="text/javascript" src="cordova.js"></script>
	    // <script type="text/javascript" src="js/index.js"></script>	-->		
		
		<!-- WEBAPP JS DEPENDENCIES -->
		<script src="bower_components/isteven-angular-multiselect/angular-multi-select.js"></script>
		<script src="bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.min.js"></script>
		<script src="bower_components/ngQuickDate/dist/ng-quick-date.min.js"></script>	
		<script src="bower_components/angular-loading-bar/build/loading-bar.min.js"></script>
		<script src="bower_components/jstree/dist/jstree.min.js"></script>
		<script src="bower_components/ng-js-tree/dist/ngJsTree.min.js"></script>
		<script src="apps/conspector/js/thirdParty/ng-table.js"></script> 
		<!-- standard control has been modified to support multiple tables on the view  TODO: dont forget to minify it-->
		<script src="apps/conspector/js/thirdParty/angular-file-upload-shim.min.js"></script>  
		<!-- version 2.0.5 is not available on bower  TODO: try to put it on bower-->
		<script src="apps/conspector/js/thirdParty/angular-file-upload.min.js"></script> 
		<!-- version 2.0.5 is not available on bower  TODO: try to put it on bower-->		
		<script src="apps/conspector/js/thirdParty/jQuery.download.js"></script> 
		<!-- small function that needed to allow ajax requests that return files (needed for dynamic reports...)-->		
			    			
	    <!-- COMMON JS -->
	    <script src="apps/conspector/js/app.js"></script>
		<script src="apps/conspector/js/constants.js"></script>

		<script src="apps/conspector/js/common/translateProvider.js"></script>
		<script src="apps/conspector/js/common/utilsProvider.js"></script>

		<script src="apps/conspector/js/common/cacheProvider.js"></script>		
		<script src="apps/conspector/js/common/dataProvider.js"></script>
		<script src="apps/conspector/js/common/apiProvider.js"></script>
	
		<script src="apps/conspector/js/common/servicesProvider.js"></script>
		<script src="apps/conspector/js/common/historyProvider.js"></script>
		<script src="apps/conspector/js/common/filtersProvider.js"></script>
		<script src="apps/conspector/js/common/controlsProvider.js"></script>						
		<script src="apps/conspector/js/mainController.js"></script>

		<!--MOBILE CONTROLLERS -->	
		
		<!--Minification starts here-->

		<!--WEBAPP CONTROLLERS -->	
		
		
		
		<script src="apps/conspector/components/generalLayout/controllers/appController.js"></script>
		<script src="apps/conspector/components/landingPage/controllers/landingPageController.js"></script>
		

		
		<!--
  		
		<%@page import="java.util.*" %>
		<%
			Random rand = new Random();// needed to prevent caching of the minimized file
			int n = rand.nextInt(1000);
		%>		
 		<script src="dist/conspector.min.js?number=<%=n%>"></script> 
 		-->

	</head>
	<body id="body" ng-controller="mainController">
		<!-- <div ng-show="$root.showSpinner" layout="row" layout-align="center center" style="position: absolute; z-index: 2; height: 100%; width: 100%;">
			<md-progress-circular md-mode="indeterminate"> </md-progress-circular>
		</div> -->
		
		<div ui-view></div>
	</body>
</html>