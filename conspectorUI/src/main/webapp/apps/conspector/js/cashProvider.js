app.factory('cashProvider', function() {
	return {
		oEntitiesCash: {
			oDeficiencyEntity: TYPES.oEntityCashStructure,
			oAccountEntity: TYPES.oEntityCashStructure,
			oUnitEntity: TYPES.oEntityCashStructure,
			oUserEntity: TYPES.oEntityCashStructure,
			oRoleEntity: TYPES.oEntityCashStructure,
			oProjectEntity: TYPES.oEntityCashStructure,
			oStatusEntity: TYPES.oEntityCashStructure,
			oPriorityEntity: TYPES.oEntityCashStructure,
			oVersion: TYPES.oEntityCashStructure,
			oAccountTypeEntity: TYPES.oEntityCashStructure
		},

		oUserProfile: {},

		getFromCash: function(sCashProviderAttribute, sRequestSettings) {
			for (var i = 0; i < this.oEntitiesCash[sCashProviderAttribute].aCashedRequests.length; i++) {
				if (this.oEntitiesCash[sCashProviderAttribute].aCashedRequests[i].sRequestSettings === sRequestSettings) {
					return this.oEntitiesCash[sCashProviderAttribute].aCashedRequests[i].aEntitiesArray;
				}
			}
			return [];
		},

		putToCash: function(sCashProviderAttribute, sRequestSettings, aArray) {
			this.oEntitiesCash[sCashProviderAttribute].aCashedRequests.push({
				sRequestSettings: sRequestSettings,
				aEntitiesArray: aArray
			});
		},

		cleanEntitiesCash: function(sForEntity, sRequestSettings) {
			if (sForEntity && !sRequestSettings) {
				this.oEntitiesCash[sForEntity] = TYPES.oEntityCashStructure;
				return;
			}
			if (sForEntity && sRequestSettings) {
				for (var i = 0; i < this.oEntitiesCash[sForEntity].aCashedRequests.length; i++) {
						if (this.oEntitiesCash[sForEntity].aCashedRequests[i].sRequestSettings === sRequestSettings) {
						this.oEntitiesCash[sForEntity].aCashedRequests.splice(i, 1);
						break;
					}
				};
				return;
			}
			for (var sAttribute in this.oEntitiesCash) {
				this.oEntitiesCash[sAttribute] = TYPES.oEntityCashStructure;
			}
		}
	}
});