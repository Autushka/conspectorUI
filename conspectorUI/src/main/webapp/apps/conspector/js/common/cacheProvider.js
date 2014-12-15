app.factory('cacheProvider', ['TYPES', function(TYPES) {
	return {
		oEntitiesCache: {
			oDeficiencyEntity: TYPES.oEntityCacheStructure,
			oAccountEntity: TYPES.oEntityCacheStructure,
			oUnitEntity: TYPES.oEntityCacheStructure,
			oUserEntity: TYPES.oEntityCacheStructure,
			oRoleEntity: TYPES.oEntityCacheStructure,
			oProjectEntity: TYPES.oEntityCacheStructure,
			oStatusEntity: TYPES.oEntityCacheStructure,
			oPriorityEntity: TYPES.oEntityCacheStructure,
			oVersion: TYPES.oEntityCacheStructure,
			oAccountTypeEntity: TYPES.oEntityCacheStructure
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
				this.oEntitiesCache[sForEntity] = TYPES.oEntityCacheStructure;
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
				this.oEntitiesCache[sAttribute] = TYPES.oEntityCacheStructure;
			}
		},

		cleanProfileCache: function(){
			this.oUserProfile = {};
		},

		cleanAllCache: function(){
			this.cleanEntitiesCache();
			this.cleanProfileCache();
		}
	}
}]);