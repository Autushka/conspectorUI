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
			var sAuthor = "";
			var sAvatarUrl = "";
			var sUserName = "";
			var bAllowedEditMode = false;

			for (var i = 0; i < oData.CommentDetails.results.length; i++) {
				sAuthor = "";
				sAvatarUrl = "";
				sUserName = "";
				if (oData.CommentDetails.results[i].ContactDetails) {
					if (oData.CommentDetails.results[i].ContactDetails.FirstName) {
						sAuthor = oData.CommentDetails.results[i].ContactDetails.FirstName + " ";
					}
					if (oData.CommentDetails.results[i].ContactDetails.LastName) {
						sAuthor = sAuthor + oData.CommentDetails.results[i].ContactDetails.LastName;
					}
				}
				sAvatarUrl = "apps/conspector/img/noAvatar.jpg";
				//here assumption is made that only one user can be assigned to contact...
				if (oData.CommentDetails.results[i].ContactDetails && oData.CommentDetails.results[i].ContactDetails.UserDetails && oData.CommentDetails.results[i].ContactDetails.UserDetails.results) {
					if(oData.CommentDetails.results[i].ContactDetails.UserDetails.results.length){
						if(oData.CommentDetails.results[i].ContactDetails.UserDetails.results[0].AvatarFileGuid){
							sAvatarUrl = servicesProvider.constructImageUrl(oData.CommentDetails.results[i].ContactDetails.UserDetails.results[0].AvatarFileGuid);
						}
						sUserName = oData.CommentDetails.results[i].ContactDetails.UserDetails.results[0].UserName;
					}					
				}
				bAllowedEditMode = (sUserName === cacheProvider.oUserProfile.sUserName) ? true : false;

				oCommentsListData.aData.push({
					_guid: oData.CommentDetails.results[i].Guid,
					_lastModifiedAt: oData.CommentDetails.results[i].LastModifiedAt,
					_createdAt: oData.CommentDetails.results[i].CreatedAt,
					sCreatedAt: utilsProvider.dBDateToSting(oData.CommentDetails.results[i].CreatedAt),
					sText: oData.CommentDetails.results[i].Text,
					sAuthor: sAuthor,
					sAvatarUrl: sAvatarUrl,
					_editMode: false,
					_allowEditMode: bAllowedEditMode,
					_userName: sUserName,
				});
			}
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