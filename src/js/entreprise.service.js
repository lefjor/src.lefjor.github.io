'use strict';

module.exports = ['$http', '$q', function ($http, $q) {
    var self = this;

    this.i18n = undefined;

    return {
        getEntreprises: function () {
            if (!self.i18n) {
                var deferred = $q.defer();
                $http.get('../i18n/data.fr.json', {cache: true}).then(function (result) {
                    self.i18n = deferred.resolve(result.data);
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }
            return $q.when(self.i18n);
        }
    };
}];
