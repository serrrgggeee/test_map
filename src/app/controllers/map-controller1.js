export default class mapCtrl {
    constructor($scope) {
        this.$scope = $scope;
        var loc = this;
        this.t = 'https://github.com/preboot/angular-webpack';
        var config = {
            apiKey: "AIzaSyCiulPKuyY_A5v97eQShaRz2LoPtziYaco",
            authDomain: "maps-ccc22.firebaseapp.com",
            databaseURL: "https://maps-ccc22.firebaseio.com",
            storageBucket: "maps-ccc22.appspot.com",
            messagingSenderId: "209318860515"
        };
        var defaultApp = firebase.initializeApp(config);
        var database = firebase.database();
        var ref = database.ref('scores');
        var data = {
            sender: null,
            timestamp: null,
            lat: null,
            lng: null
        };

        function makeInfoBox(controlDiv, map) {
            // Set CSS for the control border.
            var controlUI = document.createElement('div');
            controlUI.style.boxShadow = 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px';
            controlUI.style.backgroundColor = '#fff';
            controlUI.style.border = '2px solid #fff';
            controlUI.style.borderRadius = '2px';
            controlUI.style.marginBottom = '22px';
            controlUI.style.marginTop = '10px';
            controlUI.style.textAlign = 'center';
            controlDiv.appendChild(controlUI);

            // Set CSS for the control interior.
            var controlText = document.createElement('div');
            controlText.style.color = 'rgb(25,25,25)';
            controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
            controlText.style.fontSize = '100%';
            controlText.style.padding = '6px';
            controlText.textContent = 'The map shows all clicks made in the last 10 minutes.';
            controlUI.appendChild(controlText);
        }

        initMap() {
            var map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 0, lng: 0},
                zoom: 3,
                styles: [{
                    featureType: 'poi',
                    stylers: [{visibility: 'off'}]  // Turn off POI.
                },
                    {
                        featureType: 'transit.station',
                        stylers: [{visibility: 'off'}]  // Turn off bus, train stations etc.
                    }],
                disableDoubleClickZoom: true,
                streetViewControl: false,
            });
            var infoBoxDiv = document.createElement('div');
            makeInfoBox(infoBoxDiv, map);
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(infoBoxDiv);
            // Listen for clicks and add the location of the click to firebase.
            map.addListener('click', function (e) {
                data.lat = e.latLng.lat();
                data.lng = e.latLng.lng();
                data.city = 'москва';
                initFirebase(data);
            });

            var heatmap = new google.maps.visualization.HeatmapLayer({
                data: [],
                map: map,
                radius: 16
            });
        }

        function initFirebase(data) {
            console.log(data);
            ref.push(data);
            ged_map_data();
        }

        function ged_map_data() {
            ref.on('value', gotData.bind(), errData);
        }

        function gotData(data) {
            //console.log(data.val());
            var scores = data.val();
            var keys = Object.keys(scores);
            console.log($scope);
            $scope.keys = keys;
            $scope.d = 'ff';
            this.t = 'tt';
            //this.$scope.tf = 'tf';
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                var city = scores[k].city;
                var lat = scores[k].lat;
                var lng = scores[k].lng;
                //console.log(city, lat, lng);
                //var li = createElement('li', city + ': ' + lat + ': ' + lng);
                //li.parent('scorelist');
            }
            return this.keys = keys;
        }
        function errData(err) {
            console.log(err);
        }
        loc.initMap();
    }
}
mapCtrl.$inject = ['$scope'];