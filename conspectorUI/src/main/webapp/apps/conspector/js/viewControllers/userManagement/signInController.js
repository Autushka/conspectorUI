viewControllers.controller('signInView', function($scope, $state, $rootScope, dataSrv, $modal, utilsProvider, dataProvider, cashProvider, apiProvider) {
	$scope.userNameTE = jQuery.i18n.prop('signInView.userNameTE');
	$scope.loginTE = jQuery.i18n.prop('signInView.loginTE');
	$scope.passwordTE = jQuery.i18n.prop('signInView.passwordTE');
	$scope.forgotPasswordTE = jQuery.i18n.prop('signInView.forgotPasswordTE');
	$scope.createUserTE = jQuery.i18n.prop('signInView.createUserTE');

	$rootScope.viewTitleTE = jQuery.i18n.prop('signInView.viewTitleTE');

	$scope.viewData = {
		userName: "",
		password: ""
	};

	$scope.login = function() {
		var oData = {
			userName: $scope.viewData.userName,
			password: CryptoJS.SHA512($scope.viewData.password).toString()
		};
		var oSignInSrv = dataSrv.httpRequest("jsp/account/login.jsp", oData, "POST", true);
		oSignInSrv.then(function(oData) {
			var bNoErrorMessages = utilsProvider.messagesHandler(oData.messages);
			if (bNoErrorMessages) {
				cashProvider.oUserProfile = apiProvider.getUserProfile($scope.viewData.userName);

				if(!cashProvider.oUserProfile.aUserRoles.length){
					utilsProvider.displayMessage("Contact your system administrator", "error");
					return;
				}

				if(cashProvider.oUserProfile.bIsInitialPassword){
					window.location.href = "#/InitialPasswordReset";
					return;
				}

				if(cashProvider.oUserProfile.aUserRoles.length === 1){
					cashProvider.oUserProfile.sCurrentRole = cashProvider.oUserProfile.aUserRoles[0];
					window.location.href = MENUS.oInitialViews[cashProvider.oUserProfile.sCurrentRole];
					//navigation to the initial view for the role
				}else{
					window.location.href = "#/RoleSelection";
					return;					
				}
			}

			// if (bNoErrorMessages) {
			// 	var oGetProfileSrv = dataSrv.httpRequest("jsp/account/getProfileData.jsp", {});
			// 	oGetProfileSrv.then(function(oData) {
			// 		$scope.globalData.userRoles = [];
					
			// 		globalSrv.setUserRoles($scope, oData[0].usersRolesRelations);
					
			// 		if ($scope.globalData.userRoles.length > 1) {
			// 			$scope.selectRole($rootScope);
			// 		}
			// 		if ($scope.globalData.userRoles.length === 1) {
			// 			$scope.globalData.userRole = $scope.globalData.userRoles[0].description;

			// 			var oSetCurrentRoleSrv = dataSrv.httpRequest("jsp/account/setCurrentRole.jsp", {
			// 				role: $scope.globalData.userRole
			// 			}, "POST");
			// 			oSetCurrentRoleSrv.then();

			// 			globalSrv.setMenus($scope.globalData.userRole, $rootScope);
			// 			//window.location.href = globalSrv.getRoleInitialView($scope.globalData.userRole);
			// 			window.location.href = globalSrv.getRoleInitialView($scope.globalData.userRole);
			// 			//window.location.href = "#/app/deficienciesList";//"#/app/deficienciesList";

			// 		}
			// 		if ($scope.globalData.userRoles.length === 0) {
			// 			noty({
			// 				text: jQuery.i18n.prop('signInView.userLockedTE'),
			// 				type: 'error',
			// 				layout: CONSTANTS.messageDisplayLayout,
			// 				timeout: CONSTANTS.messageDisplayTime
			// 			});
			// 			return;
			// 		}
			// 		$scope.globalData.userName = $scope.viewData.userName;
			// 	});
			// }
		});
	};

	$scope.passwordFldKeyDown = function(event) {
		if (event.keyCode === 13) {
			$("#passwordFld").blur();
			this.login();
		}
	};

	$scope.onSignInClick = function() {
		this.login();
	};
});
