viewControllers.controller('signInView', ['$scope', '$state', 'servicesProvider', 'dataProvider', '$cookieStore', 'utilsProvider', '$translate', 'historyProvider',
	function($scope, $state, servicesProvider, dataProvider, $cookieStore, utilsProvider, $translate, historyProvider) {
		$scope.sCurrentStateName = $state.current.name;

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
			if (!$scope.logInData.sUserName || !$scope.logInData.sPassword) {
				utilsProvider.displayMessage({
					sText: $translate.instant("global_emptyFields"),
					sType: 'error'
				});
				return;
			}

			var oData = {
				userName: $scope.logInData.sUserName,
				password: $scope.logInData.sPassword
			};

			servicesProvider.logIn(oData, $scope.logInData.bRememberUserName);
		};

		$scope.passwordFldKeyDown = function(event) {
			if (event.keyCode === 13) {
				this.login();
			}
		};

		$scope.onSignInClick = function() {
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
				sStateName: $scope.sCurrentStateName
			});
		});
	}
]);