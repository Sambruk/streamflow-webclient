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

angular.module('sf').directive('sidebarDueDate', function (sidebarService) {
    return {
        restrict: 'A',
        scope: {
            canChange: '='
        },
        templateUrl: 'components/sidebar/sidebar-due-date.html',
        link: function (scope) {
            scope.general = scope.$parent.general;
            scope.caze = scope.$parent.caze;

            scope.general.promise.then(function (result) {
                scope.dueOn = result[0].dueOnShort;
            });

            scope.changeDueOn = function (date) {
                scope.$root.$broadcast('case-edited', scope.$parent.caze);
                sidebarService.changeDueOn(scope, date);
                scope.$root.$broadcast('due-to-changed', scope.dueOn);
            };
        }
    };
});

