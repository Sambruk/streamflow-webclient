'use strict';

angular.module('sf').directive('sidebarCaseLabels', function (sidebarService) {
    return {
        restrict: 'A',
        scope: {
            canChange: '='
        },
        templateUrl: 'components/sidebar/sidebar-case-labels.html',
        link: function (scope) {
            scope.allCaseLabels = [];
            scope.activeLabels = [];
            scope.previousActiveLabels = [];

            sidebarService.updateCaseLabels(scope);

            scope.changeCaseLabels = function (labels) {
                sidebarService.changeCaseLabels(scope, labels);
            };

            scope.$on('case-type-changed', function () {
                sidebarService.updateCaseLabels(scope);
            });
        }
    };
});

