viewControllers.controller('deficienciesListView', ['$scope', '$rootScope', '$state', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'utilsProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', 'rolesSettings',
	function($scope, $rootScope, $state, servicesProvider, $translate, apiProvider, cacheProvider, utilsProvider, historyProvider, $mdSidenav, $window, $filter, rolesSettings) {
		historyProvider.removeHistory(); // because current view doesn't have a back button

		var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
		$scope.bDisplayAddButton = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: sCurrentRole,
			sEntityName: "oDeficiency",
			sOperation: "bCreate"
		});

		$scope.bDisplayEditButtons = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: sCurrentRole,
			sEntityName: "oDeficiency",
			sOperation: "bUpdate"
		});

		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$rootScope.oStateParams = {}; // for backNavigation			

		var oDeficienciesListData = {
			aData: []
		};

		var oTableStatusFromCache = cacheProvider.getTableStatusFromCache({
			sTableName: "deficienciesList",
			sStateName: $rootScope.sCurrentStateName,
		});

		var oInitialSortingForDeficienciesList = {};
		if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oSorting, {})) {
			oInitialSortingForDeficienciesList = angular.copy(oTableStatusFromCache.oSorting);
		}
		var oInitialFilterForDeficienciesList = {};
		if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oFilter, {})) {
			oInitialFilterForDeficienciesList = angular.copy(oTableStatusFromCache.oFilter);
		}
		var oInitialGroupsSettingsForDeficienciesList = [];
		if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.aGroups, [])) {
			oInitialGroupsSettingsForDeficienciesList = angular.copy(oTableStatusFromCache.aGroups);
		}

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oDeficienciesListData,
			sDisplayedDataArrayName: "aDisplayedDeficiencies",
			oInitialSorting: oInitialSortingForDeficienciesList,
			oInitialFilter: oInitialFilterForDeficienciesList,
			aInitialGroupsSettings: oInitialGroupsSettingsForDeficienciesList,
			sGroupBy: "sProjectPhase",
			sGroupsSortingAttribue: "_sortingSequence" //for default groups sorting
		});

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
			var sContractors = "";
			var iImagesNumber = 0;
			var sFileMetadataSetLastModifiedAt = "";
			var aImages = [];

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
				sContractors = "";
				iImagesNumber = 0;
				aImages = [];

				bMatchFound = false;

				if (aData[i].PhaseDetails) {
					iSortingSequence = aData[i].PhaseDetails.GeneralAttributes.SortingSequence;
					for (var k = 0; k < cacheProvider.oUserProfile.aGloballySelectedPhasesGuids.length; k++) {
						if (aData[i].PhaseDetails.Guid === cacheProvider.oUserProfile.aGloballySelectedPhasesGuids[k]) {
							bMatchFound = true;
							break;
						}
					}
					if (!bMatchFound) {
						continue;
					}

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
					sStatuseIconUrl = $window.location.origin + $window.location.pathname + "rest/file/get/" + aData[i].TaskStatusDetails.AssociatedIconFileGuid;
					sStatusSortingSequence = aData[i].TaskStatusDetails.GeneralAttributes.SortingSequence;
				}

				if (aData[i].AccountDetails) {
					for (var j = 0; j < aData[i].AccountDetails.results.length; j++) {
						sContractors = sContractors + aData[i].AccountDetails.results[j].Name + "; ";
					}
				}

				if(aData[i].UnitDetails){
					aData[i].sUnitName = aData[i].UnitDetails.Name;
				}

				if(aData[i].FileMetadataSetDetails){
					if(aData[i].FileMetadataSetDetails.AttachmentsNumber){// to display default 0
						iImagesNumber = aData[i].FileMetadataSetDetails.AttachmentsNumber;
					}					
					sFileMetadataSetLastModifiedAt = aData[i].FileMetadataSetDetails.LastModifiedAt;
					if(aData[i].FileMetadataSetDetails.FileMetadataDetails){
						for (var j = 0; j < aData[i].FileMetadataSetDetails.FileMetadataDetails.results.length; j++) {
							//Things[i]
							if(aData[i].FileMetadataSetDetails.FileMetadataDetails.results[j].MediaType.indexOf("image") > -1 && aData[i].FileMetadataSetDetails.FileMetadataDetails.results[j].GeneralAttributes.IsDeleted === false){
								aImages.push(aData[i].FileMetadataSetDetails.FileMetadataDetails.results[j]);
							}
						}
					}
				}
				
				if (aData[i].DueDate && aData[i].DueDate != "/Date(0)/") {
					sDueDate = utilsProvider.dBDateToSting(aData[i].DueDate);
					dDueDate = new Date(parseInt(aData[i].DueDate.substring(6, aData[i].DueDate.length - 2)));
					var timeDiff = Math.abs(dCurrentDate.getTime() - dDueDate.getTime());
					durationNumber = Math.ceil(timeDiff / (1000 * 3600 * 24)) - 1;
					sDueIn  = $translate.use() === "en" ? durationNumber + "d" : durationNumber + "j";;
					// sDueIn = durationNumber + " d";					
				}
				//$rootScope.sLogoUrl = $window.location.origin + $window.location.pathname + "rest/file/get/" + aData[0].guid;

				// if (!bMatchFound) {
				// 	continue;
				// }
				//aData[i].PhaseDetails._sortingSequence = 

				// sProjectName = $translate.use() === "en" ? aData[i].PhaseDetails.results[j].ProjectDetails.NameEN : aData[i].PhaseDetails.results[j].ProjectDetails.NameFR;
				// if (!sProjectName) {
				// 	sProjectName = aData[i].PhaseDetails.results[j].ProjectDetails.NameEN;
				// }
				// sPhaseName = $translate.use() === "en" ? aData[i].PhaseDetails.results[j].NameEN : aData[i].PhaseDetails.results[j].NameFR;
				// if (!sPhaseName) {
				// 	sPhaseName = aData[i].PhaseDetails.results[j].NameEN;
				// }

				oDeficienciesListData.aData.push({
					_guid: aData[i].Guid,
					sUnit: aData[i].sUnitName,
					sTags: aData[i].DescriptionTags,
					sLocationTags: aData[i].LocationTags,
					sDueIn: sDueIn,
					sProjectPhase: sProjectPhase,
					sContractors: sContractors,
					sStatusSortingSequence: sStatusSortingSequence,
					_unitGuid: aData[i].UnitGuid,
					_sortingSequence: iSortingSequence,
					sStatuseIconUrl: sStatuseIconUrl,
					_fileMetadataSetGuid: aData[i].FileMetadataSetGuid,
					_fileMetadataSetLastModifiedAt: sFileMetadataSetLastModifiedAt,
					iImagesNumber: iImagesNumber,
					_aImages: aImages,
				});
				// }


			}
			$scope.tableParams.reload();
		};

		var loadDeficiencies = function() {
			oDeficienciesListData.aData = [];
			apiProvider.getDeficiencies({
				sExpand: "PhaseDetails/ProjectDetails,TaskStatusDetails,AccountDetails,UnitDetails,FileMetadataSetDetails/FileMetadataDetails",
				bShowSpinner: true,
				onSuccess: onDeficienciesLoaded
			});
		};

		loadDeficiencies(); //load Deficiencys

		$scope.onDisplay = function(oDeficiency) {
			$rootScope.sFileMetadataSetGuid = oDeficiency._fileMetadataSetGuid;
			$rootScope.sFileMetadataSetLastModifiedAt = oDeficiency._fileMetadataSetLastModifiedAt;
			$state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
				sMode: "display",
				sDeficiencyGuid: oDeficiency._guid,
			});
		};

		$scope.onEdit = function(oDeficiency) {
			$rootScope.sFileMetadataSetGuid = oDeficiency._fileMetadataSetGuid;
			$rootScope.sFileMetadataSetLastModifiedAt = oDeficiency._fileMetadataSetLastModifiedAt;			
			$state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
				sMode: "edit",
				sDeficiencyGuid: oDeficiency._guid,
			});
		};

		$scope.onAddNew = function() {
			$state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
				sMode: "create",
				sDeficiencyGuid: "",
			});
		};
		$scope.onNavigateToUnitDetails = function(oDeficiency) {

            var sUnitGuid = oDeficiency._unitGuid;
           	$state.go('app.unitDetailsWrapper.unitDetails', {
                        sMode: "display",
                        sUnitGuid: sUnitGuid,
                    });
        };
		$scope.$on('globalUserPhasesHaveBeenChanged', function(oParameters) {
			loadDeficiencies();
		});

		$scope.$on('deficienciesShouldBeRefreshed', function(oParameters) {
			loadDeficiencies();
		});

		$scope.onDisplayPhotoGallery = function(oDeficiency, oEvent){
			oEvent.stopPropagation();
			if(oDeficiency._aImages.length){
				servicesProvider.setUpPhotoGallery(oDeficiency._aImages);
			}			
		};

		$scope.$on("$destroy", function() {
			if (historyProvider.getPreviousStateName() === $rootScope.sCurrentStateName) { //current state was already put to the history in the parent views
				return;
			}

			historyProvider.addStateToHistory({
				sStateName: $rootScope.sCurrentStateName,
				oStateParams: $rootScope.oStateParams
			});
			
			cacheProvider.putTableStatusToCache({
				sTableName: "deficienciesList",
				sStateName: $rootScope.sCurrentStateName,
				aGroups: $scope.tableParams.settings().$scope.$groups,
				oFilter: $scope.tableParams.$params.filter,
				oSorting: $scope.tableParams.$params.sorting,
			});
		});
	}
]);