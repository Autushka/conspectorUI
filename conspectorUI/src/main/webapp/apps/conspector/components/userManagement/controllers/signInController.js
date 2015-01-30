viewControllers.controller('signInView', ['$scope', '$rootScope', '$state', 'servicesProvider', 'dataProvider', '$cookieStore', 'utilsProvider', '$translate', 'historyProvider',
	function($scope, $rootScope, $state, servicesProvider, dataProvider, $cookieStore, utilsProvider, $translate, historyProvider) {
		$rootScope.sCurrentStateName = $state.current.name;

		//servicesProvider.logOut();

		$scope.oForms = {};

		var oSignInFormController = {};
		var sUserName = "";
		if ($cookieStore.get("userName")) {
			sUserName = $cookieStore.get("userName").sUserName;
		}

		$scope.logInData = {
			sUserName: sUserName,
			sPassword: "",
			bRememberUserName: true
		};

		$scope.onChangeLanguage = function() {
			servicesProvider.changeLanguage();
		}

		$scope.login = function() {
			$scope.oForms.signInForm.password.$setDirty();//to display validation messages on submit press
			$scope.oForms.signInForm.userName.$setDirty();

			if($scope.oForms.signInForm.$valid){
				var oData = {
					userName: $scope.logInData.sUserName,
					password: $scope.logInData.sPassword
				};

				servicesProvider.logIn(oData, $scope.logInData.bRememberUserName);				
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

		$scope.setForm = function(oForm){
			oSignInFormController = angular.copy(oForm);
		}
	}
]);