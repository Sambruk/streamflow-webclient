'use strict';

angular.module('sf').directive('sidebarFormsCollapsed', function ($routeParams, sidebarService, caseService) {
    return {
        restrict: 'A',
        scope: {
            canCreate: '='
        },
        templateUrl: 'components/sidebar/sidebar-forms-collapsed.html',
        link: function (scope) {
            scope.submittedFormList = scope.$parent.submittedFormList;
            scope.possibleForms = scope.$parent.possibleForms;
            scope.caze = scope.$parent.caze;

            scope.openFormInNewWindow = function (formId, newWindow) {
                sidebarService.openForm(scope, formId, newWindow);
            };

            scope.$on('form-saved', function(event, formId){
                scope.submittedFormList =  caseService.getSubmittedFormList($routeParams.caseId);
            });
        }
    };
});
