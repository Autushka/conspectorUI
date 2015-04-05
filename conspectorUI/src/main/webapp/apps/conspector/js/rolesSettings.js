app.factory('rolesSettings', ['cacheProvider', 'utilsProvider', 'apiProvider', '$translate', 'CONSTANTS',
	function(cacheProvider, utilsProvider, apiProvider, $translate, CONSTANTS) {
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
				if(!bMobileMode){
					return this[sRole].sInitialState;
				}else{
					return this[sRole].sInitialStateMobile;
				}
				
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

			getRolesHybridMainMenuItemSettings: function(oParameters) {
				return this[oParameters.sRole].oHybridMainMenu[oParameters.sMenuItem];
			},			

			globalAdministrator: {
				sInitialState: "app.deficienciesList",
				sInitialStateMobile: "app.deficienciesList",
				bIsGlobalUserAdministrator: true,
				oMainMenu: {
					bShowDeficiencies: true,
					bShowUnits: true,
					bShowContractors: true,
					bShowClients: true,
					bShowContacts: true,
					bShowActivities: true,
					bShowAdminPanel: true,
					bShowProfileSettings: true,
					bShowNotifications: true					
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
					bShowAccountTypesManagement: true,
					bShowContactTypesManagement: true,
					bShowUnitOptionSetManagement: true,
					bShowUnitOptionValueManagement: true,
					bShowTaskTypeManagement: true,
					bShowActivityTypesManagement: true
				},
				oProfileMenu: {
					bShowContactDetails: true,
					bShowProfileDetails: true,
					bShowChangePassword: true
				},
				oHybridMainMenu: {
					bShowQuickAdd: true,
					bShowDeficienciesList: true,
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
				sInitialStateMobile: "deficiencyQuickAddWrapper.quickAdd",				
				bIsGlobalUserAdministrator: false,
				oMainMenu: {
					bShowDeficiencies: true,
					bShowUnits: true,
					bShowContractors: true,
					bShowClients: true,
					bShowContacts: true,
					bShowActivities: true,
					bShowAdminPanel: true,
					bShowProfileSettings: true,
					bShowNotifications: true
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
					bShowAccountTypesManagement: true,
					bShowContactTypesManagement: true,
					bShowUnitOptionSetManagement: true,
					bShowUnitOptionValueManagement: true,
					bShowTaskTypeManagement: true,
					bShowActivityTypesManagement: true
				},
				oProfileMenu: {
					bShowContactDetails: true,
					bShowProfileDetails: true,
					bShowChangePassword: true
				},
				oHybridMainMenu: {
					bShowQuickAdd: true,
					bShowDeficienciesList: true,					
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
				sInitialStateMobile: "deficiencyQuickAddWrapper.quickAdd",				
				bIsGlobalUserAdministrator: false,
				oMainMenu: {
					bShowDeficiencies: false,
					bShowUnits: false,
					bShowContractors: true,
					bShowClients: true,
					bShowContacts: true,
					bShowActivities: false,
					bShowAdminPanel: false,
					bShowProfileSettings: true,
					bShowNotifications: true
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
					bShowAccountTypesManagement: false,
					bShowContactTypesManagement: false,
					bShowUnitOptionSetManagement: false,
					bShowUnitOptionValueManagement: false,
					bShowTaskTypeManagement: false,
					bShowActivityTypesManagement: false
				},
				oProfileMenu: {
					bShowContactDetails: true,
					bShowProfileDetails: true,
					bShowChangePassword: true
				},
				oHybridMainMenu: {
					bShowQuickAdd: true,
					bShowDeficienciesList: true,					
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
				sInitialStateMobile: "deficiencyQuickAddWrapper.quickAdd",				
				bIsGlobalUserAdministrator: false,
				oMainMenu: {
					bShowDeficiencies: false,
					bShowUnits: false,
					bShowContractors: true,
					bShowClients: true,
					bShowContacts: true,
					bShowActivities: false,
					bShowAdminPanel: false,
					bShowProfileSettings: true,
					bShowNotifications: true
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
					bShowAccountTypesManagement: false,
					bShowContactTypesManagement: false,
					bShowUnitOptionSetManagement: false,
					bShowUnitOptionValueManagement: false,
					bShowTaskTypeManagement: false,
					bShowActivityTypesManagement: false
				},
				oProfileMenu: {
					bShowContactDetails: true,
					bShowProfileDetails: true,
					bShowChangePassword: true
				},
				oHybridMainMenu: {
					bShowQuickAdd: true,
					bShowDeficienciesList: true,					
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
						bUpdate: true,
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
			},
			contractor: {
				//sInitialState: "app.deficienciesList",
				sInitialState: "app.deficienciesList",
				sInitialStateMobile: "deficienciesListHybridWrapper.deficienciesSearchHybrid",
				bIsGlobalUserAdministrator: false,
				oMainMenu: {
					bShowDeficiencies: true,
					bShowUnits: false,
					bShowContractors: false,
					bShowClients: false,
					bShowContacts: false,
					bShowActivities: false,
					bShowAdminPanel: false,
					bShowProfileSettings: true,
					bShowNotifications: true
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
					bShowAccountTypesManagement: false,
					bShowContactTypesManagement: false,
					bShowUnitOptionSetManagement: false,
					bShowUnitOptionValueManagement: false,
					bShowTaskTypeManagement: false,
					bShowActivityTypesManagement: false
				},
				oProfileMenu: {
					bShowContactDetails: true,
					bShowProfileDetails: true,
					bShowChangePassword: true
				},
				oHybridMainMenu: {
					bShowQuickAdd: false,
					bShowDeficienciesList: true,					
				},				
				oAuthorizationsPerEntity: {
					oDeficiency: {
						bDisplay: true,
						bUpdate: true,
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
						bDisplay: false,
						bUpdate: false,
						bCreate: false,
						bDelete: false
					},
					oClient: {
						bDisplay: false,
						bUpdate: false,
						bCreate: false,
						bDelete: false
					},
					oContact: {
						bDisplay: true,
						bUpdate: true,
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
			},						
		}
	}
]);