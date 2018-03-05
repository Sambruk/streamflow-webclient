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

        $scope.contactTypes = [
            {id:"letter", text:"Brev"},
            {id:"email", text:"E-post"},
            {id:"sms", text:"SMS"},
            {id:"phone", text:"Telefon"}
        ];

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

            if ($event.currentTarget.id === 'contact-phone' && !$event.currentTarget.value.match(/^$|^([0-9()\/+ \-]*)$/) || $event.currentTarget.id === 'contact-email' && !$event.currentTarget.value.match(/^$|^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
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


        //TODO fix update animation and clean up this
        $scope.updateFieldManually = function ($event) {
            var contact = {};
            contact[$event.$select.$element.attr('name')] = $event.$select.selected.id;
            $scope.contactId = caseService.updateContact($routeParams.caseId, $routeParams.contactIndex, contact)
                .then(function () {
                    successCallback($event.$select.$element);
                }, function () {
                    errorCallback($event.$select.$element);
                });
        };

        var successCallback = function (element) {
            if (element.hasClass('error')) {
                element.removeClass('error');
            }

            // if (element[0].type === 'select-one') {
            element.addClass('saved saved-select');
            // }

            if ($('form div').hasClass('error') || !$('#contact-name').val()) {
                $('#contact-submit-button').attr('disabled', true).addClass('inactive');
            }
            else {
                $('#contact-submit-button').attr('disabled', false).removeClass('inactive');
            }

            element.parent()[0].addEventListener('webkitAnimationEnd', function () {
                element.removeClass('saved').removeClass('saved-select');
            });


            //Talk of removing the saved icon after a while, whis coule be one way.
            //Looked at fading it in and out however you cannot fade the "content" in a :after pseudo element
            //it triggers a remove of the last one and add of a new element and that can not be transitioned
            //setTimeout(removeIt,2000);
            var form = $scope[element.closest('form').attr('name')];

            setPristine(form, element);
            $('[class^=error]', element.parent()).hide();
        };

        var errorCallback = function (element) {
            element.parent().addClass('error');
            $('#contact-submit-button').attr('disabled', true).addClass('inactive');
        };

        var setPristine = function (form, element) {
            if (form.$setPristine) {//only supported from v1.1.x
                form.$setPristine();
            } else {
                form.$dirty = false;
                form.$pristine = true;
                element.$dirty = false;
                element.$pristine = true;
            }
        };
    });
