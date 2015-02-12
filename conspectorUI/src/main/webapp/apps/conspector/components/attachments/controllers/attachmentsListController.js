viewControllers.controller('attachmentsListView', ['$scope', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', 'rolesSettings', '$upload', 'utilsProvider',
	function($scope, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider, $mdSidenav, $window, $filter, rolesSettings, $upload, utilsProvider) {
		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		// $rootScope.oStateParams = {}; 
		// for backNavigation	
		var bUpdateImagesNumber = false;

		var oAttachmentsListData = {
			aData: []
		};

		var sParentEntityGuid = "";

		$scope.clickUploadButton = function(){
			angular.element('#uploadFilesToDeficiency').trigger('click');
		}

		if ($stateParams.sDeficiencyGuid) {
			sParentEntityGuid = $stateParams.sDeficiencyGuid;
			//sParentEntityFileMetadataSetGuid = $rootScope.sFileMetadataSetGuid;
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

		var updateAttachmentsNumber = function(iImagesNumber) {
			var onSuccessUpdate = function(oData) {
				$rootScope.sFileMetadataSetLastModifiedAt = oData.LastModifiedAt;
				cacheProvider.cleanEntitiesCache("oDeficiencyEntity");
			};

			apiProvider.updateFileMetadataSet({
				sKey: $rootScope.sFileMetadataSetGuid,
				oData: {
					Guid: $rootScope.sFileMetadataSetGuid,
					AttachmentsNumber: iImagesNumber,
					LastModifiedAt: $rootScope.sFileMetadataSetLastModifiedAt,
				},
				onSuccess: onSuccessUpdate
			});
		};

		var onAttachmentsLoaded = function(oData) {
			var sMediaType = "";
			var iImagesNumber = 0;
			var iSortingSequence = 0;
			for (var i = 0; i < oData.FileMetadataDetails.results.length; i++) {
				sMediaType = "";
				iSortingSequence = 0;
				if (oData.FileMetadataDetails.results[i].MediaType.indexOf("image") > -1) {
					sMediaType = "Image";
					iImagesNumber++;
					iSortingSequence = 1;
				}
				if (oData.FileMetadataDetails.results[i].MediaType.indexOf("pdf") > -1) {
					sMediaType = "PDF";
					iSortingSequence = 2;
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
			if (bUpdateImagesNumber) {
				updateAttachmentsNumber(iImagesNumber);
			}
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
			var onSuccessUpload = function() { //called once for the last uploaded file
				bUpdateImagesNumber = true;
				loadAttachments();
			};

			servicesProvider.uploadAttachmentsForEntity({
				sPath: "Tasks",
				aFiles: aFiles,
				sParentEntityGuid: sParentEntityGuid,
				sParentEntityFileMetadataSetGuid: $rootScope.sFileMetadataSetGuid,
				onSuccess: onSuccessUpload
			});
		};

		$scope.onDisplay = function(oAttachment) {
			$window.open("rest/file/get/" + oAttachment._guid);
		};

		$scope.onDelete = function(oAttachment) {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				},
				//LastModifiedAt
			};
			var onSuccessDelete = function() {
				bUpdateImagesNumber = true;
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