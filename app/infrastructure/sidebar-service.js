/*
 *
 * Copyright
 * 2009-2015 Jayway Products AB
 * 2016-2018 Föreningen Sambruk
 *
 * Licensed under AGPL, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.gnu.org/licenses/agpl.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

angular.module('sf').factory('sidebarService', function ($routeParams, $route, caseService, searchService, $q, $rootScope, $location, navigationService, tokenService, checkPermissionService) {

    var sortByText = function (x, y) {
        var xS = x.text && x.text.toUpperCase() || '',
            yS = y.text && y.text.toUpperCase() || '';
        if (xS > yS) {
            return 1;
        } else if (xS < yS) {
            return -1;
        } else {
            return 0;
        }
    };

    var _updateObject = function (itemToUpdate) {
        itemToUpdate.invalidate();
        itemToUpdate.resolve();
    };

    var _updateCaseLabels = function (scope) {
        if (!scope.caseLabel) {
            scope.caseLabel = caseService.getCaseLabel($routeParams.caseId);

        } else {
            _updateObject(scope.caseLabel);
        }

        if (!scope.possibleCaseLabels) {
            scope.possibleCaseLabels = caseService.getPossibleCaseLabels($routeParams.caseId);
        } else {
            _updateObject(scope.possibleCaseLabels);
        }

        $q.all([
            scope.caseLabel.promise,
            scope.possibleCaseLabels.promise
        ]).then(function (results) {
            checkPermissionService.checkPermissions(scope, scope.caseLabel.commands, ['addlabel'], ['canAddLabel']);
            scope.activeLabels = results[0].map(function (i) {
                i.selected = true;
                return i;
            });

            scope.allCaseLabels = scope.activeLabels.concat(results[1].map(function (i) {
                i.selected = false;
                return i;
            })).sort(sortByText);

            scope.previousActiveLabels = scope.activeLabels;

            scope.$root.$broadcast('labels-changed', results[0]);
        });
    };

    var _updateToolbar = function (scope) {
        if (scope.commands) {
            _updateObject(scope.commands);
        } else {
            scope.commands = caseService.getSelectedCommands($routeParams.caseId);
        }

        scope.commands.promise.then(function (response) {
            var commandMap = {
                'sendto': 'canSendTo',
                'resolve': 'canResolve',
                'close': 'canClose',
                'reopen': 'canReopen',
                'delete': 'canDelete',
                'assign': 'canAssign',
                'unassign': 'canUnassign',
                'restrict': 'canRestrict',
                'requirecasetype': 'caseRequireCaseType',
                'unrestrict': 'canUnrestrict',
                'markunread': 'canMarkUnread',
                'markread': 'canMarkRead',
                'formonclose': 'canCloseWithForm'
            };

            var hasCommand = function (commandName) {
                return !!_.find(response, function (command) {
                    return command.rel === commandName;
                });
            };

            for (var commandName in commandMap) {
                if (commandMap.hasOwnProperty(commandName)) {
                    scope[commandMap[commandName]] = hasCommand(commandName);
                }
            }
        });
    };

    var _checkPossibleForms = function (scope) {
        if (!scope.possibleForms) {
            return;
        }
        if (scope.possibleForms.length > 0) {
            scope.possibleForms.forEach(function (form) {
                caseService.getPossibleForm($routeParams.caseId, form.id).promise.then(function (response) {
                    // Making the assumption that the user is 'read-only' if he hasn't access to queries or commands
                    if (response[0].commands.length || response[0].queries.length) {
                        scope.canCreateFormDraft = true;
                    }
                });
            });
        }
    };

    var _changePriorityLevel = function (scope, priorityId) {
        if (priorityId === '-1') {
            priorityId = '';
        }

        caseService.changePriorityLevel($routeParams.caseId, priorityId).then(function () {
            if (scope.priorityColor[priorityId]) {
                scope.activePriorityColor = {
                    'background-color': scope.priorityColor[priorityId]
                };
            } else {
                scope.activePriorityColor = {
                    'background-color': '#ffffff'
                };
            }
        });
    };

    var _changeCaseType = function (scope, casetype) {
        caseService.changeCaseType($routeParams.caseId, casetype).then(function () {
            if (!scope.possibleForms) {
                scope.possibleForms = caseService.getSelectedPossibleForms($routeParams.caseId);
            } else {
                _updateObject(scope.possibleForms);
            }

            if (!scope.possiblePriorities) {
                scope.possiblePriorities = caseService.getPossiblePriorities($routeParams.caseId);
            } else {
                _updateObject(scope.possiblePriorities);
            }

            scope.possibleForms.promise.then(function () {
                _checkPossibleForms(scope);

                if (scope.possibleForms.length === 0) {
                    // Check if the current route contains formdraft to redirect to "case main page"
                    var checkRoute = new RegExp('formdrafts').test($location.path());
                    if (checkRoute === true) {
                        var href = navigationService.caseHrefSimple($routeParams.caseId);
                        window.location.replace(href);
                    }
                }
            });

            //Getting avaliable labels
            var possibleCaseLabels = caseService.getPossibleCaseLabels($routeParams.caseId);

            //Getting result after executing of promise
            $q.all([
                possibleCaseLabels.promise,
                scope.possibleCaseTypes.promise
            ]).then(function (results) {
                var possibleCaseLabels = results[0];
                var caseTypes = results[1];


                if (!$.isEmptyObject(possibleCaseLabels)) {
                    if (!$.isEmptyObject(scope.caseTypeSearchInput)) {
                        var currentCase = caseTypes.filter(function (e) {
                            return e.id === casetype;
                        });

                        //Removing square braces
                        var caseLabels = currentCase[0].labels.slice(2, -2).split(' ');

                        var finalCaseLabels = $.grep(caseLabels, function (e) {
                            return e.toLowerCase().indexOf(scope.caseTypeSearchInput.toLowerCase()) !== -1;
                        });

                        finalCaseLabels = possibleCaseLabels.filter(function (e) {
                            return finalCaseLabels.indexOf(e.text) > -1;

                        });


                        finalCaseLabels.reduce(function (p, val) {
                            return p.then(function () {
                                return caseService.addCaseLabel($routeParams.caseId, val.id);
                            });
                        }, $q.when(true)).then(function () {
                            $rootScope.$broadcast('case-type-changed');
                        });

                        scope.caseTypeSearchInput = null;
                    }
                }
            });
            scope.caseLabel = caseService.getCaseLabel($routeParams.caseId);
            scope.possibleCaseLabels = caseService.getPossibleCaseLabels($routeParams.caseId);
            _updateObject(scope.possibleResolutions);

            $rootScope.$broadcast('case-type-changed');

            _updateCaseLabels(scope);
            _updateToolbar(scope);

            scope.$root.$broadcast('type-changed', scope.caseType);
        });
    };

    var _removeCaseType = function () {
        caseService.removeCaseType($routeParams.caseId).then(function () {
            $route.reload();
        });
    };

    var _sendTo = function (scope) {
        scope.possibleSendTo.promise.then(function (response) {
            scope.sendToRecipients = response;
            if (response[0]) {
                scope.showSendTo = true;
                scope.show = true;
                scope.sendToId = response[0] && response[0].id;
            }
            scope.commandView = 'sendToView';
        });
    };


    var _onChangeParentButtonClicked = function (scope) {
        var parentCaseId = scope.parentCase.parentCaseId;
        if (scope.caze[0].caseId !== parentCaseId) {
            caseService.changeParent(scope.caze[0].id, parentCaseId, function () {
                _updateObject(scope.parent);
                scope.showChangeParent = false;
            });
        }
    };

    var _onAssignSubCaseButtonClicked = function (scope) {
        var subCaseId = scope.subCase.subCaseId;
        if (scope.caze[0].id !== subCaseId) {
            caseService.changeParent(subCaseId, scope.caze[0].id, function () {
                _updateObject(scope.subCases);
                scope.showAssignSubCase = false;
            });
        }
    };

    var _onSendToButtonClicked = function (scope) {
        var sendToId = scope.sendToId;

        caseService.sendCaseTo($routeParams.caseId, sendToId, function () {
            var href = navigationService.caseListHrefFromCase(scope.caze);
            var projectId = scope.caze[0].owner;
            var projectType = scope.caze[0].listType;

            scope.show = false;
            scope.caze.invalidate();
            scope.caze.resolve().then(function () {
                $rootScope.$broadcast('case-changed');
                $rootScope.$broadcast('case-owner-changed');

                $rootScope.$broadcast('breadcrumb-updated', [{
                    title: projectId
                }, {
                    title: projectType,
                    url: '#/projects/' + projectId + '/' + projectType
                }]);

                window.location.replace(href);
            });
        });
    };

    var _assignTo = function (scope) {
        scope.possibleAssignees.promise.then(function (response) {
            scope.assignToRecipients = response;
            if (response[0]) {
                scope.show = true;
                scope.showAssignTo = true;
                scope.assignToId = response[0] && response[0].id;
            }
            scope.commandView = 'assignToView';
        });
    };

    var _onAssignToButtonClicked = function (scope) {
        var assignToId = scope.assignToId;
        caseService.assignToCase($routeParams.caseId, assignToId, function () {
            $rootScope.$broadcast('case-assigned');
            _updateToolbar(scope);

            var href = navigationService.caseListHrefFromCase(scope.caze);
            window.location.replace(href);
        });
    };

    var _unrestrict = function (scope) {
        caseService.unrestrictCase($routeParams.caseId).then(function () {
            scope.permissions.invalidate();
            scope.permissions.resolve().then(function () {
                $rootScope.$broadcast('case-unrestricted');
                _updateToolbar(scope);
            });
        });
    };

    var _restrict = function (scope) {
        caseService.restrictCase($routeParams.caseId).then(function () {
            scope.permissions.invalidate();
            scope.permissions.resolve().then(function () {
                $rootScope.$broadcast('case-restricted');
                _updateToolbar(scope);
            });
        });
    };
    // End Restrict / Unrestrict

    // Mark Read / Unread
    var _markReadUnread = function (scope, read) {
        var markFunction = read ? caseService.markRead : caseService.markUnread;

        markFunction($routeParams.caseId).then(function () {
            scope.commands.resolve().then(function () {
                _updateToolbar(scope);
            });
        });
    };
    // End Mark Read / Unread

    // Close
    var _caseClosed = function (scope) {
        $rootScope.$broadcast('case-closed');
        var href = navigationService.caseListHrefFromCase(scope.caze);
        // To do this or do invalidate/resolve on everything in case.
        window.location.reload();
        window.location.replace(href);
    };

    var _close = function (scope) {
        if (scope.caseType === null) {
            scope.commandView = 'requiredCaseType';
            scope.show = true;
        } else {
            if (!scope.canCloseWithForm) {
                caseService.closeCase($routeParams.caseId).then(function () {
                    _caseClosed(scope);
                });
            } else {
                _caseClosed(scope);
            }
        }
    };
    // End Close

    // Delete
    var _deleteCase = function (scope) {
        caseService.deleteCase($routeParams.caseId).then(function () {
            $rootScope.$broadcast('case-deleted');
            var href = navigationService.caseListHrefFromCase(scope.caze);
            window.location.replace(href);
        });
    };
    // End Delete

    // Assign / Unassign
    var _assign = function (scope) {
        caseService.assignCase($routeParams.caseId).then(function () {
            $rootScope.$broadcast('case-assigned');
            _updateToolbar(scope);

            var href = navigationService.caseListHrefFromCase(scope.caze);
            window.location.replace(href);
        });
    };

    var _unassign = function (scope) {
        caseService.unassignCase($routeParams.caseId).then(function () {
            $rootScope.$broadcast('case-unassigned');

            _updateToolbar(scope);
            var href = navigationService.caseListHrefFromCase(scope.caze);
            window.location.replace(href);
        });
    };

    var _reopen = function () {
        caseService.reopenCase($routeParams.caseId).then(function () {
            // To do this or do invalidate/resolve on everything in case
            window.location.reload();
        });
    };

    var _downloadAttachment = function (scope, attachment) {
        // Hack to replace dummy user and pass with authentication from token.
        // This is normally sent by httpF headers in ajax but not possible here.
        var apiUrl = scope.apiUrl.replace(/https:\/\/(.*)@/, function () {
            var userPass = window.atob(tokenService.getToken());
            return 'https://' + userPass + '@';
        });

        var url = apiUrl + '/cases/' + $routeParams.caseId + '/attachments/' + attachment.href + 'download';
        window.location.replace(url);
    };

    var _deleteAttachment = function (scope, attachment) {
        caseService.deleteAttachment($routeParams.caseId, attachment.id).then(function () {
            _updateObject(scope.attachments);
        });
    };
    // End Attachments

    var _changeCaseLabels = function (scope, labels) {
        var removedLabels = scope.previousActiveLabels.filter(function (item) {
            return !_.find(labels, function (j) {
                return item.id === j.id;
            });
        });

        if (removedLabels.length > 0) {
            var removePromises = removedLabels.map(function (label) {
                return caseService.deleteCaseLabel($routeParams.caseId, label.id);
            });

            $q.all(removePromises).then(function () {
                _updateCaseLabels(scope);
            });
        } else {
            var addPromises = labels.map(function (label) {
                return caseService.addCaseLabel($routeParams.caseId, label.id);
            });

            $q.all(addPromises).then(function () {
                _updateCaseLabels(scope);
            });
        }

        scope.caseTypeSearchInput = null;
        scope.previousActiveLabels = labels;
    };

    var _changeDueOn = function (scope, date) {
        var isoString = (new Date(date + 'T00:00:00.000Z')).toISOString();
        if (scope.canChange) {
            caseService.changeDueOn($routeParams.caseId, isoString).then(function () {
                scope.general.invalidate();
                scope.general.resolve().then(function (result) {
                    scope.dueOn = result[0].dueOnShort;
                });
            });
        }
    };

    var _onResolveButtonClicked = function (scope) {
        var resolutionId = scope.resolution;

        caseService.resolveCase($routeParams.caseId, resolutionId, function () {
            $rootScope.$broadcast('case-resolved');
            var href = navigationService.caseListHrefFromCase(scope.caze);
            window.location.replace(href);
        });
    };

    var _resolveCase = function (scope) {
        scope.possibleResolutions.promise.then(function (response) {
            scope.resolution = response[0].id;
            scope.show = true;
            scope.commandView = 'resolve';
        });
    };

    var _caseType = function (scope) {
        $q.all([
            scope.possibleCaseTypes.promise,
            scope.caze.promise
        ]).then(function (results) {
            scope.caseType = results[1][0].caseType && results[1][0].caseType.id;
            scope.possibleCaseTypes = results[0].sort(sortByText);
            _.each(scope.possibleCaseTypes, function (caseType) {
                caseType.labels = caseType.classes ? ' [' + caseType.classes.trim() + '] ' : '';
            });
        });
    };

    var _priority = function (scope) {
        $q.all([
            scope.general.promise,
            scope.possiblePriorities.promise
        ]).then(function (responses) {
            responses[1].forEach(function (item) {
                if (item.color !== null) {
                    var intColor = parseInt(item.color, 10);

                    if (intColor < 0) {
                        intColor = 0xFFFFFFFF + intColor + 1;
                    }
                    scope.priorityColor[item.id] = '#' + intColor.toString(16).slice(2, 8);
                } else {
                    scope.priorityColor[item.id] = '#ffffff';
                }

                scope.priority = responses[0][0].priority && responses[0][0].priority.id;
                if (scope.priorityColor[scope.priority]) {
                    scope.activePriorityColor = {
                        'background-color': scope.priorityColor[scope.priority]
                    };
                }
            });

        });
    };

    var _search = function (query) {
        query = query || '';
        // Translation map. Should use i18n for this.
        var searchTerms = {
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

        query = query.replace(/([a-z\xE5\xE4\xF6]+)(?=:)/gi, function (match) {
            return searchTerms[match] ? searchTerms[match] : match;
        });

        return searchService.getCases(query + '+limit+' + 10 + '+offset+' + 0).promise;
    };



    var _openForm = function (scope, formId, isNewWindow, isEmpty) {
        if (isNewWindow) {
            var height = $(window).height();
            var width = $(window).width();
            var url = '#/cases/' + scope.caze[0].id + (isEmpty ? '/formdrafts/' : '/formhistory/') + formId + '?isFormWindow=true&showForm=true';
            var popupWindow = window.open(url, 'FormWindow_' + Math.random(), 'height=' + height * 0.97 + ', width=' + width / 2.17 + ', left=' + width * 0.33 + ', scrollbars=yes');
            if (window.focus) {
                popupWindow.focus();
            }
            _updateToolbar(scope);
        } else {
            //Ugly bu the only way when second opening same form to send data
            $location.path('/cases/' + scope.caze[0].id + '/formdrafts/' + formId);
            location.reload();
        }
    };

    return {
        changePriorityLevel: _changePriorityLevel,
        changeCaseType: _changeCaseType,
        removeCaseType: _removeCaseType,
        updateCaseLabels: _updateCaseLabels,
        updateToolbar: _updateToolbar,
        sendTo: _sendTo,
        onSendToButtonClicked: _onSendToButtonClicked,
        onChangeParentButtonClicked: _onChangeParentButtonClicked,
        onAssignSubCaseButtonClicked: _onAssignSubCaseButtonClicked,
        assignTo: _assignTo,
        onAssignToButtonClicked: _onAssignToButtonClicked,
        unrestrict: _unrestrict,
        restrict: _restrict,
        markReadUnread: _markReadUnread,
        close: _close,
        reopen: _reopen,
        deleteCase: _deleteCase,
        assign: _assign,
        unassign: _unassign,
        downloadAttachment: _downloadAttachment,
        deleteAttachment: _deleteAttachment,
        changeCaseLabels: _changeCaseLabels,
        changeDueOn: _changeDueOn,
        onResolveButtonClicked: _onResolveButtonClicked,
        resolveCase: _resolveCase,
        caseType: _caseType,
        priority: _priority,
        checkPossibleForms: _checkPossibleForms,
        openForm: _openForm,
        search: _search
    };
});

