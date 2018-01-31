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

angular.module('sf').controller('SearchCtrl', function ($scope, $routeParams, $rootScope, searchService, groupByService, paginationService) {
    $rootScope.$broadcast('case-list-load');

    $scope.currentCases = [];
    $scope.scroll = 0;
    $scope.busyLoadingData = false;

    var query = $routeParams.query;
    var originalCases = [];
    var pageSize = paginationService.pageSize;

    var stopLoad = false;

    $scope.showSpinner = {
        currentCases: true,
        infiniteScroll: false
    };

    $scope.getHeader = function () {
        return 'Sökresultat';
    };

    $scope.groupingOptions = groupByService.getGroupingOptions();

    // TODO
    $scope.groupBy = function (selectedGroupItem) {
        $scope.currentCases = groupByService.groupBy($scope.currentCases, originalCases, selectedGroupItem);
        $scope.specificGroupByDefaultSortExpression = groupByService.getSpecificGroupByDefault(selectedGroupItem);
    };

    $scope.showMoreItems = function () {
        $scope.groupByValue = groupByService.getGroupByValue();
        if ($scope.busyLoadingData) {
            return;
        }
        if (!stopLoad) {
            $scope.busyLoadingData = true;
            $scope.showSpinner.infiniteScroll = true;

            searchService.getCases(query + '+limit+' + pageSize + '+offset+' + $scope.currentCases.length).promise.then(function (result) {
                $scope.caseCount = result.unlimitedResultCount;
                if (result.length === 0) {
                    stopLoad = true;
                }
                $scope.showSpinner.currentCases = false;
                $scope.busyLoadingData = false;
                $scope.showSpinner.infiniteScroll = false;

                $scope.currentCases = $scope.currentCases.concat(result);
                if ($scope.groupByValue) {
                    $scope.currentCases = groupByService.groupBy($scope.currentCases, $scope.currentCases, $scope.groupByValue);
                }
                $scope.showSpinner.currentCases = false;
                $scope.busyLoadingData = false;
                $scope.showSpinner.infiniteScroll = false;
            });
        }
    };
});
