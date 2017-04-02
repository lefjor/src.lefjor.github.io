'use strict';

module.exports = {
    bindings: {
        experience: '<'
    },
    templateUrl: '../template/experience.template.html',
    controller: ['entrepriseService', experienceComponent]
};

function experienceComponent(entrepriseService) {
    var self = this;
    entrepriseService.getEntreprises().then(function (response) {
        self.label = response.label;
    });
}