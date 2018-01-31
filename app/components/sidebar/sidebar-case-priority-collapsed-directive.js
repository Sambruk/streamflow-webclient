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

angular.module('sf').directive('sidebarCasePriorityCollapsed', function (sidebarService) {
    return {
        restrict: 'A',
        scope: {
            canChange: '='
        },
        templateUrl: 'components/sidebar/sidebar-case-priority-collapsed.html',
        link: function (scope) {
            scope.general = scope.$parent.general;
            scope.possiblePriorities = scope.$parent.possiblePriorities;
            scope.caze = scope.$parent.caze;
            scope.priority = '-1';
            scope.priorityColor = {};
            scope.activePriorityColor = {};

            sidebarService.priority(scope);

            scope.general.promise.then(function (result) {
                scope.dueOn = result[0].dueOnShort;
            });

            scope.$on('priority-changed', function (event, priorityId) {
                scope.activePriorityColor = {
                    'background-color': scope.priorityColor[priorityId]
                };

                scope.possiblePriorities.forEach(function (item) {
                    if (item.id === priorityId) {
                        scope.general[0].priority.text = item.text;
                    }
                });
            });

            scope.$on('due-to-changed', function (event, dueTo) {
                scope.dueOn = dueTo;
            });
        }
    };
});

