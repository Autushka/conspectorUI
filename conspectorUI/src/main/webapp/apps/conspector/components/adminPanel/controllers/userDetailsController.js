viewControllers.controller('userDetailsView', ['$scope', '$rootScope', '$state', '$stateParams', 'servicesProvider', 'apiProvider', '$translate', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', '$window', '$upload', 'CONSTANTS', 'historyProvider', 'rolesSettings',
	function($scope, $rootScope, $state, $stateParams, servicesProvider, apiProvider, $translate, cacheProvider, utilsProvider, $filter, dataProvider, $window, $upload, CONSTANTS, historyProvider, rolesSettings) {

		$scope.oForms = {};

		var sUserName = $stateParams.sUserName;
		var bDataHasBeenModified = false;
		var oNavigateToInfo = {}; //needed to keen in scope info about state change parameters (for save and leave scenario)
		$scope.bShowBackButton = historyProvider.aHistoryStates.length > 0 ? true : false;

		var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
		$scope.bIsGlobalUserAdministrator = rolesSettings[sCurrentRole].bIsGlobalUserAdministrator;
		$scope.bDisplayEditButton = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: sCurrentRole,
			sEntityName: "oUser",
			sOperation: "bUpdate"
		});

		$scope.bDisplayDeleteButton = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: sCurrentRole,
			sEntityName: "oUser",
			sOperation: "bDelete"
		});

		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation 
		$rootScope.oStateParams = angular.copy($stateParams);// for backNavigation

		$scope.sMode = $stateParams.sMode;
		$scope.oUser = {
			_aCompanies: [], //needed for manyToMany links...
			_aPhases: [],
			_aRoles: []
		};

		var oUserWrapper = {
			aData: [{}]
		};

		$scope.aCompanies = [];
		$scope.aRoles = [];
		$scope.aPhases = [];
		$scope.aContacts = [];
		$scope.aLanguages = [];

		var constructLanguageMultiSelect = function() {
			var aData = [];
			aData.push({
				languageCode: "en",
				descriptionEN: "English",
				descriptionFR: "Anglais"
			});
			aData.push({
				languageCode: "fr",
				descriptionEN: "French",
				descriptionFR: "Fran\u00E7ais"
			});
			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: aData
				},
				oParentArrayWrapper: oUserWrapper,
				sNameEN: "descriptionEN",
				sNameFR: "descriptionFR",
				sDependentKey: "languageCode",
				sParentKey: "_sLanguage",
				sTargetArrayNameInParent: "aLanguages"
			});

			if (oUserWrapper.aData[0]) {
				$scope.aLanguages = angular.copy(oUserWrapper.aData[0].aLanguages);
			}
		};

		var setDisplayedUserDetails = function(oUser) {
			$scope.oUser.sUserName = oUser.UserName;
			$scope.oUser.sEmail = oUser.EMail;
			$scope.oUser._lastModifiedAt = oUser.LastModifiedAt;
			$scope.oUser.sCreatedAt = utilsProvider.dBDateToSting(oUser.CreatedAt);
			$scope.oUser.sLastModifiedAt = utilsProvider.dBDateToSting(oUser.LastModifiedAt);
			$scope.oUser._aCompanies = angular.copy(oUser.CompanyDetails.results)
			$scope.oUser._aPhases = angular.copy(oUser.PhaseDetails.results);
			$scope.oUser._aRoles = angular.copy(oUser.RoleDetails.results);
			$scope.oUser._contactGuid = oUser.ContactGuid;
			$scope.oUser._sLanguage = oUser.Language;
			if (oUser.AvatarFileGuid) {
				$scope.oUser.sAvatarUrl = $window.location.origin + $window.location.pathname + "rest/file/get/" + oUser.AvatarFileGuid;
			} else {
				$scope.oUser.sAvatarUrl = $window.location.origin + $window.location.pathname + "img/noAvatar.jpg";
			}
			oUserWrapper.aData[0] = angular.copy($scope.oUser);
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

		var onContactsLoaded = function(aData) {
			//Sort aData by role sorting sequence 
			for (var i = 0; i < aData.length; i++) {
				if (aData[i].FirstName) {
					aData[i].sName = aData[i].FirstName;
				}
				if (aData[i].LastName) {
					if (aData[i].FirstName) {
						aData[i].sName = aData[i].sName + " ";
					}
					aData[i].sName = aData[i].sName + aData[i].LastName + ", " + aData[i].AccountDetails.Name;
				}
			}
			aData = $filter('orderBy')(aData, ["sName"]);

			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: aData
				},
				oParentArrayWrapper: oUserWrapper,
				sNameEN: "sName",
				sNameFR: "sName",
				sDependentKey: "Guid",
				sParentKey: "_contactGuid",
				sTargetArrayNameInParent: "aContacts"
			});

			if (oUserWrapper.aData[0]) {
				$scope.aContacts = angular.copy(oUserWrapper.aData[0].aContacts);
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
			apiProvider.getContacts({
				bShowSpinner: false,
				onSuccess: onContactsLoaded
			});
			constructLanguageMultiSelect();
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
				apiProvider.getContacts({
					bShowSpinner: false,
					onSuccess: onContactsLoaded
				});
				constructLanguageMultiSelect();
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
			apiProvider.getContacts({
				bShowSpinner: false,
				onSuccess: onContactsLoaded
			});
			constructLanguageMultiSelect();
		}

		$scope.onBack = function() {
			historyProvider.navigateBack({
				oState: $state
			});
		};

		$scope.onEdit = function() {
			$state.go('app.adminPanel.userDetails', {
				sMode: "edit",
				sUserName: $scope.oUser.sUserName
			});
		};


		var deleteUser = function() {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				historyProvider.navigateBack({
					oState: $state
				});
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
			var aLinks = [];
			var aUri = [];
			var sUri = "";

			for (var i = 0; i < $scope.aCompanies.length; i++) {
				if ($scope.aCompanies[i].ticked) {
					sUri = "Companys('" + $scope.aCompanies[i].CompanyName + "')";
					aUri.push(sUri);
				}
			}

			if (aUri.length) {
				aLinks.push({
					sRelationName: "CompanyDetails",
					aUri: aUri
				});
			}
			aUri = [];

			for (var i = 0; i < $scope.aRoles.length; i++) {
				if ($scope.aRoles[i].ticked) {
					sUri = "Roles('" + $scope.aRoles[i].Guid + "')";
					aUri.push(sUri);
				}
			}

			if (aUri.length) {
				aLinks.push({
					sRelationName: "RoleDetails",
					bKeepCompanyDependentLinks: true,
					aUri: aUri
				});
			}
			aUri = [];

			for (var i = 0; i < $scope.aPhases.length; i++) {
				if ($scope.aPhases[i].ticked) {
					sUri = "Phases('" + $scope.aPhases[i].Guid + "')";
					aUri.push(sUri);
				}
			}

			if (aUri.length) {
				aLinks.push({
					sRelationName: "PhaseDetails",
					bKeepCompanyDependentLinks: true,
					aUri: aUri
				});
			}

			return aLinks;
		};

		$scope.onDataModified = function() {
			bDataHasBeenModified = true;
		};

		$scope.onSave = function(bSaveAndNew, oNavigateTo) {
			if($scope.oForms.userDetailsForm.selectedCompanies){
				$scope.oForms.userDetailsForm.selectedCompanies.$setDirty();//to display validation messages on submit press
			}
			if($scope.oForms.userDetailsForm.username){
				$scope.oForms.userDetailsForm.username.$setDirty();
			}
			if($scope.oForms.userDetailsForm.email){
				$scope.oForms.userDetailsForm.email.$setDirty();
			}
			if($scope.oForms.userDetailsForm.password){
				$scope.oForms.userDetailsForm.password.$setDirty();
			}	
			if($scope.oForms.userDetailsForm.passwordConfirmation){
				$scope.oForms.userDetailsForm.passwordConfirmation.$setDirty();
			}			

			if(!$scope.oForms.userDetailsForm.$valid){
				return;
			}	

			var SHA512 = new Hashes.SHA512;

			var oDataForSave = {
				GeneralAttributes: {}
			};
			var aLinks = [];

			var onSuccessCreation = function(oData) {
				bDataHasBeenModified = false;
				if (oNavigateTo) {
					$state.go(oNavigateTo.toState, oNavigateTo.toParams);
					return;
				}
				if (!bSaveAndNew) {
					$state.go('app.adminPanel.userDetails', {
						sMode: "display",
						sUserName: oData.UserName,
					});
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
				if (oData.UserName === cacheProvider.oUserProfile.sUserName) {
					servicesProvider.refreshUserProfile();
				}
				bDataHasBeenModified = false;
				if (oNavigateTo) {
					$state.go(oNavigateTo.toState, oNavigateTo.toParams);
					return;
				}

				$scope.oUser._lastModifiedAt = oData.LastModifiedAt;
				$scope.oUser.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
				$scope.oUser.sPassword = "";
				$scope.oUser.sPasswordConfirmation = "";
				$state.go('app.adminPanel.userDetails', {
					sMode: "display",
					sUserName: oData.UserName,
				});
			};

			oDataForSave.UserName = $scope.oUser.sUserName;
			oDataForSave.EMail = $scope.oUser.sEmail;
			oDataForSave.LastModifiedAt = $scope.oUser._lastModifiedAt;
			oDataForSave.AvatarFileGuid = $scope.oUser._avatarFileGuid;

			if ($scope.oUser.sPassword && $scope.oUser.sPassword === $scope.oUser.sPasswordConfirmation) {
				oDataForSave.Password = apiProvider.hashPassword(SHA512.hex($scope.oUser.sPassword));
				oDataForSave.IsPasswordInitial = true;
			}

			for (var i = 0; i < $scope.aContacts.length; i++) {
				if ($scope.aContacts[i].ticked) {
					oDataForSave.ContactGuid = $scope.aContacts[i].Guid;
					break;
				}
			}
			for (var i = 0; i < $scope.aLanguages.length; i++) {
				if ($scope.aLanguages[i].ticked) {
					oDataForSave.Language = $scope.aLanguages[i].languageCode;
					break;
				}
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
			$scope.onDataModified();
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

		$scope.$on("$destroy", function() {
			if(historyProvider.getPreviousStateName() === $rootScope.sCurrentStateName){ //current state was already put to the history in the parent views
				return;
			}
			
			historyProvider.addStateToHistory({
				sStateName: $rootScope.sCurrentStateName,
				oStateParams: angular.copy($rootScope.oStateParams)
			});
		});
	}
]);
