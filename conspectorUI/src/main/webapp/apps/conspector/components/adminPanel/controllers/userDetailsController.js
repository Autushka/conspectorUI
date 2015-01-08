viewControllers.controller('userDetailsView', ['$rootScope', '$scope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', '$window', '$upload', 'CONSTANTS',
	function($rootScope, $scope, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, $window, $upload, CONSTANTS) {
		var sUserName = $stateParams.sUserName;
		var bDataHasBeenModified = false;
		var oNavigateToInfo = {}; //needed to keen in scope info about state change parameters (for save and leave scenario)

		$scope.sGlobalAdministratorRole = CONSTANTS.sGlobalAdministatorRole;
		$scope.sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
		$scope.sMode = $stateParams.sMode;
		$scope.oUser = {
			_aCompanies: [],
			_aPhases: [],
			_aRoles: []
		};

		var oUserWrapper = {
			aData: []
		};

		$scope.aCompanies = [];
		$scope.aRoles = [];
		$scope.aPhases = [];

		var setDisplayedUserDetails = function(oUser) {
			$scope.oUser.sUserName = oUser.UserName;
			$scope.oUser.sEmail = oUser.EMail;
			$scope.oUser._lastModifiedAt = oUser.LastModifiedAt;
			$scope.oUser.sCreatedAt = utilsProvider.dBDateToSting(oUser.CreatedAt);
			$scope.oUser.sLastModifiedAt = utilsProvider.dBDateToSting(oUser.LastModifiedAt);
			$scope.oUser._aCompanies = angular.copy(oUser.CompanyDetails.results)
			$scope.oUser._aPhases = angular.copy(oUser.PhaseDetails.results);
			$scope.oUser._aRoles = angular.copy(oUser.RoleDetails.results)
			if (oUser.AvatarFileGuid) {
				$scope.oUser.sAvatarUrl = $window.location.origin + $window.location.pathname + "rest/file/get/" + oUser.AvatarFileGuid;
			} else {
				$scope.oUser.sAvatarUrl = $window.location.origin + $window.location.pathname + "img/noAvatar.jpg";
			}
			oUserWrapper.aData.push($scope.oUser);
		}

		var oUser = cacheProvider.getEntityDetails({
			sCacheProviderAttribute: "oUserEntity",
			sRequestSettings: "GeneralAttributes/IsDeleted eq false" + "CompanyDetails,PhaseDetails,RoleDetails", //filter + expand
			sKeyName: "UserName",
			sKeyValue: $stateParams.sUserName
		});

		var onCompaniesLoaded = function(aData) {
			//Sort aData by company sorting sequence 
			for (var i = 0; i < aData.length; i++) {
				aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
			}
			aData = $filter('orderBy')(aData, ["_sortingSequence"]);

			var aUserCompaniesKeys = [];

			for (var i = 0; i < $scope.oUser._aCompanies.length; i++) {
				aUserCompaniesKeys.push($scope.oUser._aCompanies[i].CompanyName);
			}

			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: aData
				},
				oParentArrayWrapper: oUserWrapper,
				oNewParentItemArrayWrapper: oUserWrapper,
				sNameEN: "CompanyName",
				sNameFR: "CompanyName",
				sDependentKey: "CompanyName",
				aParentKeys: aUserCompaniesKeys,
				sTargetArrayNameInParent: "aCompanies"
			});

			if (oUserWrapper.aData[0]) {
				$scope.aCompanies = angular.copy(oUserWrapper.aData[0].aCompanies);
			}
		};

		var onRolesLoaded = function(aData) {
			//Sort aData by role sorting sequence 
			for (var i = 0; i < aData.length; i++) {
				aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
			}
			aData = $filter('orderBy')(aData, ["_sortingSequence"]);

			var aUserRolesKeys = [];

			for (var i = 0; i < $scope.oUser._aRoles.length; i++) {
				aUserRolesKeys.push($scope.oUser._aRoles[i].Guid);
			}

			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: aData
				},
				oParentArrayWrapper: oUserWrapper,
				oNewParentItemArrayWrapper: oUserWrapper,
				sNameEN: "RoleName",
				sNameFR: "RoleName",
				sDependentKey: "Guid",
				aParentKeys: aUserRolesKeys,
				sTargetArrayNameInParent: "aRoles"
			});

			if (oUserWrapper.aData[0]) {
				$scope.aRoles = angular.copy(oUserWrapper.aData[0].aRoles);
			}
		};

		var onProjectsLoaded = function(aData) {
			//Sort aData by project sorting sequence and then by phases sorting sequence...
			for (var i = 0; i < aData.length; i++) {
				aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
				for (var j = 0; j < aData[i].PhaseDetails.results.length; j++) {
					if (aData[i].PhaseDetails.results[j].GeneralAttributes.IsDeleted) { // Filtering on expanded entities doesn't work right now in olingo...
						aData[i].PhaseDetails.results.splice(j, 1);
						break;
					}
					aData[i].PhaseDetails.results[j]._sortingSequence = aData[i].PhaseDetails.results[j].GeneralAttributes.SortingSequence;
				}
				aData[i].PhaseDetails.results = $filter('orderBy')(aData[i].PhaseDetails.results, ["_sortingSequence"]);
			}
			aData = $filter('orderBy')(aData, ["_sortingSequence"]);

			var aUserPhasesGuids = [];

			for (var i = 0; i < $scope.oUser._aPhases.length; i++) {
				aUserPhasesGuids.push($scope.oUser._aPhases[i].Guid);
			}

			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: aData
				},
				sSecondLevelAttribute: "PhaseDetails",
				sSecondLevelNameEN: "NameEN",
				sSecondLevelNameFR: "NameFR",
				oParentArrayWrapper: oUserWrapper,
				oNewParentItemArrayWrapper: oUserWrapper,
				sNameEN: "NameEN",
				sNameFR: "NameFR",
				sDependentKey: "Guid",
				aParentKeys: aUserPhasesGuids,
				sTargetArrayNameInParent: "aPhases"
			});

			if (oUserWrapper.aData[0]) {
				$scope.aPhases = angular.copy(oUserWrapper.aData[0].aPhases);
			}
		};

		var onUserDetailsLoaded = function(oData) {
			setDisplayedUserDetails(oData);

			apiProvider.getCompanies({
				bShowSpinner: false,
				onSuccess: onCompaniesLoaded
			});

			apiProvider.getProjectsWithPhases({
				bShowSpinner: false,
				onSuccess: onProjectsLoaded
			});

			apiProvider.getRoles({
				bShowSpinner: false,
				onSuccess: onRolesLoaded
			});
		};

		var getUserDetails = function() {
			apiProvider.getUserWithCompaniesPhasesAndRoles({
				sKey: sUserName,
				bShowSpinner: true,
				onSuccess: onUserDetailsLoaded,
			});
		};

		if ($scope.sMode !== "create") {
			if (angular.equals(oUser, {})) { //in case of F5
				getUserDetails();
			} else { //in case when data is retrieved from the cash
				setDisplayedUserDetails(oUser);
				apiProvider.getCompanies({
					bShowSpinner: false,
					onSuccess: onCompaniesLoaded
				});
				apiProvider.getProjectsWithPhases({
					bShowSpinner: false,
					onSuccess: onProjectsLoaded
				});
				apiProvider.getRoles({
					bShowSpinner: false,
					onSuccess: onRolesLoaded
				});
			}
		} else {
			$scope.oUser.sAvatarUrl = $window.location.origin + $window.location.pathname + "img/noAvatar.jpg";
			apiProvider.getCompanies({
				bShowSpinner: false,
				onSuccess: onCompaniesLoaded
			});
			apiProvider.getProjectsWithPhases({
				bShowSpinner: false,
				onSuccess: onProjectsLoaded
			});
			apiProvider.getRoles({
				bShowSpinner: false,
				onSuccess: onRolesLoaded
			});
		}

		$scope.onBack = function() {
			$state.go($rootScope.sFromState, $rootScope.oFromStateParams);
		};

		$scope.onEdit = function() {
			$scope.sMode = "edit";
		};


		var deleteUser = function() {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				cacheProvider.cleanEntitiesCache("oUserEntity");
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

		$scope.onDelete = function($event) {
			servicesProvider.showConfirmationPopup({
				sHeader: $translate.instant('userDetails_deletionConfirmationHeader'),
				sContent: $translate.instant('userDetails_deletionConfirmationContent'),
				sOk: $translate.instant('global_ok'),
				sCancel: $translate.instant('global_cancel'),
				onOk: deleteUser,
				event: $event
			});
		};

		var prepareLinksForSave = function() { // link user to roles and phases
			var aLinks = [{
				sRelationName: "CompanyDetails",
				aUri: []
			}, {
				sRelationName: "RoleDetails",
				bKeepCompanyDependentLinks: true,
				aUri: []
			}, {
				sRelationName: "PhaseDetails",
				bKeepCompanyDependentLinks: true,
				aUri: []
			}];
			var sUri = "";
			for (var i = 0; i < $scope.aCompanies.length; i++) {
				if ($scope.aCompanies[i].ticked) {
					sUri = "Companys('" + $scope.aCompanies[i].CompanyName + "')";
					aLinks[0].aUri.push(sUri);
				}
			}

			for (var i = 0; i < $scope.aRoles.length; i++) {
				if ($scope.aRoles[i].ticked) {
					sUri = "Roles('" + $scope.aRoles[i].Guid + "')";
					aLinks[1].aUri.push(sUri);
				}
			}

			for (var i = 0; i < $scope.aPhases.length; i++) {
				if ($scope.aPhases[i].ticked) {
					sUri = "Phases('" + $scope.aPhases[i].Guid + "')";
					aLinks[2].aUri.push(sUri);
				}
			}

			return aLinks;
		};

		$scope.onDataModified = function() {
			bDataHasBeenModified = true;
		};

		$scope.onSave = function(bSaveAndNew, oNavigateTo) {
			var SHA512 = new Hashes.SHA512;

			var oDataForSave = {
				GeneralAttributes: {}
			};
			var aLinks = [];

			var onSuccessCreation = function(oData) {
				cacheProvider.cleanEntitiesCache("oUserEntity");
				bDataHasBeenModified = false;
				if (oNavigateTo) {
					$state.go(oNavigateTo.toState, oNavigateTo.toParams);
				}

				if (!bSaveAndNew) {
					$scope.sMode = "display";
					$scope.oUser._lastModifiedAt = oData.LastModifiedAt;
					$scope.oUser.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
					$scope.oUser.sCreatedAt = utilsProvider.dBDateToSting(oData.CreatedAt);
					$scope.oUser.sPassword = "";
					$scope.oUser.sPasswordConfirmation = "";
				} else {
					$scope.oUser.sUserName = "";
					$scope.oUser.sEmail = "";
					$scope.oUser._aCompanies = [];
					$scope.oUser._aPhases = [];
					$scope.oUser._aRoles = [];
					$scope.oUser.sPassword = "";
					$scope.oUser.sPasswordConfirmation = "";
					$scope.oUser.sAvatarUrl = $window.location.origin + $window.location.pathname + "img/noAvatar.jpg";
				}
			};
			var onSuccessUpdate = function(oData) {
				cacheProvider.cleanEntitiesCache("oUserEntity");
				bDataHasBeenModified = false;
				if (oNavigateTo) {
					$state.go(oNavigateTo.toState, oNavigateTo.toParams);
				}

				$scope.oUser._lastModifiedAt = oData.LastModifiedAt;
				$scope.oUser.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
				$scope.oUser.sPassword = "";
				$scope.oUser.sPasswordConfirmation = "";
				$scope.sMode = "display";
			};

			oDataForSave.UserName = $scope.oUser.sUserName;
			oDataForSave.EMail = $scope.oUser.sEmail;
			oDataForSave.LastModifiedAt = $scope.oUser._lastModifiedAt;
			oDataForSave.AvatarFileGuid = $scope.oUser._avatarFileGuid;

			if ($scope.oUser.sPassword && $scope.oUser.sPassword === $scope.oUser.sPasswordConfirmation) {
				oDataForSave.Password = apiProvider.hashPassword(SHA512.hex($scope.oUser.sPassword));
				oDataForSave.IsPasswordInitial = true;
			}

			aLinks = prepareLinksForSave();
			switch ($scope.sMode) {
				case "edit":
					apiProvider.updateUser({
						bShowSpinner: true,
						sKey: oDataForSave.UserName,
						oData: oDataForSave,
						aLinks: aLinks,
						bShowSuccessMessage: true,
						bShowErrorMessage: true,
						onSuccess: onSuccessUpdate
					});
					break;
				case "create":
					if (!oDataForSave.Password) {
						utilsProvider.displayMessage({
							sText: $translate.instant('global_noInitialPasswordProvided'),
							sType: "error"
						});
						return;
					}
					apiProvider.createUser({
						bShowSpinner: true,
						oData: oDataForSave,
						aLinks: aLinks,
						bShowSuccessMessage: true,
						bShowErrorMessage: true,
						onSuccess: onSuccessCreation
					});
					break;
			}
		};

		$scope.onSaveAndNew = function() {
			$scope.onSave(true);

		};

		var onImgSelected = function(aImgFiles, sPath, $event) {
			for (var i = 0; i < aImgFiles.length; i++) {
				var file = aImgFiles[i];
				var sPath = servicesProvider.costructUploadUrl({
					sPath: sPath
				});
				$scope.upload = $upload.upload({
					url: sPath,
					file: file,
				});
				$scope.upload.success(function(sData) {
					$scope.oUser.sAvatarUrl = $window.location.origin + $window.location.pathname + "rest/file/get/" + sData;
					$scope.oUser._avatarFileGuid = sData;
				});
			}
		};

		$scope.onAvatarSelected = function(aFiles, $event) {
			onDataModified();
			onImgSelected(aFiles, "rest/file/createUploadUrl/users/users/_avatar_", $event);
		};

		var saveAndLeaveView = function() {
			$scope.onSave(false, oNavigateToInfo);
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