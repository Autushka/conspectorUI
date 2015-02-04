viewControllers.controller('changePasswordView', ['$scope', '$rootScope', '$state', '$translate', 'utilsProvider', 'dataProvider', 'cacheProvider', '$filter', 'rolesSettings', 'servicesProvider', 'apiProvider',
	function($scope, $rootScope, $state, $translate, utilsProvider, dataProvider, cacheProvider, $filter, rolesSettings, servicesProvider, apiProvider) {
		
		$scope.oForms = {};

		var bDataHasBeenModified = false;
		var oNavigateToInfo = {}; //needed to keen in scope info about state change parameters (for save and leave scenario)
		$scope.oUser = {};

		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$rootScope.oStateParams = {}; // for backNavigation		

		$scope.onSave = function() {
			$scope.oForms.profileSettingsPasswordResetForm.password.$setDirty();
			$scope.oForms.profileSettingsPasswordResetForm.passwordConfirmation.$setDirty();
			var SHA512 = new Hashes.SHA512;

			var oDataForSave = {
				GeneralAttributes: {}
			};
			if (!$scope.oUser.sPassword || !$scope.oUser.sPasswordConfirmation) {
				utilsProvider.displayMessage({
					sText: $translate.instant("global_emptyFields"),
					sType: 'error'
				});
				return;
			}

			if ($scope.oUser.sPassword !== $scope.oUser.sPasswordConfirmation) {
				utilsProvider.displayMessage({
					sText: $translate.instant('global_passwordsDontMatch'),
					sType: "error"
				});
				return;
			}
			var onSuccessUpdate = function(oData){
				bDataHasBeenModified = false;
				$scope.oUser.sPassword = "";
				$scope.oUser.sPasswordConfirmation = "";
				cacheProvider.oUserProfile.sLastModifiedAt = oData.LastModifiedAt;

			};

			oDataForSave.UserName = cacheProvider.oUserProfile.sUserName;
			oDataForSave.LastModifiedAt = cacheProvider.oUserProfile.sLastModifiedAt;
			oDataForSave.Password = apiProvider.hashPassword(SHA512.hex($scope.oUser.sPassword));

			apiProvider.updateUser({
				bShowSpinner: true,
				sKey: oDataForSave.UserName,
				oData: oDataForSave,
				bShowSuccessMessage: true,
				bShowErrorMessage: true,
				onSuccess: onSuccessUpdate
			});

		};

		$scope.onDataModified = function() {
			bDataHasBeenModified = true;
		};

		var saveAndLeaveView = function() {
			$scope.onSave(oNavigateToInfo);
		};

		var leaveView = function() {
			bDataHasBeenModified = false;
			$state.go(oNavigateToInfo.toState, oNavigateToInfo.toParams);
		};

		$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			if (bDataHasBeenModified) {
				event.preventDefault();

				oNavigateToInfo = {
					toState: toState,
					toParams: toParams
				};
				servicesProvider.showConfirmationPopup({
					sHeader: $translate.instant('global_changesSaveConfirmationHeader'), //"Do you want to save changes before leaving the view?", //$translate.instant('userDetails_deletionConfirmationHeader'),
					sContent: $translate.instant('global_changesSaveConfirmationContent'), //"Not saved changes will be lost...", //$translate.instant('userDetails_deletionConfirmationContent'),
					sOk: $translate.instant('global_yes'),
					sCancel: $translate.instant('global_no'),
					onOk: saveAndLeaveView,
					onCancel: leaveView,
					event: event
				});
			}
		});
	}
]);