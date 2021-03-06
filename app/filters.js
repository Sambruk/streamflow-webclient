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
    .filter('attachmentJson', function () {
        return function (attachment) {
            var jsonParse = JSON.parse(attachment);
            return jsonParse.name;
        };
    })
    .filter('positive', function () {
        return function (input) {
            return input > 0 ? input : '';
        };
    })
    .filter('shortDate', ['$filter', function ($filter) {
        return function (input) {
            return $filter('date')(input, 'd MMM');
        };
    }])
    .filter('day', ['$filter', function ($filter) {
        return function (input) {
            return $filter('date')(input, 'd');
        };
    }])
    .filter('month', ['$filter', function ($filter) {
        return function (input) {
            return $filter('date')(input, 'MMM');
        };
    }])
    .filter('longDate', ['$filter', function ($filter) {
        return function (input) {
            return $filter('date')(input, 'yyyy-MM-dd');
        };
    }])
    // Date formatting á la Google Mail.
    .filter('googleDate', ['$filter', function ($filter) {
        function isSameDay(date1, date2) {
            return date1.getDate() === date2.getDate() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getFullYear() === date2.getFullYear();
        }

        function isSameYear(date1, date2) {
            return date1.getFullYear() === date2.getFullYear();
        }

        return function (input) {
            var today = new Date();
            var other = new Date(input);

            // Default formatting: same year
            var format = 'd MMM';

            // Change formatting if year differs or if it's the same day.
            if (!isSameYear(today, other)) {
                format = 'yyyy-MM-dd';
            } else if (isSameDay(today, other)) {
                format = 'HH:mm';
            }

            return $filter('date')(input, format);
        };
    }])
    .filter('dateField', ['$filter', function ($filter) {
        return function (input) {
            return $filter('date')(input, 'yyyy-MM-dd');
        };
    }])
    .filter('dateTime', ['$filter', function ($filter) {
        return function (input) {
            return $filter('date')(input, 'yyyy-MM-dd, HH:mm');
        };
    }])
    .filter('translate', ['$filter', function () {
        return function (input) {

            // So far, we keep it simple by just using a lookup table
            var translation = {
                inbox: 'Inkorg',
                assignments: 'Mina ärenden',
                attachment: 'Bifogade filer',
                contact: 'Kontakt',
                conversation: 'Konversation',
                custom: 'Ärendekommentarer',
                form: 'Formulär',
                note: 'Sammanfattning',
                system: 'System',
                systemTrace: 'Systemdetaljer',
                successMessage: 'Hämtning lyckades',
                errorMessage: 'Hämtning misslyckades',
                'read: All': 'Läsa: Alla',
                'write: All': 'Skriva: Alla',
                'read: Project': 'Läsa: Projekt',
                'write: Project': 'Skriva: Projekt',
                'read: Organization': 'Läsa: Organisatorisk enhet',
                'write: Organization': 'Skriva: Organisatorisk enhet',
                'read: Sameoubranch': 'Läsa: Samma organisatoriska gren',
                'write: Sameoubranch': 'Skriva: Samma organisatoriska gren',
                '0 Förfallna': 'Förfallna',
                '1 Förfaller idag': 'Förfaller idag',
                '2 Förfaller imorgon': 'Förfaller imorgon',
                '3 Förfaller inom en vecka': 'Förfaller inom en vecka',
                '4 Förfaller inom en månad': 'Förfaller inom en månad',
                '5 Förfaller om mer än en månad': 'Förfaller om mer än en månad'
            };

            return translation[input] || input;
        };
    }])
    .filter('caseLogFilter', function () {
        return function (logEntries, filterArray) {
            var i, j, matchingItems = [];

            if (logEntries && filterArray) {
                // loop through the items
                for (i = 0; i < logEntries.length; i++) {

                    // for each item, loop through the filter values
                    for (j = 0; j < filterArray.length; j++) {

                        //If the caseLogType is the same as the name of the filter
                        if (logEntries[i].caseLogType === filterArray[j].filterName) {
                            //Check the value of the filter
                            if (filterArray[j].filterValue) {
                                matchingItems.push(logEntries[i]);
                            }
                            break;
                        }
                    }
                }
            }

            return matchingItems;
        };
    })
    .filter('truncate', function () {
        return function (text, length, end) {
            if (isNaN(length)) {
                length = 10;
            }

            if (end === undefined) {
                end = '...';
            }

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length - end.length) + end;
            }

        };
    })
    .filter('parenthesis', function () {
        return function (input) {
            if (input) {
                return '(' + input + ')';
            }
        };
    })
    .filter('slice', function () {
        return function (input, start, end) {
            if (input.slice) {
                if (end) {
                    return input.slice(start, end);
                } else {
                    return input.slice(start);
                }
            } else {
                return input;
            }
        };
    })
    .filter('trustAsHTML', ['$sce', function ($sce) {
        return function (text) {
            var map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                '\'': '&#039;'
            };
            return $sce.trustAsHtml(text.replace(/[&<>"']/g, function (m) {
                return map[m];
            }));
        };
    }])
    .filter('htmlToPlaintext', function () {
        return function (text) {
            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        };
    })
    .filter('removeLineBreaksForHTML', function () {
        return function (text) {
            if (text && /<[^>]+>/.test(text)) {
                return String(text).replace(/\r?\n|\r/gm, '');
            }
            return text;
        };
    });

