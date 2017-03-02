import angular from 'angular';

import map from './derectives/map_derective.js';
import mapCtrl from './controllers/map-controller.js';

import map_data from './derectives/map_data_derective.js';
import datamapCtrl from './controllers/data-map-controller.js';

import '../style/app.css';

const MODULE_NAME = 'app';

var map_app = angular.module(MODULE_NAME, []);
map_app.directive('map', map)
    .controller('mapCtrl', mapCtrl);

map_app.directive('mapa', map_data )
    .controller('datamapCtrl', datamapCtrl);

