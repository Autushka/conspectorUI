viewControllers.controller('initialPasswordResetView', ['$scope', '$rootScope', '$state', 'dataProvider', '$translate', 'servicesProvider', 'utilsProvider', 'cacheProvider', 'apiProvider', 'historyProvider',
	function($scope, $rootScope, $state, dataProvider, $translate, servicesProvider, utilsProvider, cacheProvider, apiProvider, historyProvider) {
		
		$scope.oForms = {};

		$scope.resetPasswordData = {
			sNewPassword: "",
			sNewPasswordConfirmation: ""
		};
		$rootScope.sCurrentStateName = $state.current.name;	
 		$rootScope.oStateParams = {};// for backNavigation			
		$scope.onChangeLanguage = function() {
			servicesProvider.changeLanguage();
		};
		
		var onUserUpdated = function(oData){
			cacheProvider.oUserProfile.sLastModifiedAt = oData.LastModifiedAt;
			servicesProvider.onLogInSuccessHandler(cacheProvider.oUserProfile.sUserName, "");
		};

		$scope.resetPassword = function() {
			$scope.oForms.initialPasswordResetForm.password.$setDirty();
			$scope.oForms.initialPasswordResetForm.passwordConfirmation.$setDirty();
			var SHA512 = new Hashes.SHA512;
			var oDataForSave = {};

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

			oDataForSave.UserName = cacheProvider.oUserProfile.sUserName;
			oDataForSave.Password = apiProvider.hashPassword(SHA512.hex($scope.resetPasswordData.sNewPassword));
			oDataForSave.IsPasswordInitial = false;
			oDataForSave.LastModifiedAt = cacheProvider.oUserProfile.sLastModifiedAt;
			
			apiProvider.updateUser({
				bShowSpinner: true,
				sKey: oDataForSave.UserName,
				oData: oDataForSave,
				bShowSuccessMessage: true,
				bShowErrorMessage: true,
				onSuccess: onUserUpdated
			});			
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