'use strict';

angular.module('sf').directive('sidebarCase', function ($routeParams, httpService, caseService) {
  return {
    restrict: 'A',
    scope: {},
    templateUrl: 'components/sidebar/sidebar-case.html',
    link: function (scope) {
      scope.caze = scope.$parent.caze;
      scope.notes = scope.$parent.notes;
      scope.status  = $routeParams.status;
      scope.emptyNoteMessage = '';

      scope.showCaseInfo = false;

      scope.showCaseInfoPopUp = function () {
        scope.showCaseInfo = true;
      };
    }
  };
});

