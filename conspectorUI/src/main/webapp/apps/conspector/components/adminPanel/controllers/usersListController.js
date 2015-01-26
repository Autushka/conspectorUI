viewControllers.controller('usersListView', ['$scope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$window', 'cacheProvider', 'CONSTANTS', 'historyProvider',
	function($scope, $state, servicesProvider, apiProvider, $translate, $window, cacheProvider, CONSTANTS, historyProvider) {
		$scope.actionsTE = $translate.instant('global_actions'); //need TE for ngTable columns headers
		$scope.userNameTE = $translate.instant('global_userName');
		$scope.emailTE = $translate.instant('global_email');
		$scope.rolesTE = $translate.instant('global_roles');
		$scope.companiesTE = $translate.instant('adminPanel_companies');

		$scope.sCurrentStateName = $state.current.name;	// for backNavigation	
		$scope.oStateParams = {};// for backNavigation

		$scope.sGlobalAdministratorRole = CONSTANTS.sGlobalAdministatorRole;
		$scope.sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;		

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

		var onCompaniesLoaded = function(aData){
			for (var i = 0; i < oUsersListData.aData.length; i++) {
				oUsersListData.aData[i].sCompanies = "";
				for (var j = 0; j < oUsersListData.aData[i]._companyDetails.results.length; j++) {
					for (var k = 0; k < aData.length; k++) {
						if (oUsersListData.aData[i]._companyDetails.results[j].CompanyName === aData[k].CompanyName) {
							oUsersListData.aData[i].sCompanies = oUsersListData.aData[i].sCompanies + aData[k].CompanyName + "; ";
							break;
						}
					}
				}
			}
		};

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
							if (aData[i].RoleDetails.results[j].RoleName === CONSTANTS.sGlobalAdministatorRole && aData[i].UserName !== cacheProvider.oUserProfile.sUserName) {
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
					_companyDetails: aData[i].CompanyDetails,
					_lastModifiedAt: aData[i].LastModifiedAt,
					roles: ""
				});
			}
			$scope.tableParams.reload();

			apiProvider.getCompanies({
				bShowSpinner: false,
				onSuccess: onCompaniesLoaded
			});

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
			});
		};

		$scope.onEdit = function(oUser) {
			$state.go('app.adminPanel.userDetails', {
				sMode: "edit",
				sUserName: oUser.userName,
			});
		};

		$scope.onAddNew = function() {
			$state.go('app.adminPanel.userDetails', {
				sMode: "create",
				sUserName: "",
			});
		};

		$scope.$on("$destroy", function() {
			historyProvider.addStateToHistory({
				sStateName: $scope.sCurrentStateName,
				oStateParams: $scope.oStateParams
			});
		});			
	}
]);