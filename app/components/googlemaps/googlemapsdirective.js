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

/*global google */
'use strict';
angular.module('sf').directive('googleMap', function () {
    return {
        restrict: 'E',
        templateUrl: 'components/googlemaps/googlemaps.html',
        scope: {
            ngModel: '=',
            locationSettings: '=',
            fieldSettings: '='
        },
        controller: function ($scope, NgMap) {

            var geocoder = null;

            function SearchResultItem(result) {
                this.address = result.formatted_address;
                this.location = result.geometry.location;

                return this;
            }

            function getGeocoder() {
                if (!geocoder) {
                    geocoder = new google.maps.Geocoder();
                }
                return geocoder;
            }

            function geocode(searchTerm, map, successCallback, errorCallback) {
                var request = {
                    'address': searchTerm,
                    'bounds': map.getBounds()
                };
                getGeocoder().geocode(request, function (results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            var searchResultItems = [];
                            $.each(results, function (index, result) {
                                searchResultItems.push(new SearchResultItem(result));
                            });
                            successCallback(searchResultItems);
                        } else {
                            errorCallback();
                        }
                    }
                );
            }

            function reverseGeocode(position, successFunction) {
                getGeocoder().geocode({'latLng': position}, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            $scope.mapValue.clearAddress();
                            $.each(results[0].address_components, function () {
                                if (this.types[0] === 'street_number') {
                                    if ($scope.mapValue.value.street && $scope.mapValue.value.street.length > 0) {
                                        $scope.mapValue.value.street = $scope.mapValue.value.street + ' ' + this.short_name;
                                    } else {
                                        $scope.mapValue.value.street = this.short_name;
                                    }
                                    $scope.addressLabel = results[0].formatted_address;
                                }
                                if (this.types[0] === 'route') {
                                    if ($scope.mapValue.value.street && $scope.mapValue.value.street.length > 0) {
                                        $scope.mapValue.value.street = this.short_name + ' ' + $scope.mapValue.value.street;
                                    } else {
                                        $scope.mapValue.value.street = this.short_name;
                                    }
                                }
                                if (this.types[0] === 'postal_code') {
                                    $scope.mapValue.value.zipcode = this.short_name;
                                }
                                if (this.types[0] === 'postal_town') {
                                    $scope.mapValue.value.city = this.short_name;
                                }
                                if (this.types[0] === 'country') {
                                    $scope.mapValue.value.country = this.short_name;
                                }
                            });
                        } else {
                            $scope.addressLabel = 'Map address location not found';
                        }
                        successFunction();
                    }
                });
            }

            function cleanUpPosition(position) {
                if (position.indexOf('(') === 0) {
                    position = position.substring(1);
                }
                if (position.indexOf(')') !== -1) {
                    position = position.substring(0, position.indexOf(')'));
                }
                return $.trim(position);
            }

            function LatLong(fieldValueString) {
                var latLong = fieldValueString.split(',');
                this.latitude = cleanUpPosition(latLong[0]);
                this.longitude = cleanUpPosition(latLong[1]);
            }

            LatLong.prototype.equals = function (second) {
                return this.latitude === second.latitude && this.longitude === second.longitude;
            };

            function MapValue(mapFieldValue) {
                this.path = [];
                this.value = mapFieldValue;

                return this;
            }

            function changeModel() {
                $scope.ngModel = JSON.stringify($scope.mapValue.value);
                $scope.$apply();
            }

            var createMapValue = function (value) {
                if (value && !value.location) {
                    value = JSON.parse(value);
                } else {
                    value = {location: '', street: '', zipcode: '', city: '', country: ''};
                }
                var mapValue = new MapValue(value);
                mapValue.updateLocation(value.location);
                return mapValue;
            };

            var clearCurrentMarkersAndLines = function () {
                if ($scope.marker) {
                    $scope.marker.setMap(null);
                }
                if ($scope.polyline) {
                    $scope.polyline.setMap(null);
                }
                if ($scope.polygon) {
                    $scope.polygon.setMap(null);
                }
            };

            var initMap = function () {
                $scope.mapValue = createMapValue($scope.ngModel);

                // TODO: Read startPosition and zoomLevel from settings
                var startPosition;

                if ($scope.mapValue.value.location) {
                    startPosition = new LatLong($scope.mapValue.value.location);
                } else {
                    startPosition = new LatLong($scope.locationSettings.location);
                }

                var mapOptions = {
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    panControl: false,
                    streetViewControl: false,
                    overviewMapControl: false,
                    scrollwheel: false
                };

                $scope.mapData = {
                    center: startPosition,
                    zoom: $scope.locationSettings.zoomLevel,
                    options: mapOptions,
                    control: {},
                    markersControl: {}
                };

                var availableDrawingModes = [];
                var initialDrawingMode = null;

                if ($scope.mapValue) {
                    if ($scope.mapValue.isPoint) {
                        initialDrawingMode = google.maps.drawing.OverlayType.MARKER;
                    } else if ($scope.mapValue.isPolyline) {
                        initialDrawingMode = google.maps.drawing.OverlayType.POLYLINE;
                    } else if ($scope.mapValue.isPolygon) {
                        initialDrawingMode = google.maps.drawing.OverlayType.POLYGON;
                    }
                }

                if ($scope.fieldSettings.point) {
                    availableDrawingModes.push(google.maps.drawing.OverlayType.MARKER);
                    if (!initialDrawingMode) {
                        initialDrawingMode = google.maps.drawing.OverlayType.MARKER;
                    }
                }
                if ($scope.fieldSettings.polyline) {
                    availableDrawingModes.push(google.maps.drawing.OverlayType.POLYLINE);
                    if (!initialDrawingMode) {
                        initialDrawingMode = google.maps.drawing.OverlayType.POLYLINE;
                    }
                }
                if ($scope.fieldSettings.polygon) {
                    availableDrawingModes.push(google.maps.drawing.OverlayType.POLYGON);
                    if (!initialDrawingMode) {
                        initialDrawingMode = google.maps.drawing.OverlayType.POLYGON;
                    }
                }

                console.log('FIeld settings', $scope.fieldSettings);
                $scope.drawingManagerOptions = {
                    drawingMode: initialDrawingMode,
                    drawingControl: true,
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: availableDrawingModes
                    },
                    markerOptions: {
                        draggable: true,
                        animation: google.maps.Animation.DROP
                    },
                    events: {
                        markercomplete: function (drawingManager, eventName, model, args) {
                            clearCurrentMarkersAndLines();
                            $scope.marker = args[0];

                            if ($scope.marker) {
                                var position = $scope.marker.position.lat() + ', ' + $scope.marker.position.lng();
                            } else {
                                var position = "current-location";
                            }
                            $scope.mapValue.updateLocation(position);
                            reverseGeocode($scope.marker.position, function () {
                                changeModel();
                            });
                        },
                        polylinecomplete: function (drawingManager, eventName, model, args) {
                            clearCurrentMarkersAndLines();
                            $scope.polyline = args[0];

                            $scope.mapValue.updateLocation($scope.polyline.getPath().getArray().toString());
                            reverseGeocode($scope.polyline.getPath().getArray()[0], function () {
                                changeModel();
                            });
                        },
                        polygoncomplete: function (drawingManager, eventName, model, args) {
                            clearCurrentMarkersAndLines();
                            $scope.polygon = args[0];

                            $scope.mapValue.updateLocation($scope.polygon.getPath().getArray().toString());
                            reverseGeocode($scope.polygon.getPath().getArray()[0], function () {
                                changeModel();
                            });
                        },
                        drawingmode_changed: function () {
                            //clearCurrentMarkersAndLines();
                        }
                    }
                };
                console.log('drawingManagerOptions', $scope.drawingManagerOptions);

            };

            var init = function (map) {
                if ($scope.mapValue) {
                    // Detect if it's a single point or a line/surface
                    if ($scope.mapValue.isPoint) {
                        if ($scope.marker) {
                            $scope.marker.setMap(null);
                        }
                        $scope.marker = new google.maps.Marker({
                            position: new google.maps.LatLng($scope.mapValue.path[0].latitude, $scope.mapValue.path[0].longitude),
                            map: map
                        });
                        map.setCenter($scope.marker.position);
                        map.setZoom($scope.locationSettings.zoomLevel);
                        reverseGeocode($scope.marker.position, function () {
                            changeModel();
                        });
                    } else {
                        var path = [];
                        $.each($scope.mapValue.path, function (index, position) {
                            path.push(new google.maps.LatLng(position.latitude, position.longitude));
                        });

                        if ($scope.mapValue.isPolyline) {
                            $scope.polyline = new google.maps.Polyline();
                            $scope.polyline.setPath(path);
                            $scope.polyline.setMap(map);

                        } else if ($scope.mapValue.isPolygon) {
                            $scope.polygon = new google.maps.Polygon();
                            $scope.polygon.setPath(path);
                            $scope.polygon.setMap(map);
                        } else {
                            map.setCenter({lat: 59.3500, lng: 18.0667});
                            map.setZoom($scope.locationSettings.zoomLevel);
                        }
                        reverseGeocode(path[0], function () {
                            changeModel();
                        });

                        if (path.length > 0) {
                            map.setCenter(path[0]);
                            map.setZoom($scope.locationSettings.zoomLevel);
                        }
                    }
                }
            };

            $scope.search = function (event) {
                event.preventDefault();
                $scope.searchError = undefined;

                var map = $scope.ngmap.map;
                $scope.searchResults = [];

                geocode($scope.searchValue, map, function (result) {
                    $scope.searchResults = result;
                    $scope.$apply();
                }, function () {
                    $scope.searchError = 'Ingen adressträff på angiven sökning';
                    $scope.$apply();
                });
            };

            $scope.selectAddress = function (event, location) {
                event.preventDefault();
                var map = $scope.ngmap.map;

                clearCurrentMarkersAndLines();
                $scope.searchResults = undefined;
                $scope.searchValue = undefined;
                $scope.searchError = undefined;

                $scope.marker = new google.maps.Marker({
                    position: location,
                    map: map
                });
                var position = location.lat() + ', ' + location.lng();
                $scope.mapValue.updateLocation(position);
                map.setCenter($scope.marker.position);
                map.setZoom($scope.locationSettings.zoomLevel);

                reverseGeocode($scope.marker.position, function () {
                    changeModel();
                });
            };

            $scope.findMe = function () {
                var map = $scope.ngmap.map;
                navigator.geolocation.getCurrentPosition(function (position) {
                    clearCurrentMarkersAndLines();
                    $scope.marker = new google.maps.Marker({
                        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                        map: map
                    });
                    var location = position.coords.latitude + ', ' + position.coords.longitude;
                    $scope.mapValue.updateLocation(location);
                    map.setCenter($scope.marker.position);
                    map.setZoom($scope.locationSettings.zoomLevel);

                    reverseGeocode($scope.marker.position, function () {
                        changeModel();
                    });
                });
            };

            MapValue.prototype.clearAddress = function () {
                var self = this;
                self.value.street = '';
                self.value.zipcode = '';
                self.value.city = '';
                self.value.country = '';
            };

            MapValue.prototype.updateLocation = function (newLocation) {
                var self = this;
                self.path = [];
                self.value.location = newLocation;
                self.isPoint = false;
                self.isPolyline = false;
                self.isPolygon = false;

                if (newLocation) {
                    if (newLocation.indexOf('(') === -1) {
                        self.isPoint = true;
                        self.path.push(new LatLong(newLocation));

                    } else {
                        $.each(newLocation.split('),'), function (index, position) {
                            self.path.push(new LatLong(position));
                        });
                        // If first point is the same as the last one its a polygon
                        if (self.path[0].equals(self.path[self.path.length - 1])) {
                            self.isPolygon = true;
                        } else {
                            self.isPolyline = true;
                        }
                    }
                }
            };

            initMap();

            NgMap.getMap().then(function (map) {
                map.setZoom($scope.locationSettings.zoomLevel);
                map.mapDrawingManager[0].setOptions($scope.drawingManagerOptions);
                init(map);
            });
        }
    };
});
