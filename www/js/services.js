angular.module('DetectorSelector.services', ['ngSanitize'])

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
            function getCustomDetectors(usrType, usrScen, usrTier) {
                var deferred = $q.defer();
                getDetectors().then(function (detsList) {
                    //filter the list by type
                    if (usrType !== '.'){
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
                getCustomDetectors: function(t,s,ti){
                    return getCustomDetectors(t,s,ti);
                }
            };
        });

