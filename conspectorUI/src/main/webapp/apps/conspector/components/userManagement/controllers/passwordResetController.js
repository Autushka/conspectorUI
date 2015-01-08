viewControllers.controller('passwordResetView', ['$scope', '$rootScope', '$state', 'dataProvider', '$translate', 'servicesProvider', 'cacheProvider', 'apiProvider', '$stateParams',
	function($scope, $rootScope, $state, dataProvider, $translate, servicesProvider, cacheProvider, apiProvider, $stateParams) {
		$scope.resetPasswordData = {
			sNewPassword: "",
			sNewPasswordConfirmation: ""
		};

		$scope.onChangeLanguage = function() {
			servicesProvider.changeLanguage();
		}

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
				servicesProvider.displayMessage({
					sText: $translate.instant('passwordReset_passwordsDontMatch'),
					sType: "error"
				});
				return;
			}

			oData.newPassword = SHA512.hex($scope.resetPasswordData.sNewPassword);
			oData.passwordRecoveryCode = $stateParams.pr;

			var oResetPasswordSvc = apiProvider.resetPasswordWithPRCode(oData);

			oResetPasswordSvc.then(function(oData) {
				var bNoErrorMessages = servicesProvider.messagesHandler(oData.messages);
				if (bNoErrorMessages) {
					$state.go("signIn");
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