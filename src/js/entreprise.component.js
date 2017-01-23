'use strict';

module.exports = {
    templateUrl: '../template/entreprise.template.html',
    controller: entrepriseComponent
};


function entrepriseComponent(entrepriseService) {
    var self = this;
    entrepriseService.getEntreprises().then(function (response) {
        self.entreprises = response.data.entreprises;
    });
}