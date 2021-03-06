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
    .directive('breadcrumbbanner', function (profileService, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'components/breadcrumb-banner/breadcrumb-banner.html',
            scope: {
                breadcrumblist: '=?'
            },
            link: function (scope) {
                scope.breadcrumbList = null;

                scope.showShortcutInfoPopUp = function () {
                    scope.showShortcutInfo = true;
                };

                scope.$watch('breadcrumbList', function (newVal) {
                    if (!newVal) {
                        return;
                    }
                    scope.breadcrumbList = newVal;
                });

                $rootScope.$on('breadcrumb-updated', function (event, breadcrumbList) {
                    scope.breadcrumbList = breadcrumbList;
                });
            }
        };
    });

