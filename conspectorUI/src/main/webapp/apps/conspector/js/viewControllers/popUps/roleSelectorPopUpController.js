var roleSelectorPopUpController = function($scope, $modalInstance, roles, currentRole) {
	$scope.selectRoleTE = jQuery.i18n.prop('roleSelectorPopUp.selectRoleTE');
	$scope.okTE = jQuery.i18n.prop('roleSelectorPopUp.okTE');
	$scope.cancelTE = jQuery.i18n.prop('roleSelectorPopUp.cancelTE');

	
	$scope.roles = roles;
	
	if(currentRole != ""){
		$scope.selectedRole = currentRole;		
	}
	else{
		$scope.selectedRole = roles[0].description;		
	}

	$scope.ok = function() {
		$modalInstance.close($scope.selectedRole);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

	$scope.onRBClick = function($event) {// for some reason regular binding didn't work out here...
		if ($event.toElement) {
			$scope.selectedRole = $event.toElement.value;
		} else {
			$scope.selectedRole = $event.target.value; // Fire Fox
		}
	};
};