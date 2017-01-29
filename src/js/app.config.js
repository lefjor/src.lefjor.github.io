'use strict';

module.exports = ['$routeProvider', function ($routeProvider) {

    $routeProvider.
        when('/', {
            template: '<entreprise-component></entreprise-component>'
        });
}];
