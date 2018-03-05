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

angular.module('sf', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'angular-growl',
    'ui.select',
    'ngSanitize',
    'ngFileUpload',
    'sf.config',
    'angular.filter',
    'infinite-scroll',
    'angularjs-autogrow',
    'ngIdle',
    'ngMap',
    '720kb.tooltips'
])
    .config(function (IdleProvider) {
        IdleProvider.idle(2 * 60 * 60);
    })
    .config(['$locationProvider', function($locationProvider) {
        $locationProvider.hashPrefix('');
    }])
    .config(['growlProvider', function (growlProvider) {
        growlProvider.globalTimeToLive({success: 3000, error: 3000, warning: 3000, info: 3000});
    }])
    .config(['tooltipsConfProvider', function configConf(tooltipsConfProvider) {
        tooltipsConfProvider.configure({
            'smart': true
        });
    }])
    .run(function ($rootScope, $http, httpService, $location, $routeParams, tokenService, Idle) {

        Idle.watch();
        $rootScope.hasToken = tokenService.hasToken;
        $rootScope.isLoggedIn = $rootScope.hasToken();
        $rootScope.logout = tokenService.clear;

        $rootScope.isFormWindow = $location.$$search.isFormWindow;

        //Add current project type to rootScope to let toolbar update accordingly in index.html
        $rootScope.$on('$routeChangeSuccess', function () {
            // Get all URL parameter
            $rootScope.contextmenuParams = {};
            if ($routeParams.projectType) {
                $rootScope.contextmenuParams.projectType = $routeParams.projectType;
            }
            if ($routeParams.projectId) {
                $rootScope.contextmenuParams.projectId = $routeParams.projectId;
            }
        });
    });
