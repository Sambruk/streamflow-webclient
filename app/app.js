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

angular.module('sf', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'angular-growl',
    'ui.select',
    'ngSanitize',
    'angularFileUpload',
    'sf.config',
    'angular.filter',
    'localytics.directives',
    'uiGmapgoogle-maps',
    'infinite-scroll',
    'angular-autogrow',
    'ngIdle'
  ])
  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyCqH4sFJMZXvVTaBm4JYk2v089WlarlBtw',
      v: '3.17',
      libraries: 'places,drawing',
      language: 'sv'
    });
  })
  .config( function(IdleProvider) {
    IdleProvider.idle(2*60*60);
  })
  .config(['growlProvider', function (growlProvider) {
      growlProvider.globalTimeToLive({success: 3000, error: 3000, warning: 3000, info: 3000});
  }])
  .run(function ($rootScope, $http, httpService, $location, $routeParams, tokenService, Idle) {

    Idle.watch();
    $rootScope.hasToken = tokenService.hasToken;
    $rootScope.isLoggedIn = $rootScope.hasToken();
    $rootScope.logout = tokenService.clear;

    $rootScope.isFormWindow = $location.$$search.isFormWindow;

    //Add current project type to rootScope to let toolbar update accordingly in index.html
    $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
      // Get all URL parameter
      $rootScope.contextmenuParams = {};
      if($routeParams.projectType){
        $rootScope.contextmenuParams.projectType = $routeParams.projectType;
      }
      if($routeParams.projectId){
        $rootScope.contextmenuParams.projectId = $routeParams.projectId;
      }
    });
  });
