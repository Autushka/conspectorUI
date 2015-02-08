viewControllers.controller('attachmentsListView', ['$scope', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', 'rolesSettings',
	function($scope, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider, $mdSidenav, $window, $filter, rolesSettings) {
		historyProvider.removeHistory(); // because current view doesn't have a back button

//		var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
//		$scope.bDisplayAddButton = rolesSettings.getRolesSettingsForEntityAndOperation({
//			sRole: sCurrentRole,
//			sEntityName: "oDeficiency",
//			sOperation: "bCreate"
//		});
//
//		$scope.bDisplayEditButtons = rolesSettings.getRolesSettingsForEntityAndOperation({
//			sRole: sCurrentRole,
//			sEntityName: "oDeficiency",
//			sOperation: "bUpdate"
//		});
//
		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$rootScope.oStateParams = {}; // for backNavigation			
//
		var oAttachmentsListData = {
			aData: []
		};

        var sParentEntityGuid = "";

        if ($stateParams.sDeficiencyGuid) {
            sParentEntityGuid = $stateParams.sDeficiencyGuid;
        }

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oAttachmentsListData,
			sDisplayedDataArrayName: "aDisplayedAttachments",
			oInitialSorting: {},
			oInitialFilter: {},
			aInitialGroupsSettings: {},
			sGroupBy: "sType",
			sGroupsSortingAttribue: "_sortingSequence" //for default groups sorting
		});

		var onAttachmentsLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				oAttachmentsListData.aData.push({
					_guid: aData[i].Guid,
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
				sKey: sParentEntityGuid,
				sExpand: "FileMetadataDetails",//"PhaseDetails/ProjectDetails,TaskStatusDetails,AccountDetails",
				bShowSpinner: true,
				onSuccess: onAttachmentsLoaded
			});
		};
//
		loadAttachments(); //load attachments
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