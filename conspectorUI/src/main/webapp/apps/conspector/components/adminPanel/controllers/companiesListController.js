viewControllers.controller('companiesListView', ['$scope', '$state', 'servicesProvider', 'ngTableParams', '$filter', 'apiProvider', '$translate', 'CONSTANTS', 'cacheProvider', 'dataProvider',
	function($scope, $state, servicesProvider, ngTableParams, $filter, apiProvider, $translate, CONSTANTS, cacheProvider, dataProvider) {
		
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

		var createDefaultRoleForNewCompany = function(sCompanyName) {
			var oRole = {};
			var sCurrentUserName = cacheProvider.oUserProfile.sUserName;
			oRole.RoleName = CONSTANTS.sDefaultRoleNameForNewCompany;
			oRole.CompanyName = sCompanyName;

			var onSuccess = function(oData) {
				var aLinks = [{
					sRelationName: "RoleDetails",
					aUri: ["Roles('" + oData.Guid + "')"]
				}];

				dataProvider.createLinks({
					aLinks: aLinks,
					sParentEntityWithKey: "Users('" + sCurrentUserName + "')",
				});

			};

			apiProvider.createRole({
				oData: oRole,
				onSuccess: onSuccess
			});
		};

		var assignNewCompanyToAdmin = function(sCompanyName) {
			var sCurrentUserName = cacheProvider.oUserProfile.sUserName;
			var aLinks = [{
				sRelationName: "CompanyDetails",
				aUri: ["Companys('" + sCompanyName + "')"]
			}];

			var onSuccess = function() {
				var sCurrentCompany = cacheProvider.oUserProfile.sCurrentCompany;
				var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
				cacheProvider.cleanEntitiesCache("oUserEntity");
				cacheProvider.oUserProfile = apiProvider.getUserProfile(sCurrentUserName);	//refresh user Profile after new company creation
				cacheProvider.oUserProfile.sCurrentCompany = sCurrentCompany;
				cacheProvider.oUserProfile.sCurrentRole = sCurrentRole;
			};

			dataProvider.createLinks({
				aLinks: aLinks,
				sParentEntityWithKey: "Users('" + sCurrentUserName + "')",
				onSuccess: onSuccess
			});
		};

		$scope.onSave = function(oCompany) {
			var oDataForSave = {
				GeneralAttributes: {}
			};
			var onSuccessCreation = function(oData) {
				oCompany._companyName = oData.CompanyName;
				oCompany._lastModifiedAt = oData.LastModifiedAt;
				oCompany._editMode = false;
				oCompany._createMode = false;

				createDefaultRoleForNewCompany(oData.CompanyName);
				assignNewCompanyToAdmin(oData.CompanyName);

			};
			var onSuccessUpdate = function(oData) {
				oCompany._editMode = false;
				oCompany._lastModifiedAt = oData.LastModifiedAt;
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