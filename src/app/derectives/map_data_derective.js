let map_data = () => {
    return {
        template: require('./../map_data.html'),
        controller: function ($scope) {
            $scope.scores = '';
            var database = firebase.database();
            var ref = database.ref('scores');
            ref.on('value', gotData);
            var load_data = false;
            $scope.type = 1;
            $scope.$watch('type', function (type) {
                $scope.$broadcast('type', type);
            });

            ref.update({
                "-KeAnp0vX56V6J7Y7Hrb": {
                    "city": "Волгоград",
                    "img": "http://www.volsu.ru/upload/medialibrary/5f8/z_fb5ee9ef.jpg",
                    "lat": "-34.45221847282653",
                    "lng": "-65.91796875",
                    "icon": 'parking_lot_maps.png',
                    "type": 'parking'
                },
                "-KeAnpBCV4sTY1yGyUh-": {
                    "city": "Волгоград",
                    "img": "http://www.volsu.ru/upload/medialibrary/5f8/z_fb5ee9ef.jpg",
                    "lat": "15.623036831528264",
                    "lng": "15.99609375",
                    "icon": 'library_maps.png',
                    "type": 'library'
                }
            });

            function gotData (data) {
                var map_data =  data.val();
                $scope.scores = map_data;
                if(load_data==false){
                    $scope.$broadcast('map_data', map_data);
                }
                load_data = true;
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
            }

            $scope.update_map_data = function(data){
                var name = angular.element(document.querySelector('#name_'+data));
                var lng = angular.element(document.querySelector('#lng_'+data));
                var lat = angular.element(document.querySelector('#lat_'+data));
                var img = angular.element(document.querySelector('#img_'+data));
                var type = angular.element(document.querySelector('#type_'+data));
                var icon = angular.element(document.querySelector('#icon_'+data));
                ref.update({[data]: {
                        "city": name.val(),
                        "lng": lng.val(),
                        "lat": lat.val(),
                        "img": img.val(),
                        "type": type.val(),
                        "icon": icon.val()
                    }
                })
            };

            $scope.$on('shift', function (e, shift) {
                ref.update({[shift.id]: {
                    "lng": shift.lng,
                    "lat": shift.lat,
                    "city": 'Волгоград',
                    }
                })
            });

            $scope.$on('markers', function (e, markers) {
                $scope.marker = markers;
            });

            $scope.delete_map_data = function(data){
                ref.child(data).remove().then(function() {
                    angular.element(document.querySelector('#lat_'+data)).parent().remove();
                    for (var i = 0; i < $scope.marker.length; i++) {
                        if ($scope.marker[i].id == data) {
                            $scope.marker[i].setMap(null);
                            return;
                        }
                    }
                });
            }

        }
    }
}

export default map_data;
