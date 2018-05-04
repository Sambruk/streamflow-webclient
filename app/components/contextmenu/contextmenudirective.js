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

angular.module('sf').directive('contextmenu', function (projectService, navigationService, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'components/contextmenu/contextmenu.html',
        scope: {
            params: '=?'
        },
        link: function (scope) {
            Mousetrap.bind('mod+n', function () {
                if (scope.canCreateCase()) {
                    scope.createCase();
                    scope.$apply();
                }
            });

            scope.showSidebar = false;

            scope.projects = projectService.getAll();

            scope.navigateTo = function (href, projectName, caseCount, $event) {
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

            scope.canCreateCase = function () {
                if (!scope.params) {
                    return false;
                }
                return !(!scope.params.projectType && $rootScope.location.$$path.indexOf('cases') < 0);

            };

            scope.createCase = function () {
                if (!scope.canCreateCase()) {
                    alert('Du måste välja brevlåda nedan');
                    return;
                }
                var projectId = navigationService.projectId();

                //Add cases possible only with that type
                var projectType = 'assignments';

                projectService.createCase(projectId, projectType).then(function (response) {
                    var caseId = response.data.events[1].entity;
                    var href = navigationService.caseHref(projectId, caseId) + '/new';
                    $rootScope.$broadcast('case-created');
                    window.open(href);
                });
            };

            var updateObject = function (itemToUpdate) {
                itemToUpdate.invalidate();
                itemToUpdate.resolve();
            };

            // Event listeners
            $rootScope.$on('case-created', function () {
                updateObject(scope.projects);
            });
            $rootScope.$on('case-closed', function () {
                updateObject(scope.projects);
            });
            $rootScope.$on('case-assigned', function () {
                updateObject(scope.projects);
            });
            $rootScope.$on('case-unassigned', function () {
                updateObject(scope.projects);
            });
            $rootScope.$on('case-resolved', function () {
                updateObject(scope.projects);
            });
            $rootScope.$on('case-deleted', function () {
                updateObject(scope.projects);
            });
            $rootScope.$on('case-owner-changed', function () {
                updateObject(scope.projects);
            });
            $rootScope.$on('case-opened', function () {
                scope.showSidebar = false;
            });
            // End Event listeners
        }
    };
});
