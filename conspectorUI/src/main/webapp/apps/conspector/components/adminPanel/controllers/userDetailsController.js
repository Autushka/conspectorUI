viewControllers.controller('userDetailsView', ['$scope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider',
	function($scope, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider) {
		var sFromState = $stateParams.sFromState;
		var sUserName = $stateParams.sUserName;
		$scope.sMode = $stateParams.sMode;

		var setDisplayedUserDetails = function(oUser) {
			$scope.oUser = {};
			$scope.oUser.sUserName = oUser.UserName;
			$scope.oUser.sEmail = oUser.EMail;
			$scope.oUser._lastModifiedAt = oUser.LastModifiedAt;
			$scope.oUser.sCreatedAt = utilsProvider.dBDateToSting(oUser.CreatedAt);
			$scope.oUser.sLastModifiedAt = utilsProvider.dBDateToSting(oUser.LastModifiedAt);

		}

		var oUser = cacheProvider.getEntityDetails({
			sCacheProviderAttribute: "oUserEntity",
			sRequestSettings: "GeneralAttributes/IsDeleted eq false",
			sKeyName: "UserName",
			sKeyValue: $stateParams.sUserName
		});

		var onUserDetailsLoaded = function(oData) {
			setDisplayedUserDetails(oData);
		};

		var getUserDetails = function() {
			apiProvider.getUser({
				sKey: sUserName,
				bShowSpinner: true,
				onSuccess: onUserDetailsLoaded,
			});
		};

		if ($scope.sMode !== "create") {
			if (angular.equals(oUser, {})) {
				getUserDetails();
			} else {
				setDisplayedUserDetails(oUser);
			}
		}

		$scope.onBack = function() {
			$state.go(sFromState);
		};

		$scope.onEdit = function() {
			$scope.sMode = "edit";
		};

		$scope.onDelete = function() {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				$state.go('app.adminPanel.usersList');
			}
			oDataForSave.UserName = $scope.oUser.sUserName;
			oDataForSave.LastModifiedAt = $scope.oUser._lastModifiedAt;
			apiProvider.updateUser({
				bShowSpinner: true,
				sKey: oDataForSave.UserName,
				oData: oDataForSave,
				bShowSuccessMessage: true,
				bShowErrorMessage: true,
				onSuccess: onSuccessDelete
			});
		};

		$scope.onSave = function() {
			var oDataForSave = {
				GeneralAttributes: {}
			};
			var onSuccessCreation = function(oData) {
				$scope.oUser._lastModifiedAt = oData.LastModifiedAt;
				$scope.oUser.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
				$scope.oUser.sCreatedAt = utilsProvider.dBDateToSting(oData.CreatedAt);
				$scope.sMode = "display";

			};
			var onSuccessUpdate = function(oData) {
				$scope.oUser._lastModifiedAt = oData.LastModifiedAt;
				$scope.oUser.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
				$scope.sMode = "display";
			};

			oDataForSave.UserName = $scope.oUser.sUserName;
			oDataForSave.EMail = $scope.oUser.sEmail;
			oDataForSave.LastModifiedAt = $scope.oUser._lastModifiedAt;
			switch ($scope.sMode) {
				case "edit":
					apiProvider.updateUser({
						bShowSpinner: true,
						sKey: oDataForSave.UserName,
						oData: oDataForSave,
						bShowSuccessMessage: true,
						bShowErrorMessage: true,
						onSuccess: onSuccessUpdate
					});
					break;
				case "create":
					apiProvider.createUser({
						bShowSpinner: true,
						oData: oDataForSave,
						bShowSuccessMessage: true,
						bShowErrorMessage: true,
						onSuccess: onSuccessCreation
					});
					break;
			}

		};
	}
]);