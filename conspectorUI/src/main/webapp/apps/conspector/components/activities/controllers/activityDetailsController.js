viewControllers.controller('activityDetailsView', ['$rootScope', '$scope', '$location', '$anchorScroll', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS', 'historyProvider', 'rolesSettings',
    function($rootScope, $scope, $location, $anchorScroll, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS, historyProvider, rolesSettings) {
        // the element you wish to scroll to.
        $location.hash('top');
        // call $anchorScroll()
        $anchorScroll();

        $scope.oForms = {};

        var sActivityGuid = $stateParams.sActivityGuid;
        $rootScope.sMode = $stateParams.sMode;

        $rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
        $rootScope.oStateParams = angular.copy($stateParams); // for backNavigation

        var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
        $scope.bDisplayEditButton = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: sCurrentRole,
            sEntityName: "oActivity",
            sOperation: "bUpdate"
        });

        $scope.bDisplayDeleteButton = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: sCurrentRole,
            sEntityName: "oActivity",
            sOperation: "bDelete"
        });

        $scope.bShowBackButton = historyProvider.aHistoryStates.length > 0 ? true : false;

        var oNavigateToInfo = {}; //needed to keen in scope info about state change parameters (for save and leave scenario)

        $rootScope.sMode = $stateParams.sMode;

        if ($rootScope.sMode === "create") {
            $rootScope.sCommentSetGuid = "";
            $rootScope.sFileMetadataSetGuid = "";
            $rootScope.sFileMetadataSetLastModifiedAt = "";
        }

        $scope.oActivity = {
            _aPhases: [],
        };

        var oActivityWrapper = {
            aData: [{
                _accountsGuids: [],
                _contactsGuids: [],
                _unitsGuids: [],
                _aPhases: [],
            }]
        };

        var onPhasesWithProjectsWithUnitsLoaded = function(aData) {

            for (var i = 0; i < aData.length; i++) {
                aData[i]._sortingSequenceProject = aData[i].ProjectDetails.GeneralAttributes.SortingSequence;
                aData[i]._sortingSequencePhase = aData[i].GeneralAttributes.SortingSequence;
                for (var j = 0; j < aData[i].UnitDetails.results.length; j++) {
                    aData[i].UnitDetails.results[j].Name = utilsProvider.convertStringToInt(aData[i].UnitDetails.results[j].Name);
                }
                aData[i].UnitDetails.results = $filter('filter')(aData[i].UnitDetails.results, function(oItem, iIndex) {
                    return !oItem.GeneralAttributes.IsDeleted
                });
                aData[i].UnitDetails.results = $filter('orderBy')(aData[i].UnitDetails.results, ["Name"]);

            }

            aData = $filter('orderBy')(aData, ["_sortingSequenceProject", "_sortingSequencePhase"]);
            //to add support for FR or EN project NAME
            var aProjectPhase = [];
            for (var i = 0; i < aData.length; i++) {
                aProjectPhase[i] = [];
                aProjectPhase[i] = aData[i].ProjectDetails.NameEN + " - " + aData[i].NameEN;
                aData[i]._NameEN = aProjectPhase[i];
            }

            servicesProvider.constructDependentMultiSelectArray({
                oDependentArrayWrapper: {
                    aData: aData
                },
                sSecondLevelAttribute: "UnitDetails",
                sSecondLevelNameEN: "Name",
                sSecondLevelNameFR: "Name",
                oParentArrayWrapper: oActivityWrapper,
                sNameEN: "_NameEN",
                sNameFR: "_NameEN",
                sDependentKey: "Guid",
                sParentKeys: "_unitsGuids",
                sTargetArrayNameInParent: "aUnits"
            });

            if (oActivityWrapper.aData[0]) {
                $scope.aUnits = angular.copy(oActivityWrapper.aData[0].aUnits);
            }
        };

        var getPhasesWithUnits = function(aSelectedPhases) {
            if (aSelectedPhases.length === 0) {
                onPhasesWithProjectsWithUnitsLoaded([]);
                return;
            }
            var sFilterByPhases = "";
            for (var i = 0; i < aSelectedPhases.length; i++) {
                sFilterByPhases = sFilterByPhases + "Guid eq '" + aSelectedPhases[i].Guid + "'";
                if (i < aSelectedPhases.length - 1) {
                    sFilterByPhases = sFilterByPhases + " or ";
                }
            }

            apiProvider.getPhases({
                sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false and (" + sFilterByPhases + ")",
                sExpand: "UnitDetails,ProjectDetails",
                bShowSpinner: false,
                onSuccess: onPhasesWithProjectsWithUnitsLoaded
            });
        };

        var constructPhasesMultiSelect = function(aSelectedPhases) {
            $scope.aUserProjectsPhasesForMultiselect = servicesProvider.constructUserProjectsPhasesForMultiSelect({
                aSelectedPhases: aSelectedPhases
            });

            if ($scope.aSelectedPhases) {
                getPhasesWithUnits($scope.aSelectedPhases);
            }
        };

        var setDisplayedActivityDetails = function(oActivity) {
            $rootScope.sCurrentEntityPhaseGuid = oActivity.PhaseGuid; //needed for notifications...            
            var aActivityPhasesGuids = [];

            $rootScope.sFileMetadataSetGuid = oActivity.FileMetadataSetGuid;
            if (oActivity.FileMetadataSetDetails) {
                $rootScope.sFileMetadataSetLastModifiedAt = oActivity.FileMetadataSetDetails.LastModifiedAt;
            }
            $rootScope.$broadcast("FileAttachemntsCanBeLoaded");

            $rootScope.sCommentSetGuid = oActivity.CommentSetGuid;
            if (oActivity.CommentSetDetails) {
                $rootScope.sCommentSetLastModifiedAt = oActivity.CommentSetDetails.LastModifiedAt;
            }
            $rootScope.$broadcast("CommentsCanBeLoaded");            

            $scope.oActivity._guid = oActivity.Guid;
            $scope.oActivity.sObject = oActivity.Object;
            $scope.oActivity._lastModifiedAt = oActivity.LastModifiedAt;
            $scope.oActivity.sCreatedAt = utilsProvider.dBDateToSting(oActivity.CreatedAt);
            $scope.oActivity.sLastModifiedAt = utilsProvider.dBDateToSting(oActivity.LastModifiedAt);

            if (oActivity.DueDate && oActivity.DueDate != "/Date(0)/") {
                $scope.oActivity.sDueDate = utilsProvider.dBDateToSting(oActivity.DueDate);
                $scope.oActivity.dDueDate = new Date(parseInt(oActivity.DueDate.substring(6, oActivity.DueDate.length - 2)));
            }

            $scope.oActivity._aPhases = angular.copy(oActivity.PhaseDetails.results);
            for (var i = 0; i < $scope.oActivity._aPhases.length; i++) {
                aActivityPhasesGuids.push($scope.oActivity._aPhases[i].Guid);
            }

            constructPhasesMultiSelect(aActivityPhasesGuids);

            var aImages = [];
            var iImagesNumber = 0;
            if (oActivity.FileMetadataSetDetails) {
                if (oActivity.FileMetadataSetDetails.FileMetadataDetails) {
                    for (var j = 0; j < oActivity.FileMetadataSetDetails.FileMetadataDetails.results.length; j++) {
                        if (oActivity.FileMetadataSetDetails.FileMetadataDetails.results[j].MediaType) {
                            if (oActivity.FileMetadataSetDetails.FileMetadataDetails.results[j].MediaType.indexOf("image") > -1 && oActivity.FileMetadataSetDetails.FileMetadataDetails.results[j].GeneralAttributes.IsDeleted === false) {
                                aImages.push(oActivity.FileMetadataSetDetails.FileMetadataDetails.results[j]);
                            }
                        }
                    }
                }
                iImagesNumber = aImages.length;
            }

            var iCommentsNumber = 0;
            if (oActivity.CommentSetDetails) {
                if (oActivity.CommentSetDetails.CommentDetails) {
                    for (var j = 0; j < oActivity.CommentSetDetails.CommentDetails.results.length; j++) {
                        if(!oActivity.CommentSetDetails.CommentDetails.results[j].GeneralAttributes.IsDeleted){
                            iCommentsNumber++;
                        }
                    }
                }
            }               

            $rootScope.iImagesNumber = iImagesNumber;
            $rootScope._aImages = angular.copy(aImages);

            $rootScope.iCommentsNumber = iCommentsNumber;

            $scope.oActivity._unitsGuids = [];
            if (oActivity.UnitDetails) {
                for (var i = 0; i < oActivity.UnitDetails.results.length; i++) {
                    $scope.oActivity._unitsGuids.push(oActivity.UnitDetails.results[i].Guid);
                }
            }

            $scope.oActivity._activityTypeGuid = oActivity.ActivityTypeGuid;

            $scope.oActivity._assignedUserName = oActivity.AssignedUser;

            $scope.oActivity._accountsGuids = [];
            if (oActivity.AccountDetails) {
                for (var i = 0; i < oActivity.AccountDetails.results.length; i++) {
                    $scope.oActivity._accountsGuids.push(oActivity.AccountDetails.results[i].Guid);
                }
            }

            $scope.oActivity._contactsGuids = [];
            if (oActivity.ContactDetails) {
                for (var i = 0; i < oActivity.ContactDetails.results.length; i++) {
                    $scope.oActivity._contactsGuids.push(oActivity.ContactDetails.results[i].Guid);
                }
            }

            $scope.oActivity.sDescription = oActivity.Description;

            oActivityWrapper.aData[0] = angular.copy($scope.oActivity);

            getPhasesWithUnits($scope.oActivity._aPhases);
        };

        var oActivity = cacheProvider.getEntityDetails({
            sCacheProviderAttribute: "oActivityEntity",
            sRequestSettings: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false" + "PhaseDetails/ProjectDetails,ActivityTypeDetails,FileMetadataSetDetails/FileMetadataDetails", //filter + expand
            sKeyName: "Guid",
            sKeyValue: $stateParams.sActivityGuid
        });

        var onActivityDetailsLoaded = function(oData) {
            setDisplayedActivityDetails(oData);

            apiProvider.getActivityTypes({
                bShowSpinner: false,
                onSuccess: onActivityTypesLoaded
            });

            apiProvider.getUsers({
                sExpand: "CompanyDetails",
                bShowSpinner: false,
                onSuccess: onUsersWithCompaniesLoaded
            });

            apiProvider.getAccounts({
                sExpand: "AccountTypeDetails",
                bShowSpinner: false,
                onSuccess: onAccountsLoaded
            });

            apiProvider.getContacts({
                sExpand: "AccountDetails/AccountTypeDetails",
                bShowSpinner: false,
                onSuccess: onContactsWithAccountLoaded
            });
        };

        var onAccountsLoaded = function(aData) {
            //Sort aData by accountType sorting sequence and then by AccountName
            aData = $filter('orderBy')(aData, ["Name"]);

            servicesProvider.constructDependentMultiSelectArray({
                oDependentArrayWrapper: {
                    aData: aData
                },
                // sSecondLevelAttribute: "AccountDetails",
                // sSecondLevelNameEN: "Name",
                // sSecondLevelNameFR: "Name",
                oParentArrayWrapper: oActivityWrapper,
                sNameEN: "Name",
                sNameFR: "Name",
                sDependentKey: "Guid",
                sParentKeys: "_accountsGuids",
                sTargetArrayNameInParent: "aAccounts"
            });

            if (oActivityWrapper.aData[0]) {
                $scope.aAccounts = angular.copy(oActivityWrapper.aData[0].aAccounts);
            }
        };


        var onContactsWithAccountLoaded = function(aData) {
            var sFullName = "";
            //Sort aData by accountType sorting sequence and then by AccountName
            aData = $filter('orderBy')(aData, ["FirstName"]);

            for (var i = 0; i < aData.length; i++) {
                if (aData[i].LastName) {
                    aData[i].sFullName = aData[i].FirstName + " " + aData[i].LastName + ",  " + aData[i].AccountDetails.Name;
                } else {
                    aData[i].sFullName = aData[i].FirstName + ",  " + aData[i].AccountDetails.Name;
                }
            }
            servicesProvider.constructDependentMultiSelectArray({
                oDependentArrayWrapper: {
                    aData: aData
                },
                oParentArrayWrapper: oActivityWrapper,
                sNameEN: "sFullName",
                sNameFR: "sFullName",
                sDependentKey: "Guid",
                sParentKeys: "_contactsGuids",
                sTargetArrayNameInParent: "aContacts"
            });

            if (oActivityWrapper.aData[0]) {
                $scope.aContacts = angular.copy(oActivityWrapper.aData[0].aContacts);
            }
        };

        var onActivityTypesLoaded = function(aData) {
            for (var i = 0; i < aData.length; i++) {
                aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
            }
            aData = $filter('orderBy')(aData, ["_sortingSequence"]);


            servicesProvider.constructDependentMultiSelectArray({
                oDependentArrayWrapper: {
                    aData: aData
                },
                oParentArrayWrapper: oActivityWrapper,
                sNameEN: "NameEN",
                sNameFR: "NameFR",
                sDependentKey: "Guid",
                sParentKey: "_activityTypeGuid",
                sDependentIconKey: "AssociatedIconFileGuid",
                sTargetArrayNameInParent: "aActivityTypes"
            });
            if (oActivityWrapper.aData[0]) {
                $scope.aActivityTypes = angular.copy(oActivityWrapper.aData[0].aActivityTypes);
            }
        };

        var onUsersWithCompaniesLoaded = function(aData) {
            var aFilteredUser = [];
            var iFilteredUserIndex = 0;
            var bMatchFound = false;
            for (var i = 0; i < aData.length; i++) {
                for (var j = 0; j < aData[i].CompanyDetails.results.length; j++) {
                    if (aData[i].CompanyDetails.results[j].CompanyName === cacheProvider.oUserProfile.sCurrentCompany) {
                        bMatchFound = true;
                        if (bMatchFound) {
                            aFilteredUser[iFilteredUserIndex] = aData[i];
                            iFilteredUserIndex = iFilteredUserIndex + 1;
                        }
                        if ($rootScope.sMode === 'create') {
                            oActivityWrapper.aData[0]._assignedUserName = $scope.sCurrentUser;
                        }
                        break;
                    }
                }
                if (!bMatchFound) {
                    continue;
                }
            }

            aData = [{}];
            aData = aFilteredUser;

            aData = $filter('orderBy')(aData, ["UserName"]);

            servicesProvider.constructDependentMultiSelectArray({
                oDependentArrayWrapper: {
                    aData: aData
                },
                oParentArrayWrapper: oActivityWrapper,
                sNameEN: "UserName",
                sNameFR: "UserName",
                sDependentKey: "UserName",
                sParentKey: "_assignedUserName",
                sTargetArrayNameInParent: "aUsers"
            });
            if (oActivityWrapper.aData[0]) {
                $scope.aUsers = angular.copy(oActivityWrapper.aData[0].aUsers);
            }
        };

        var getActivityDetails = function() {
            apiProvider.getActivity({
                sKey: sActivityGuid,
                sExpand: "AccountDetails/AccountTypeDetails,ActivityTypeDetails,ContactDetails,PhaseDetails/ProjectDetails,UnitDetails/PhaseDetails,UserDetails,FileMetadataSetDetails/FileMetadataDetails,CommentSetDetails/CommentDetails",
                bShowSpinner: true,
                onSuccess: onActivityDetailsLoaded,
            });
        };

        if ($rootScope.sMode !== "create") {
            if (angular.equals(oActivity, {})) { //in case of F5
                getActivityDetails();
            } else { //in case when data is retrieved from the cash
                setDisplayedActivityDetails(oActivity);

                apiProvider.getActivityTypes({
                    bShowSpinner: false,
                    onSuccess: onActivityTypesLoaded
                });

                apiProvider.getUsers({
                    sExpand: "CompanyDetails",
                    bShowSpinner: false,
                    onSuccess: onUsersWithCompaniesLoaded
                });

                apiProvider.getAccounts({
                    sExpand: "AccountTypeDetails",
                    bShowSpinner: false,
                    onSuccess: onAccountsLoaded
                });

                apiProvider.getContacts({
                    sExpand: "AccountDetails/AccountTypeDetails",
                    bShowSpinner: false,
                    onSuccess: onContactsWithAccountLoaded
                });
            }
        } else {
            $rootScope._aImages = [];    
            $rootScope.iImagesNumber = 0;
            $rootScope.iCommentsNumber = 0;
            constructPhasesMultiSelect({
                aSelectedPhases: []
            });

            getPhasesWithUnits([]);

            apiProvider.getActivityTypes({
                bShowSpinner: false,
                onSuccess: onActivityTypesLoaded
            });

            apiProvider.getUsers({
                sExpand: "CompanyDetails",
                bShowSpinner: false,
                onSuccess: onUsersWithCompaniesLoaded
            });

            apiProvider.getAccounts({
                sExpand: "AccountTypeDetails",
                bShowSpinner: false,
                onSuccess: onAccountsLoaded
            });

            apiProvider.getContacts({
                sExpand: "AccountDetails/AccountTypeDetails",
                bShowSpinner: false,
                onSuccess: onContactsWithAccountLoaded
            });
        }

        $scope.onEdit = function() {
            $state.go('app.activityDetailsWrapper.activityDetails', {
                sMode: "edit",
                sActivityGuid: $scope.oActivity._guid,
            });
        };


        var deleteActivity = function() {
            var oDataForSave = {
                GeneralAttributes: {
                    IsDeleted: true
                }
            };
            var onSuccessDelete = function() {
                historyProvider.navigateBack({
                    oState: $state
                });
            }
            oDataForSave.Guid = $scope.oActivity._guid;
            oDataForSave.LastModifiedAt = $scope.oActivity._lastModifiedAt;
            apiProvider.updateActivity({
                bShowSpinner: true,
                sKey: oDataForSave.Guid,
                oData: oDataForSave,
                bShowSuccessMessage: true,
                bShowErrorMessage: true,
                onSuccess: onSuccessDelete
            });
        };

        $scope.onDelete = function($event) {
            servicesProvider.showConfirmationPopup({
                sHeader: $translate.instant('activityDetails_deletionConfirmationHeader'),
                sContent: $translate.instant('activityDetails_deletionConfirmationContent'),
                sOk: $translate.instant('global_ok'),
                sCancel: $translate.instant('global_cancel'),
                onOk: deleteActivity,
                event: $event
            });
        };

        var prepareLinksForSave = function() { // link activity to phases
            var aLinks = [];
            var aUri = [];
            var sUri = "";

            for (var i = 0; i < $scope.aUserProjectsPhasesForMultiselect.length; i++) {
                if ($scope.aUserProjectsPhasesForMultiselect[i].ticked) {
                    sUri = "Phases('" + $scope.aUserProjectsPhasesForMultiselect[i].Guid + "')";
                    aUri.push(sUri);
                }
            }
            if (aUri.length) {
                aLinks.push({
                    sRelationName: "PhaseDetails",
                    bKeepCompanyDependentLinks: true,
                    aUri: aUri
                });
            }

            var aUri = [];
            if ($scope.aSelectedAccounts && $scope.aSelectedAccounts.length) {
                for (var i = 0; i < $scope.aSelectedAccounts.length; i++) {
                    sUri = "Accounts('" + $scope.aSelectedAccounts[i].Guid + "')";
                    aUri.push(sUri);
                    $scope.sAccountValues = $scope.sAccountValues + $scope.aSelectedAccounts[i].name + "; ";
                    $scope.sAccountGuids = $scope.sAccountGuids + $scope.aSelectedAccounts[i].Guid + "; ";
                }
            }
            aLinks.push({
                sRelationName: "AccountDetails",
                bKeepCompanyDependentLinks: true,
                aUri: aUri
            });

            var aUri = [];
            if ($scope.aSelectedContacts && $scope.aSelectedContacts.length) {
                for (var i = 0; i < $scope.aSelectedContacts.length; i++) {
                    sUri = "Contacts('" + $scope.aSelectedContacts[i].Guid + "')";
                    aUri.push(sUri);
                    //storing name plus , account for now... must improve this
                    $scope.sContactValues = $scope.sContactValues + $scope.aSelectedContacts[i].name + "; ";
                    $scope.sContactGuids = $scope.sContactGuids + $scope.aSelectedContacts[i].Guid + "; ";
                }
            }
            aLinks.push({
                sRelationName: "ContactDetails",
                bKeepCompanyDependentLinks: true,
                aUri: aUri
            });

            var aUri = [];

            if ($scope.aSelectedUnits && $scope.aSelectedUnits.length) {
                for (var i = 0; i < $scope.aSelectedUnits.length; i++) {
                    sUri = "Units('" + $scope.aSelectedUnits[i].Guid + "')";
                    aUri.push(sUri);
                    $scope.sUnitValues = $scope.sUnitValues + $scope.aSelectedUnits[i].name + "; ";
                    $scope.sUnitGuids = $scope.sUnitGuids + $scope.aSelectedUnits[i].Guid + "; ";
                }
            }
            aLinks.push({
                sRelationName: "UnitDetails",
                bKeepCompanyDependentLinks: true,
                aUri: aUri
            });
            return aLinks;
        };

        $scope.onCloseCheckSelectedPhasesLength = function() {
            if ($scope.aSelectedPhases.length != 0 && $rootScope.sMode !== "display") {
                // cacheProvider.cleanEntitiesCache("oPhaseEntity");
                $scope.onSelectedPhasesModified();
            }
        };

        $scope.onSelectedPhasesModified = function() {
            $scope.onDataModified();
            $scope.oForms.activityDetailsForm.selectedPhases.$setDirty();

            if ($scope.aSelectedPhases) {
                getPhasesWithUnits($scope.aSelectedPhases);
            }
        };

        //--added
        $scope.onCloseCheckSelectedTypesLength = function() {
            if ($scope.aSelectedActivityType.length == 0)
                $scope.onSelectedTypesModified();
        };

        $scope.onSelectedTypesModified = function() {
            $scope.onDataModified();
            $scope.oForms.activityDetailsForm.selectedActivityType.$setDirty();
        };
        //--end

        $scope.onDataModified = function() {
            $rootScope.bDataHasBeenModified = true;
        };

        $scope.onBack = function() {
            historyProvider.navigateBack({
                oState: $state
            });
        };

        $scope.onSave = function(bSaveAndNew, oNavigateTo) {
            if ($scope.oForms.activityDetailsForm.selectedPhases) {
                $scope.oForms.activityDetailsForm.selectedPhases.$setDirty(); //to display validation messages on submit press
            }
            if ($scope.oForms.activityDetailsForm.activityObject) {
                $scope.oForms.activityDetailsForm.selectedActivityType.$setDirty(); //to display validation messages on submit press
            }
            if ($scope.oForms.activityDetailsForm.selectedUser) {
                $scope.oForms.activityDetailsForm.selectedUser.$setDirty(); //to display validation messages on submit press
            }
            if ($scope.oForms.activityDetailsForm.activityObject) {
                $scope.oForms.activityDetailsForm.activityObject.$setDirty(); //to display validation messages on submit press
            }
            if (!$scope.oForms.activityDetailsForm.$valid) {
                return;
            }

            var oDataForSave = {
                GeneralAttributes: {}
            };
            var aLinks = [];

            oDataForSave.Guid = $scope.oActivity._guid;
            var onSuccessCreation = function(oData) {
                $rootScope.bDataHasBeenModified = false;
                if (oNavigateTo) {
                    $state.go(oNavigateTo.toState, oNavigateTo.toParams);
                    return; // to prevent switch to displaly mode otherwise navigation will be to display state and not away...
                }
                if (!bSaveAndNew) {
                    $state.go('app.activityDetailsWrapper.activityDetails', {
                        sMode: "display",
                        sActivityGuid: oData.Guid,
                    });

                    $scope.oActivity._lastModifiedAt = oData.LastModifiedAt;
                    $scope.oActivity.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
                    $scope.oActivity.sCreatedAt = utilsProvider.dBDateToSting(oData.CreatedAt);
                    if (oData.DueDate) {
                        $scope.oActivity.sDueDate = utilsProvider.dBDateToSting(oData.DueDate);
                    }
                    $scope.oActivity._guid = oData.Guid;
                } else {
                    $scope.oActivity.sObject = "";
                    $scope.oForms.activityDetailsForm.activityObject.$setPristine();
                    $scope.oActivity.sDescription = "";
                    $scope.oActivity.dDueDate = "/Date(0)/";

                }
            };
            var onSuccessUpdate = function(oData) {
                $rootScope.bDataHasBeenModified = false;
                if (oNavigateTo) {
                    $state.go(oNavigateTo.toState, oNavigateTo.toParams);
                    return; // to prevent switch to display mode otherwise navigation will be to display state and not away...
                }

                $scope.oActivity._lastModifiedAt = oData.LastModifiedAt;
                $scope.oActivity.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);

                $state.go('app.activityDetailsWrapper.activityDetails', {
                    sMode: "display",
                    sActivityGuid: oData.Guid,
                });
            };

            //oDataForSave.Guid = $scope.oActivity._guid;
            oDataForSave.Object = $scope.oActivity.sObject;
            oDataForSave.Description = $scope.oActivity.sDescription;

            if ($scope.aSelectedActivityType.length) {
                oDataForSave.ActivityTypeGuid = $scope.aSelectedActivityType[0].Guid;
            }

            if ($scope.aSelectedUser.length) {

                oDataForSave.AssignedUser = $scope.aSelectedUser[0].UserName;
            }

            if ($scope.oActivity.dDueDate && $scope.oActivity.dDueDate != "/Date(0)/") {
                oDataForSave.DueDate = "/Date(" + $scope.oActivity.dDueDate.getTime() + ")/";
            } else {
                oDataForSave.DueDate = "/Date(0)/";
            }


            $scope.sAccountValues = "";
            $scope.sAccountGuids = "";
            $scope.sContactValues = "";
            $scope.sContactGuids = "";
            $scope.sUnitValues = "";
            $scope.sUnitGuids = "";
            aLinks = prepareLinksForSave();
            oDataForSave.AccountValues = $scope.sAccountValues;
            oDataForSave.AccountGuids = $scope.sAccountGuids;
            oDataForSave.ContactValues = $scope.sContactValues;
            oDataForSave.ContactGuids = $scope.sContactGuids;
            oDataForSave.UnitValues = $scope.sUnitValues;
            oDataForSave.UnitGuids = $scope.sUnitGuids;

            oDataForSave.LastModifiedAt = $scope.oActivity._lastModifiedAt;

            switch ($rootScope.sMode) {
                case "edit":
                    apiProvider.updateActivity({
                        bShowSpinner: true,
                        sKey: oDataForSave.Guid,
                        oData: oDataForSave,
                        aLinks: aLinks,
                        bShowSuccessMessage: true,
                        bShowErrorMessage: true,
                        onSuccess: onSuccessUpdate
                    });
                    break;
                case "create":
                    if ($rootScope.sFileMetadataSetGuid) {
                        oDataForSave.FileMetadataSetGuid = $rootScope.sFileMetadataSetGuid;
                    }
                    apiProvider.createActivity({
                        bShowSpinner: true,
                        oData: oDataForSave,
                        aLinks: aLinks,
                        bShowSuccessMessage: true,
                        bShowErrorMessage: true,
                        onSuccess: onSuccessCreation,
                    });
                    break;
            }
        };

        $scope.onSaveAndNew = function() {
            $scope.onSave(true);
        };

        var saveAndLeaveView = function() {
            $scope.onSave(false, oNavigateToInfo);
        };

        var leaveView = function() {
            $rootScope.bDataHasBeenModified = false;
            $state.go(oNavigateToInfo.toState, oNavigateToInfo.toParams);
        };

        $scope.onDisplayPhotoGallery = function(oEvent) {
            oEvent.stopPropagation();
            if ( $rootScope._aImages.length) {
                servicesProvider.setUpPhotoGallery( $rootScope._aImages);
            }
        };        

        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if ($rootScope.bDataHasBeenModified) {
                event.preventDefault();

                oNavigateToInfo = {
                    toState: toState,
                    toParams: toParams
                };
                servicesProvider.showConfirmationPopup({
                    sHeader: $translate.instant('global_changesSaveConfirmationHeader'), //"Do you want to save changes before leaving the view?", //$translate.instant('userDetails_deletionConfirmationHeader'),
                    sContent: $translate.instant('global_changesSaveConfirmationContent'), //"Not saved changes will be lost...", //$translate.instant('userDetails_deletionConfirmationContent'),
                    sOk: $translate.instant('global_yes'),
                    sCancel: $translate.instant('global_no'),
                    onOk: saveAndLeaveView,
                    onCancel: leaveView,
                    event: event
                });
            }
        });	
    }
]);