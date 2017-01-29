'use strict';

module.exports = function ($http) {
    return {
        getEntreprises: function () {
            return $http.get('../i18n/data.fr.json');
        }
    };
};
