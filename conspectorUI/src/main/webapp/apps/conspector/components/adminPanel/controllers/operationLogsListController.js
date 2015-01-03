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
			var oOperation = {};
			var oOperationContent = {};
			for (var i = 0; i < aData.length; i++) {
				oOperation = {};
				oOperationContent = {};
				oOperation.operationName = aData[i].OperationName;
				oOperation.createdBy = aData[i].GeneralAttributes.CreatedBy;
				oOperation.createdAt = utilsProvider.dBDateToSting(aData[i].CreatedAt);
				if (aData[i].OperationName === "login_success" || "log_out") {
					oOperationContent = utilsProvider.stringToJson(aData[i].OperationContent);
					oOperation.operationContent = $translate.instant('global_role') + ": " + oOperationContent.sRole + ", ";
					oOperation.operationContent = oOperation.operationContent + $translate.instant('global_company') + ": " + oOperationContent.sCompany;
				}

				oOperationLogsListData.aData.push(oOperation);
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