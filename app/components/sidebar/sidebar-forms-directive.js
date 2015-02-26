'use strict';

angular.module('sf').directive('sidebarForms', function (sidebarService) {
  return {
    restrict: 'A',
    scope: {
      canCreate: '='
    },
    templateUrl: 'components/sidebar/sidebar-forms.html',
    link: function (scope) {
      scope.possibleForms = scope.$parent.possibleForms;
      scope.caze = scope.$parent.caze;
    }
  };
});

