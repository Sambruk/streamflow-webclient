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

var args = require('yargs').argv;
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var del = require('del');
var gulp = require('gulp');
var merge = require('merge-stream');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var karmaServer = require('karma').Server;
var mainBowerFiles = require('main-bower-files');
var minifyCSS = require('gulp-clean-css');
var minifyHtml = require('gulp-minify-html');
var ngAnnotate = require('gulp-ng-annotate');
var ngConstant = require('gulp-ng-constant');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');

var testFiles = ['unit/filters-unit.js'];
var buildMode = (function () {
  if (args.prod) {
    return 'prod';
  } else {
    return 'dev';
  }
})();

var paths = {
  scripts: [
    'app/**/*.js',
    '!app/design/**/*.js'
  ],
  css: [
    'app/design/gui/css/**/*.css',
    'bower_components/angular-growl-v2/build/angular-growl.css',
    'bower_components/pickadate/lib/themes/default.*',
    'bower_components/ui-select/dist/select.css',
    'bower_components/angular-tooltips/dist/angular-tooltips.css'
  ],
  templates: [
    'app/**/*.html'
  ],
  images: [
    'app/design/gui/i/**/*'
  ],
  fonts: [
    'app/design/gui/fonts/**/*'
  ],
  config: [
    'app/config/config.json'
  ]
};

function karmaCallback(done) {
    return function (exitCode) {
        if (exitCode) {
            done(new Error('Karma tests failed with exit code ' + exitCode));
        } else {
            done();
        }
    }
}

gulp.task('config', function () {
  gulp.src(paths.config)
    .pipe(ngConstant({
      name: 'sf.config',
      constants: { buildMode: buildMode }
    }))
    .pipe(gulp.dest('app/config'));
});

gulp.task('unit-test', function (done) {
    new karmaServer({
        configFile: __dirname + '/karma.config.js',
        singleRun: true
    }, karmaCallback(done)).start();
});

gulp.task('e2e-test', function (done) {
    new karmaServer({
        configFile: __dirname + '/karma-e2e.conf.js',
        singleRun: true
    }, karmaCallback(done)).start();
});

gulp.task('lint', function () {
  var path = paths.scripts.concat([
    '!app/angular-locale_sv-se.js',
    '!app/config/config.js'
  ]);
  return gulp.src(path)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('build-scripts', ['lint', 'unit-test'], function () {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(ngAnnotate())
    .pipe(concat('streamflow.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/app'))
    .pipe(connect.reload());
});

gulp.task('build-vendor-scripts', function () {
  return merge(gulp.src('bower_components/jquery/dist/jquery.js'), gulp.src(mainBowerFiles({filter: /\.js$/i})))
    .pipe(concat('vendor.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('build/app'))
    .pipe(connect.reload());
});

gulp.task('build-css', function () {
  return gulp.src(paths.css)
      .pipe(sourcemaps.init())
      .pipe(autoprefixer())
      .pipe(concat('streamflow.css'))
      .pipe(minifyCSS())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('build/app/css'))
      .pipe(connect.reload());
});

gulp.task('copy-templates', function () {
  return gulp.src(paths.templates)
    .pipe(minifyHtml({
      empty: true
    }))
    .pipe(gulp.dest('build'))
    .pipe(connect.reload());
});

gulp.task('copy-fonts', function () {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('build/app/fonts'))
    .pipe(connect.reload());
});

gulp.task('copy-images', function () {
  return gulp.src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest('build/app/i'))
    .pipe(connect.reload());
});

gulp.task('connect', function () {
  connect.server({
    root: 'build',
    port: 9999,
    livereload: true
  });
});

gulp.task('clean', function () {
  del(['build']);
});

gulp.task('build', [
  'config',
  'build-scripts',
  'build-vendor-scripts',
  'build-css',
  'copy-templates',
  'copy-fonts',
  'copy-images',
  'unit-test'
]);

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['build-scripts']);
  gulp.watch(mainBowerFiles({filter: /\.js$/i}), ['build-vendor-scripts']);
  gulp.watch(paths.css, ['build-css']);
  gulp.watch(paths.templates, ['copy-templates']);
  gulp.watch(paths.images, ['copy-images']);
  gulp.watch(paths.fonts, ['copy-fonts']);
});

gulp.task('default', function () {
  runSequence('build', 'connect', 'watch');
});

