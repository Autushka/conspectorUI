viewControllers.controller('forgotPasswordView', function($scope, $rootScope, dataSrv, globalSrv) {
	$scope.refreshViewTE = function() {
		$scope.emailTE = jQuery.i18n.prop('forgotPasswordView.emailTE');
		$scope.userNameTE = "User Name";

		$scope.sendTE = jQuery.i18n.prop('forgotPasswordView.sendTE');
	};
	$scope.refreshViewTE();
	$rootScope.viewTitleTE = jQuery.i18n.prop('forgotPasswordView.viewTitleTE');
	$rootScope.viewTitleTECode = 'forgotPasswordView.viewTitleTE';

	$scope.viewData = {
		email: "",
		userName: ""
	};
	$scope.selectedIDType = "userName";

	$scope.$watch('selectedIDType', function() {
		if ($scope.selectedIDType == "userName") {
			$scope.viewData.email = "";
		} else {
			$scope.viewData.userName = "";
		}
	});

	$scope.emailFldKeyDown = function(event) {
		if (event.keyCode === 13) {
			$scope.resetPassword();
		}
	};

	$scope.onSendClick = function() {
		$scope.resetPassword();
	};

	$scope.resetPassword = function() {
		var oResetPasswordSrv = dataSrv.httpRequest("jsp/account/passwordRecovery.jsp", {
			email: $scope.viewData.email,
			userName: $scope.viewData.userName
		}, "POST", true);
		oResetPasswordSrv.then(function(oData) {
			globalSrv.messagesHandler(oData.messages);
		}, function(oData) {
			globalSrv.messagesHandler(oData.messages);
		});
	};
});
