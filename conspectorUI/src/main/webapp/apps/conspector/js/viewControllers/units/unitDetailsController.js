viewControllers.controller('unitDetailsView', function($scope, $rootScope, $window, $timeout, $filter, $q, ngTableParams, dataSrv, globalSrv, $state, customSrv, FileUploader) {
    
    $scope.deleteTE = jQuery.i18n.prop('unitDetailsView.deleteTE');
    $scope.editTE = jQuery.i18n.prop('unitDetailsView.editTE');
    $scope.goBackTE = jQuery.i18n.prop('unitDetailsView.goBackTE');
    $scope.ownerTE = jQuery.i18n.prop('unitDetailsView.ownerTE');
    $scope.phaseTE = jQuery.i18n.prop('unitDetailsView.phaseTE');
    $scope.projectTE = jQuery.i18n.prop('unitDetailsView.projectTE');
    $scope.saveAndNewTE = jQuery.i18n.prop('unitDetailsView.saveAndNewTE');
    $scope.saveTE = jQuery.i18n.prop('unitDetailsView.saveTE');
    $scope.unitTE = jQuery.i18n.prop('unitDetailsView.unitTE');
    $scope.viewTitleTE = jQuery.i18n.prop('unitDetailsView.viewTitleTE');
    $scope.unitDetailsTabTE = jQuery.i18n.prop('unitDetailsView.unitDetailsTabTE');
    
    //not used right now
    // $scope.option1TE = jQuery.i18n.prop('unitsView.option1TE');
    // $scope.option2TE = jQuery.i18n.prop('unitsView.option2TE');
    $scope.bUnitDisplayMode = customSrv.oUnitEntity.bUnitDisplayMode;
    $scope.bNewUnitCreation = false;

    $scope.getProjectsAndPhasesFromGlobalSelections = function() {
        var aProjects = [];
        angular.copy($rootScope.oGlobalSelections.aProjects, aProjects);
        aProjects = customSrv.extractSelectedItemsFromMultipleSelect({
            aMulriSelectItems: aProjects
        });
        return customSrv.adaptMultiSelectDataForSingeSelect({
            aMulriSelectItems: aProjects,
            sSelectionBasedOn: "rowId",
            sSelectionBasedOnValue: $scope.oUnit.versionId
        });
    };

    $scope.refreshProjects = function() {
        $scope.aProjects = $scope.getProjectsAndPhasesFromGlobalSelections();

        $scope.oSelectedProjectItem = customSrv.getFirstSelectedItemFromMultipleSelect({
            aMulriSelectItems: $scope.aProjects
        });
    };

    var initialize = function() {
        setLocalUnit();
        $scope.refreshProjects();

        if (JSON.stringify(customSrv.oUnitEntity.oCurrentUnit) === JSON.stringify({})) {

            if ($scope.bUnitDisplayMode) { // in case of F5 pressed;
                $state.go('^.unitsList');
            }

            $scope.bNewUnitCreation = true;
            $scope.oUnit.rowId = "";
        }
    };

    var offEventGlobalSelectionsChanged = $rootScope.$on("globalSelectionsChanged", function() {
        $scope.refreshProjects();
    });

    $scope.onSelectedPhaseChanged = function() {
        $scope.oSelectedProjectItem = customSrv.getFirstSelectedItemFromMultipleSelect({
            aMulriSelectItems: $scope.aProjects
        });
    };    

    var setLocalUnit = function() {
        $scope.oUnit = jQuery.extend(true, {}, customSrv.oUnitEntity.oCurrentUnit);

        customSrv.getEntitySet({ // get Accounts
            oReadServiceParameters: {
                path: "Contact",
                filter: "rowId ge '0'",
                expand: "",
                showSpinner: false
            },
            oServiceProvider: customSrv,
            // oCashProvider: customSrv.oAccountEntity,
            //oCashProviderAttribute: "aAccounts",
            fnSuccessCallBack: function(aData) {
                aData = $filter('orderBy')(aData, "firstName");

                $scope.aOwners = aData;

                customSrv.setAttributeFromArrayByKey({
                    aArray: $scope.aOwners,
                    oObject: $scope.oUnit,
                    sArrayKey: "rowId",
                    sObjectKey: "ownerContactId",
                    sTargetAttribute: "owner",
                    oTargetObject: $scope.oUnit,
                });
            }
        });
    };

    $scope.onDelete = function() {
        var oDeleteUnitSrv = customSrv.deleteODataEntityNew({
            path: "Component",
            key: $scope.oUnit.rowId,
            bShowSuccessMessage: true,
            bShowErrorMessage: true
        });
        oDeleteUnitSrv.then(function() {
            customSrv.oUnitEntity.oCurrentUnit = {};
            $scope.bNewUnitCreation = false;
            customSrv.removeArrayElementByKey({
                aArray: customSrv.oUnitEntity.aUnits,
                oObject: $scope.oUnit,
                sArrayKey: "rowId",
                sObjectKey: "rowId"
            });
            $state.go(customSrv.backNavigationFromUnitDetailsTo);
        });
    };

    $scope.onEdit = function() {
        customSrv.oUnitEntity.bUnitDisplayMode = false;
        $scope.bUnitDisplayMode = false;
    };

    $scope.onSaveAndNew = function() {
        $scope.onSave(true);
        customSrv.oUnitEntity.oCurrentUnit = {};
        initialize();
    };

    $scope.prepareEntityForSave = function() {
        var oEntityForSave = {};
        if ($scope.oSelectedProjectItem) {
            oEntityForSave.projectId = $scope.oSelectedProjectItem.parentId;
            oEntityForSave.versionId = $scope.oSelectedProjectItem.rowId;
        }

        if ($scope.oUnit.owner && $scope.oUnit.owner.rowId) {
            oEntityForSave.ownerContactId = $scope.oUnit.owner.rowId;
        }

        oEntityForSave.name = $scope.oUnit.name.toString();
        return oEntityForSave;
    };

    $scope.onSave = function(bSaveAndNew) {
        var oEntityForSave = {};
        oEntityForSave = $scope.prepareEntityForSave();

        if ($scope.oUnit.rowId !== undefined && $scope.oUnit.rowId !== "") {
            oEntityForSave.rowId = $scope.oUnit.rowId; //important! in put request id should be part of the payload
            var oUpdateEntitySrv = customSrv.updateODataEntityNew({
                oData: oEntityForSave,
                key: $scope.oUnit.rowId,
                path: "Component",
                bShowSuccessMessage: true,
                bShowErrorMessage: true
            });
            oUpdateEntitySrv.then(function(oData) {
                customSrv.oUnitEntity.aUnits = [];
                $scope.bUnitDisplayMode = true;
            });
        } else {
            var oCreateEntitySrv = customSrv.createODataEntityNew({
                path: "Component",
                oData: oEntityForSave,
                bShowSuccessMessage: true,
                bShowErrorMessage: true
            });
            oCreateEntitySrv.then(function(oData) {
                if (!bSaveAndNew) {
                    $scope.bNewUnitCreation = false;
                    $scope.oUnit.rowId = oData.rowId;
                }
                customSrv.oUnitEntity.aUnits = [];
            });
        }
    };

    $scope.onFormKeyPress = function(event) {
        if (event.keyCode === 13) {
            event.preventDefault(); // prevent auto cancel button click by entering Enter in the form fields
        }
    };

    $scope.onBackClick = function() {
        $state.go(customSrv.backNavigationFromUnitDetailsTo);
    };

    $scope.onAccountLink = function() {
        customSrv.oAccountEntity.bAccountDisplayMode = true;
        customSrv.oAccountEntity.oCurrentAccount = jQuery.extend(true, {}, $scope.oUnit.owner);
        $state.go('app.accountDetails');
        customSrv.backNavigationFromAccountDetailsTo = 'app.unitDetails';
    };

    initialize();

    $scope.$on("$destroy", function() {
        offEventGlobalSelectionsChanged();
    });
});