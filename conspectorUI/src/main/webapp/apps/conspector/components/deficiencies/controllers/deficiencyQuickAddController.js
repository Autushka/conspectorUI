viewControllers.controller('deficiencyQuickAddView', ['$rootScope', '$scope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS', 'historyProvider', 'rolesSettings', '$timeout', '$mdSidenav',
	function($rootScope, $scope, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS, historyProvider, rolesSettings, $timeout, $mdSidenav) {
		var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
		var bCanContinue = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: sCurrentRole,
			sEntityName: "oDeficiency",
			sOperation: "bCreate"
		});

		if (!bCanContinue) {
			servicesProvider.logOut(); //cancel login in case of 0 roles assigned to the user
			utilsProvider.displayMessage({
				sText: $translate.instant('global_noRightToCreateDeficiencies'),
				sType: "error"
			});
		}

		$scope.onLogOut = function() {
			servicesProvider.logOut();
		};

		$scope.aProjectsWithPhases = [];
		var bPhaseWasSelected = false;

		$scope.aDeficiencyAttributes = [];
		$scope.aDeficiencyAttributes.push({
			sDescription: "Phase",
			sValue: "Not specifies..."
		});
		$scope.aDeficiencyAttributes.push({
			sDescription: "Unit",
			sValue: "Not specifies..."
		});
		$scope.aDeficiencyAttributes.push({
			sDescription: "Status",
			sValue: "Not specifies..."
		});

		$scope.onOpenSideNav = function(oAttribute) {
			if (oAttribute.sDescription === "Phase") {
				$scope.sSideNavHeader = "Phases";
			}
			var oSideNav = $mdSidenav('deficiencyQuickAddRigthSideNav').toggle();

			oSideNav.then(function() {
				switch ($scope.sSideNavHeader) {
					case "Phases":
						var aPhases = [];
						if (!$scope.aProjectsWithPhases.length) {
							var aProjectsWithPhases = servicesProvider.constructUserProjectsPhases();
							for (var i = 0; i < aProjectsWithPhases.length; i++) {
								var aPhases = [];
								if (aProjectsWithPhases[i].NameFR && $translate.use() === "fr") {
									aProjectsWithPhases[i].sDescription = aProjectsWithPhases[i].NameFR;
								} else {
									aProjectsWithPhases[i].sDescription = aProjectsWithPhases[i].NameEN;
								}
								for (var j = 0; j < aProjectsWithPhases[i].PhaseDetails.results.length; j++) {
									if (aProjectsWithPhases[i].PhaseDetails.results[j].NameFR && $translate.use() === "fr") {
										aProjectsWithPhases[i].PhaseDetails.results[j].sDescription = aProjectsWithPhases[i].PhaseDetails.results[j].NameFR;
									} else {
										aProjectsWithPhases[i].PhaseDetails.results[j].sDescription = aProjectsWithPhases[i].PhaseDetails.results[j].NameEN;
									}

									aPhases.push({
										sPhaseName: aProjectsWithPhases[i].PhaseDetails.results[j].sDescription,
										Guid: aProjectsWithPhases[i].PhaseDetails.results[j].Guid,
										bTicked: false,
									});
								}
								$scope.aProjectsWithPhases.push({
									sProjectName: aProjectsWithPhases[i].sDescription,
									aPhases: aPhases
								});
							}
							break;
						}
				}
			});
		};

		$scope.onCloseRightSideNav = function() {
			var oSvc = $mdSidenav('deficiencyQuickAddRigthSideNav').close();
			oSvc.then(function() {
				switch ($scope.sSideNavHeader) {
					case "Phases":
						if(bPhaseWasSelected){
							$scope.aDeficiencyAttributes[0].sValue = "";
							for (var i = 0; i < $scope.aProjectsWithPhases.length; i++) {
								for (var j = 0; j < $scope.aProjectsWithPhases[i].aPhases.length; j++) {
									if ($scope.aProjectsWithPhases[i].aPhases[j].bTicked) {
										$scope.aDeficiencyAttributes[0].sValue = $scope.aDeficiencyAttributes[0].sValue + $scope.aProjectsWithPhases[i].sProjectName + " - " + $scope.aProjectsWithPhases[i].aPhases[j].sPhaseName;
										break;
									}
								}
							}
							break;							
						}
				}
			});
		};

		$scope.onSelectPhase = function(oPhase) {
			bPhaseWasSelected = true;
			if (!oPhase.bTicked) {
				for (var i = 0; i < $scope.aProjectsWithPhases.length; i++) {
					for (var j = 0; j < $scope.aProjectsWithPhases[i].aPhases.length; j++) {
						$scope.aProjectsWithPhases[i].aPhases[j].bTicked = false;
					}
				}
				oPhase.bTicked = true;
			}
		};

		$scope.onSave = function() {
			var onSuccessCreation = function() {
				alert("yo");
			};

			var oDataForSave = {};
			for (var i = 0; i < $scope.aProjectsWithPhases.length; i++) {
				for (var j = 0; j < $scope.aProjectsWithPhases[i].aPhases.length; j++) {
					if ($scope.aProjectsWithPhases[i].aPhases[j].bTicked) {
						oDataForSave.PhaseGuid = $scope.aProjectsWithPhases[i].aPhases[j].Guid;
						break;
					}
				}
			}			

			apiProvider.createDeficiency({
				bShowSpinner: true,
				//aLinks: aLinks,
				oData: oDataForSave,
				bShowSuccessMessage: true,
				bShowErrorMessage: true,
				onSuccess: onSuccessCreation,
			});
		};

	}
]);