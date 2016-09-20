'use strict';

angular.module('sf').directive('sidebarCaseDataCollapsed', function (sidebarService) {
    return {
        restrict: 'A',
        scope: {
            canChange: '='
        },
        templateUrl: 'components/sidebar/sidebar-case-data-collapsed.html',
        link: function (scope, element) {
            // TODO: Something better than this. Updating current scope to match
            // parent scope just seems wrong.
            scope.possibleCaseTypes = scope.$parent.possibleCaseTypes;
            scope.caze = scope.$parent.caze;
            scope.attachments = scope.$parent.attachments;

            sidebarService.caseType(scope);

            scope.changeCaseType = function (caseType) {
                sidebarService.changeCaseType(scope, caseType);
            };

            scope.activeLabels = [];

            //TODO Check if case labels will be updated, if yes add another update listeners
            sidebarService.updateCaseLabels(scope);

            scope.$on('labels-changed', function (event, labels) {
                scope.caseLabel = labels;
            });

            scope.$on('type-changed', function (event, typeId) {
                scope.possibleCaseTypes.forEach(function (item) {
                    if (item.id === typeId) {
                        scope.caze[0].caseType.text = item.text;
                    }
                });
            });

            // Attachments
            scope.downloadAttachment = function (attachment) {
                sidebarService.downloadAttachment(scope.$parent, attachment);
            };
        }
    };
});

