'use strict';

angular.module('entrepriseModule').factory('entrepriseService', function ($http) {
    return {
        getEntreprises: function () {
            console.log("entrepriseService");
            return $http.get('../data.fr.json');
        }
    };
});