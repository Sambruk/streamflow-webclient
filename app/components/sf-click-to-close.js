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
.directive("sfClickToClose", ['$rootScope', function($rootScope) {
  return {
    restrict: "A",
    link: function(scope, elem, attrs) {
      var toClose = attrs.ngShow;
      $(document).on("mouseup touchstart", function (e) {
        var container = $(elem);

        if (!container.is(e.target) // if the target of the click isn't the container...
          && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
          e.stopPropagation();
          $rootScope.$broadcast('dialogCloseEvent', {
            dialog: toClose
          });
        }
      });
    }
  }
}]);