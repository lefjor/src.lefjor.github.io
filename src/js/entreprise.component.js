'use strict';

angular.
    module('app').
    component('entrepriseComponent', {
        templateUrl: '../template/entreprise.template.html',
        controller: ['$routeParams', 'entrepriseService',
            function PhoneDetailController($routeParams, entrepriseService) {
                console.log("entrepriseComponent");
                var self = this;
                entrepriseService.getEntreprises().then(function (response) {
                    self.entreprises = response.data.entreprises;
                    console.log(self.entreprises);
                });
            }
        ]
    });