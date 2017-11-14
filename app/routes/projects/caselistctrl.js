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
    .controller('CaseListCtrl', function ($scope, $q, $location, $routeParams, $window, projectService, $rootScope, caseService, groupByService, paginationService) {
        var initialCase = projectService.getSelected($routeParams.projectId, $routeParams.projectType, '+limit+1+offset+0');
        var pageSize = paginationService.pageSize;
        $scope.currentCases = [];
        $scope.projects = projectService.getAll();

        var initCaseCount = function () {
            $q.when($scope.projects.promise).then(function () {
                $scope.projects.forEach(function (project) {
                    if (project.id === $routeParams.projectId) {
                        project.types.forEach(function (type) {
                            if (type.name === $routeParams.projectType) {
                                $scope.$parent.caseCount = type.caseCount;
                                return true;
                            }
                        })
                    }
                });
            });
        };


        if (!$scope.$parent.caseCount) {
            initCaseCount();
        }

        $scope.projectType = $routeParams.projectType;
        $scope.scroll = 0;

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

        $scope.groupingOptions = groupByService.getGroupingOptions();

        // TODO
        $scope.groupBy = function (selectedGroupItem) {
            $scope.currentCases = groupByService.groupBy($scope.currentCases, initialCase, selectedGroupItem);
            $scope.specificGroupByDefaultSortExpression = groupByService.getSpecificGroupByDefault(selectedGroupItem);
        };

        $scope.showMoreItems = function () {
            $scope.groupByValue = groupByService.getGroupByValue();
            if ($scope.busyLoadingData) {
                return;
            }
            $scope.$watch("$parent.caseCount", function (caseCount) {
                if ($scope.currentCases.length < $scope.$parent.caseCount) {
                    $scope.busyLoadingData = true;
                    $scope.showSpinner.infiniteScroll = true;

                    var query = '+limit+' + pageSize + '+offset+' + $scope.currentCases.length;
                    projectService.getSelected($routeParams.projectId, $routeParams.projectType, query).promise.then(function (result) {
                        if ($scope.currentCases.length === 0) {
                            $scope.currentCases = result;
                            $scope.currentCases.invalidateFunctions = [result.invalidate];
                        } else {
                            Array.prototype.push.apply($scope.currentCases, result);
                            $scope.currentCases.invalidateFunctions.push(result.invalidate);
                        }
                        $scope.busyLoadingData = false;
                        $scope.showSpinner.infiniteScroll = false;
                    });
                }
            });
        };

        $scope.projects.promise.then(function (response) {
            var projectName = _.filter(response, function (projects) {
                _.each(projects, function (project) {
                    _.each(project, function (types) {
                        var url = types.href;
                        if (url !== undefined) {
                            var id = $routeParams.projectId;
                            if (url.contains(id)) {
                                $rootScope.projectName = projects.text;
                            }
                        }
                    });
                });
            });
        });

        //Set breadcrumbs to case-owner if possible else to project id
        initialCase.promise.then(function (response) {
            var owner = _.filter(response, function (sfCase) {
                if (sfCase.owner.length > 0) {
                    return sfCase.owner;
                }
            });

            if (owner.length > 0) {
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

        var updateCases = function (currentCases) {
            if (currentCases.invalidateFunctions) {
                currentCases.invalidateFunctions.forEach(function (invalidate) {
                    invalidate();
                });
                currentCases.resolve();
            }
        };

        // Event listeners
        $rootScope.$on('case-created', function () {
            updateCases($scope.currentCases);
        });
        $rootScope.$on('case-closed', function () {
            updateCases($scope.currentCases);
        });
        $rootScope.$on('case-assigned', function () {
            updateCases($scope.currentCases);
        });
        $rootScope.$on('case-unassigned', function () {
            updateCases($scope.currentCases);
        });
        $rootScope.$on('case-resolved', function () {
            updateCases($scope.currentCases);
        });
        $rootScope.$on('case-deleted', function () {
            updateCases($scope.currentCases);
        });
        $rootScope.$on('case-owner-changed', function () {
            updateCases($scope.currentCases);
        });
        $rootScope.$on('casedescription-changed', function () {
            updateCases($scope.currentCases);
        });
        $rootScope.$on('case-edited', function () {
            updateCases($scope.currentCases);
        });
        // End Event listeners
    });
