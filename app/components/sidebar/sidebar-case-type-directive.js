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


            scope.swapHTMLChars = function (value) {
          /*      var map = {
                    '<': '&1lt;',
                    '>': '&1gt;',
                    '"': '&1quot;',
                    "'": '&1#039;',
                    '&lt;': '<',
                    '&gt;': '>',
                    '&quot;': '"',
                    '&#039;': "'",
                    '&1lt;': '&lt;',
                    '&1qt;': '&gt;',
                    '&qquot;': '&quot;',
                    '&q#039;': '&#039;'
                };
                return value.replace(/[&<>"']/g, function (m) {
                    return map[m];
                });*/

                value = value

                    .replace(new RegExp('<','g'), '&1lt;')
                    .replace(new RegExp('>','g'), '&1gt;')
                    .replace(new RegExp('";','g'), '&1quot')
                    .replace(new RegExp("'",'g'), '&1#039;')

                    .replace(new RegExp('&lt;','g'), "<")
                    .replace(new RegExp('&gt;','g'), ">")
                    .replace(new RegExp('&quot;','g'), '"')
                    .replace(new RegExp('&#039;','g'), "'")


                    .replace(new RegExp('&1lt;','g'), '&lt;')
                    .replace(new RegExp('&1gt;','g'), '&gt;')
                    .replace(new RegExp('&1quot;','g'), '&quot;')
                    .replace(new RegExp('&1#039;','g'), '&#039;');
                return value;
            };


            //Not the best implementation too many regex and as result too heavy
            scope.highlight = function (text, search) {
                if (!search) {
                    return scope.escapeHTMLChars(text);
                }

                var htmlChars = ['&', '<', '>', '"', "'"];

                var openHighlightTag = '<span class="ui-select-highlight">';
                var closeHighlightTag = '</span>';

                if (htmlChars.some(function (v) {
                        return search.indexOf(v) >= 0;
                    })) {
                    var tmpSearchStr = scope.escapeHTMLChars(search);
                    return (scope.escapeHTMLChars(text).replace(new RegExp((search), 'gi'), scope.escapeHTMLChars(search)).replace(new RegExp((tmpSearchStr), 'gi'), openHighlightTag  +'$&' + closeHighlightTag));
                } else {

                    //Possible html chars
                    var escapedHtmlChars = ['l', 't', 'g', 'q', 'u', 'o', '"', "'"];
                    if (search.length == 1 && escapedHtmlChars.some(function (v) {
                            return search.indexOf(v) >= 0;
                        })) {

                        return  scope.swapHTMLChars((text).replace(new RegExp((search), 'gi'), scope.escapeHTMLChars(openHighlightTag) + '$&' + scope.escapeHTMLChars(closeHighlightTag )));


                        //TODO: Remove after full implementationSome tmp regex ant testing stuff
                        //(?!&.*)t(?!.*;)
                        //(?![&])t(?![.*";])
                        //&[^;]+;

                        // return  (scope.escapeHTMLChars(text).replace(new RegExp(scope.escapeHTMLChars(search), 'gi'), (part1) + '$&' + (part2)));

                        // return  ((text).replace(new RegExp((search), 'gi'), scope.escapeHTMLChars("$`") +(part1) + '$&' + (part2) ));

                        // return  ((text).replace(new RegExp((search), 'gi'), scope.escapeHTMLChars(part1) + '$&' + scope.escapeHTMLChars(part2) ));
                        // console.log( scope.escapeHTMLChars(text));
                        // return  (scope.escapeHTMLChars(text).replace(new RegExp('(?!.*;)' + search +'(?![.*;])', 'gi'), (part1) + '$&' + (part2) ));
                        // return  (scope.escapeHTMLChars(text).replace(new RegExp('(?!&+)' + search +'(?!.+;)', 'gi'), (part1) + '$&' + (part2) ));
                        // return  (scope.escapeHTMLChars(text).replace(new RegExp('(?![&])' + search +'(?![.*";])', 'gi'), (part1) + '$&' + (part2) ));
                    }
                    else {
                        return (scope.escapeHTMLChars(text).replace(new RegExp((search), 'gi'), openHighlightTag  +'$&' + closeHighlightTag));
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

