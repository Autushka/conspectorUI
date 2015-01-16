app.factory('historyProvider', [
	function() {
		return {
			aHistoryStates: [],

			addStateToHistory: function(oParameters){
				this.aHistoryStates.push(oParameters);
			},
			navigateBack: function(oParameters){
				var oStateTo = this.aHistoryStates[this.aHistoryStates.length - 1];
				this.aHistoryStates.pop();
				oParameters.oState.go(oStateTo.sStateName, oStateTo.oStateParams);
			},
			removeHistory: function(){
				this.aHistoryStates = [];
			}			
		}
	}
]);