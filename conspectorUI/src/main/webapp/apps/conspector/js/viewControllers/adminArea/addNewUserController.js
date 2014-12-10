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
viewControllers.controller('addNewUserView', function($scope, $rootScope, dataSrv, globalSrv, $state) {
   $rootScope.viewTitleTE = jQuery.i18n.prop('adminAreaView.addNewUserSubviewTitleTE');

   $scope.newTE = jQuery.i18n.prop('globalTE.saveAndNewTE');

	$scope.communicationLns = [{}, {}];
	$scope.communicationLns[0].description = jQuery.i18n.prop('global.englishTE');
	$scope.communicationLns[1].description = jQuery.i18n.prop('global.frenchTE');
	//$scope.refreshViewTE();

	$scope.communicationLns[0].code = "en";
	$scope.communicationLns[1].code = "fr";

	$scope.newUserInfo = {
		userName: "",
		email: "",
		password: "",
		confirmPassword: "",
		language: "en",
		role: "" //temporary, this info should be stored in DB
	};

	//temporary, this info should be stored in DB
	$scope.newUserInfo.role = globalSrv.getNewUserInitialRole();

	$scope.confirmPasswordFldKeyDown = function(event) {
		if (event.keyCode === 13) {
			$scope.onRegisterClick();
		}
	};

	$scope.onSaveAndNew = function() {
		$scope.newUserInfo.language = $scope.communicationLn.code;

		if ($scope.newUserInfo.password !== $scope.newUserInfo.confirmPassword) {
			noty({
				text: jQuery.i18n.prop('createNewUserView.passwordsDontMatchTE'),
				type: 'error',
				layout: CONSTANTS.messageDisplayLayout,
				timeout: CONSTANTS.messageDisplayTime
			});
			return;
		}

		var oNewUserInfoForCommit = jQuery.extend({}, $scope.newUserInfo);

		oNewUserInfoForCommit.password = CryptoJS.SHA512(oNewUserInfoForCommit.password).toString();
		var oCreateUserSrv = dataSrv.httpRequest("jsp/account/createUser.jsp", oNewUserInfoForCommit, "POST", true);
		oCreateUserSrv.then(function(oData) {
			var bNoErrorMessages = globalSrv.messagesHandler(oData.messages); 
			if(bNoErrorMessages){
				dataSrv.aUsers = [];
				$scope.newUserInfo = {
					userName: "",
					email: "",
					password: "",
					confirmPassword: "",
					language: "en",
					role: "" //temporary, this info should be stored in DB
				};
			}     		
		});
	};

	$scope.onBackClick = function(){
		$state.go('^.userManagement');
	};

	$scope.communicationLns = [{
		description: "English",
		code: "en"
	}, {
		description: "French",
		code: "fr"
	}];
	$scope.communicationLn = $scope.communicationLns[0];
});