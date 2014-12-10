var notSavedDataPopUpController = function($scope, $modalInstance) {

	//	$scope.roles = roles;
	//	
	//	if(currentRole != ""){
	//		$scope.selectedRole = currentRole;		
	//	}
	//	else{
	//		$scope.selectedRole = roles[0].description;		
	//	}

	//	$scope.header = jQuery.i18n.prop('roleSelectorPopUp.headerTE');
	//$scope.cancelTE = jQuery.i18n.prop('global.cancelTE');
	$scope.okTE = jQuery.i18n.prop('global.okTE');

	//$scope.selectedReportType = "deficineciesList";

	$scope.ok = function() {
		//alert("Yo!");		
		$modalInstance.close(true);//save before leaving
	};

	$scope.no = function() {
		//$modalInstance.dismiss('cancel');
		$modalInstance.close(false);
	};

	// $scope.onRBClick = function($event) { // for some reason regular binding didn't work out here...
	// 	if ($event.toElement) {
	// 		$scope.selectedReportType = $event.toElement.value;
	// 	} else {
	// 		$scope.selectedReportType = $event.target.value; // Fire Fox
	// 	}
	// };

	//	$scope.onRBClick = function($event) {// for some reason regular binding didn't work out here...
	//		if ($event.toElement) {
	//			$scope.selectedRole = $event.toElement.value;
	//		} else {
	//			$scope.selectedRole = $event.target.value; // Fire Fox
	//		}
	//	};
};