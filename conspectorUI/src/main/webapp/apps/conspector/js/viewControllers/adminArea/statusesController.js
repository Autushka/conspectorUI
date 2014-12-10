viewControllers.controller('statusesView', function($scope, $rootScope, $filter, customSrv, dataSrv, ngTableParams) {
    $rootScope.viewTitleTE = jQuery.i18n.prop('adminAreaView.statusesSubviewTitleTE');
    $scope.newTE = jQuery.i18n.prop('globalTE.newTE');
    $scope.sortingSequenceTE = "Sorting sequence";
    $scope.associatedIconTE = jQuery.i18n.prop('statusesView.associatedIconTE');

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

    $scope.aStatusIcons = [];

    $scope.aStatusIcons.push({
        cssClasses: "icon-status conforme",
        iconDescription: "Done"
    });

    $scope.aStatusIcons.push({
        cssClasses: "icon-status in-progress",
        iconDescription: "In Progress"
    });

    $scope.aStatusIcons.push({
        cssClasses: "icon-status no-conforme",
        iconDescription: "No conforme"
    });

    $scope.aStatusIcons.push({
        cssClasses: "icon-status contractor-conforme",
        iconDescription: "Contractor Conforme"
    });

    $scope.aStatusIcons.push({
        cssClasses: "icon-status new_status",
        iconDescription: "New"
    });

    $scope.aStatusIcons.push({
        cssClasses: "icon-status pending",
        iconDescription: "Pending"
    });

    $scope.refreshEntities = function() {
        $scope.oTableDataArrays.aEntities = [];

        customSrv.getEntitySet({
            oReadServiceParameters: {
                path: "Status",
                filter: "rowId ge '0'",
                expand: "",
                showSpinner: true
            },
            oServiceProvider: customSrv,
            oCashProvider: customSrv,
            oCashProviderAttribute: "aStatuses",
            fnSuccessCallBack: function(aData) {
                $scope.setEntitiesTableData();
                $scope.tableInfoTotal = aData.length;
            }
        });
    };

    $scope.setEntitiesTableData = function() {
        $scope.oTableDataArrays.aEntities = customSrv.deepArrayCopy({
            aSourceArray: customSrv.aStatuses
        });

        for (var i = 0; i < $scope.oTableDataArrays.aEntities.length; i++) {
            customSrv.setAttributeFromArrayByKey({
                aArray: $scope.aStatusIcons,
                oObject: $scope.oTableDataArrays.aEntities[i],
                sArrayKey: "cssClasses",
                sObjectKey: "associatedIcon",
                sTargetAttribute: "_associatedIcon",
                oTargetObject: $scope.oTableDataArrays.aEntities[i],
            });
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
        customSrv.aStatuses = [];
        $scope.refreshEntities();
    };

    $scope.onEdit = function(oEntity) {
        oEntity._editMode = true;
    };

    $scope.prepareEntityForSave = function(oEntity) {
        var oEntityForSave = {};
        oEntityForSave.name = oEntity.name;
        oEntityForSave.associatedIcon = oEntity._associatedIcon.cssClasses;
        oEntityForSave.sortingSequence = oEntity.sortingSequence;
        return oEntityForSave;
    };

    $scope.onSave = function(oEntity, bWithoutSuccessMessage) {
        var oEntityForSave = {};
        oEntityForSave = $scope.prepareEntityForSave(oEntity);
        customSrv.aStatuses = [];

        if (oEntity.rowId !== undefined && oEntity.rowId !== "") {
            oEntityForSave.rowId = oEntity.rowId; //important! in put request id should be part of the payload
            var oUpdateEntitySrv = customSrv.updateODataEntityNew({
                oData: oEntityForSave,
                key: oEntity.rowId,
                path: "Status",
                bShowSuccessMessage: !bWithoutSuccessMessage,
                bShowErrorMessage: !bWithoutSuccessMessage
            });
            oUpdateEntitySrv.then(function(oData) {});
        } else {
            var oCreateEntitySrv = customSrv.createODataEntityNew({
                path: "Status",
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
        customSrv.aStatuses = [];
        var oDeleteEntitySrv = customSrv.deleteODataEntityNew({
            path: "Status",
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