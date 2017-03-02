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
        this.initMap();
        this.$scope.edit_marker_name = this.edit_marker_name();
    }

    initMap() {
        this.$scope.$on('map_data', function (e, data) {
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
        var infoBoxDiv = document.createElement('div');
        this.makeInfoBox(infoBoxDiv, map);
        this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(infoBoxDiv);
        this.map.addListener('click', function (e) {
            this.data.lat = e.latLng.lat();
            this.data.lng = e.latLng.lng();
            this.data.city = 'москва';
            this.marker_name = 'set';
            if( this.marker_name == 'null') {
                this.marker_name = 'a';
            } else {
                this.marker_name = String.fromCharCode( this.marker_name.charCodeAt(0) + 1); // a,b,c,d

            }
            this.initFirebase(this.data);
        }.bind(this));
    }

    makeInfoBox(controlDiv, map) {
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
    edit_marker_name(a, thiis){
        //dialogbox
        var edit_marker_name = prompt("Edit marker name : " + $(thiis).html());

        // id marker
        var marker = window['marker_' + a];

        // update
        if( edit_marker_name ){
            $(thiis).html(edit_marker_name);

            // update marker title
            marker.setTitle(edit_marker_name);

            // remove listner
            google.maps.event.clearListner(marker, 'click');

            // content
            var content = "<span class='destination_name' ng-click='edit_marker_name(\"" + a + "\", this)'>" + edit_marker_name + "</span>";
            var infowindow = new google.maps.InfoWindow();
            google.maps.event.addListner(marker, 'click', (function(marker, content, infowndow){
                return function(){
                    infowindow.setContent(content);
                    infowindow.open(this.map, marker);
                };
            })(marker, content, infowindow))
        }

    }
    initMapMake(data, map) {
        //var image = 'http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-check-icon.png';
        if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                    this.$scope.$apply();
                }
        for (var key in data) {
            var marker = new google.maps.Marker({
                draggable:true,
                //icon:image,
                map: this.map,
                animation: google.maps.Animation.DROP,
                title: 'Hello World!'
            });
            google.maps.event.addListener(marker,"dragend", function(event) {
                var position_x = marker.getPosition().lat();
                var position_y = marker.getPosition().lng();
                console.log(position_x);
                marker.setMap(null);
            });

            var point = new google.maps.LatLng(data[key].lat, data[key].lng);
            console.log(point);
            marker.setPosition(point);
        }
    }

    initFirebase(data) {
        if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                    this.$scope.$apply();
        }
        this.ref.push(data);
        console.log(data.lat, data.lng);
        var point = new google.maps.LatLng(data.lat, data.lng);
        window['marker_' + this.marker_name] = new google.maps.Marker({
            position:point,
            map:this.map,
            draggable:true,
            title: '' + this.marker_name
        });

        // in marker
        var marker = window['marker_' + this.marker_name];

        // event to show marker title
        var content = "<span class='destination_name' ng-click='edit_marker_name(\"" + this.marker_name + "\", this)'>" + this.marker_name + "</span>";
        var infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, 'click', (function(marker){

            return function(){
                infowindow.setContent(content);
                infowindow.open(this.map, marker);
            };
        }.bind(this))(marker, content, infowindow));
        console.log(point);
    }
}
mapCtrl.$inject = ['$scope', '$rootScope'];