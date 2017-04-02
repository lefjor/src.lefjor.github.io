'use strict';

var _= require("underscore");

module.exports = {
    templateUrl: '../template/entreprise.template.html',
    controller: ['entrepriseService', entrepriseComponent]
};

function entrepriseComponent(entrepriseService) {
    var self = this;
    self._=_;
    entrepriseService.getEntreprises().then(function (response) {
        self.entreprises = response.entreprises;
        self.label = response.label;
    });
}