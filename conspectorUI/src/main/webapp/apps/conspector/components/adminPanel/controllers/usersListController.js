viewControllers.controller('usersListView', ['$scope', '$rootScope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$window', 'cacheProvider', 'CONSTANTS', 'historyProvider', 'rolesSettings',
	function($scope, $rootScope, $state, servicesProvider, apiProvider, $translate, $window, cacheProvider, CONSTANTS, historyProvider, rolesSettings) {
 		historyProvider.removeHistory();// because current view doesn't have a back button		
		
 		$rootScope.sCurrentStateName = $state.current.name;	// for backNavigation	
 		$rootScope.oStateParams = {};// for backNavigation	
		
		$scope.sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;			

		$scope.bIsGlobalUserAdministrator = rolesSettings[$scope.sCurrentRole].bIsGlobalUserAdministrator;
		$scope.bDisplayAddButton = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: $scope.sCurrentRole,
			sEntityName: "oUser",
			sOperation: "bCreate"
		});

		$scope.bDisplayEditButtons = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: $scope.sCurrentRole,
			sEntityName: "oUser",
			sOperation: "bUpdate"
		});				

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
				if (!rolesSettings[cacheProvider.oUserProfile.sCurrentRole].bIsGlobalUserAdministrator) { 
					bMatchFound = false;
					for (var j = 0; j < aData[i].CompanyDetails.results.length; j++) {
						if (aData[i].CompanyDetails.results[j].CompanyName === cacheProvider.oUserProfile.sCurrentCompany) {
							bMatchFound = true;
							break;
						}
					}

					if (!bMatchFound) {
						continue;
					} 
					else {
						bMatchFound = false;
						for (var j = 0; j < aData[i].RoleDetails.results.length; j++) {
							if (rolesSettings[aData[i].RoleDetails.results[j].RoleName] && rolesSettings[aData[i].RoleDetails.results[j].RoleName].bIsGlobalUserAdministrator && aData[i].UserName !== cacheProvider.oUserProfile.sUserName) {
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

		apiProvider.getUsers({
			sExpand: "CompanyDetails,PhaseDetails,RoleDetails",
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
			if(historyProvider.getPreviousStateName() === $rootScope.sCurrentStateName){ //current state was already put to the history in the parent views
				return;
			}			
			
			historyProvider.addStateToHistory({
				sStateName: $rootScope.sCurrentStateName,
				oStateParams: $rootScope.oStateParams
			});
		});			
	}
]);
