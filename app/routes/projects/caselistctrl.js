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

angular.module('sf')
  .controller('CaseListCtrl', function($scope, $location, $routeParams, $window, projectService, $rootScope, caseService, groupByService, paginationService) {
    var originalCases = projectService.getSelected($routeParams.projectId, $routeParams.projectType);
    $scope.currentCases = [];
    $scope.projectType = $routeParams.projectType;
    $scope.projects = projectService.getAll();

    originalCases.promise.then(function() {

      // 'Pagination'
      $scope.totalCases = originalCases.length;
      $scope.currentCases = originalCases.slice(0, 10);

      $scope.showMoreItems = function() {
        try {
          if ($scope.currentCases.length >= originalCases.length) {
            return;
          }
          $scope.showSpinner.infiniteScroll = true;
          var pageSize = paginationService.pageSize;
          if ($scope.currentCases.length + pageSize >= originalCases.length) {
            pageSize = originalCases.length % pageSize > 0 ? originalCases.length % pageSize : pageSize;
          }

          var last = $scope.currentCases.length - 1;
          for(var i = 1; i <= pageSize; i++) {
            $scope.currentCases.push(originalCases[last + i]);
          }
        } finally {
          $scope.showSpinner.infiniteScroll = false;
        }
      };
      $scope.showMoreItems();
    });

    $scope.showSpinner = {
      currentCases: true,
      infiniteScroll: false
    };

    $scope.getHeader = function () {
      return {
        assignments: 'Alla mina ärenden',
        inbox: 'Alla ärenden i inkorgen'
      }[$scope.projectType];
    };

    $scope.scroll = 0;
    $scope.groupingOptions = groupByService.getGroupingOptions();

    $scope.groupBy = function(selectedGroupItem) {
      $scope.currentCases = groupByService.groupBy($scope.currentCases, originalCases, selectedGroupItem);
      $scope.specificGroupByDefaultSortExpression = groupByService.getSpecificGroupByDefault(selectedGroupItem);
    };

    $scope.projects.promise.then(function(response){
      var projectName = _.filter(response, function(projects){
        _.each(projects, function(project){
          _.each(project, function(types){
            var url = types.href;
            if(url !== undefined){
              var id = $routeParams.projectId;
              if(url.contains(id)){
                $rootScope.projectName = projects.text;
              }
            }
          });
        }); 
      });
    });

    //Set breadcrumbs to case-owner if possible else to project id
    originalCases.promise.then(function(response){
      var owner = _.filter(response, function(sfCase){
        if(sfCase.owner.length > 0){
          return sfCase.owner;
        }
      });

      if(owner.length > 0){
        $rootScope.$broadcast('breadcrumb-updated', [
          {
            title: response[0].owner
          },
          {
            title: $routeParams.projectType,
            url: '#/projects/' + $routeParams.projectId + '/' + $routeParams.projectType
          }
        ]);
      } else {
        $rootScope.$broadcast('breadcrumb-updated', [
          {
            title: $rootScope.projectName
          },
          {
            title: $routeParams.projectType,
            url: '#/projects/' + $routeParams.projectId + '/' + $routeParams.projectType
          }
        ]);
      }

      $scope.showSpinner.currentCases = false;
    });

    var updateObject = function(itemToUpdate){
      itemToUpdate.invalidate();
      itemToUpdate.resolve();
    };

    // Event listeners
    $rootScope.$on('case-created', function(){
      updateObject($scope.currentCases);
    });
    $rootScope.$on('case-closed', function(){
      updateObject($scope.currentCases);
    });
    $rootScope.$on('case-assigned', function(){
      updateObject($scope.currentCases);
    });
    $rootScope.$on('case-unassigned', function(){
      updateObject($scope.currentCases);
    });
    $rootScope.$on('case-resolved', function(){
      updateObject($scope.currentCases);
    });
    $rootScope.$on('case-deleted', function(){
      updateObject($scope.currentCases);
    });
    $rootScope.$on('case-owner-changed', function(){
      updateObject($scope.currentCases);
    });
    $rootScope.$on('casedescription-changed', function(){
      updateObject($scope.currentCases);
    });
    // End Event listeners
  });
