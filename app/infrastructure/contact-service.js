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
    .factory('contactService', function (caseService, navigationService, $rootScope, $location) {
        var contact = {
            name: '',
            contactId: '',
            note: '',
            addresses: [{address: '', zipCode: '', city: '', region: '', country: '', contactType: 'HOME'}],
            emailAddresses: [{emailAddress: '', contactType: 'HOME'}],
            phoneNumbers: [{phoneNumber: '', contactType: 'HOME'}],
            contactPreference: 'email'
        };

        var _submitContact = function (caseId, contactIndex) {
            caseService.addContact(caseId, contact).then(function () {
                $rootScope.$broadcast('contact-created');
                var href = navigationService.caseHrefSimple(caseId);
                var hrefWithoutHash = href.slice(1);
                $location.path(hrefWithoutHash + '/contact/' + contactIndex + '/');
            });
        };

        return {
            submitContact: _submitContact
        };
    });
