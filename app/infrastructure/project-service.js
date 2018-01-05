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
    .factory('projectService', function (backendService, navigationService, SfCase, caseService, growl) {

        return {
            getAll: function () {
                return backendService.get({
                    specs: [
                        {resources: caseService.getWorkspace()}
                        //{resources: 'projects'}
                    ],
                    onSuccess: function (resource, result) {
                        var projects = _.chain(resource.response.index.links)
                            .filter(function (item) {
                                return item.rel === 'inbox' || item.rel === 'assignments';
                            })
                            .groupBy('text')
                            .value();

                        _.forEach(projects, function (values, key) {
                            var id = undefined;
                            var types = _.map(values, function (item) {
                                id = item.id;
                                return {name: item.rel, href: item.href, caseCount: item.caseCount};
                            });

                            result.push({text: key, types: types, id: id});
                        });
                        result.unlimitedResultCount = resource.response.unlimitedResultCount;
                    }
                });
            },
            //http://localhost:3501/b35873ba-4007-40ac-9936-975eab38395a-3f/inbox/f9d9a7f7-b8ef-4c56-99a8-3b9b5f2e7159-0
            getSelected: function (projectId, projectType, query, callback) {
                var self = this;
                query = query || '';

                return backendService.get({
                    specs: [
                        {resources: caseService.getWorkspace()},
                        {resources: 'projects'},
                        {'index.links': projectId},
                        {resources: projectType},
                        {queries: 'cases?tq=select+*' + query}
                    ],
                    onSuccess: function (resource, result) {
                        resource.response.links.forEach(function (item) {
                            result.push(self.sfCaseFactory(item));
                        });

                        if (callback) {
                            callback();
                        }
                    },
                    onFailure: function (err) {
                        growl.warning('Object don\'t exist');
                        console.error(err);
                    }
                });
            },

            checkSelected: function (projectId, projectType, query, failureCallback) {
                var self = this;
                query = query || '';

                return backendService.get({
                    specs: [
                        {resources: caseService.getWorkspace()},
                        {resources: 'projects'},
                        {'index.links': projectId},
                        {resources: projectType},
                        {queries: 'cases?tq=select+*' + query}
                    ],
                    onFailure: function (err) {
                        if (failureCallback) {
                            failureCallback();
                        }
                        console.error(err);
                    }
                });
            },

            sfCaseFactory: function (model) {
                var href = navigationService.caseHrefSimple(model.id);
                return new SfCase(model, href);
            },

            createCase: function (projectId, projectType) {
                return backendService.postNested(
                    [
                        {resources: caseService.getWorkspace()},
                        {resources: 'projects'},
                        {'index.links': projectId},
                        {resources: projectType},
                        {commands: 'createcase'}
                    ],
                    {});
            }


        };
    });
