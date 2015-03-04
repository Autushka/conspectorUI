viewControllers.controller('deficienciesSearchHybridView', ['$scope', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'utilsProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', '$cookieStore', 'rolesSettings', '$timeout', 'CONSTANTS',
	function($scope, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, utilsProvider, historyProvider, $mdSidenav, $window, $filter, $cookieStore, rolesSettings, $timeout, CONSTANTS) {
		historyProvider.removeHistory();

		servicesProvider.constructLogoUrl();
		servicesProvider.constructMenuIconUrl();
		
		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation   
		$rootScope.oStateParams = angular.copy($stateParams); // for backNavigation    

		$scope.onMainMenu = function() {
			$state.go("mainMenuHybrid");
		};

		if (!$rootScope.oSearchCriterias) {
			$rootScope.oSearchCriterias = {
				oPhase: {
					sDescription: $translate.instant('deficiencyDetails_associatedProjectsAndPhases'), //"Project - Phase",
					sValue: "...",
					bIsSelectionUnabled: true,
					sSelectedItemGuid: ""
				},
				aPhases: [],
				bPhaseWasSelected: false,
				oUnit: {
					sDescription: $translate.instant('deficiencyDetails_unit'), //"Unit",
					sValue: "...",
					bIsSelectionUnabled: false,
					aSelectedItemsGuids: [],
				},
				aUnits: [],
				bUnitWasSelected: false,				
				oStatus: {
					sDescription: $translate.instant('deficiencyDetails_status'), //"Status",
					sValue: "...",
					sIconUrl: "",
					bIsSelectionUnabled: true,
					aSelectedItemsGuids: [],
				},
				aStatuses: [],
				bStatusWasSelected: false,				
			};
		}

		if (!$rootScope.oSearchCriterias.aPhases.length) {
			$rootScope.oSearchCriterias.aPhases = [];
			$rootScope.oSearchCriterias.bPhaseWasSelected = false;
			var aPhases = [];

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
				$rootScope.oSearchCriterias.aPhases.push({
					sProjectName: aProjectsWithPhases[i].sDescription,
					aPhases: aPhases
				});
			}
		}

        var onUnitsLoaded = function(oData) {
        	$rootScope.oSearchCriterias.aUnits = [];
            oData.UnitDetails.results = $filter('filter')(oData.UnitDetails.results, function(oItem, iIndex) {
                return !oItem.GeneralAttributes.IsDeleted;
            });

            for (var i = 0; i < oData.UnitDetails.results.length; i++) {
                $rootScope.oSearchCriterias.aUnits.push({
                    sGuid: oData.UnitDetails.results[i].Guid,
                    sName: utilsProvider.convertStringToInt(oData.UnitDetails.results[i].Name),
                    sCleanedName: utilsProvider.replaceSpecialChars(utilsProvider.convertStringToInt(oData.UnitDetails.results[i].Name)),
                    bTicked: false
                })
            }
            $rootScope.oSearchCriterias.aUnits = $filter('orderBy')($rootScope.oSearchCriterias.aUnits, ["sName"]);
            $rootScope.oSearchCriterias.aFilteredUnits = $filter('filter')($rootScope.oSearchCriterias.aUnits, {
                sName: $rootScope.oSearchCriterias.sUnitFilter
            });
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

                $scope.oSearchCriterias.aStatuses.push({
                    sGuid: aData[i].Guid,
                    sName: sDescription,
                    bTicked: false,
                    sIconUrl: CONSTANTS.sAppAbsolutePath + "rest/file/get/" + aData[i].AssociatedIconFileGuid,
                })
            }
        };

        if (!$rootScope.oSearchCriterias.aStatuses.length) {
            $rootScope.oSearchCriterias.aStatuses = [];
            $rootScope.oSearchCriterias.bStatusWasSelected = false;
            apiProvider.getDeficiencyStatuses({
                onSuccess: onStatusesLoaded
            });
        }        

		$rootScope.aDeficiencies = [];

		var onDeficienciesLoaded = function(aData) {
			var sProjectName = "";
			var sPhaseName = "";
			var sUnitName = "";
			var sDueIn = "";
			var sDueDate = "";
			var dCurrentDate = new Date();
			var sProjectPhase = "";
			var bMatchFound = false;
			var iSortingSequence = 0;
			var sStatusSortingSequence = "";
			var sStatuseIconUrl = "";
			var sStatuseIconGuid = "";
			var sStatusDescription = "";
			var sPriorityDescription = "";
			var sContractors = "";
			var iImagesNumber = 0;
			var sFileMetadataSetLastModifiedAt = "";
			var aImages = [];
			var sDescription = "";
			var sUnitsGuids = "";
			var sStatusesGuids = "";
			var sStatusGuid = "";	



			if($rootScope.oSearchCriterias.oStatus.aSelectedItemsGuids.length){
				for (var i = 0; i < $rootScope.oSearchCriterias.oStatus.aSelectedItemsGuids.length; i++) {
					sStatusesGuids = sStatusesGuids + $rootScope.oSearchCriterias.oStatus.aSelectedItemsGuids[i] + ",";
				}
			}	

			if($rootScope.oSearchCriterias.oUnit.aSelectedItemsGuids.length){
				for (var i = 0; i < $rootScope.oSearchCriterias.oUnit.aSelectedItemsGuids.length; i++) {
					sUnitsGuids = sUnitsGuids + $rootScope.oSearchCriterias.oUnit.aSelectedItemsGuids[i] + ",";
				}
			}	

			var aDeficienciesForSorting = [];						

			for (var i = 0; i < aData.length; i++) {
				sProjectName = "";
				sPhaseName = "";
				sProjectPhase = "";
				sUnitName = "";
				sDueIn = "";
				sDueDate = "";
				sStatusSortingSequence = "";
				iSortingSequence = 0;
				sStatuseIconUrl = "";
				sStatusIconGuid = "";
				sStatusDescription = "";
				sPriorityDescription = "";
				sContractors = "";
				iImagesNumber = 0;
				aImages = [];
				sDescription = "";
				sStatusGuid = "";

				if(sUnitsGuids){
					if(sUnitsGuids.indexOf(aData[i].UnitGuid) < 0){
						continue;
					}
				}

				if(sStatusesGuids){
					if(sStatusesGuids.indexOf(aData[i].TaskStatusGuid) < 0){
						continue;
					}
				}				


				if (aData[i].PhaseDetails) {
					iSortingSequence = aData[i].PhaseDetails.GeneralAttributes.SortingSequence;

					sProjectName = $translate.use() === "en" ? aData[i].PhaseDetails.ProjectDetails.NameEN : aData[i].PhaseDetails.ProjectDetails.NameFR;
					if (!sProjectName) {
						sProjectName = aData[i].PhaseDetails.ProjectDetails.NameEN;
					}
					sPhaseName = $translate.use() === "en" ? aData[i].PhaseDetails.NameEN : aData[i].PhaseDetails.NameFR;
					if (!sPhaseName) {
						sPhaseName = aData[i].PhaseDetails.NameEN;
					}

					sProjectPhase = sProjectName + " - " + sPhaseName;
				} else {
					sProjectPhase = "Not Assigned";
				}

				if (aData[i].TaskStatusDetails) {
					sStatusGuid = aData[i].TaskStatusDetails.Guid;
					sStatusSortingSequence = aData[i].TaskStatusDetails.GeneralAttributes.SortingSequence;
					sStatuseIconUrl = CONSTANTS.sAppAbsolutePath + "rest/file/get/" + aData[i].TaskStatusDetails.AssociatedIconFileGuid;
					sStatusDescription = $translate.use() === "en" ? aData[i].TaskStatusDetails.NameEN : aData[i].TaskStatusDetails.NameFR;
					if (!sStatusDescription) {
						sStatusDescription = aData[i].TaskStatusDetails.NameEN;
					}
					sStatusIconGuid = aData[i].TaskStatusDetails.AssociatedIconFileGuid;
				}

				if (aData[i].TaskPriorityDetails) {
					sPriorityDescription = $translate.use() === "en" ? aData[i].TaskPriorityDetails.NameEN : aData[i].TaskPriorityDetails.NameFR;
					if (!sPriorityDescription) {
						sPriorityDescription = aData[i].TaskPriorityDetails.NameEN;
					}
				}				

				if (aData[i].AccountDetails) {
					for (var j = 0; j < aData[i].AccountDetails.results.length; j++) {
						sContractors = sContractors + aData[i].AccountDetails.results[j].Name + "; ";
					}
				}

				if (aData[i].UnitDetails) {
					aData[i].sUnitName = aData[i].UnitDetails.Name;
				}

				if (aData[i].FileMetadataSetDetails) {
					sFileMetadataSetLastModifiedAt = aData[i].FileMetadataSetDetails.LastModifiedAt;
					if (aData[i].FileMetadataSetDetails.FileMetadataDetails) {
						for (var j = 0; j < aData[i].FileMetadataSetDetails.FileMetadataDetails.results.length; j++) {
							if (aData[i].FileMetadataSetDetails.FileMetadataDetails.results[j].MediaType) {
								if (aData[i].FileMetadataSetDetails.FileMetadataDetails.results[j].MediaType.indexOf("image") > -1 && aData[i].FileMetadataSetDetails.FileMetadataDetails.results[j].GeneralAttributes.IsDeleted === false) {
									aImages.push(aData[i].FileMetadataSetDetails.FileMetadataDetails.results[j]);
								}
							}
						}
					}
					iImagesNumber = aImages.length;
				}

				var durationNumber = "";
				var sDueInLetter = "";

				if (aData[i].DueDate && aData[i].DueDate != "/Date(0)/") {
					sDueDate = utilsProvider.dBDateToSting(aData[i].DueDate);
					dDueDate = new Date(parseInt(aData[i].DueDate.substring(6, aData[i].DueDate.length - 2)));
					var timeDiff = Math.abs(dCurrentDate.getTime() - dDueDate.getTime());
					durationNumber = Math.ceil(timeDiff / (1000 * 3600 * 24)) - 1;
					sDueInLetter = $translate.use() === "en" ? "d" : "j";
					// sDueIn = durationNumber + " d";                  
				}

				if (aData[i].Description) {
					sDescription = utilsProvider.removeTagsFromString(aData[i].Description);
				}

				aDeficienciesForSorting.push({
					_guid: aData[i].Guid,
					sUnit: utilsProvider.convertStringToInt(aData[i].sUnitName),
					sCleanedUnit: utilsProvider.replaceSpecialChars(aData[i].sUnitName),
					sTags: aData[i].DescriptionTags !== null && aData[i].DescriptionTags !== undefined ? aData[i].DescriptionTags : "",
					sCleanedTags: utilsProvider.replaceSpecialChars(aData[i].DescriptionTags),
					sLocationTags: aData[i].LocationTags !== null && aData[i].LocationTags !== undefined ? aData[i].LocationTags : "",
					sDueIn: utilsProvider.convertStringToInt(durationNumber),
					sDueInLetter: sDueInLetter,
					sProjectPhase: sProjectPhase,
					sContractors: sContractors,
					sCleanedContractors: utilsProvider.replaceSpecialChars(sContractors),
					sStatusSortingSequence: sStatusSortingSequence,
					sStatuseIconUrl: sStatuseIconUrl,
					sStatusIconGuid: sStatusIconGuid,
					sStatusDescription: sStatusDescription,
					sPriorityDescription: sPriorityDescription,
					sDescription: sDescription,
					_unitGuid: aData[i].UnitGuid,
					_sortingSequence: iSortingSequence,
					_fileMetadataSetGuid: aData[i].FileMetadataSetGuid,
					_fileMetadataSetLastModifiedAt: sFileMetadataSetLastModifiedAt,
					iImagesNumber: iImagesNumber,
					_aImages: aImages,
					_lastModifiedAt: aData[i].LastModifiedAt,
					_createdAt: aData[i].CreatedAt,
					sAssignedUserName: aData[i].UserName,
					sStatusGuid: sStatusGuid,
				});				
			}

			aDeficienciesForSorting = $filter('orderBy')(aDeficienciesForSorting, ["sUnit", "sStatusSortingSequence", "-_createdAt"]);

			$rootScope.aDeficiencies = angular.copy(aDeficienciesForSorting);

			$timeout(function() {
				$rootScope.sDeficienciesListView = "deficienciesList"
			}, 1000);
		};

		var loadDeficiencies = function() {
			$rootScope.aDeficiencies = [];

			var sFilterByAccountGuid = "";
			var sFilterByPhaseGuid = "";
			// var sFilterByUnitGuids = "";
			// var sUnitsGuids = "";

			if($rootScope.oSearchCriterias.oPhase.sSelectedItemGuid){
				sFilterByPhaseGuid = " and PhaseGuid eq '" + $rootScope.oSearchCriterias.oPhase.sSelectedItemGuid + "'";
				//sFilterByPhaseGuid = " "
			}

			// if($rootScope.oSearchCriterias.oUnit.aSelectedItemsGuids.length){
			// 	for (var i = 0; i < $rootScope.oSearchCriterias.oUnit.aSelectedItemsGuids.length; i++) {
			// 		sUnitsGuids = sUnitsGuids + $rootScope.oSearchCriterias.oUnit.aSelectedItemsGuids[i] + ",";
			// 	}
			// 	sFilterByUnitsGuids = " and substringof(UnitGuid, '" + sUnitsGuids+ "') eq true";
			// 	//sFilterByPhaseGuid = " "
			// }			

			if (cacheProvider.oUserProfile.sCurrentRole === "contractor") {
				sFilterByAccountGuid = " and substringof('" + cacheProvider.oUserProfile.oUserContact.AccountDetails.Guid + "', AccountGuids) eq true";
			}



			apiProvider.getDeficiencies({
				sExpand: "PhaseDetails/ProjectDetails,TaskStatusDetails,TaskPriorityDetails,AccountDetails,UnitDetails,FileMetadataSetDetails/FileMetadataDetails",
				sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false" + sFilterByPhaseGuid + sFilterByAccountGuid,
				bShowSpinner: true,
				onSuccess: onDeficienciesLoaded
			});

		};

		$scope.onSearch = function() {
            var bIsDataValid = true;

            if (!$rootScope.oSearchCriterias["oPhase"].sSelectedItemGuid) {
                bIsDataValid = false;
            } 
            if (!bIsDataValid) {
                utilsProvider.displayMessage({
                    sText: $translate.instant("global_projectAndPhaseMandatory"),
                    sType: 'error'
                });
                return;
            }

			loadDeficiencies();
		};

		$scope.onSelectPhaseSearchCriteria = function() {
			$rootScope.sCurrentSearhCriteria = "phase";
			$rootScope.sDeficienciesListView = "deficienciesListItemsLists";
			// $rootScope.bIsListViewOpen = false;
			// $rootScope.bIsDeficienciesListItemsListsOpen = true;
		};
		$scope.onSelectUnitSearchCriteria = function() {
            if (!$rootScope.oSearchCriterias.oUnit.bIsSelectionUnabled) {
                return;
            }

            $rootScope.sCurrentSearhCriteria = "unit";
            if (!$rootScope.oSearchCriterias.aUnits.length) {
                apiProvider.getPhase({
                    sExpand: "UnitDetails",
                    sKey: $rootScope.oSearchCriterias["oPhase"].sSelectedItemGuid,
                    onSuccess: onUnitsLoaded
                });

            }

            $rootScope.sDeficienciesListView = "deficienciesListItemsLists";
		};
		$scope.onSelectStatusSearchCriteria = function() {
			$rootScope.sCurrentSearhCriteria = "status";
			$rootScope.sDeficienciesListView = "deficienciesListItemsLists";
			// $rootScope.bIsListViewOpen = false;
			// $rootScope.bIsDeficienciesListItemsListsOpen = true;
		};

		$scope.$on("$destroy", function() {
			if (historyProvider.getPreviousStateName() === $rootScope.sCurrentStateName) { //current state was already put to the history in the parent views
				return;
			}

			historyProvider.addStateToHistory({
				sStateName: $rootScope.sCurrentStateName,
				oStateParams: angular.copy($rootScope.oStateParams)
			});
		});
	}
]);