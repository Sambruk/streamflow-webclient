/*
 *
 * Copyright
 * 2009-2015 Jayway Products AB
 * 2016-2018 Föreningen Sambruk
 *
 * Licensed under AGPL, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.gnu.org/licenses/agpl.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

angular.module('sf').directive('login', function ($rootScope, buildMode, $location, $timeout, $http, $window, tokenService, httpService) {
    return {
        restrict: 'E',
        templateUrl: 'components/login/login.html',
        scope: {},
        link: function (scope) {
            scope.errorMessage = '';
            scope.username = '';
            scope.password = '';
            scope.hasToken = tokenService.hasToken();
            scope.hasLoggedOut = $rootScope.hasLoggedOut;

            function getLogoutUrl(isIE) {
                var url;
                var credentials = isIE ? '' : 'username:password@';
                if (buildMode === 'dev') {
                    url = 'https://' + credentials + 'test-sf.jayway.com/streamflow/';
                } else {
                    url = $location.$$protocol + '://' + credentials + $location.$$host + ':' + $location.$$port + '/streamflow';
                }
                return url;
            }

            function getLoggedInStatus() {
                return $http.get(httpService.apiUrl).then(
                    function () {
                        return true;
                    }, function () {
                        return false;

                    });
            }

            /**
             * detect IE
             * returns version of IE or false, if browser is not Internet Explorer
             */
            function detectIE() {
                var ua = window.navigator.userAgent;

                // Test values; Uncomment to check result …

                // IE 10
                // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

                // IE 11
                // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

                // Edge 12 (Spartan)
                // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

                // Edge 13
                // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

                var msie = ua.indexOf('MSIE ');
                if (msie > 0) {
                    // IE 10 or older => return version number
                    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
                }

                var trident = ua.indexOf('Trident/');
                if (trident > 0) {
                    // IE 11 => return version number
                    var rv = ua.indexOf('rv:');
                    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
                }

                var edge = ua.indexOf('Edge/');
                if (edge > 0) {
                    // Edge (IE 12+) => return version number
                    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
                }

                // other browser
                return false;
            }

            function logOut() {
                var logoutUrl = getLogoutUrl(detectIE());

                var basicAuthBase64 = btoa('username:password');
                $http.defaults.headers.common.Authorization = 'Basic ' + basicAuthBase64;

                $http({
                        method: 'GET',
                        url: logoutUrl,
                        headers: {'Authorization': 'Basic ' + basicAuthBase64},
                        cache: 'false'
                    },
                    $location.path('#')
                ).then(function (response) {
                    console.log('Logout response', response);
                    tokenService.clear();
                    tokenService.isDefaultToken = true;
                }, function () {
                    scope.errorMessage = 'Användarnamn / lösenord ej giltigt!';
                });
            }

            getLoggedInStatus()
                .then(function (status) {
                    $rootScope.isLoggedIn = status;
                });

            $rootScope.$on('IdleTimeout', function () {
                logOut();
            });

            $rootScope.$on('logout', function (event, logout) {
                if (logout) {
                    logOut();
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
