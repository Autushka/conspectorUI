app.factory('genericODataSrv', function($resource) {
	var odataUrl = "";
	if (window.location.host.substr(0, 9) === "localhost") {
		odataUrl = CONSTANTS.appODataServicesPath;
	} else {
		odataUrl = "DeficienciesManagement.svc/";
	}

	return $resource("", {}, {
		'getEntitySetWithFilterAndExpand': {
			method: "GET",
			url: odataUrl + ":path" + '?$filter=' + ":filter" + '&$expand=' + ":expand" + '&$format=json'
		},
		'getEntitySetWithFilter': {
			method: "GET",
			url: odataUrl + ":path" + '?$filter=' + ":filter" + '&$format=json'
		},	
		'getEntitySetWithExpand': {
			method: "GET",
			url: odataUrl + ":path" + '?$expand=' + ":expand" + '&$format=json'
		},			
		'getEntitySet': {
			method: "GET",
			url: odataUrl + ":path" + '?$format=json'
		},
		'post': {
			method: "POST",
			url: odataUrl + ":path"
		},
		'put': {
			method: 'PUT',
			params: {
				key: "@key"
			},
			url: odataUrl + ":path" + "(:key)" + '?$format=json'
		},
		'getEntity': {
			method: 'GET',
			params: {
				key: "@key"
			},
			url: odataUrl + ":path" + "(:key)" + '?$expand=' + ":expand" + '&$format=json'
		},
		'delete': {
			method: 'DELETE',
			params: {
				key: "@key"
			},
			url: odataUrl + ":path" + "(:key)"
		}
	});
});

app.factory('customSrv', function($http, $q, $rootScope, $modal, dataSrv, globalSrv, $resource, ngTableParams, $filter, $window, $timeout, genericODataSrv) {
	return {
		oDeficiencyEntity: {
			//aDeficiencies: [],
			oCurrentDeficiency: {},
			//oPendingRequestFor: {
			iPendingRequestsForGetEntitySet: 0, //number of requests refresh of the list depends on
			//bListNeedsToBeRefreshed: false //list needs to be refreshed			
			//},
			bDeficiencyDisplayMode: false,
			bCreateNewMode: false,
			listSearchFilter: "",
			listColumnsFilters: {},
			oSelectCriterias: {},
		},
		oAccountEntity: {
			aAccounts: [],
			oCurrentAccount: {},
			bAccountDisplayMode: true,
			listSearchFilter: "",
			listColumnsFilters: {},
			oSelectCriterias: {},
			//bRefreshList: true
		},
		oUnitEntity: {
			aUnits: [],
			oCurrentUnit: {},
			iPendingRequestsForGetEntitySet: 0,
			bUnitDisplayMode: true,
			listSearchFilter: "",
			listColumnsFilters: {},
			oSelectCriterias: {},
		},
		aDeficienciesTags: [],
		aDeficienciesLocations: [],
		aUsers: [],
		aRoles: [],
		aProjects: [],
		aStatuses: [],
		aPriorities: [],
		aCategories: [],
		aPhases: [],
		aAccountTypes: [],
		aOptions1: [],
		aOptions2: [],
		aLabels: [],

		readODataEntitySetNew: function(oParameters) {
			var oOdataSrv = {};
			var deffered = $q.defer();
			if (oParameters.showSpinner) {
				$rootScope.$emit('LOAD');
			}

			if (oParameters.filter && oParameters.expand) {
				oOdataSrv = (new genericODataSrv()).$getEntitySetWithFilterAndExpand({
					path: oParameters.path,
					expand: oParameters.expand,
					filter: oParameters.filter
				});
			} 
			if (oParameters.filter && !oParameters.expand) {
				oOdataSrv = (new genericODataSrv()).$getEntitySetWithFilter({
					path: oParameters.path,
					filter: oParameters.filter
				});
			} 
			if (!oParameters.filter && oParameters.expand) {
				oOdataSrv = (new genericODataSrv()).$getEntitySetWithExpand({
					path: oParameters.path,
					expand: oParameters.expand,
				});
			} 	
			if (!oParameters.filter && !oParameters.expand) {
				oOdataSrv = (new genericODataSrv()).$getEntitySet({
					path: oParameters.path,
				});
			}					

			oOdataSrv.then(function(oData) {
				$rootScope.$emit('UNLOAD');
				deffered.resolve(oData.d.results);
			}, function() {
				$rootScope.$emit('UNLOAD');
			});
			return deffered.promise;
		},

		readODataEntityNew: function(oParameters) {
			var deffered = $q.defer();

			if (oParameters.showSpinner) {
				$rootScope.$emit('LOAD');
			}

			var oOdataSrv = (new genericODataSrv()).$getEntity({
				path: oParameters.path,
				expand: oParameters.expand,
				key: oParameters.key,
			});

			oOdataSrv.then(function(oData) {
				$rootScope.$emit('UNLOAD');
				//oParameters.oTargetObject = oData.d.results;
				deffered.resolve(oData.d);
			}, function() {
				$rootScope.$emit('UNLOAD');
			});
			return deffered.promise;
		},

		updateODataEntityNew: function(oParameters) {
			var deffered = $q.defer();

			if (oParameters.showSpinner) {
				$rootScope.$emit('LOAD');
			}

			if (oParameters.oServiceProvider && oParameters.oPendingRequestFor) {
				for (var i = 0; i < oParameters.oPendingRequestFor.aEntities.length; i++) {
					oParameters.oServiceProvider[oParameters.oPendingRequestFor.aEntities[i]].iPendingRequestsForGetEntitySet++;
				}
			}

			var oOdataSrv = (new genericODataSrv(oParameters.oData)).$put({
				path: oParameters.path,
				key: oParameters.key,
			});

			oOdataSrv.then(function(oData) {
				if (oParameters.oServiceProvider && oParameters.oPendingRequestFor) {
					//alert(oParameters.oServiceProvider[oParameters.oPendingRequestFor.sEntityName].oPendingRequestFor.iPendingRequestsForGetEntitySet);
					for (var i = 0; i < oParameters.oPendingRequestFor.aEntities.length; i++) {
						oParameters.oServiceProvider[oParameters.oPendingRequestFor.aEntities[i]].iPendingRequestsForGetEntitySet--;
						if (oParameters.oServiceProvider[oParameters.oPendingRequestFor.aEntities[i]].iPendingRequestsForGetEntitySet === 0) {
							$rootScope.$emit('pendingRequestsFinishedFor' + oParameters.oPendingRequestFor.aEntities[i]);
						}
					}

					// if (oParameters.oServiceProvider[oParameters.oPendingRequestFor.sEntityName].iPendingRequestsForGetEntitySet === 0) {
					// 	$rootScope.$emit('getEntitySetCanBeExecuted');
					// }
				}
				$rootScope.$emit('UNLOAD');
				if (oParameters.bShowSuccessMessage) {
					noty({
						text: jQuery.i18n.prop('globalTE.successOperationNoticeTE'),
						type: 'success',
						layout: CONSTANTS.messageDisplayLayout,
						timeout: CONSTANTS.messageDisplayTime
					});

				}
				deffered.resolve(oData.d);
			}, function() {
				if (oParameters.oServiceProvider && oParameters.oPendingRequestFor) {
					for (var i = 0; i < oParameters.oPendingRequestFor.aEntities.length; i++) {
						oParameters.oServiceProvider[oParameters.oPendingRequestFor.aEntities[i]].iPendingRequestsForGetEntitySet--;
						if (oParameters.oServiceProvider[oParameters.oPendingRequestFor.aEntities[i]].iPendingRequestsForGetEntitySet === 0) {
							$rootScope.$emit('pendingRequestsFinishedFor' + oParameters.oPendingRequestFor.aEntities[i]);
						}
					}
				}
				$rootScope.$emit('UNLOAD');
				if (oParameters.bShowErrorMessage) {
					noty({
						text: jQuery.i18n.prop('globalTE.failureOperationNoticeTE'),
						type: 'error',
						layout: CONSTANTS.messageDisplayLayout,
						timeout: CONSTANTS.messageDisplayTime
					});
				}
			});
			return deffered.promise;
		},

		createODataEntityNew: function(oParameters) {
			var deffered = $q.defer();

			if (oParameters.showSpinner) {
				$rootScope.$emit('LOAD');
			}

			if (oParameters.oServiceProvider && oParameters.oPendingRequestFor) {
				for (var i = 0; i < oParameters.oPendingRequestFor.aEntities.length; i++) {
					oParameters.oServiceProvider[oParameters.oPendingRequestFor.aEntities[i]].iPendingRequestsForGetEntitySet++;
				}
			}

			var oOdataSrv = (new genericODataSrv(oParameters.oData)).$post({
				path: oParameters.path,
			});

			oOdataSrv.then(function(oData) {
				if (oParameters.oServiceProvider && oParameters.oPendingRequestFor) {
					for (var i = 0; i < oParameters.oPendingRequestFor.aEntities.length; i++) {
						oParameters.oServiceProvider[oParameters.oPendingRequestFor.aEntities[i]].iPendingRequestsForGetEntitySet--;
						if (oParameters.oServiceProvider[oParameters.oPendingRequestFor.aEntities[i]].iPendingRequestsForGetEntitySet === 0) {
							$rootScope.$emit('pendingRequestsFinishedFor' + oParameters.oPendingRequestFor.aEntities[i]);
						}
					}
				}
				$rootScope.$emit('UNLOAD');
				if (oParameters.bShowSuccessMessage) {
					noty({
						text: jQuery.i18n.prop('globalTE.successOperationNoticeTE'),
						type: 'success',
						layout: CONSTANTS.messageDisplayLayout,
						timeout: CONSTANTS.messageDisplayTime
					});

				}
				deffered.resolve(oData.d);
			}, function() {
				if (oParameters.oServiceProvider && oParameters.oPendingRequestFor) {
					for (var i = 0; i < oParameters.oPendingRequestFor.aEntities.length; i++) {
						oParameters.oServiceProvider[oParameters.oPendingRequestFor.aEntities[i]].iPendingRequestsForGetEntitySet--;
						if (oParameters.oServiceProvider[oParameters.oPendingRequestFor.aEntities[i]].iPendingRequestsForGetEntitySet === 0) {
							$rootScope.$emit('pendingRequestsFinishedFor' + oParameters.oPendingRequestFor.aEntities[i]);
						}
					}
				}
				$rootScope.$emit('UNLOAD');
				if (oParameters.bShowErrorMessage) {
					noty({
						text: jQuery.i18n.prop('globalTE.failureOperationNoticeTE'),
						type: 'error',
						layout: CONSTANTS.messageDisplayLayout,
						timeout: CONSTANTS.messageDisplayTime
					});
				}
			});
			return deffered.promise;
		},

		deleteODataEntityNew: function(oParameters) {
			var deffered = $q.defer();

			if (oParameters.showSpinner) {
				$rootScope.$emit('LOAD');
			}

			var oOdataSrv = (new genericODataSrv()).$delete({
				path: oParameters.path,
				key: oParameters.key,
			});

			oOdataSrv.then(function(oData) {
				$rootScope.$emit('UNLOAD');
				if (oParameters.bShowSuccessMessage) {
					noty({
						text: jQuery.i18n.prop('globalTE.successOperationNoticeTE'),
						type: 'success',
						layout: CONSTANTS.messageDisplayLayout,
						timeout: CONSTANTS.messageDisplayTime
					});

				}
				deffered.resolve();
			}, function() {
				$rootScope.$emit('UNLOAD');
				if (oParameters.bShowErrorMessage) {
					noty({
						text: jQuery.i18n.prop('globalTE.failureOperationNoticeTE'),
						type: 'error',
						layout: CONSTANTS.messageDisplayLayout,
						timeout: CONSTANTS.messageDisplayTime
					});
				}
			});

			return deffered.promise;
		},

		refreshEntitySet: function(oParameters) {
			if (oParameters.oCashProvider !== undefined) {
				oParameters.oCashProvider[oParameters.oCashProviderAttribute] = [];
				oParameters.oCashProvider.sFilter = oParameters.oReadServiceParameters.filter;
				oParameters.oCashProvider.sExpand = oParameters.oReadServiceParameters.expand;
			}

			if (oParameters.oServiceProvider && oParameters.oPendingRequestFor) {
				for (var i = 0; i < oParameters.oPendingRequestFor.aEntities.length; i++) {
					oParameters.oServiceProvider[oParameters.oPendingRequestFor.aEntities[i]].iPendingRequestsForGetEntitySet++;
				}
			}

			var oReadSrv = oParameters.oServiceProvider.readODataEntitySetNew(oParameters.oReadServiceParameters);
			oReadSrv.then(function(aData) {
				if (oParameters.oCashProvider !== undefined) {
					oParameters.oCashProvider[oParameters.oCashProviderAttribute] = aData;
				}
				oParameters.fnSuccessCallBack(aData);
				if (oParameters.oServiceProvider && oParameters.oPendingRequestFor) {
					for (var i = 0; i < oParameters.oPendingRequestFor.aEntities.length; i++) {
						oParameters.oServiceProvider[oParameters.oPendingRequestFor.aEntities[i]].iPendingRequestsForGetEntitySet--;
						if (oParameters.oServiceProvider[oParameters.oPendingRequestFor.aEntities[i]].iPendingRequestsForGetEntitySet === 0) {
							$rootScope.$emit('pendingRequestsFinishedFor' + oParameters.oPendingRequestFor.aEntities[i]);
						}
					}
				}
			}, function() {
				if (oParameters.oServiceProvider && oParameters.oPendingRequestFor) {
					for (var i = 0; i < oParameters.oPendingRequestFor.aEntities.length; i++) {
						oParameters.oServiceProvider[oParameters.oPendingRequestFor.aEntities[i]].iPendingRequestsForGetEntitySet--;
						if (oParameters.oServiceProvider[oParameters.oPendingRequestFor.aEntities[i]].iPendingRequestsForGetEntitySet === 0) {
							$rootScope.$emit('pendingRequestsFinishedFor' + oParameters.oPendingRequestFor.aEntities[i]);
						}
					}
				}
			});
		},

		getEntitySet: function(oParameters) {
			if (oParameters.oCashProvider && oParameters.oCashProvider[oParameters.oCashProviderAttribute].length && oParameters.oReadServiceParameters.filter === oParameters.oCashProvider.sFilter && oParameters.oReadServiceParameters.expand === oParameters.oCashProvider.sExpand) {
				oParameters.fnSuccessCallBack(oParameters.oCashProvider[oParameters.oCashProviderAttribute]);
			} else {
				oParameters.oServiceProvider.refreshEntitySet(oParameters);
			}
		},

		constuctChangesDetails: function(oParameters) { //oldObject, currentObject
			var oChangesDetails = [];
			for (var prop in oParameters.oldObject) {
				for (var prop2 in oParameters.currentObject) {
					if (prop === prop2) {
						if (oParameters.oldObject[prop] !== oParameters.currentObject[prop]) {
							if (prop !== "createdDate" && prop.substr(prop.length - 2) !== "Id" && prop.substr(prop.length - 2) !== "ID") { //tepmorary solution
								oChangesDetails.push({
									fieldName: prop,
									oldValue: oParameters.oldObject[prop],
									currentValue: oParameters.currentObject[prop]
								});
							}
						}
						break;
					}
				}
			}
			return oChangesDetails;
		},

		tagsStringToTagsArray: function(sTags) {
			var aDeficienctyTags = [];
			if (sTags === null || sTags === undefined || sTags === "") {
				return aDeficienctyTags;
			}

			sTags = sTags.substring(0, sTags.length - 1); // remove last ';'
			var aTags = sTags.split(";");
			for (var i = 0; i < aTags.length; i++) {
				aTags[i] = aTags[i].trim();
				aDeficienctyTags.push({
					text: aTags[i].replace("|", "")
				});
			}
			return aDeficienctyTags;
		},

		tagsArrayToTagsString: function(aTags) {
			var sDeficienctyTags = "";
			for (var i = 0; i < aTags.length; i++) {
				if (i !== 0) {
					sDeficienctyTags = sDeficienctyTags + " " + aTags[i].text + ';';
				} else {
					sDeficienctyTags = sDeficienctyTags + aTags[i].text + ';';
				}
			}
			return sDeficienctyTags;
		},

		stringToDate: function(sDate) {
			var date = new Date(sDate);
			return date;
		},

		dateToString: function(date) { // always fixed ISO date format
			var sFullDate = "";
			var sDate = date.getDate().toString();
			var sMonth = (date.getMonth() + 1).toString();
			var sYear = date.getFullYear();
			var sHours = date.getHours();
			if (sHours.toString().length === 1) {
				sHours = "0" + sHours;
			}
			var sMinutes = date.getMinutes();
			if (sMinutes.toString().length === 1) {
				sMinutes = "0" + sMinutes;
			}
			var sSeconds = date.getSeconds();
			if (sSeconds.toString().length === 1) {
				sSeconds = "0" + sSeconds;
			}

			if (sDate.length === 1) {
				sDate = '0' + sDate;
			}
			if (sMonth.length === 1) {
				sMonth = '0' + sMonth;
			}
			sFullDate = sMonth + "." + sDate + "." + sYear + " " + sHours + ":" + sMinutes + ":" + sSeconds;
			return sFullDate;
		},


		formatDBDate: function(sDBDate) {
			if (sDBDate === null || sDBDate === undefined || sDBDate === "") {
				return sDBDate;
			}
			var sDate = sDBDate.substring(6, sDBDate.length - 2);
			var dDate = new Date(parseInt(sDate));
			return this.dateToString(dDate);
		},

		updateOrAddItemToArrayByKey: function(oParameters) { //oParameters:{aArray, oObject, sArrayKey, sObjectKey}
			var bObjectFound = false;
			for (var i = 0; i < oParameters.aArray.length; i++) {
				if (oParameters.aArray[i][oParameters.sArrayKey] === oParameters.oObject[oParameters.sObjectKey]) {
					oParameters.aArray[i] = jQuery.extend(true, {}, oParameters.oObject);
					bObjectFound = true;
					break;
				}
			}
			if (!bObjectFound) {
				oParameters.aArray.push(oParameters.oObject);
			}
			return oParameters.aArray;
		},

		removeArrayElementByKey: function(oParameters) { //oParameters:{aArray, oObject, sArrayKey, sObjectKey}
			for (var i = 0; i < oParameters.aArray.length; i++) {
				if (oParameters.aArray[i][oParameters.sArrayKey] === oParameters.oObject[oParameters.sObjectKey]) {
					oParameters.aArray.splice(i, 1);
					break;
				}
			}
			return oParameters.aArray;
		},

		deepArrayCopy: function(oParameters) {
			var aCopyOfArray = [];
			for (var i = 0; i < oParameters.aSourceArray.length; i++) {
				aCopyOfArray.push(jQuery.extend(true, {}, oParameters.aSourceArray[i]));
			}
			return aCopyOfArray;
		},

		showNotyMessage: function(oParameters) {//sMessageText, sMessageType
			noty({
				text: oParameters.sMessageText,
				type: oParameters.sMessageType,
				layout: CONSTANTS.messageDisplayLayout,
				timeout: CONSTANTS.messageDisplayTime
			});
		},

		constructFilterBasedOnGlobalSelections: function() {
			var sFilter = this.constractFilterBasedOnMultipleSelect({
				aArray: $rootScope.oGlobalSelections.aProjects,
				sArrayKey: "rowId",
				sFilterKey: "VersionId",
				bIsFirstFilter: true,
				bIsString: false
			});
			return sFilter;
		},

		constractFilterBasedOnMultipleSelect: function(oParameters) { //aArray, sArrayKey, sFilterKey, bIsFirstFilter
			var sFilter = "";
			//var iCounter = 0;
			for (var i = 0; i < oParameters.aArray.length; i++) {
				if (oParameters.aArray[i].ticked) {
					if (sFilter.indexOf("(") < 0) {
						if (oParameters.bIsFirstFilter) {
							sFilter = "(";
						} else {
							sFilter = " and (";
						}
						if(oParameters.bIsString){
							sFilter = sFilter + oParameters.sFilterKey + " eq '" + oParameters.aArray[i][oParameters.sArrayKey] + "'";
						}else{
							sFilter = sFilter + oParameters.sFilterKey + " eq " + oParameters.aArray[i][oParameters.sArrayKey] + "";
						}
						
					} else {
						if(oParameters.bIsString){
							sFilter = sFilter + " or " + oParameters.sFilterKey + " eq '" + oParameters.aArray[i][oParameters.sArrayKey] + "'";
						}else{
							sFilter = sFilter + " or " + oParameters.sFilterKey + " eq " + oParameters.aArray[i][oParameters.sArrayKey] + "";
						}						
						
					}
				}
			}
			if (sFilter === "") {
				if (oParameters.bIsFirstFilter) {
					sFilter = "(";
				} else {
					sFilter = " and (";
				}
				sFilter = sFilter + oParameters.sFilterKey + " eq '-1'";
			}
			sFilter = sFilter + ")";

			return sFilter;
		},

		extractSelectedItemsFromMultipleSelect: function(oParameters) { //aMulriSelectItems
			var aTempArray = [];
			var aReurnResult = [];
			var bGroupHasSelectItem = false;
			for (var i = 0; i < oParameters.aMulriSelectItems.length; i++) {
				if (oParameters.aMulriSelectItems[i].multiSelectGroup === true) {
					aTempArray = [];
					bGroupHasSelectItem = false;
					aTempArray.push(oParameters.aMulriSelectItems[i]);
					continue;
				}
				if (oParameters.aMulriSelectItems[i].rowId && oParameters.aMulriSelectItems[i].ticked) {
					aTempArray.push(oParameters.aMulriSelectItems[i]);
					bGroupHasSelectItem = true;
					continue;
				}
				if (oParameters.aMulriSelectItems[i].multiSelectGroup === false) {
					aTempArray.push(oParameters.aMulriSelectItems[i]);
					if (bGroupHasSelectItem) {
						aReurnResult.push.apply(aReurnResult, aTempArray); //append tempArray to resultArray
					}
					continue;
				}
			}

			return aReurnResult;
		},

		adaptMultiSelectDataForSingeSelect: function(oParameters) { //aMulriSelectItems, sSelectionBasedOn, sSelectionBasedOnValue
			var bItemForSelectionFound = false,
				i = 0;
			if (oParameters.sSelectionBasedOn && oParameters.sSelectionBasedOnValue !== undefined) {
				for (i = 0; i < oParameters.aMulriSelectItems.length; i++) {
					if (oParameters.aMulriSelectItems[i].rowId !== undefined && oParameters.aMulriSelectItems[i].ticked) {
						if (bItemForSelectionFound) {
							oParameters.aMulriSelectItems[i].ticked = false;
						} else {
							if (oParameters.aMulriSelectItems[i][oParameters.sSelectionBasedOn] === oParameters.sSelectionBasedOnValue) {
								bItemForSelectionFound = true;
							} else {
								oParameters.aMulriSelectItems[i].ticked = false;
							}
						}
					}
				}
				return oParameters.aMulriSelectItems;
			}

			for (i = 0; i < oParameters.aMulriSelectItems.length; i++) {
				if (oParameters.aMulriSelectItems[i].rowId !== undefined && oParameters.aMulriSelectItems[i].ticked) {
					if (bItemForSelectionFound) {
						oParameters.aMulriSelectItems[i].ticked = false;
					} else {
						bItemForSelectionFound = true;
					}
				}
			}
			return oParameters.aMulriSelectItems;
		},

		getFirstSelectedItemFromMultipleSelect: function(oParameters) { //aMulriSelectItems
			var oReturnResult = {};
			for (var i = 0; i < oParameters.aMulriSelectItems.length; i++) {
				if (oParameters.aMulriSelectItems[i].rowId !== undefined && oParameters.aMulriSelectItems[i].ticked) {
					angular.copy(oParameters.aMulriSelectItems[i], oReturnResult);
					break;
				}
			}
			return oReturnResult;
		},

		createNgTableParams: function(oParameters) {
			var oNgTableParams = new ngTableParams({
				page: 1,
				filterDelay: 100,
				count: 1000
			}, {
				groupBy: oParameters.groupTableBy,
				total: oParameters.oTableDataArrays[oParameters.sSourceDataArrayAttribute].length, // length of data
				getData: function($defer, params) {
					params.settings().filterDelay = 10;
					params.settings().setGroupsInfo();
					params.settings().counts = [50, 500, 1000];
					var oFilteredCategoriesData = [];
					if (params.sorting() === undefined || JSON.stringify(params.sorting()) === JSON.stringify({})) {
						oFilteredCategoriesData = oParameters.oTableDataArrays[oParameters.sSourceDataArrayAttribute];
					} else {
						var aSortingBy = params.orderBy();
						if (oParameters.groupTableBy) {
							aSortingBy.unshift(oParameters.groupTableBy);
						}

						oFilteredCategoriesData = $filter('orderBy')(oParameters.oTableDataArrays[oParameters.sSourceDataArrayAttribute], aSortingBy);
					}

					var sSearchCriteria = "";
					if (params.filter().$) {
						sSearchCriteria = params.filter().$;
						for (var property in params.filter()) {
							if (property.indexOf("$") === 0) {
								delete params.filter().property;
							}
						}
					}

					if (params.filter() !== undefined && JSON.stringify(params.filter()) !== JSON.stringify({})) {
						oFilteredCategoriesData = $filter('filter')(oFilteredCategoriesData, params.filter(), function(actual, expected) {
							actual = actual.toString().toLowerCase();
							expected = expected.toString().toLowerCase();
							if (expected.indexOf("=") === 0) {
								expected = expected.slice(1, expected.length);
								return angular.equals(expected, actual);
							} else {
								if (actual.indexOf(expected) >= 0) {
									return true;
								} else {
									return false;
								}
							}
						});
					}

					if (sSearchCriteria) {
						var sSearchCriteriaLowerCase = sSearchCriteria.toLowerCase();
						var aFilteredData = [];
						var bShouldBeAdded = false;
						var sValue = "";
						for (var i = 0; i < oFilteredCategoriesData.length; i++) {
							bShouldBeAdded = false;
							for (var property in oFilteredCategoriesData[i]) {
								if (typeof oFilteredCategoriesData[i][property] === "string") {
									sValue = oFilteredCategoriesData[i][property].toLowerCase();
									if (sValue.indexOf(sSearchCriteriaLowerCase) >= 0 && property.indexOf("_") !== 0 && property.indexOf("$") !== 0) {
										bShouldBeAdded = true;
									}
								}
								if (typeof oFilteredCategoriesData[i][property] === "number") {
									sValue = oFilteredCategoriesData[i][property].toString();
									if (sValue.indexOf(sSearchCriteriaLowerCase) >= 0 && property.indexOf("_") !== 0 && property.indexOf("$") !== 0) {
										bShouldBeAdded = true;
									}
								}
							}
							if (bShouldBeAdded) {
								aFilteredData.push(oFilteredCategoriesData[i]);
							}
						}
						oFilteredCategoriesData = aFilteredData;
						params.filter().$ = sSearchCriteria;
					}

					params.total(oFilteredCategoriesData.length); // set total for recalc pagination

					if (params.total() < (params.page() - 1) * params.count()) { // fix filtering on the page number > 1
						params.page(1);
					}
					$defer.resolve(oParameters.oTableData[oParameters.sTargerObjectAttribute] = oFilteredCategoriesData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				},
				$scope: oParameters.scope
			});
			return oNgTableParams;
		},

		setAttributeFromArrayByKey: function(oParameters) { //oParameters:{aArray, oObject, sArrayKey, sObjectKey, sTargetAttribute, oTargetObject}
			var bSuccess = false;
			oParameters.oObject[oParameters.sTargetAttribute] = {};
			for (i = 0; i < oParameters.aArray.length; i++) {
				if (oParameters.aArray[i][oParameters.sArrayKey] === oParameters.oObject[oParameters.sObjectKey]) {
					oParameters.oTargetObject[oParameters.sTargetAttribute] = oParameters.aArray[i];
					bSuccess = true;
					break;
				}
			}
			return bSuccess;
		},

		getTableTotalInfo: function(oParameters) { //oParameters:{aItems, sAttribute(attribute name for accumulation)}
			var sTotal = "",
				obj = {};
			if (oParameters.aItems.length && oParameters.sAttribute) {
				sTotal = oParameters.aItems.length.toString() + " ( ";
			} else {
				sTotal = oParameters.aItems.length;
			}

			for (var i = 0; i < oParameters.aItems.length; i++) {
				if (obj[oParameters.aItems[i][oParameters.sAttribute]] !== "") {
					if (obj[oParameters.aItems[i][oParameters.sAttribute]] !== undefined) {
						obj[oParameters.aItems[i][oParameters.sAttribute]] ++;
					} else {
						obj[oParameters.aItems[i][oParameters.sAttribute]] = 1;
					}
				}
			}

			for (var property in obj) {
				sTotal = sTotal + " " + property + ": " + obj[property] + ";";
			}
			if (oParameters.aItems.length && oParameters.sAttribute) {
				sTotal = sTotal + " )";
			}
			return sTotal;
		},

		convertStringToInt: function(sValue) {
			var bIsNum = /^\d+$/.test(sValue);
			if (bIsNum) {
				sValue = parseInt(sValue);
			}
			return sValue;
		},

		generateGUID: function() {
			var d = new Date().getTime();
			var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
			});
			return guid;
		},

		setUpPhotoGallery: function(aImages) {
			$rootScope.galleryPhotosLocation = $window.location.origin + $window.location.pathname + "rest/file/get/";
			$rootScope.galleryData = [];

			for (var i = 0; i < aImages.length; i++) {
				$rootScope.galleryData.push({
					image: aImages[i].rowId
				});
			}
			$rootScope.selectedPhoto = $rootScope.galleryData[0];
			if ($rootScope.galleryData[0]) {
				$rootScope.selectedPhotoID = $rootScope.galleryData[0].image;
			}

			$rootScope.galleryListPosition = {
				left: "0px"
			};

			if (!$rootScope.isGalleryFadeAnimationOn) {
				$rootScope.isGalleryFadeAnimationOn = true;
				$timeout(function() {
					$rootScope.isGalleryHidden = false;
				}, 5);
			} else {
				$rootScope.isGalleryHidden = false;
			}
		},

		setCookieFromJson: function(sKey, oObj) {
			$.removeCookie(sKey);
			$.cookie(sKey, JSON.stringify(oObj));
		},

		getJsonCookie: function(sKey) {
			if ($.cookie(sKey)) {
				return JSON.parse($.cookie(sKey));
			}
		},
		removeCookie: function(sKey) {
			$.removeCookie(sKey);
		},

		getProjectsAndPhasesForGlobalSelection: function() {
			this.getEntitySet({
				oReadServiceParameters: {
					path: "Versions",
					filter: "",
					expand: "ProjectDetails",
					showSpinner: false
				},
				oServiceProvider: this,
				oCashProvider: this,
				oCashProviderAttribute: "aPhases",
				oPendingRequestFor: {
					aEntities: ["oDeficiencyEntity", "oUnitEntity"]
				},
				fnSuccessCallBack: $.proxy(function(aData) {
					this.removeCookie("globalSelections");
					aData = $filter('orderBy')(aData, "projectID");
					$rootScope.oGlobalSelections.aProjects = [];
					for (var i = 0; i < aData.length; i++) {
						if (i === 0) {
							$rootScope.oGlobalSelections.aProjects.push({
								name: '<strong>' + aData[i].ProjectDetails.Name + '</strong>',
								multiSelectGroup: true
							});

							$rootScope.oGlobalSelections.aProjects.push({
								parentName: aData[i].ProjectDetails.Name,
								parentId: aData[i].ProjectDetails.RowId,
								name: aData[i].Name,
								rowId: aData[i].RowId,
								ticked: true
							});
						} else {
							if ($rootScope.oGlobalSelections.aProjects.length > 1) {
								if ($rootScope.oGlobalSelections.aProjects[$rootScope.oGlobalSelections.aProjects.length - 1].parentId !== aData[i].Project.RowId) {
									$rootScope.oGlobalSelections.aProjects.push({
										multiSelectGroup: false
									});
									$rootScope.oGlobalSelections.aProjects.push({
										name: '<strong>' + aData[i].ProjectDetails.Name + '</strong>',
										multiSelectGroup: true
									});
								}
								$rootScope.oGlobalSelections.aProjects.push({
									parentName: aData[i].ProjectDetails.Name,
									parentId: aData[i].ProjectDetails.RowId,
									name: aData[i].Name,
									rowId: aData[i].RowId,
									ticked: true
								});
							}
						}
						if (i === aData.length - 1) {
							$rootScope.oGlobalSelections.aProjects.push({
								multiSelectGroup: false
							});
						}
					}
				}, this)
			});
		},

		onLogOut: function() {
			this.oDeficiencyEntity = {
				aDeficiencies: [],
				oCurrentDeficiency: {},
				//oPendingRequestFor: {
				iPendingRequestsForGetEntitySet: 0, //number of requests refresh of the list depends on
				//bListNeedsToBeRefreshed: false //list needs to be refreshed			
				//},
				bDeficiencyDisplayMode: false,
				bCreateNewMode: false,
				listSearchFilter: "",
				listColumnsFilters: {},
				oSelectCriterias: {},
			};
			this.oAccountEntity = {
				aAccounts: [],
				oCurrentAccount: {},
				bAccountDisplayMode: true,
				listSearchFilter: "",
				listColumnsFilters: {},
				oSelectCriterias: {},
				//bRefreshList: true
			};
			this.oUnitEntity = {
				aUnits: [],
				oCurrentUnit: {},
				bUnitDisplayMode: true,
				listSearchFilter: "",
				listColumnsFilters: {},
				oSelectCriterias: {},
			};
			this.aDeficienciesTags = [];
			this.aDeficienciesLocations = [];
			this.aUsers = [];
			this.aRoles = [];
			this.aProjects = [];
			this.aStatuses = [];
			this.aPriorities = [];
			this.aCategories = [];
			this.aPhases = [];
			this.aAccountTypes = [];
			this.aOptions1 = [];
			this.aOptions2 = [];
			this.aLabels = [];
		}
	};
});