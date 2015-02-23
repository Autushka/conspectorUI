app.factory('utilsProvider', ['$mdToast', '$translate',
	function($mdToast, $translate) {
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

			convertStringToInt: function(sValue) {
				var bIsNum = /^\d+$/.test(sValue);
				if (bIsNum) {
					sValue = parseInt(sValue);
				}
				return sValue;
			},

			dateToDBDate: function(dDate) {

				var iDate = dDate.getTime() - dDate.getTime() % 1000; // db rounds the value till seconds
				return "/Date(" + iDate.toString() + ")/";
			},

			dateToString: function(date, bNoTime) { // always fixed ISO date format

				if (bNoTime) {

				}

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
					if ($translate.use() === "en") {
						switch (sMonth) {
							case '01':
								sMonth = "January";
								break;
							case '02':
								sMonth = "February";
								break;
							case '03':
								sMonth = "March";
								break;
							case '04':
								sMonth = "April";
								break;
							case '05':
								sMonth = "May";
								break;
							case '06':
								sMonth = "June";
								break;
							case '07':
								sMonth = "July";
								break;
							case '08':
								sMonth = "August";
								break;
							case '09':
								sMonth = "September";
								break;
							case '10':
								sMonth = "October";
								break;
							case '11':
								sMonth = "November";
								break;
							case '12':
								sMonth = "December";
								break;
						}
					}
					if ($translate.use() === "fr") {
						switch (sMonth) {
							case '01':
								sMonth = "janvier";
								break;
							case '02':
								sMonth = "f\u00E9vrier";
								break;
							case '03':
								sMonth = "mars";
								break;
							case '04':
								sMonth = "avril";
								break;
							case '05':
								sMonth = "mai";
								break;
							case '06':
								sMonth = "juin";
								break;
							case '07':
								sMonth = "juillet";
								break;
							case '08':
								sMonth = "ao\u00D4t";
								break;
							case '09':
								sMonth = "septembre";
								break;
							case '10':
								sMonth = "octobre";
								break;
							case '11':
								sMonth = "novembre";
								break;
							case '12':
								sMonth = "d\u00E9cembre";
								break;
						}
					}
				}
				if ($translate.use() === "en") {
					sFullDate = sMonth + " " + sDate + "th " + sYear + " " + sHours + ":" + sMinutes + ":" + sSeconds;
				}
				if ($translate.use() === "fr") {
					sFullDate = sDate + " " + sMonth + " " + sYear + " " + sHours + ":" + sMinutes + ":" + sSeconds;
				}
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
				aTexts = sTags.split("; ");
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
						sTags = sTags + " " + aTags[i].text.trim() + ';';
					} else {
						sTags = sTags + aTags[i].text + ';';
					}
				}
				return sTags;
			},

			replaceSpecialChars: function(sString) {//for filtering we don't care about upper/lower case....
				var dict = {
					'\u00e1': "a", //à
					'\u00e2': "a", //â
					'\u00e4': "a", //ä
					'\u00e9': "e", //é
					'\u00E8': "e", //è
					'\u00ea': "e", //ê
					'\u00eb': "e", //ë
					'\u00ee': "i", //î
					'\u00ef': "i", //ï
					'\u00f4': "o", //ô
					'\u00f9': "u", //ù
					'\u00fb': "u", //û
					'\u00fc': "u", //ü
					'\u00e7': "c" //ç
				};
				sString = sString.toString();

				sString = sString.replace(/[^A-Za-z0-9]/g, function(char) {///[^\w ]/g
					return dict[char.toLowerCase()] || char;
				});
				return sString;
			}
		}
	}
]);