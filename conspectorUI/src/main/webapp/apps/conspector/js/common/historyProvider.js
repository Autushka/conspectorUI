app.factory('historyProvider', [
	function() {
		return {
			aHistoryStates: [],
			bBackNavigationFlag: false,//needed to deel with problem when navigating from view with back button to view with back button

			addStateToHistory: function(oParameters){
				if(!this.bBackNavigationFlag){
					this.aHistoryStates.push(oParameters);
				}
				this.bBackNavigationFlag = false;
			},
			navigateBack: function(oParameters){
				this.bBackNavigationFlag = true;
				var oStateTo = this.aHistoryStates[this.aHistoryStates.length - 1];
				this.aHistoryStates.pop();
				oParameters.oState.go(oStateTo.sStateName, oStateTo.oStateParams);
			},
			removeHistory: function(){
				this.aHistoryStates = [];
			},
			getPreviousStateName: function(){
				var sStatusName = ""
				if(this.aHistoryStates.length && this.aHistoryStates[this.aHistoryStates.length - 1]){
					sStatusName = this.aHistoryStates[this.aHistoryStates.length - 1].sStateName;
				}
				return sStatusName;
			}			
		}
	}
]);