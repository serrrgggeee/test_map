export default
class mapCtrl {
    constructor($scope, $rootScope) {
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.config = {
            apiKey: "AIzaSyCiulPKuyY_A5v97eQShaRz2LoPtziYaco",
            authDomain: "maps-ccc22.firebaseapp.com",
            databaseURL: "https://maps-ccc22.firebaseio.com",
            storageBucket: "maps-ccc22.appspot.com",
            messagingSenderId: "209318860515"
        };
        this.defaultApp = firebase.initializeApp(this.config);
        this.database = firebase.database();
        this.ref = this.database.ref('scores');
        this.data = {
            sender: null,
            timestamp: null,
            lat: null,
            lng: null

        };
        this.markers = [];
        this.initMap();
        this.$scope.type = '';
        this.$scope.$on('type', function (e, type) {
            this.$scope.type = type;
             while(this.markers.length){
                this.markers.pop().setMap(null);
            }
            this.initMapMake(this.$scope.map_data);
        }.bind(this));

    }

    initMap() {
        this.$scope.$on('map_data', function (e, data) {
            this.$scope.map_data = data;
            this.initMapMake(data);
        }.bind(this));
        this.map = new google.maps.Map(document.getElementById('map'), {
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
            streetViewControl: false
        });

        this.map.addListener('click', function (e) {
            this.data.lat = e.latLng.lat();
            this.data.lng = e.latLng.lng();
            this.data.city = 'москва';
            this.initFirebase(this.data);
        }.bind(this));
    }

    initMapMake(data) {
        if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                    this.$scope.$apply();
        }

        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        for (var key in data) {
                if (data[key].type  && data[key].type == this.$scope.type) {

                var marker = new google.maps.Marker({
                    draggable:true,
                    map: this.map,
                    icon: data[key].icon ? iconBase + data[key].icon :'',
                    id:key,
                    animation: google.maps.Animation.DROP,
                    title: 'Hello World!'
                });

                this.markers.push(marker);
                this.$scope.$broadcast('markers', this.markers);
                this.dragendMake(marker);
                this.infodMake(marker, data[key]);
                var point = new google.maps.LatLng(data[key].lat, data[key].lng);
                marker.setPosition(point);
            }
        }
    }

    infodMake(marker, data) {
        var contentString = '<div id="content">'+data.city+'<img src="'+data.img+'" width="552" height="414"></div>';
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
          marker.addListener('click', function() {
            infowindow.open(map, marker);
        }.bind(this));
    }

    dragendMake(marker) {
        google.maps.event.addListener(marker, "dragstart", function (event) {
            var lat = marker.getPosition().lat();
            var lng = marker.getPosition().lng();
            var shift = {id: id, lat: lat, lng: lng};
            this.$scope.$broadcast('shift', shift);
        }.bind(this));
    }

    initFirebase(data) {
        if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                    this.$scope.$apply();
        }
        var resent = this.ref.push(data);
        var point = new google.maps.LatLng(data.lat, data.lng);
        var marker = new google.maps.Marker({
            position:point,
            map:this.map,
            id:resent.key,
            draggable:true,
            title: '' + this.marker_name
        });
        this.dragendMake(marker);
        this.infodMake(marker);
        this.markers.push(marker);
        this.$scope.$broadcast('markers', this.markers);
    }
}

mapCtrl.$inject = ['$scope', '$rootScope'];