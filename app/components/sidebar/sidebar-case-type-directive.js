'use strict';

angular.module('sf').directive('sidebarCaseType', function (sidebarService) {
  return {
    restrict: 'A',
    scope: {
      canChange: '='
    },
    templateUrl: 'components/sidebar/sidebar-case-type.html',
    link: function (scope) {
      // TODO: Something better than this. Updating current scope to match
      // parent scope just seems wrong.
      scope.possibleCaseTypes = scope.$parent.possibleCaseTypes;
      scope.caze = scope.$parent.caze;
      scope.general = scope.$parent.general;
      scope.possibleForms = scope.$parent.possibleForms;
      scope.possiblePriorities = scope.$parent.possiblePriorities;
      scope.possibleResolutions = scope.$parent.possibleResolutions;

      sidebarService.caseType(scope);

      scope.changeCaseType = function (caseType) {
        sidebarService.changeCaseType(scope, caseType);
      };
    }
  };
});

