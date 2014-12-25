viewControllers.controller('usersListView', ['$scope', '$state', 'servicesProvider', 'apiProvider', '$translate',
	function($scope, $state, servicesProvider, apiProvider, $translate) {
		$scope.actionsTE = $translate.instant('global_actions'); //need TE for ngTable columns headers
		$scope.userNameTE = $translate.instant('global_userName');
		$scope.emailTE = $translate.instant('global_email');
		$scope.rolesTE = $translate.instant('userList_roles');

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

		var onUsersLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				oUsersListData.aData.push({
					userName: aData[i].UserName,
					email: aData[i].EMail,
					_lastModifiedAt: aData[i].LastModifiedAt,
					roles: ""
				});
			}
			$scope.tableParams.reload();
		}

		apiProvider.getUsers({
			bShowSpinner: true,
			onSuccess: onUsersLoaded
		});
	}
]);