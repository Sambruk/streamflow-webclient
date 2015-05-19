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
  $scope.busyLoadingData = false;

  var query = $routeParams.query;
  var originalCases = [];
  var pageSize = paginationService.pageSize;

  $scope.showSpinner = {
    currentCases: false,
    infiniteScroll: true
  };

  $scope.getHeader = function () {
    return 'Sökresultat';
  };

  $scope.groupingOptions = groupByService.getGroupingOptions();

  // TODO
  $scope.groupBy = function(selectedGroupItem) {
    $scope.currentCases = groupByService.groupBy($scope.currentCases, originalCases, selectedGroupItem);
    $scope.specificGroupByDefaultSortExpression = groupByService.getSpecificGroupByDefault(selectedGroupItem);
  };

  $scope.showMoreItems = function() {
    if ($scope.busyLoadingData) {
      return;
    }
    $scope.busyLoadingData = true;
    $scope.showSpinner.infiniteScroll = true;

    searchService.getCases(query + '+offset+' + $scope.currentCases.length + '+limit+' + pageSize).promise.then(function (result) {
      $scope.currentCases = $scope.currentCases.concat(result);
      $scope.busyLoadingData = false;
      $scope.showSpinner.infiniteScroll = false;
    });
  };
});
