viewControllers.controller('userSettingsView', function($scope, $rootScope, dataSrv, globalSrv, $state) {
	$scope.changeProfileTE = jQuery.i18n.prop('userSettingsView.changeProfileTE');
	$scope.changePasswordTE = jQuery.i18n.prop('userSettingsView.changePasswordTE');

	$scope.communicationLns = [{}, {}];	
	
	$scope.communicationLns[0].description = jQuery.i18n.prop('global.englishTE');
	$scope.communicationLns[1].description = jQuery.i18n.prop('global.frenchTE');

	$scope.communicationLns[0].code = "en";
	$scope.communicationLns[1].code = "fr";

	$scope.aLeftSideNavigationLinks = [];

	$scope.aLeftSideNavigationLinks.push({
		linkTE: $scope.changeProfileTE,
		arrowClasses: "arrow-right cnpNotTransparent",
		stateToNavigate: "^.myProfile",
		globalStateObject: $state,
		hash: "#/app/userSettings/userManagement"
	});

	$scope.aLeftSideNavigationLinks.push({
		linkTE: $scope.changePasswordTE,
		arrowClasses: "arrow-right",
		stateToNavigate: "^.changePassword",
		globalStateObject: $state,
		hash: "#/app/userSettings/changePassword"
	});

	var fnSetActiveSideNavigationLink = function(aLinks, oLink){
		if(oLink.arrowClasses.indexOf("cnpNotTransparent") >= 0){
			return;
		}
		for (var i = 0; i < aLinks.length; i++) {
			aLinks[i].arrowClasses = aLinks[i].arrowClasses.replace(" cnpNotTransparent", "");
		}
		oLink.arrowClasses = oLink.arrowClasses + " cnpNotTransparent";
	};	

	for (var i = 0; i < $scope.aLeftSideNavigationLinks.length; i++) {
		if(location.hash.indexOf($scope.aLeftSideNavigationLinks[i].hash) >= 0){
			fnSetActiveSideNavigationLink($scope.aLeftSideNavigationLinks, $scope.aLeftSideNavigationLinks[i]);
		}
	}

	$scope.onLeftSideNavigationLinkClick = function(aLinks, oLink){
		fnSetActiveSideNavigationLink(aLinks, oLink);
		oLink.globalStateObject.go(oLink.stateToNavigate);
	};		
});
