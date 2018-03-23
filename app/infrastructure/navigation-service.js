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
    .factory('navigationService', function ($location, $routeParams) {

        return {
            linkTo: function (href) {
                return $location.path(href);
            },
            caseHref: function (caseId) {
                return '#/' + this.projectId() + '/' + this.projectType() + '/' + caseId;
            },
            caseHrefSimple: function (caseId) {
                var projectId = this.projectId();
                return '#/cases/' + caseId + '/' + (projectId ? projectId : '');
            },
            caseListHrefFromCase: function (caze) {
                return '#/' + 'projects/' + caze[0].ownerId + '/' + caze[0].listType + '/';
            },
            projectId: function () {
                return $routeParams.projectId;
            },
            projectType: function () {
                return $routeParams.projectType;
            },
            caseId: function () {
                return $routeParams.caseId;
            }
        };
    });
