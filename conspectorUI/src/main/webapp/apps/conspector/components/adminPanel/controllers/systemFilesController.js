viewControllers.controller('systemFilesView', ['$scope', '$rootScope','$state', 'servicesProvider', 'ngTableParams', '$filter', 'apiProvider', '$translate', '$upload', '$window', 'cacheProvider', 'historyProvider',
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


		var onImgsLoaded = function(aData, aAppendTo, oTableToReload) {
			for (var i = 0; i < aData.length; i++) {
				var oImg = {};
				oImg.sUrl = $window.location.origin + $window.location.pathname + "rest/file/get/" + aData[i].guid;
				oImg._createMode = false;
				oImg._editMode = false;
				oImg._guid = aData[i].guid;
				aAppendTo.push(oImg);
			}
			oTableToReload.reload();
		};

		var onAddNewImg = function(aAppendTo, oTableToReload) {
			var oImg = {};
			oImg._createMode = true;
			oImg._editMode = true;
			aAppendTo.push(oImg);
			oTableToReload.reload();
		};

		$scope.onEditImg = function(oImg) {
			oImg._editMode = true;
		};

		var onDeleteImg = function(aRemoveFrom, oTableToReload, oImg, iIndex) {
			if (oImg._guid) {
				servicesProvider.deleteFileAttachment(oImg._guid);
			}

			aRemoveFrom.splice(iIndex, 1);
			oTableToReload.reload();
		};

		var onCancelImg = function(aRemoveFrom, oTableToReload, oImg, iIndex) {
			if (!oImg._guid) {
				onDeleteImg(aRemoveFrom, oTableToReload, oImg, iIndex);
			}
			oImg._editMode = false;
			oImg._createMode = false;
		};

		var onImgSelected = function(aImgFiles, sPath, aUpdateAt, $event, iIndex) {
			for (var i = 0; i < aImgFiles.length; i++) {
				var file = aImgFiles[i];
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
					aUpdateAt[iIndex].sUrl = $window.location.origin + $window.location.pathname + "rest/file/get/" + sData;
					aUpdateAt[iIndex]._guid = sData;
				});
			}
		};		

		onLogoImgsLoaded = function(aData) {
			onImgsLoaded(aData, oLogosListData.aData, $scope.logosTableParams)
		};

		onDeficienciesStatusesImgsLoaded = function(aData) {
			onImgsLoaded(aData, oDeficiencyStatusesListData.aData, $scope.deficiencyStatusesTableParams)
		};		

		onActivitiesTypesImgsLoaded = function(aData) {
			onImgsLoaded(aData, oActivityTypesListData.aData, $scope.activityTypesTableParams)
		};

		apiProvider.getAttachments({
			sPath: "rest/file/list/companyDependentSettings/" + cacheProvider.oUserProfile.sCurrentCompany + "/_logo_",
			onSuccess: onLogoImgsLoaded
		});

		apiProvider.getAttachments({
			sPath: "rest/file/list/companyDependentSettings/" + cacheProvider.oUserProfile.sCurrentCompany + "/_deficiencyStatuses_", 
			onSuccess: onDeficienciesStatusesImgsLoaded
		});		

		apiProvider.getAttachments({
			sPath: "rest/file/list/companyDependentSettings/" + cacheProvider.oUserProfile.sCurrentCompany + "/_activityTypes_", 
			onSuccess: onActivitiesTypesImgsLoaded
		});	

		$scope.onAddNewLogo = function() {
			onAddNewImg(oLogosListData.aData, $scope.logosTableParams);
		};

		$scope.onDeleteLogo = function(oLogo, iIndex) {
			onDeleteImg(oLogosListData.aData, $scope.logosTableParams, oLogo, iIndex);
		};

		$scope.onCancelLogo = function(oLogo, iIndex) {
			onCancelImg(oLogosListData.aData, $scope.logosTableParams, oLogo, iIndex);
		};

		$scope.onLogoSelected = function(aFiles, $event, iIndex) {
			onImgSelected(aFiles, "rest/file/createUploadUrl/companyDependentSettings/" + cacheProvider.oUserProfile.sCurrentCompany + "/_logo_", oLogosListData.aData,  $event, iIndex);
		};

		$scope.onAddNewDeficiencyStatus = function() {
			onAddNewImg(oDeficiencyStatusesListData.aData, $scope.deficiencyStatusesTableParams);
		};

		$scope.onDeleteDeficiencyStatus = function(oLogo, iIndex) {
			onDeleteImg(oDeficiencyStatusesListData.aData, $scope.deficiencyStatusesTableParams, oLogo, iIndex);
		};

		$scope.onCancelDeficiencyStatus = function(oLogo, iIndex) {
			onCancelImg(oDeficiencyStatusesListData.aData, $scope.deficiencyStatusesTableParams, oLogo, iIndex);
		};

		$scope.onDeficiencyStatusSelected = function(aFiles, $event, iIndex) {
			onImgSelected(aFiles, "rest/file/createUploadUrl/companyDependentSettings/" + cacheProvider.oUserProfile.sCurrentCompany + "/_deficiencyStatuses_", oDeficiencyStatusesListData.aData,  $event, iIndex);
		};

		$scope.onAddNewActivityType = function() {
			onAddNewImg(oActivityTypesListData.aData, $scope.activityTypesTableParams);
		};

		$scope.onDeleteActivityType = function(oLogo, iIndex) {
			onDeleteImg(oActivityTypesListData.aData, $scope.activityTypesTableParams, oLogo, iIndex);
		};

		$scope.onCancelActivityType = function(oLogo, iIndex) {
			onCancelImg(oActivityTypesListData.aData, $scope.activityTypesTableParams, oLogo, iIndex);
		};

		$scope.onActivityTypeSelected = function(aFiles, $event, iIndex) {
			onImgSelected(aFiles, "rest/file/createUploadUrl/companyDependentSettings/" + cacheProvider.oUserProfile.sCurrentCompany + "/_activityTypes_", oActivityTypesListData.aData,  $event, iIndex);
		};			
	}
]);