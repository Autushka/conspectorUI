angular.module('conspector').directive('drDate', ['$translate', '$filter',
    function($translate, $filter) {
        return {
            restrict: 'EA',
            scope: {
                drRawDate: '@',
                drFormat: '@'
            },
            // transclude: true,
            template: '<span>{{ formattedDate }}</span>',
            link: function(scope, element, attrs) {
               scope.formattedDate = scope.drRawDate.replace(/[^0-9]/g, '');
               scope.formattedDate = $filter('date')(scope.formattedDate, scope.drFormat);
            }
        };
    }
]);