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

angular.module('sf')
    .directive('issuelist', function ($scope) {
        return {
            restrict: 'E',
            templateUrl: 'components/issuelist/issuelist.html',
            scope: {
                items: '=?'
            },
            link: function (scope) {
                var initCurrentCases = function () {
                    scope.items = items;
                    scope.currentCases = [];
                };
                initCurrentCases();

                $scope.loadCases = function () {
                    var scrollSize = 10;
                    var last = $scope.currentCases.length - 1;
                    for (var i = 1; i <= scrollSize; i++) {
                        $scope.currentCases.push($scope.items[last + i]);
                    }
                };

                scope.$watch('items', function (newVal) {
                    if (newVal) {
                        scope.items = newVal;
                        initCurrentCases();
                    }
                });
            }
        };
    });