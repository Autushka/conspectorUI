app.factory('cacheProvider', ['TYPES', function(TYPES) {
	return {
		oEntitiesCache: {
			oDeficiencyEntity: angular.copy(TYPES.oEntityCacheStructure),
			oAccountEntity: angular.copy(TYPES.oEntityCacheStructure),
			oUnitEntity: angular.copy(TYPES.oEntityCacheStructure),
			oCompanyEntity: angular.copy(TYPES.oEntityCacheStructure),
			oUserEntity: angular.copy(TYPES.oEntityCacheStructure),
			oRoleEntity: angular.copy(TYPES.oEntityCacheStructure),
			oProjectEntity: angular.copy(TYPES.oEntityCacheStructure),
			oPhaseEntity: angular.copy(TYPES.oEntityCacheStructure),
			oRoleEntity: angular.copy(TYPES.oEntityCacheStructure),	
			oOperationLogEntity: angular.copy(TYPES.oEntityCacheStructure),			
			oTaskStatusEntity: angular.copy(TYPES.oEntityCacheStructure),
			oTaskPriorityEntity: angular.copy(TYPES.oEntityCacheStructure),
			//Not sure if this one is still used.
			oPriorityEntity: angular.copy(TYPES.oEntityCacheStructure),
			//
			//oVersion: angular.copy(TYPES.oEntityCacheStructure),
			oAccountTypeEntity: angular.copy(TYPES.oEntityCacheStructure),
		},

		oUserProfile: {},

		getFromCache: function(sCacheProviderAttribute, sRequestSettings) {
			for (var i = 0; i < this.oEntitiesCache[sCacheProviderAttribute].aCachedRequests.length; i++) {
				if (this.oEntitiesCache[sCacheProviderAttribute].aCachedRequests[i].sRequestSettings === sRequestSettings) {
					return this.oEntitiesCache[sCacheProviderAttribute].aCachedRequests[i].aEntitiesArray;
				}
			}
			return [];
		},

		putToCache: function(sCacheProviderAttribute, sRequestSettings, aArray) {
			this.oEntitiesCache[sCacheProviderAttribute].aCachedRequests.push({
				sRequestSettings: sRequestSettings,
				aEntitiesArray: aArray
			});
		},

		cleanEntitiesCache: function(sForEntity, sRequestSettings) {
			if (sForEntity && !sRequestSettings) {
				this.oEntitiesCache[sForEntity] = angular.copy(TYPES.oEntityCacheStructure);
				return;
			}
			if (sForEntity && sRequestSettings) {
				for (var i = 0; i < this.oEntitiesCache[sForEntity].aCachedRequests.length; i++) {
						if (this.oEntitiesCache[sForEntity].aCachedRequests[i].sRequestSettings === sRequestSettings) {
						this.oEntitiesCache[sForEntity].aCachedRequests.splice(i, 1);
						break;
					}
				};
				return;
			}
			for (var sAttribute in this.oEntitiesCache) {
				this.oEntitiesCache[sAttribute] = angular.copy(TYPES.oEntityCacheStructure);
			}
		},

		cleanProfileCache: function(){
			this.oUserProfile = {};
		},

		cleanAllCache: function(){
			this.cleanEntitiesCache();
			this.cleanProfileCache();
		},

		getEntityDetails: function(oParameters){
			var oEntity = {};
			for (var i = 0; i < this.oEntitiesCache[oParameters.sCacheProviderAttribute].aCachedRequests.length; i++) {
				if(this.oEntitiesCache[oParameters.sCacheProviderAttribute].aCachedRequests[i].sRequestSettings === oParameters.sRequestSettings){
					for (var j = 0; j < this.oEntitiesCache[oParameters.sCacheProviderAttribute].aCachedRequests[i].aEntitiesArray.length; j++) {
						if(this.oEntitiesCache[oParameters.sCacheProviderAttribute].aCachedRequests[i].aEntitiesArray[j][oParameters.sKeyName] === oParameters.sKeyValue){
							oEntity = angular.copy(this.oEntitiesCache[oParameters.sCacheProviderAttribute].aCachedRequests[i].aEntitiesArray[j]);
							break;
						}
					}
					break;
				}
			}

			return oEntity;
		}
	}
}]);