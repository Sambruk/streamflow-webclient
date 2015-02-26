'use strict';

angular.module('sf').controller('LogoutCtrl', function ($rootScope) {
  $rootScope.$broadcast('logout', true);
});

