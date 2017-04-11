'use strict';

module.exports = ['$routeProvider', function ($routeProvider/*, $locationProvider*/) {
    //$locationProvider.html5Mode(true);
    
    $routeProvider.
        when('/', {
            template: '<resume-component></resume-component>'
        });
}];
