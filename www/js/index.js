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
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        // document.addEventListener('pause', this.onPause.bind(this), false);
        // document.addEventListener("resume", this.onResume.bind(this), false);
        // document.addEventListener("backbutton", this.onBackKeyDown.bind(this), false);
        // document.addEventListener("menubutton", this.onMenuKeyDown.bind(this), false);
        // document.addEventListener("searchbutton", this.onSearchKeyDown.bind(this), false);
        // document.addEventListener("startcallbutton", this.onStartCallKeyDown.bind(this), false);
        // document.addEventListener("endcallbutton", this.onEndCallKeyDown.bind(this), false);
        // document.addEventListener("volumedownbutton", this.onVolumeDownKeyDown.bind(this), false);
        // document.addEventListener("volumeupbutton", this.onVolumeUpKeyDown.bind(this), false);
        // document.addEventListener("activated", this.activated.bind(this), false);
    },

    // Fired when the cordova is fully loaded
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        this.getWeatherLocation();
        this.enableVibration();
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
        alert('something');
    },

    // The pause event fires when the native platform puts the application into the background, typically when the user switches to a different application
    onPause: function() {
        // Handle the pause event
        console.log('application paused');
    },

    // Resume fires when the platform pulls the application out from the background.
    onResume: function() {
        // Handle the resume event
        console.log('application resumed');
    },

    onBackKeyDown: function() {
        // Handle the back button
        console.log('backbutton press');
    },

    onMenuKeyDown: function() {
        // Handle the back button
        console.log('menu press');
    },

    onSearchKeyDown: function() {
        // Handle the search button
        console.log('search key override');
    },

    onStartCallKeyDown: function() {
        // Handle the start call button
        console.log('call override');
    },

    onEndCallKeyDown: function() {
        // Handle the end call button
        console.log('end call override');
    },

    onVolumeDownKeyDown: function() {
        // Handle the volume down button
        console.log('volume down override');
    },

    onVolumeUpKeyDown: function() {
        // Handle the volume up button
        console.log('volume up override');
    },

    activated: function(args) {
        console.log('activated override');
    },

    enableVibration: function() {
        console.log('attaching events to vibration buttons');
        document.getElementById("startVibrate").addEventListener("click", function(){
            console.log('start vibrate');
            navigator.vibrate(3000);
        });

        document.getElementById("stopVibrate").addEventListener("click", function(){
            console.log('stop vibrate');
            navigator.vibrate(0);
        });
    },

    // Nearest weather conditions, almost as in tutorial, just a bit different to make it work as expected
    getWeatherLocation: function() {
        console.log('get weather');
        navigator.geolocation.getCurrentPosition(onWeatherSuccess, onWeatherError, { enableHighAccuracy: true });

        function onWeatherSuccess(position) {
            console.log('weather arrived');
            Latitude = position.coords.latitude;
            Longitude = position.coords.longitude;

            getWeather(Latitude, Longitude);
            // Put yourself on maps
            getMap(Latitude, Longitude);
            // Put places on map
            getPlaces(Latitude, Longitude);
        }

        function getWeather(latitude, longitude) {

            // Get a free key at http://openweathermap.org/. Replace the "Your_Key_Here" string with that key.
            var OpenWeatherAppKey = "256a24b5a94ea3ab7e07da06a44ba669";

            var queryString =
              'http://api.openweathermap.org/data/2.5/weather?lat='
              + latitude + '&lon=' + longitude + '&appid=' + OpenWeatherAppKey + '&units=imperial';

            console.log('request data');
            $.getJSON(queryString, function (results) {
                console.log('whats up');
                if (results.weather.length) {

                    $.getJSON(queryString, function (results) {
                        console.log('request after data');

                        if (results.weather.length) {

                            $('#description').text(results.name);
                            $('#temp').text(results.main.temp);
                            $('#wind').text(results.wind.speed);
                            $('#humidity').text(results.main.humidity);
                            $('#visibility').text(results.weather[0].main);

                            var sunriseDate = new Date(results.sys.sunrise);
                            $('#sunrise').text(sunriseDate.toLocaleTimeString());

                            var sunsetDate = new Date(results.sys.sunrise);
                            $('#sunset').text(sunsetDate.toLocaleTimeString());
                        }

                    });
                }
            }).fail(function () {
                console.log("error getting location");
            });
        }

        function getMap(latitude, longitude) {
            console.log('get map');
            var mapOptions = {
                center: new google.maps.LatLng(0, 0),
                zoom: 1,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(document.getElementById("map"), mapOptions);

            var latLong = new google.maps.LatLng(latitude, longitude);

            var marker = new google.maps.Marker({
                position: latLong
            });

            marker.setMap(map);
            map.setZoom(15);
            map.setCenter(marker.getPosition());
        }

        function getPlaces(latitude, longitude) {
            var latLong = new google.maps.LatLng(latitude, longitude);

            var mapOptions = {

                center: new google.maps.LatLng(latitude, longitude),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP

            };

            Map = new google.maps.Map(document.getElementById("places"), mapOptions);

            Infowindow = new google.maps.InfoWindow();

            var service = new google.maps.places.PlacesService(Map);
            service.nearbySearch({

                location: latLong,
                radius: 500,
                type: ['store']
            }, foundStoresCallback);

        }

        function foundStoresCallback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {

                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                }
            }
        }

        function createMarker(place) {
            var placeLoc = place.geometry.location;

            var marker = new google.maps.Marker({
                map: Map,
                position: place.geometry.location
            });

            google.maps.event.addListener(marker, 'click', function () {

                Infowindow.setContent(place.name);
                Infowindow.open(Map, this);

            });
        }

        function onWeatherError(error) {
            console.log('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
        }
    },

};

app.initialize();
