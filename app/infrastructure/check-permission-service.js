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

angular.module('sf').factory('checkPermissionService', function () {
    var checkPermission = function (scope, permissions, permission, paraPermission) {
        if (_.find(permissions, function (obj) {
                return obj.id === permission;
            })) {
            scope[paraPermission] = true;
        }
        return scope;
    };

    var checkPermissions = function (scope, permissions, permissionsToCheck, paraPermission) {
        // permissions - the returned permissions the user have.
        // permissionsToCheck - the permissions to check against for letting the user do certain actions.
        // paraPermissions - set to true if the user have permission to certain commands/queries.
        // Commands and paraPermission must be sent in the same order

        if (permissionsToCheck.length) {
            permissionsToCheck.forEach(function (permission, index) {
                checkPermission(scope, permissions, permissionsToCheck[index], paraPermission[index]);
            });
        }
        return scope;
    };

    return {
        checkPermissions: checkPermissions
    };
});

