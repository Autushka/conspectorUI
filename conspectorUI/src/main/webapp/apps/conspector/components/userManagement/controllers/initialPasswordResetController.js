viewControllers.controller('initialPasswordResetView', ['$scope', '$rootScope', '$state', 'dataProvider', '$translate', 'servicesProvider', 'cacheProvider', 'apiProvider',
	function($scope, $rootScope, $state, dataProvider, $translate, servicesProvider, cacheProvider, apiProvider) {
		$scope.resetPasswordData = {
			sNewPassword: "",
			sNewPasswordConfirmation: ""
		};

		$scope.onChangeLanguage = function() {
			servicesProvider.changeLanguage();
		};
		
		var onUserUpdated = function(oData){
			cacheProvider.oUserProfile.sLastModifiedAt = oData.LastModifiedAt;
			servicesProvider.onLogInSuccessHandler(cacheProvider.oUserProfile.sUserName, "");
		};

		$scope.resetPassword = function() {
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

		$scope.onBack = function(){
			if(!$rootScope.sFromState){
				$state.go('signIn');
				return;
			}				
			$state.go($rootScope.sFromState, $rootScope.oFromStateParams);
		};		
	}
]);