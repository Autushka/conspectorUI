//types
app.factory('TYPES', [function() {
	return {
		oEntityCacheStructure: {
			aCachedRequests: [], // array with content {sRequestSettings: "", aEntitiesArray: []}
			sListSearchFilter: "",
			oListColumnFilters: {},
			oListSelectCriterias: {}			
		}
	}
}]);
