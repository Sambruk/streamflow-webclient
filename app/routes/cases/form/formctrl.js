/*
 *
 * Copyright 2009-2014 Jayway Products AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
angular.module('sf')
    .controller('FormCtrl', function ($q, $scope, $parse, growl, $route, caseService, $routeParams, $templateCache, $rootScope, webformRulesService, $sce, navigationService, fileService, httpService, sidebarService, $timeout, formMapperService) {
        $scope.sidebardata = {};
        $scope.caseId = $scope.loadChild ? $scope.$parent.caseId : $routeParams.caseId;
        $scope.currentFormId = $scope.loadChild ? $scope.$parent.formId : $routeParams.formId;
        $scope.currentFormDescription = '';
        $scope.possibleForms = caseService.getSelectedPossibleForms($scope.caseId);
        $scope.selectedItems = {};
        $scope.applyRules = webformRulesService.applyRules;
        $scope.possibleForm = '';
        $scope.caze = caseService.getSelected($scope.caseId);

        $scope.isValidForm = true;
        $scope.formPageIndex = 0;
        $scope.formPagesValid = [];

        $scope.showSpinner = {
            form: true
        };

        $scope.trustAsHtml = function (text) {
            return $sce.trustAsHtml(text);
        };

        $scope.$watch('currentFormPage', function (newVal) {
            if (!newVal) {
                return;
            }
            $scope.reapplyRules();
        });

        $scope.$watch('closeWithForm', function (newVal) {
            if (!newVal) {
                return;
            }
            caseService.createFormOnCloseDraft($scope.caseId).then(function () {
                caseService.getFormOnCloseDraft($scope.caseId).promise.then(function (response) {
                    caseService.getFormDraft($scope.caseId, response[0].id).promise.then(function (response) {
                        $scope.closeWithFormId = response[0].draftId;
                    })
                        .then(function () {
                            $scope.formMessage = '';

                            var form = caseService.getFormDraft($scope.caseId, $scope.closeWithFormId);
                            form.promise.then(function (response) {
                                $scope.getFormData(response);
                                $scope.closeWithForm = true;
                            });
                        });
                });
            });
        });

        $scope.selectForm = function (formId) {
            // TODO Is there a better way than this?
            $scope.$watch('form', function () {
                setTimeout(function () {
                    $scope.$apply(function () {
                        if ($scope.form && $scope.form[0]) {
                            $scope.currentFormDescription = $scope.form[0].description;
                            $scope.currentFormPage = $scope.form[0].enhancedPages[0];
                            $scope.formPageIndex = 0;
                            $scope.displayField($scope.form[0].enhancedPages);
                        }
                    });
                }, 1000);
            });

            $scope.formMessage = '';

            if (formId) {
                $scope.possibleForm = caseService.getPossibleForm($scope.caseId, formId);
            }

            $scope.$watch('possibleForm[0]', function () {
                if (!$scope.possibleForm[0]) {
                    return;
                }
                if ($scope.possibleForm[0].queries.length !== 0) {
                    caseService.getFormDraftId($scope.caseId, formId).promise.then(function (response) {
                        $scope.formDraftId = response[0].id;
                    }).then(function () {
                        var settings = caseService.getFormDraftLocationSettings($scope.caseId, $scope.formDraftId);
                        settings.promise.then(function (response) {
                            $scope.locationSettings = response[0];
                        });
                        var form = caseService.getFormDraftFromForm($scope.caseId, $scope.formDraftId);
                        form.promise.then(function (response) {
                            $scope.getFormData(response);
                        })
                            .then(function () {
                                if ($scope.isLastPage()) {
                                    $scope.form.invalidate();
                                    $scope.form.resolve();
                                }
                            });
                    });
                }
                else {
                    caseService.createSelectedForm($scope.caseId, formId).then(function (response) {
                        var draftId = JSON.parse(response.data.events[0].parameters).param1;
                        $scope.showSpinner.form = false;
                        $scope.possibleForm.invalidate();
                        $scope.possibleForm.resolve();
                        var settings = caseService.getFormDraftLocationSettings($scope.caseId, draftId);
                        settings.promise.then(function (response) {
                            $scope.locationSettings = response[0];
                        });
                        var form = caseService.getFormDraft($scope.caseId, draftId);
                        form.promise.then(function (response) {
                            $scope.form = response;
                            $scope.formPagesValid = new Array(form[0].enhancedPages.length);
                            $scope.showSpinner.form = false;
                        })
                            .then(function () {
                                $scope.isLastPage = function () {
                                    return $scope.currentFormPage && $scope.form[0].enhancedPages.indexOf($scope.currentFormPage) === ($scope.form[0].enhancedPages.length - 1); //|| $scope.form[0].enhancedPages.indexOf($scope.currentFormPage) === visiblePages.length;
                                };
                            });
                    });
                }
                $scope.currentFormPage = null;
                $scope.formPageIndex = 0;
            });
        };

        $scope.getFormData = function (data) {
            $scope.form = data;
            $scope.formAttachments = [];
            $scope.showSpinner.form = false;

            $scope.form[0].enhancedPages.forEach(function (pages) {
                pages.fields.forEach(function (field) {

                    if (field.field.fieldValue._type === 'se.streamsource.streamflow.api.administration.form.AttachmentFieldValue') {
                        var name = null;
                        var id = null;

                        if (field.value) {
                            var jsonParse = JSON.parse(field.value);
                            name = jsonParse.name;
                            id = jsonParse.attachment;
                        }

                        var attachment = {
                            name: name,
                            id: id,
                            fieldId: field.field.field
                        };

                        $scope.formAttachments.push(attachment);
                    }
                });
            });
        };

        $scope.displayField = function (formPage) {
            $scope.applyRules(formPage);
        };

        $scope.reapplyRules = function () {
            $scope.applyRules($scope.form[0].enhancedPages);
        };

        $scope.selectFormPage = function (page) {
            $scope.currentFormPage = page;
            $scope.formPageIndex = $scope.form[0].enhancedPages.indexOf($scope.currentFormPage);
        };

        $scope.submitForm = function () {
            updateFieldsOnPages($scope.form[0]).then(function () {
                caseService.submitForm($scope.caseId, $scope.form[0].draftId).then(function () {

                    if (!$scope.closeWithForm) {
                        formSubmitted();
                    } else {
                        caseService.closeFormOnClose($scope.caseId).then(function () {
                            formSubmitted();
                            $timeout(function () {
                                sidebarService.close($scope);
                            }, 1000);
                        });
                    }

                    growl.success('Skickat!');
                    $route.reload();
                });
            });
        };

        var updateFieldsOnPages = function (form) {
            return $q.when()
                .then(function () {
                    var fields = form.enhancedPages
                        .reduce(function (fields, page) {
                            return fields.concat(page.fields);
                        }, [])
                        .filter(function (field) {
                            //Ignoring fields which shouldn't be sent
                            //TODO Check for file attachment
                            return !(field.field.fieldValue._type === "se.streamsource.streamflow.api.administration.form.AttachmentFieldValue"
                            || field.field.fieldValue._type === "se.streamsource.streamflow.api.administration.form.CommentFieldValue"
                            || field.field.fieldValue._type === "se.streamsource.streamflow.api.administration.form.FieldGroupFieldValue");
                        })
                        .map(function (field) {
                            var value = '';
                            switch (field.field.fieldValue._type) {
                                case 'se.streamsource.streamflow.api.administration.form.CheckboxesFieldValue':
                                    var checked = field.field.fieldValue.checkings
                                        .filter(function (input) {
                                            return input.checked;
                                        }).map(function (input) {
                                            return input.name;
                                        });
                                    value = checked.join(', ');
                                    break;
                                case 'se.streamsource.streamflow.api.administration.form.ListBoxFieldValue':
                                    value = formMapperService.getValue(field.value, field.field).join(', ');
                                    break;
                                case 'se.streamsource.streamflow.api.administration.form.DateFieldValue':
                                    //Formatting date top understandable for server format
                                    value = new Date(formMapperService.getValue(field.value, field.field)).toISOString();
                                    break;
                                default:
                                    value = formMapperService.getValue(field.value, field.field);
                            }
                            return {field: field.field.field, value: value === null ? "" : value};
                        });
                    return caseService.updateFields($scope.caseId, $scope.formDraftId, fields);
                });
        };

        var formSubmitted = function () {
            if (!$scope.closeWithForm) {
                $rootScope.$broadcast('form-submitted');
                if ($rootScope.isFormWindow) {
                    $rootScope.$broadcast('form-saved', $scope.currentFormId);
                }
            }
            window.location.href = '#/cases/' + $scope.caseId + '/formhistory/' + $scope.currentFormId
            $scope.form = [];
            $scope.currentFormPage = null;
            $scope.formPageIndex = 0;
        };

        $scope.deleteFormDraftAttachment = function (fieldId) {
            var attachment = _.find($scope.formAttachments, function (attachment) {
                return attachment.fieldId === fieldId;
            });

            caseService.deleteFormDraftAttachment($scope.caseId, $scope.formDraftId, attachment.id).then(function () {
                $scope.formAttachments.forEach(function (attachment, index) {
                    if ($scope.formAttachments[index].fieldId === fieldId) {
                        $scope.formAttachments[index].name = null;
                        $scope.formAttachments[index].id = null;
                    }
                });
                caseService.updateField($scope.caseId, $scope.formDraftId, fieldId, null);
            });
        };

        $scope.onFormDraftFileSelect = function ($files, fieldId) {
            var url = httpService.apiUrl + 'workspacev2/cases/' + $scope.caseId + '/formdrafts/' + $scope.formDraftId + '/formattachments/createformattachment';

            fileService.uploadFile($files[0], url).then(function (data) {
                return JSON.parse(data.data.events[0].parameters).param1;
            }).then(function (attachmentId) {
                caseService.updateFormDraftAttachmentField($scope.caseId, $scope.formDraftId, $files[0].name, attachmentId, fieldId).then(function () {

                    $scope.formAttachments.forEach(function (attachment, index) {
                        if ($scope.formAttachments[index].fieldId === fieldId) {
                            $scope.formAttachments[index].name = $files[0].name;
                            $scope.formAttachments[index].id = attachmentId;
                        }
                    });
                });
            });
        };

        $scope.toggleLastPageTrue = function (val) {
            $scope.forcedLastPage = val;
        };

        $scope.isLastPage = function () {
            if ($scope.form && $scope.form[0] && $scope.form[0].enhancedPages) {
                return $scope.currentFormPage && $scope.form[0].enhancedPages.indexOf($scope.currentFormPage) === ($scope.form[0].enhancedPages.length - 1);
            }
            return false;
        };


        $scope.isFirstPage = function () {
            if ($scope.form && $scope.form[0]) {
                return $scope.currentFormPage && $scope.form[0].enhancedPages.indexOf($scope.currentFormPage) === 0;
            }
            return false;
        };

        $scope.nextFormPage = function () {
            $scope.formPagesValid[$scope.formPageIndex] = $scope.issueForm.$valid;
            $scope.formPageIndex += 1;
            $scope.currentFormPage = $scope.form[0].enhancedPages[$scope.formPageIndex];
        };

        $scope.previousFormPage = function () {
            $scope.formPagesValid[$scope.formPageIndex] = $scope.issueForm.$valid;
            $scope.formPageIndex -= 1;
            $scope.currentFormPage = $scope.form[0].enhancedPages[$scope.formPageIndex];
        };

        $scope.$watchCollection('formPagesValid', function (newValues, oldValues) {
            var isAllPagesValid = true;
            $scope.formPagesValid.forEach(function (value) {
                if (!value) {
                    isAllPagesValid = value
                }
            });

            $scope.isValidForm = isAllPagesValid;
        });

        /*   //Used for send submit message only after correct form data sending to server
         //TODO: Maybe it would be good to rewrite that to promises somehow?
         $scope.$on('form-saved', function (event, formId) {
         if (!$scope.closeWithForm) {
                   formSubmitted();
         }
         });*/
    });
