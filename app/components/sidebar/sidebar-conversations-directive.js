'use strict';

angular.module('sf').directive('sidebarConversations', function () {
    return {
        restrict: 'A',
        scope: {
            canCreate: '='
        },
        templateUrl: 'components/sidebar/sidebar-conversations.html',
        link: function (scope) {
            scope.caze = scope.$parent.caze;
            scope.conversations = scope.$parent.conversations;
        }
    };
});
