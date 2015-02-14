viewControllers.controller('deficiencyQuickAddView', ['$rootScope', '$scope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS', 'historyProvider', 'rolesSettings', '$timeout', '$mdSidenav', '$window', '$cordovaCamera',
	function($rootScope, $scope, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS, historyProvider, rolesSettings, $timeout, $mdSidenav, $window, $cordovaCamera) {
		var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
		var bCanContinue = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: sCurrentRole,
			sEntityName: "oDeficiency",
			sOperation: "bCreate"
		});

		if (!bCanContinue) {
			servicesProvider.logOut(); //cancel login in case of 0 roles assigned to the user
			utilsProvider.displayMessage({
				sText: $translate.instant('global_noRightToCreateDeficiencies'),
				sType: "error"
			});
		}

		$scope.onLogOut = function() {
			servicesProvider.logOut();
		};

		$scope.iImagesValue = 0;

		$scope.iCurrentAttibuteIndex = 0;

		$scope.aProjectsWithPhases = [];
		var bPhaseWasSelected = false;
		$scope.aUnits = [];
		var bUnitWasSelected = false;
		$scope.aStatuses = [];
		var bStatusWasSelected = false;
		$scope.aPriorities = [];
		var bPriorityWasSelected = false;
		$scope.aUsers = [];
		var bUserWasSelected = false;
		$scope.aDescriptionTags = [];
		$scope.aLocationTags = [];
		$scope.aContractors = [];
		var bContractorWasSelected = false;

		$scope.oDeficiencyAttributes = {
			oPhase: {
				sDescription: $translate.instant('global_projectPhase'), //"Project - Phase",
				sValue: "...",
				bIsSelectionUnabled: true,
			},
			oUnit: {
				sDescription: $translate.instant('global_unit'), //"Unit",
				sValue: "...",
				bIsSelectionUnabled: false,
			},
			oStatus: {
				sDescription: $translate.instant('global_status'), //"Status",
				sValue: "...",
				bIsSelectionUnabled: true,
			},
			oPriority: {
				sDescription: $translate.instant('global_priority'), //"Priority",
				sValue: "...",
				bIsSelectionUnabled: true,
			},
			oUser: {
				sDescription: $translate.instant('global_user'), //"User",
				sValue: "...",
				bIsSelectionUnabled: true,
			},
			oDescriptionTags: {
				sDescription: $translate.instant('global_descriptionTags'), //"Description Tags",
				sValue: "...",
				bIsSelectionUnabled: true,
			},
			oLocationTags: {
				sDescription: $translate.instant('global_locationTags'), //"Location Tags",
				sValue: "...",
				bIsSelectionUnabled: true,
			},
			oContractors: {
				sDescription: $translate.instant('global_contractors'), //"Contractors",
				sValue: "...",
				bIsSelectionUnabled: false,
			},
			oImages: {
				sDescription: $translate.instant('global_images'), //"Photos",
				//iValue: 0,
				bIsSelectionUnabled: true,
			},
		};

		var onUnitsLoaded = function(oData) {
			oData.UnitDetails.results = $filter('filter')(oData.UnitDetails.results, function(oItem, iIndex) {
				return !oItem.GeneralAttributes.IsDeleted
			});

			oData.UnitDetails.results = $filter('orderBy')(oData.UnitDetails.results, ["Name"]);
			for (var i = 0; i < oData.UnitDetails.results.length; i++) {
				$scope.aUnits.push({
					sGuid: oData.UnitDetails.results[i].Guid,
					sName: oData.UnitDetails.results[i].Name,
					bTicked: false
				})
			}
		};

		var onStatusesLoaded = function(aData) {
			var sDescription = "";
			for (var i = 0; i < aData.length; i++) {
				aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
			}

			aData = $filter('orderBy')(aData, ["_sortingSequence"]);
			for (var i = 0; i < aData.length; i++) {
				sDescription = "";

				if (aData[i].NameFR && $translate.use() === "fr") {
					sDescription = aData[i].NameFR;
				} else {
					sDescription = aData[i].NameEN;
				}

				$scope.aStatuses.push({
					sGuid: aData[i].Guid,
					sName: sDescription,
					bTicked: false,
					sIconUrl: CONSTANTS.sAppAbsolutePath + "rest/file/get/" + aData[i].AssociatedIconFileGuid,
				})
			}
		};

		var onPrioritiesLoaded = function(aData) {
			var sDescription = "";
			for (var i = 0; i < aData.length; i++) {
				aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
			}

			aData = $filter('orderBy')(aData, ["_sortingSequence"]);
			for (var i = 0; i < aData.length; i++) {
				sDescription = "";

				if (aData[i].NameFR && $translate.use() === "fr") {
					sDescription = aData[i].NameFR;
				} else {
					sDescription = aData[i].NameEN;
				}

				$scope.aPriorities.push({
					sGuid: aData[i].Guid,
					sName: sDescription,
					bTicked: false,
				});
			}
		};

		var onUsersLoaded = function(aData) {
			aData = $filter('filter')(aData, function(oItem, iIndex) {
				var bMatchFound = false;
				for (var i = 0; i < oItem.CompanyDetails.results.length; i++) {
					if (oItem.CompanyDetails.results[i].CompanyName === cacheProvider.oUserProfile.sCurrentCompany) {
						bMatchFound = true;
						break;
					}
				}
				return bMatchFound;
			});

			aData = $filter('orderBy')(aData, ["UserName"]);
			for (var i = 0; i < aData.length; i++) {
				$scope.aUsers.push({
					sGuid: aData[i].UserName,
					sName: aData[i].UserName,
					bTicked: false,
				});
			}
		};

		var onContractorsLoaded = function(oData) {
			oData.AccountDetails.results = $filter('filter')(oData.AccountDetails.results, function(oItem, iIndex) {
				return !oItem.GeneralAttributes.IsDeleted && oItem.AccountTypeDetails.NameEN === "Contractor";
			});
			oData.AccountDetails.results = $filter('orderBy')(oData.AccountDetails.results, ["Name"]);
			for (var i = 0; i < oData.AccountDetails.results.length; i++) {
				$scope.aContractors.push({
					sGuid: oData.AccountDetails.results[i].Guid,
					sName: oData.AccountDetails.results[i].Name,
					bTicked: false,
				})
			}
		};

		var onAddImage = function() {
			var options = {
				quality: 80,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 500,
				targetHeight: 500,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false
			};

			$cordovaCamera.getPicture(options).then(function(imageData) {
				var onSuccessUpload = function() {
					//$rootScope.$emit('UNLOAD');				
					//$scope.oDeficiencyAttributes.oImages.iValue++;
					$scope.iImagesValue++;
					alert("2*Yo!");

				}
				imageData = "data:image/jpeg;base64," + imageData; //http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata

			    var byteString = atob(imageData.split(',')[1]);
			    var ab = new ArrayBuffer(byteString.length);
			    var ia = new Uint8Array(ab);
			    for (var i = 0; i < byteString.length; i++) {
			        ia[i] = byteString.charCodeAt(i);
			    }

				var oBlob = new Blob([ab], { type: 'image/jpeg' });

				var formData = new FormData();
     			formData.append('blob', oBlob, "quickAddAttachment");

				servicesProvider.uploadAttachmentsForEntity({
					sPath: "Tasks",
					aFiles: [formData],
					sParentEntityGuid: "",
					sParentEntityFileMetadataSetGuid: $rootScope.sFileMetadataSetGuid,
					onSuccess: onSuccessUpload
				});
			}, function(err) {
				// error
			});
		};

		$scope.onPhaseAttribute = function() {
			$scope.sSideNavHeader = $scope.oDeficiencyAttributes.oPhase.sDescription;
			var oSideNav = $mdSidenav('deficiencyQuickAddRigthSideNav').toggle();

			oSideNav.then(function() {
				var aPhases = [];
				if (!$scope.aProjectsWithPhases.length) {
					var aProjectsWithPhases = servicesProvider.constructUserProjectsPhases();
					for (var i = 0; i < aProjectsWithPhases.length; i++) {
						var aPhases = [];
						if (aProjectsWithPhases[i].NameFR && $translate.use() === "fr") {
							aProjectsWithPhases[i].sDescription = aProjectsWithPhases[i].NameFR;
						} else {
							aProjectsWithPhases[i].sDescription = aProjectsWithPhases[i].NameEN;
						}
						for (var j = 0; j < aProjectsWithPhases[i].PhaseDetails.results.length; j++) {
							if (aProjectsWithPhases[i].PhaseDetails.results[j].NameFR && $translate.use() === "fr") {
								aProjectsWithPhases[i].PhaseDetails.results[j].sDescription = aProjectsWithPhases[i].PhaseDetails.results[j].NameFR;
							} else {
								aProjectsWithPhases[i].PhaseDetails.results[j].sDescription = aProjectsWithPhases[i].PhaseDetails.results[j].NameEN;
							}

							aPhases.push({
								sPhaseName: aProjectsWithPhases[i].PhaseDetails.results[j].sDescription,
								Guid: aProjectsWithPhases[i].PhaseDetails.results[j].Guid,
								bTicked: false,
							});
						}
						$scope.aProjectsWithPhases.push({
							sProjectName: aProjectsWithPhases[i].sDescription,
							aPhases: aPhases
						});
					}
				}
			});
		};

		$scope.onUnitAttribute = function() {
			if (!$scope.oDeficiencyAttributes.oUnit.bIsSelectionUnabled) {
				return;
			}
			$scope.sSideNavHeader = $scope.oDeficiencyAttributes.oUnit.sDescription;
			var oSideNav = $mdSidenav('deficiencyQuickAddRigthSideNav').toggle();

			oSideNav.then(function() {
				if (!$scope.aUnits.length) {
					apiProvider.getPhase({
						sExpand: "UnitDetails",
						sKey: $scope.oDeficiencyAttributes["oPhase"].sSelectedItemGuid,
						onSuccess: onUnitsLoaded
					});
				}
			});
		};

		$scope.onStatusAttribute = function() {
			$scope.sSideNavHeader = $scope.oDeficiencyAttributes.oStatus.sDescription;
			var oSideNav = $mdSidenav('deficiencyQuickAddRigthSideNav').toggle();

			oSideNav.then(function() {
				if (!$scope.aStatuses.length) {
					apiProvider.getDeficiencyStatuses({
						onSuccess: onStatusesLoaded
					});
				}
			});
		};

		$scope.onPriorityAttribute = function() {
			$scope.sSideNavHeader = $scope.oDeficiencyAttributes.oPriority.sDescription;
			var oSideNav = $mdSidenav('deficiencyQuickAddRigthSideNav').toggle();

			oSideNav.then(function() {
				if (!$scope.aPriorities.length) {
					apiProvider.getDeficiencyPriorities({
						onSuccess: onPrioritiesLoaded
					});
				}
			});
		};

		$scope.onUserAttribute = function() {
			$scope.sSideNavHeader = $scope.oDeficiencyAttributes.oUser.sDescription;
			var oSideNav = $mdSidenav('deficiencyQuickAddRigthSideNav').toggle();

			oSideNav.then(function() {
				if (!$scope.aUsers.length) {
					apiProvider.getUsers({
						sExpand: "CompanyDetails",
						onSuccess: onUsersLoaded
					});
				}
			});
		};

		$scope.onDescriptionTagsAttribute = function() {
			$scope.sSideNavHeader = $scope.oDeficiencyAttributes.oDescriptionTags.sDescription;
			var oSideNav = $mdSidenav('deficiencyQuickAddRigthSideNav').toggle();
		};

		$scope.onLocationTagsAttribute = function() {
			$scope.sSideNavHeader = $scope.oDeficiencyAttributes.oLocationTags.sDescription;
			var oSideNav = $mdSidenav('deficiencyQuickAddRigthSideNav').toggle();
		};

		$scope.onContractorsAttribute = function() {
			if (!$scope.oDeficiencyAttributes.oContractors.bIsSelectionUnabled) {
				return;
			}
			$scope.sSideNavHeader = $scope.oDeficiencyAttributes.oContractors.sDescription;
			var oSideNav = $mdSidenav('deficiencyQuickAddRigthSideNav').toggle();

			oSideNav.then(function() {
				if (!$scope.aContractors.length) {
					apiProvider.getPhase({
						sKey: $scope.oDeficiencyAttributes["oPhase"].sSelectedItemGuid,
						sExpand: "AccountDetails/AccountTypeDetails",
						onSuccess: onContractorsLoaded,
					});
				}
			});
		};

		$scope.onImagesAttribute = function() {
			$scope.sSideNavHeader = $scope.oDeficiencyAttributes.oImages.sDescription;
			onAddImage();
		};

		$scope.onCloseRightSideNav = function() {
			var oSvc = $mdSidenav('deficiencyQuickAddRigthSideNav').close();
			oSvc.then(function() {
				switch ($scope.sSideNavHeader) {
					case $scope.oDeficiencyAttributes.oPhase.sDescription:
						if (bPhaseWasSelected) {
							$scope.oDeficiencyAttributes["oUnit"].bIsSelectionUnabled = true;
							$scope.oDeficiencyAttributes["oContractors"].bIsSelectionUnabled = true;
							$scope.oDeficiencyAttributes["oPhase"].sValue = "";
							for (var i = 0; i < $scope.aProjectsWithPhases.length; i++) {
								for (var j = 0; j < $scope.aProjectsWithPhases[i].aPhases.length; j++) {
									if ($scope.aProjectsWithPhases[i].aPhases[j].bTicked) {
										$scope.oDeficiencyAttributes["oPhase"].sValue = $scope.oDeficiencyAttributes["oPhase"].sValue + $scope.aProjectsWithPhases[i].sProjectName + " - " + $scope.aProjectsWithPhases[i].aPhases[j].sPhaseName;
										$scope.oDeficiencyAttributes["oPhase"].sSelectedItemGuid = $scope.aProjectsWithPhases[i].aPhases[j].Guid;
										break;
									}
								}
							}
						}
						break;
					case $scope.oDeficiencyAttributes.oUnit.sDescription:
						if (bUnitWasSelected) {
							$scope.oDeficiencyAttributes["oUnit"].sValue = "";
							for (var i = 0; i < $scope.aUnits.length; i++) {
								if ($scope.aUnits[i].bTicked) {
									$scope.oDeficiencyAttributes["oUnit"].sValue = $scope.aUnits[i].sName;
									$scope.oDeficiencyAttributes["oUnit"].sSelectedItemGuid = $scope.aUnits[i].sGuid;
									break;
								}
							}
						}
						break;
					case $scope.oDeficiencyAttributes.oStatus.sDescription:
						if (bStatusWasSelected) {
							$scope.oDeficiencyAttributes["oStatus"].sValue = "";
							for (var i = 0; i < $scope.aStatuses.length; i++) {
								if ($scope.aStatuses[i].bTicked) {
									$scope.oDeficiencyAttributes["oStatus"].sValue = $scope.aStatuses[i].sName;
									$scope.oDeficiencyAttributes["oStatus"].sSelectedItemGuid = $scope.aStatuses[i].sGuid;
									break;
								}
							}
						}
						break;
					case $scope.oDeficiencyAttributes.oPriority.sDescription:
						if (bPriorityWasSelected) {
							$scope.oDeficiencyAttributes["oPriority"].sValue = "";
							for (var i = 0; i < $scope.aPriorities.length; i++) {
								if ($scope.aPriorities[i].bTicked) {
									$scope.oDeficiencyAttributes["oPriority"].sValue = $scope.aPriorities[i].sName;
									$scope.oDeficiencyAttributes["oPriority"].sSelectedItemGuid = $scope.aPriorities[i].sGuid;
									break;
								}
							}
						}
						break;
					case $scope.oDeficiencyAttributes.oUser.sDescription:
						if (bUserWasSelected) {
							$scope.oDeficiencyAttributes["oUser"].sValue = "";
							for (var i = 0; i < $scope.aUsers.length; i++) {
								if ($scope.aUsers[i].bTicked) {
									$scope.oDeficiencyAttributes["oUser"].sValue = $scope.aUsers[i].sName;
									$scope.oDeficiencyAttributes["oUser"].sSelectedItemGuid = $scope.aUsers[i].sGuid;
									break;
								}
							}
						}
						break;
					case $scope.oDeficiencyAttributes.oDescriptionTags.sDescription:
						if ($scope.aDescriptionTags.length) {
							$scope.oDeficiencyAttributes["oDescriptionTags"].sValue = utilsProvider.tagsArrayToTagsString($scope.aDescriptionTags);
						} else {
							$scope.oDeficiencyAttributes["oDescriptionTags"].sValue = "...";
						}
						break;
					case $scope.oDeficiencyAttributes.oLocationTags.sDescription:
						if ($scope.aLocationTags.length) {
							$scope.oDeficiencyAttributes["oLocationTags"].sValue = utilsProvider.tagsArrayToTagsString($scope.aLocationTags);
						} else {
							$scope.oDeficiencyAttributes["oLocationTags"].sValue = "...";
						}
						break;
					case $scope.oDeficiencyAttributes.oContractors.sDescription:
						if (bContractorWasSelected) {
							$scope.oDeficiencyAttributes["oContractors"].sValue = "";
							$scope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids = [];
							for (var i = 0; i < $scope.aContractors.length; i++) {
								if ($scope.aContractors[i].bTicked) {
									$scope.oDeficiencyAttributes["oContractors"].sValue = $scope.oDeficiencyAttributes["oContractors"].sValue + $scope.aContractors[i].sName + "; ";
									$scope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids.push($scope.aContractors[i].sGuid);
								}
							}
						} else {
							$scope.oDeficiencyAttributes["oContractors"].sValue = "...";
							$scope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids = [];
						}
						break;
				}
			});
		};

		$scope.onSelectPhase = function(oPhase) {
			bPhaseWasSelected = true;
			if (!oPhase.bTicked) {
				for (var i = 0; i < $scope.aProjectsWithPhases.length; i++) {
					for (var j = 0; j < $scope.aProjectsWithPhases[i].aPhases.length; j++) {
						$scope.aProjectsWithPhases[i].aPhases[j].bTicked = false;
					}
				}
				oPhase.bTicked = true;
				$scope.aUnits = [];
				$scope.aContractors = [];
				$scope.oDeficiencyAttributes["oUnit"].sValue = "...";
				$scope.oDeficiencyAttributes["oUnit"].sSelectedItemGuid = "";
				bUnitWasSelected = false;
				$scope.oDeficiencyAttributes["oContractors"].sValue = "...";
				$scope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids = [];
				bContractorWasSelected = false;
			}

		};

		$scope.onSelectUnit = function(oUnit) {
			bUnitWasSelected = true;
			if (!oUnit.bTicked) {
				for (var i = 0; i < $scope.aUnits.length; i++) {
					$scope.aUnits[i].bTicked = false;
				}
				oUnit.bTicked = true;
			}
		};

		$scope.onSelectStatus = function(oStatus) {
			bStatusWasSelected = true;
			if (!oStatus.bTicked) {
				for (var i = 0; i < $scope.aStatuses.length; i++) {
					$scope.aStatuses[i].bTicked = false;
				}
				oStatus.bTicked = true;
			}
		};

		$scope.onSelectPriority = function(oPriority) {
			bPriorityWasSelected = true;
			if (!oPriority.bTicked) {
				for (var i = 0; i < $scope.aPriorities.length; i++) {
					$scope.aPriorities[i].bTicked = false;
				}
				oPriority.bTicked = true;
			}
		};

		$scope.onSelectUser = function(oUser) {
			bUserWasSelected = true;
			if (!oUser.bTicked) {
				for (var i = 0; i < $scope.aUsers.length; i++) {
					$scope.aUsers[i].bTicked = false;
				}
				oUser.bTicked = true;
			}
		};

		$scope.onSelectContractor = function(oContractor) {
			bContractorWasSelected = false;
			oContractor.bTicked = !oContractor.bTicked;

			if (!oContractor.bTicked) {
				for (var i = 0; i < $scope.aContractors.length; i++) {
					if ($scope.aContractors[i].bTicked) {
						bContractorWasSelected = true;
						break;
					}
				}
			} else {
				bContractorWasSelected = true;
			}
		};

		var prepareLinksForSave = function() { // link contact to phases
			var aLinks = [];
			var aUri = [];
			var sUri = "";

			if ($scope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids && $scope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids.length) {
				for (var i = 0; i < $scope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids.length; i++) {
					sUri = "Accounts('" + $scope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids[i] + "')";
					aUri.push(sUri);
				}
			}

			aLinks.push({
				sRelationName: "AccountDetails",
				bKeepCompanyDependentLinks: true,
				aUri: aUri
			});

			return aLinks;
		};

		$scope.onSave = function() {
			var onSuccessCreation = function() {
				$rootScope.sFileMetadataSetGuid = "";

				$scope.oDeficiencyAttributes.oDescriptionTags.sValue = "...";
				$scope.aDescriptionTags = [];

				$scope.oDeficiencyAttributes.oLocationTags.sValue = "...";
				$scope.aLocationTags = [];

				$scope.oDeficiencyAttributes.oContractors.sValue = "...";
				$scope.aContractors = [];

				$scope.iImagesValue = 0;

				//$scope.oDeficiencyAttributes.oImages.iValue = 0;
			};

			var oDataForSave = {};
			if ($scope.oDeficiencyAttributes["oPhase"].sSelectedItemGuid) {
				oDataForSave.PhaseGuid = $scope.oDeficiencyAttributes["oPhase"].sSelectedItemGuid;
			}
			if ($scope.oDeficiencyAttributes["oUnit"].sSelectedItemGuid) {
				oDataForSave.UnitGuid = $scope.oDeficiencyAttributes["oUnit"].sSelectedItemGuid;
			}
			if ($scope.oDeficiencyAttributes["oStatus"].sSelectedItemGuid) {
				oDataForSave.TaskStatusGuid = $scope.oDeficiencyAttributes["oStatus"].sSelectedItemGuid;
			}
			if ($scope.oDeficiencyAttributes["oUser"].sSelectedItemGuid) {
				oDataForSave.UserName = $scope.oDeficiencyAttributes["oUser"].sSelectedItemGuid;
			}
			if ($scope.oDeficiencyAttributes["oDescriptionTags"].sValue !== "...") {
				oDataForSave.DescriptionTags = $scope.oDeficiencyAttributes["oDescriptionTags"].sValue;
			}
			if ($scope.oDeficiencyAttributes["oLocationTags"].sValue !== "...") {
				oDataForSave.LocationTags = $scope.oDeficiencyAttributes["oLocationTags"].sValue;
			}

			oDataForSave.FileMetadataSetGuid = $rootScope.sFileMetadataSetGuid;

			var aLinks = prepareLinksForSave();
			apiProvider.createDeficiency({
				bShowSpinner: true,
				aLinks: aLinks,
				oData: oDataForSave,
				bShowSuccessMessage: true,
				bShowErrorMessage: true,
				onSuccess: onSuccessCreation,
			});
		};
	}
]);