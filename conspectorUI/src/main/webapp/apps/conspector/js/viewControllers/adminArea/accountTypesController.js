viewControllers.controller('accountTypesView', function($scope, $rootScope, $filter, customSrv, dataSrv, ngTableParams) {
    $rootScope.viewTitleTE = jQuery.i18n.prop('adminAreaView.accountTypesSubviewTitleTE');
    $scope.newTE = jQuery.i18n.prop('globalTE.newTE');

    $scope.oTableDisplayParameters = {
        bShowSearchBox: false,
        bShowFilterButton: false,
        bShowClearFilterButton: false,
        bShowSaveAllButton: true
    };

    $scope.oTableDataArrays = {
        aEntities: []
    };
    $scope.oTableData = {};

    $scope.refreshEntities = function() {
        $scope.oTableDataArrays.aEntities = [];

        customSrv.getEntitySet({
            oReadServiceParameters: {
                path: "ContactType",
                filter: "rowId ge '0'",
                expand: "",
                showSpinner: true
            },
            oServiceProvider: customSrv,
            oCashProvider: customSrv,
            oCashProviderAttribute: "aAccountTypes",
            fnSuccessCallBack: function(aData) {
                $scope.setEntitiesTableData();
                $scope.tableInfoTotal = aData.length;
            }
        });
    };

    $scope.setEntitiesTableData = function() {
        $scope.oTableDataArrays.aEntities = customSrv.deepArrayCopy({
            aSourceArray: customSrv.aAccountTypes
        });

        for (var i = 0; i < $scope.oTableDataArrays.aEntities.length; i++) {
            $scope.oTableDataArrays.aEntities[i]._editMode = false;
        }

        if (!$scope.oListTable) {
            $scope.oListTable = customSrv.createNgTableParams({
                oTableDataArrays: $scope.oTableDataArrays,
                oTableData: $scope.oTableData,
                sSourceDataArrayAttribute: "aEntities",
                sTargerObjectAttribute: "aDisplayedEntities"
            });
        } else {
            $scope.oListTable.reload();
        }
    };

    $scope.refreshEntities();

    $scope.onRefreshList = function() {
        customSrv.aAccountTypes = [];
        $scope.refreshEntities();
    };

    $scope.onEdit = function(oEntity) {
        oEntity._editMode = true;
    };

    $scope.prepareEntityForSave = function(oEntity) {
        var oEntityForSave = {};
        oEntityForSave.name = oEntity.name;
        return oEntityForSave;
    };

    $scope.onSave = function(oEntity, bWithoutSuccessMessage) {
        var oEntityForSave = {};
        oEntityForSave = $scope.prepareEntityForSave(oEntity);
        customSrv.aAccountTypes = [];        

        if (oEntity.rowId !== undefined && oEntity.rowId !== "") {
            oEntityForSave.rowId = oEntity.rowId; //important! in put request id should be part of the payload
            var oUpdateEntitySrv = customSrv.updateODataEntityNew({
                oData: oEntityForSave,
                key: oEntity.rowId,
                path: "ContactType",
                bShowSuccessMessage: !bWithoutSuccessMessage,
                bShowErrorMessage: !bWithoutSuccessMessage
            });
            oUpdateEntitySrv.then(function(oData) {});
        } else {
            var oCreateEntitySrv = customSrv.createODataEntityNew({
                path: "ContactType",
                oData: oEntityForSave,
                bShowSuccessMessage: !bWithoutSuccessMessage,
                bShowErrorMessage: !bWithoutSuccessMessage
            });
            oCreateEntitySrv.then(function(oData) {
                oEntity.rowId = oData.rowId;
            });
        }
        oEntity._editMode = false;
    };

    $scope.onSaveAll = function() { //a batch request should be here
        for (var i = 0; i < $scope.oTableDataArrays.aEntities.length; i++) {
            if ($scope.oTableDataArrays.aEntities[i]._editMode === true) {
                $scope.onSave($scope.oTableDataArrays.aEntities[i]);
            }
        }
    };

    $scope.onAddNew = function() {
        $scope.oTableDataArrays.aEntities.push({
            _editMode: true,
            rowId: "",
            name: " "
        });
        $scope.oListTable.reload();
        $scope.tableInfoTotal = $scope.oTableDataArrays.aEntities.length;
    };

    $scope.onRemove = function(oEntity) {
        customSrv.aAccountTypes = [];
        var oDeleteEntitySrv = customSrv.deleteODataEntityNew({
            path: "ContactType",
            key: oEntity.rowId,
            bShowSuccessMessage: true,
            bShowErrorMessage: true
        });
        oDeleteEntitySrv.then(function() {
            $scope.oTableDataArrays.aEntities = customSrv.removeArrayElementByKey({
                aArray: $scope.oTableDataArrays.aEntities,
                oObject: oEntity,
                sArrayKey: "rowId",
                sObjectKey: "rowId"
            });
            $scope.oListTable.reload();
            $scope.tableInfoTotal = $scope.oTableDataArrays.aEntities.length;
        });
    };
});