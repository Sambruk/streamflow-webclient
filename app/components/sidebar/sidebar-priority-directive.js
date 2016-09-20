'use strict';

angular.module('sf').directive('sidebarPriority', function (sidebarService) {
  return {
    restrict: 'A',
    scope: {
      canChange: '='
    },
    templateUrl: 'components/sidebar/sidebar-priority.html',
    link: function (scope) {
      scope.general = scope.$parent.general;
      scope.possiblePriorities = scope.$parent.possiblePriorities;

      scope.priority = '-1';
      scope.priorityColor = {};
      scope.activePriorityColor = {};

      sidebarService.priority(scope);

      scope.changePriorityLevel = function (priorityId) {
        sidebarService.changePriorityLevel(scope, priorityId);
        scope.$root.$broadcast('priority-changed', priorityId);
      };

      scope.$on('case-type-changed', function(){
        sidebarService.priority(scope);
      });
    }
  };
});

