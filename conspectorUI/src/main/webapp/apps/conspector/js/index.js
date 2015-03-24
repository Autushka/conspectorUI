/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var oDeviceInfo = {};

var oHybridApp = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        document.addEventListener("pause", function() {
            console.log('pause...');

        //     OData.request({
        //         requestUri: oGlobalConstants.sServicePath + "UserDevices?$filter=DeviceToken eq '" + oDeviceInfo.sDeviceToken + "'",
        //         method: 'GET',
        //     }, function(aData) {
        //         for (var i = aData.results.length - 1; i >= 0; i--) {
        //             //Things[i]
        //             OData.request({
        //                 requestUri: oGlobalConstants.sServicePath + "UserDevices('" + aData.results[i].Guid + "')",
        //                 method: 'PUT',
        //                 data: {
        //                     BadgeNumber: 0
        //                 }
        //             }, function() {
        //                 console.log('updated...');
        //             });
        //         }
        //     });
        // }, false);

        var pushNotification = window.plugins.pushNotification;

        var errorHandler = function(error) {
            console.log('Error: ' + error);
            //alert("Yo2");
        };

        function onNotificationAPN(e) {
            // Event callback that gets called when your device receives a notification
            console.log('onNotificationAPN called!');
            console.log(e);


            // if (e.badge) {
            //     var iBadgeNumber = pushNotification.getApplicationIconBadgeNumber();

            //     pushNotification.setApplicationIconBadgeNumber(successHandler, iBadgeNumber + 1);
            // }
            // if (e.sound) {
            //     var sound = new Media(e.sound);
            //     sound.play();
            // }
            // if (e.alert) {
            //     navigator.notification.alert(e.alert);
            // }
        };

        var tokenHandler = $.proxy(function(result) {
            console.log('device token: ' + result);
            oDeviceInfo.sDeviceToken = result;
            // alert("Yo3" + oDeviceInfo.sDeviceToken);
            //alert('device token: '+ result);
            // Your iOS push server needs to know the token before it can push to this device
            //channel = 'pushNotifications';//result.substr(result.length - 7).toLowerCase();
            //alert('channel: ' + channel);
            // var c = document.querySelector('.channel');
            // c.innerHTML = 'Your Device ID: <strong>' + channel + '</strong>';
            // c.classList.remove('blink'); 

            // pubnub.publish({
            //     channel: channel,
            //     message: {
            //         regid: result
            //     },
            //     callback: function(m) {console.log(m);}
            // });

            // pubnub.subscribe({
            //     channel: channel,
            //     callback: function(m) {
            //         console.log(m);


            //         //t.classList.remove('gears');
            //         // if(m.setting) {
            //         //     t.textContent = m.setting + '°';
            //         // }
            //     }
            // });  
        }, this);

        pushNotification.register(tokenHandler, errorHandler, {
            'badge': 'false',
            'sound': 'true',
            'alert': 'true',
            'ecb': 'onNotificationAPN'
        });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        // console.log('Received Event: ' + id);
    }
};

oHybridApp.initialize();