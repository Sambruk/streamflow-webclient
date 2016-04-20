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

angular.module('sf').directive('contextmenu', function (projectService, navigationService, $rootScope) {
  return {
    restrict: 'E',
    templateUrl: 'components/contextmenu/contextmenu.html',
    scope: {
      params: '=?'
    },
    link: function (scope) {
      scope.showSidebar = false;

      scope.projects = projectService.getAll();

      scope.navigateTo = function (href, projectName, caseCount, $event){
        $event.preventDefault();
        scope.toggleSidebar($event);
        navigationService.linkTo(href);
        $rootScope.projectName = projectName;
        $rootScope.caseCount = caseCount;
      };

      scope.toggleSidebar = function ($event) {
        $event.preventDefault();
        scope.showSidebar = !scope.showSidebar;
      };

      scope.canCreateCase = function() {
        if(!scope.params){
          return false;
        }
        if (!scope.params.projectType && $rootScope.location.$$path.indexOf('cases') < 0) {
          return false;
        }
        return true;
      };

      scope.createCase = function(){
        if(!scope.canCreateCase()){
          return;
        }
        var projectId = navigationService.projectId();

        //TODO Find out better way of getting projectId
        if(!projectId){
          projectId = 'f32e177c-86e8-4c7b-9abf-9f7267eb7769-76';
        }
        //Add cases possible only with that type
        var projectType = 'assignments';

        projectService.createCase(projectId, projectType).then(function(response){
          var caseId = response.data.events[1].entity;
          var href = navigationService.caseHrefSimple(caseId);
          $rootScope.$broadcast('case-created');
          window.open(href);
        });
      };

      var updateObject = function(itemToUpdate){
        itemToUpdate.invalidate();
        itemToUpdate.resolve();
      };

      // Event listeners
      $rootScope.$on('case-created', function(){
        updateObject(scope.projects);
      });
      $rootScope.$on('case-closed', function(){
        updateObject(scope.projects);
      });
      $rootScope.$on('case-assigned', function(){
        updateObject(scope.projects);
      });
      $rootScope.$on('case-unassigned', function(){
        updateObject(scope.projects);
      });
      $rootScope.$on('case-resolved', function(){
        updateObject(scope.projects);
      });
      $rootScope.$on('case-deleted', function(){
        updateObject(scope.projects);
      });
      $rootScope.$on('case-owner-changed', function(){
        updateObject(scope.projects);
      });
      // End Event listeners
    }
  };
});
