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
  $scope.scroll = 0;

  var query = $routeParams.query;
  var originalCases = [];
  var pageSize = paginationService.pageSize;

  $scope.showSpinner = {
    currentCases: false,
    infiniteScroll: false
  };

  $scope.getHeader = function () {
    return 'Sökresultat';
  };

  $scope.groupingOptions = groupByService.getGroupingOptions();

  $scope.groupBy = function(selectedGroupItem) {
    $scope.currentCases = groupByService.groupBy($scope.currentCases, originalCases, selectedGroupItem);
    $scope.specificGroupByDefaultSortExpression = groupByService.getSpecificGroupByDefault(selectedGroupItem);
  };

  $scope.showMoreItems = function() {
    try {
      /*
      if ($scope.currentCases.length >= $scope.totalCases) {
        return;
      }
      */
      console.log('SHOW MORE ITEMS' + $scope.currentCases.length);
      $scope.showSpinner.infiniteScroll = true;

      searchService.getCases(query + '+offset+' + $scope.currentCases.length + '+limit+' + pageSize).promise.then(function (result2) {
        _.each(result2, function (item) {
          $scope.currentCases.push(item);
        });
      });
/*
      if ($scope.currentCases.length + pageSize >= $scope.totalCases) {
        pageSize = $scope.totalCases % pageSize > 0 ? $scope.totalCases % pageSize : pageSize;
      }

      var last = $scope.currentCases.length - 1;
      for(var i = 1; i <= pageSize; i++) {
        $scope.currentCases.push(originalCases[last + i]);
      }
*/
    } finally {
      $scope.showSpinner.infiniteScroll = false;
    }
  };
  //$scope.showMoreItems();
/*
  searchService.getCases(query).promise.then(function (result) {
    originalCases = result;
    $scope.showSpinner.currentCases = false;

    originalCases.promise.then(function() {
      $rootScope.$broadcast('breadcrumb-updated',[]);

      // 'Pagination'
      $scope.totalCases = originalCases.length;
      $scope.currentCases = originalCases.slice(0, 10);
      //$scope.showMoreItems();
    });
  });
*/
});
