viewControllers.controller('accountDetailsView', function($scope, $rootScope, $window, $timeout, $filter, $q, ngTableParams, dataSrv, globalSrv, $state, customSrv, FileUploader) {
    
    $scope.accountDetailsTabTE = jQuery.i18n.prop('accountDetailsView.accountDetailsTabTE');
    $scope.accountTypeTE = jQuery.i18n.prop('accountDetailsView.accountTypeTE');
    $scope.addATagTE = jQuery.i18n.prop('accountDetailsView.addATagTE');
    $scope.addressTE = jQuery.i18n.prop('accountDetailsView.addressTE');
    $scope.cityTE = jQuery.i18n.prop('accountDetailsView.cityTE');
    $scope.deleteTE = jQuery.i18n.prop('accountDetailsView.deleteTE');
    $scope.editTE = jQuery.i18n.prop('accountDetailsView.editTE');
    $scope.emailTE = jQuery.i18n.prop('accountDetailsView.emailTE');
    $scope.goBackTE = jQuery.i18n.prop('accountDetailsView.goBackTE');
    $scope.nameTE = jQuery.i18n.prop('accountDetailsView.nameTE');
    $scope.postalCodeTE = jQuery.i18n.prop('accountDetailsView.postalCodeTE');
    $scope.primaryPhoneTE = jQuery.i18n.prop('accountDetailsView.primaryPhoneTE');
    $scope.saveAndNewTE = jQuery.i18n.prop('accountDetailsView.saveAndNewTE');
    $scope.saveTE = jQuery.i18n.prop('accountDetailsView.saveTE');
    $scope.tagsTE = jQuery.i18n.prop('accountDetailsView.tagsTE');
    $scope.viewTitleTE = jQuery.i18n.prop('accountDetailsView.viewTitleTE');

    $scope.bAccountDisplayMode = customSrv.oAccountEntity.bAccountDisplayMode;
    $scope.bNewAccountCreation = false;

    var initialize = function() {
        setLocalAccount();

        if (JSON.stringify(customSrv.oAccountEntity.oCurrentAccount) === JSON.stringify({})) {

            if ($scope.bAccountDisplayMode) { // in case of F5 pressed;
                $state.go('^.accountsList');
            }

            $scope.bNewAccountCreation = true;
            $scope.oAccount.rowId = "";
        } else {
            formatAccountData();
        }
    };

    $scope.getAccountTypes = function() {
        customSrv.getEntitySet({ // get Statuses
            oReadServiceParameters: {
                path: "ContactType",
                filter: "rowId ge '0'",
                expand: "",
                showSpinner: false
            },
            oServiceProvider: customSrv,
            oCashProvider: customSrv,
            oCashProviderAttribute: "aAccountTypes",
            fnSuccessCallBack: function(aData) {
                $scope.aAccountTypes = aData;

                if ($scope.oAccount.rowId) {
                    customSrv.setAttributeFromArrayByKey({
                        aArray: $scope.aAccountTypes,
                        oObject: $scope.oAccount,
                        sArrayKey: "rowId",
                        sObjectKey: "contactTypeId",
                        sTargetAttribute: "accountType",
                        oTargetObject: $scope.oAccount,
                    });
                }else{
                    $scope.oAccount.accountType = $scope.aAccountTypes[0];
                }
            }
        });
    };

    var formatAccountData = function() {
        $scope.oAccount.aTags = customSrv.tagsStringToTagsArray($scope.oAccount.title);
    };

    var setLocalAccount = function() {
        $scope.oAccount = jQuery.extend(true, {}, customSrv.oAccountEntity.oCurrentAccount);
        $scope.getAccountTypes();

        customSrv.getEntitySet({ // get Users
            oReadServiceParameters: {
                path: "User",
                filter: "userName ne ''",
                expand: "",
                showSpinner: false
            },
            oServiceProvider: customSrv,
           // oCashProvider: customSrv.oAccountEntity,
           //oCashProviderAttribute: "aAccounts",
            fnSuccessCallBack: function(aData) {
                aData = $filter('orderBy')(aData, "userName");

                $scope.aUsers = aData;

                customSrv.setAttributeFromArrayByKey({
                    aArray: $scope.aUsers,
                    oObject: $scope.oAccount,
                    sArrayKey: "userName",
                    sObjectKey: "userName",
                    sTargetAttribute: "user",
                    oTargetObject: $scope.oAccount,
                });
            }
        });           
    };

    $scope.onDelete = function() {
        var oDeleteAccountSrv = customSrv.deleteODataEntityNew({
            path: "Contact",
            key: $scope.oAccount.rowId,
            bShowSuccessMessage: true,
            bShowErrorMessage: true
        });
        oDeleteAccountSrv.then(function() {
            customSrv.oAccountEntity.oCurrentAccount = {};
            $scope.bNewAccountCreation = false;
            customSrv.removeArrayElementByKey({
                aArray: customSrv.oAccountEntity.aAccounts,
                oObject: $scope.oAccount,
                sArrayKey: "rowId",
                sObjectKey: "rowId"
            });
            $state.go(customSrv.backNavigationFromAccountDetailsTo);
        });
    };

    $scope.onEdit = function() {
        customSrv.oAccountEntity.bAccountDisplayMode = false;
        $scope.bAccountDisplayMode = false;
    };

    $scope.onSaveAndNew = function() {
        $scope.onSave(true);
        customSrv.oDeficiencyEntity.oCurrentDeficiency = {};
        initialize();        
    };

    $scope.prepareEntityForSave = function() {
        var oEntityForSave = {};

        if ($scope.oAccount.accountType && $scope.oAccount.accountType.rowId) {
            oEntityForSave.contactTypeId = $scope.oAccount.accountType.rowId;
        }

        if ($scope.oAccount.user && $scope.oAccount.user.userName) {
            oEntityForSave.userName = $scope.oAccount.user.userName;
        }        
        oEntityForSave.title = customSrv.tagsArrayToTagsString($scope.oAccount.aTags);
        oEntityForSave.firstName = $scope.oAccount.firstName;
        oEntityForSave.phone = $scope.oAccount.phone;
        oEntityForSave.addres = $scope.oAccount.addres;
        oEntityForSave.email = $scope.oAccount.email;
        oEntityForSave.city = $scope.oAccount.city;
        oEntityForSave.postalCode = $scope.oAccount.postalCode;

        return oEntityForSave;
    };

    $scope.onSave = function(bSaveAndNew) {
        var oEntityForSave = {};
        oEntityForSave = $scope.prepareEntityForSave();

        if ($scope.oAccount.rowId !== undefined && $scope.oAccount.rowId !== "") {
            oEntityForSave.rowId = $scope.oAccount.rowId; //important! in put request id should be part of the payload
            var oUpdateEntitySrv = customSrv.updateODataEntityNew({
                oData: oEntityForSave,
                key: $scope.oAccount.rowId,
                path: "Contact",
                bShowSuccessMessage: true,
                bShowErrorMessage: true
            });
            oUpdateEntitySrv.then(function(oData) {
                customSrv.oAccountEntity.aAccounts = [];
                $scope.bAccountDisplayMode = true;
            });
        } else {
            var oCreateEntitySrv = customSrv.createODataEntityNew({
                path: "Contact",
                oData: oEntityForSave,
                bShowSuccessMessage: true,
                bShowErrorMessage: true
            });
            oCreateEntitySrv.then(function(oData) {
                if (!bSaveAndNew) {
                    $scope.bNewAccountCreation = false;
                    $scope.oAccount.rowId = oData.rowId;                    
                }
                customSrv.oAccountEntity.aAccounts = [];
            });
        }
    };

    $scope.onFormKeyPress = function(event) {
        if (event.keyCode === 13) {
            event.preventDefault(); // prevent auto cancel button click by entering Enter in the form fields
        }
    };

    $scope.onBackClick = function() {
        $state.go(customSrv.backNavigationFromAccountDetailsTo);
    };

    initialize();
});