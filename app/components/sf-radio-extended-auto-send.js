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

angular.module('sf').directive('sfRadioExtendedAutoSend', ['$parse', '$routeParams', 'caseService', function ($parse, $params, caseService) {
    return {
        require: 'ngModel',
        scope: true,
        link: function (scope, element, attr) {

            var hasRunAtLeastOnce = false;
            scope.$watch(attr.ngModel, function (newValue) {

                if (hasRunAtLeastOnce) {
                    if (newValue === attr.value) {

                        var isOther = $parse(attr.sfRadioExtendedAutoSend)();
                        var value;

                        if (isOther) {
                            value = $('div input[type=text]', $(element).parent().parent()).val();
                            $(element).val(value);
                        }
                        else {
                            value = newValue;
                        }

                        caseService.updateField($params.caseId, scope.$parent.form[0].draftId, attr.name, value);
                    }
                }

                hasRunAtLeastOnce = true;
            });
        }
    };
}]);

