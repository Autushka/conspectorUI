viewControllers.controller('changePasswordView', function($scope, $rootScope, dataSrv, globalSrv) {
	$scope.viewTitleTE = jQuery.i18n.prop('changePasswordView.viewTitleTE');
	$scope.saveTE = jQuery.i18n.prop('changePasswordView.saveTE');
	$scope.oldPasswordTE = jQuery.i18n.prop('changePasswordView.oldPasswordTE');
	$scope.newPasswordTE = jQuery.i18n.prop('changePasswordView.newPasswordTE');
	$scope.confirmNewPasswordTE = jQuery.i18n.prop('changePasswordView.confirmNewPasswordTE');
	
	
	$scope.saveTE = jQuery.i18n.prop('changePasswordView.saveTE');
	
	// $rootScope.viewTitleTECode = 'userSettingsView.changePasswordSubviewTitleTE';
	
	var refreshPasswordData = function() {
		$scope.oPasswordData = {oldPassword: "", newPassword: "", confirmedNewPassword: ""};
	};
	
	refreshPasswordData();
	
	$scope.onCancelPasswordClick = function() {
		refreshPasswordData();
	};	
	
	$scope.onSavePasswordClick = function() {
		if ($scope.oPasswordData.newPassword !== $scope.oPasswordData.confirmedNewPassword) {
			noty({
				text: jQuery.i18n.prop('changePasswordView.passwordsDontMatchTE'),
				type: 'error',
				layout: CONSTANTS.messageDisplayLayout,
				timeout: CONSTANTS.messageDisplayTime
			});
			return;
		}
		
		var oPasswordDataForCommit = {};
		oPasswordDataForCommit.oldPassword = CryptoJS.SHA512($scope.oPasswordData.oldPassword).toString();
		oPasswordDataForCommit.newPassword = CryptoJS.SHA512($scope.oPasswordData.newPassword).toString();		
		
		var oChangePasswordSrv = dataSrv.httpRequest("jsp/account/changeProfileData.jsp", oPasswordDataForCommit, "POST", true);
		oChangePasswordSrv.then(function(oData) {
			globalSrv.messagesHandler(oData.messages);
		});		
	};	

});