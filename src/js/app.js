'use strict';

var angular = require('angular');
require('angular-route');

angular
    .module('app', ['ngRoute'])
    .config(require('./app.config'))
    .service('entrepriseService', require('./entreprise.service'))
    .component('entrepriseComponent', require('./entreprise.component'));