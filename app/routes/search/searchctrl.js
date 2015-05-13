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

angular.module('sf').controller('SearchCtrl', function ($scope, $routeParams, $rootScope, searchService, groupByService, paginationService, caseService) {
  $scope.currentCases = [];

  var query = $routeParams.query;
  var originalCases = [];

  $scope.showSpinner = {
    currentCases: true,
    infiniteScroll: true
  };

  $scope.getHeader = function () {
    return 'Sökresultat';
  };

  $scope.groupingOptions = groupByService.getGroupingOptions();

  $scope.groupBy = function(selectedGroupItem) {
    $scope.currentCases = groupByService.groupBy($scope.currentCases, originalCases, selectedGroupItem);
    $scope.specificGroupByDefaultSortExpression = groupByService.getSpecificGroupByDefault(selectedGroupItem);
  };

  searchService.getCases(query).promise.then(function (result) {
    originalCases = result;
    $scope.showSpinner.currentCases = false;

    originalCases.promise.then(function() {
      $rootScope.$broadcast('breadcrumb-updated',[]);

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
    });

  });

});
