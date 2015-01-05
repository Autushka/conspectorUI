viewControllers.controller('usersListView', ['$scope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$window', 'cacheProvider', 'CONSTANTS',
	function($scope, $state, servicesProvider, apiProvider, $translate, $window, cacheProvider, CONSTANTS) {
		$scope.actionsTE = $translate.instant('global_actions'); //need TE for ngTable columns headers
		$scope.userNameTE = $translate.instant('global_userName');
		$scope.emailTE = $translate.instant('global_email');
		$scope.rolesTE = $translate.instant('usersList_roles');

		var iNewItemsCounter = 0; //used to identify list item for new item deletion after sorting/filtering

		var oUsersListData = {
			aData: []
		};

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oUsersListData,
			sDisplayedDataArrayName: "aDisplayedUsers",
			oInitialSorting: {
				userName: 'asc'
			}
		});

		var onRolesLoaded = function(aData) {
			for (var i = 0; i < oUsersListData.aData.length; i++) {
				oUsersListData.aData[i].sRoles = "";
				for (var j = 0; j < oUsersListData.aData[i]._roleDetails.results.length; j++) {
					for (var k = 0; k < aData.length; k++) {
						if (oUsersListData.aData[i]._roleDetails.results[j].Guid === aData[k].Guid) {
							oUsersListData.aData[i].sRoles = oUsersListData.aData[i].sRoles + aData[k].RoleName + "; ";
							break;
						}
					}
				}
			}

			//$scope.tableParams.reload();
		};

		var onUsersLoaded = function(aData) {
			var bMatchFound = false;

			for (var i = 0; i < aData.length; i++) {
				if (cacheProvider.oUserProfile.sCurrentRole !== CONSTANTS.sGlobalAdministatorRole) { 
					bMatchFound = false;
					for (var j = 0; j < aData[i].CompanyDetails.results.length; j++) {
						if (aData[i].CompanyDetails.results[j].CompanyName === cacheProvider.oUserProfile.sCurrentCompany) {
							bMatchFound = true;
							break;
						}
					}

					if (!bMatchFound) {
						continue;
					} else {
						bMatchFound = false;
						for (var j = 0; j < aData[i].RoleDetails.results.length; j++) {
							if (aData[i].RoleDetails.results[j].RoleName === CONSTANTS.sGlobalAdministatorRole) {
								bMatchFound = true;
								break;
							}
						}

						if(bMatchFound){
							continue;
						}
					}
				}

				oUsersListData.aData.push({
					userName: aData[i].UserName,
					email: aData[i].EMail,
					_roleDetails: aData[i].RoleDetails,
					_lastModifiedAt: aData[i].LastModifiedAt,
					roles: ""
				});
			}
			$scope.tableParams.reload();

			apiProvider.getRoles({
				bShowSpinner: false,
				onSuccess: onRolesLoaded
			});
		}

		apiProvider.getUsersWithCompaniesPhasesAndRoles({
			bShowSpinner: true,
			onSuccess: onUsersLoaded
		});

		$scope.onDisplay = function(oUser) {
			$state.go('app.adminPanel.userDetails', {
				sMode: "display",
				sUserName: oUser.userName,
				sFromState: "app.adminPanel.usersList"
			});
		};

		$scope.onEdit = function(oUser) {
			$state.go('app.adminPanel.userDetails', {
				sMode: "edit",
				sUserName: oUser.userName,
				sFromState: "app.adminPanel.usersList"
			});
		};

		$scope.onAddNew = function() {
			$state.go('app.adminPanel.userDetails', {
				sMode: "create",
				sUserName: "",
				sFromState: "app.adminPanel.usersList"
			});
		};
	}
]);