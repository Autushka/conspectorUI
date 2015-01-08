viewControllers.controller('initialPasswordResetView', ['$scope', '$rootScope', '$state', 'dataProvider', '$translate', 'servicesProvider', 'cacheProvider', 'apiProvider',
	function($scope, $rootScope, $state, dataProvider, $translate, servicesProvider, cacheProvider, apiProvider) {
		$scope.resetPasswordData = {
			sNewPassword: "",
			sNewPasswordConfirmation: ""
		};

		$scope.onChangeLanguage = function() {
			servicesProvider.changeLanguage();
		};
		
		var onUserUpdated = function(){
			servicesProvider.onLogInSuccessHandler(cacheProvider.oUserProfile.sUserName, "");
		};

		$scope.resetPassword = function() {
			var SHA512 = new Hashes.SHA512;
			var oData = {};

			if (!$scope.resetPasswordData.sNewPassword || !$scope.resetPasswordData.sNewPasswordConfirmation) {
				utilsProvider.displayMessage({
					sText: $translate.instant("global_emptyFields"),
					sType: 'error'
				});
				return;
			}	

			if ($scope.resetPasswordData.sNewPassword !== $scope.resetPasswordData.sNewPasswordConfirmation) {
				utilsProvider.displayMessage({
					sText: $translate.instant('global_passwordsDontMatch'),
					sType: "error"
				});
				return;
			}

			oData.newPassword = SHA512.hex($scope.resetPasswordData.sNewPassword);
			oData.oldPassword = SHA512.hex(cacheProvider.oUserProfile.sCurrentPassword);

			var oChangePasswordSvc = apiProvider.changeUserPassword(oData);

			oChangePasswordSvc.then(function(oData) {
				var bNoErrorMessages = servicesProvider.messagesHandler(oData.messages);
				if (bNoErrorMessages) {
					cacheProvider.oUserProfile.sCurrentPassword = "";
					//service to clean Initial flag for the password...
					var oSvc = apiProvider.updateUser({
						bShowSpinner: false,
						sKey: cacheProvider.oUserProfile.sUserName,
						oData: {
							GeneralAttributes: {},
							UserName: cacheProvider.oUserProfile.sUserName,
							IsPasswordInitial: false,
							LastModifiedAt: cacheProvider.oUserProfile.sLastModifiedAt
						},
						onSuccess: onUserUpdated
					});
				}
			});
		};

		$scope.onBack = function(){
			if(!$rootScope.sFromState){
				$state.go('signIn');
				return;
			}				
			$state.go($rootScope.sFromState, $rootScope.oFromStateParams);
		};		
	}
]);