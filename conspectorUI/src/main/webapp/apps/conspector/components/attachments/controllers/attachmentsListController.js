viewControllers.controller('attachmentsListView', ['$scope', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', 'rolesSettings', '$upload', 'utilsProvider', 'CONSTANTS',
	function($scope, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider, $mdSidenav, $window, $filter, rolesSettings, $upload, utilsProvider, CONSTANTS) {
		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$scope.sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
		var sEntityType = "";
		var sEntityPath = "";
		var sEntity = "";
		switch ($rootScope.sCurrentStateName) {
			case "app.deficiencyDetailsWrapper.deficiencyDetails":
				sEntityType = "Deficiency";
				sEntityPath = "Tasks";
				sEntity = "oDeficiencyEntity";
				break;
			case "app.activityDetailsWrapper.activityDetails":
				sEntityType = "Activity";
				sEntityPath = "Activitys";
				sEntity = "oActivityEntity";
				break;
			case "app.unitDetailsWrapper.unitDetails":
				sEntityType = "Unit";
				sEntityPath = "Units";
				sEntity = "oUnitEntity";
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
			var aImages = [];
			for (var i = 0; i < oData.FileMetadataDetails.results.length; i++) {
				sMediaType = "";
				iSortingSequence = 0;
				if (oData.FileMetadataDetails.results[i].MediaType) {
					if (oData.FileMetadataDetails.results[i].MediaType.indexOf("image") > -1) {
						sMediaType = "Image";
						iImagesNumber++;
						iSortingSequence = 1;
						aImages.push(oData.FileMetadataDetails.results[i]);
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
					sCreatedAt: utilsProvider.dBDateToSting(oData.FileMetadataDetails.results[i].CreatedAt),
					sCreatedBy: oData.FileMetadataDetails.results[i].NewFileName
				});
			}

			$rootScope.iImagesNumber = iImagesNumber; //to refresh info for parent entity details view...
			$rootScope._aImages = angular.copy(aImages);

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

		loadAttachments();

		$scope.onFilesSelected = function(aFiles, $event) {
			var onProgress = function($event) {};
			var onSuccessUpload = function() { //called once for the last uploaded file
				// $scope.iUploadProgress = 50;
				cacheProvider.cleanEntitiesCache(sEntity);
				if ($rootScope.sMode === "create") {
					$rootScope.bDataHasBeenModified = true;
				}
				loadAttachments();

				var sEntityName = "";
				if (sEntity === "oDeficiencyEntity") {
					var onInterestedUsersLoaded = function(aData) {
						apiProvider.logEvents({
							aData: aData,
						});
					};

					if (sParentEntityGuid) {
						switch (sEntity) {
							case "oDeficiencyEntity":
								sEntityName = "deficiency";
								break;
							case "oActivityEntity":
								sEntityName = "activity";
								break;
						}
						apiProvider.getInterestedUsers({
							sEntityName: sEntityName,
							sOperationNameEN: "notificationsList_newAttachment",
							sOperationNameFR: "",
							aData: [{
								Guid: sParentEntityGuid
							}],
							onSuccess: onInterestedUsersLoaded
						});
					}
				}
			};

			servicesProvider.uploadAttachmentsForEntity({
				sPath: sEntityPath,
				aFiles: aFiles,
				sParentEntityGuid: sParentEntityGuid,
				sParentEntityFileMetadataSetGuid: $rootScope.sFileMetadataSetGuid,
				onSuccess: onSuccessUpload,
				onProgress: onProgress,
			});
		};

		$scope.onDisplay = function(oAttachment, $event) {
			if (oAttachment.sMediaType === "Other") {
				$event.target.nextElementSibling.click();
				return;
			}
			$window.open("rest/file/v2/get/" + oAttachment._guid);
		};

		$scope.onDelete = function(oAttachment) {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				},
			};
			var onSuccessDelete = function() {
				cacheProvider.cleanEntitiesCache(sEntity);
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