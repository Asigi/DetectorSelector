angular.module('DetectorSelector.services', ['ngSanitize'])

        .factory('CommentFactory', function ($q, $rootScope) {

            function getComments(detectorID) {
                var comments = Parse.Object.extend("DetectorComment");
                var query = new Parse.Query(comments);
                var deferred = $q.defer();
                query.equalTo("DetectorId", detectorID);
                query.find({
                    success: function (results) {
                        var comments = [];
                        for (var i = 0; i < results.length; i++) {
                            comments[i] = {
                                "user": results[i].get("userName"),
                                "comment": results[i].get("comment")
                            };
                        }
                        deferred.resolve(comments);
                        console.log(comments);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
                return deferred.promise;
            }

            return {
                getComments: function (detectorID) {
                    return getComments(detectorID);
                }
            };

        })

        .factory('DetectorFactory', function ($q, $http, $filter) {

            //returns a promise for a list of detectors 
            //taken from a local json file in /lib/detectors.json
            function getDetectors() {
                var deferred = $q.defer();
                $http.get('lib/detectorData/detectors.json')
                        .then(function (data) {
                            deferred.resolve(data.data.detectors);
                        },
                                function (response) {
                                    console.log("Error getting detectors: " + response);
                                }
                        );
                return deferred.promise;
            }

            //refine the search
            function getCustomDetectors(usrType, usrScen, usrTier, faves) {
                var deferred = $q.defer();
                getDetectors().then(function (detsList) {
                    //filter the list by type
                    if (usrType !== '.') {
                        detsList = $filter('filter')(detsList, {type: usrType});
                    }
                    //order by desired scenario
                    if (usrScen !== '.') {
                        if (usrScen === 'field') {
                            detsList = $filter('orderBy')(detsList, ["bioFieldTier", "chemFieldTier", "radFieldTier"]);
                        }
                        else if (usrScen === 'mobile') {
                            detsList = $filter('orderBy')(detsList, ["bioMobDTier", "chemMobTier", "radMobTier"]);
                        }
                        else if (usrScen === 'diagnostic') {
                            detsList = $filter('orderBy')(detsList, ["bioDiagTier", "chemDiagTier", "radDiagTier"]);
                        }
                        else if (usrScen === 'analytic') {
                            detsList = $filter('orderBy')(detsList, ["bioAnalTier", "chemAnalTier", "radAnalTier"]);
                        }
                        else if (usrScen === 'faves') {
                            var i;
                            var favorites = [];
                            var detector;
                            for (i = 0; i < faves.length; i++) {
                                var k = faves[i];
                                detector = $filter('filter')(detsList, {DetectorID: k}, true);
                                favorites.push(detector[0]);
                            }
                            deferred.resolve(favorites);
                            return deferred.promise;
                        }
                    }
                    deferred.resolve(detsList);
                });
                return deferred.promise;

            }

            //the public API
            return {
                getDetectors: function () {
                    return getDetectors();
                },
                getCustomDetectors: function (t, s, ti, faves) {
                    return getCustomDetectors(t, s, ti, faves);
                }
            };
        });

