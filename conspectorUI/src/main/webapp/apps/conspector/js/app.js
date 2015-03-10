var app = angular.module('conspector', ['ui.router', 'viewControllers', 'pascalprecht.translate', 'ngCookies', 'ngTable', 'ngResource', 'ngMaterial', 'multi-select', 'angularFileUpload', 'colorpicker.module', "pubnub.angular.service", "ngTagsInput", 'cfp.loadingBar', 'ngAnimate', 'filtersProvider', 'ngMessages', 'ngCordova', 'ngQuickDate', 'textAngular', 'controlsProvider', 'ui.bootstrap']);
var viewControllers = angular.module('viewControllers', []);

app.config(['cfpLoadingBarProvider',
    function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }
]);

app.config(['$anchorScrollProvider',
    function($anchorScrollProvider) {
        $anchorScrollProvider.disableAutoScrolling();

    }
]);

app.config(['$mdThemingProvider',
    function($mdThemingProvider) {
        $mdThemingProvider.definePalette('conspectorColorPalette', {
            '50': '55b0d0',
            '100': '44a8cb',
            '200': '33a0c6',
            '300': '2298c1',
            '400': '1190bd',
            '500': '0088b8',
            '600': '007da9',
            '700': '00729b',
            '800': '00678c',
            '900': '005c7d',
            'A100': '44a8cb',
            'A200': '33a0c6',
            'A400': '0088b8',
            'A700': '0088b8',
            'contrastDefaultColor': 'light', // whether, by default, text (contrast)
            // on this palette should be dark or light
            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                '200', '300', '400', 'A100'
            ],
            'contrastLightColors': undefined // could also specify this if default was 'dark'
        });
        $mdThemingProvider.theme('default')
            .primaryColor('conspectorColorPalette')
            .accentColor('conspectorColorPalette');
        $mdThemingProvider.definePalette('conspectorColorPaletteNavbar', {
            '50': '8e9192',
            '100': '838687',
            '200': '787b7d',
            '300': '6d7072',
            '400': '616567',
            '500': '565a5c',
            '600': '4f5355',
            '700': '484c4d',
            '800': '414446',
            '900': '3a3d3f',
            'A100': '565a5c',
            'A200': '565a5c',
            'A400': '565a5c',
            'A700': '565a5c',
            'contrastDefaultColor': 'light', // whether, by default, text (contrast)
            // on this palette should be dark or light
            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                '200', '300', '400', 'A100'
            ],
            'contrastLightColors': undefined // could also specify this if default was 'dark'
        });
        $mdThemingProvider.theme('conspectorColorPaletteNavbar')
            .primaryColor('conspectorColorPaletteNavbar')
            .accentColor('conspectorColorPaletteNavbar');

        //   $mdThemingProvider.definePalette('conspectorColorPaletteNavbar', {
        //   '50': '565a5c',
        //   '100': '565a5c',
        //   '200': '565a5c',
        //   '300': '565a5c',
        //   '400': '565a5c',
        //   '500': '565a5c',
        //   '600': '565a5c',
        //   '700': '565a5c',
        //   '800': '565a5c',
        //   '900': '565a5c',
        //   'A100': '565a5c',
        //   'A200': '565a5c',
        //   'A400': '565a5c',
        //   'A700': '565a5c',
        //   'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
        //                                       // on this palette should be dark or light
        //   'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        //    '200', '300', '400', 'A100'],
        //   'contrastLightColors': undefined    // could also specify this if default was 'dark'
        // });

    }
]);

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/signIn");

        $stateProvider.state('signIn', {
            url: '/signIn',
            templateUrl: 'apps/conspector/components/userManagement/templates/signInView.html',
            controller: 'signInView'
        });
        $stateProvider.state('forgotPassword', {
            url: '/forgotPassword',
            templateUrl: 'apps/conspector/components/userManagement/templates/forgotPasswordView.html',
            controller: 'forgotPasswordView'
        })
        $stateProvider.state('initialPasswordReset', {
            url: '/initialPasswordReset',
            templateUrl: 'apps/conspector/components/userManagement/templates/initialPasswordResetView.html',
            controller: 'initialPasswordResetView'
        });
        $stateProvider.state('companySelection', {
            url: '/companySelection',
            templateUrl: 'apps/conspector/components/userManagement/templates/companySelectionView.html',
            controller: 'companySelectionView'
        });
        $stateProvider.state('roleSelection', {
            url: '/roleSelection',
            templateUrl: 'apps/conspector/components/userManagement/templates/roleSelectionView.html',
            controller: 'roleSelectionView'
        });
        $stateProvider.state('resetPassword', {
            url: '/resetPassword/:pr',
            templateUrl: 'apps/conspector/components/userManagement/templates/passwordResetView.html',
            controller: 'passwordResetView'
        });
        $stateProvider.state('app', {
            url: '/app',
            templateUrl: 'apps/conspector/components/generalLayout/templates/appView.html',
            controller: 'appView'
        });

        $stateProvider.state('app.deficienciesList', {
            url: '/deficienciesList',
            templateUrl: 'apps/conspector/components/deficiencies/templates/deficienciesListView.html',
            controller: 'deficienciesListView'
        });

        $stateProvider.state('app.deficiencyDetailsWrapper', { //abstract view without controller that contains only ngView holders
            templateUrl: 'apps/conspector/components/deficiencies/templates/deficiencyDetailsWrapperView.html',
            controller: 'deficiencyDetailsWrapperView'
        });

        $stateProvider.state('app.deficiencyDetailsWrapper.deficiencyDetails', { //state that contains subviews
            url: '/deficiencyDetails/:sDeficiencyGuid/:sMode',
            views: {
                'deficiencyDetails': {
                    templateUrl: 'apps/conspector/components/deficiencies/templates/deficiencyDetailsView.html',
                    controller: 'deficiencyDetailsView'
                },
                'attachmentsList': {
                    templateUrl: 'apps/conspector/components/attachments/templates/attachmentsListView.html',
                    controller: 'attachmentsListView'
                },
                'commentsList': {
                    templateUrl: 'apps/conspector/components/comments/templates/commentsListView.html',
                    controller: 'commentsListView'
                },
            }
        });

        $stateProvider.state('app.unitsList', {
            url: '/unitsList',
            templateUrl: 'apps/conspector/components/units/templates/unitsListView.html',
            controller: 'unitsListView'
        });

        $stateProvider.state('app.unitDetailsWrapper', { //abstract view without controller that contains only ngView holders
            templateUrl: 'apps/conspector/components/units/templates/unitDetailsWrapperView.html',
            controller: 'unitDetailsWrapperView'
        });

        $stateProvider.state('app.unitDetailsWrapper.unitDetails', { //state that contains subviews
            url: '/unitDetails/:sUnitGuid/:sMode',
            views: {
                'unitDetails': {
                    templateUrl: 'apps/conspector/components/units/templates/unitDetailsView.html',
                    controller: 'unitDetailsView'
                },
                'attachmentsList': {
                    templateUrl: 'apps/conspector/components/attachments/templates/attachmentsListView.html',
                    controller: 'attachmentsListView'
                },
                'unitDeficiencies': {
                    templateUrl: 'apps/conspector/components/deficiencies/templates/deficienciesListView.html',
                    controller: 'deficienciesListView'
                },
                'unitActivities': {
                    templateUrl: 'apps/conspector/components/activities/templates/activitiesListView.html',
                    controller: 'activitiesListView'
                },
            }
        });

        $stateProvider.state('app.contractorsList', {
            url: '/contractorsList',
            templateUrl: 'apps/conspector/components/contractors/templates/contractorsListView.html',
            controller: 'contractorsListView'
        });

        $stateProvider.state('app.contractorDetailsWrapper', { //abstract view without controller that contains only ngView holders
            templateUrl: 'apps/conspector/components/contractors/templates/contractorDetailsWrapperView.html',
            controller: 'contractorDetailsWrapperView'
        });

        $stateProvider.state('app.contractorDetailsWrapper.contractorDetails', { //state that contains subviews
            url: '/contractorDetails/:sContractorGuid/:sMode',
            views: {
                'contractorDetails': {
                    templateUrl: 'apps/conspector/components/contractors/templates/contractorDetailsView.html',
                    controller: 'contractorDetailsView'
                },
                'contractorContacts': {
                    templateUrl: 'apps/conspector/components/contacts/templates/contactsListView.html',
                    controller: 'contactsListView'
                },
                'contractorDeficiencies': {
                    templateUrl: 'apps/conspector/components/deficiencies/templates/deficienciesListView.html',
                    controller: 'deficienciesListView'
                },
                'contractorActivities': {
                    templateUrl: 'apps/conspector/components/activities/templates/activitiesListView.html',
                    controller: 'activitiesListView'
                },
            }
        });

        $stateProvider.state('app.clientsList', {
            url: '/clientsList',
            templateUrl: 'apps/conspector/components/clients/templates/clientsListView.html',
            controller: 'clientsListView'
        });

        $stateProvider.state('app.clientDetailsWrapper', { //abstract view without controller that contains only ngView holders
            templateUrl: 'apps/conspector/components/clients/templates/clientDetailsWrapperView.html',
            controller: 'clientDetailsWrapperView'
        });

        $stateProvider.state('app.clientDetailsWrapper.clientDetails', { //state that contains subviews
            url: '/clientDetails/:sClientGuid/:sMode',
            views: {
                'clientDetails': {
                    templateUrl: 'apps/conspector/components/clients/templates/clientDetailsView.html',
                    controller: 'clientDetailsView'
                },
                'clientContacts': {
                    templateUrl: 'apps/conspector/components/contacts/templates/contactsListView.html',
                    controller: 'contactsListView'
                },
                'clientActivities': {
                    templateUrl: 'apps/conspector/components/activities/templates/activitiesListView.html',
                    controller: 'activitiesListView'
                },
            }
        });

        $stateProvider.state('app.contactsList', {
            url: '/contactsList',
            templateUrl: 'apps/conspector/components/contacts/templates/contactsListView.html',
            controller: 'contactsListView'
        });

        $stateProvider.state('app.contactDetailsWrapper', { //abstract view without controller that contains only ngView holders
            templateUrl: 'apps/conspector/components/contacts/templates/contactDetailsWrapperView.html',
            controller: 'contactDetailsWrapperView'
        });

        $stateProvider.state('app.contactDetailsWrapper.contactDetails', { //state that contains subviews
            url: '/contactDetails/:sAccountGuid/:sContactGuid/:sMode',
            views: {
                'contactDetails': {
                    templateUrl: 'apps/conspector/components/contacts/templates/contactDetailsView.html',
                    controller: 'contactDetailsView'
                },
                'contactActivities': {
                    templateUrl: 'apps/conspector/components/activities/templates/activitiesListView.html',
                    controller: 'activitiesListView'
                },
            }
        });

        $stateProvider.state('app.activitiesList', {
            url: '/activitiesList',
            templateUrl: 'apps/conspector/components/activities/templates/activitiesListView.html',
            controller: 'activitiesListView'
        });

        $stateProvider.state('app.activityDetailsWrapper', { //abstract view without controller that contains only ngView holders
            templateUrl: 'apps/conspector/components/activities/templates/activityDetailsWrapperView.html',
            controller: 'activityDetailsWrapperView'
        });

        $stateProvider.state('app.activityDetailsWrapper.activityDetails', { //state that contains subviews
            url: '/activityDetails/:sActivityGuid/:sMode',
            views: {
                'activityDetails': {
                    templateUrl: 'apps/conspector/components/activities/templates/activityDetailsView.html',
                    controller: 'activityDetailsView'
                },
                'attachmentsList': {
                    templateUrl: 'apps/conspector/components/attachments/templates/attachmentsListView.html',
                    controller: 'attachmentsListView'
                },
                'commentsList': {
                    templateUrl: 'apps/conspector/components/comments/templates/commentsListView.html',
                    controller: 'commentsListView'
                },                
            }
        });

        $stateProvider.state('app.adminPanel', {
            url: '/adminPanel',
            templateUrl: 'apps/conspector/components/adminPanel/templates/adminPanelView.html',
            controller: 'adminPanelView'
        });
        $stateProvider.state('app.adminPanel.companiesList', {
            url: '/companiesList',
            templateUrl: 'apps/conspector/components/adminPanel/templates/companiesListView.html',
            controller: 'companiesListView'
        });
        $stateProvider.state('app.adminPanel.usersList', {
            url: '/usersList',
            templateUrl: 'apps/conspector/components/adminPanel/templates/usersListView.html',
            controller: 'usersListView'
        });
        $stateProvider.state('app.adminPanel.userDetails', {
            url: '/userDetails/:sUserName/:sMode',
            templateUrl: 'apps/conspector/components/adminPanel/templates/userDetailsView.html',
            controller: 'userDetailsView'
        });
        $stateProvider.state('app.adminPanel.rolesList', {
            url: '/rolesList',
            templateUrl: 'apps/conspector/components/adminPanel/templates/rolesListView.html',
            controller: 'rolesListView'
        });
        $stateProvider.state('app.adminPanel.projectsList', {
            url: '/projectsList',
            templateUrl: 'apps/conspector/components/adminPanel/templates/projectsListView.html',
            controller: 'projectsListView'
        });
        $stateProvider.state('app.adminPanel.phasesList', {
            url: '/phasesList',
            templateUrl: 'apps/conspector/components/adminPanel/templates/phasesListView.html',
            controller: 'phasesListView'
        });
        $stateProvider.state('app.adminPanel.deficiencyStatusesList', {
            url: '/deficiencyStatusesList',
            templateUrl: 'apps/conspector/components/adminPanel/templates/deficiencyStatusesListView.html',
            controller: 'deficiencyStatusesListView'
        });
        $stateProvider.state('app.adminPanel.systemFiles', {
            url: '/systemFiles',
            templateUrl: 'apps/conspector/components/adminPanel/templates/systemFilesView.html',
            controller: 'systemFilesView'
        });
        $stateProvider.state('app.adminPanel.accountTypesList', {
            url: '/accountTypesList',
            templateUrl: 'apps/conspector/components/adminPanel/templates/accountTypesListView.html',
            controller: 'accountTypesListView'
        });
        $stateProvider.state('app.adminPanel.contactTypesList', {
            url: '/contactTypesList',
            templateUrl: 'apps/conspector/components/adminPanel/templates/contactTypesListView.html',
            controller: 'contactTypesListView'
        });
        $stateProvider.state('app.adminPanel.deficiencyPrioritiesList', {
            url: '/deficiencyPrioritiesList',
            templateUrl: 'apps/conspector/components/adminPanel/templates/deficiencyPrioritiesListView.html',
            controller: 'deficiencyPrioritiesListView'
        });
        $stateProvider.state('app.adminPanel.unitOptionSetList', {
            url: '/unitOptionSetList',
            templateUrl: 'apps/conspector/components/adminPanel/templates/unitOptionSetListView.html',
            controller: 'unitOptionSetListView'
        });
        $stateProvider.state('app.adminPanel.unitOptionValueList', {
            url: '/unitOptionValueList',
            templateUrl: 'apps/conspector/components/adminPanel/templates/unitOptionValueListView.html',
            controller: 'unitOptionValueListView'
        });

        $stateProvider.state('app.adminPanel.taskTypeList', {
            url: '/taskTypeList',
            templateUrl: 'apps/conspector/components/adminPanel/templates/taskTypeListView.html',
            controller: 'taskTypeListView'
        });
        $stateProvider.state('app.adminPanel.activityTypesList', {
            url: '/activityTypeList',
            templateUrl: 'apps/conspector/components/adminPanel/templates/activityTypesListView.html',
            controller: 'activityTypesListView'
        });
        $stateProvider.state('app.profileSettings', {
            url: '/profileSettings',
            templateUrl: 'apps/conspector/components/profileSettings/templates/profileSettingsView.html',
            controller: 'profileSettingsView'
        });
        $stateProvider.state('app.profileSettings.contactDetails', {
            url: '/profileSettings.contactDetails/:sAccountGuid/:sContactGuid/:sMode',
            templateUrl: 'apps/conspector/components/contacts/templates/contactDetailsView.html',
            controller: 'contactDetailsView'
        });
        $stateProvider.state('app.profileSettings.profileDetails', {
            url: '/profileDetails',
            templateUrl: 'apps/conspector/components/profileSettings/templates/profileDetailsView.html',
            controller: 'profileDetailsView'
        });
        $stateProvider.state('app.profileSettings.changePassword', {
            url: '/changePassword',
            templateUrl: 'apps/conspector/components/profileSettings/templates/changePasswordView.html',
            controller: 'changePasswordView'
        });
        
        $stateProvider.state('app.notificationsList', {
            url: '/notificationsList',
            templateUrl: 'apps/conspector/components/notifications/templates/notificationsListView.html',
            controller: 'notificationsListView'
        });        

        //Hybrid App
       $stateProvider.state('mainMenuHybrid', {
            url: '/mainMenuHybrid',
            templateUrl: 'apps/conspector/components/generalLayout/templates/mainMenuHybridView.html',
            controller: 'mainMenuHybridView'
        });     

        // $stateProvider.state('deficienciesListHybrid', {
        //     url: '/deficienciesListHybrid',
        //     templateUrl: 'apps/conspector/components/deficiencies/templates/deficienciesListHybridView.html',
        //     controller: 'deficienciesListHybridView'
        // });         
        $stateProvider.state('deficienciesListHybridWrapper', {//abstract view without controller that contains only ngView holders
            templateUrl: 'apps/conspector/components/deficiencies/templates/deficienciesListHybridWrapperView.html',
            controller: 'deficienciesListHybridWrapperView'
        });

        $stateProvider.state('deficienciesListHybridWrapper.deficienciesSearchHybrid', {//state that contains subviews
            url: '/deficienciesListHybridWrapper',
            views: {
                'deficienciesSearchHybrid': {
                    templateUrl: 'apps/conspector/components/deficiencies/templates/deficienciesSearchHybridView.html',
                    controller: 'deficienciesSearchHybridView'
                },
                'deficienciesListHybrid': {
                    templateUrl: 'apps/conspector/components/deficiencies/templates/deficienciesListHybridView.html',
                    controller: 'deficienciesListHybridView'
                },
                'deficienciesListItemsListsHybrid': {
                    templateUrl: 'apps/conspector/components/deficiencies/templates/deficienciesListItemsListsHybridView.html',
                    controller: 'deficienciesListItemsListsHybridView'
                },  
                'deficiencyDetailsHybrid': {
                    templateUrl: 'apps/conspector/components/deficiencies/templates/deficiencyDetailsHybridView.html',
                    controller: 'deficiencyDetailsHybridView'
                },                                 
            }
        });         


        $stateProvider.state('deficiencyQuickAddWrapper', {//abstract view without controller that contains only ngView holders
            templateUrl: 'apps/conspector/components/deficiencies/templates/deficiencyQuickAddWrapperView.html',
            controller: 'deficiencyQuickAddWrapperView'
        });     

        $stateProvider.state('deficiencyQuickAddWrapper.quickAdd', {//state that contains subviews
            url: '/deficiencyQuickAddWrapper',
            views: {
                'deficiencyQuickAdd': {
                    templateUrl: 'apps/conspector/components/deficiencies/templates/deficiencyQuickAddView.html',
                    controller: 'deficiencyQuickAddView'
                },
                'deficiencyQuickAddItemsLists': {
                    templateUrl: 'apps/conspector/components/deficiencies/templates/deficiencyQuickAddItemsListsView.html',
                    controller: 'deficiencyQuickAddItemsListsView'
                },
            }
        }); 
    }
]);