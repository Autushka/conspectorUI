app.factory('rolesSettings', ['cacheProvider', 'utilsProvider', 'apiProvider', '$translate',
	function(cacheProvider, utilsProvider, apiProvider, $translate) {
		return {
			setCurrentRole: function(sCurrentRole) {
				if (!this[sCurrentRole] || !this[sCurrentRole].sInitialState) {
					utilsProvider.displayMessage({
						sText: $translate.instant('global_noDefaultViewForTheRole'),
						sType: "error"
					});
					return false;
				}

				cacheProvider.oUserProfile.sCurrentRole = sCurrentRole;
				cacheProvider.oUserProfile.oCurrentRoleSettings = angular.copy(this[sCurrentRole]);
				apiProvider.setCurrentRole(sCurrentRole); //current role is saved in the current session here
				return true;
			},

			getRolesInitialState: function(sRole) {
				return this[sRole].sInitialState;
			},

			getRolesMainMenuItemSettings: function(oParameters) {
				return this[oParameters.sRole].oMainMenu[oParameters.sMenuItem];
			},

			getRolesAdminPanelMenuItemSettings: function(oParameters) {
				return this[oParameters.sRole].oAdminPanelMenu[oParameters.sMenuItem];
			},

			getRolesSettingsForEntityAndOperation: function(oParameters) {
				return this[oParameters.sRole].oAuthorizationsPerEntity[oParameters.sEntityName][oParameters.sOperation];
			},

			getRolesProfileMenuItemSettings: function(oParameters) {
				return this[oParameters.sRole].oProfileMenu[oParameters.sMenuItem];
			},

			globalAdministrator: {
				sInitialState: "app.deficienciesList",
				bIsGlobalUserAdministrator: true,
				oMainMenu: {
					bShowDeficiencies: true,
					bShowUnits: true,
					bShowContractors: true,
					bShowClients: true,
					bShowContacts: true,
					bShowActivities: true,
					bShowAdminPanel: true,
					bShowProfileSettings: true
				},
				oAdminPanelMenu: {
					bShowCompaniesManagement: true,
					bShowUsersManagement: true,
					bShowRolesManagement: true,
					bShowProjectsManagement: true,
					bShowPhasesManagement: true,
					bShowDeficiencyStatusesManagement: true,
					bShowDeficiencyPrioritiesManagement: true,
					bShowSystemFilesManagement: true,
					bShowOperationLogs: true,
					bShowAccountTypesManagement: true,
					bShowContactTypesManagement: true,
					bShowUnitOptionSetManagement: true,
					bShowUnitOptionValueManagement: true,
					bShowTaskTypeManagement: true
				},
				oProfileMenu: {
					bShowContactDetails: true,
					bShowProfileDetails: true,
					bShowChangePassword: true
				},
				oAuthorizationsPerEntity: {
					oDeficiency: {
						bDisplay: true,
						bUpdate: true,
						bCreate: true,
						bDelete: true
					},
					oUnit: {
						bDisplay: true,
						bUpdate: true,
						bCreate: true,
						bDelete: true
					},
					oContractor: {
						bDisplay: true,
						bUpdate: true,
						bCreate: true,
						bDelete: true
					},
					oClient: {
						bDisplay: true,
						bUpdate: true,
						bCreate: true,
						bDelete: true
					},
					oContact: {
						bDisplay: true,
						bUpdate: true,
						bCreate: true,
						bDelete: true
					},
					oActivity: {
						bDisplay: true,
						bUpdate: true,
						bCreate: true,
						bDelete: true
					},
					oUser: {
						bDisplay: true,
						bUpdate: true,
						bCreate: true,
						bDelete: true
					},

				}
			},
			systemAdministrator: {
				sInitialState: "app.deficienciesList",
				bIsGlobalUserAdministrator: false,
				oMainMenu: {
					bShowDeficiencies: true,
					bShowUnits: true,
					bShowContractors: true,
					bShowClients: true,
					bShowContacts: true,
					bShowActivities: true,
					bShowAdminPanel: true,
					bShowProfileSettings: true
				},
				oAdminPanelMenu: {
					bShowCompaniesManagement: false,
					bShowUsersManagement: true,
					bShowRolesManagement: true,
					bShowProjectsManagement: true,
					bShowPhasesManagement: true,
					bShowDeficiencyStatusesManagement: true,
					bShowDeficiencyPrioritiesManagement: true,
					bShowSystemFilesManagement: true,
					bShowOperationLogs: true,
					bShowAccountTypesManagement: true,
					bShowContactTypesManagement: true,
					bShowUnitOptionSetManagement: true,
					bShowUnitOptionValueManagement: true,
					bShowTaskTypeManagement: true
				},
				oProfileMenu: {
					bShowContactDetails: true,
					bShowProfileDetails: true,
					bShowChangePassword: true
				},
				oAuthorizationsPerEntity: {
					oDeficiency: {
						bDisplay: true,
						bUpdate: true,
						bCreate: true,
						bDelete: true
					},
					oUnit: {
						bDisplay: true,
						bUpdate: true,
						bCreate: true,
						bDelete: true
					},
					oContractor: {
						bDisplay: true,
						bUpdate: true,
						bCreate: true,
						bDelete: true
					},
					oClient: {
						bDisplay: true,
						bUpdate: true,
						bCreate: true,
						bDelete: true
					},
					oContact: {
						bDisplay: true,
						bUpdate: true,
						bCreate: true,
						bDelete: true
					},
					oActivity: {
						bDisplay: true,
						bUpdate: true,
						bCreate: true,
						bDelete: true
					},
					oUser: {
						bDisplay: true,
						bUpdate: true,
						bCreate: false,
						bDelete: false
					},

				}
			},

			contactManagementUser: {
				sInitialState: "app.contactsList",
				bIsGlobalUserAdministrator: false,
				oMainMenu: {
					bShowDeficiencies: false,
					bShowUnits: false,
					bShowContractors: true,
					bShowClients: true,
					bShowContacts: true,
					bShowActivities: false,
					bShowAdminPanel: false,
					bShowProfileSettings: true
				},
				oAdminPanelMenu: {
					bShowCompaniesManagement: false,
					bShowUsersManagement: false,
					bShowRolesManagement: false,
					bShowProjectsManagement: false,
					bShowPhasesManagement: false,
					bShowDeficiencyStatusesManagement: false,
					bShowDeficiencyPrioritiesManagement: false,
					bShowSystemFilesManagement: false,
					bShowOperationLogs: false,
					bShowAccountTypesManagement: false,
					bShowContactTypesManagement: false,
					bShowUnitOptionSetManagement: false,
					bShowUnitOptionValueManagement: false,
					bShowTaskTypeManagement: false
				},
				oProfileMenu: {
					bShowContactDetails: true,
					bShowProfileDetails: true,
					bShowChangePassword: true
				},
				oAuthorizationsPerEntity: {
					oDeficiency: {
						bDisplay: false,
						bUpdate: false,
						bCreate: false,
						bDelete: false
					},
					oUnit: {
						bDisplay: false,
						bUpdate: false,
						bCreate: false,
						bDelete: false
					},
					oContractor: {
						bDisplay: true,
						bUpdate: true,
						bCreate: true,
						bDelete: true
					},
					oClient: {
						bDisplay: true,
						bUpdate: true,
						bCreate: true,
						bDelete: true
					},
					oContact: {
						bDisplay: true,
						bUpdate: true,
						bCreate: true,
						bDelete: true
					},
					oActivity: {
						bDisplay: false,
						bUpdate: false,
						bCreate: false,
						bDelete: false
					},
					oUser: {
						bDisplay: false,
						bUpdate: false,
						bCreate: false,
						bDelete: false
					},

				}
			},
			contactViewerUser: {
				sInitialState: "app.contactsList",
				bIsGlobalUserAdministrator: false,
				oMainMenu: {
					bShowDeficiencies: false,
					bShowUnits: false,
					bShowContractors: true,
					bShowClients: true,
					bShowContacts: true,
					bShowActivities: false,
					bShowAdminPanel: false,
					bShowProfileSettings: true
				},
				oAdminPanelMenu: {
					bShowCompaniesManagement: false,
					bShowUsersManagement: false,
					bShowRolesManagement: false,
					bShowProjectsManagement: false,
					bShowPhasesManagement: false,
					bShowDeficiencyStatusesManagement: false,
					bShowDeficiencyPrioritiesManagement: false,
					bShowSystemFilesManagement: false,
					bShowOperationLogs: false,
					bShowAccountTypesManagement: false,
					bShowContactTypesManagement: false,
					bShowUnitOptionSetManagement: false,
					bShowUnitOptionValueManagement: false,
					bShowTaskTypeManagement: false
				},
				oProfileMenu: {
					bShowContactDetails: true,
					bShowProfileDetails: true,
					bShowChangePassword: true
				},
				oAuthorizationsPerEntity: {
					oDeficiency: {
						bDisplay: false,
						bUpdate: false,
						bCreate: false,
						bDelete: false
					},
					oUnit: {
						bDisplay: false,
						bUpdate: false,
						bCreate: false,
						bDelete: false
					},
					oContractor: {
						bDisplay: true,
						bUpdate: false,
						bCreate: false,
						bDelete: false
					},
					oClient: {
						bDisplay: true,
						bUpdate: false,
						bCreate: false,
						bDelete: false
					},
					oContact: {
						bDisplay: true,
						bUpdate: false,
						bCreate: false,
						bDelete: false
					},
					oActivity: {
						bDisplay: false,
						bUpdate: false,
						bCreate: false,
						bDelete: false
					},
					oUser: {
						bDisplay: false,
						bUpdate: false,
						bCreate: false,
						bDelete: false
					},

				}
			}			
		}
	}
]);