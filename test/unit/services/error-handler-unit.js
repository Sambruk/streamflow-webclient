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
describe("sf.services.error-handler", function () {

  function isPhantomJS() {
    return ( navigator 
             && navigator.userAgent 
             && navigator.userAgent.indexOf("PhantomJS") != -1 ); 
  }

  beforeEach(module('sf'));

  it("does nothing on a 404 request", inject(function (errorHandlerService, $window) {
    if (isPhantomJS()) {
      $window.spyOn($window.location, 'reload');
      var error = {status:404};
      errorHandlerService(error);
      expect($window.location.reload).not.toHaveBeenCalled();
    }
    else {
      console.log("Reload tested only in PhantomJS");
    }
  }));

  it("should reload the window on a 403 request", inject(function(errorHandlerService, $window) {
    if (isPhantomJS()) {
      $window.spyOn($window.location, 'reload');
      var error = {status:403};
      errorHandlerService(error);
      expect($window.location.reload).toHaveBeenCalled();
    }
    else {
      console.log("Reload tested only in phantomjs");
    }
  }));
});
