viewControllers.controller('deficienciesSearchHybridView', ['$scope', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'utilsProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', '$cookieStore', 'rolesSettings', '$timeout', 'CONSTANTS',
	function($scope, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, utilsProvider, historyProvider, $mdSidenav, $window, $filter, $cookieStore, rolesSettings, $timeout, CONSTANTS) {
		historyProvider.removeHistory();

		$scope.sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;

		servicesProvider.constructLogoUrl();
		servicesProvider.constructMenuIconUrl();
		
		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation   
		$rootScope.oStateParams = angular.copy($stateParams); // for backNavigation    

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
				oContractor: {
					sDescription: $translate.instant('deficiencyDetails_contractor'), //"Status",
					sValue: "...",
					bIsSelectionUnabled: false,
					aSelectedItemsGuids: [],
				},
				aContractors: [],
				bContractorWasSelected: false,								
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

        var onContractorsLoaded = function(oData) {
        	$rootScope.oSearchCriterias.aContractors = [];
            oData.AccountDetails.results = $filter('filter')(oData.AccountDetails.results, function(oItem, iIndex) {
            	if(!oItem.GeneralAttributes.IsDeleted && oItem.AccountTypeDetails.NameEN === "Contractor"){
            		return true;
            	}else{
            		return false;
            	}
            });

            for (var i = 0; i < oData.AccountDetails.results.length; i++) {
                $rootScope.oSearchCriterias.aContractors.push({
                    sGuid: oData.AccountDetails.results[i].Guid,
                    sName: oData.AccountDetails.results[i].Name,
                    sCleanedName: utilsProvider.replaceSpecialChars(utilsProvider.convertStringToInt(oData.AccountDetails.results[i].Name)),
                    bTicked: false
                })
            }
            $rootScope.oSearchCriterias.aContractors = $filter('orderBy')($rootScope.oSearchCriterias.aContractors, ["sName"]);
            $rootScope.oSearchCriterias.aFilteredContractors = $filter('filter')($rootScope.oSearchCriterias.aContractors, {
                sName: $rootScope.oSearchCriterias.sContractorFilter
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
                    sIconUrl: CONSTANTS.sAppAbsolutePath + "rest/file/v2/get/" + aData[i].AssociatedIconFileGuid,
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


        // if (!$rootScope.oSearchCriterias.aContractors.length) {
        //     $rootScope.oSearchCriterias.aStatuses = [];
        //     $rootScope.oSearchCriterias.bStatusWasSelected = false;
        //     apiProvider.getDeficiencyStatuses({
        //         onSuccess: onStatusesLoaded
        //     });
        // }               

		$rootScope.aDeficiencies = [];

		$rootScope.onDeficienciesLoaded = function(aData) {
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
			var sStatusDescriptionEN = "";
			var sPriorityDescription = "";
			var sContractors = "";
			var iImagesNumber = 0;
			var iCommentsNumber = 0;
			var sFileMetadataSetLastModifiedAt = "";
			var aImages = [];
			var oComments = {};
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
				sStatusDescriptionEN = "";
				sPriorityDescription = "";
				sContractors = "";
				iImagesNumber = 0;
				iCommentsNumber = 0;
				aImages = [];
				oComments = {};
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
					sStatuseIconUrl = CONSTANTS.sAppAbsolutePath + "rest/file/v2/get/" + aData[i].TaskStatusDetails.AssociatedIconFileGuid;
					sStatusDescription = $translate.use() === "en" ? aData[i].TaskStatusDetails.NameEN : aData[i].TaskStatusDetails.NameFR;
					if (!sStatusDescription) {
						sStatusDescription = aData[i].TaskStatusDetails.NameEN;
					}
					sStatusIconGuid = aData[i].TaskStatusDetails.AssociatedIconFileGuid;
					sStatusDescriptionEN = aData[i].TaskStatusDetails.NameEN;
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

				if (aData[i].CommentSetDetails) {
					oComments = angular.copy(aData[i].CommentSetDetails);

					if(aData[i].CommentSetDetails.CommentDetails && aData[i].CommentSetDetails.CommentDetails.results && aData[i].CommentSetDetails.CommentDetails.results.length){
							
						for (var j = aData[i].CommentSetDetails.CommentDetails.results.length - 1; j >= 0; j--) {
							if(!aData[i].CommentSetDetails.CommentDetails.results[j].GeneralAttributes.IsDeleted){
								iCommentsNumber++;
							}
						}
					}
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
					_phaseGuid: aData[i].PhaseGuid,
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
					sStatusDescriptionEN: sStatusDescriptionEN,
					sPriorityDescription: sPriorityDescription,
					sDescription: sDescription,
					_unitGuid: aData[i].UnitGuid,
					_sortingSequence: iSortingSequence,
					_fileMetadataSetGuid: aData[i].FileMetadataSetGuid,
					_commentSetGuid: aData[i].CommentSetGuid,
					_fileMetadataSetLastModifiedAt: sFileMetadataSetLastModifiedAt,
					iImagesNumber: iImagesNumber,
					iCommentsNumber: iCommentsNumber,
					_aImages: aImages,
					_oComments: oComments,
					_lastModifiedAt: aData[i].LastModifiedAt,
					_createdAt: aData[i].CreatedAt,
					sAssignedUserName: aData[i].UserName,
					sStatusGuid: sStatusGuid,
				});	
			}

			aDeficienciesForSorting = $filter('orderBy')(aDeficienciesForSorting, ["sUnit", "sStatusSortingSequence", "-_createdAt"]);

			$rootScope.aDeficiencies = angular.copy(aDeficienciesForSorting);

			if($rootScope.oSelectedDeficiency){
				for(var i = 0; i < $rootScope.aDeficiencies.length; i++){
					if($rootScope.oSelectedDeficiency._guid === $rootScope.aDeficiencies[i]._guid){
						var sStatuseIconUrl = $rootScope.oSelectedDeficiency.sStatuseIconUrl;
						var sStatusDescription = $rootScope.oSelectedDeficiency.sStatusDescription;

						$rootScope.oSelectedDeficiency = angular.copy($rootScope.aDeficiencies[i]);
						$rootScope.oSelectedDeficiency.sStatuseIconUrl = sStatuseIconUrl;
						$rootScope.oSelectedDeficiency.sStatusDescription = sStatusDescription;
					}
				}
			}

			if(!$rootScope.bIgnoreNavigation){
				$timeout(function() {
					$rootScope.sDeficienciesListView = "deficienciesList"
				}, 1000);				
			}
		};

		$rootScope.loadDeficiencies = function() {
			$rootScope.aDeficiencies = [];

			var sFilterByAccountGuid = "";
			var sFilterByPhaseGuid = "";
			var sFilterByAccountsGuids = "";
			// var sFilterByUnitGuids = "";
			// var sUnitsGuids = "";

			if($rootScope.oSearchCriterias.oPhase.sSelectedItemGuid){
				sFilterByPhaseGuid = " and PhaseGuid eq '" + $rootScope.oSearchCriterias.oPhase.sSelectedItemGuid + "'";
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

			if($rootScope.oSearchCriterias.oContractor.aSelectedItemsGuids.length){
				sFilterByAccountsGuids = " and ( "

				for (var i = $rootScope.oSearchCriterias.oContractor.aSelectedItemsGuids.length - 1; i >= 0; i--) {
					sFilterByAccountsGuids = sFilterByAccountsGuids + "substringof('" + $rootScope.oSearchCriterias.oContractor.aSelectedItemsGuids[i] + "', AccountGuids) eq true";
					if(i !== 0){
						sFilterByAccountsGuids = sFilterByAccountsGuids + " or ";
					}else{
						sFilterByAccountsGuids = sFilterByAccountsGuids + " )";
					}
				}
			}

			apiProvider.getDeficiencies({
				sExpand: "PhaseDetails/ProjectDetails,TaskStatusDetails,TaskPriorityDetails,AccountDetails,UnitDetails,FileMetadataSetDetails/FileMetadataDetails,CommentSetDetails/CommentDetails/ContactDetails/UserDetails",
				sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false" + sFilterByPhaseGuid + sFilterByAccountGuid + sFilterByAccountsGuids,
				bShowSpinner: true,
				onSuccess: $rootScope.onDeficienciesLoaded,
				bNoCaching: true,
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
            $rootScope.bIgnoreNavigation = false;
			$rootScope.loadDeficiencies();
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


		$scope.onSelectContractorSearchCriteria = function() {
            if (!$rootScope.oSearchCriterias.oContractor.bIsSelectionUnabled) {
                return;
            }

            $rootScope.sCurrentSearhCriteria = "contractor";
            if (!$rootScope.oSearchCriterias.aContractors.length) {
                apiProvider.getPhase({
                    sExpand: "AccountDetails/AccountTypeDetails",
                    sKey: $rootScope.oSearchCriterias["oPhase"].sSelectedItemGuid,
                    onSuccess: onContractorsLoaded
                });

            }

            $rootScope.sDeficienciesListView = "deficienciesListItemsLists";
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