viewControllers.controller('attachmentsListView', ['$scope', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', 'rolesSettings', '$upload',
	function($scope, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider, $mdSidenav, $window, $filter, rolesSettings, $upload) {
		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$rootScope.oStateParams = {}; // for backNavigation			

		var oAttachmentsListData = {
			aData: []
		};

		var sParentEntityGuid = "";
		//var sParentEntityFileMetadataSetGuid = "";

		if ($stateParams.sDeficiencyGuid) {
			sParentEntityGuid = $stateParams.sDeficiencyGuid;
			//sParentEntityFileMetadataSetGuid = $rootScope.sFileMetadataSetGuid;
		}

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oAttachmentsListData,
			sDisplayedDataArrayName: "aDisplayedAttachments",
			oInitialSorting: {},
			oInitialFilter: {},
			aInitialGroupsSettings: {},
			sGroupBy: "sMediaType",
			sGroupsSortingAttribue: "_sortingSequence" //for default groups sorting
		});

		var onAttachmentsLoaded = function(oData) {
			var sMediaType = "";
			for (var i = 0; i < oData.FileMetadataDetails.results.length; i++) {
				sMediaType = "";
				if(oData.FileMetadataDetails.results[i].MediaType.indexOf("image") > -1){
					sMediaType = "Image";
				}
				if(oData.FileMetadataDetails.results[i].MediaType.indexOf("pdf") > -1){
					sMediaType = "PDF";
				}				


				oAttachmentsListData.aData.push({
					_guid: oData.FileMetadataDetails.results[i].Guid,
					sMediaType: sMediaType,
					sOriginalFileName: oData.FileMetadataDetails.results[i].OriginalFileName,
					// sTags: aData[i].DescriptionTags,
					// sProjectPhase: sProjectPhase,
					// sContractors: sContractors,
					// _sortingSequence: iSortingSequence,
					// sStatuseIconUrl: sStatuseIconUrl
				});
			}
			$scope.tableParams.reload();
		};

		var loadAttachments = function() {
			oAttachmentsListData.aData = [];
			apiProvider.getEntityAttachments({
				sKey: $rootScope.sFileMetadataSetGuid,
				sExpand: "FileMetadataDetails", //"PhaseDetails/ProjectDetails,TaskStatusDetails,AccountDetails",
				bShowSpinner: true,
				onSuccess: onAttachmentsLoaded
			});
		};

		$scope.$on("FileAttachemntsCanBeLoaded", function() {
			loadAttachments();
		})

		// if ($rootScope.sFileMetadataSetGuid) {
		// 	loadAttachments(); //load attachments
		// }

		$scope.onFilesSelected = function(aFiles, $event) {
			// var bParentEntityHasFileMetadataSetGuid = false;
			// if (sParentEntityFileMetadataSetGuid) {
			// 	bParentEntityHasFileMetadataSetGuid = true;
			// }

			var onSuccessUpload = function(){
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
		//
		//		$scope.onDisplay = function(oDeficiency) {
		//			$state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
		//				sMode: "display",
		//				sDeficiencyGuid: oDeficiency._guid,
		//			});
		//		};
		//
		//		$scope.onEdit = function(oDeficiency) {
		//			$state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
		//				sMode: "edit",
		//				sDeficiencyGuid: oDeficiency._guid,
		//			});
		//		};
		//
		//		$scope.onAddNew = function() {
		//			$state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
		//				sMode: "create",
		//				sDeficiencyGuid: "",
		//			});
		//		};
		//		$scope.$on('globalUserPhasesHaveBeenChanged', function(oParameters) {
		//			loadDeficiencys();
		//		});
		//
		//		$scope.$on('AttachmentsShouldBeRefreshed', function(oParameters) {
		//			loadDeficiencys();
		//		});
		//
		//		$scope.$on("$destroy", function() {
		//			if (historyProvider.getPreviousStateName() === $rootScope.sCurrentStateName) { //current state was already put to the history in the parent views
		//				return;
		//			}
		//
		//			historyProvider.addStateToHistory({
		//				sStateName: $rootScope.sCurrentStateName,
		//				oStateParams: $rootScope.oStateParams
		//			});
		//
		//			cacheProvider.putTableStatusToCache({
		//				sTableName: "AttachmentsList",
		//				sStateName: $rootScope.sCurrentStateName,
		//				aGroups: $scope.tableParams.settings().$scope.$groups,
		//				oFilter: $scope.tableParams.$params.filter,
		//				oSorting: $scope.tableParams.$params.sorting,
		//			});
		//		});
	}
]);