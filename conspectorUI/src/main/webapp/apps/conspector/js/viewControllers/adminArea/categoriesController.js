/*
 * #%L
 * ProjectX2013_03_23_web
 * %%
 * Copyright (C) 2013 - 2014 Powered by Sergey
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
 viewControllers.controller('categoriesView', function($scope, $rootScope, $filter, customSrv, $timeout, dataSrv, ngTableParams) {
     $rootScope.viewTitleTE = jQuery.i18n.prop('adminAreaView.categoriesSubviewTitleTE');
     $rootScope.viewTitleTECode = 'adminAreaView.categoriesSubviewTitleTE';

     $scope.oTableDataArrays = {
         aCategories: []
     };
     $scope.oTableData = {};

     $scope.refreshCategories = function() {
         $scope.oTableDataArrays.aCategories = [];
         customSrv.aCategories = [];
         $scope.oTableData.aDisplayedCategories = [];

         if (CONSTANTS.areDeficiencyEntitiesFake) {
             $scope.oGetCategoriesSrv = dataSrv.getFakeData("apps/conspector/js/fakeData/fakeCategoriesV3.json", true);
             $scope.oGetCategoriesSrv.then(function(aData) {
                 for (var i = 0; i < aData.length; i++) {
                     aData[i].editMode = false;
                 }

                 customSrv.aCategories = aData;
                 $scope.setCategoriesTableData();
             });
         }
     };

     $scope.setCategoriesTableData = function() {
         $scope.oTableDataArrays.aCategories = customSrv.deepArrayCopy({
             aSourceArray: customSrv.aCategories
         });

         if (!$scope.oCategoriesTable) {
             $scope.oCategoriesTable = customSrv.createNgTableParams({
                 oTableDataArrays: $scope.oTableDataArrays,
                 oTableData: $scope.oTableData,
                 sSourceDataArrayAttribute: "aCategories",
                 sTargerObjectAttribute: "aDisplayedCategories"
             });
         } else {
             $scope.oCategoriesTable.reload();
         }
     };

     // if (!customSrv.aCategories.length) {
     //     $scope.refreshCategories();
     // } else {
     //     $scope.setCategoriesTableData();
     // }

     // $scope.$watch("filter.$", function() {
     //     if ($scope.filter) {
     //         $scope.oCategoriesTable.parameters().filter.$ = $scope.filter.$;
     //         $scope.oCategoriesTable.reload();
     //     }
     // });

     $scope.onRefreshCategoriesList = function() {
         $scope.refreshCategories();
     };
     $scope.onEdit = function(oCategory) {
         oCategory.editMode = true;
     };
     $scope.onSave = function(oCategory, bWithoutSuccessMessage) {
         oCategory.editMode = false;

         customSrv.aCategories = customSrv.updateOrAddItemToArrayByKey({
             aArray: customSrv.aCategories,
             oObject: oCategory,
             sArrayKey: "categoryID",
             sObjectKey: "categoryID"
         });
         if (!bWithoutSuccessMessage) {
             noty({
                 text: jQuery.i18n.prop('globalTE.successOperationNoticeTE'),
                 type: 'success',
                 layout: CONSTANTS.messageDisplayLayout,
                 timeout: CONSTANTS.messageDisplayTime
             });
         }
     };

     $scope.onSaveAll = function() {
         for (var i = 0; i < $scope.oTableDataArrays.aCategories.length; i++) {
             if ($scope.oTableDataArrays.aCategories[i].editMode === true) {
                 $scope.onSave($scope.oTableDataArrays.aCategories[i], true);
             }
         }
         noty({
             text: jQuery.i18n.prop('globalTE.successOperationNoticeTE'),
             type: 'success',
             layout: CONSTANTS.messageDisplayLayout,
             timeout: CONSTANTS.messageDisplayTime
         });
     };

     $scope.onAddCategory = function() {
         //additional logic required to link to DB
         $scope.oTableDataArrays.aCategories.push({
             editMode: true,
             categoryID: Math.floor((Math.random() * 1000) + 1).toString(),
             description: " "
         });
         $scope.oCategoriesTable.reload();
     };
     $scope.onRemove = function(oCategory) {
         customSrv.aCategories = customSrv.removeArrayElementByKey({
             aArray: customSrv.aCategories,
             oObject: oCategory,
             sArrayKey: "categoryID",
             sObjectKey: "categoryID"
         });

         $scope.oTableDataArrays.aCategories = customSrv.removeArrayElementByKey({
             aArray: $scope.oTableDataArrays.aCategories,
             oObject: oCategory,
             sArrayKey: "categoryID",
             sObjectKey: "categoryID"
         });
         $scope.oCategoriesTable.reload();
     };

     $scope.onClearFiltering = function() {
         $scope.oCategoriesTable.sorting({});
         $scope.oCategoriesTable.filter({});
         $scope.filter = "";
         $scope.oCategoriesTable.reload();
     };     
 });