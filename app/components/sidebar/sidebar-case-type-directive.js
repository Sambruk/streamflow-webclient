'use strict';

angular.module('sf').directive('sidebarCaseType', function (sidebarService) {
    return {
        restrict: 'A',
        scope: {
            canChange: '='
        },
        templateUrl: 'components/sidebar/sidebar-case-type.html',
        link: function (scope, element) {
            // TODO: Something better than this. Updating current scope to match
            // parent scope just seems wrong.
            scope.possibleCaseTypes = scope.$parent.possibleCaseTypes;
            scope.caze = scope.$parent.caze;
            scope.general = scope.$parent.general;
            scope.possibleForms = scope.$parent.possibleForms;
            scope.possiblePriorities = scope.$parent.possiblePriorities;
            scope.possibleResolutions = scope.$parent.possibleResolutions;
            scope.caseTypeSearchInput = scope.$parent.caseTypeSearchInput;

            sidebarService.caseType(scope);

            scope.changeCaseType = function (caseType) {
                sidebarService.changeCaseType(scope, caseType);
            };

            scope.escapeHTMLChars = function (value) {
                var map = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    '\'': '&#039;'
                };
                return value.replace(/[&<>"']/g, function (m) {
                    return map[m];
                });
            };


            scope.highlight = function (text, search) {
                if (!search) {
                    return scope.escapeHTMLChars(text);
                }
                var htmlChars = ['&', '<', '>', '"', '\''];

                var openHighlightTag = '<span class="ui-select-highlight">';
                var closeHighlightTag = '</span>';

                //Escaping regex special chars
                search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

                if (htmlChars.some(function (v) {
                        return search.indexOf(v) >= 0;
                    })) {
                    var tmpSearchStr = scope.escapeHTMLChars(search);
                    return (scope.escapeHTMLChars(text).replace(new RegExp((search), 'gi'), (search)).replace(new RegExp((tmpSearchStr), 'gi'), openHighlightTag + '$&' + closeHighlightTag));
                } else {
                    return scope.escapeHTMLChars((text).replace(new RegExp(search, 'gi'), (openHighlightTag) + '$&' + (closeHighlightTag)))

                    //    Reverting escaping highlight tag
                        .replace(new RegExp(scope.escapeHTMLChars(openHighlightTag), 'gi'), (openHighlightTag))
                        .replace(new RegExp(scope.escapeHTMLChars(closeHighlightTag), 'gi'), (closeHighlightTag));
                }
            };

            //Getting search input
            element.on('input', function () {
                scope.caseTypeSearchInput = null;
                scope.caseTypeSearchInput = $(element.find('input')[0]).val();
            });
        }
    };
});

