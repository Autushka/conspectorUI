viewControllers.controller('passwordResetView', ['$scope', '$rootScope', '$state', 'dataProvider', '$translate', 'servicesProvider', 'utilsProvider', 'cacheProvider', 'apiProvider', '$stateParams', 'historyProvider',
	function($scope, $rootScope, $state, dataProvider, $translate, servicesProvider, utilsProvider, cacheProvider, apiProvider, $stateParams, historyProvider) {
		
		$scope.oForms = {};

		$scope.resetPasswordData = {
			sNewPassword: "",
			sNewPasswordConfirmation: ""
		};
		$rootScope.sCurrentStateName = $state.current.name;	
 		$rootScope.oStateParams = {};// for backNavigation			
		$scope.onChangeLanguage = function() {
			servicesProvider.changeLanguage();
		}

		$scope.resetPassword = function() {
			$scope.oForms.passwordResetForm.password.$setDirty();
			$scope.oForms.passwordResetForm.passwordConfirmation.$setDirty();
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
					sText: $translate.instant('passwordReset_passwordsDontMatch'),
					sType: "error"
				});
				return;
			}

			oData.newPassword = SHA512.hex($scope.resetPasswordData.sNewPassword);
			oData.passwordRecoveryCode = $stateParams.pr;
			
			var onSuccess = function(oData){
				var bNoErrorMessages = servicesProvider.messagesHandler(oData.messages);
				if (bNoErrorMessages) {
					$state.go("signIn");
				}				
			}

			var oResetPasswordSvc = apiProvider.resetPasswordWithPRCode({oData: oData, onSuccess: onSuccess});
		};

		$scope.onBack = function() {
			if(!historyProvider.aHistoryStates.length){
				$state.go('signIn');
			}
			historyProvider.navigateBack({
				oState: $state
			});
		};

		$scope.$on("$destroy", function() {
			historyProvider.addStateToHistory({
				sStateName: $rootScope.sCurrentStateName
			});
		});			
	}
]);