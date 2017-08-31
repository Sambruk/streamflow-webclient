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

      scope.showCaseInfo = false;

      // Filter for caselog
      var defaultFiltersUrl =  caseService.getWorkspace() + '/cases/' + $routeParams.caseId + '/caselog/defaultfilters';
      httpService.getRequest(defaultFiltersUrl, false).then(function(result){
        scope.defaultFilters = result.data;
        scope.sideBarCaseLogs = caseService.getSelectedFilteredCaseLog($routeParams.caseId, scope.defaultFilters);
      }); // End Filter for caselog

      scope.showCaseInfoPopUp = function () {
        scope.showCaseInfo = true;
      };
    }
  };
});

