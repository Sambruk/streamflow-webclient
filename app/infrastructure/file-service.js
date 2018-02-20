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
    .factory('fileService', function (Upload) {

        var uploadFiles = function ($files, url) {
            if ($files.length === 1) {
                uploadFile($files[0], url);
            } else {
                $files.forEach(function (file) {
                    uploadFile(file, url);
                });
            }
        };

        var uploadFile = function (file, url) {
            return Upload.upload({
                url: url,
                headers: {'Content-Type': 'multipart/formdata'},
                data: {
                    file: file
                }
            });
        };

        return {
            uploadFiles: uploadFiles,
            uploadFile: uploadFile
        };
    });
