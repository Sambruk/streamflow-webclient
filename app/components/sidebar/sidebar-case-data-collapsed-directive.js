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

angular.module('sf').directive('sidebarCaseDataCollapsed', function (sidebarService) {
    return {
        restrict: 'A',
        scope: {
            canChange: '='
        },
        templateUrl: 'components/sidebar/sidebar-case-data-collapsed.html',
        link: function (scope) {
            // TODO: Something better than this. Updating current scope to match
            // parent scope just seems wrong.
            scope.possibleCaseTypes = scope.$parent.possibleCaseTypes;
            scope.caze = scope.$parent.caze;
            scope.attachments = scope.$parent.attachments;
            scope.parent = scope.$parent.parent;
            scope.subCases = scope.$parent.subCases;

            sidebarService.caseType(scope);

            scope.changeCaseType = function (caseType) {
                sidebarService.changeCaseType(scope, caseType);
            };

            scope.activeLabels = [];

            //TODO Check if case labels will be updated, if yes add another update listeners
            sidebarService.updateCaseLabels(scope);

            scope.$on('labels-changed', function (event, labels) {
                scope.caseLabel = labels;
            });

            scope.$on('type-changed', function (event, typeId) {
                scope.possibleCaseTypes.forEach(function (item) {
                    if (item.id === typeId && scope.caze[0].caseType) {
                        scope.caze[0].caseType.text = item.text;
                    }
                });
            });

            // Attachments
            scope.downloadAttachment = function (attachment) {
                sidebarService.downloadAttachment(scope.$parent, attachment);
            };
        }
    };
});

