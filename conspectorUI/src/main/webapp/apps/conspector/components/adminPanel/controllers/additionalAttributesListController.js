viewControllers.controller('additionalAttributesListView', ['$scope', '$rootScope', '$state', 'servicesProvider', 'ngTableParams', '$filter', 'apiProvider', '$translate', 'cacheProvider', 'historyProvider', 'utilsProvider',
	function($scope, $rootScope, $state, servicesProvider, ngTableParams, $filter, apiProvider, $translate, cacheProvider, historyProvider, utilsProvider) {
		historyProvider.removeHistory(); // because current view doesn't have a back button				
		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$rootScope.oStateParams = {}; // for backNavigation	

		$scope.oNewNode = {
			sTextEN: "",
			sTextFR: ""
		};
		$scope.oUpdatedNode = {
			sTextEN: "",
			sTextFR: ""
		};
		$scope.oNodesData = {
			aData: []
		}; // for the dropDown		

		$scope.aTreeData = [ //{
			// 	id: 'node1',
			// 	parent: '#',
			// 	text: 'ActivityLog',
			// 	state: {
			// 		opened: false
			// 	}
			// }, {
			// 	id: 'node2',
			// 	parent: 'node1',
			// 	text: 'Phase 1',
			// 	state: {
			// 		opened: false
			// 	}
			// }, {
			// 	id: 'node3',
			// 	parent: 'node2',
			// 	text: 'Summory',
			// 	state: {
			// 		opened: false
			// 	}
			// }, {
			// 	id: 'node4',
			// 	parent: 'node3',
			// 	text: 'morningTemperature',
			// 	state: {
			// 		opened: false
			// 	}
			// }, {
			// 	id: 'node5',
			// 	parent: 'node3',
			// 	text: 'afternoonTemperature',
			// 	state: {
			// 		opened: false
			// 	}
			// },

			// {
			// 	id: 'node6',
			// 	parent: '#',
			// 	text: 'Account',
			// 	state: {
			// 		opened: false
			// 	}
			// }, {
			// 	id: 'node7',
			// 	parent: 'node6',
			// 	text: 'Phase 1',
			// 	state: {
			// 		opened: false
			// 	}
			// }, {
			// 	id: 'node8',
			// 	parent: 'node7',
			// 	text: 'Customer',
			// 	state: {
			// 		opened: false
			// 	}
			// }, {
			// 	id: 'node9',
			// 	parent: 'node8',
			// 	text: 'isProspect',
			// 	state: {
			// 		opened: false
			// 	}
			// },
		];

		var iNodeCounter = 0;

		$scope.oTreeConfig = {
			core: {
				multiple: false,
				animation: true,
				error: function(error) {
					$log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
				},
				check_callback: true,
				worker: true
			},
			plugins: [],
			version: 1
		};

		$scope.onAddNewNode = function() {
			var sSelectedNodeId = "";
			for (var i = $scope.oNodesData.aData.length - 1; i >= 0; i--) {
				if ($scope.oNodesData.aData[i].ticked === true) {
					sSelectedNodeId = $scope.oNodesData.aData[i].id;
					break;
				}
			}

			var sParent = "#";
			for (var i = $scope.aTreeData.length - 1; i >= 0; i--) {
				if ($scope.aTreeData[i].id === sSelectedNodeId) {
					sParent = $scope.aTreeData[i].id;
					break;
				}
			}

			$scope.aTreeData.push({
				id: "node" + (iNodeCounter++),
				parent: sParent,
				textEN: $scope.oNewNode.sTextEN,
				textFR: $scope.oNewNode.sTextFR,
				text: "ID: " + "node" + iNodeCounter + "; NameEN: " + $scope.oNewNode.sTextEN + "; NameFR: " + $scope.oNewNode.sTextFR,
				state: {
					open: false
				},
			});
		};

		$scope.onUpdateNode = function() {
			var sSelectedNodeId = "";
			for (var i = $scope.oNodesData.aData.length - 1; i >= 0; i--) {
				if ($scope.oNodesData.aData[i].ticked === true) {
					sSelectedNodeId = $scope.oNodesData.aData[i].id;
					break;
				}
			}

			for (var i = $scope.aTreeData.length - 1; i >= 0; i--) {
				if ($scope.aTreeData[i].id === sSelectedNodeId) {
					//sParent = $scope.aTreeData[i].id;
					$scope.aTreeData[i].text = "ID: " + $scope.aTreeData[i].id + "; NameEN: " + $scope.oUpdatedNode.sTextEN + "; NameFR: " + $scope.oUpdatedNode.sTextFR;
					//$scope.aTreeData[i].text = $scope.oUpdatedNode.sTextFR;
					break;
				}
			}
			populateNodeSelectionDropDown();
			$scope.oTreeConfig.version++;						
		};

		$scope.createCB = function() {
			populateNodeSelectionDropDown();
		};


		var populateNodeSelectionDropDown = function() {
			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: $scope.aTreeData
				},
				oParentArrayWrapper: {
					aData: []
				},
				oNewParentItemArrayWrapper: $scope.oNodesData,
				sNameEN: "text",
				sNameFR: "text",
				sDependentKey: "id",
				sParentKey: "",
				sTargetArrayNameInParent: "aNodes"
			});
		};

		$scope.applyModelChanges = function(){
			return true;
		};

		//populateNodeSelectionDropDown();

	}
]);