viewControllers.controller('myProfileView', function($scope, $rootScope, dataSrv, globalSrv, $window, $timeout) {
	$scope.viewTitleTE = jQuery.i18n.prop('myProfileView.viewTitleTE');
	$scope.saveTE = jQuery.i18n.prop('myProfileView.saveTE');
	$scope.userNameTE = jQuery.i18n.prop('myProfileView.userNameTE');
	$scope.emailTE = jQuery.i18n.prop('myProfileView.emailTE');
	$scope.communicationLnTE = jQuery.i18n.prop('myProfileView.communicationLnTE');
	

	// $scope.oldPasswordTE = jQuery.i18n.prop('changePasswordView.oldPasswordTE');
	// $scope.newPasswordTE = jQuery.i18n.prop('changePasswordView.newPasswordTE');
	// $scope.confirmNewPasswordTE = jQuery.i18n.prop('changePasswordView.confirmNewPasswordTE');
	// $scope.cancelTE = jQuery.i18n.prop('global.cancelTE');

	// $scope.localAvatarTE = jQuery.i18n.prop('myProfileView.localAvatarTE');
	// $scope.gravatarTE = jQuery.i18n.prop('myProfileView.gravatarTE');
	// $scope.userNameTE = jQuery.i18n.prop('myProfileView.userNameTE');
	
	// $scope.viewTitleTE = jQuery.i18n.prop('changePasswordView.viewTitleTE');
	// $scope.oldPasswordTE = jQuery.i18n.prop('changePasswordView.oldPasswordTE');
	// $scope.newPasswordTE = jQuery.i18n.prop('changePasswordView.newPasswordTE');
	// $scope.confirmNewPasswordTE = jQuery.i18n.prop('changePasswordView.confirmNewPasswordTE');
	

	// $scope.changeGravatarTE = jQuery.i18n.prop('myProfileView.changeGravatarTE');
	// $scope.selectAvatarTE = jQuery.i18n.prop('myProfileView.selectAvatarTE');

	$scope.avatarType = "gravatar";
	$scope.isSelectAvatarOptionHidden = true;
	$scope.avatarPath = "";
	$scope.sUrl = "rest/file/list/user/" + $scope.globalData.userName + "/_avatar_";

	var refreshProfileData = function() {
		var oGetProfileDataSrv = dataSrv.httpRequest("jsp/account/getProfileData.jsp", {});
		oGetProfileDataSrv.then(function(aData) {
			$scope.oProfileData = aData[0];
			$scope.sProfileAvatarURL = CryptoJS.MD5($scope.oProfileData.email).toString();

			if ($scope.oProfileData.avatarFileGuid) {
				$scope.avatarType = "local";
				$scope.avatarPath = $window.location.origin + $window.location.pathname + "rest/file/get/";
				$rootScope.selectedPhotoID = $scope.oProfileData.avatarFileGuid;
			} else {
				$scope.avatarType = "gravatar";
				$scope.avatarPath = "img/noAvatar.jpg";
				$rootScope.selectedPhotoID = "";
			}

			switch ($scope.oProfileData.language) {
				case "en":
					$scope.communicationLn = $scope.communicationLns[0];
					break;
				case "fr":
					$scope.communicationLn = $scope.communicationLns[1];
					break;
			}
		});

		var oGetProfileAvatar = dataSrv.httpRequest($scope.sUrl, {});
		oGetProfileAvatar.then(function(aData) {
			if (aData.length > 1) {
				$scope.isSelectAvatarOptionHidden = false;
			}
		});

	};

	refreshProfileData();

	$scope.onSaveClick = function() {
		var oProfileDataForCommit = {};
		oProfileDataForCommit.email = $scope.oProfileData.email;
		oProfileDataForCommit.language = $scope.communicationLn.code;

		var saveProfileData = function() {
			var oChangeProfileDataSrv = dataSrv.httpRequest("jsp/account/changeProfileData.jsp", oProfileDataForCommit, "POST", true);
			oChangeProfileDataSrv.then(function(oData) {
				var bNoErrorMessages = globalSrv.messagesHandler(oData.messages);
				if (bNoErrorMessages) {
					$scope.sProfileAvatarURL = CryptoJS.MD5($scope.oProfileData.email).toString();
				}
			});
		};

//		if ($scope.file != undefined) {
//
//			var sUrl = "rest/file/upload/user/" + $scope.globalData.userName + "/_avatar_";
//			$scope.upload = $fileUploader.upload({
//				url: sUrl, // upload.php script, node.js route, or servlet url
//				method: "POST",// or PUT,
//				headers: {
//					'Content-Type': 'multipart/form-data'
//				},
//				// headers: {'header-key': 'header-value'},
//				// withCredentials: true,
//				data: {
//
//				},
//				file: $scope.file, // or list of files: $files for html5 only
//			/* set the file formData name ('Content-Desposition'). Default is 'file' */
//			// fileFormDataName: myFile, //or a list of names for multiple files (html5).
//			/* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
//			// formDataAppender: function(formData, key, val){}
//			}).progress(function(evt) {
//				// console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
//			}).success(function(data, status, headers, config) {
//				$scope.file = undefined;
//				var oGetProfileAvatar = dataSrv.httpRequest($scope.sUrl, {});
//				oGetProfileAvatar.then(function(aData) {
//					oProfileDataForCommit.avatarFileGuid = aData[aData.length - 1].rowId;
//
//					$scope.avatarPath = $window.location.origin + $window.location.pathname + "rest/file/get/";
//					$rootScope.selectedPhotoID = oProfileDataForCommit.avatarFileGuid;
//					saveProfileData();
//				});
//			});
//		} else {
//			oProfileDataForCommit.avatarFileGuid = $rootScope.selectedPhotoID;
//			if ($scope.avatarType === "gravatar") {
//				oProfileDataForCommit.avatarFileGuid = 0;
//				$scope.avatarPath = "";
//				$rootScope.selectedPhotoID = "img/noAvatar.jpg";
//			}
//			saveProfileData();
//		}

	};

	$scope.onSelectAvatar = function() {
		var sUrl = "rest/file/list/user/" + $scope.globalData.userName + "/_avatar_";
		var oGetProfileAvatar = dataSrv.httpRequest(sUrl, {});
		oGetProfileAvatar.then(function(aData) {
			$rootScope.galleryPhotosLocation = $window.location.origin + $window.location.pathname + "rest/file/get/";
			$scope.avatarPath = $window.location.origin + $window.location.pathname + "rest/file/get/";
			$rootScope.galleryData = [];
			for (var i = 0; i < aData.length; i++) {
				$rootScope.galleryData.push({
					image: aData[i].rowId
				});
			}
			$rootScope.selectedPhoto = $rootScope.galleryData[0];
			$rootScope.selectedPhotoID = $rootScope.galleryData[0].image;

			$rootScope.galleryListPosition = {
				left: "0px"
			};

			if (!$rootScope.isGalleryFadeAnimationOn) {
				$rootScope.isGalleryFadeAnimationOn = true;
				$timeout(function() {
					$rootScope.isGalleryHidden = false;
				}, 5);
			} else {
				$rootScope.isGalleryHidden = false;
			}
		});
	};

//	$scope.file = undefined;
//	$scope.onFileSelect = function($files) {
//		// $files: an array of files selected, each file has name, size, and type.
//		for (var i = 0; i < $files.length; i++) {
//			$scope.file = $files[i];
//
//			// .error(...)
//			// .then(success, error, progress);
//			// .xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to
//			// XMLHttpRequest.
//		}
//		/*
//		 * alternative way of uploading, send the file binary with the file's content-type. Could be used to upload files
//		 * to CouchDB, imgur, etc... html5 FileReader is needed. It could also be used to monitor the progress of a normal
//		 * http post/put request with large data
//		 */
//		// $scope.upload = $upload.http({...}) see 88#issuecomment-31366487 for sample code.
//	};

	$scope.onCancelClick = function() {
		refreshProfileData();
	};

});