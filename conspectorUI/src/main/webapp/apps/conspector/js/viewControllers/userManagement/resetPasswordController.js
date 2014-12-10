/*
 * #%L
 * ProjectX2013_03_23_web
 * %%
 * Copyright (C) 2013 - 2014 Powered by Sergey
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
viewControllers.controller('resetPasswordView', function($scope, $rootScope, dataSrv, globalSrv, $stateParams) {
	$scope.refreshViewTE = function() {
		$scope.newPasswordTE = jQuery.i18n.prop('athena.memberAreaView.newPasswordTE');
		$scope.confirmNewPasswordTE = jQuery.i18n.prop('athena.memberAreaView.confirmNewPasswordTE');
		$scope.resetTE = jQuery.i18n.prop('global.resetTE');
	};
	$scope.refreshViewTE();
	$rootScope.viewTitleTE = jQuery.i18n.prop('resetPasswordView.viewTitleTE');
	$rootScope.viewTitleTECode = 'resetPasswordView.viewTitleTE';

	$scope.oPasswordData = {
		newPassword: "",
		confirmedNewPassword: ""
	};
	$scope.oDataForReset = {};

	$scope.onResetClick = function() {
		if ($scope.oPasswordData.newPassword !== $scope.oPasswordData.confirmedNewPassword) {
			noty({
				text: jQuery.i18n.prop('athena.memberAreaView.passwordsDontMatchTE'),
				type: 'error',
				layout: CONSTANTS.messageDisplayLayout,
				timeout: CONSTANTS.messageDisplayTime
			});
			return;
		}

		$scope.oDataForReset.newPassword = CryptoJS.SHA512($scope.oPasswordData.newPassword).toString();
		$scope.oDataForReset.passwordRecoveryCode =$stateParams.pr;

		var oResetPasswordSrv = dataSrv.httpRequest("jsp/account/passwordRecoveryNewPassword.jsp", $scope.oDataForReset, "POST", true);
		oResetPasswordSrv.then(function(oData) {
			globalSrv.messagesHandler(oData.messages);
			window.location.href = "#/signIn/";
		});
	};

});
