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
    .controller('FormHistoryCtrl', function ($scope, caseService, $location, $routeParams, $rootScope, $route, httpService) {
        $scope.loadChild = $location.$$search.showForm?true:false;

        $scope.showHistory = true;
        $scope.caseId = $routeParams.caseId;
        $scope.formId = $routeParams.formId;
        $scope.submittedForms = caseService.getSubmittedForms($routeParams.caseId, $scope.formId);

        $scope.submittedForms.promise.then(function () {
            if (!$scope.selectedSubmittedForm && $scope.submittedForms.length > 0) {
                $scope.selectedSubmittedForm = $scope.submittedForms[0].index;
            }
        });

        $scope.downloadFormAttachment = function (attachment) {
            var jsonParse = JSON.parse(attachment.value);

            var url = httpService.apiUrl + 'workspacev2/cases/' + $routeParams.caseId + '/submittedforms/download?id=' + jsonParse.attachment;
            window.location.replace(url);
        };

        $scope.sendSignatureReminder = function (taskRef) {
            caseService.sendSignatureReminder($scope.caseId, taskRef).then(function () {
                $scope.submittedForm.invalidate();
                $scope.submittedForm.resolve();
            });
        };

        $scope.$watch('selectedSubmittedForm', function () {
            var index = $scope.selectedSubmittedForm;
            if (_.isNumber(index)) {
                $scope.submittedForm = caseService.getSubmittedForm($routeParams.caseId, index);
            }
        });

        $rootScope.$on('form-saved', function () {
            $route.reload();
        });
    });
