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

angular.module('sf').controller('ProfileEditCtrl', function ($scope, profileService, $rootScope) {
    profileService.getCurrent().promise.then(function (result) {
        $scope.profile = result;

        $rootScope.$broadcast('breadcrumb-updated', [
            {
                title: 'Profile'
            }, {
                title: result[0].name
            }
        ]);
    });

    $scope.messageDeliveryTypes = [
        {id:"none", text:"Ingen"},
        {id:"email", text:"E-post"},
    ];

    $scope.$on('profile-name-updated', function () {
        $scope.profile.invalidate();
        $scope.profile.resolve();
    });

    $scope.changeMessageDeliveryType = function ($event, $success, $error) {
        $event.preventDefault();
        var valueChange = {};
        valueChange[$event.currentTarget.name] = $event.currentTarget.value;

        profileService.changeMessageDeliveryType(valueChange).then(function () {
            $success($($event.target));
        }, function () {
            $error($($event.target));
        });
    };

    $scope.changeMailFooter = function ($event, $success, $error) {
        $event.preventDefault();
        var valueChange = {};
        valueChange[$event.currentTarget.name] = $event.currentTarget.value;

        profileService.changeMailFooter(valueChange).then(function () {
            $success($($event.target));
        }, function () {
            $error($($event.target));
        });
    };

    $scope.updateField = function ($event, $success, $error) {
        $event.preventDefault();
        var profile = {};
        profile[$event.currentTarget.name] = $event.currentTarget.value;

        if ($event.currentTarget.id === 'profile-phone' && !$event.currentTarget.value.match(/^([0-9()\/+ \-]*)$/)) {
            $error($($event.target));
        } else if ($event.currentTarget.id === 'profile-email' && !$event.currentTarget.value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
            $error($($event.target));
        } else {
            profileService.updateCurrent(profile).then(function () {
                if ($event.currentTarget.id === 'profile-name') {
                    $rootScope.$broadcast('profile-name-updated');
                }
                $success($($event.target));
            }, function () {
                $error($($event.target));
            });
        }
    };

    $scope.changeMarkReadTimeout = function ($event, $success, $error) {
        $event.preventDefault();
        var valueChange = {};
        valueChange[$event.currentTarget.name] = $event.currentTarget.value;

        profileService.changeMarkReadTimeout(valueChange).then(function () {
            $success($($event.target));
        }, function () {
            $error($($event.target));
        });
    };

    //TODO fix update animation and clean up this
    $scope.updateFieldManually = function (scope) {
        var valueChange = {};
        valueChange[scope.$select.$element.attr('name')] = scope.$select.selected.id;

        profileService.changeMessageDeliveryType(valueChange).then(function () {
            successCallback(scope.$select.$element);
        }, function () {
            errorCallback(scope.$select.$element);
        });

    };


    var successCallback = function (element) {
        if (element.hasClass('error')) {
            element.removeClass('error');
        }

        // if (element[0].type === 'select-one') {
        element.addClass('saved saved-select');
        // }

        if ($('form div').hasClass('error') || !$('#contact-name').val()) {
            $('#contact-submit-button').attr('disabled', true).addClass('inactive');
        }
        else {
            $('#contact-submit-button').attr('disabled', false).removeClass('inactive');
        }

        element.parent()[0].addEventListener('webkitAnimationEnd', function () {
            element.removeClass('saved').removeClass('saved-select');
        });


        //Talk of removing the saved icon after a while, whis coule be one way.
        //Looked at fading it in and out however you cannot fade the "content" in a :after pseudo element
        //it triggers a remove of the last one and add of a new element and that can not be transitioned
        //setTimeout(removeIt,2000);
        var form = $scope[element.closest('form').attr('name')];

        setPristine(form, element);
        $('[class^=error]', element.parent()).hide();
    };

    var errorCallback = function (element) {
        element.parent().addClass('error');
        $('#contact-submit-button').attr('disabled', true).addClass('inactive');
    };

    var setPristine = function (form, element) {
        if (form.$setPristine) {//only supported from v1.1.x
            form.$setPristine();
        } else {
            form.$dirty = false;
            form.$pristine = true;
            element.$dirty = false;
            element.$pristine = true;
        }
    };
});

