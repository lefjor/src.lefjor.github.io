'use strict';

var _= require("underscore");

module.exports = {
    templateUrl: '../template/entreprise.template.html',
    controller: entrepriseComponent
};


function entrepriseComponent(entrepriseService) {
    var self = this;
    self._=_;
    entrepriseService.getEntreprises().then(function (response) {
        self.entreprises = response.data.entreprises;
        self.label = response.data.label;
    });
}