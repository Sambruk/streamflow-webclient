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
                    "'": '&#039;'
                };
                return value.replace(/[&<>"']/g, function (m) {
                    return map[m];
                });
            };
            scope.escapeReverseHTMLChars = function (value) {
                value = value.replace(new RegExp('&lt;','g'), "<")
                    .replace(new RegExp('&gt;','g'), ">")
                    .replace(new RegExp('&quot;','g'), '"')
                    .replace(new RegExp('&#039;','g'), "'");
                return value;
            };

            //TODO: Bug: Entering 'g' can show empty element at select
            scope.highlight = function (text, search) {
                if (!search) {
                    return scope.escapeHTMLChars(text);
                }

                var htmlChars = ['&', '<', '>', '"', "'"];

                if (htmlChars.some(function (v) {
                        return search.indexOf(v) >= 0;
                    })) {
                    var tmpSearchStr = scope.escapeHTMLChars(search);
                    return (scope.escapeHTMLChars(text).replace(new RegExp((search), 'gi'), scope.escapeHTMLChars(search)).replace(new RegExp((tmpSearchStr), 'gi'), '<span class="ui-select-highlight">$&</span>'));
                } else {

                    //Possible html chars
                    var escapedHtmlChars = ['l', 't', 'g', 'q', 'u', 'o', 't', '"', "'"];
                    if (search.length == 1 && escapedHtmlChars.some(function (v) {
                            return search.indexOf(v) >= 0;
                        })) {
                        return scope.escapeReverseHTMLChars((text).replace(new RegExp((search), 'gi'), '&lt;span class="ui-select-highlight"&gt;$&&lt;/span&gt;'));
                    }
                    else {
                        return (scope.escapeHTMLChars(text).replace(new RegExp((search), 'gi'), '<span class="ui-select-highlight">$&</span>'));
                    }
                }
            };

            //Getting search input
            element.on("input", function () {
                scope.caseTypeSearchInput = null;
                scope.caseTypeSearchInput = $(element.find('input')[0]).val();
            });
        }
    };
});

