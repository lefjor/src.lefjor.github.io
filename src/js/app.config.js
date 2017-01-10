'use strict';

angular.
    module('app').
    config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider.
                when('/', {
                    template: '<entreprise-module></entreprise-module>'
                });
        }
    ]);