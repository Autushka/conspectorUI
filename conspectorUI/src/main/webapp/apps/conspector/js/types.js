//types
var TYPES = (function($) {
	var types = {};
	types.oEntityCashStructure = {
		aCashedRequests: [], // array with content {sRequestSettings: "", aEntitiesArray: []}
		oCurrentEntity: {},
		bDisplayMode: true,
		bCreateNewMode: false,
		sListSearchFilter: "",
		oListColumnFilters: {},
		oListSelectCriterias: {}
	};
	return types;
}(jQuery));