angular.module('controlsProvider', [])
	.directive('cnpPhotoGallery', function() {
		return {
			restrict: 'E',
			scope: true,
			controller: function($scope, $rootScope) {
				var IMAGE_WIDTH = 400;
				$scope.stopPropagation = function($event) {
					$event.stopPropagation();
				};
				$scope.scrollTo = function(image, ind) {
					$rootScope.oGalleryListPosition = {
						left: (IMAGE_WIDTH * ind * -1) + "px"
					};
					$rootScope.sSelectedPhotoID = image.sGuid;
					$rootScope.oSelectedPhoto = image;
				};
			},
			templateUrl: 'apps/conspector/js/templates/photoGallery.html',
		};
});
