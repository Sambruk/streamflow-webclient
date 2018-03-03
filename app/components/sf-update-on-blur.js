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

angular.module('sf').directive('sfUpdateOnBlur', function ($parse, $rootScope) {
    return function (scope, element, attr) {
        if(attr.$$element.hasClass('select2')){
            // element = element.find('input[type=hidden]');
            // element = $('#internal-value1');



            // element.append('<input type="hidden" value="'+scope.$parent[attr.ngModel]+'">');


            // attr.$$element= element;
            console.log('test',scope, element, attr);
            console.log('test12',scope, element.val(), attr);

            // scope = scope.$parent;
        }
        // var fn = $parse(attr.$$element.sfUpdateOnBlur);


        // scope.$watch(attr.length, function(newVal, oldVal) {
        //     // console.log('123');
        //     if (newVal!==oldVal) element[0].blur();
        // });

        var fn = $parse(attr.sfUpdateOnBlur);
        // console.log(fn);
        var form = scope[element.closest('form').attr('name')];

        var setPristine = function (form, element) {
            if (form.$setPristine) {//only supported from v1.1.x
                form.$setPristine();
            } else {
                form.$dirty = false;
                form.$pristine = true;
                element.$dirty = false;
                element.$pristine = true;
                if (attr.$$element.hasClass('select2')) {
                    var innerInput = element.find('input[type=hidden]');
                    innerInput.$dirty = false;
                    innerInput.$pristine = true;
                }
            }
        };

        var successCallback = function (element) {

            console.log('ss');
            if (element.parent().hasClass('error')) {
                element.parent().removeClass('error');
            }

            if (element[0].type === 'select-one') {
                element.parent().addClass('saved saved-select');
            } else {
                if (element[0].id === 'contact-name' && !$('#contact-name').val()) {
                    $('#contact-name').parent().addClass('error');
                } else {
                    element.parent().addClass('saved');
                }
            }

            if ($('form div').hasClass('error') || !$('#contact-name').val()) {
                $('#contact-submit-button').attr('disabled', true).addClass('inactive');
            }
            else {
                $('#contact-submit-button').attr('disabled', false).removeClass('inactive');
            }

            element.parent()[0].addEventListener('webkitAnimationEnd', function () {
                element.parent().removeClass('saved').removeClass('saved-select');
            });


            //Talk of removing the saved icon after a while, whis coule be one way.
            //Looked at fading it in and out however you cannot fade the "content" in a :after pseudo element
            //it triggers a remove of the last one and add of a new element and that can not be transitioned
            //setTimeout(removeIt,2000);

            setPristine(form, element);
            $('[class^=error]', element.parent()).hide();
        };

        var errorCallback = function (element) {
            element.parent().addClass('error');
            $('#contact-submit-button').attr('disabled', true).addClass('inactive');
        };

        element.bind('blur', function (event) {
            if(attr.$$element.hasClass('select2')){
                element = element.find('input[type=hidden]');
                // element = $('#internal-value1');
                scope.$apply(function () {
                    fn(scope, {$event: event, $success: successCallback, $error: errorCallback});
                });


                // // element.append('<input type="hidden" value="'+scope.$parent[attr.ngModel]+'">');
                //
                //
                // // attr.$$element= element;
                // console.log('test',scope, element, attr);
                // console.log('test12',scope, element.val(), attr);

                // scope = scope.$parent;
            } else {
                if (!element.hasClass('ng-invalid') && element.hasClass('ng-dirty')) {
                    //
                    // if (attr.$$element.hasClass('select2')) {
                    //         fn(scope, {$event: event, $success: successCallback, $error: errorCallback});
                    // }

                    scope.$apply(function () {
                        fn(scope, {$event: event, $success: successCallback, $error: errorCallback});
                    });
                }
                else {
                    _.each(element.attr('class').split(' '), function (klass) {
                        var errorClass = '.error-' + klass;
                        $(errorClass, element.parent()).show();
                    });
                }
            }
        });

        $('select').change(function () {
            console.log('trigger', this);
            $(this).parent().removeClass('saved');
            $(this).parent().removeClass('saved-select');
            $('[class^=error]', $(this).parent()).hide();
        });

        console.log(element);
        if (element[0].type === 'text' || element[0].type === 'textarea') {
            var resetFieldState = function () {
                $(this).parent().removeClass('saved');
                $('[class^=error]', $(this).parent()).hide();
            };

            var options = {
                callback: resetFieldState,
                wait: 0,
                highlight: false,
                captureLength: 1
            };

            element.typeWatch(options);
        }
    };
});
