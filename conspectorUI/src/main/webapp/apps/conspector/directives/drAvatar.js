angular.module('conspector').directive('drAvatar', ['$window', 'CONSTANTS',
    function($window, CONSTANTS ) {
        return {
            restrict: 'EA',
            scope: {
                user: '=',
                size: '@'
            },
            // transclude: true,
            template: '<img ng-src="{{ ::url }}" style="height: {{ ::sizeInPx }}px; width: {{ ::sizeInPx }}px;"/>',
            link: function(scope, element, attrs) {
                // scope.url = url;
                scope.url = "";
                if (scope.size === 'small') {
                    scope.sizeInPx = '30';
                }
                if (scope.size === 'medium') {
                    scope.sizeInPx = '40';
                }
                if (scope.size === 'large') {
                    scope.sizeInPx = '200';
                }
                if (scope.user.sAvatarFileGuid) {
                    // check for path for mobile
                    scope.url = CONSTANTS.sAppAbsolutePath + "rest/file/v2/get/" + scope.user.sAvatarFileGuid;

                } else {
                    if (scope.user.EMail === "") {
                        scope.user.EMail = "deficien@cyDetails.com";
                    }
                    var MD5 = new Hashes.MD5();
                    scope.url = "http://www.gravatar.com/avatar/" + MD5.hex(scope.user.EMail) + ".png?d=identicon" + "&s=" + scope.sizeInPx;
                }


            }
        };
    }
]);