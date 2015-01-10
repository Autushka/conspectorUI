app.factory('genericODataFactory', ['$resource', 'CONSTANTS',
	function($resource, CONSTANTS) {
		var sServicePath = CONSTANTS.sServicePath;

		return $resource("", {}, {
			'getEntitySetWithFilterAndExpand': {
				method: "GET",
				url: sServicePath + ":path" + '?$filter=' + ":filter" + '&$expand=' + ":expand" + '&$format=json'
			},
			'getEntitySetWithFilter': {
				method: "GET",
				url: sServicePath + ":path" + '?$filter=' + ":filter" + '&$format=json'
			},
			'getEntitySetWithExpand': {
				method: "GET",
				url: sServicePath + ":path" + '?$expand=' + ":expand" + '&$format=json'
			},
			'getEntitySet': {
				method: "GET",
				url: sServicePath + ":path" + '?$format=json'
			},
			'getLinks': {
				method: "GET",
				url: sServicePath + ":sParentEntityWithKey" + "/$links/" + ":sRelationName"
			},
			'post': {
				method: "POST",
				url: sServicePath + ":path"
			},
			'put': {
				method: 'PUT',
				params: {
					key: "@key"
				},
				url: sServicePath + ":path" + "(':key')"
			},
			'getEntity': {
				method: 'GET',
				params: {
					key: "@key"
				},
				url: sServicePath + ":path" + "(':key')" + '?$format=json'
			},
			'getEntityWithFilter': {
				method: 'GET',
				params: {
					key: "@key"
				},
				url: sServicePath + ":path" + "(':key')" + '?$filter=' + ":filter" + '&$format=json'
			},
			'getEntityWithExpand': {
				method: 'GET',
				params: {
					key: "@key"
				},
				url: sServicePath + ":path" + "(':key')" + '?$expand=' + ":expand" + '&$format=json'
			},
			'getEntityWithFilterAndExpand': {
				method: 'GET',
				params: {
					key: "@key"
				},
				url: sServicePath + ":path" + "(':key')" + '?$filter=' + ":filter" + '&$expand=' + ":expand" + '&$format=json'
			},
			'delete': {
				method: 'DELETE',
				params: {
					key: "@key"
				},
				url: sServicePath + ":path" + "(':key')"
			}
		});
	}
]);

app.factory('dataProvider', ['genericODataFactory', 'utilsProvider', '$q', '$rootScope', '$http', '$translate', 'cacheProvider', '$window', 'CONSTANTS',
	function(genericODataFactory, utilsProvider, $q, $rootScope, $http, $translate, cacheProvider, $window, CONSTANTS) {
		return {
			commonOnSuccess: function(oParameters) {
				if (oParameters.bShowSpinner) {
					$rootScope.$emit('UNLOAD');
				}
				if (oParameters.bShowSuccessMessage) {
					utilsProvider.displayMessage({
						sText: $translate.instant("global_successOperation"),
						sType: 'success'
					});
				}
			},
			commonOnError: function(oParameters, deffered) {
				if (oParameters.bShowSpinner) {
					$rootScope.$emit('UNLOAD');
				}
				if (oParameters.bShowErrorMessage) {
					utilsProvider.displayMessage({
						sText: $translate.instant("global_errorOperation"),
						sType: 'error'
					});
				}
				if (deffered) {
					deffered.reject();
				}
			},

			getEntitySet: function(oParameters) { //bShowSpinner, sPath, sFilter, sExpand, oCacheProvider, sCacheProviderAttribute 
				var oOdataSrv = {};
				var deffered = $q.defer();
				var aCachedEntities = [];
				var sRequestSettings = "";

				if (oParameters.sKey) {
					sRequestSettings = oParameters.sKey;
				}
				if (oParameters.sFilter) {
					sRequestSettings = sRequestSettings + oParameters.sFilter;
				}
				if (oParameters.sExpand) {
					sRequestSettings = sRequestSettings + oParameters.sExpand;
				}
				if (!sRequestSettings) {
					sRequestSettings = ""; //to evoid NaN value
				}

				//return cash for request with specific settings (key, filter and expand) if required
				if (oParameters.oCacheProvider && oParameters.sCacheProviderAttribute) {
					aCachedEntities = oParameters.oCacheProvider.getFromCache(oParameters.sCacheProviderAttribute, sRequestSettings);
					if (aCachedEntities.length) {
						console.log("Entities: " + oParameters.sCacheProviderAttribute + " retrieved from cache...");
						return aCachedEntities;
					}
				}
				if (oParameters.bShowSpinner) {
					$rootScope.$emit('LOAD');
				}
				if (oParameters.sFilter && oParameters.sExpand) {
					oOdataSrv = (new genericODataFactory()).$getEntitySetWithFilterAndExpand({
						path: oParameters.sPath,
						expand: oParameters.sExpand,
						filter: oParameters.sFilter
					});
				}
				if (oParameters.sFilter && !oParameters.sExpand) {
					oOdataSrv = (new genericODataFactory()).$getEntitySetWithFilter({
						path: oParameters.sPath,
						filter: oParameters.sFilter
					});
				}
				if (!oParameters.sFilter && oParameters.sExpand) {
					oOdataSrv = (new genericODataFactory()).$getEntitySetWithExpand({
						path: oParameters.sPath,
						expand: oParameters.sExpand,
					});
				}
				if (!oParameters.sFilter && !oParameters.sExpand) {
					oOdataSrv = (new genericODataFactory()).$getEntitySet({
						path: oParameters.sPath,
					});
				}

				oOdataSrv.then($.proxy(function(oData) {
					//save cash if required
					if (oParameters.oCacheProvider && oParameters.sCacheProviderAttribute && oData.d.results.length) {
						oParameters.oCacheProvider.putToCache(oParameters.sCacheProviderAttribute, sRequestSettings, oData.d.results);
					}
					this.commonOnSuccess(oParameters);
					deffered.resolve(oData.d.results);
				}, this), $.proxy(function() {
					this.commonOnError(oParameters, deffered);
				}, this));
				return deffered.promise;
			},

			getEntity: function(oParameters) { //bShowSpinner, sPath, sFilter, sExpand, sKey
				var oOdataSrv = {};
				var deffered = $q.defer();

				if (oParameters.bShowSpinner) {
					$rootScope.$emit('LOAD');
				}

				if (oParameters.sFilter && !oParameters.sExpand) {
					oOdataSrv = (new genericODataFactory()).$getEntityWithFilter({
						path: oParameters.sPath,
						key: oParameters.sKey,
						expand: oParameters.sExpand,
					});
				}

				if (!oParameters.sFilter && oParameters.sExpand) {
					oOdataSrv = (new genericODataFactory()).$getEntityWithExpand({
						path: oParameters.sPath,
						key: oParameters.sKey,
						expand: oParameters.sExpand,
					});
				}

				if (oParameters.sFilter && oParameters.sExpand) {
					oOdataSrv = (new genericODataFactory()).$getEntityWithFilterAndExpand({
						path: oParameters.sPath,
						filter: oParameters.sFilter,
						key: oParameters.sKey,
						expand: oParameters.sExpand,
					});
				}

				if (!oParameters.sFilter && !oParameters.sExpand) {
					oOdataSrv = (new genericODataFactory()).$getEntity({
						path: oParameters.sPath,
						key: oParameters.sKey,
					});
				}

				oOdataSrv.then($.proxy(function(oData) {
					this.commonOnSuccess(oParameters);
					deffered.resolve(oData.d);
				}, this), $.proxy(function() {
					this.commonOnError(oParameters, deffered);
				}, this));
				return deffered.promise;
			},

			getLinks: function(oParameters) {
				var oGetLinksSrv = {};
				var deffered = $q.defer();
				var sParentEntity = "";

				sParentEntity = oParameters.sParentEntity + "('" + oParameters.sParentKey + "')";

				oGetLinksSrv = (new genericODataFactory()).$getLinks({
					path: oParameters.sParentEntity,
					sParentEntity: sParentEntity,
					sRelationName: oParameters.sRelationName
				});

				oGetLinksSrv.then(function(oData) {
					deffered.resolve(oData.d);
				});
				return deffered.promise;
			},

			updateLinks: function(oParameters) {
				var oRequestData = {
					__batchRequests: []
				};
				var oData = {};
				var oSrv = {};
				var aBatchData = [];
				var sRelationNameWithKey = "";
				var sDependentEntityKey = "";
				var bLinkBelongToDifferentCompany = false;
				var onGetLinkSuccess = function(oData) {
					if (oData.d.CompanyName !== cacheProvider.oUserProfile.sCurrentCompany || !cacheProvider.oUserProfile.sCurrentCompany || !oData.d.CompanyName) {
						bLinkBelongToDifferentCompany = true;
					}
				};

				for (var i = 0; i < oParameters.aLinks.length; i++) {
					oData = {};
					oData.requestUri = oParameters.sParentEntityWithKey + "/$links/" + oParameters.aLinks[i].sRelationName,
					oData.method = "GET",
					oRequestData.__batchRequests.push(oData);
				}

				oSrv = this.batchRequest({
					oRequestData: oRequestData
				});

				oSrv.then($.proxy(function(aData) { //onGetLinks
					oRequestData = {
						__batchRequests: []
					};

					for (var i = 0; i < aData.length; i++) {
						aBatchData = [];
						for (var j = 0; j < aData[i].data.results.length; j++) {
							bLinkBelongToDifferentCompany = false;
							oData = {};
							sDependentEntityKey = aData[i].data.results[j].uri.substring(aData[i].data.results[j].uri.indexOf("'") + 1, aData[i].data.results[j].uri.lastIndexOf("'"));
							if (oParameters.aLinks[i].bKeepCompanyDependentLinks) { // in case i.e. of User assignment to Roles/Phases etc. we should check if the link is related to the current company before removing it
								this.ajaxRequest({
									bAsync: false,
									oData: {},
									sRequestType: "GET",
									sDataType: "json",
									sPath: CONSTANTS.sServicePath + oParameters.aLinks[i].sRelationName.substring(0, oParameters.aLinks[i].sRelationName.length - 7) + "s" + "('" + sDependentEntityKey + "')", //getting entity name out of relation name
									oEventHandlers: {
										onSuccess: onGetLinkSuccess
									}
								});
							}

							if (bLinkBelongToDifferentCompany) {
								continue;
							}
							sRelationNameWithKey = oParameters.aLinks[i].sRelationName + "('" + sDependentEntityKey + "')";
							oData.requestUri = oParameters.sParentEntityWithKey + "/$links/" + sRelationNameWithKey;
							oData.method = "DELETE";
							aBatchData.push(oData);
						}

						if (aBatchData.length) {
							this.constructChangeBlockForBatch({
								oRequestData: oRequestData,
								aData: aBatchData
							});
						}
					}

					if (oRequestData.__batchRequests.length) { //should initiate links deletion only if user has some links
						oSrv = this.batchRequest({
							oRequestData: oRequestData
						});

						oSrv.then($.proxy(function() { // onDeleteLinks
							this.createLinks(oParameters);
						}, this));
					} else {
						this.createLinks(oParameters);
					}

				}, this));
			},

			updateEntity: function(oParameters) {
				var oPutOdataSrv = {};
				var oGetODataSvc = {};
				var deffered = $q.defer();

				if (oParameters.bShowSpinner) {
					$rootScope.$emit('LOAD');
				}

				var oGetODataSvc = this.getEntity({
					sKey: oParameters.sKey,
					sPath: oParameters.sPath
				});
				oGetODataSvc.then($.proxy(function(oData) {
					var oDataForUpdate = {};
					oDataForUpdate = angular.copy(oParameters.oData);

					if (oData.LastModifiedAt === oDataForUpdate.LastModifiedAt) {
						oDataForUpdate.LastModifiedAt = utilsProvider.dateToDBDate(new Date());

						if (!oDataForUpdate.GeneralAttributes) {
							oDataForUpdate.GeneralAttributes = {};
						}

						oDataForUpdate.GeneralAttributes.LastModifiedBy = cacheProvider.oUserProfile.sUserName;

						if (!oDataForUpdate.GeneralAttributes.IsDeleted) {
							oDataForUpdate.GeneralAttributes.IsDeleted = false;
						}
						if (!oDataForUpdate.GeneralAttributes.IsArchived) {
							oDataForUpdate.GeneralAttributes.IsArchived = false;
						}
						if (!oDataForUpdate.GeneralAttributes.SortingSequence) {
							oDataForUpdate.GeneralAttributes.SortingSequence = 0;
						}

						oPutOdataSrv = (new genericODataFactory(oDataForUpdate)).$put({
							path: oParameters.sPath,
							key: oParameters.sKey,
						});

						oPutOdataSrv.then($.proxy(function(oData) {
							if (oParameters.aLinks.length) {
								var sParentEntityWithKey = oParameters.sPath + "('" + oData[oParameters.sKeyAttribute] + "')";
								this.updateLinks({
									aLinks: oParameters.aLinks,
									sParentEntityWithKey: sParentEntityWithKey,
									onSuccess: $.proxy(function() {
										this.commonOnSuccess(oParameters); //TO DO: check if there is better place for success message display (links are not considered here...)
										deffered.resolve(oData);
									}, this)
								});
							} else {
								this.commonOnSuccess(oParameters);
								deffered.resolve(oData);
							}

						}, this), $.proxy(function() {
							this.commonOnError(oParameters, deffered);
						}, this));
					} else {
						this.commonOnError(oParameters, deffered);
					}
				}, this));
				return deffered.promise;
			},

			createLinks: function(oParameters) { //aLinks, sParentEntityWithKey
				var oRequestData = {
					__batchRequests: []
				};
				var aData = [];
				var oData = {};
				var oSrv = {};

				for (var i = 0; i < oParameters.aLinks.length; i++) {
					aData = [];
					for (var j = 0; j < oParameters.aLinks[i].aUri.length; j++) {
						oData = {};
						oData.requestUri = oParameters.sParentEntityWithKey + "/$links/" + oParameters.aLinks[i].sRelationName,
						oData.method = "POST";
						oData.data = {
							uri: oParameters.aLinks[i].aUri[j]
						};

						aData.push(oData);
					}

					if (aData.length) {
						this.constructChangeBlockForBatch({
							oRequestData: oRequestData,
							aData: aData
						});
					}
				}

				oSrv = this.batchRequest({
					oRequestData: oRequestData
				});

				oSrv.then(function(aData) {
					if (oParameters.onSuccess) {
						oParameters.onSuccess();
					}
				});
			},

			createEntity: function(oParameters) { //aLinks, sKey
				var oOdataSrv = {};
				var oData = {};
				var deffered = $q.defer();
				//var aLinksData = [];
				var oLinksData = {}

				if (oParameters.bShowSpinner) {
					$rootScope.$emit('LOAD');
				}

				oData = angular.copy(oParameters.oData);
				if (oParameters.bGuidNeeded) {
					oData.Guid = utilsProvider.generateGUID();
				}
				if (oParameters.bCompanyNeeded && !oData.CompanyName) {
					oData.CompanyName = cacheProvider.oUserProfile.sCurrentCompany;
				}

				oData.CreatedAt = utilsProvider.dateToDBDate(new Date());
				oData.LastModifiedAt = oParameters.oData.CreatedAt;

				if (!oData.GeneralAttributes) {
					oData.GeneralAttributes = {};
				}

				oData.GeneralAttributes.CreatedBy = cacheProvider.oUserProfile.sUserName;
				oData.GeneralAttributes.LastModifiedBy = cacheProvider.oUserProfile.sUserName;
				oData.GeneralAttributes.IsDeleted = false;
				oData.GeneralAttributes.IsArchived = false;

				if (!oData.GeneralAttributes.SortingSequence) {
					oData.GeneralAttributes.SortingSequence = 0;
				}

				oOdataSrv = (new genericODataFactory(oData)).$post({
					path: oParameters.sPath,
				});

				oOdataSrv.then($.proxy(function(oData) {
					if (oParameters.aLinks.length) {
						var sParentEntityWithKey = oParameters.sPath + "('" + oData.d[oParameters.sKeyAttribute] + "')";
						this.createLinks({
							aLinks: oParameters.aLinks,
							sParentEntityWithKey: sParentEntityWithKey,
							onSuccess: $.proxy(function() {
								this.commonOnSuccess(oParameters); //TO DO: check if there is better place for success message display (links are not considered here...)
								deffered.resolve(oData);
							}, this)
						});
					} else {
						this.commonOnSuccess(oParameters); //TO DO: check if there is better place for success message display (links are not considered here...)
						deffered.resolve(oData.d);
					}
				}, this), $.proxy(function() {
					this.commonOnError(oParameters, deffered);
				}, this));
				return deffered.promise;
			},

			deleteEntity: function(oParameters) {
				var oOdataSrv = {};
				var deffered = $q.defer();

				if (oParameters.bShowSpinner) {
					$rootScope.$emit('LOAD');
				}

				oOdataSrv = (new genericODataFactory()).$delete({
					path: oParameters.sPath,
					key: oParameters.sKey,
				});

				oOdataSrv.then($.proxy(function(oData) {
					this.commonOnSuccess(oParameters);
					deffered.resolve();
				}, this), $.proxy(function() {
					this.commonOnError(oParameters, deffered);
				}, this));
				return deffered.promise;
			},

			httpRequest: function(oParameters) { // //bShowSpinner, sRequestType, sPath, oUrlParameters, bShowSuccessMessage, bShowErrorMessage   
				var sUrlParameters = "";
				var sContentType = 'application/x-www-form-urlencoded';
				var aUrlParameters = [];
				var deffered = {};
				var oHttp = {};

				if (!oParameters.sRequestType) {
					oParameters.sRequestType = "GET";
				}

				for (var parameter in oParameters.oUrlParameters) {
					aUrlParameters.push(parameter + "=" + oParameters.oUrlParameters[parameter]);
				}

				for (var i = 0; i < aUrlParameters.length; i++) {
					sUrlParameters = sUrlParameters + aUrlParameters[i];
					if (i !== aUrlParameters.length - 1) {
						sUrlParameters = sUrlParameters + "&";
					}
				}

				deffered = $q.defer();

				if (oParameters.bShowSpinner) {
					$rootScope.$emit('LOAD');
				}

				oHttp = $http({
					url: oParameters.sPath,
					method: oParameters.sRequestType,
					headers: {
						'Content-Type': sContentType
					},
					data: sUrlParameters,
				});

				oHttp.success($.proxy(function(oData, status, headers, config) {
					this.commonOnSuccess(oParameters);
					deffered.resolve(oData);
				}, this));

				oHttp.error($.proxy(function(oData, status, headers, config) {
					this.commonOnError(oParameters, deffered);
					// if (status === 401) {
					// 	window.location.href = "#/signIn/";
					// 	$scope.globalData.userName = jQuery.i18n.prop('mainView.guestTE');
					// }
				}, this));

				return deffered.promise;
			},

			constructChangeBlockForBatch: function(oParameters) {
				var oChangeBlock = {
					__changeRequests: []
				};

				for (var i = 0; i < oParameters.aData.length; i++) {
					oChangeBlock.__changeRequests.push(oParameters.aData[i]); // aData[i] = {requestUri, method, data}
				}

				oParameters.oRequestData.__batchRequests.push(oChangeBlock);
			},

			batchRequest: function(oParameters) {
				var deffered = $q.defer();

				if (oParameters.oRequestData.__batchRequests.length) {
					OData.request({
						requestUri: $window.location.origin + $window.location.pathname + "odata.svc/$batch",
						method: "POST",
						data: oParameters.oRequestData
					}, function(data) {
						deffered.resolve(data.__batchResponses);
					}, function(err) {}, OData.batchHandler);
				}
				return deffered.promise;
			},

			ajaxRequest: function(oParameters) { // sPath, oData, bAsync, oEventHandlers, sRequestType
				if (!oParameters.sRequestType) {
					oParameters.sRequestType = "POST";
				}
				if (oParameters.bShowSpinner) {
					$rootScope.$emit('LOAD');
				}

				$.ajax({
					type: oParameters.sRequestType,
					async: oParameters.bAsync,
					url: oParameters.sPath,
					data: oParameters.oData,
					dataType: oParameters.sDataType,
					beforeSend: function() {},
					success: $.proxy(function(data) {
						this.commonOnSuccess(oParameters);
						if (oParameters.oEventHandlers && oParameters.oEventHandlers.onSuccess) {
							oParameters.oEventHandlers.onSuccess(data);
						}
					}, this),
					error: $.proxy(function(data) {
						this.commonOnError(oParameters);
						if (oParameters.oEventHandlers && oParameters.oEventHandlers.onError) {
							oParameters.oEventHandlers.onError(data);
						}
					}, this)
				});
			},
		}
	}
]);