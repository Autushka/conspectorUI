viewControllers.controller('attachmentsListView', ['$scope', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', 'rolesSettings', '$upload', 'utilsProvider',
	function($scope, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider, $mdSidenav, $window, $filter, rolesSettings, $upload, utilsProvider) {
		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$scope.sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
		var sEntityType = "";
		var sEntitySPath = "";
		var oEntity = "";
		switch ($rootScope.sCurrentStateName) {
			case "app.deficiencyDetailsWrapper.deficiencyDetails":
				sEntityType = "Deficiency";
				sEntitySPath = "Tasks";
				oEntity = "oDeficiencyEntity";
				break;
			case "app.activityDetailsWrapper.activityDetails":
				sEntityType = "Activity";
				sEntitySPath = "Activitys";
				oEntity = "oActivityEntity";
				break;
			case "app.unitDetailsWrapper.unitDetails":
				sEntityType = "Unit";
				sEntitySPath = "Units";
				oEntity = "oUnitEntity";
				break;
		}

		var oAttachmentsListData = {
			aData: []
		};

		var sParentEntityGuid = "";

		$scope.clickUploadButton = function() {
			angular.element('#uploadFilesToDeficiency').trigger('click');
		}

		if ($stateParams.sDeficiencyGuid) {
			sParentEntityGuid = $stateParams.sDeficiencyGuid;
		}

		if ($stateParams.sActivityGuid) {
			sParentEntityGuid = $stateParams.sActivityGuid;
		}

		if ($stateParams.sUnitGuid) {
			sParentEntityGuid = $stateParams.sUnitGuid;
		}

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oAttachmentsListData,
			sDisplayedDataArrayName: "aDisplayedAttachments",
			oInitialSorting: {
				_createdAt: 'desc'
			},
			oInitialFilter: {},
			aInitialGroupsSettings: {},
			sGroupBy: "sMediaType",
			sGroupsSortingAttribue: "_sortingSequence" //for default groups sorting
		});

		var onAttachmentsLoaded = function(oData) {
			var sMediaType = "";
			var iImagesNumber = 0;
			var iSortingSequence = 0;
			for (var i = 0; i < oData.FileMetadataDetails.results.length; i++) {
				sMediaType = "";
				iSortingSequence = 0;
				if (oData.FileMetadataDetails.results[i].MediaType) {
					if (oData.FileMetadataDetails.results[i].MediaType.indexOf("image") > -1) {
						sMediaType = "Image";
						iImagesNumber++;
						iSortingSequence = 1;
					}
					if (oData.FileMetadataDetails.results[i].MediaType.indexOf("pdf") > -1) {
						sMediaType = "PDF";
						iSortingSequence = 2;
					}
				}

				if (!sMediaType) {
					sMediaType = "Other";
					iSortingSequence = 3;
				}
				oAttachmentsListData.aData.push({
					_guid: oData.FileMetadataDetails.results[i].Guid,
					sMediaType: sMediaType,
					sOriginalFileName: oData.FileMetadataDetails.results[i].OriginalFileName,
					_lastModifiedAt: oData.FileMetadataDetails.results[i].LastModifiedAt,
					_sortingSequence: iSortingSequence,
					_createdAt: oData.FileMetadataDetails.results[i].CreatedAt,
					sCreatedAt: utilsProvider.dBDateToSting(oData.FileMetadataDetails.results[i].CreatedAt)
				});
			}
			$scope.tableParams.reload();
		};

		var loadAttachments = function() {
			if ($rootScope.sFileMetadataSetGuid) {
				oAttachmentsListData.aData = [];
				apiProvider.getEntityAttachments({
					sKey: $rootScope.sFileMetadataSetGuid,
					sExpand: "FileMetadataDetails", //"PhaseDetails/ProjectDetails,TaskStatusDetails,AccountDetails",
					bShowSpinner: true,
					onSuccess: onAttachmentsLoaded
				});
			}
		};

		$scope.$on("FileAttachemntsCanBeLoaded", function() {
			loadAttachments();
		});

		$scope.onFilesSelected = function(aFiles, $event) {
			var onProgress = function($event) {
				// $scope.iUploadProgress = 100 * parseInt($event.loaded / $event.total, 10);
				$scope.iUploadProgress = 50;
				// $scope.iUploadProgress = $scope.iUploadProgress + "%";
				//console.log('progress: ' + progressPercentage + '% ' + $event.config.file.name);
			};
			var onSuccessUpload = function() { //called once for the last uploaded file
				$scope.iUploadProgress = 50;
				cacheProvider.cleanEntitiesCache("oDeficiencyEntity");
				if ($rootScope.sMode === "create") {
					$rootScope.bDataHasBeenModified = true;
				}
				loadAttachments();
			};

			servicesProvider.uploadAttachmentsForEntity({
				sPath: sEntitySPath,
				aFiles: aFiles,
				sParentEntityGuid: sParentEntityGuid,
				sParentEntityFileMetadataSetGuid: $rootScope.sFileMetadataSetGuid,
				onSuccess: onSuccessUpload,
				onProgress: onProgress,
			});
		};

		$scope.onDisplay = function(oAttachment, $event) {
			if(oAttachment.sMediaType === "Other"){
				$event.target.nextElementSibling.click();
				return;
			}
			$window.open("rest/file/get/" + oAttachment._guid);
		};

		$scope.onDelete = function(oAttachment) {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				},
			};
			var onSuccessDelete = function() {
				cacheProvider.cleanEntitiesCache("oDeficiencyEntity");
				loadAttachments();
			}

			if (oAttachment._guid) {
				oDataForSave.Guid = oAttachment._guid;
				oDataForSave.LastModifiedAt = oAttachment._lastModifiedAt;

				apiProvider.updateEntityAttachment({
					sKey: oAttachment._guid,
					oData: oDataForSave,
					bShowSpinner: true,
					onSuccess: onSuccessDelete
				});
			}
		};
	}
]);