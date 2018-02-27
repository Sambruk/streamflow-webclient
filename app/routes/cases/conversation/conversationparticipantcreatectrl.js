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
    .controller('ConversationParticipantCreateCtrl', function ($scope, caseService, $routeParams, navigationService, $location) {
        $scope.caseId = $routeParams.caseId;
        $scope.conversationId = $routeParams.conversationId;
        $scope.possibleParticipants = caseService.getPossibleConversationParticipants($routeParams.caseId, $routeParams.conversationId);

        var searchInput;

        var noMatchingResult = function () {
            return $('.ui-select-no-choice:first').not('.ng-hide').length > 0;
        };

        var onSearchFieldKeyDown = function (keyEvent) {
            function isTabOrEnter(theKeyEvent) {
                return (theKeyEvent.which === 9 || theKeyEvent.which === 13);
            }

            function isEmailAddress(value) {
                return value.match(/^$|^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
            }

            if (isTabOrEnter(keyEvent) && noMatchingResult()) {
                var value = searchInput.val();
                if (!isEmailAddress(value)) {
                    return;
                }

                var select = $('#convo-participant-select');
                var option = $('<option>').val(value).text(value);
                select.prepend(option);
                select.val(value);
                select.trigger('chosen:updated');
                $scope.participant = undefined;
                $scope.externalParticipant = option[0].text;

                //Auto submit inputted value as external participant
                angular.element('[name="convo-submit"]').triggerHandler('click');
            }
        };

        /*
         This is to enable addition of external conversation participants by email address.
         */
        $(function () {
            searchInput = $('.search-container.select2-search input:first');
            searchInput.keydown(function (e) {
                if (noMatchingResult()) {
                    onSearchFieldKeyDown(e);
                }
            });
        });

        var updateParticipant = function () {
            var href = navigationService.caseHrefSimple($routeParams.caseId) + '/conversation/' + $routeParams.conversationId;
            $scope.possibleParticipants.invalidate();
            $scope.possibleParticipants.resolve();
            var hrefWithoutHash = href.slice(1);
            $location.path(hrefWithoutHash);
        };

        $scope.addParticipant = function ($event) {
            $event.preventDefault();
            var participant = $scope.participant;

            if ($scope.participant) {
                caseService.addParticipantToConversation($routeParams.caseId, $routeParams.conversationId, participant)
                    .then(function () {
                        updateParticipant();
                    });
            } else {
                if ($scope.externalParticipant) {
                    caseService.addExternalParticipantToConversation($routeParams.caseId, $routeParams.conversationId, $scope.externalParticipant)
                        .then(function () {
                            updateParticipant();
                        });
                }
            }
        };
    });
