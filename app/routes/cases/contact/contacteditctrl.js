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
    .controller('ContactEditCtrl', function ($scope, $rootScope, caseService, $routeParams, navigationService, checkPermissionService) {
        $scope.sidebardata = {};
        $scope.projectId = $routeParams.projectId;
        $scope.projectType = $routeParams.projectType;
        $scope.caseId = $routeParams.caseId;
        $scope.contactIndex = $routeParams.contactIndex;
        $scope.contact = caseService.getSelectedContact($routeParams.caseId, $routeParams.contactIndex);

        $scope.showSpinner = {
            contact: true
        };

        $scope.contact.promise.then(function () {
            $scope.showSpinner.contact = false;
            checkPermissionService.checkPermissions($scope, $scope.contact.commands, ['delete', 'update'], ['canDeleteContact', 'canUpdateContact']);
            if (!$scope.canUpdateContact) {
                $('.select select, .contact-pref').addClass('disabled');
            }
        });

        $scope.updateField = function ($event, $success, $error) {
            $event.preventDefault();
            var contact = {};

            contact[$event.currentTarget.name] = $event.currentTarget.value;

            if ($event.currentTarget.id === 'contact-phone' && !$event.currentTarget.value.match(/^$|^([0-9\(\)\/\+ \-]*)$/)) {
                $error($($event.target));
            } else if ($event.currentTarget.id === 'contact-email' && !$event.currentTarget.value.match(/^$|^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
                $error($($event.target));
            } else if ($event.currentTarget.id === 'contact-id' && !$event.currentTarget.value.match(/^$|^19\d{10}$/)) {
                $error($($event.target));
            } else {
                $scope.contactId = caseService.updateContact($routeParams.caseId, $routeParams.contactIndex, contact)
                    .then(function () {
                        if ($event.currentTarget.id === 'contact-name') {
                            $rootScope.$broadcast('contact-name-updated');
                        }
                        $success($($event.target));
                    }, function () {
                        $error($($event.target));
                    });
            }
        };
    });
