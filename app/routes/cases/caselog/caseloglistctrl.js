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
    .controller('CaselogListCtrl', function ($scope, $rootScope, $q, caseService, $routeParams, navigationService, httpService) {
        $scope.sidebardata = {};
        $scope.caseId = $routeParams.caseId;
        var defaultFiltersUrl = caseService.getWorkspace() + '/cases/' + $scope.caseId + '/caselog/defaultfilters';

        $scope.showSpinner = {
            caseLogs: true
        };

        httpService.getRequest(defaultFiltersUrl, false)
            .then(function (result) {
                var filterObj = result.data;
                var filterArray = [];
                for (var prop in filterObj) {
                    filterArray.push({'filterName': prop, 'filterValue': filterObj[prop]});
                }
                //Adding note filter manually since it not in present in filter API
                filterArray.push({'filterName': 'note', 'filterValue': false});
                $scope.caseLogFilters = filterArray;
                $scope.caseLogs = caseService.getSelectedCaseLog($routeParams.caseId);

                var notesPromise = caseService.getSelectedNote($routeParams.caseId);

                $q.all([$scope.caseLogs.promise, notesPromise.promise]).then(function (data) {
                    data[1].forEach(function (note) {
                        note.caseLogType = 'note';
                        note.creationDate = note.createdOn;
                        $scope.caseLogs.push(note);

                    });
                    $scope.showSpinner.caseLogs = false;
                });
            });

        var updateObject = function (itemToUpdate) {
            itemToUpdate.invalidate();
            itemToUpdate.resolve();
        };

        $rootScope.$watch('caselog-message-created', function () {

        });
    });
