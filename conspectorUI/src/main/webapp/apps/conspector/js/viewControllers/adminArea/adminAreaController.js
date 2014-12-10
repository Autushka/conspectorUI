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
viewControllers.controller('adminAreaView', function($scope, $rootScope, $filter, $q, ngTableParams, dataSrv, globalSrv, $state) {
		$scope.userManagementTE = jQuery.i18n.prop('adminAreaView.userManagementTE');
		$scope.projectsTE = jQuery.i18n.prop('adminAreaView.projectsTE');
		$scope.phasesTE = jQuery.i18n.prop('adminAreaView.phasesTE');
		$scope.categoriesTE = jQuery.i18n.prop('adminAreaView.categoriesTE');
		$scope.statusesTE = jQuery.i18n.prop('adminAreaView.statuesTE');
		$scope.prioritiesTE = jQuery.i18n.prop('adminAreaView.prioritiesTE');
		$scope.accountTypesTE = jQuery.i18n.prop('adminAreaView.accountTypesTE');

		$scope.newRoleTE = jQuery.i18n.prop('userManagementView.newRoleTE');
		$scope.addRoleTE = jQuery.i18n.prop('userManagementView.addRoleTE');
		$scope.noteTE = jQuery.i18n.prop('userManagementView.noteTE');

		$scope.cancelTE = jQuery.i18n.prop('global.cancelTE');

		$scope.clearSortingTE = jQuery.i18n.prop('userManagementView.clearSortingTE');
		$scope.pageTE = jQuery.i18n.prop('userManagementView.pageTE');
		$scope.countPerPageTE = jQuery.i18n.prop('userManagementView.countPerPageTE');
		$scope.totalTE = jQuery.i18n.prop('userManagementView.totalTE');
		$scope.searchTE = jQuery.i18n.prop('userManagementView.searchTE');
		$scope.addNewUserTE = jQuery.i18n.prop('userManagementView.addNewUserTE');

		$scope.addNewProjectTE = jQuery.i18n.prop('projectsView.addNewProjectTE');
		$scope.actionTE = jQuery.i18n.prop('projectsView.actionTE');
		$scope.idTE = jQuery.i18n.prop('projectsView.idTE');
		$scope.descriptionTE = jQuery.i18n.prop('projectsView.descriptionTE');

		$scope.addNewStatusTE = jQuery.i18n.prop('statusesView.addNewStatusTE');
		$scope.backgroundColorTE = jQuery.i18n.prop('statusesView.backgroundColorTE');

		$scope.addNewPriorityTE = jQuery.i18n.prop('prioritiesView.addNewPriorityTE');

		$scope.addNewPhaseTE = jQuery.i18n.prop('phasesView.addNewPhaseTE');
		$scope.projectTE = jQuery.i18n.prop('phasesView.projectTE');

		$scope.addNewCategoryTE = jQuery.i18n.prop('categoriesView.addNewCategoryTE');

		$scope.addNewAccountTypeTE = jQuery.i18n.prop('accountTypesView.addNewAccountTypeTE');

		$scope.userNameTE = jQuery.i18n.prop('createNewUserView.userNameTE');
		$scope.emailTE = jQuery.i18n.prop('createNewUserView.emailTE');
		$scope.communicationLnTE = jQuery.i18n.prop('createNewUserView.communicationLnTE');
		$scope.passwordTE = jQuery.i18n.prop('createNewUserView.passwordTE');
		$scope.confirmPasswordTE = jQuery.i18n.prop('createNewUserView.confirmPasswordTE');
		$scope.registerTE = jQuery.i18n.prop('createNewUserView.registerTE');
		$scope.cancelTE = jQuery.i18n.prop('createNewUserView.cancelTE');

		$scope.backTE = jQuery.i18n.prop('global.backTE');

		$scope.aLeftSideNavigationLinks = [];

		$scope.aLeftSideNavigationLinks.push({
				linkTE: $scope.userManagementTE,
				arrowClasses: "arrow-right cnpNotTransparent",
				stateToNavigate: "^.userManagement",
				globalStateObject: $state,
				hash: "#/app/adminArea/userManagement"
		});

		$scope.aLeftSideNavigationLinks.push({
				linkTE: $scope.projectsTE,
				arrowClasses: "arrow-right",
				stateToNavigate: "^.projects",
				globalStateObject: $state,
				hash: "#/app/adminArea/projects"
		});		

		$scope.aLeftSideNavigationLinks.push({
				linkTE: $scope.phasesTE,
				arrowClasses: "arrow-right",
				stateToNavigate: "^.phases",
				globalStateObject: $state,
				hash: "#/app/adminArea/phases"
		});

		$scope.aLeftSideNavigationLinks.push({
				linkTE: $scope.statusesTE,
				arrowClasses: "arrow-right",
				stateToNavigate: "^.statuses",
				globalStateObject: $state,
				hash: "#/app/adminArea/statuses"
		});

		$scope.aLeftSideNavigationLinks.push({
				linkTE: $scope.prioritiesTE,
				arrowClasses: "arrow-right",
				stateToNavigate: "^.priorities",
				globalStateObject: $state,
				hash: "#/app/adminArea/priorities"
		});

		$scope.aLeftSideNavigationLinks.push({
				linkTE: $scope.accountTypesTE,
				arrowClasses: "arrow-right",
				stateToNavigate: "^.accountTypes",
				globalStateObject: $state,
				hash: "#/app/adminArea/accountTypes"
		});						

	var fnSetActiveSideNavigationLink = function(aLinks, oLink){
		if(oLink.arrowClasses.indexOf("cnpNotTransparent") >= 0){
			return;
		}
		for (var i = 0; i < aLinks.length; i++) {
			aLinks[i].arrowClasses = aLinks[i].arrowClasses.replace(" cnpNotTransparent", "");
		}
		oLink.arrowClasses = oLink.arrowClasses + " cnpNotTransparent";
	};	

	for (var i = 0; i < $scope.aLeftSideNavigationLinks.length; i++) {
		if(location.hash.indexOf($scope.aLeftSideNavigationLinks[i].hash) >= 0){
			fnSetActiveSideNavigationLink($scope.aLeftSideNavigationLinks, $scope.aLeftSideNavigationLinks[i]);
		}
	}

	$scope.onLeftSideNavigationLinkClick = function(aLinks, oLink){
		fnSetActiveSideNavigationLink(aLinks, oLink);
		oLink.globalStateObject.go(oLink.stateToNavigate);
	};
});
