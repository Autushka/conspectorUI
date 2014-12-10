viewControllers.controller('userManagementView', function($scope, $rootScope, $filter, $q, ngTableParams, dataSrv, globalSrv, customSrv, $state) {
	$rootScope.viewTitleTE = jQuery.i18n.prop('adminAreaView.userManagementSubviewTitleTE');
	$scope.newTE = jQuery.i18n.prop('globalTE.newTE');

	$scope.oTableDataArrays = {
		aUsers: []
	};
	$scope.oTableData = {};

	$scope.aRoles = [];
	$scope.bShowFilters = false;

	$scope.refreshUsersList = function() {
		$scope.oTableDataArrays.aUsers = [];
		$scope.aRoles = [];
		var oGetUsersSrv = dataSrv.httpRequest("jsp/system/getUsers.jsp", {}, "GET", true);
		oGetUsersSrv.then(function(oData) {
			for (var i = 0; i < oData.length; i++) {
				for (var j = 0; j < oData[i].usersRolesRelations.length; j++) {
					var bFlag = false;
					for (var k = 0; k < $scope.aRoles.length; k++) {
						if ($scope.aRoles[k] === oData[i].usersRolesRelations[j].role) {
							bFlag = true;
							break;
						}
					}
					if (!bFlag) {
						for (k = 0; k < MENUS.appRoles.length; k++) {
							if (MENUS.appRoles[k] === oData[i].usersRolesRelations[j].role) {
								$scope.aRoles.push(oData[i].usersRolesRelations[j].role);
								break;
							}
						}
					}
				}
			}
			$scope.aRoles.sort();
			for (i = 0; i < oData.length; i++) {
				var oUser = {
					name: oData[i].userName,
					email: oData[i].email,
				};
				for (var m = 0; m < $scope.aRoles.length; m++) {
					oUser[$scope.aRoles[m]] = false;
				}
				for (var l = 0; l < oData[i].usersRolesRelations.length; l++) {
					oUser[oData[i].usersRolesRelations[l].role] = true;
				}
				$scope.oTableDataArrays.aUsers.push(oUser);
			}
			dataSrv.aUsers = $scope.oTableDataArrays.aUsers;
			dataSrv.aRoles = $scope.aRoles;
			$scope.setUsersListTableData();
		});
	};

	$scope.setUsersListTableData = function() {
		$scope.oTableDataArrays.aUsers = dataSrv.aUsers;
		$scope.aRoles = dataSrv.aRoles;

		if (!$scope.oUsersTable) {

			$scope.oUsersTable = customSrv.createNgTableParams({
				oTableDataArrays: $scope.oTableDataArrays,
				oTableData: $scope.oTableData,
				sSourceDataArrayAttribute: "aUsers",
				sTargerObjectAttribute: "aDisplayedUsers"
			});
		} else {
			$scope.oUsersTable.reload();
		}
	};

	if (!dataSrv.aUsers.length) {
		$scope.refreshUsersList();
	} else {
		$scope.setUsersListTableData();
	}

	$scope.onClearFiltering = function() {
		$scope.oUsersTable.sorting({});
		$scope.oUsersTable.filter({});
		$scope.filter = "";
		$scope.oUsersTable.reload();
	};

	$scope.onRefresh = function() {
		$scope.refreshUsersList();
	};

	$scope.onRoleClick = function($event) {
		var oParameters = $.parseJSON($event.srcElement.getAttribute('customData'));
		if ($event.srcElement.checked) {
			var oSetRoleSrv = dataSrv.httpRequest("jsp/system/setUserRole.jsp", oParameters, "POST");
			oSetRoleSrv.then(function(oData) {});
		} else {
			var oRemoveRoleSrv = dataSrv.httpRequest("jsp/system/removeUserRole.jsp", oParameters, "POST");
			oRemoveRoleSrv.then(function(oData) {});
		}
	};

	$scope.onRemove = function(oUser) {
		customSrv.getEntitySet({
			oReadServiceParameters: {
				path: "UsersRolesRelation",
				filter: "userName eq '" + oUser.name + "'",
				expand: "",
				showSpinner: false
			},
			oServiceProvider: customSrv,
			fnSuccessCallBack: function(aData) {
				$scope.iCount = aData.length;

				if (aData.length === 0) {
					var oDeleteUserSrv = customSrv.deleteODataEntityNew({
						path: "User",
						key: "'" + oUser.name + "'",
						bShowSuccessMessage: true,
						bShowErrorMessage: true
					});
					oDeleteUserSrv.then(function() {
						$scope.refreshUsersList();
					});
				}
				for (var i = 0; i < aData.length; i++) {
					var oDeleteUsersRolesRelationSrv = customSrv.deleteODataEntityNew({
						path: "UsersRolesRelation",
						key: aData[i].usersRolesRelationId,
						bShowSuccessMessage: false,
						bShowErrorMessage: true
					});
					oDeleteUsersRolesRelationSrv.then(function() {
						$scope.iCount--;
						if ($scope.iCount === 0) {
							var oDeleteUserSrv = customSrv.deleteODataEntityNew({
								path: "User",
								key: "'" + oUser.name + "'",
								bShowSuccessMessage: true,
								bShowErrorMessage: true
							});
							oDeleteUserSrv.then(function() {
								$scope.refreshUsersList();
							});
						}
					});
				}
			}
		});


		// var oDeleteUserSrv = customSrv.deleteODataEntityNew({
		// 	path: "User",
		// 	key: "'" + oUser.name + "'",
		// 	bShowSuccessMessage: true,
		// 	bShowErrorMessage: true
		// });
		// oDeleteUserSrv.then(function(){
		// 	$scope.refreshUsersList();
		// });
	};

	$scope.newRole = "";
	$scope.hideAddRoleForm = true;
	$scope.onAddRoleClick = function() {
		$scope.hideAddRoleForm = false;
	};
	$scope.onCancelAddRoleClick = function() {
		$scope.hideAddRoleForm = true;
	};
	$scope.onSubmitAddRoleClick = function() {
		var oParameters = {
			role: $scope.newRole,
			userName: $scope.globalData.userName
		};
		var oSetRoleSrv = dataSrv.httpRequest("jsp/system/setUserRole.jsp", oParameters);
		oSetRoleSrv.then(function(oData) {
			noty({
				text: jQuery.i18n.prop('global.operationSuccessTE'),
				type: 'success',
				layout: 'topCenter',
				timeout: CONSTANTS.messageDisplayTime
			});
			$scope.aRoles.push($scope.newRole);
			dataSrv.aRoles.push($scope.newRole);
			$scope.newRole = "";
			$scope.hideAddRoleForm = true;
		});
	};

	$scope.onAddNew = function() {
		$state.go('^.addNewUser');
		//$scope.bShowFilters = !$scope.bShowFilters;
	};

	$scope.onFilterIconClick = function() {
		$scope.bShowFilters = !$scope.bShowFilters;
	};
});