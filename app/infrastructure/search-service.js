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

angular.module('sf').factory('searchService', function (backendService, projectService) {

    var workspaceId = 'workspacev2';

    function getCases(query) {
        query = query.replace(/: /g, ':');
        // Replace 'group by X desc, sort by Y asc'
        // with 'order by X desc, Y asc'
        if (query.indexOf('group by') > 0 && query.indexOf('sort by') > 0) {
            query = query.replace('group', 'order');
            query = query.replace('sort by ', '');
        } else if (query.indexOf('group by ') > 0) {
            query = query.replace('group', 'order');
        } else if (query.indexOf('sort by') > 0) {
            query = query.replace('sort', 'order');
        }
        return backendService.get({
            specs: [
                {resources: workspaceId},
                {resources: 'search'},
                {queries: 'cases?tq=select+*+where+' + query}
            ],
            onSuccess: function (resource, result) {
                resource.response.links.forEach(function (item) {
                    result.push(projectService.sfCaseFactory(item));
                });
                result.unlimitedResultCount = resource.response.unlimitedResultCount;
            }
        });
    }

    function getPossibleAssignees() {
        return backendService.get({
            specs: [
                {resources: workspaceId},
                {resources: 'search'},
                {queries: 'possibleassignees'}
            ],
            onSuccess: function (resource, result) {
                resource.response.links.forEach(function (item) {
                    result.push(projectService.sfCaseFactory(item));
                });
            }
        });
    }

    function getPossibleCaseTypes() {
        return backendService.get({
            specs: [
                {resources: workspaceId},
                {resources: 'search'},
                {queries: 'possiblecasetypes'}
            ],
            onSuccess: function (resource, result) {
                resource.response.links.forEach(function (item) {
                    result.push(projectService.sfCaseFactory(item));
                });
            }
        });
    }

    function getPossibleCreatedBy() {
        return backendService.get({
            specs: [
                {resources: workspaceId},
                {resources: 'search'},
                {queries: 'possiblecreatedby'}
            ],
            onSuccess: function (resource, result) {
                resource.response.links.forEach(function (item) {
                    result.push(projectService.sfCaseFactory(item));
                });
            }
        });
    }

    function getPossibleLabels() {
        return backendService.get({
            specs: [
                {resources: workspaceId},
                {resources: 'search'},
                {queries: 'possiblelabels'}
            ],
            onSuccess: function (resource, result) {
                resource.response.links.forEach(function (item) {
                    result.push(projectService.sfCaseFactory(item));
                });
            }
        });
    }

    function getPossibleProjects() {
        return backendService.get({
            specs: [
                {resources: workspaceId},
                {resources: 'search'},
                {queries: 'possibleprojects'}
            ],
            onSuccess: function (resource, result) {
                resource.response.links.forEach(function (item) {
                    result.push(projectService.sfCaseFactory(item));
                });
            }
        });
    }

    function getPossibleStatus() {
        return backendService.get({
            specs: [
                {resources: workspaceId},
                {resources: 'search'},
                {queries: 'possiblestatus'}
            ],
            onSuccess: function (resource, result) {
                resource.response.links.forEach(function (item) {
                    result.push(projectService.sfCaseFactory(item));
                });
            }
        });
    }

    return {
        getCases: getCases,
        getPossibleAssignees: getPossibleAssignees,
        getPossibleCaseTypes: getPossibleCaseTypes,
        getPossibleLabels: getPossibleLabels,
        getPossibleProjects: getPossibleProjects,
        getPossibleStatus: getPossibleStatus,
        getPossibleCreatedBy: getPossibleCreatedBy
    };

});
