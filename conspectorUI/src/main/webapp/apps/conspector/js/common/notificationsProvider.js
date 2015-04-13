app.factory('notificationsProvider', ['$translate',
    function() {
        return {
            sayHello: function(name) {
                console.log("hey" + name);

            }
        }

    }
]);