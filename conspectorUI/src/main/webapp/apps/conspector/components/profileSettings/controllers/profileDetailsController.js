viewControllers.controller('profileDetailsView', ['$scope', '$rootScope', '$state', '$translate', 'utilsProvider', 'dataProvider', 'cacheProvider', '$filter', 'rolesSettings', 'servicesProvider', 'apiProvider', '$cookieStore', '$window', '$upload', 'rolesSettings',
	function($scope, $rootScope, $state, $translate, utilsProvider, dataProvider, cacheProvider, $filter, rolesSettings, servicesProvider, apiProvider, $cookieStore, $window, $upload, rolesSettings) {
		var sCurrentUser = cacheProvider.oUserProfile.sUserName;
		var sCompany = cacheProvider.oUserProfile.sCurrentCompany;
		var bDataHasBeenModified = false;
		var oNavigateToInfo = {}; //needed to keen in scope info about state change parameters (for save and leave scenario)
		$scope.oUser = {};
		$scope.sMode = "display";

		var oUserWrapper = {
			aData: [{}]
		};

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

		var onUserDetailsLoaded = function(oData) {
			var sProjectName = "";
			var sPhaseName = "";
			$scope.oUser.sUserName = oData.UserName;
			$scope.oUser.sEmail = oData.EMail;
			$scope.oUser._lastModifiedAt = oData.LastModifiedAt;
			$scope.oUser.sCreatedAt = utilsProvider.dBDateToSting(oData.CreatedAt);
			$scope.oUser.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
			$scope.oUser._aCompanies = []; // needed in order to figure out if sCompanies info should be displayed (> 1 compmanies should be assigned to the user)
			$scope.oUser.sCompanies = "";
			for (var i = 0; i < oData.CompanyDetails.results.length; i++) {
				if (!oData.CompanyDetails.results[i].GeneralAttributes.IsDeleted) {
					$scope.oUser._aCompanies.push(oData.CompanyDetails.results[i]);
					$scope.oUser.sCompanies = $scope.oUser.sCompanies + oData.CompanyDetails.results[i].CompanyName + "; ";
				}
			}
			$scope.oUser.sRoles = "";
			for (var i = 0; i < oData.RoleDetails.results.length; i++) {
				if (!oData.RoleDetails.results[i].GeneralAttributes.IsDeleted && oData.RoleDetails.results[i].CompanyName === sCompany) {
					$scope.oUser.sRoles = $scope.oUser.sRoles + oData.RoleDetails.results[i].RoleName + "; ";
				}
			}
			$scope.oUser.sPhases = "";
			for (var i = 0; i < oData.PhaseDetails.results.length; i++) {
				if (!oData.PhaseDetails.results[i].GeneralAttributes.IsDeleted && oData.PhaseDetails.results[i].CompanyName === sCompany) {
					sProjectName = $translate.use() === "en" ? oData.PhaseDetails.results[i].ProjectDetails.NameEN : oData.PhaseDetails.results[i].ProjectDetails.NameFR;
					if (!sProjectName) {
						sProjectName = oData.PhaseDetails.results[i].ProjectDetails.NameEN;
					}
					$scope.oUser.sPhases = $scope.oUser.sPhases + sProjectName + " - ";
					sPhaseName = $translate.use() === "en" ? oData.PhaseDetails.results[i].NameEN : oData.PhaseDetails.results[i].NameFR;
					if (!sPhaseName) {
						sPhaseName = oData.PhaseDetails.results[i].NameEN;
					}
					$scope.oUser.sPhases = $scope.oUser.sPhases + sPhaseName + "; ";
				}
			}

			if (oData.AvatarFileGuid) {
				$scope.oUser.sAvatarUrl = $window.location.origin + $window.location.pathname + "rest/file/get/" + oData.AvatarFileGuid;
			} else {
				$scope.oUser.sAvatarUrl = $window.location.origin + $window.location.pathname + "img/noAvatar.jpg";
			}
			
			$scope.oUser._sLanguage = oData.Language;
			oUserWrapper.aData[0] = angular.copy($scope.oUser);
			constructLanguageMultiSelect();
		};

		var getUserDetails = function() {
			apiProvider.getUserWithCompaniesPhasesAndRoles({
				sKey: sCurrentUser,
				bShowSpinner: true,
				onSuccess: onUserDetailsLoaded,
			});
		};

		getUserDetails();

		$scope.onDataModified = function() {
			bDataHasBeenModified = true;
		};

		$scope.onEdit = function() {
			$scope.sMode = "edit";
		};

		$scope.onSave = function(oNavigateTo) {
			var oDataForSave = {
				GeneralAttributes: {}
			};

			var onSuccessUpdate = function(oData) {
				cacheProvider.cleanEntitiesCache("oUserEntity");
				cacheProvider.oUserProfile.sLastModifiedAt = oData.LastModifiedAt;
				bDataHasBeenModified = false;
				if (oNavigateTo) {
					$state.go(oNavigateTo.toState, oNavigateTo.toParams);
				}

				$scope.oUser._lastModifiedAt = oData.LastModifiedAt;
				$scope.oUser.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
				$scope.sMode = "display";
			};

			oDataForSave.UserName = $scope.oUser.sUserName;
			oDataForSave.EMail = $scope.oUser.sEmail;
			oDataForSave.LastModifiedAt = $scope.oUser._lastModifiedAt;
			oDataForSave.AvatarFileGuid = $scope.oUser._avatarFileGuid;

			for (var i = 0; i < $scope.aLanguages.length; i++) {
				if ($scope.aLanguages[i].ticked) {
					oDataForSave.Language = $scope.aLanguages[i].languageCode;
					break;
				}
			}				

			apiProvider.updateUser({
				bShowSpinner: true,
				sKey: oDataForSave.UserName,
				oData: oDataForSave,
				bShowSuccessMessage: true,
				bShowErrorMessage: true,
				onSuccess: onSuccessUpdate
			});
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