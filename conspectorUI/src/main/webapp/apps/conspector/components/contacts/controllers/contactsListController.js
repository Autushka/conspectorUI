viewControllers.controller('contactsListView', ['$scope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider', '$filter', 'rolesSettings',
	function($scope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider, $filter, rolesSettings) {
		$scope.actionsTE = $translate.instant('global_actions'); //need TE for ngTable columns headers
		$scope.nameTE = $translate.instant('global_name');
		$scope.titleTE = $translate.instant('global_title');
		$scope.phoneTE = $translate.instant('global_phone');
		$scope.emailTE = $translate.instant('global_email');
		$scope.accountTE = $translate.instant('global_account');

		var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
		$scope.bDisplayAddButton = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: sCurrentRole,
			sEntityName: "oContact",
			sOperation: "bCreate"
		});

		$scope.bDisplayEditButtons = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: sCurrentRole,
			sEntityName: "oContact",
			sOperation: "bUpdate"
		});			

		$scope.bDisplayAccountColumn = $state.current.name === "app.contactsList" ? true : false;


		$scope.sCurrentStateName = $state.current.name; // for backNavigation	
		$scope.oStateParams = {}; // for backNavigation		

		var sAccountGuid = "";

		if ($stateParams.sContractorGuid) {
			sAccountGuid = $stateParams.sContractorGuid;
		}
		if ($stateParams.sClientGuid) {
			sAccountGuid = $stateParams.sClientGuid;
		}

		var oContactsListData = {
			aData: []
		};

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oContactsListData,
			sDisplayedDataArrayName: "aDisplayedContacts",
			oInitialSorting: {
				sName: 'asc'
			},
			sGroupBy: "sContactType",
		});

		var onContactsLoaded = function(aData) {
			var sName = "";
			var sProjectAndPhase = "";
			var bMatchFound = false;
			for (var i = 0; i < aData.length; i++) {
				for (var j = 0; j < aData[i].PhaseDetails.results.length; j++) {
					aData[i].PhaseDetails.results[j]._sortingSequence = aData[i].PhaseDetails.results[j].GeneralAttributes.SortingSequence;
				}
				aData[i].PhaseDetails.results = $filter('orderBy')(aData[i].PhaseDetails.results, ["_sortingSequence"]);

				for (var j = 0; j < aData[i].PhaseDetails.results.length; j++) {
					bMatchFound = false;
					for (var k = 0; k < cacheProvider.oUserProfile.aGloballySelectedPhasesGuids.length; k++) {
						if(aData[i].PhaseDetails.results[j].Guid === cacheProvider.oUserProfile.aGloballySelectedPhasesGuids[k]){
							bMatchFound = true;
							break;
						}
					}
					if(!bMatchFound){
						continue;
					}

					sName = "";
					sProjectAndPhase = "";
					if (aData[i].FirstName) {
						sName = aData[i].FirstName + " ";
					}
					if (aData[i].LastName) {
						sName = sName + aData[i].LastName;
					}

					sProjectAndPhase = $translate.use() === "en" ? aData[i].PhaseDetails.results[j].ProjectDetails.NameEN + ' - ' + aData[i].PhaseDetails.results[j].NameEN : aData[i].PhaseDetails.results[j].ProjectDetails.NameFR + ' - ' + aData[i].PhaseDetails.results[j].NameFR;
					if (!sProjectAndPhase) {
						sProjectAndPhase = aData[i].PhaseDetails.results[j].ProjectDetails.NameEN + ' - ' + aData[i].PhaseDetails.results[j].NameEN;
					}
					oContactsListData.aData.push({
						sName: sName,
						sTitle: aData[i].Title,
						sPhone: aData[i].MobilePhone,
						sEmail: aData[i].Email,
						_guid: aData[i].Guid,
						sContactType: sProjectAndPhase,
						_accountGuid: aData[i].AccountGuid,
						sAccountName: aData[i].AccountDetails.Name,
					});
				}
			}

			$scope.tableParams.reload();
		};

		var loadContacts = function() {
			oContactsListData.aData = [];
			if (sAccountGuid) {
				apiProvider.getContactsForAccount({
					bShowSpinner: true,
					onSuccess: onContactsLoaded,
					sAccountGuid: sAccountGuid
				});
			} else {
				apiProvider.getContacts({
					bShowSpinner: true,
					onSuccess: onContactsLoaded,
				});
			}

		};

		loadContacts();

		$scope.onDisplay = function(oContact) {
			if (!sAccountGuid) {
				sAccountGuid = oContact._accountGuid;
			}
			$state.go('app.contactDetailsWrapper.contactDetails', {
				sMode: "display",
				sAccountGuid: sAccountGuid,
				sContactGuid: oContact._guid,
			});
		};

		$scope.onEdit = function(oContact) {
			if (!sAccountGuid) {
				sAccountGuid = oContact._accountGuid;
			}
			$state.go('app.contactDetailsWrapper.contactDetails', {
				sMode: "edit",
				sAccountGuid: sAccountGuid,
				sContactGuid: oContact._guid,
			});
		};

		$scope.onAddNew = function() {
			$state.go('app.contactDetailsWrapper.contactDetails', {
				sMode: "create",
				sAccountGuid: sAccountGuid,
				sContactGuid: "",
			});
		};

		$scope.$on('globalUserPhasesHaveBeenChanged', function(oParameters) {
			loadContacts();
		});		

		$scope.$on('contactsShouldBeRefreshed', function(oParameters) {
			loadContacts();
		});		

		$scope.$on("$destroy", function() {
			if ($scope.sCurrentStateName !== "app.contractorDetailsWrapper.contractorDetails" && $scope.sCurrentStateName !== "app.clientDetailsWrapper.clientDetails") {//don't save in history if contact list is weathin the contractor/client details view...  
				historyProvider.addStateToHistory({
					sStateName: $scope.sCurrentStateName,
					oStateParams: $scope.oStateParams
				});
			}
		});
	}
]);