'use strict';

angular.module('sf').factory('authInterceptor', function (tokenService) {
    return {
        request: function (config) {
            //Check for the host
            if (tokenService.isDefaultToken) {
                //Detach the header
                delete config.headers.Authorization;
            } else {
                config.headers.Authorization = 'Basic ' + tokenService.getToken();
            }
            return config;
        }
    };
}).config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});
