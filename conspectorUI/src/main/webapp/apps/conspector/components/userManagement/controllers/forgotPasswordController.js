viewControllers.controller('forgotPasswordView', ['$scope', '$rootScope', '$state', '$stateParams', 'utilsProvider', 'dataProvider', 'servicesProvider', 'apiProvider', '$translate',
	function($scope, $rootScope, $state, $stateParams, utilsProvider, dataProvider, servicesProvider, apiProvider, $translate) {
		$scope.sSelectedResetType = "userName";

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

			if (!oData.userName && !oData.email) {
				utilsProvider.displayMessage({
					sText: $translate.instant("global_emptyFields"),
					sType: 'error'
				});
				return;
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
			$state.go($rootScope.sFromState, $rootScope.oFromStateParams);
		}
	}
]);