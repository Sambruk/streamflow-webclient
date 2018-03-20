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

angular.module('sf').directive('sfDatePickerFancy', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            pickerOptions: '&pickerOptions',
            ngModel: '='
        },
        link: {
            post: function (scope, element, ngModel) {
                var $element = $(element);
                var overrides = scope.pickerOptions();

                var defaultOptions = {
                    monthsFull: ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'],
                    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
                    weekdaysFull: ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'],
                    weekdaysShort: ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'],
                    labelMonthNext: 'Nästa månad',
                    labelMonthPrev: 'Föregående månad',
                    labelMonthSelect: 'Välj månad',
                    labelYearSelect: 'Välj år',
                    today: false, //'Idag',
                    clear: false, //'Rensa',
                    close: false, //'Stäng',
                    showMonthsShort: false,
                    showWeekdaysFull: false,
                    selectYears: true,
                    selectMonths: true,
                    firstDay: 1,
                    format: 'yyyy mm dd',
                    formatSubmit: 'yyyy mm dd',
                    min: +1,
                    onStart: function () {
                        //Initial actions
                    },
                    onSet: function (date) {
                        scope.$parent.$apply(function (scope) {
                            console.log('xD', date, scope);
                            var dateLine = moment(date.select).format('YYYY-MM-DD');

                            if (ngModel.ngModel.indexOf('.') > -1) {
                                var model = ngModel.ngModel.split('.');
                                scope[model[0]][model[1]] = dateLine;
                            } else {
                                scope[ngModel.ngModel] = dateLine;
                            }

                        });
                    }
                };
                angular.extend(defaultOptions, overrides);
                $element.pickadate(defaultOptions);
            }
        }
    };
});

