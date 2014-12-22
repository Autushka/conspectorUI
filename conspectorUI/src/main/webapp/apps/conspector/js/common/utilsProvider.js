app.factory('utilsProvider', ['$mdToast',
	function($mdToast) {
		return {
			displayMessage: function(oParameters) { //sText, sType
				var oToast = $mdToast.simple();
				oToast.content(oParameters.sText);
				oToast.hideDelay(2000);
				oToast.position("top right");

				$mdToast.show(oToast);
			},

			generateGUID: function() {
				var d = new Date().getTime();
				var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					var r = (d + Math.random() * 16) % 16 | 0;
					d = Math.floor(d / 16);
					return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
				});
				return guid;
			},

			dateToDBDate: function(dDate){

				var iDate =  dDate.getTime() -  dDate.getTime()%1000; // db rounds the value till seconds
				return "/Date(" + iDate.toString() + ")/";
			},

			setCookieFromJson: function(sKey, oObj) {
				$.removeCookie(sKey);
				$.cookie(sKey, JSON.stringify(oObj));
			},

			getJsonCookie: function(sKey) {
				if ($.cookie(sKey)) {
					return JSON.parse($.cookie(sKey));
				}
			},

			removeCookie: function(sKey) {
				$.removeCookie(sKey);
			},

			convertJsonArrayToString: function(aObj) {
				sReturn = '[';
				for (var i = 0; i < aObj.length; i++) {
					sReturn = sReturn + '{';
					var aProp = [];
					for (var propt in aObj[i]) {
						aProp.push(propt);
					}
					for (var j = 0; j < aProp.length; j++) {
						if (j != (aProp.length - 1)) {
							sReturn = sReturn + '\"' + aProp[j] + '\":' + '\"' + aObj[i][aProp[j]] + '\", ';
						} else {
							sReturn = sReturn + '\"' + aProp[j] + '\":' + '\"' + aObj[i][aProp[j]] + '\"';
						}
					}
					if (i != (aObj.length - 1)) {
						sReturn = sReturn + '}, ';
					} else {
						sReturn = sReturn + '}';
					}
				}
				sReturn = sReturn + ']';
				return sReturn;
			},

			getParameterByName: function(sName) {
				var sURL = window.location.href.replace("#", "");
				sName = sName.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
				var regexS = "[\\?&]" + sName + "=([^&#]*)";
				var regex = new RegExp(regexS);
				var results = regex.exec(sURL);
				if (results == null)
					return "";
				else
					return decodeURIComponent(results[1].replace(/\+/g, " "));
			}
		}
	}
]);