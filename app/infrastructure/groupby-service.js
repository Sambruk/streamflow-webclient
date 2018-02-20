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

angular.module('sf')
    .factory('groupByService', function () {

        var optionNone = {name: 'Ingen', value: ''};

        var groupingOptions = [
            {name: 'Ärendetyp', value: 'caseTypeText', query: 'caseType'},
            {name: 'Förfallodatum', value: 'checkDueOn', query: 'dueOn'},
            {name: 'Förvärvare', value: 'assignedTo', query: 'assignedTo'},
            {name: 'Funktion', value: 'owner', query: 'project'},
            {name: 'Prioritet', value: 'checkPriority', query: 'priority'}];

        var groupByValue;

        var getGroupingOptions = function () {
            return groupingOptions;
        };

        var getSpecificGroupByDefault = function (selectedGroupItem) {
            if (selectedGroupItem && selectedGroupItem.value === 'checkDueOn') {
                return '-dueOn';
            }
        };

        var groupBy = function (currentCases, originalCurrentCases, selectedGroupItem) {
            var groupCurrentCases = [];
            _.each(currentCases, function (item) {
                if (!selectedGroupItem || selectedGroupItem === optionNone) {
                    currentCases = originalCurrentCases;
                    return;
                }
                switch (selectedGroupItem.value) {
                    case 'caseTypeText':
                        if (!item.caseType) {
                            item.caseTypeText = 'Ingen ärendetyp';
                        } else {
                            item.caseTypeText = item.caseType.text.toLowerCase();
                        }
                        break;
                    case 'assignedTo':
                        if (!item.assignedTo) {
                            item.assignedTo = 'Ingen förvärvare';
                        }
                        break;
                    case 'owner':
                        if (!item.owner) {
                            item.owner = 'Inget projekt';
                        }
                        break;
                    case 'checkDueOn':
                        if (!item.dueOn) {
                            item.checkDueOn = 'Inget förfallodatum';
                        } else {
                            var dueDate = item.checkdueDay();
                            if (dueDate === 0) {
                                item.checkDueOn = '1 Förfaller idag';
                            } else if (dueDate === -1) {
                                item.checkDueOn = '2 Förfaller imorgon';
                            } else if (dueDate > -7 && dueDate < -1) {
                                item.checkDueOn = '3 Förfaller inom en vecka';
                            } else if (dueDate > -31 && dueDate < -7) {
                                item.checkDueOn = '4 Förfaller inom en månad';
                            } else if (dueDate < -31) {
                                item.checkDueOn = '5 Förfaller om mer än en månad';
                            } else if (dueDate > 0) {
                                item.checkDueOn = '0 Förfallna';
                            }
                        }
                        break;
                    case 'checkPriority':
                        if (!item.priority) {
                            item.checkPriority = '_Ingen prioritet';
                        } else {
                            item.checkPriority = item.priority.priority + item.priority.text;
                        }
                        break;
                    default:
                        currentCases = originalCurrentCases;
                }

                if (selectedGroupItem) {
                    groupCurrentCases.push(item);
                }
            });

            if (groupCurrentCases.length) {
                currentCases = groupCurrentCases;
            }
            if (selectedGroupItem && selectedGroupItem !== optionNone) {
                currentCases.grouped = true;
            }

            return currentCases;
        };

        var setGroupByValue = function (value) {
            groupByValue = value;
        };

        var getGroupByValue = function () {
            return groupByValue;
        };

        return {
            groupBy: groupBy,
            getGroupingOptions: getGroupingOptions,
            getSpecificGroupByDefault: getSpecificGroupByDefault,
            setGroupByValue: setGroupByValue,
            getGroupByValue: getGroupByValue
        };
    });
