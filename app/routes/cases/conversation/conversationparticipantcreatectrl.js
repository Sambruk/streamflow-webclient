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
  .controller('ConversationParticipantCreateCtrl', function($scope, caseService, $routeParams, navigationService, $location) {
    $scope.caseId = $routeParams.caseId;
    $scope.conversationId = $routeParams.conversationId;
    $scope.possibleParticipants = caseService.getPossibleConversationParticipants($routeParams.caseId, $routeParams.conversationId);

    var onSearchFieldKeyDown = function (keyEvent){
      function isTabOrEnter(theKeyEvent) {
        return (theKeyEvent.which === 9 || theKeyEvent.which === 13);
      }

      function noMatchingResult() {
        return $('#convo_participant_select_chosen').find('li.no-results').length > 0;
      }

      function isEmailAddress(value) {
        return value.match(/^$|^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
      }

      if (isTabOrEnter(keyEvent) && noMatchingResult()){
        if(!isEmailAddress(this.value)){
          return;
        }

        var select = $('#convo-participant-select');
        var option = $('<option>').val(this.value).text(this.value);
        select.prepend(option);
        select.val(this.value);
        select.trigger('chosen:updated');
        $scope.participant = undefined;
        $scope.externalParticipant = option[0].text;
      }
    };

    /*
     This is to enable addition of external conversation participants by email address.
     */
    var searchField = '#convo_participant_select_chosen input:first';
    $('body').off('keydown.searchfield', searchField);
    $('body').on('keydown.searchfield', searchField, onSearchFieldKeyDown);

    var updateParticipant = function(){
      var href = navigationService.caseHrefSimple($routeParams.caseId) + '/conversation/' + $routeParams.conversationId;
      $scope.possibleParticipants.invalidate();
      $scope.possibleParticipants.resolve();
      var hrefWithoutHash = href.slice(1);
      $location.path(hrefWithoutHash);
    };

    $scope.addParticipant = function($event){
      $event.preventDefault();
      var participant = $scope.participant;

      if($scope.participant){
        caseService.addParticipantToConversation($routeParams.caseId, $routeParams.conversationId, participant)
        .then(function(){
          updateParticipant();
        });
      }else{
          if($scope.externalParticipant) {
              caseService.addExternalParticipantToConversation($routeParams.caseId, $routeParams.conversationId, $scope.externalParticipant)
                  .then(function () {
                      updateParticipant();
                  });
          }
      }
    };
  });
