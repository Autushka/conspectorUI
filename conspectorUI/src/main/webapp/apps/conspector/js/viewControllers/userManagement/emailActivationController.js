viewControllers.controller('emailActivationView', function($scope, $rootScope, dataSrv, globalSrv, $stateParams) {
	$scope.refreshViewTE = function() {
		$scope.continueTE = jQuery.i18n.prop('emailActivationView.continueTE');
		$scope.successNotificationTE = jQuery.i18n.prop('emailActivationView.successNotificationTE');
		$scope.problemNotificationTE = jQuery.i18n.prop('emailActivationView.problemNotificationTE');		
	};
	$scope.refreshViewTE();
	$rootScope.viewTitleTE = jQuery.i18n.prop('emailActivationView.viewTitleTE');
	$rootScope.viewTitleTECode = 'emailActivationView.viewTitleTE';
	
	$scope.eMailVerificationCode = $stateParams.ev;	
	
	$scope.showSuccessNotification = false;
	$scope.showProblemNotification = false;
	
	var oEmailActivationSrv = dataSrv.httpRequest("jsp/account/eMailVerify.jsp", {eMailVerificationCode: $scope.eMailVerificationCode}, "POST", true);
	oEmailActivationSrv.then(function(oData) {
		if(oData.messages.length > 0){
			$scope.showSuccessNotification = true;			
		}
		else{
			$scope.showProblemNotification = true;
		}
	});
	
	$scope.onContinueClick = function(){
		window.location.href = globalSrv.getRoleInitialView(globalSrv.getNewUserInitialRole());
	};
});
