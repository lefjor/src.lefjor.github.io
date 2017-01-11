'use strict';

angular.module('app').factory('entrepriseService', function ($http) {
    return {
        getEntreprises: function () {
            console.log("entrepriseService");
            return $http.get('../i18n/data.fr.json');
        }
    };
});