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

			if(!oData.email){
				oData.email = "_";//needed because of the rest service URL structure (requuires two parameters)
			}			
			
			var onSuccess = function(oData){
				var bNoErrorMessages = servicesProvider.messagesHandler(oData.messages);
			};

			apiProvider.resetPassword({oData: oData, onSuccess: onSuccess});
		};

		$scope.onResetTypeChange = function() {
			if ($scope.sSelectedResetType === "userName") {
				$scope.resetData.sEmail = "";
			} else {
				$scope.resetData.sUserName = "";
			}
		};
		
		$scope.onBack = function(){
			if(!$rootScope.sFromState){
				$state.go('signIn');
				return;
			}			
			$state.go($rootScope.sFromState, $rootScope.oFromStateParams);
		}
	}
]);