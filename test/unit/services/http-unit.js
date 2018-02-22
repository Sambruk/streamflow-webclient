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
describe("sf.services.http", function () {
  'use strict';

  var backend = window.mockBackend;

  beforeEach(module('sf'));

  describe('httpService', function () {
    beforeEach(inject(function ($location) {
      spyOn($location, 'absUrl').and.returnValue("http://localhost:8000/app/index.html#/customers/197606030001");
      spyOn($location, 'path').and.returnValue("/customers/197606030001");
    }));

    it("can get the entry point", inject(function (httpService) {
        expect(httpService.apiUrl).toEqual("http://localhost:8082/streamflow/");
      }
    ));

    it("can get data from server", inject(function(httpService, $httpBackend){
      httpService.apiUrl = "mock/";

      $httpBackend.expectGET('mock/customer1/').respond(backend.customer);

      httpService.getRequest("customer1/").then (function(data) {
        expect(data.data.resources.length).toBe(3);
      });
      $httpBackend.flush();

    }));


    it("does cache requests", inject(function(httpService, $httpBackend) {
      httpService.apiUrl = "";
      expect(httpService.isCached('bla/a/')).toBe(false);
      $httpBackend.expectGET("bla/a/").respond(backend.customer);

      httpService.getRequest("bla/a/").then(function() {
        expect(httpService.isCached('bla/a/')).toBe(true);
      });
      $httpBackend.flush();
    }));

    it("can empty the cache", inject(function(httpService, $httpBackend) {
      httpService.apiUrl = "";
      $httpBackend.expectGET("bla/a/").respond(backend.customer);

      httpService.getRequest("bla/a/");
      $httpBackend.flush();
      expect(httpService.isCached('bla/a/')).toBe(true);

      // when
      httpService.invalidate(["bla/a/"]);

      // then
      expect(httpService.isCached('bla/a/')).toBe(false);

    }));
  });
});

