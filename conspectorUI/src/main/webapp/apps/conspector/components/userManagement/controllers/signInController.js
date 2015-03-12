viewControllers.controller('signInView', ['$scope', '$rootScope', '$state', 'servicesProvider', 'dataProvider', '$cookieStore', 'utilsProvider', '$translate', 'historyProvider', 'CONSTANTS', '$localStorage',
	function($scope, $rootScope, $state, servicesProvider, dataProvider, $cookieStore, utilsProvider, $translate, historyProvider, CONSTANTS, $localStorage) {
		$rootScope.sCurrentStateName = $state.current.name;

		//servicesProvider.logOut();

		$scope.oForms = {};

		var oSignInFormController = {};

		$scope.bRememberUserName = true;
		// var sUserName = "";
		// var sPassword = "";
		// if ($cookieStore.get("userName")) {
		// 	sUserName = $cookieStore.get("userName").sUserName;

		// 	if(CONSTANTS.bIsHybridApplication){
		// 		sPassword = $cookieStore.get("userName").sPassword;
		// 	}
		// }

		// $scope.logInData = {
		// 	sUserName: sUserName,
		// 	sPassword: sPassword,
		// 	bRememberUserName: true
		// };

		$scope.onChangeLanguage = function() {
			servicesProvider.changeLanguage();
		}

		$scope.$storage = $localStorage;

		$scope.login = function() {
			$scope.oForms.signInForm.password.$setDirty(); //to display validation messages on submit press
			$scope.oForms.signInForm.userName.$setDirty();

			if ($scope.oForms.signInForm.$valid) {
				var oData = {
					userName: $scope.$storage.sUserName,
					password: $scope.$storage.sPassword
				};

				var onSuccess = function(){
					if(!$scope.bRememberUserName){
						delete $localStorage.sUserName;
						delete $localStorage.sPassword;
					}
					// if(!CONSTANTS.bIsHybridApplication){
					// 	delete $localStorage.sPassword;
					// }
				};

				servicesProvider.logIn({
					oData: oData,
					onSuccess: onSuccess
				});

			}
		};

		$scope.passwordFldKeyDown = function(event) {
			if (event.keyCode === 13) {
				this.login();
			}
		};

		$scope.onSignInClick = function() {
			$scope.bSubmitted = true;
			this.login();
		};

		$scope.onSwitchLanguage = function() {
			utilsProvider.switchLanguage();
		};

		$scope.onForgotPassword = function() {
			$state.go('forgotPassword');
		};

		$scope.$on("$destroy", function() {
			historyProvider.addStateToHistory({
				sStateName: $rootScope.sCurrentStateName
			});
		});

		$scope.setForm = function(oForm) {
			oSignInFormController = angular.copy(oForm);
		}
	}
]);