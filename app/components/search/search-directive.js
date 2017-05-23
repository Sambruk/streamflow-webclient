'use strict';

angular.module('sf').directive('search', function ($location, $timeout, searchService, navigationService, groupByService, $rootScope) {
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
                scope.group.order = 'asc';
                scope.sort = {};
                scope.sort.order = 'asc';
                scope.status = '';

                scope.groupingOptions = groupByService.getGroupingOptions();

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

                var matchRegExp = function (query, regExp, callback) {
                    var match;
                    while ((match = regExp.exec(query)) !== null) {
                        if (match.index === regExp.lastIndex) {
                            regExp.lastIndex++;
                        }
                        callback(match);
                    }
                };

                var retrieveQuery = function (query) {
                    var regExp = /(^.*?)((?=\w*:)|(?=group by)|(?=sort by))/i;
                    var match;

                    if ((match = regExp.exec(query)) !== null) {
                        if (match.index === regExp.lastIndex) {
                            regExp.lastIndex++;
                        }
                        var result = match[0];
                        scope.query = result;
                    }
                };

                var retrieveFilter = function (query) {
                    scope.filter = scope.filter || {};

                    matchRegExp(query, /([a-z]+([:]){1}[\S]+)+/gi, function (match) {
                        var result = match[0].split(':');

                        if (result[0] === 'dueOn') {
                            scope.filter.dueOnFrom = moment(result[1].split('-')[0], 'YYYYMMDD').format('YYYY-MM-DD');
                            scope.filter.dueOnTo = moment(result[1].split('-')[1], 'YYYYMMDD').format('YYYY-MM-DD');
                        } else if (result[0] === 'createdOn') {
                            scope.filter.createdOnFrom = moment(result[1].split('-')[0], 'YYYYMMDD').format('YYYY-MM-DD');
                            scope.filter.createdOnTo = moment(result[1].split('-')[1], 'YYYYMMDD').format('YYYY-MM-DD');
                        } else if (result[0] === 'label') {
                            scope.filter.label = scope.filter.label || [];
                            scope.filter.label.push(result[1]);
                        } else if (result[0] === 'status') {
                            scope.filter.status = scope.filter.status || [];
                            scope.filter.status.push(result[1]);
                        } else {
                            scope.filter[result[0]] = result[1];
                        }
                    });
                };

                var retrieveGroup = function (query) {
                    scope.group = scope.group || {};
                    var groupingOptions = groupByService.getGroupingOptions();

                    matchRegExp(query, /(group by[\s]+[\w]+[\s]*[\w]*)/gi, function (match) {
                        var result = match[0].split(' ');

                        var valueObject = _.where(groupingOptions, {query: result[2]});
                        scope.group.value = valueObject[0];
                        scope.group.order = result[3] || 'asc';
                    });
                };

                var retrieveSort = function (query) {
                    scope.sort = scope.sort || {};

                    matchRegExp(query, /(sort by[\s]+[\w]+[\s]*[\w]*)/gi, function (match) {
                        var result = match[0].split(' ');

                        scope.sort.value = result[2];
                        scope.sort.order = result[3] || 'asc';
                    });
                };

                var initFromQueryParams = function () {
                    var query = $location.search().query;
                    retrieveQuery(query);
                    retrieveFilter(query);
                    retrieveGroup(query);
                    retrieveSort(query);
                };
                initFromQueryParams();

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

                var isSet = function (values) {
                    var set = false;
                    _.each(values, function (value) {
                        if (value) {
                            set = true;
                        }
                    });
                    return set;
                };

                var toggleFilterIndicator = function () {
                    if (isSet(scope.filter) || isSet(scope.group.value) || isSet(scope.sort.value)) {
                        $('.main-search .filter-dropdown').addClass('set');
                    } else {
                        $('.main-search .filter-dropdown').removeClass('set');
                    }
                };

                var formatDateField = function (dateValue) {
                    return moment(dateValue).format('YYYYMMDD');
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

                var buildSearchGroupingSorting = function () {
                    scope.queryGroupSorting = '';
                    if (scope.group.value && scope.sort.value) {
                        scope.queryGroupSorting = ' group by ' + scope.group.value.query + ' ' + scope.group.order + ', sort by ' + scope.sort.value + ' ' + scope.sort.order;
                    } else if (scope.group.value) {
                        scope.queryGroupSorting = ' group by ' + scope.group.value.query + ' ' + scope.group.order;
                    } else if (scope.sort.value) {
                        scope.queryGroupSorting = ' sort by ' + scope.sort.value + ' ' + scope.sort.order;
                    }

                };

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

                scope.resetSearchFilter = function () {
                    scope.clearGrouping();
                    scope.clearSorting();
                    scope.filter = undefined;
                };

                scope.clearGrouping = function () {
                    scope.group.value = undefined;
                    scope.group.order = 'asc';
                };

                scope.clearSorting = function () {
                    scope.sort.value = undefined;
                    scope.sort.order = 'asc';
                };

                scope.toggleSearchFilter = function (bool) {
                    if (bool !== undefined) {
                        scope.showSearchFilter = bool;
                    } else {
                        scope.showSearchFilter = !scope.showSearchFilter;
                    }
                };

                var clearBreadCrumb = function () {
                    $rootScope.$broadcast('breadcrumb-updated', [
                        {
                            title: '',
                            url: ''
                        }
                    ]);
                };

                scope.search = function (query) {
                    query = query || '';

                    scope.showSearchFilter = false;

                    if (scope.queryFilter) {
                        query = query + scope.queryFilter;
                    }

                    if (scope.queryGroupSorting) {
                        query = query + scope.queryGroupSorting;
                    }
                    groupByService.setGroupByValue(scope.group.value);

                    // Replace any search term with its proper API equivalent.
                    query = query.replace(/([a-z\xE5\xE4\xF6]+)(?=:)/gi, function (match) {
                        return scope.searchTerms[match] ? scope.searchTerms[match] : match;
                    });

                    $location.search({'query': query});
                    navigationService.linkTo('/search');

                    clearBreadCrumb();
                };
            }
        }
    };
});
