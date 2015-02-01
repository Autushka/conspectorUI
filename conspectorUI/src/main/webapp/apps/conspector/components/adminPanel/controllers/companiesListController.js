viewControllers.controller('companiesListView', ['$scope', '$rootScope', '$state', 'servicesProvider', 'ngTableParams', '$filter', 'apiProvider', '$translate', 'CONSTANTS', 'cacheProvider', 'dataProvider', 'historyProvider',
	function($scope, $rootScope, $state, servicesProvider, ngTableParams, $filter, apiProvider, $translate, CONSTANTS, cacheProvider, dataProvider, historyProvider) {
		historyProvider.removeHistory(); // because current view doesn't have a back button

		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$rootScope.oStateParams = {}; // for backNavigation		


		var oCompaniesListData = {
			aData: []
		};

		var iNewItemsCounter = 0; //used to identify list item for new item deletion after sorting/filtering

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oCompaniesListData,
			sDisplayedDataArrayName: "aDisplayedCompanies",
			oInitialSorting: {
				sortingSequence: 'asc'
			}
		});

		var onCompaniesLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				oCompaniesListData.aData.push({
					_editMode: false, //symbol _ here meens that this attribute is not displayed in the table and is used for the logic only
					_companyName: aData[i].CompanyName,
					_lastModifiedAt: aData[i].LastModifiedAt,
					companyName: aData[i].CompanyName,
					descriptionEN: aData[i].DescriptionEN,
					descriptionFR: aData[i].DescriptionFR,
					sortingSequence: aData[i].GeneralAttributes.SortingSequence,
				});
			}
			$scope.tableParams.reload();
		}

		apiProvider.getCompanies({
			bShowSpinner: true,
			onSuccess: onCompaniesLoaded
		});

		$scope.onAddNew = function() {
			oCompaniesListData.aData.push({
				_createMode: true,
				_editMode: true,
				sortingSequence: 0,
				descriptionEN: "",
				descriptionFR: "",
				_counter: iNewItemsCounter

			});
			iNewItemsCounter++;
			$scope.tableParams.reload();
		};

		$scope.onEdit = function(oCompany) {
			oCompany._editMode = true;
		};

		$scope.onDelete = function(oCompany, iIndex) {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				for (var i = 0; i < oCompaniesListData.aData.length; i++) {
					if (oCompaniesListData.aData[i]._companyName === oCompany._companyName) {
						oCompaniesListData.aData.splice(i, 1);
						break;
					}
				}
				$scope.tableParams.reload();
			}

			if (oCompany._companyName) {
				oDataForSave.CompanyName = oCompany._companyName;
				oDataForSave.LastModifiedAt = oCompany._lastModifiedAt;
				apiProvider.updateCompany({
					bShowSpinner: true,
					sKey: oDataForSave.CompanyName,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessDelete
				});
			} else {
				for (var i = 0; i < oCompaniesListData.aData.length; i++) {
					if (oCompaniesListData.aData[i]._counter === oCompany._counter) {
						oCompaniesListData.aData.splice(i, 1);
						$scope.tableParams.reload();
						break;
					}
				}
			}
		};

		$scope.onSave = function(oCompany) {
			var oDataForSave = {
				GeneralAttributes: {}
			};
			var onSuccessCreation = function(aData) {
				oCompany._companyName = aData[0].__changeResponses[0].data.CompanyName;
				oCompany._lastModifiedAt = aData[0].__changeResponses[0].data.LastModifiedAt;
				oCompany._editMode = false;
				oCompany._createMode = false;

				servicesProvider.refreshUserProfile();
			};
			var onSuccessUpdate = function(oData) {
				oCompany._editMode = false;
				oCompany._lastModifiedAt = oData.LastModifiedAt;

				servicesProvider.refreshUserProfile();
			};

			oDataForSave.DescriptionEN = oCompany.descriptionEN;
			oDataForSave.DescriptionFR = oCompany.descriptionFR;
			oDataForSave.GeneralAttributes.SortingSequence = oCompany.sortingSequence;
			oDataForSave.LastModifiedAt = oCompany._lastModifiedAt;

			if (oCompany._companyName) {
				oDataForSave.CompanyName = oCompany._companyName;
				apiProvider.updateCompany({
					bShowSpinner: true,
					sKey: oDataForSave.CompanyName,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessUpdate
				});
			} else {
				oDataForSave.CompanyName = oCompany.companyName;
				apiProvider.createCompany({
					bShowSpinner: true,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessCreation
				});
			}
		};
	}
]);