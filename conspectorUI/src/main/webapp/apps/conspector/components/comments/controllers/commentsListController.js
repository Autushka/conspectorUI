viewControllers.controller('commentsListView', ['$scope', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', 'rolesSettings', '$upload', 'utilsProvider',
	function($scope, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider, $mdSidenav, $window, $filter, rolesSettings, $upload, utilsProvider) {
		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		
		var sEntityType = "";
		var sEntityPath = "";
		var oEntity = "";
		switch ($rootScope.sCurrentStateName) {
			case "app.deficiencyDetailsWrapper.deficiencyDetails":
				sEntityType = "Deficiency";
				sEntityPath = "Tasks";
				oEntity = "oDeficiencyEntity";
				break;
			case "app.activityDetailsWrapper.activityDetails":
				sEntityType = "Activity";
				sEntityPath = "Activitys";
				oEntity = "oActivityEntity";
				break;
			case "app.unitDetailsWrapper.unitDetails":
				sEntityType = "Unit";
				sEntityPath = "Units";
				oEntity = "oUnitEntity";
				break;
		}

		$scope.oComment = {};

		var oCommentsListData = {
			aData: []
		};

		var sParentEntityGuid = "";

		if ($stateParams.sDeficiencyGuid) {
			sParentEntityGuid = $stateParams.sDeficiencyGuid;
		}

		if ($stateParams.sActivityGuid) {
			sParentEntityGuid = $stateParams.sActivityGuid;
		}

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oCommentsListData,
			sDisplayedDataArrayName: "aDisplayedComments",
			oInitialSorting: {
				_createdAt: 'asc'
			},
			oInitialFilter: {},
			aInitialGroupsSettings: {},
		});

		var onCommentsLoaded = function(oData) {
			oCommentsListData.aData = angular.copy(servicesProvider.processListOfComments(oData));
			$scope.tableParams.reload();
		};

		var loadComments = function() {
			if ($rootScope.sCommentSetGuid) {
				oCommentsListData.aData = [];
				apiProvider.getEntityComments({
					sKey: $rootScope.sCommentSetGuid,
					sExpand: "CommentDetails/ContactDetails/UserDetails", //"PhaseDetails/ProjectDetails,TaskStatusDetails,AccountDetails",
					bShowSpinner: true,
					onSuccess: onCommentsLoaded
				});
			}
		};

		$scope.$on("CommentsCanBeLoaded", function() {
			loadComments();
		});

		$scope.onEdit = function(oComment) {
			if (oComment._userName !== cacheProvider.oUserProfile.sUserName) {
				utilsProvider.displayMessage({
					sText: $translate.instant("global_onlyOwnCommetsCanBeModified"),
					sType: 'error'
				});
				return;
			}
			oComment._editMode = true;
		};

		$scope.onDelete = function(oComment) {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				loadComments();
			}

			oDataForSave.LastModifiedAt = oComment._lastModifiedAt;
			apiProvider.updateComment({
				bShowSpinner: true,
				sKey: oComment._guid,
				oData: oDataForSave,
				bShowSuccessMessage: true,
				bShowErrorMessage: true,
				onSuccess: onSuccessDelete
			});
		};

		$scope.onSaveUpdate = function(oComment) {
			var oDataForSave = {};
			var onSuccessUpdate = function() {
				//loadComments();
				oComment._editMode = false;
			}

			oDataForSave.LastModifiedAt = oComment._lastModifiedAt;
			oDataForSave.Text = oComment.sText;
			apiProvider.updateComment({
				bShowSpinner: true,
				sKey: oComment._guid,
				oData: oDataForSave,
				bShowSuccessMessage: true,
				bShowErrorMessage: true,
				onSuccess: onSuccessUpdate
			});
		};

		$scope.onSave = function() {
			var onSuccess = function() {
				$scope.oComment.sText = "";
				loadComments();
			};
			var oDataForSave = {
				GeneralAttributes: {}
			};
			
			oDataForSave.ContactGuid = cacheProvider.oUserProfile.oUserContact.Guid;
			oDataForSave.Text = $scope.oComment.sText;

			servicesProvider.addCommentForEntity({
				sPath: sEntityPath,
				oData: oDataForSave,
				sParentEntityGuid: sParentEntityGuid,
				sParentEntityCommentSetGuid: $rootScope.sCommentSetGuid,
				onSuccess: onSuccess,
			});
		};
	}
]);