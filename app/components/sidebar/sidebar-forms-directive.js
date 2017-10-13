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
            scope.submittedFormList = scope.$parent.submittedFormList;
            scope.caze = scope.$parent.caze;

            scope.openFormInNewWindow = function (formId, newWindow) {
                sidebarService.openForm(scope, formId, newWindow);
            };
        }
    };
});

