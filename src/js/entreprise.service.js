'use strict';

module.exports = ['$http', function ($http) {
    return {
        getEntreprises: function () {
            return $http.get('../i18n/data.fr.json');
        }
    };
}];
