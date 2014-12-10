var MENUS = (function($) {
	var menus = {
		navigation : {
			aMainNavigationLinks : []
		},
		oInitialViews : {}
	};
	menus.navigation.aMainNavigationLinks.push({
		role : "",
		items : []
	});
	menus.navigation.aMainNavigationLinks.push({
		role : "technicalAdministrator",
		items : [ {
//			linkTE: "Deficiencies",
//			classes: "mainNavLnk tab-deficiencies",
//			stateToNavigate: "app.deficienciesList",
//			globalStateObject: $state,
//			hash: "#/app/deficienc"
//		}, {
//			linkTE: $scope.unitsTE,
//			classes: "mainNavLnk tab-units",
//			stateToNavigate: "app.unitsList",
//			globalStateObject: $state,
//			hash: "#/app/unit"	
//		}, {
//			linkTE: $scope.contractorsTE,
//			classes: "mainNavLnk tab-clients",
//			stateToNavigate: "app.accountsList",
//			globalStateObject: $state,
//			hash: "#/app/account"
//		}, {
//			linkTE: $scope.settingsTE,
//			classes: "mainNavLnk tab-settings",
//			stateToNavigate: "app.userSettings.myProfile",
//			globalStateObject: $state,
//			hash: "#/app/userSettings"	
//		}, {
//			linkTE: $scope.adminPanelTE,
//			classes: "mainNavLnk tab-admin",
//			stateToNavigate: "app.adminArea.userManagement",
//			globalStateObject: $state,
//			hash: "#/app/adminArea"
		} ]
	});
	menus.navigation.aMainNavigationLinks.push({
		role : "user",
		items :  [ {
//			linkTE: $scope.deficienciesTE,
//			classes: "mainNavLnk tab-deficiencies",
//			stateToNavigate: "app.deficienciesList",
//			globalStateObject: $state,
//			hash: "#/app/deficienc"
//		}, {
//			linkTE: $scope.unitsTE,
//			classes: "mainNavLnk tab-units",
//			stateToNavigate: "app.unitsList",
//			globalStateObject: $state,
//			hash: "#/app/unit"	
//		}, {
//			linkTE: $scope.contractorsTE,
//			classes: "mainNavLnk tab-clients",
//			stateToNavigate: "app.accountsList",
//			globalStateObject: $state,
//			hash: "#/app/account"
//		}, {
//			linkTE: $scope.settingsTE,
//			classes: "mainNavLnk tab-settings",
//			stateToNavigate: "app.userSettings.myProfile",
//			globalStateObject: $state,
//			hash: "#/app/userSettings"	
		}]
	});
	
	menus.oInitialViews.systemAdministrator = "#/app/deficienciesList";
	
	

//	menus.initialViews.push({
//		role : "",
//		initialView : "#/signIn"
//	});
//	menus.initialViews.push({
//		role : "user",
//		initialView : "#/app/deficienciesList"
//	});
//	menus.initialViews.push({
//		role : "test",
//		initialView : "#/template/"
//	});
//	menus.initialViews.push({
//		role : "technicalAdministrator",
//		initialView : "#/app/deficienciesList"
//	});
//	
//	menus.initialViews.push({
//		role : "endUser",
//		initialView : "#/app/deficienciesListEndUser"
//	});	

	menus.newUserInitialRole = "user";

//	menus.appRoles = [ "user", "technicalAdministrator", "endUser" ];

	return menus;
}(jQuery));