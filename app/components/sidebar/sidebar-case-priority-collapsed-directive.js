'use strict';

angular.module('sf').directive('sidebarCasePriorityCollapsed', function (sidebarService) {
    return {
        restrict: 'A',
        scope: {
            canChange: '='
        },
        templateUrl: 'components/sidebar/sidebar-case-priority-collapsed.html',
        link: function (scope) {
            scope.general = scope.$parent.general;
            scope.possiblePriorities = scope.$parent.possiblePriorities;
            scope.caze = scope.$parent.caze;
            scope.priority = '-1';
            scope.priorityColor = {};
            scope.activePriorityColor = {};

            sidebarService.priority(scope);

            scope.general.promise.then(function (result) {
                scope.dueOn = result[0].dueOnShort;
            });

            scope.$on('priority-changed', function (event, priorityId) {
                scope.activePriorityColor = {
                    'background-color': scope.priorityColor[priorityId]
                };

                scope.possiblePriorities.forEach(function (item) {
                    if (item.id === priorityId) {
                        scope.general[0].priority.text = item.text;
                    }
                });
            });

            scope.$on('due-to-changed', function (event, dueTo) {
                scope.dueOn = dueTo;
            });
        }
    };
});

