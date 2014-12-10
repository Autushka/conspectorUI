app.factory('genericODataFactory', function($resource) {
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
		'post': {
			method: "POST",
			url: sServicePath + ":path"
		},
		'put': {
			method: 'PUT',
			params: {
				key: "@key"
			},
			url: sServicePath + ":path" + "(':key')" + '?$format=json'
		},
		'getEntity': {
			method: 'GET',
			params: {
				key: "@key"
			},
			url: sServicePath + ":path" + "(':key')" + '?$expand=' + ":expand" + '&$format=json'
		},
		'delete': {
			method: 'DELETE',
			params: {
				key: "@key"
			},
			url: sServicePath + ":path" + "(':key')"
		}
	});
});

app.factory('dataProvider', function(genericODataFactory, utilsProvider, $q, $rootScope) {
	return {
		commonOnSuccess: function(oParameters) {
			if (oParameters.bShowSpinner) {
				$rootScope.$emit('UNLOAD');
			}
			if (oParameters.bShowSuccessMessage) {
				utilsProvider.displayMessage({
					sText: jQuery.i18n.prop('globalTE.successOperationNoticeTE'),
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
					sText: jQuery.i18n.prop('globalTE.failureOperationNoticeTE'),
					sType: 'error'
				});
			}
			deffered.reject();
		},

		getEntitySet: function(oParameters) { //bShowSpinner, sPath, sFilter, sExpand, oCashProvider, sCashProviderAttribute 
			var oOdataSrv = {};
			var deffered = $q.defer();
			var aCashedEntities = [];
			var sRequestSettings = oParameters.sKey + oParameters.sFilter + oParameters.sExpand;

			//return cash for request with specific settings (key, filter and expand) if required
			if (oParameters.oCashProvider && oParameters.sCashProviderAttribute) {
				aCashedEntities = oParameters.oCashProvider.getFromCash(oParameters.sCashProviderAttribute, sRequestSettings);
				if(aCashedEntities.length){
					return aCashedEntities;
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
				if(oParameters.oCashProvider && oParameters.sCashProviderAttribute && oData.d.results.length){
					oParameters.oCashProvider.putToCash(oParameters.sCashProviderAttribute, sRequestSettings, oData.d.results);
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

			oOdataSrv = (new genericODataFactory()).$getEntity({
				path: oParameters.sPath,
				expand: oParameters.sExpand,
				key: oParameters.sKey, //TODO: check what should be a proper name for the attribute here and in other methods
			});

			oOdataSrv.then($.proxy(function(oData) {
				this.commonOnSuccess(oParameters);
				deffered.resolve(oData.d);
			}, this), $.proxy(function() {
				this.commonOnError(oParameters, deffered);
			}, this));
			return deffered.promise;
		},

		updateEntity: function(oParameters) {
			var oOdataSrv = {};
			var deffered = $q.defer();

			if (oParameters.bShowSpinner) {
				$rootScope.$emit('LOAD');
			}

			oOdataSrv = (new genericODataFactory(oParameters.oData)).$put({
				path: oParameters.sPath,
				key: oParameters.sKey,
			});

			oOdataSrv.then($.proxy(function(oData) { // }
				this.commonOnSuccess(oParameters);
				deffered.resolve(oData.d);
			}, this), $.proxy(function() {
				this.commonOnError(oParameters, deffered);
			},this));
			return deffered.promise;
		},

		createEntity: function(oParameters) {
			var oOdataSrv = {};
			var deffered = $q.defer();

			if (oParameters.bShowSpinner) {
				$rootScope.$emit('LOAD');
			}

			oOdataSrv = (new genericODataFactory(oParameters.oData)).$post({
				path: oParameters.path,
			});

			oOdataSrv.then($.proxy(function(oData) {
				this.commonOnSuccess(oParameters);
				deffered.resolve(oData.d);
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

			if(!oParameters.sRequestType){
				oParameters.sRequestType = "GET";
			}
			
			for ( var parameter in oParameters.oUrlParameters) {
				aUrlParameters.push(parameter + "=" + oParameters.oUrlParameters[parameter]);
			}

			for (var i = 0; i < aUrlParameters.length; i++) {
				sUrlParameters = sUrlParameters + aUrlParameters[i];
				if(i !== aUrlParameters.length - 1){
					sUrlParameters = sUrlParameters + "&";
				}
			}
			
			deffered = $q.defer();
			
			if(oParameters.bShowBusyIndicator){
				$rootScope.$emit('LOAD');				
			}
			
			oHttp = $http({
				url: oParameters.sPath,
				method: sRequestType,
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

		ajaxRequest: function(oParameters) { // sPath, oData, bAsync, oEventHandlers, sRequestType
			if(!oParameters.sRequestType){
				oParameters.sRequestType = "POST";
			}

			$.ajax({
				type: oParameters.sRequestType,
				async: oParameters.bAsync,
				url: oParameters.sPath,
				data: oParameters.oData,
				beforeSend: function() {
				},
				success: function(data) {
					if (oParameters.oEventHandlers && oParameters.oEventHandlers.onSuccess) {
						oParameters.oEventHandlers.onSuccess(data);
					}
				},
				error: function(data) {
					if (oParameters.oEventHandlers && oParameters.oEventHandlers.onError) {
						oParameters.oEventHandlers.onError(data);
					}
				}
			});
		},			
	}
});