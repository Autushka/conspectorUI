viewControllers.controller('appView', ['$scope', '$rootScope', '$state', '$mdSidenav', '$window', 'servicesProvider', '$translate', 'cacheProvider', 'rolesSettings', '$cookieStore', 'historyProvider', 'apiProvider', 'utilsProvider', '$filter', '$timeout', 'CONSTANTS',
	function($scope, $rootScope, $state, $mdSidenav, $window, servicesProvider, $translate, cacheProvider, rolesSettings, $cookieStore, historyProvider, apiProvider, utilsProvider, $filter, $timeout, CONSTANTS) {
		
		var sCurrentUser = cacheProvider.oUserProfile.sUserName;
		var sCompany = cacheProvider.oUserProfile.sCurrentCompany;
		var aSelectedPhases = [];
        var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;

		$scope.sCurrentUser = sCurrentUser;

		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation (i.e. switch role/company views)	
		$rootScope.oStateParams = {}; // for backNavigation

		if (!sCurrentUser) {
			servicesProvider.logOut();
		}

		$scope.aDataForMassChanges = [];


		servicesProvider.constructLogoUrl();


		if ($cookieStore.get("globallySelectedPhasesGuids" + sCurrentUser + sCompany) && $cookieStore.get("globallySelectedPhasesGuids" + sCurrentUser + sCompany).aPhasesGuids) {
			aSelectedPhases = angular.copy($cookieStore.get("globallySelectedPhasesGuids" + sCurrentUser + sCompany).aPhasesGuids);

		} else {
			// aSelectedPhases = servicesProvider.getUserPhasesGuids();
			aSelectedPhases = [];
		}
		//Notifications
		var oNotificationsListData = {
            aData: []
        };
        var oTableStatusFromCache = cacheProvider.getTableStatusFromCache({
            sTableName: "notificationsList",
            sStateName: $rootScope.sCurrentStateName,
        });
        var oInitialSortingForNotificationsList = {
            _createdAt: 'desc'
        };
        //

		cacheProvider.oUserProfile.aGloballySelectedPhasesGuids = aSelectedPhases;
		$scope.globalSelectedPhases = aSelectedPhases;
		$scope.globalProjectsWithPhases = servicesProvider.constructUserProjectsPhasesForMultiSelect({
			aSelectedPhases: aSelectedPhases

		});

		$scope.onGlobalUserPhasesChanged = function() {
			var aSelectedPhases = [];
			aSelectedPhases = servicesProvider.getSeletedItemsKeysInMultiSelect({
				sKey: "Guid",
				aData: $scope.globalProjectsWithPhases
			});

			$cookieStore.put("globallySelectedPhasesGuids" + sCurrentUser + sCompany, {
				aPhasesGuids: aSelectedPhases,
			});
			cacheProvider.oUserProfile.aGloballySelectedPhasesGuids = aSelectedPhases;
			$scope.globalSelectedPhases = aSelectedPhases;
			$scope.$broadcast('globalUserPhasesHaveBeenChanged');
		};

		if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
			sRole: sCurrentRole,
			sMenuItem: "bShowAdminPanel"
		})) {
			$scope.bDisplayAdminPanel = true;
		}

		if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
			sRole: sCurrentRole,
			sMenuItem: "bShowProfileSettings"
		})) {
			$scope.bDisplayProfileSettings = true;
		}

		if (cacheProvider.oUserProfile.aUserCompanies && cacheProvider.oUserProfile.aUserCompanies.length > 1) {
			$scope.bDisplaySwitchCompanies = true;
		}

		if (cacheProvider.oUserProfile.aUserRoles && cacheProvider.oUserProfile.aUserRoles.length > 1) {
			$scope.bDisplaySwitchRoles = true;
		}

		$scope.aTabs = [];

		if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
			sRole: sCurrentRole,
			sMenuItem: "bShowDeficiencies"
		})) {
			$scope.aTabs.push({
				sTitle: "app_deficienciesTab",
				sState: "app.deficienciesList"
			});
		}

		if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
			sRole: sCurrentRole,
			sMenuItem: "bShowUnits"
		})) {
			$scope.aTabs.push({
				sTitle: "app_unitsTab",
				sState: "app.unitsList"
			});
		}

		if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
			sRole: sCurrentRole,
			sMenuItem: "bShowContractors"
		})) {
			$scope.aTabs.push({
				sTitle: "app_contractorsTab",
				sState: "app.contractorsList"
			});
		}

		if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
			sRole: sCurrentRole,
			sMenuItem: "bShowClients"
		})) {
			$scope.aTabs.push({
				sTitle: "app_clientsTab",
				sState: "app.clientsList"
			});
		}

		if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
			sRole: sCurrentRole,
			sMenuItem: "bShowContacts"
		})) {
			$scope.aTabs.push({
				sTitle: "app_contactsTab",
				sState: "app.contactsList"
			});
		}

		if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
			sRole: sCurrentRole,
			sMenuItem: "bShowActivities"
		})) {
			$scope.aTabs.push({
				sTitle: "app_activitiesTab",
				sState: "app.activitiesList"
			});
		}

		$scope.onSwitchCompanies = function() {
			$state.go('companySelection');
		};

		$scope.onSwitchRoles = function() {
			$state.go('roleSelection');
		};

		$scope.onLogOut = function() {
			servicesProvider.logOut();
		};

		var getITabIndexForCurrentState = function(sState) {
			for (var i = 0; i < $scope.aTabs.length; i++) { // can't use static numbering due to hidden tabs scenario (for some user roles)
				if ($scope.aTabs[i].sState === sState) {
					return i;
				}
			};
		}

		var tabSelectionBasedOnHash = function() {
			if ($window.location.hash.indexOf("#/app/adminPanel") > -1 ||
				$window.location.hash.indexOf("#/app/profileSettings") > -1 ||
				$window.location.hash.indexOf("#/app/clientDetails") > -1 ||
				$window.location.hash.indexOf("#/app/contractorDetails") > -1 ||
				$window.location.hash.indexOf("#/app/contactDetails") > -1 ||
				$window.location.hash.indexOf("#/app/deficiencyDetails") > -1 ||
				$window.location.hash.indexOf("#/app/activityDetails") > -1 ||
				$window.location.hash.indexOf("#/app/unitDetails") > -1 ||
				$window.location.hash.indexOf("#/app/notificationsList") > -1) {
				$scope.selectedTabIndex = -1;
				$scope.$broadcast("$mdTabsPaginationChanged");
				return;
			}

			if ($window.location.hash.indexOf("deficienc") > -1) {
				$scope.selectedTabIndex = getITabIndexForCurrentState("app.deficienciesList");
				return;
			}

			if ($window.location.hash.indexOf("unit") > -1) {
				$scope.selectedTabIndex = getITabIndexForCurrentState("app.unitsList");
				return;
			}
			if ($window.location.hash.indexOf("contractor") > -1) {
				$scope.selectedTabIndex = getITabIndexForCurrentState("app.contractorsList");
				return;
			}
			if ($window.location.hash.indexOf("client") > -1) {
				$scope.selectedTabIndex = getITabIndexForCurrentState("app.clientsList");
				return;
			}
			if ($window.location.hash.indexOf("contact") > -1) {
				$scope.selectedTabIndex = getITabIndexForCurrentState("app.contactsList");
				return;
			}
			if ($window.location.hash.indexOf("activit") > -1) {
				$scope.selectedTabIndex = getITabIndexForCurrentState("app.activitiesList");
				return;
			}
		};

		$timeout(tabSelectionBasedOnHash, 100);

		$scope.onTabSelect = function(oTab) {
			var sCurrentSelectedTab = "";
			if ($window.location.hash.indexOf("deficienc") > -1) {
				sCurrentSelectedTab = "Deficiencies";
			}
			if ($window.location.hash.indexOf("unit") > -1) {
				sCurrentSelectedTab = "Units";
			}
			if ($window.location.hash.indexOf("contractor") > -1) {
				sCurrentSelectedTab = "Contractors";
			}
			if ($window.location.hash.indexOf("client") > -1) {
				sCurrentSelectedTab = "Clients";
			}
			if ($window.location.hash.indexOf("contact") > -1) {
				sCurrentSelectedTab = "Contacts";
			}
			if ($window.location.hash.indexOf("activit") > -1) {
				sCurrentSelectedTab = "Activities";
			}

			if ($scope.selectedTabIndex !== undefined) { //($window.location.hash !== oTab.sHash && $scope.selectedTabIndex !== undefined) {
				$state.go(oTab.sState);
			}
		};

		//Notifications logic
		if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oSorting, {})) {
            oInitialSortingForNotificationsList = angular.copy(oTableStatusFromCache.oSorting);
        }
        var oInitialFilterForNotificationsList = {};
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oFilter, {})) {
            oInitialFilterForNotificationsList = angular.copy(oTableStatusFromCache.oFilter);
        }
        var oInitialGroupsSettingsForNotificationsList = [];
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.aGroups, [])) {
            oInitialGroupsSettingsForNotificationsList = angular.copy(oTableStatusFromCache.aGroups);
        }
        $scope.tableParams = servicesProvider.createNgTable({
            oInitialDataArrayWrapper: oNotificationsListData,
            sDisplayedDataArrayName: "aDisplayedNotification",
            oInitialSorting: oInitialSortingForNotificationsList,
            oInitialFilter: oInitialFilterForNotificationsList,
            aInitialGroupsSettings: oInitialGroupsSettingsForNotificationsList,
            sGroupBy: "sProjectPhase",
            sGroupsSortingAttribue: "_sortingSequence" //for default groups sorting
        });

        var onNotificationsLoaded = function(aData) {
            var sProjectName = "";
            var sPhaseName = "";
            var dCurrentDate = new Date();
            var sProjectPhase = "";
            var bMatchFound = false;
            var iSortingSequence = 0;
            var sAuthor = "";
            var sAvatarUrl = "";
            // var sStatusSortingSequence = "";
            // var sStatuseIconUrl = "";
            // var sStatuseIconGuid = "";
            var sStatusDescription = "";


            oNotificationsListData.aData = [];

            for (var i = 0; i < aData.length; i++) {
                sProjectName = "";
                sPhaseName = "";
                sProjectPhase = "";
                iSortingSequence = 0;
                sStatus = "";
                sAuthor = "";
                sAvatarUrl = "";

                bMatchFound = false;

                if (aData[i].PhaseDetails) {
                    iSortingSequence = aData[i].PhaseDetails.GeneralAttributes.SortingSequence;
                    sProjectName = $translate.use() === "en" ? aData[i].PhaseDetails.ProjectDetails.NameEN : aData[i].PhaseDetails.ProjectDetails.NameFR;
                    if (!sProjectName) {
                        sProjectName = aData[i].PhaseDetails.ProjectDetails.NameEN;
                    }
                    sPhaseName = $translate.use() === "en" ? aData[i].PhaseDetails.NameEN : aData[i].PhaseDetails.NameFR;
                    if (!sPhaseName) {
                        sPhaseName = aData[i].PhaseDetails.NameEN;
                    }

                    sProjectPhase = sProjectName + " - " + sPhaseName;
                } else {
                    sProjectPhase = "Not Assigned";
                }

                switch (aData[i].OperationNameFR) {
                    case "Une nouvelle d??ficience a ??t?? ajout??e":
                        aData[i].OperationNameFR = CONSTANTS.newDeficiencyFR;
                        break;
                    case "Une d??ficience a ??t?? modifi??e":
                        aData[i].OperationNameFR = CONSTANTS.updatedDeficiencyFR;
                        break;
                    case "Un commentaire a ??t?? ajout??":
                        aData[i].OperationNameFR = CONSTANTS.newCommentFR;
                        break;
                    case "Un ficher a ??t?? ajout??":
                        aData[i].OperationNameFR = CONSTANTS.newAttachmentFR;
                        break;

                    case "Une nouvelle d??ficience a ??t?? ajout??e (mobile)":
                        aData[i].OperationNameFR = CONSTANTS.newDeficiencyFR + " (mobile)";
                        break;
                    case "Une d??ficience a ??t?? modifi??e (mobile)":
                        aData[i].OperationNameFR = CONSTANTS.updatedDeficiencyFR + " (mobile)";
                        break;
                    case "Un commentaire a ??t?? ajout?? (mobile)":
                        aData[i].OperationNameFR = CONSTANTS.newCommentFR + " (mobile)";
                        break;
                    case "Un ficher a ??t?? ajout?? (mobile)":
                        aData[i].OperationNameFR = CONSTANTS.newAttachmentFR + " (mobile)";
                        break;
                }

                sOperationName = $translate.use() === "en" ? aData[i].OperationNameEN : aData[i].OperationNameFR;

                if (aData[i].ContactDetails) {
                    if (aData[i].ContactDetails.FirstName) {
                        sAuthor = aData[i].ContactDetails.FirstName + " ";
                    }
                    if (aData[i].ContactDetails.LastName) {
                        sAuthor = sAuthor + aData[i].ContactDetails.LastName;
                    }
                }
                var MD5 = new Hashes.MD5;
                if (aData[i].ContactDetails && aData[i].ContactDetails.UserDetails && aData[i].ContactDetails.UserDetails.results[0]) {
                    var sUserEmailHash = MD5.hex(aData[i].ContactDetails.UserDetails.results[0].EMail);
                } else {
                    var sUserEmailHash = MD5.hex("deficien@cyDetails.com");
                }
                sAvatarUrl = "http://www.gravatar.com/avatar/" + sUserEmailHash + ".png?d=identicon&s=60";

                oNotificationsListData.aData.push({
                    _guid: aData[i].Guid,
                    sProjectPhase: sProjectPhase,
                    sStatus: aData[i].Status,
                    sEntityName: aData[i].EntityName,
                    _entityGuid: aData[i].EntityGuid,
                    sOperationName: sOperationName,
                    _sortingSequence: iSortingSequence,
                    _createdAt: aData[i].CreatedAt,
                    sCreatedAt: utilsProvider.dBDateToSting(aData[i].CreatedAt),
                    sCreatedBy: aData[i].GeneralAttributes.CreatedBy,
                    sAuthor: sAuthor,
                    sAvatarUrl: sAvatarUrl,
                });
            }
            $scope.tableParams.reload();
            $timeout(function() {
                if ($(".cnpAppView")[0]) {
                    $(".cnpAppView")[0].scrollTop = cacheProvider.getListViewScrollPosition("notificationsList");
                    cacheProvider.putListViewScrollPosition("notificationsList", 0);
                }
            }, 0);
        };

        var loadNotifications = function() {
            oNotificationsListData.aData = [];
            apiProvider.getOperationLogs({
                sExpand: "PhaseDetails/ProjectDetails,ContactDetails/UserDetails",
                sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and UserName eq '" + cacheProvider.oUserProfile.sUserName + "' and GeneralAttributes/IsDeleted eq false",
                bShowSpinner: true,
                onSuccess: onNotificationsLoaded
            });
        };
        

        $scope.onDisplay = function(oNotification, oEvent) {
            // cacheProvider.putListViewScrollPosition("notificationsList", $(".cnpAppView")[0].scrollTop); //saving scroll position...
            switch (oNotification.sEntityName) {
                case "deficiency":
                	$timeout($scope.toggleRightSidenav, 100);
                    $state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
                        sMode: "display",
                        sDeficiencyGuid: oNotification._entityGuid,
                    });

                    break;
            }

            apiProvider.updateOperationLog({
                sKey: oNotification._guid,
                oData: {
                    Status: 'read'
                },
            })
        };

        $scope.onClearFiltering = function() {
            $scope.tableParams.$params.filter = {};
            $scope.tableParams.reload();
        };

        $scope.$on('notificationsShouldBeRefreshed', function(oParameters) {
            cacheProvider.putListViewScrollPosition("notificationsList", $(".cnpAppView")[0].scrollTop); //saving scroll position...            
            loadNotifications();
        });

        $scope.onStatusChange = function(oNotification) {
            if (!$scope.bDisplayEditButtons) {
                return;
            }
            oNotification.sStatuseIconUrl = $window.location.origin + $window.location.pathname + "rest/file/v2/get/" + aTaskStatuses[(oNotification.sStatusSortingSequence + 1) % aTaskStatuses.length].AssociatedIconFileGuid;

            $scope.aDataForMassChanges.push({
                Guid: oNotification._guid,
                TaskStatusGuid: aTaskStatuses[(oNotification.sStatusSortingSequence + 1) % aTaskStatuses.length].Guid,
            });
            oNotification.sStatusSortingSequence = (oNotification.sStatusSortingSequence + 1) % aTaskStatuses.length;
            //alert(oNotification._guid);
            oNotification._guid = "!!!";
        };

        $scope.onMassSave = function() {
            cacheProvider.putListViewScrollPosition("notificationsList", $(".cnpAppView")[0].scrollTop); //saving scroll position...
            var onSuccess = function() {
                $scope.aDataForMassChanges = [];
                loadNotifications();
            };

            apiProvider.updateNotifications({
                aData: $scope.aDataForMassChanges,
                bShowSpinner: true,
                bShowSuccessMessage: true,
                bShowErrorMessage: true,
                onSuccess: onSuccess
            });
        };

        $scope.onMarkAllAsRead = function() {
            var onSuccess = function() {
                loadNotifications();
            };
            var aData = [];
            for (var i = 0; i < $scope.tableParams.data.length; i++) {
                for (var j = 0; j < $scope.tableParams.data[i].data.length; j++) {
                    if ($scope.tableParams.data[i].data[j].sStatus === "not read") {
                        aData.push({
                            Guid: $scope.tableParams.data[i].data[j]._guid,
                            Status: "read",
                        });
                    }
                }
            }

            if (!aData.length) {
                return;
            }
            apiProvider.updateOperationLogs({
                aData: aData,
                onSuccess: onSuccess,
                //bShowSuccessMessage: true,
                //bShowErrorMessage: true,
            });
        };

        $scope.onDismissAll = function() {
            var onSuccess = function() {
                loadNotifications();
            };
            var aData = [];
            for (var i = 0; i < $scope.tableParams.data.length; i++) {
                for (var j = 0; j < $scope.tableParams.data[i].data.length; j++) {
                    aData.push({
                        Guid: $scope.tableParams.data[i].data[j]._guid,
                    });
                }
            }

            if (!aData.length) {
                return;
            }
            apiProvider.deleteOperationLogs({
                aData: aData,
                onSuccess: onSuccess,
                //bShowSuccessMessage: true,
                //bShowErrorMessage: true,
            });

        };

		//

		$scope.onAdminPanel = function() {
			$scope.selectedTabIndex = -1;
			$scope.$broadcast("$mdTabsPaginationChanged");
			$state.go('app.adminPanel.usersList');
		};

		$scope.onProfileSettings = function() {
			$scope.selectedTabIndex = -1;
			$scope.$broadcast("$mdTabsPaginationChanged");
			$state.go('app.profileSettings.profileDetails');
		};

		$scope.toggleRightSidenav = function() {
			loadNotifications();
			$timeout($mdSidenav('globalRight').toggle,200);
			// $mdSidenav('globalRight').toggle();
		};

		$scope.toggleLeftSidenav = function() {
			$mdSidenav('globalLeft').toggle();
		};

		$scope.hoverIn = function() {
			$scope.bDisplayUserDropdownMenu = true;
		}; 

		$scope.hoverOut = function() {
			$scope.bDisplayUserDropdownMenu = false;
		};

		$scope.onNotificationsList = function() {
			$scope.selectedTabIndex = -1;
			$scope.$broadcast("$mdTabsPaginationChanged");
			$state.go('app.notificationsList');
		};

		$scope.onChangeLanguage = function() {
			servicesProvider.changeLanguage();
		};

		$scope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
			$timeout(tabSelectionBasedOnHash, 100);
		});

		$scope.$on("$destroy", function() {
			historyProvider.addStateToHistory({
				sStateName: $rootScope.sCurrentStateName,
				oStateParams: $rootScope.oStateParams
			});
		});
	}
]);