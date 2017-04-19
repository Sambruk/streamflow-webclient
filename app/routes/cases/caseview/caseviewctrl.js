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

angular.module('sf').controller('CaseViewCtrl', function ($scope, $rootScope, $routeParams, caseService) {
    $scope.sidebardata = {};
    $scope.caseId = $routeParams.caseId;
    $scope.projectId = $routeParams.projectId;
    $scope.caze = caseService.getSelected($routeParams.caseId);
    $scope.status = $routeParams.status;

    $scope.showSpinner = {
        caseLogs: true
    };

    $scope.caseLogs = caseService.getSelectedFilteredCaseLog($routeParams.caseId, {
        system: false,
        systemTrace: false,
        form: false,
        conversation: false,
        attachment: false,
        contact: false,
        custom: true
    });

    $scope.$watch('sidebardata.caze', function (newVal) {
        if (!newVal) {
            return;
        }
        $scope.caze = $scope.sidebardata.caze;
        $scope.caze.promise.then(function () {
            $scope.caseDescription = $scope.caze[0].text;
        });
    });

    $scope.$watch('caseDescription', function (newVal) {
        if (!newVal) {
            return;
        }
        $scope.caseDescription = newVal;
    });

    var updateObject = function (itemToUpdate) {
        itemToUpdate.invalidate();
        itemToUpdate.resolve();
    };

    $scope.caze.promise.then(function () {
        document.title = 'Streamflow ' + $scope.caze[0].caseId;
    });

    $scope.caseLogs.promise.then(function () {
        $scope.showSpinner.caseLogs = false;
    });

    $scope.$on('caselog-message-created', function () {
        $scope.showSpinner.caseLogs = true;
        updateObject($scope.caseLogs);

        $scope.caseLogs.promise.then(function () {
            $scope.showSpinner.caseLogs = false;
        });
    });

});

