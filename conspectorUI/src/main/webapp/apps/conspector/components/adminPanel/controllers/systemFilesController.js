viewControllers.controller('systemFilesView', ['$scope', '$rootScope', '$state', 'servicesProvider', 'ngTableParams', '$filter', 'apiProvider', '$translate', '$upload', '$window', 'cacheProvider', 'historyProvider',
	function($scope, $rootScope, $state, servicesProvider, ngTableParams, $filter, apiProvider, $translate, $upload, $window, cacheProvider, historyProvider) {
		historyProvider.removeHistory(); // because current view doesn't have a back button				
		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$rootScope.oStateParams = {}; // for backNavigation			
		var oLogosListData = {
			aData: []
		};
		var oDeficiencyStatusesListData = {
			aData: []
		};
		var oActivityTypesListData = {
			aData: []
		};

		var oReportsTemplatesListData = {
			aData: []
		};

		$scope.logosTableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oLogosListData,
			sDisplayedDataArrayName: "aDisplayedLogos",
		});

		$scope.deficiencyStatusesTableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oDeficiencyStatusesListData,
			sDisplayedDataArrayName: "aDisplayedDeficiencyStatuses",
		});

		$scope.activityTypesTableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oActivityTypesListData,
			sDisplayedDataArrayName: "aDisplayedActivityTypes",
		});

		$scope.reportsTemplatesTableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oReportsTemplatesListData,
			sDisplayedDataArrayName: "aDisplayedReportsTemplates",
		});

		var onFilesLoaded = function(aData, aAppendTo, oTableToReload) {
			for (var i = 0; i < aData.length; i++) {
				var oFile = {};
				oFile.sUrl = $window.location.origin + $window.location.pathname + "rest/file/V2/get/" + aData[i].guid;
				oFile.sDescriptionEN = aData[i].descriptionEN;
				oFile.sDescriptionFR = aData[i].descriptionFR;
				oFile._createMode = false;
				oFile._editMode = false;
				oFile._guid = aData[i].guid;
				aAppendTo.push(oFile);
			}
			oTableToReload.reload();
		};

		var onAddNewFile = function(aAppendTo, oTableToReload) {
			var oFile = {};
			oFile._createMode = true;
			oFile._editMode = false;
			aAppendTo.push(oFile);
			oTableToReload.reload();
		};

		$scope.onEdit = function(oItem) {
			oItem._editMode = true;
		};

		var onDeleteFile = function(aRemoveFrom, oTableToReload, oFile, iIndex) {
			if (oFile._guid) {
				servicesProvider.deleteFileAttachment(oFile._guid);
			}

			aRemoveFrom.splice(iIndex, 1);
			oTableToReload.reload();
		};

		var onSave = function(aRemoveFrom, oTableToReload, oFile, iIndex) {
			if (!oFile._guid) {
				onDeleteFile(aRemoveFrom, oTableToReload, oFile, iIndex);
			}
			oFile._editMode = false;
			oFile._createMode = false;
		};

		var onFileSelected = function(aFiles, sPath, aUpdateAt, $event, iIndex) {
			for (var i = 0; i < aFiles.length; i++) {
				var file = aFiles[i];
				var sPath = servicesProvider.costructUploadUrl({
					sPath: sPath
				});
				$scope.upload = $upload.upload({
					url: sPath,
					file: file,
				});
				$scope.upload.success(function(sData) {
					aUpdateAt[iIndex]._createMode = false;
					aUpdateAt[iIndex]._editMode = false;
					aUpdateAt[iIndex].sUrl = $window.location.origin + $window.location.pathname + "rest/file/V2/get/" + sData;
					aUpdateAt[iIndex]._guid = sData;
				});
			}
		};

		onLogoImgsLoaded = function(aData) {
			onFilesLoaded(aData, oLogosListData.aData, $scope.logosTableParams);
		};

		onDeficienciesStatusesImgsLoaded = function(aData) {
			onFilesLoaded(aData, oDeficiencyStatusesListData.aData, $scope.deficiencyStatusesTableParams);
		};

		onActivitiesTypesImgsLoaded = function(aData) {
			onFilesLoaded(aData, oActivityTypesListData.aData, $scope.activityTypesTableParams);
		};

		onReportsTemplatesLoaded = function(aData) {
			onFilesLoaded(aData, oReportsTemplatesListData.aData, $scope.reportsTemplatesTableParams);
		};

		apiProvider.getAttachments({
			sPath: "rest/file/V1/list/companyDependentSettings/" + cacheProvider.oUserProfile.sCurrentCompany + "/_logo_",
			onSuccess: onLogoImgsLoaded
		});

		apiProvider.getAttachments({
			sPath: "rest/file/V1/list/companyDependentSettings/" + cacheProvider.oUserProfile.sCurrentCompany + "/_deficiencyStatuses_",
			onSuccess: onDeficienciesStatusesImgsLoaded
		});

		apiProvider.getAttachments({
			sPath: "rest/file/V1/list/companyDependentSettings/" + cacheProvider.oUserProfile.sCurrentCompany + "/_activityTypes_",
			onSuccess: onActivitiesTypesImgsLoaded
		});

		apiProvider.getAttachments({
			sPath: "rest/file/V1/list/companyDependentSettings/" + cacheProvider.oUserProfile.sCurrentCompany + "/_reportsTemplates_",
			onSuccess: onReportsTemplatesLoaded
		});

		$scope.onAddNewLogo = function() {
			onAddNewFile(oLogosListData.aData, $scope.logosTableParams);
		};

		$scope.onDeleteLogo = function(oItem, iIndex) {
			onDeleteFile(oLogosListData.aData, $scope.logosTableParams, oItem, iIndex);
		};

		$scope.onSaveLogo = function(oItem, iIndex) {
			onSave(oLogosListData.aData, $scope.logosTableParams, oItem, iIndex);
		};

		$scope.onLogoSelected = function(aFiles, $event, iIndex) {
			onFileSelected(aFiles, "rest/file/V1/createUploadUrl/companyDependentSettings/" + cacheProvider.oUserProfile.sCurrentCompany + "/_logo_", oLogosListData.aData, $event, iIndex);
		};

		$scope.onAddNewDeficiencyStatus = function() {
			onAddNewFile(oDeficiencyStatusesListData.aData, $scope.deficiencyStatusesTableParams);
		};

		$scope.onDeleteDeficiencyStatus = function(oItem, iIndex) {
			onDeleteFile(oDeficiencyStatusesListData.aData, $scope.deficiencyStatusesTableParams, oItem, iIndex);
		};

		$scope.onSaveDeficiencyStatus = function(oItem, iIndex) {
			onSave(oDeficiencyStatusesListData.aData, $scope.deficiencyStatusesTableParams, oItem, iIndex);
		};

		$scope.onDeficiencyStatusSelected = function(aFiles, $event, iIndex) {
			onFileSelected(aFiles, "rest/file/V1/createUploadUrl/companyDependentSettings/" + cacheProvider.oUserProfile.sCurrentCompany + "/_deficiencyStatuses_", oDeficiencyStatusesListData.aData, $event, iIndex);
		};

		$scope.onAddNewActivityType = function() {
			onAddNewFile(oActivityTypesListData.aData, $scope.activityTypesTableParams);
		};

		$scope.onDeleteActivityType = function(oItem, iIndex) {
			onDeleteFile(oActivityTypesListData.aData, $scope.activityTypesTableParams, oItem, iIndex);
		};

		$scope.onSaveActivityType = function(oItem, iIndex) {
			onSave(oActivityTypesListData.aData, $scope.activityTypesTableParams, oItem, iIndex);
		};

		$scope.onActivityTypeSelected = function(aFiles, $event, iIndex) {
			onFileSelected(aFiles, "rest/file/V1/createUploadUrl/companyDependentSettings/" + cacheProvider.oUserProfile.sCurrentCompany + "/_activityTypes_", oActivityTypesListData.aData, $event, iIndex);
		};

		$scope.onAddNewReportTemplate = function() {
			onAddNewFile(oReportsTemplatesListData.aData, $scope.reportsTemplatesTableParams);
		};

		$scope.onDeleteReportTemplate = function(oItem, iIndex) {
			onDeleteFile(oReportsTemplatesListData.aData, $scope.reportsTemplatesTableParams, oItem, iIndex);
		};

		$scope.onSaveReportTemplate = function(oItem, iIndex) {
			onSave(oReportsTemplatesListData.aData, $scope.reportsTemplatesTableParams, oItem, iIndex);

			if (oItem._guid) {
				apiProvider.updateFileMetadata({
					sKey: oItem._guid,
					oData: {
						Guid: oItem._guid,
						DescriptionEN: oItem.sDescriptionEN,
						DescriptionFR: oItem.sDescriptionFR
					},
					bShowSpinner: true,
					bShowSuccessMessage: true,
					bShowErrorMessage: true
				});
			}
		};

		$scope.onReportTemplateSelected = function(aFiles, $event, iIndex) {
			onFileSelected(aFiles, "rest/file/V1/createUploadUrl/companyDependentSettings/" + cacheProvider.oUserProfile.sCurrentCompany + "/_reportsTemplates_", oReportsTemplatesListData.aData, $event, iIndex);
		};
	}
]);