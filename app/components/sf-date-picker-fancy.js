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

angular.module('sf').directive('sfDatePickerFancy', function (sidebarService, debounce) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            pickerOptions: '&pickerOptions',
            ngModel: "="
        },
        link: {
            post: function (scope, element, ngModel) {
                var $element = $(element);

                console.log('OnLoad',scope);
                var overrides = scope.pickerOptions();
                var picker;


                // function setDateWithoutTriggeringChange(el, date) {
                //     if (date) {
                //         el.val(date).blur();
                //     }
                // }
                //
                function setExpirationDateInPicker(date, picker) {
                    if (date) {
                        // date = new Date(date);
                        console.log('New date', date);
                        picker.set('input', [date.getFullYear(), date.getMonth(), date.getDate()]);
                    }
                }


                function pad(number) {
                    if (number < 10) {
                        return '0' + number;
                    }
                    return number;
                }

                // scope.$watch(function () {
                //     return scope.$parent[ngModel.ngModel];
                // }, function (value) {
                //     console.log('mod111111leasd', value, picker);
                //     // setExpirationDateInPicker(value, picker);
                //     // setDateWithoutTriggeringChange($element, value);
                //
                // });

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
                        //
                        //
                        picker = this;
                        // // scope.$parent.$watch('dueOn', function (value) {
                        // //     console.log('modleasd', value);
                        // //     setExpirationDateInPicker(value, picker);
                        // //     setDateWithoutTriggeringChange($element, value);
                        // // });
                        // // scope.$watch(function(){
                        // //     return scope.$parent[ngModel.ngModel];
                        // //     }, function (value) {
                        // //         console.log('mod111111leasd', value, picker);
                        // //         // setExpirationDateInPicker(value, picker);
                        // //         // setDateWithoutTriggeringChange($element, value);
                        // //
                        // // });
                    },
                    onSet: function (date) {
                        // debounce(function () {
                            scope.$parent.$apply(function (scope) {
                                console.log(date);
                                var formattedDate = new Date(date.select);
                                date = formattedDate.getUTCFullYear() + '-' + pad(formattedDate.getUTCMonth()) + '-' + pad(formattedDate.getUTCDay());

                                if(ngModel.ngModel.indexOf('.')>-1){
                                    var model = ngModel.ngModel.split('.');
                                    scope[model[0]][model[1]] = date;
                                } else {
                                    scope[ngModel.ngModel] = date;
                                }
                                var value = date;

                                // scope.$root.$broadcast('case-edited', scope.caze);
                                // sidebarService.changeDueOn(scope, value);
                                // scope.$root.$broadcast('due-to-changed', date);

                                // setExpirationDateInPicker(formattedDate, picker);
                                // setDateWithoutTriggeringChange($element, value);
                            });
                        // }, 10);

                    }
                };
                $element.pickadate(defaultOptions);
                angular.extend(defaultOptions, overrides);
            }
        }
    };
});

