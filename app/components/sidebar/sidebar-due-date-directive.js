'use strict';

angular.module('sf').directive('sidebarDueDate', function (sidebarService) {
  return {
    restrict: 'E',
    templateUrl: 'components/sidebar/sidebar-due-date.html',
    link: function (scope, element, attrs) {
      scope.dueOnShort = attrs.dueOn;
      scope.canChangeDueOn = attrs.canChange;

      console.log(attrs);

      scope.changeDueOn = function (date) {
        sidebarService.changeDueOn(scope, date);
      };
    }
  };
});

