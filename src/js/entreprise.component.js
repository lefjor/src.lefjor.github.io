'use strict';

angular.
    module('entrepriseModule').
    component('entrepriseComponent', {
        templateUrl: 'entreprise.template.html',
        controller: ['$routeParams', 'entrepriseService',
            function PhoneDetailController($routeParams, entrepriseService) {
                console.log("entrepriseComponent");
                var self = this;
                self.entreprises = entrepriseService.getEntreprises();
            }
        ]
    });