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
.factory('casePropertiesService', function(caseService){

    var checkCaseProperties = function(currentCases){
          _.each(currentCases, function(caze){
            if(caze.dueOn) {
              caze.dueOn = caze.dueOn.split('T')[0];
            }

            if(caze.priority){
              //reset case priority and set again below if matching possible priority
              var origPriority = caze.priority;
              caze.priority = null;
              caseService.getPossiblePriorities(caze.id).promise.then(function(possiblePriorities){
                _.each(possiblePriorities, function(priority){
                  if(origPriority.id === priority.id){
                    caze.priority = priority;
                  }
                });
              });
            }

          });
          return currentCases;
        };

  return {
    checkCaseProperties: checkCaseProperties
  };

});
