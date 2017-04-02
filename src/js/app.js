'use strict';

var angular = require('angular');
require('angular-route');

angular
    .module('app', ['ngRoute'])
    .config(require('./app.config'))
    .service('entrepriseService', require('./entreprise.service'))
    .component('resumeComponent', require('./resume.component'))
    .component('profileComponent', require('./profile.component'))
    .component('entrepriseComponent', require('./entreprise.component'))
    .component('experienceComponent', require('./experience.component'));