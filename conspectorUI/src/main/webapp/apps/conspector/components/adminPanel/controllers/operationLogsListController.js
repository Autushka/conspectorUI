viewControllers.controller('operationLogsListView', ['$scope', '$state', 'servicesProvider', 'ngTableParams', '$filter', 'apiProvider', '$translate', 'utilsProvider',
	function($scope, $state, servicesProvider, ngTableParams, $filter, apiProvider, $translate, utilsProvider) {
		$scope.operationNameTE = $translate.instant('operationLogsList_operationName');
		$scope.operationContentTE = $translate.instant('operationLogsList_operationContent');
		$scope.createdByTE = $translate.instant('global_createdBy');
		$scope.createdAtTE = $translate.instant('global_createdAt');

		var oOperationLogsListData = {
			aData: []
		};

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oOperationLogsListData,
			sDisplayedDataArrayName: "aDisplayedOperationLogs",
			oInitialSorting: {
				createdAt: 'desc'
			}
		});

		var onOperationLogsLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				var oOperation = {};
				oOperation.operationName = aData[i].OperationName;
				oOperation.createdBy = aData[i].GeneralAttributes.CreatedBy;
				oOperation.createdAt = utilsProvider.dBDateToSting(aData[i].CreatedAt);
				if(aData[i].OperationName === "login_success" || "log_out"){
					oOperation.operationContent = $translate.instant('global_role') + ": " + utilsProvider.stringToJson(aData[i].OperationContent).sRole;
				}	

				oOperationLogsListData.aData.push(oOperation);		

			//	if (!aData[i].GeneralAttributes.IsDeleted) {
					// oOperationLogsListData.aData.push({
					// 	operationName: aData[i].OperationName,
					// 	operationContent: "",
					// 	createdBy: aData[i].GeneralAttributes.CreatedBy,
					// 	createdAt: utilsProvider.dBDateToSting(aData[i].CreatedAt) //aData[i].CreatedAt
					// });
			//	}


			}
			$scope.tableParams.reload();
		}

		apiProvider.getOperationLogs({
			sPath: "OperationLogs",
			bShowSpinner: true,
			onSuccess: onOperationLogsLoaded
		});
	}
]);