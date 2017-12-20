'use strict';

angular.module('sf').directive('sidebarDueDate', function (sidebarService) {
    return {
        restrict: 'A',
        scope: {
            canChange: '='
        },
        templateUrl: 'components/sidebar/sidebar-due-date.html',
        link: function (scope) {
            scope.general = scope.$parent.general;
            scope.caze = scope.$parent.caze;

            scope.general.promise.then(function (result) {
                scope.dueOn = result[0].dueOnShort;
            });

            scope.changeDueOn = function (date) {
                scope.$root.$broadcast('case-edited', scope.$parent.caze);
                sidebarService.changeDueOn(scope, date);
                scope.$root.$broadcast('due-to-changed', scope.dueOn);
            };
        }
    };
});

