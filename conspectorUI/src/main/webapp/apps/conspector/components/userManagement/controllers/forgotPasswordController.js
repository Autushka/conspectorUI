viewControllers.controller('forgotPasswordView', ['$scope', '$state', '$stateParams', 'utilsProvider', 'dataProvider', 'servicesProvider', 'apiProvider',
	function($scope, $state, $stateParams, utilsProvider, dataProvider, servicesProvider, apiProvider) {
		$scope.sSelectedResetType = "userName";
		var sFromState = $stateParams.sFromState;

		$scope.resetData = {
			sUserName: "",
			sEmail: ""
		};

		$scope.onChangeLanguage = function() {
			servicesProvider.changeLanguage();
		};

		$scope.onReset = function() {
			var oData = {
				userName: "",
				email: ""
			};
			var oSrv = {};

			if ($scope.sSelectedResetType === "userName") {
				oData.userName = $scope.resetData.sUserName;
			} else {
				oData.email = $scope.resetData.sEmail;
			}

			oSrv = apiProvider.resetPassword(oData);
			oSrv.then(function(oData) {
				var bNoErrorMessages = servicesProvider.messagesHandler(oData.messages);
			});
		};

		$scope.onResetTypeChange = function() {
			if ($scope.sSelectedResetType === "userName") {
				$scope.resetData.sEmail = "";
			} else {
				$scope.resetData.sUserName = "";
			}
		};
		
		$scope.onBack = function(){
			$state.go(sFromState);
		}
	}
]);