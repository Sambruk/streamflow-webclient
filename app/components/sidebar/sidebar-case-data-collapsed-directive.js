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

            scope.$on('case-type-changed', function(){
                sidebarService.updateCaseLabels(scope);
            });

            // Attachments
            scope.downloadAttachment = function (attachment) {
                sidebarService.downloadAttachment(scope.$parent, attachment);
            };

        }
    };
});

