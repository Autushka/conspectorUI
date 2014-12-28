//types
app.factory('TYPES', [function() {
	return {
		oEntityCacheStructure: {
			aCachedRequests: [], // array with content {sRequestSettings: "", aEntitiesArray: []}
			// oCurrentEntity: {},
			// bDisplayMode: true,
			// bCreateNewMode: false,
			sListSearchFilter: "",
			oListColumnFilters: {},
			oListSelectCriterias: {}			
		}
	}
}]);
