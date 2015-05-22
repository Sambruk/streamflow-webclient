/*
 *
 * Copyright 2009-2014 Jayway Products AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
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
    restrict:'A',
    require: 'ngModel',
    link: function (scope, element) {
      var $element = $(element);

      function setDateWithoutTriggeringChange(el, date) {
        el.val(date).blur();
      }

      $element.pickadate({
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
        format: 'yyyy-mm-dd',
        min: +1,
        onStart: function () {
          scope.$watch('dueOn', function (value) {
            setDateWithoutTriggeringChange($element, value);
          });
        }
      });
    }
  };
});

