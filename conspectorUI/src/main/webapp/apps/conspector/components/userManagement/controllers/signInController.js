viewControllers.controller('signInView', ['$scope', '$state', 'servicesProvider', 'dataProvider', '$cookieStore',
	function($scope, $state, servicesProvider, dataProvider, $cookieStore) {
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
			var SHA512 = new Hashes.SHA512;
			var oData = {
				userName: $scope.logInData.sUserName,
				password: $scope.logInData.sPassword
			};

			servicesProvider.logIn(oData, $scope.logInData.bRememberUserName);
		};

		$scope.passwordFldKeyDown = function(event) {
			if (event.keyCode === 13) {
				//$("#passwordFld").blur();
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
			//window.location.href = "#/forgotPassword";
			$state.go('forgotPassword', {
				sFromState: "signIn"
			});			
		};
	}
]);