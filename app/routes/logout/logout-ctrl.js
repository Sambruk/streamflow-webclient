'use strict';

angular.module('sf').controller('LogoutCtrl', function ($rootScope, $scope, tokenService) {
  $scope.isDefaultToken = tokenService.isDefaultToken;
  $rootScope.$broadcast('logout', true);
});

