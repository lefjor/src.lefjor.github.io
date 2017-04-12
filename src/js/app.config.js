'use strict';

module.exports = ['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/', {
            template: '<resume-component></resume-component>'
        });
}];
