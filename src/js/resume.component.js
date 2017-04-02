'use strict';

module.exports = {
    templateUrl: '../template/resume.template.html',
    controller: ['entrepriseService', resumeComponent]
};

function resumeComponent(entrepriseService) {
    var self = this;
    entrepriseService.getEntreprises().then(function (response) {
        self.basics = response.basics;
        self.profiles = response.profiles;
    });
}