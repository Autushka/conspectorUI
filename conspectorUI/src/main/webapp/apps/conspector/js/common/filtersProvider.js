angular.module('filtersProvider', [])
    .filter('phoneFormatter', function() {
        return function(sPhone) {
            if (!sPhone) {
                return '';
            }
            var value = sPhone.toString().trim().replace(/^\+/, '');
            if (value.match(/[^0-9]/)) {
                return sPhone;
            }
            var country, city, number;
            switch (value.length) {
                case 10: // +1PPP####### -> C (PPP) ###-####
                    country = 0;
                    city = value.slice(0, 3);
                    number = value.slice(3);
                    break;
                case 11: // +CPPP####### -> CCC (PP) ###-####
                    country = 1;
                    city = value.slice(1, 4);
                    number = value.slice(4);
                    break;
                    // case 12: // +CCCPP####### -> CCC (PP) ###-####
                    //     country = value.slice(0, 3);
                    //     city = value.slice(3, 5);
                    //     number = value.slice(5);
                    //     break;
                default:
                    return sPhone;
            }
            if (country == 1) {
                country = "1";
            }
            if (country == 0) {
                country = "";
            }
            number = number.slice(0, 3) + '-' + number.slice(3);
            return (country + " (" + city + ") " + number).trim();
        };
    })
/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
    .filter('orFilter', function() {  
        return function(items, props) {
            var out = [];
            if (angular.isArray(items)) {
                items.forEach(function(item) {
                    var itemMatches = false;
                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }
                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }
            return out;
        };
    });