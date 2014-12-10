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

app.controller('mainController', function($scope, $rootScope, dataSrv, $locale, globalSrv, $window, $modal, $timeout) {
	var setInitialCurrentLanguage = function() {
		switch ($scope.currentLanguage) {
			case "en":
				$scope.currentLanguageLb = "FR";
				break;
			case "fr":
				$scope.currentLanguageLb = "EN";
				break;
		}

		var sAppPathToBundles = 'apps/' + CONSTANTS.currentProject + '/bundles/';
		jQuery.i18n.properties({
			name: ['0Messages', '1appMessages'],
			path: ['bundles/', sAppPathToBundles],
			mode: 'both',
			language: $scope.currentLanguage,
			callback: function() {
				getUserData();
			},
		});
	};

	var setCurrentLanguageForSession = function() {
		$scope.oSetCurrentLanguage = dataSrv.httpRequest("jsp/account/setCurrentLanguage.jsp", {
			currentLanguage: $scope.currentLanguage
		}, "POST", false);
		$scope.oSetCurrentLanguage.then(function() {
			location.reload();
		});
	};

	$scope.onLanguageBtnLbClick = function() {
		var bAsGuest = false;
		if ($scope.globalData.userName === jQuery.i18n.prop('mainView.guestTE')) {
			bAsGuest = true;
		}

		switch ($scope.currentLanguage) {
			case "en":
				$scope.currentLanguage = "fr";
				break;
			case "fr":
				$scope.currentLanguage = "en";
				break;
		}
		setCurrentLanguageForSession();
	};

	$scope.onSignInLbClick = function() {
		if ($scope.globalData.userName === jQuery.i18n.prop('mainView.guestTE')) {
			window.location.href = "#/signIn/";
		} else {
			// globalSrv.closeChatRoom();
			var oSignOutSrv = dataSrv.httpRequest("jsp/initializeSessionVariables.jsp", {});
			oSignOutSrv.then(function(oData) {
				$scope.globalData.userName = jQuery.i18n.prop('mainView.guestTE');
				$scope.globalData.userRole = "";
				$scope.globalData.userRoles = [];
				globalSrv.setMenus("", $rootScope);
				window.location.href = "#/signIn/";
				if($rootScope.onLogOut !== undefined){
					$rootScope.onLogOut();					
				}
			});
		}
	};

	$scope.onSwitchRoleLbClick = function() {
		$scope.selectRole($rootScope);
	};

	var getUserData = function() {
		var fnOnGetCurrentUserNameSuccess = function(sData){
			if (sData === "") {
				$scope.globalData.userName = jQuery.i18n.prop('mainView.guestTE');
				globalSrv.setMenus("", $rootScope);
			} else {
				$scope.globalData.userName = sData;
				var oGetProfileSrv = dataSrv.httpRequest("jsp/account/getProfileData.jsp", {});
				oGetProfileSrv.then(function(oData) {
					globalSrv.setUserRoles($scope, oData[0].usersRolesRelations);
					if ($scope.globalData.userRoles.length > 1) {
						$scope.hideSwitchRoleLb = false;
					} else {
						$scope.hideSwitchRoleLb = true;
					}
				});
				
				dataSrv.ajaxRequest("jsp/account/getCurrentRole.jsp", {}, false, {onSuccess: function(sData){
					$scope.globalData.userRole = sData;
					globalSrv.setMenus(sData, $rootScope);					
				}});
//				
//				var oGetCurrentRoleSrv = dataSrv.httpRequest("jsp/account/getCurrentRole.jsp", {}, false);
//				oGetCurrentRoleSrv.then(function(sData) {
//					$scope.globalData.userRole = sData;
//					globalSrv.setMenus(sData, $rootScope);
//				});
			}
		};
		dataSrv.ajaxRequest("jsp/account/getCurrentUserName.jsp", {}, false, {onSuccess: fnOnGetCurrentUserNameSuccess});
	};

	$scope.selectRole = function($rootScope) {
		var modalInstance = $modal.open({ // modal role selection popup
			templateUrl: 'apps/conspector/views/popUps/roleSelectorPopUp.html',
			controller: roleSelectorPopUpController,
			resolve: {
				roles: function() {
					return $scope.globalData.userRoles;
				},
				currentRole: function() {
					return $scope.globalData.userRole;
				}
			}
		});

		modalInstance.result.then(function(selectedRole) {
			$scope.globalData.userRole = selectedRole;

			var oSetCurrentRoleSrv = dataSrv.httpRequest("jsp/account/setCurrentRole.jsp", {
				role: selectedRole
			}, "POST");
			oSetCurrentRoleSrv.then();

			globalSrv.setMenus($scope.globalData.userRole, $rootScope);
			window.location.href = globalSrv.getRoleInitialView($scope.globalData.userRole);

		}, function() {
			if ($scope.globalData.userRole === "") { // In case when Cancel button was clicked
				$scope.globalData.userRoles = [];
				$scope.globalData.userName = jQuery.i18n.prop('mainView.guestTE');
			}
		});
	};

	$scope.onContactUpClick = function($scope) {
		var modalInstance = $modal.open({ // modal role selection popup
			templateUrl: 'views/feedBackPopUp.html',
			controller: feedBackPopUpController,
			resolve: {}
		});

		modalInstance.result.then(function(feedBackData) {
			var oHttp = $http({
				url: "jsp/contactUs.jsp",
				method: "POST",
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: 'messageSubject=' + feedBackData.subject + '&messageText=' + feedBackData.message
			});

			oHttp.success(function(oData, status, headers, config) {
				noty({
					text: jQuery.i18n.prop('feedBackPopUp.sentTE'),
					type: 'success',
					layout: CONSTANTS.messageDisplayLayout,
					timeout: CONSTANTS.messageDisplayTime
				});
			});
		}, function() {});
	};

	// data
	$scope.globalData = {
		userName: jQuery.i18n.prop('mainView.guestTE'),
		userRoles: [],
		userRole: "",
		currentView: ""
	};

	$scope.hideSwitchRoleLb = true;
	$scope.$watch("globalData.userRoles", function() {
		if ($scope.globalData.userRoles.length > 1) {
			$scope.hideSwitchRoleLb = false;
		} else {
			$scope.hideSwitchRoleLb = true;
		}
	});

	$rootScope.mainNavigation = [];

	$rootScope.showSpinner = false;
	$rootScope.$on('LOAD', function() {
		$rootScope.showSpinner = true;
	});
	$rootScope.$on('UNLOAD', function() {
		$rootScope.showSpinner = false;
	});

	$rootScope.isGalleryHidden = true;
	$rootScope.galleryData = [];
	$rootScope.galleryListPosition = {
		left: "0px"
	};
	$rootScope.galleryPhotosLocation = "http://rabidgadfly.com/assets/angular/gallery1/";
	$rootScope.selectedPhotoID = "img/noAvatar.jpg";
	$rootScope.hideGallery = function() {
		$rootScope.isGalleryHidden = true;
		$timeout(function() {
			$rootScope.galleryListPosition = {
				left: "0px"
			};
			$rootScope.selectedPhoto = $rootScope.galleryData[0];
		}, 1000);
	};

	// logic
	var fnOnGetCurrentLanguageSuccess = function(sData){
		sData = sData.replace("'", "");
		$scope.currentLanguage = sData;
		setInitialCurrentLanguage();
	};

	dataSrv.ajaxRequest("jsp/account/getCurrentLanguage.jsp", {}, false, {onSuccess: fnOnGetCurrentLanguageSuccess});
});