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

			dateToDBDate: function(dDate) {

				var iDate = dDate.getTime() - dDate.getTime() % 1000; // db rounds the value till seconds
				return "/Date(" + iDate.toString() + ")/";
			},

			dateToString: function(date) { // always fixed ISO date format
				var sFullDate = "";
				var sDate = date.getDate().toString();
				var sMonth = (date.getMonth() + 1).toString();
				var sYear = date.getFullYear();
				var sHours = date.getHours();
				if (sHours.toString().length === 1) {
					sHours = "0" + sHours;
				}
				var sMinutes = date.getMinutes();
				if (sMinutes.toString().length === 1) {
					sMinutes = "0" + sMinutes;
				}
				var sSeconds = date.getSeconds();
				if (sSeconds.toString().length === 1) {
					sSeconds = "0" + sSeconds;
				}

				if (sDate.length === 1) {
					sDate = '0' + sDate;
				}
				if (sMonth.length === 1) {
					sMonth = '0' + sMonth;
				}
				sFullDate =  sMonth + "/" + sDate + "/" + sYear + " " + sHours + ":" + sMinutes + ":" + sSeconds;
				return sFullDate;
			},

			dBDateToDate: function(sDBDate) {
				if (sDBDate === null || sDBDate === undefined || sDBDate === "") {
					return sDBDate;
				}
				var sDate = sDBDate.substring(6, sDBDate.length - 2);
				var dDate = new Date(parseInt(sDate));
				return dDate; //this.dateToString(dDate);
			},

			dBDateToSting: function(sDBDate) {
				if (sDBDate === null || sDBDate === undefined || sDBDate === "") {
					return sDBDate;
				}
				return this.dateToString(this.dBDateToDate(sDBDate));
			},

			stringToJson: function(sString) {
				var oObj = $.parseJSON(sString);
				return oObj;
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
				if (results == null) {
					return "";
				} else {
					return decodeURIComponent(results[1].replace(/\+/g, " "));
				}
			},


			tagsStringToTagsArray: function(sTags) {
				var aTags = [];
				var aTexts = [];
				if (sTags === null || sTags === undefined || sTags === "") {
					return aTags;
				}
				sTags = sTags.substring(0, sTags.length - 1); // remove last ';'
				aTexts = sTags.split(";");
				for (var i = 0; i < aTexts.length; i++) {
					aTags.push({
						text: aTexts[i]
					});
				}
				return aTags;
			},

			tagsArrayToTagsString: function(aTags) {
				var sTags = "";
				for (var i = 0; i < aTags.length; i++) {
					if (i !== 0) {
						sTags = sTags + " " + aTags[i].text + ';';
					} else {
						sTags = sTags + aTags[i].text + ';';
					}
				}
				return sTags;
			},
		}
	}
]);