viewControllers.controller('deficiencyDetailsView', function($scope, $rootScope, $modal, $window, $timeout, $filter, $q, ngTableParams, dataSrv, globalSrv, $state, customSrv, FileUploader) {

    $scope.accountTE = jQuery.i18n.prop('deficiencyDetailsView.accountTE');
    $scope.addALocationTE = jQuery.i18n.prop('deficiencyDetailsView.addALocationTE');
    $scope.addATagTE = jQuery.i18n.prop('deficiencyDetailsView.addATagTE');
    $scope.attachmentsTabTE = jQuery.i18n.prop('deficiencyDetailsView.attachmentsTabTE');
    $scope.changesTE = jQuery.i18n.prop('deficiencyDetailsView.changesTE');
    $scope.creationDateTE = jQuery.i18n.prop('deficiencyDetailsView.creationDateTE');
    $scope.dateAndTimeTE = jQuery.i18n.prop('deficiencyDetailsView.dateAndTimeTE');
    $scope.deleteTE = jQuery.i18n.prop('deficiencyDetailsView.deleteTE');
    $scope.detailsTabTE = jQuery.i18n.prop('deficiencyDetailsView.detailsTabTE');
    $scope.editTE = jQuery.i18n.prop('deficiencyDetailsView.editTE');
    $scope.fieldNameTE = jQuery.i18n.prop('deficiencyDetailsView.fieldNameTE');
    $scope.fileNameTE = jQuery.i18n.prop('deficiencyDetailsView.fileNameTE');
    $scope.filesDropZoneTE = jQuery.i18n.prop('deficiencyDetailsView.filesDropZoneTE');
    $scope.fileSizeTE = jQuery.i18n.prop('deficiencyDetailsView.fileSizeTE');
    $scope.goBackTE = jQuery.i18n.prop('deficiencyDetailsView.goBackTE');
    $scope.historyTabTE = jQuery.i18n.prop('deficiencyDetailsView.historyTabTE');
    $scope.imagesTE = jQuery.i18n.prop('deficiencyDetailsView.imagesTE');
    $scope.locationTE = jQuery.i18n.prop('deficiencyDetailsView.locationTE');
    $scope.newValueTE = jQuery.i18n.prop('deficiencyDetailsView.newValueTE');
    $scope.noteTE = jQuery.i18n.prop('deficiencyDetailsView.noteTE');
    $scope.oldValueTE = jQuery.i18n.prop('deficiencyDetailsView.oldValueTE');
    $scope.operationTE = jQuery.i18n.prop('deficiencyDetailsView.operationTE');
    $scope.phaseTE = jQuery.i18n.prop('deficiencyDetailsView.phaseTE');
    $scope.priorityTE = jQuery.i18n.prop('deficiencyDetailsView.priorityTE');
    $scope.progressTE = jQuery.i18n.prop('deficiencyDetailsView.progressTE');
    $scope.projectTE = jQuery.i18n.prop('deficiencyDetailsView.projectTE');
    $scope.queueLengthTE = jQuery.i18n.prop('deficiencyDetailsView.queueLengthTE');
    $scope.queueProgressTE = jQuery.i18n.prop('deficiencyDetailsView.queueProgressTE');
    $scope.queueTE = jQuery.i18n.prop('deficiencyDetailsView.queueTE');
    $scope.saveAndNewTE = jQuery.i18n.prop('deficiencyDetailsView.saveAndNewTE');
    $scope.saveTE = jQuery.i18n.prop('deficiencyDetailsView.saveTE');
    $scope.selectFilesTE = jQuery.i18n.prop('deficiencyDetailsView.selectFilesTE');
    $scope.statusTE = jQuery.i18n.prop('deficiencyDetailsView.statusTE');
    $scope.tagsTE = jQuery.i18n.prop('deficiencyDetailsView.tagsTE');
    $scope.unitTE = jQuery.i18n.prop('deficiencyDetailsView.unitTE');
    $scope.uploadStatusTE = jQuery.i18n.prop('deficiencyDetailsView.uploadStatusTE');
    $scope.usernameTE = jQuery.i18n.prop('deficiencyDetailsView.usernameTE');
    $scope.viewTitleTE = jQuery.i18n.prop('deficiencyDetailsView.viewTitleTE');

    //TE used for histoty labels
    $scope.otherAttachmentsNumberTE = "Number of attached PDFs";
    $scope.locationTagsTE = "Location Tags";
    $scope.descriptionTagsTE = "Description Tags";
    $scope.deficiencyNoteTE = "Note";
    $scope.photoAttachmentsNumberTE = "Number of attached photos";
    $scope.contractorTE = "Contractor";
    //not used right now
    // $scope.durationTE = jQuery.i18n.prop('deficienciesView.durationTE');
    // $scope.dateTE = jQuery.i18n.prop('deficienciesView.dateTE');
    // $scope.dueDateTE = jQuery.i18n.prop('deficienciesView.dueDateTE');
    // $scope.authorTE = jQuery.i18n.prop('deficienciesView.authorTE');
    // $scope.assigneeTE = jQuery.i18n.prop('deficienciesView.assigneeTE');

    $scope.bNotSavedData = false;
    $scope.aHistoryOperations = [];

    $scope.getUnits = function(sProjectId, sPhaseId) {
        customSrv.getEntitySet({ // get Units
            oReadServiceParameters: {
                path: "Component",
                filter: "projectId eq '" + sProjectId + "' and versionId eq '" + sPhaseId + "'",
                expand: "",
                showSpinner: false
            },
            oServiceProvider: customSrv,
            fnSuccessCallBack: function(aData) {
                for (var i = 0; i < aData.length; i++) {
                    aData[i].name = customSrv.convertStringToInt(aData[i].name);
                }
                aData = $filter('orderBy')(aData, "name");
                $scope.aUnits = aData;

                var bSuccess = customSrv.setAttributeFromArrayByKey({
                    aArray: $scope.aUnits,
                    oObject: $scope.oDeficiency,
                    sArrayKey: "rowId",
                    sObjectKey: "componentId",
                    sTargetAttribute: "component",
                    oTargetObject: $scope.oDeficiency,
                });
                if (!bSuccess) {
                    if (aData.length > 0) {
                        $scope.oDeficiency.component = aData[0];
                    } else {
                        $scope.oDeficiency.componentId = "";
                    }
                }
            }
        });
    };

    $scope.getProjectsAndPhasesFromGlobalSelections = function() {
        var aProjects = [];
        angular.copy($rootScope.oGlobalSelections.aProjects, aProjects);
        aProjects = customSrv.extractSelectedItemsFromMultipleSelect({
            aMulriSelectItems: aProjects
        });
        return customSrv.adaptMultiSelectDataForSingeSelect({
            aMulriSelectItems: aProjects,
            sSelectionBasedOn: "rowId",
            sSelectionBasedOnValue: $scope.oDeficiency.versionId
        });
    };

    $scope.refreshUnits = function() {
        $scope.oSelectedProjectItem = customSrv.getFirstSelectedItemFromMultipleSelect({
            aMulriSelectItems: $scope.aProjects
        });
        $scope.getUnits($scope.oSelectedProjectItem.parentId, $scope.oSelectedProjectItem.rowId);
    };

    var offEventGlobalSelectionsChanged = $rootScope.$on("globalSelectionsChanged", function() {
        $scope.aProjects = $scope.getProjectsAndPhasesFromGlobalSelections();
        $scope.refreshUnits();
    });

    $scope.onSelectedPhaseChanged = function() {
        $scope.refreshUnits();
    };

    $scope.getUnitsByUser = function() {
        customSrv.getEntitySet({
            oReadServiceParameters: {
                path: "Contact",
                filter: "userName eq '" + $scope.globalData.userName + "'",
                expand: "",
                showSpinner: false
            },
            oServiceProvider: customSrv,
            fnSuccessCallBack: function(aData) {
                if (aData[0]) {
                    customSrv.getEntitySet({ // get Units
                        oReadServiceParameters: {
                            path: "Component",
                            filter: "ownerContactId eq '" + aData[0].rowId + "'",
                            expand: "",
                            showSpinner: false
                        },
                        oServiceProvider: customSrv,
                        fnSuccessCallBack: function(aData) {
                            for (var i = 0; i < aData.length; i++) {
                                aData[i].name = customSrv.convertStringToInt(aData[i].name);
                            }
                            aData = $filter('orderBy')(aData, "name");
                            $scope.aUnits = aData;


                            if ($scope.oDeficiency.rowId) {
                                var bSuccess = customSrv.setAttributeFromArrayByKey({
                                    aArray: $scope.aUnits,
                                    oObject: $scope.oDeficiency,
                                    sArrayKey: "rowId",
                                    sObjectKey: "componentId",
                                    sTargetAttribute: "component",
                                    oTargetObject: $scope.oDeficiency,
                                });
                                if (!bSuccess) {
                                    $scope.oDeficiency.componentId = "";
                                }
                            } else {
                                $scope.oDeficiency.component = $scope.aUnits[0];
                            }
                        }
                    });
                }
            }
        });
    };

    var setLocalDeficiency = function() {
        $scope.oDeficiency = jQuery.extend(true, {}, customSrv.oDeficiencyEntity.oCurrentDeficiency);

        if ($scope.globalData.userRole === "endUser") {
            $scope.getUnitsByUser();
        } 

        customSrv.getEntitySet({ // get Priorities
            oReadServiceParameters: {
                path: "Priority",
                filter: "rowId ge '0'",
                expand: "",
                showSpinner: false
            },
            oServiceProvider: customSrv,
            oCashProvider: customSrv,
            oCashProviderAttribute: "aPriorities",
            fnSuccessCallBack: function(aData) {
                $scope.aPriorities = $filter('orderBy')(aData, 'sortingSequence');
                if ($scope.oDeficiency.rowId) {
                    customSrv.setAttributeFromArrayByKey({
                        aArray: $scope.aPriorities,
                        oObject: $scope.oDeficiency,
                        sArrayKey: "rowId",
                        sObjectKey: "priorityId",
                        sTargetAttribute: "priority",
                        oTargetObject: $scope.oDeficiency,
                    });
                } else {
                    $scope.oDeficiency.priority = $scope.aPriorities[0];
                }
            }
        });

        customSrv.getEntitySet({ // get Accounts
            oReadServiceParameters: {
                path: "Contact",
                filter: "rowId ge '0'",
                expand: "",
                showSpinner: false
            },
            oServiceProvider: customSrv,
            oCashProvider: customSrv.oAccountEntity,
            oCashProviderAttribute: "aAccounts",
            fnSuccessCallBack: function(aData) {
                aData = $filter('orderBy')(aData, "firstName");
                $scope.aAccounts = aData;
                customSrv.setAttributeFromArrayByKey({
                    aArray: $scope.aAccounts,
                    oObject: $scope.oDeficiency,
                    sArrayKey: "rowId",
                    sObjectKey: "assigneeContactId",
                    sTargetAttribute: "assigneeContact",
                    oTargetObject: $scope.oDeficiency,
                });
            }
        });

        customSrv.getEntitySet({ // get Statuses
            oReadServiceParameters: {
                path: "Status",
                filter: "rowId ge '0'",
                expand: "",
                showSpinner: false
            },
            oServiceProvider: customSrv,
            oCashProvider: customSrv,
            oCashProviderAttribute: "aStatuses",
            fnSuccessCallBack: function(aData) {
                $scope.aStatuses = $filter('orderBy')(aData, 'sortingSequence');

                if ($scope.oDeficiency.rowId) {
                    customSrv.setAttributeFromArrayByKey({
                        aArray: $scope.aStatuses,
                        oObject: $scope.oDeficiency,
                        sArrayKey: "rowId",
                        sObjectKey: "statusId",
                        sTargetAttribute: "status",
                        oTargetObject: $scope.oDeficiency,
                    });
                } else {
                    if ($scope.globalData.userRole === "endUser" && $scope.aStatuses[4]) {
                        $scope.oDeficiency.status = $scope.aStatuses[4];
                    } else {
                        $scope.oDeficiency.status = $scope.aStatuses[0];
                    }
                }
            }
        });
    };

    $scope.setAttachmentsUrl = function() {
        $scope.sAttachmentsUrl = "rest/file/list/deficiency/" + $scope.oDeficiency.filesGuid + "/_attachments_";
    };

    $scope.getHistory = function() {
        $scope.aHistoryOperations = [];
        customSrv.getEntitySet({ // get Statuses
            oReadServiceParameters: {
                path: "ObjectHistory",
                filter: "objectId eq " + "'" + $scope.oDeficiency.rowId + "' and objectType eq 'Task'",
                expand: "",
                showSpinner: false
            },
            oServiceProvider: customSrv,
            fnSuccessCallBack: function(aData) {
                aData = $filter('orderBy')(aData, "timeStamp");
                for (var i = 0; i < aData.length; i++) {
                    var oHistotyOperation = {
                        operation: aData[i].operation,
                        userName: aData[i].userName,
                        timeStamp: customSrv.formatDBDate(aData[i].timeStamp)
                    };
                    if (i > 0) {
                        oHistotyOperation.aDetails = customSrv.constuctChangesDetails({
                            oldObject: $.parseJSON(aData[i - 1].objectJson),
                            currentObject: $.parseJSON(aData[i].objectJson)
                        });

                        for (var j = 0; j < oHistotyOperation.aDetails.length; j++) {
                            switch (oHistotyOperation.aDetails[j].fieldName) {
                                case "otherAttachmentsNumber":
                                    oHistotyOperation.aDetails[j].fieldName = $scope.otherAttachmentsNumberTE;
                                    break;
                                case "environment":
                                    oHistotyOperation.aDetails[j].fieldName = $scope.locationTagsTE;
                                    break;
                                case "labels":
                                    oHistotyOperation.aDetails[j].fieldName = $scope.descriptionTagsTE;
                                    break;
                                case "description":
                                    oHistotyOperation.aDetails[j].fieldName = $scope.deficiencyNoteTE;
                                    break;
                                case "attachmentsNumber":
                                    oHistotyOperation.aDetails[j].fieldName = $scope.photoAttachmentsNumberTE;
                                    break;
                                case "projectIdValue":
                                    oHistotyOperation.aDetails[j].fieldName = $scope.projectTE;
                                    break;
                                case "versionIdValue":
                                    oHistotyOperation.aDetails[j].fieldName = $scope.phaseTE;
                                    break;
                                case "componentIdValue":
                                    oHistotyOperation.aDetails[j].fieldName = $scope.unitTE;
                                    break;
                                case "assigneeContactIdValue":
                                    oHistotyOperation.aDetails[j].fieldName = $scope.contractorTE;
                                    break;
                                case "statusIdValue":
                                    oHistotyOperation.aDetails[j].fieldName = $scope.statusTE;
                                    break;
                                case "priorityIdValue":
                                    oHistotyOperation.aDetails[j].fieldName = $scope.priorityTE;
                                    break;
                            }
                        }
                    }
                    $scope.aHistoryOperations.push(oHistotyOperation);
                }
            }
        });
    };

    var resetView = function() {
        $scope.isDetailsTabActive = true;
        $scope.isAttachmentsTabActive = false;
        $scope.bDeficiencyDisplayMode = customSrv.oDeficiencyEntity.bDeficiencyDisplayMode;
        $scope.nUploadedFilesCounter = 0;

        $scope.temporaryAttachmentsGuid = "tempNew" + customSrv.generateGUID();
        if ($scope.oDeficiency.filesGuid === "" || $scope.oDeficiency.filesGuid === null || $scope.oDeficiency.filesGuid === undefined) {
            $scope.oDeficiency.filesGuid = customSrv.generateGUID();
        }

        $scope.setAttachmentsUrl();
        $scope.initializeFileUploader();
        if (JSON.stringify(customSrv.oDeficiencyEntity.oCurrentDeficiency) === JSON.stringify({})) {
            if (!customSrv.oDeficiencyEntity.bCreateNewMode) {
                if ($scope.globalData.userRole === "endUser") {
                    $state.go('^.deficienciesListEndUser');
                } else {
                    $state.go('^.deficienciesList');
                }
            }
            $scope.bNewDeficiencyCreation = true;
            $scope.oDeficiency.rowId = "";
            $scope.oDeficiency.description = "";
            $scope.oDeficiency.aTags = [];
            $scope.oDeficiency.aLocations = [];
            $scope.oDeficiency.assigneeContact = {};
            // $scope.oDeficiency.status = $scope.aStatuses[0];
            if($scope.aPriorities) {
                $scope.oDeficiency.priority = $scope.aPriorities[0]; 
            }  
            $scope.oAttachments = {
                aPhotos: [],
                aPDFs: []
            };
           //    $scope.oDeficiency.priority = $scope.aPriorities[0];        
            $scope.oDeficiency.createdDateFormated = customSrv.dateToString(new Date());
        } else {
            formatDeficiencyData();
        }
    };

    var initialize = function() {
        $scope.bNewDeficiencyCreation = false;
        // $scope.aPhotos = [];
        $scope.sAttachmentsUrl = "";

        $scope.aStatusIcons = [];

        $scope.aStatusIcons.push({
            cssClasses: "icon-status conforme",
            iconDescription: "Conform"
        });

        $scope.aStatusIcons.push({
            cssClasses: "icon-status in-progress",
            iconDescription: "In Progress"
        });

        $scope.aStatusIcons.push({
            cssClasses: "icon-status no-conforme",
            iconDescription: "Non conform"
        });

        $scope.aStatusIcons.push({
            cssClasses: "icon-status contractor-conforme",
            iconDescription: "Done by Contractor"
        });

        $scope.aStatusIcons.push({
            cssClasses: "icon-status new_status",
            iconDescription: "New"
        });

        $scope.aStatusIcons.push({
            cssClasses: "icon-status pending",
            iconDescription: "Pending"
        });

        setLocalDeficiency();

        $scope.aProjects = $scope.getProjectsAndPhasesFromGlobalSelections();
        $scope.refreshUnits();

        resetView();

        getDeficiencyAttachments();
        $scope.getHistory();
    };

    $scope.setIsDetailsTabActive = function(bValue) {
        if (!bValue) {
            $scope.isAttachmentsTabActive = true;
            $scope.isDetailsTabActive = false;
        } else {
            $scope.isDetailsTabActive = true;
            $scope.isAttachmentsTabActive = false;
        }
    };

    var formatDeficiencyData = function() {
        $scope.oDeficiency.createdDateFormated = customSrv.formatDBDate($scope.oDeficiency.createdDate);
        $scope.oDeficiency.aTags = customSrv.tagsStringToTagsArray($scope.oDeficiency.labels);
        $scope.oDeficiency.aLocations = customSrv.tagsStringToTagsArray($scope.oDeficiency.environment);
    };

    var getDeficiencyAttachments = function(bAfterRemove) {
        $scope.oAttachments = {
            aPhotos: [],
            aPDFs: []
        };
        var oGetDeficienciesAttachments = dataSrv.httpRequest($scope.sAttachmentsUrl, {});
        oGetDeficienciesAttachments.then(function(aData) {
            for (var i = 0; i < aData.length; i++) {
                if (aData[i].isDeleted !== true) {
                    if (aData[i].fileExtention.toUpperCase() === ".JPG" || aData[i].fileExtention.toUpperCase() === ".JPEG" || aData[i].fileExtention.toUpperCase() === ".PNG" || aData[i].fileExtention === ".GIF" || aData[i].fileExtention === ".BMP") {
                        $scope.oAttachments.aPhotos.push(aData[i]);
                    }
                    if (aData[i].fileExtention.toUpperCase() === ".PDF") {
                        $scope.oAttachments.aPDFs.push(aData[i]);
                    }

                }
            }

            var sTemporaryAttachmentsUrl = "rest/file/list/deficiency/" + $scope.temporaryAttachmentsGuid + "/_attachments_";
            var oGetTemporaryAttachments = dataSrv.httpRequest(sTemporaryAttachmentsUrl, {});
            oGetTemporaryAttachments.then(function(aData) {
                for (var i = 0; i < aData.length; i++) {
                    if (aData[i].isDeleted !== true) {
                        if (aData[i].fileExtention.toUpperCase() === ".JPG" || aData[i].fileExtention.toUpperCase() === ".JPEG" || aData[i].fileExtention.toUpperCase() === ".PNG" || aData[i].fileExtention === ".GIF" || aData[i].fileExtention === ".BMP") {
                            $scope.oAttachments.aPhotos.push(aData[i]);
                        }
                        if (aData[i].fileExtention.toUpperCase() === ".PDF") {
                            $scope.oAttachments.aPDFs.push(aData[i]);
                        }
                    }
                }

                if ($scope.oAttachments.aPhotos.length === 0 && $scope.oAttachments.aPDFs.length === 0) {
                    $scope.setIsDetailsTabActive(true);
                } else {
                    if (bAfterRemove) {
                        $scope.setIsDetailsTabActive(false);
                    }
                }
                $scope.oDeficiency.photosNumber = $scope.oAttachments.aPhotos.length;
                $scope.oDeficiency.otherAttachmentsNumber = $scope.oAttachments.aPDFs.length;
            });
        });
    };

    $scope.showDeficiencyPhotos = function($event) {
        $event.stopPropagation();
        customSrv.setUpPhotoGallery($scope.oAttachments.aPhotos);
    };

    $scope.initializeFileUploader = function() {
        dataSrv.ajaxRequest("rest/file/createUploadUrl/deficiency/" + $scope.temporaryAttachmentsGuid + "/_attachments_", {}, false, {
            onSuccess: function(sUrl) {
                var uploader = $scope.uploader = new FileUploader({
                    scope: $scope,
                    url: sUrl,
                    autoUpload: true,
                });

                uploader.onSuccessItem = function(item, response, status, headers) {
                    $scope.nUploadedFilesCounter++;
                    $scope.bNotSavedData = true;
                    if ($scope.nUploadedFilesCounter === uploader.queue.length) {
                        getDeficiencyAttachments();
                    }
                };

                uploader.filters.push({
                    name: 'imageFilter',
                    fn: function(item /*{File|FileLikeObject}*/ , options) {
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        return '|jpg|png|jpeg|bmp|gif|pdf|'.indexOf(type) !== -1;
                    }
                });
            }
        }, "GET");
    };

    $scope.onProjectChange = function() {
        $scope.oDeficiency.versionId = "";
        $scope.getPhases($scope.oDeficiency.project.rowId);
        $scope.bNotSavedData = true;
    };

    $scope.onPhaseChange = function() {
        $scope.getUnits($scope.oDeficiency.project.rowId, $scope.oDeficiency.phase.rowId);
        $scope.bNotSavedData = true;
    };

    $scope.onDataChange = function() {
        $scope.bNotSavedData = true;
    };

    $scope.onDelete = function() {
        var oDeficiencyForSave = {};
        oDeficiencyForSave = $scope.prepareDeficiencyForSave();
        oDeficiencyForSave.isDeleted = true;
        oDeficiencyForSave.rowId = $scope.oDeficiency.rowId; //important! in put request id should be part of the payload
        var oUpdateDeficiencySrv = customSrv.updateODataEntityNew({
            oData: oDeficiencyForSave,
            key: $scope.oDeficiency.rowId,
            path: "Task",
            bShowSuccessMessage: true,
            bShowErrorMessage: true,
            oPendingRequestFor: {
                aEntities: ["oDeficiencyEntity"]
            },
        });
        oUpdateDeficiencySrv.then(function(oData) {
            customSrv.oDeficiencyEntity.oCurrentDeficiency = {};
            $scope.bNewDeficiencyCreation = false;
            $state.go(customSrv.backNavigationFromDeficiencyDetailsTo);
        });
    };

    $scope.onEdit = function() {
        customSrv.oDeficiencyEntity.bDeficiencyDisplayMode = false;
        $scope.bDeficiencyDisplayMode = false;
    };

    $scope.prepareDeficiencyForSave = function() {
        var oDeficiencyForSave = {};

        if ($scope.oDeficiency.priority && $scope.oDeficiency.priority.rowId) {
            oDeficiencyForSave.priorityId = $scope.oDeficiency.priority.rowId;
            oDeficiencyForSave.priorityIdValue = $scope.oDeficiency.priority.name;
        } else {
            oDeficiencyForSave.priorityId = $scope.oDeficiency.priorityId;
        }

        oDeficiencyForSave.description = $scope.oDeficiency.description.replace(/(\r\n|\n|\r)/gm, " ");//removing empty lines that case issues with parse json for the history

        oDeficiencyForSave.createdDate = $scope.oDeficiency.createdDate;
        $scope.oDeficiency.labels = customSrv.tagsArrayToTagsString($scope.oDeficiency.aTags);
        oDeficiencyForSave.labels = customSrv.tagsArrayToTagsString($scope.oDeficiency.aTags);
        $scope.oDeficiency.environment = customSrv.tagsArrayToTagsString($scope.oDeficiency.aLocations);
        oDeficiencyForSave.environment = customSrv.tagsArrayToTagsString($scope.oDeficiency.aLocations);

        if ($scope.oDeficiency.component && $scope.oDeficiency.component.rowId) {
            oDeficiencyForSave.componentId = $scope.oDeficiency.component.rowId;
            oDeficiencyForSave.componentIdValue = $scope.oDeficiency.component.name.toString();
            oDeficiencyForSave.projectId = $scope.oDeficiency.component.projectId;
            oDeficiencyForSave.projectIdValue = $scope.oSelectedProjectItem.parentName;            
            oDeficiencyForSave.versionId = $scope.oDeficiency.component.versionId;
            oDeficiencyForSave.versionIdValue = $scope.oSelectedProjectItem.name;            
        } else {
            oDeficiencyForSave.componentId = null;
            oDeficiencyForSave.projectId = null;
            oDeficiencyForSave.versionId = null;

        }
        if ($scope.oDeficiency.status && $scope.oDeficiency.status.rowId) {
            oDeficiencyForSave.statusId = $scope.oDeficiency.status.rowId;
            oDeficiencyForSave.statusIdValue = $scope.oDeficiency.status.name;
        } else {
            oDeficiencyForSave.statusId = null;
        }
        if ($scope.oDeficiency.assigneeContact && $scope.oDeficiency.assigneeContact.rowId) {
            oDeficiencyForSave.assigneeContactId = $scope.oDeficiency.assigneeContact.rowId;
            oDeficiencyForSave.assigneeContactIdValue = $scope.oDeficiency.assigneeContact.firstName;
        } else {
            oDeficiencyForSave.assigneeContactId = null;
        }

        oDeficiencyForSave.filesGuid = $scope.oDeficiency.filesGuid;
        oDeficiencyForSave.attachmentsNumber = $scope.oDeficiency.photosNumber;
        oDeficiencyForSave.otherAttachmentsNumber = $scope.oDeficiency.otherAttachmentsNumber;

        oDeficiencyForSave.createdBy = $scope.oDeficiency.createdBy;
        oDeficiencyForSave.isDeleted = false;

        return oDeficiencyForSave;
    };

    $scope.saveTemporaryAttachments = function(sFilesGuid, sTempFilesGuid) {
        customSrv.getEntitySet({ // get Statuses
            oReadServiceParameters: {
                path: "FileMetadata",
                filter: "catalogId eq " + "'" + sTempFilesGuid + "'",
                expand: "",
                showSpinner: false
            },
            oServiceProvider: customSrv,
            fnSuccessCallBack: function(aData) {
                for (var i = 0; i < aData.length; i++) {
                    aData[i].catalogId = sFilesGuid; //$scope.oDeficiency.filesGuid;
                    var oUpdateTemporatyAttachmentsSrv = customSrv.updateODataEntityNew({
                        oData: aData[i],
                        key: aData[i].rowId,
                        path: "FileMetadata",
                        bShowSuccessMessage: false,
                        bShowErrorMessage: false
                    });
                }
            }
        });
    };

    $scope.validateData = function(oData){
        var bReturnValue = true;

        if(!oData.projectId || !oData.versionId || !oData.componentId || !oData.statusId){
            bReturnValue = false;
        }
        return bReturnValue;
    };

    $scope.onSave = function(bSaveAndNew) {
        var oDeficiencyForSave = {};
        oDeficiencyForSave = $scope.prepareDeficiencyForSave();

        var bDataIsValide = $scope.validateData(oDeficiencyForSave);
        if(!bDataIsValide){
            customSrv.showNotyMessage({sMessageText:"There are mandatory fields that are not populated", sMessageType: 'error'});
            return;
        }        

        if ($scope.oDeficiency.rowId !== undefined && $scope.oDeficiency.rowId !== "") {
            oDeficiencyForSave.rowId = $scope.oDeficiency.rowId; //important! in put request id should be part of the payload
            var oUpdateDeficiencySrv = customSrv.updateODataEntityNew({
                oData: oDeficiencyForSave,
                key: $scope.oDeficiency.rowId,
                path: "Task",
                bShowSuccessMessage: true,
                bShowErrorMessage: true,
                oPendingRequestFor: {
                    aEntities: ["oDeficiencyEntity"]
                },
            });
            oUpdateDeficiencySrv.then(function(oData) {
                customSrv.oDeficiencyEntity.aDeficiencies = [];
                customSrv.oDeficiencyEntity.oCurrentDeficiency = oDeficiencyForSave;
                customSrv.oDeficiencyEntity.bDeficiencyDisplayMode = true;

                if ($scope.globalData.userRole !== "endUser") {
                    $scope.bDeficiencyDisplayMode = true;
                }
                $scope.saveTemporaryAttachments($scope.oDeficiency.filesGuid, $scope.temporaryAttachmentsGuid);
                $scope.bNotSavedData = false;
                $state.go(customSrv.backNavigationFromDeficiencyDetailsTo);                
               // $scope.getHistory();
            });
        } else {
            oDeficiencyForSave.createdDate = new Date();
            oDeficiencyForSave.createdBy = $scope.globalData.userName;

            var oCreateDeficiencySrv = customSrv.createODataEntityNew({
                path: "Task",
                oData: oDeficiencyForSave,
                bShowSuccessMessage: true,
                oPendingRequestFor: {
                    aEntities: ["oDeficiencyEntity"]
                },
            });
            oCreateDeficiencySrv.then(function(oData) {
                $scope.saveTemporaryAttachments($scope.oDeficiency.filesGuid, $scope.temporaryAttachmentsGuid);
                $scope.bNotSavedData = false;
                if (!bSaveAndNew) {
                    $scope.oDeficiency.rowId = oData.rowId;
                    $scope.bNewDeficiencyCreation = false;
                    customSrv.oDeficiencyEntity.bDeficiencyDisplayMode = true;
                    customSrv.oDeficiencyEntity.bCreateNewMode = false;
                    if ($scope.globalData.userRole !== "endUser") {
                        $scope.bDeficiencyDisplayMode = true;
                    }
                    //$scope.getHistory();
                    $state.go(customSrv.backNavigationFromDeficiencyDetailsTo);
                } else {
                    $scope.bNotSavedData = true;
                    customSrv.oDeficiencyEntity.oCurrentDeficiency = {};
                    $scope.oDeficiency.filesGuid = "";
                    $scope.oAttachments = {};
                    resetView();
                }
                customSrv.oDeficiencyEntity.oCurrentDeficiency = oData;
            });
        }
    };

    $scope.onSaveAndNew = function() {
        $scope.onSave(true);
    };

    $scope.onFormKeyPress = function(event) {
        if (event.keyCode === 13) {
            event.preventDefault(); // prevent auto cancel button click by entering Enter in the form fields
        }
    };

    $scope.onUnitLink = function() {
        customSrv.oUnitEntity.bUnitDisplayMode = true;
        customSrv.oUnitEntity.oCurrentUnit = jQuery.extend(true, {}, $scope.oDeficiency.component);
        $state.go('app.unitDetails');
        customSrv.backNavigationFromUnitDetailsTo = 'app.deficiencyDetails';
    };

    $scope.onAccountLink = function() {
        customSrv.oAccountEntity.bAccountDisplayMode = true;
        customSrv.oAccountEntity.oCurrentAccount = jQuery.extend(true, {}, $scope.oDeficiency.assigneeContact);
        $state.go('app.accountDetails');
        customSrv.backNavigationFromAccountDetailsTo = 'app.deficiencyDetails';
    };

    $scope.onBackClick = function() {
        $state.go(customSrv.backNavigationFromDeficiencyDetailsTo);
    };

    $scope.onDisplayAttachment = function(oAttachment) {
        $window.open("rest/file/get/" + oAttachment.rowId);
    };

    $scope.onRemoveAttachment = function(attachment) {
        var oGetAttachmentForSrv = customSrv.readODataEntityNew({
            key: attachment.rowId,
            path: "FileMetadata",
            bShowSuccessMessage: false,
            bShowErrorMessage: false
        });
        oGetAttachmentForSrv.then(function(oData) {
            if (oData.catalogId.indexOf("temp") >= 0) {
                var oDeleteTempAttachmentSrv = customSrv.deleteODataEntityNew({
                    path: "FileMetadata",
                    key: oData.rowId,
                    bShowSuccessMessage: false,
                    bShowErrorMessage: false
                });
                oDeleteTempAttachmentSrv.then(function() {
                    getDeficiencyAttachments(true);
                });
            } else {
                oData.isDeleted = true;
                oData.catalogId = $scope.temporaryAttachmentsGuid;
                var oAttachmentRemoveSrv = customSrv.updateODataEntityNew({
                    oData: oData,
                    key: oData.rowId,
                    path: "FileMetadata",
                    bShowSuccessMessage: false,
                    bShowErrorMessage: false
                });
                oAttachmentRemoveSrv.then(function(oData) {
                    getDeficiencyAttachments();
                });
            }
        });

        $scope.bNotSavedData = true;
    };

    $scope.putBackRemovedAttachments = function() {
        customSrv.getEntitySet({
            oReadServiceParameters: {
                path: "FileMetadata",
                filter: "catalogId eq " + "'" + $scope.temporaryAttachmentsGuid + "' and isDeleted eq 'true'",
                expand: "",
                showSpinner: false
            },
            oServiceProvider: customSrv,
            fnSuccessCallBack: function(aData) {
                for (var i = 0; i < aData.length; i++) {
                    aData[i].isDeleted = false;
                    aData[i].catalogId = $scope.oDeficiency.filesGuid;
                    var oPutBackRemovedAttachmentSrv = customSrv.updateODataEntityNew({
                        oData: aData[i],
                        key: aData[i].rowId,
                        path: "FileMetadata",
                        bShowSuccessMessage: false,
                        bShowErrorMessage: false
                    });
                }
            }
        });
    };

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if ($scope.bNotSavedData) {
            event.preventDefault();

            var modalInstance = $modal.open({ // modal role selection popup
                templateUrl: 'apps/conspector/views/popUps/notSavedDataPopUp.html',
                controller: notSavedDataPopUpController,
                resolve: {}
            });

            modalInstance.result.then(function(bSaveBeforeLeaving) {
                if (bSaveBeforeLeaving) {
                    $scope.onSave();
                    $scope.bNotSavedData = false;
                    $state.go(toState, toParams);
                } else {
                    $scope.bNotSavedData = false;

                    $scope.putBackRemovedAttachments();

                    $state.go(toState, toParams);
                }
            });
        }
    });

    $scope.$on("$destroy", function() {
        offEventGlobalSelectionsChanged();

        if ($scope.bNotSavedData) {
            $scope.bNotSavedData = false;
            $scope.putBackRemovedAttachments();
        }
    });

    initialize();
});