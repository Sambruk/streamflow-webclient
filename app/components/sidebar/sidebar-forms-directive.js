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

      scope.openFormInNewWindow = function (formId) {
        var height = $(window).height();
        var width = $(window).width();
        var popupWindow = window.open('#/cases/' + scope.caze[0].id + '/formdrafts/'+ formId, 'FormWindow_' + Math.random(), 'height=' + height*0.7 + ', width=' + width*0.5 + ', left=' + width*0.33);
        popupWindow.isFormWindow = true;
        if (window.focus) {
          popupWindow.focus();
        }
        sidebarService.updateToolbar(scope);
      };
    }
  };
});

