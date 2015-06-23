'use strict';

angular.module('sf').directive('search', function ($location, $timeout, searchService, navigationService) {
  return {
    restrict: 'E',
    templateUrl: 'components/search/search.html',
    link: {
      pre: function (scope) {
        scope.datePickerOptions = {
          today: 'Idag',
          clear: 'Rensa',
          close: 'Stäng',
          min: undefined
        };
      },
      post: function (scope) {
        console.log(scope.datePickerOptions);
        searchService.getPossibleAssignees().promise.then(function (assignees) {
          scope.possibleAssignees = assignees;
        });

        searchService.getPossibleCreatedBy().promise.then(function (createdBy) {
          scope.possibleCreatedBy = createdBy;
        });

        searchService.getPossibleCaseTypes().promise.then(function (caseTypes) {
          scope.possibleCaseTypes = caseTypes;
        });

        searchService.getPossibleLabels().promise.then(function (labels) {
          scope.possibleLabels = labels;
        });

        searchService.getPossibleProjects().promise.then(function (projects) {
          scope.possibleProjects = projects;
        });

        searchService.getPossibleStatus().promise.then(function (status) {
          scope.possibleStatus = status;
        });

        scope.queryFilter;
        scope.showSearchFilter = false;
        scope.possibleLabels = [];
        scope.group = {};
        scope.group.order = "asc";
        scope.sort = {};
        scope.sort.order = "asc";

        // Translation map. Should use i18n for this.
        scope.searchTerms = {
          'skapad': 'createdOn', // +1
          'ärendetyp': 'caseType',
          'projekt': 'project',
          'etikett': 'label',
          'tilldelad': 'assignedTo',
          'namn': 'name',
          'kontaktid': 'contactId',
          'telefon': 'phoneNumber',
          'email': 'emailAddress',
          'skapadav': 'createdBy'
        };

        /*
         var initFromQueryParams = function () {
         scope.filter = parseSearchQuery($location.search().query);
         };

         var parseSearchQuery = function (query) {
         var result = {};
         query.split(' ').forEach(function(part) {
         var item = part.split(/([a-z\xE5\xE4\xF6]+)(?=:)/gi);
         result[item[0]] = decodeURIComponent(item[1]);
         });
         debugger
         return result;
         };

         initFromQueryParams();
         */

        scope.$watch('filter.dueOnFrom', function () {
          if (!scope.filter || !scope.filter.dueOnFrom) {
            return;
          } else if (!scope.filter.dueOnTo) {
            scope.filter.dueOnTo = scope.filter.dueOnFrom;
            return;
          }
        });

        scope.$watch('filter.dueOnTo', function () {
          if (!scope.filter || !scope.filter.dueOnTo) {
            return;
          } else if (!scope.filter.dueOnFrom) {
            scope.filter.dueOnFrom = scope.filter.dueOnTo;
            return;
          }
        });

        scope.$watch('filter.createdOnFrom', function () {
          if (!scope.filter || !scope.filter.createdOnFrom) {
            return;
          } else if (!scope.filter.createdOnTo) {
            scope.filter.createdOnTo = scope.filter.createdOnFrom;
            return;
          }
        });

        scope.$watch('filter.createdOnTo', function () {
          if (!scope.filter || !scope.filter.createdOnTo) {
            return;
          } else if (!scope.filter.createdOnFrom) {
            scope.filter.createdOnFrom = scope.filter.createdOnTo;
            return;
          }
        });

        scope.$watch('filter', function () {
          toggleFilterIndicator();
          buildSearchFilter();
        }, true);

        scope.$watch('group', function () {
          toggleFilterIndicator();
          buildSearchGroupingSorting();
        }, true);

        scope.$watch('sort', function () {
          toggleFilterIndicator();
          buildSearchGroupingSorting();
        }, true);

        scope.labelsChanged = function (labels) {
          scope.filter = scope.filter || {};
          scope.filter.label = labels;
        };

        var toggleFilterIndicator = function () {
          if (isSet(scope.filter) || isSet(scope.group.value) || isSet(scope.sort.value)) {
            $('.main-search .filter-dropdown').addClass('set');
          } else {
            $('.main-search .filter-dropdown').removeClass('set');
          }
        };

        scope.resetSearchFilter = function () {
          scope.filter = undefined;
          scope.group.value = undefined;
          scope.group.order = "asc";
          scope.sort.value = undefined;
          scope.sort.order = "asc";
        };

        var isSet = function (values) {
          var set = false;
          _.each(values, function (value) {
            if (value) {
              set = true;
            }
          });
          return set;
        };

        var buildSearchFilter = function () {
          prepareCreatedOn();
          prepareDueOn();
          scope.queryFilter = '';
          _.each(scope.filter, function (value, key) {
            if (value) {
              if (value.constructor === Array) {
                _.each(value, function (item) {
                  scope.queryFilter += ' ' + key + ':' + item;
                });
              } else {
                if (_.indexOf(['createdOnFrom', 'createdOnTo', 'dueOnFrom', 'dueOnTo'], key) < 0) {
                  scope.queryFilter += ' ' + key + ':' + value;
                }
              }
            }
          });
        };

        var prepareCreatedOn = function () {
          if (scope.filter && (scope.filter.createdOnFrom || scope.filter.createdOnTo)) {
            scope.filter.createdOn = formatDateField(scope.filter.createdOnFrom) + '-' + formatDateField(scope.filter.createdOnTo);
          }
        };

        var prepareDueOn = function () {
          if (scope.filter && (scope.filter.dueOnFrom || scope.filter.dueOnTo)) {
            scope.filter.dueOn = formatDateField(scope.filter.dueOnFrom) + '-' + formatDateField(scope.filter.dueOnTo);
          }
        };

        var formatDateField = function (dateValue) {
          return moment(dateValue).format('YYYYMMDD');
        };

        var buildSearchGroupingSorting = function () {
          scope.queryGroupSorting = '';
          if (scope.group.value && scope.sort.value) {
            scope.queryGroupSorting = ' order by ' + scope.group.value + ' ' + scope.group.order + ', ' + scope.sort.value + ' ' + scope.sort.order;
          } else if (scope.group.value) {
            scope.queryGroupSorting = ' order by ' + scope.group.value + ' ' + scope.group.order;
          } else if (scope.sort.value) {
            scope.queryGroupSorting = ' order by ' + scope.sort.value + ' ' + scope.sort.order;
          }

        };

        scope.toggleSearchFilter = function (bool) {
          if (bool !== undefined) {
            scope.showSearchFilter = bool;
          } else {
            scope.showSearchFilter = !scope.showSearchFilter;
          }
        };

        scope.search = function (query) {
          query = query || '*';

          scope.showSearchFilter = false;

          if (scope.queryFilter) {
            query = query + scope.queryFilter;
          }

          if (scope.queryGroupSorting) {
            query = query + scope.queryGroupSorting;
          }

          // Replace any search term with its proper API equivalent.
          query = query.replace(/([a-z\xE5\xE4\xF6]+)(?=:)/gi, function (match) {
            return scope.searchTerms[match] ? scope.searchTerms[match] : match;
          });

          $location.search({'query': query});
          navigationService.linkTo('/search');
        };
      }
    }
  };
});
