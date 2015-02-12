viewControllers.controller('deficiencyQuickAddView', ['$rootScope', '$scope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS', 'historyProvider', 'rolesSettings', '$timeout', '$mdSidenav', '$window',
	function($rootScope, $scope, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS, historyProvider, rolesSettings, $timeout, $mdSidenav, $window) {
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

		$scope.iCurrentAttibuteIndex = 0;

		$scope.aProjectsWithPhases = [];
		var bPhaseWasSelected = false;
		$scope.aUnits = [];
		var bUnitWasSelected = false;
		$scope.aStatuses = [];
		var bStatusWasSelected = false;	
		$scope.aDescriptionTags = [];
		$scope.aLocationTags = [];	
		$scope.aContractors = [];
		var bContractorWasSelected = false;				

		$scope.aDeficiencyAttributes = [];
		$scope.aDeficiencyAttributes.push({
			sDescription: "Phase",
			sValue: "Not specifies...",
			bIsSelectionUnabled: true,
		});
		$scope.aDeficiencyAttributes.push({
			sDescription: "Unit",
			sValue: "Not specifies...",
			bIsSelectionUnabled: false,
		});
		$scope.aDeficiencyAttributes.push({
			sDescription: "Status",
			sValue: "Not specifies...",
			bIsSelectionUnabled: true,
		});
		$scope.aDeficiencyAttributes.push({
			sDescription: "DescriptionTags",
			sValue: "Not specifies...",
			bIsSelectionUnabled: true,
		});
		$scope.aDeficiencyAttributes.push({
			sDescription: "LocationTags",
			sValue: "Not specifies...",
			bIsSelectionUnabled: true,
		});	
		$scope.aDeficiencyAttributes.push({
			sDescription: "Contractors",
			sValue: "Not specifies...",
			bIsSelectionUnabled: false,
		});						

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
			var sDesciption = "";
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

		$scope.onOpenSideNav = function(oAttribute) {
			if (!oAttribute.bIsSelectionUnabled) {
				return;
			}
			switch (oAttribute.sDescription) {
				case "Phase":
					$scope.sSideNavHeader = "Phases";
					$scope.iCurrentAttibuteIndex = 0;
					break;
				case "Unit":
					$scope.sSideNavHeader = "Units";
					$scope.iCurrentAttibuteIndex = 1;
					break;
				case "Status":
					$scope.sSideNavHeader = "Statuses";
					$scope.iCurrentAttibuteIndex = 2;
					break;
				case "DescriptionTags":
					$scope.sSideNavHeader = "Description Tags";
					$scope.iCurrentAttibuteIndex = 3;
					break;
				case "LocationTags":
					$scope.sSideNavHeader = "Location Tags";
					$scope.iCurrentAttibuteIndex = 4;
					break;		
				case "Contractors":
					$scope.sSideNavHeader = "Contractors";
					$scope.iCurrentAttibuteIndex = 5;
					break;														
			}
			var oSideNav = $mdSidenav('deficiencyQuickAddRigthSideNav').toggle();

			oSideNav.then(function() {
				switch ($scope.iCurrentAttibuteIndex) {
					case 0:
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
							break;
						}
					case 1:
						//$scope.aUnits = [];
						if (!$scope.aUnits.length) {
							apiProvider.getPhase({
								sExpand: "UnitDetails",
								sKey: $scope.aDeficiencyAttributes[0].sSelectedItemGuid,
								onSuccess: onUnitsLoaded
							});
						}
						break;
					case 2:
						if (!$scope.aStatuses.length) {
							apiProvider.getDeficiencyStatuses({
								onSuccess: onStatusesLoaded
							});
						}
						break;
					case 3:
						break;
					case 4:
						break;		
					case 5:
						if (!$scope.aContractors.length) {
							apiProvider.getPhase({
								sKey: $scope.aDeficiencyAttributes[0].sSelectedItemGuid,
								sExpand: "AccountDetails/AccountTypeDetails",
								onSuccess: onContractorsLoaded,
							});
						}					
						break;																	

				}
			});
		};

		$scope.onCloseRightSideNav = function() {
			var oSvc = $mdSidenav('deficiencyQuickAddRigthSideNav').close();
			oSvc.then(function() {
				switch ($scope.iCurrentAttibuteIndex) {
					case 0:
						if (bPhaseWasSelected) {
							$scope.aDeficiencyAttributes[1].bIsSelectionUnabled = true;
							$scope.aDeficiencyAttributes[5].bIsSelectionUnabled = true;
							$scope.aDeficiencyAttributes[0].sValue = "";
							for (var i = 0; i < $scope.aProjectsWithPhases.length; i++) {
								for (var j = 0; j < $scope.aProjectsWithPhases[i].aPhases.length; j++) {
									if ($scope.aProjectsWithPhases[i].aPhases[j].bTicked) {
										$scope.aDeficiencyAttributes[0].sValue = $scope.aDeficiencyAttributes[0].sValue + $scope.aProjectsWithPhases[i].sProjectName + " - " + $scope.aProjectsWithPhases[i].aPhases[j].sPhaseName;
										$scope.aDeficiencyAttributes[0].sSelectedItemGuid = $scope.aProjectsWithPhases[i].aPhases[j].Guid;
										break;
									}
								}
							}
							break;
						}
					case 1:
						if (bUnitWasSelected) {
							$scope.aDeficiencyAttributes[1].sValue = "";
							for (var i = 0; i < $scope.aUnits.length; i++) {
								if ($scope.aUnits[i].bTicked) {
									$scope.aDeficiencyAttributes[1].sValue = $scope.aUnits[i].sName;
									$scope.aDeficiencyAttributes[1].sSelectedItemGuid = $scope.aUnits[i].sGuid;
									break;
								}
							}
							break;
						}
					case 2:
						if (bStatusWasSelected) {
							$scope.aDeficiencyAttributes[2].sValue = "";
							for (var i = 0; i < $scope.aStatuses.length; i++) {
								if ($scope.aStatuses[i].bTicked) {
									$scope.aDeficiencyAttributes[2].sValue = $scope.aStatuses[i].sName;
									$scope.aDeficiencyAttributes[2].sSelectedItemGuid = $scope.aStatuses[i].sGuid;
									break;
								}
							}
							break;
						}	
					case 3:
						$scope.aDeficiencyAttributes[3].sValue = utilsProvider.tagsArrayToTagsString($scope.aDescriptionTags);
						break;
					case 4:
						$scope.aDeficiencyAttributes[4].sValue = utilsProvider.tagsArrayToTagsString($scope.aLocationTags);	
						break;
					case 5:
						if (bContractorWasSelected) {							
							$scope.aDeficiencyAttributes[5].sValue = "";
							$scope.aDeficiencyAttributes[5].aSelectedItemsGuids = [];
							for (var i = 0; i < $scope.aContractors.length; i++) {
								if ($scope.aContractors[i].bTicked) {
									$scope.aDeficiencyAttributes[5].sValue = $scope.aDeficiencyAttributes[5].sValue + $scope.aContractors[i].sName + "; ";
									$scope.aDeficiencyAttributes[5].aSelectedItemsGuids.push($scope.aContractors[i].sGuid);
								}
							}
							break;	
						}else{
							$scope.aDeficiencyAttributes[5].sValue = "Not specifies...";
							$scope.aDeficiencyAttributes[5].aSelectedItemsGuids = [];
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

		$scope.onSelectContractor = function(oContractor) {
			oContractor.bTicked = !oContractor.bTicked;

			if(!oContractor.bTicked){
				for (var i = 0; i < $scope.aContractors.length; i++) {
					if($scope.aContractors[i].bTicked){
						bContractorWasSelected = true;
						break;
					}
				}				
			}else{
				bContractorWasSelected = true;
			}
		};	

		var prepareLinksForSave = function() { // link contact to phases
			var aLinks = [];
			var aUri = [];
			var sUri = "";

			if ($scope.aDeficiencyAttributes[5].aSelectedItemsGuids && $scope.aDeficiencyAttributes[5].aSelectedItemsGuids.length) {
				for (var i = 0; i < $scope.aDeficiencyAttributes[5].aSelectedItemsGuids.length; i++) {
					sUri = "Accounts('" + $scope.aDeficiencyAttributes[5].aSelectedItemsGuids[i] + "')";
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

			};

			var oDataForSave = {};
			oDataForSave.PhaseGuid = $scope.aDeficiencyAttributes[0].sSelectedItemGuid;
			oDataForSave.UnitGuid = $scope.aDeficiencyAttributes[1].sSelectedItemGuid;
			oDataForSave.TaskStatusGuid = $scope.aDeficiencyAttributes[2].sSelectedItemGuid;
			oDataForSave.DescriptionTags = $scope.aDeficiencyAttributes[3].sValue;
			oDataForSave.LocationTags = $scope.aDeficiencyAttributes[4].sValue;

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