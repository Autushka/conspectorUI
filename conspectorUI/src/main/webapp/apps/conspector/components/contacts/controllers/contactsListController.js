viewControllers.controller('contactsListView', ['$scope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider',
	function($scope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider) {
		$scope.actionsTE = $translate.instant('global_actions'); //need TE for ngTable columns headers
		$scope.nameTE = $translate.instant('global_name');
		$scope.titleTE = $translate.instant('global_title');
		$scope.phoneTE = $translate.instant('global_phone');
		$scope.emailTE = $translate.instant('global_email');

		var sAccountGuid = "";

		if($stateParams.sContractorGuid){
			sAccountGuid = $stateParams.sContractorGuid;
		}
		if($stateParams.sClientGuid){
			sAccountGuid = $stateParams.sClientGuid;
		}		

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
			var sName = "";
			for (var i = 0; i < aData.length; i++) {
				sName = "";
				if (aData[i].FirstName) {
					sName = aData[i].FirstName + " ";
				}
				if (aData[i].LastName) {
					sName = sName + aData[i].LastName;
				}

				oContactsListData.aData.push({
					sName: sName,
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
				sAccountGuid: sAccountGuid
			});
		};

		loadContacts();

		$scope.onDisplay = function(oContact) {
			$state.go('app.contactDetails', {
				sMode: "display",
				sAccountGuid: sAccountGuid,
				sContactGuid: oContact._guid,
			});
		};

		$scope.onEdit = function(oContact) {
			$state.go('app.contactDetails', {
				sMode: "edit",
				sAccountGuid: sAccountGuid,
				sContactGuid: oContact._guid,
			});
		};

		$scope.onAddNew = function() {
			// if ($scope.$parent && $scope.$parent.sViewName === "contractorDetailsWrapperView") { // needed here for new conractor creation flow...
			// 	sAccountGuid = $scope.$parent.sContractorGuid;
			// }
			$state.go('app.contactDetails', {
				sMode: "create",
				sAccountGuid: sAccountGuid,
				sContactGuid: "",
			});
		};
	}
]);