app.factory('utilsProvider', function(ngTableParams) {
	return {

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

		convertJsonArrayToString: function(aObj) {
			sReturn = '[';
			for (var i = 0; i < aObj.length; i++) {
				sReturn = sReturn + '{';
				var aProp = [];
				for (var propt in aObj[i]) {
					aProp.push(propt);
				}
				for (var j = 0; j < aProp.length; j++) {
					if (j != (aProp.length - 1)) {
						sReturn = sReturn + '\"' + aProp[j] + '\":' + '\"' + aObj[i][aProp[j]] + '\", ';
					} else {
						sReturn = sReturn + '\"' + aProp[j] + '\":' + '\"' + aObj[i][aProp[j]] + '\"';
					}
				}
				if (i != (aObj.length - 1)) {
					sReturn = sReturn + '}, ';
				} else {
					sReturn = sReturn + '}';
				}
			}
			sReturn = sReturn + ']';
			return sReturn;
		},

		getParameterByName: function(sName) {
			var sURL = window.location.href.replace("#", "");
			sName = sName.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
			var regexS = "[\\?&]" + sName + "=([^&#]*)";
			var regex = new RegExp(regexS);
			var results = regex.exec(sURL);
			if (results == null)
				return "";
			else
				return decodeURIComponent(results[1].replace(/\+/g, " "));
		},

		displayMessage: function(oParameters) { //sText, sType
			noty({
				text: oParameters.sText,
				type: oParameters.sType,
				layout: CONSTANTS.messageDisplayLayout,
				timeout: CONSTANTS.messageDisplayTime
			});
		},

		messagesHandler: function(aMessages) {
			var bNoErrorMessages = true;

			for (var i = 0; i < aMessages.length; i++) {
				var sMessageCode = aMessages[i].messageCode.toString();
				var sMessageText = jQuery.i18n.prop('messages.m' + aMessages[i].messageCode);

				switch (sMessageCode[i].substring(0, 1)) { // 1 - success; 2 - warning; 3 - error;
					case '1': // success
						this.displayMessage({sText: sMessageText, sType: 'success'});
						break;
					case '2': // error
						this.displayMessage({sText: sMessageText, sType: 'error'});
						bNoErrorMessages = false;
						break;
					case '3': // warning
						this.displayMessage({sText: sMessageText, sType: 'warning'});
						break;
				}
			}
			return bNoErrorMessages;
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
	}
});