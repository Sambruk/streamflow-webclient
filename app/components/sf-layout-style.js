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
    .directive('sfLayoutStyle', function ($location) {
        function clearLayoutClasses(element) {
            _.each(['layout-1', 'layout-2'], function (c) {
                element.removeClass(c);
            });
        }

        return {
            restrict: 'A',
            link: function (scope, element) {
                scope.location = $location;
                scope.$watch(function () {
                    return $location.path();
                }, function (path) {
                    clearLayoutClasses(element);
                    if (path.indexOf('/projects') === 0 || path.indexOf('/search') === 0) {
                        element.addClass('layout-1');
                    }
                    else {
                        element.addClass('layout-2');
                    }
                });
            }
        };
    });

