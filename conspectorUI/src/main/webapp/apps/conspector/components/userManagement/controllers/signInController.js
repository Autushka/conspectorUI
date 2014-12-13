viewControllers.controller('signInView', ['$scope', '$state', 'utilsProvider', 'dataProvider', 
    function($scope, $state, utilsProvider, dataProvider) {
        $scope.logInData = {
            userName: "",
            password: ""
        };


        $scope.onChangeLanguage = function() {
            utilsProvider.changeLanguage();
        }

        $scope.login = function() {
        	var SHA512 = new Hashes.SHA512;

            var oData = {
                userName: $scope.logInData.userName,
                password:  SHA512.hex($scope.logInData.password)
            };

            var oSignInSrv = dataProvider.httpRequest({
                sPath: "jsp/account/login.jsp",
                sRequestType: "POST",
                oUrlParameters: oData,
                bShowSpinner: true
            });

            oSignInSrv.then(function(oData) {

                var bNoErrorMessages = utilsProvider.messagesHandler(oData.messages);
                if (bNoErrorMessages) {
                	alert("success!");
                	// cacheProvider.oUserProfile = apiProvider.getUserProfile($scope.viewData.userName);

                	// if(!cacheProvider.oUserProfile.aUserRoles.length){
                	// 	utilsProvider.displayMessage("Contact your system administrator", "error");
                	// 	return;
                	// }

                	// if(cacheProvider.oUserProfile.bIsInitialPassword){
                	// 	window.location.href = "#/InitialPasswordReset";
                	// 	return;
                	// }

                	// if(cacheProvider.oUserProfile.aUserRoles.length === 1){
                	// 	cacheProvider.oUserProfile.sCurrentRole = cacheProvider.oUserProfile.aUserRoles[0];
                	// 	window.location.href = MENUS.oInitialViews[cacheProvider.oUserProfile.sCurrentRole];
                	// 	//navigation to the initial view for the role
                	// }else{
                	// 	window.location.href = "#/RoleSelection";
                	// 	return;					
                	// }
                }
            });
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
    }
]);