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
describe("sf.services.case", function () {

  var backend = window.mockBackend;

  beforeEach(module('sf'));

  beforeEach(inject(function (httpService, navigationService) {
    httpService.baseUrl = '';
    httpService.apiUrl = 'mock/';
    spyOn(navigationService, 'projectId').and.returnValue('b35873ba-4007-40ac-9936-975eab38395a-3f');
    //spyOn(navigationService, 'caseType').andReturn('inbox');
    spyOn(navigationService, 'caseId').and.returnValue('b35873ba-4007-40ac-9936-975eab38395a-30');
  }));

  describe("caseService", function () {


    describe("getSelected", function () {

      it("returns the selected case", inject(function (caseService, $httpBackend) {
        // Given
        $httpBackend.expectGET('mock/').respond(backend.root);
        $httpBackend.expectGET('mock/workspacev2/').respond(backend.workspacev2);
        $httpBackend.expectGET('mock/workspacev2/cases/').respond(backend.cases);
        $httpBackend.expectGET('mock/workspacev2/cases/b35873ba-4007-40ac-9936-975eab38395a-30/').respond(backend.case1);

        // When
        var response = caseService.getSelected('b35873ba-4007-40ac-9936-975eab38395a-30');

        // Then
        expect(response.length).toEqual(0);

        // When
        $httpBackend.flush();

        // Then
        expect(response[0].id).toEqual('0f0008c2-4d6e-453a-b255-0d6ec86145f9-2');
        expect(response[0].text).toEqual('formulärstest');
      }));
    });

   describe("getSelectedContacts", function() {
     it("returns the selected project", inject(function (caseService, $httpBackend) {
       // Given
       $httpBackend.expectGET('mock/').respond(backend.root);
       $httpBackend.expectGET('mock/workspacev2/').respond(backend.workspacev2);
       $httpBackend.expectGET('mock/workspacev2/cases/').respond(backend.cases);
       $httpBackend.expectGET('mock/workspacev2/cases/b35873ba-4007-40ac-9936-975eab38395a-30/').respond(backend.case1);
       $httpBackend.expectGET('mock/workspacev2/cases/b35873ba-4007-40ac-9936-975eab38395a-30/contacts/').respond(backend.contact1);

       // When
        var response = caseService.getSelectedContacts('b35873ba-4007-40ac-9936-975eab38395a-30');
       // Then
       expect(response.length).toEqual(0);

       // When
       $httpBackend.flush();

       // Then
       expect(response.length).toEqual(2);
       expect(response[0].name).toEqual("Frida Kranstege");
       expect(response.commands[0].text).toEqual("Add");
     }));

   })
  });
});
