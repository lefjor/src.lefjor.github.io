'use strict';

module.exports = ['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.
        when('/', {
            template: '<resume-component></resume-component>'
        });
}];
