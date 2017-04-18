'use strict';

angular.module('sf').directive('sidebarCase', function ($routeParams, httpService, caseService) {
  return {
    restrict: 'A',
    scope: {},
    templateUrl: 'components/sidebar/sidebar-case.html',
    link: function (scope) {
      scope.caze = scope.$parent.caze;
      scope.notes = scope.$parent.notes;
      scope.status  = $routeParams.status;
      scope.emptyNoteMessage = 'Här visas automatiskt sammanfattningen, som normalt är starten på det första inlägget i ärendet. Du kan ändra sammanfattningen genom att klicka på pennan.';

      scope.showCaseInfo = false;

      scope.showCaseInfoPopUp = function () {
        scope.showCaseInfo = true;
      };
    }
  };
});

