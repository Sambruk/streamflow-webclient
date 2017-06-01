/*
 *
 * Copyright 2009-2014 Jayway Products AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

angular.module('sf').directive('login', function ($rootScope, buildMode, $location, $timeout, $http, $window, $route, tokenService, httpService) {
  return {
    restrict: 'E',
    templateUrl: 'components/login/login.html',
    scope: {

    },
    link: function(scope){
      scope.errorMessage = '';
      scope.username = '';
      scope.password = '';
      scope.hasToken = tokenService.hasToken();
      scope.hasLoggedOut = $rootScope.hasLoggedOut;

      function getLogoutUrl() {
        var url;
        if (buildMode === 'dev') {
          url= 'https://username:password@test-sf.jayway.com/streamflow/';
        } else {
            // var userCredentials = getInternetExplorerVersion()>0?'':'username:password@';
            var userCredentials = '';
            url = $location.$$protocol + '://' + userCredentials + $location.$$host + ':' + $location.$$port + '/streamflow/webclient/api';
        }
        return url;
      }

      function getLoggedInStatus(){
        return $http.get(httpService.apiUrl)
          .success(function () {
            return true;
          })
          .error(function () {
            return false;
          });
      }

      getLoggedInStatus()
        .then(function (status) {
          $rootScope.isLoggedIn = status;
        });

      $rootScope.$on('logout', function (event, logout) {
        if (logout) {
            var basicAuthBase64 = btoa('username:password');
            $http.defaults.headers.common.Authorization = 'Basic ' + basicAuthBase64;
            $http({
                method: 'GET',
                headers: {'Content-Type': 'text/html; charset=UTF-8'},
                url: httpService.absApiUrl(''),
                cache: 'false'
            }).then(function () {
            }, function () {
                scope.errorMessage = 'Användarnamn / lösenord ej giltigt!';
            });

            $timeout(function () {
                tokenService.clear();
                $location.path('/');
                $http.defaults.headers.common.Authorization = '';
                $window.location.reload();
            }, 2000);
        }
      });

      scope.validate = function () {
        var basicAuthBase64 = btoa(scope.username + ':' + scope.password);
        $http.defaults.headers.common.Authorization = 'Basic ' + basicAuthBase64;

        $http({
          method: 'GET',
          url: httpService.absApiUrl('account/profile'),
          cache: 'false'
        }).then(function () {
          tokenService.storeToken(basicAuthBase64);
          window.location.reload();
        }, function () {
          scope.errorMessage = 'Användarnamn / lösenord ej giltigt!';
        });
      };
    }
  };
});
