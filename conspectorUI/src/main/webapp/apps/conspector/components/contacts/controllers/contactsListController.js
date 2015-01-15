viewControllers.controller('contactsListView', ['$scope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider',
	function($scope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider) {
		$scope.actionsTE = $translate.instant('global_actions'); //need TE for ngTable columns headers
		$scope.nameTE = $translate.instant('global_name');
		$scope.titleTE = $translate.instant('global_title');
		$scope.phoneTE = $translate.instant('global_phone');
		$scope.emailTE = $translate.instant('global_email');

		var oContactsListData = {
			aData: []
		};

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oContactsListData,
			sDisplayedDataArrayName: "aDisplayedContacts",
			oInitialSorting: {
				sContactName: 'asc'
			},
			sGroupBy: "sContactType",
		});

		var onContactsLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				oContactsListData.aData.push({
					sName: aData[i].FirstName + " " + aData[i].LastName,
					sTitle: aData[i].Title,
					sPhone: aData[i].MobilePhone,
					sEmail: aData[i].Email,
					_guid: aData[i].Guid,
					sContactType: "TemporaryOne",

				});
			}

			$scope.tableParams.reload();
		};

		var loadContacts = function() {
			oContactsListData.aData = [];
			apiProvider.getContactsForAccount({
				bShowSpinner: true,
				onSuccess: onContactsLoaded,
				sAccountGuid: $stateParams.sContractorGuid
			});
		};

		loadContacts();

		$scope.onDisplay = function(oContact) {
			$state.go('app.contactDetails', {
				sMode: "display",
				sAccountGuid: $stateParams.sContractorGuid,
				sContactGuid: oContact._guid,
			});
		};

		$scope.onEdit = function(oContact) {
			$state.go('app.contactDetails', {
				sMode: "edit",
				sAccountGuid: $stateParams.sContractorGuid,
				sContactGuid: oContact._guid,
			});
		};

		$scope.onAddNew = function() {
			$state.go('app.contactDetails', {
				sMode: "create",
				sAccountGuid: $stateParams.sContractorGuid,
				sContactGuid: "",
			});
		};
	}
]);