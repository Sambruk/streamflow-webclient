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
// Karma configuration
require('phantomjs-polyfill');
module.exports = function(config){
  config.set({

    basePath : '',

    files : [
      'bower_components/ng-file-upload/angular-file-upload-shim.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-growl-v2/build/angular-growl.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/ng-file-upload/angular-file-upload.js',
      'bower_components/underscore/underscore-min.js',
      'bower_components/angular-filter/dist/angular-filter.js',
      'bower_components/angular-chosen-localytics/chosen.js',
      'bower_components/ngmap/build/scripts/ng-map.min.js',
      'bower_components/momentjs/moment.js',
      'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
      'bower_components/angular-autogrow/angular-autogrow.min.js',
      'bower_components/ng-idle/angular-idle.min.js',
      'bower_components/angular-tooltips/dist/angular-tooltips.js',
      'app/config/config.js',
      'app/*.js',
      'app/components/**/*js',
      'app/components/*.js',
      'app/infrastructure/**/*.js',
      'app/routes/**/*.js',
      'test/fixture/backend.js',
      'test/unit/**/*.js',
      'bower_components/ui-select/dist/select.js'
    ],

    exclude: ['test/e2e/**/*.js'],

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : ['karma-*'],

    singelRun : true,

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

//    Possible values: LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO. LOG_DEBUG
    logLevel: config.LOG_ERROR,
    autoWatch : false,
    captureTimeout: 5000,
    port: 9000,
    runnerPort: 9100
  });
};

