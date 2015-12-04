angular.module('DetectorSelector.controllers', ['DetectorSelector.services', 'ngSanitize'])

        .controller('MenuCtrl', function ($scope, $rootScope, $ionicLoading, $state) {

            $scope.goHome = function () {
                $state.go('app.home');
            };

            $scope.goSearch = function () {
                $state.go('app.search');
            };

            $scope.goLogin = function () {
                $state.go('app.login');
            };

            $scope.goNewAccount = function () {
                $state.go('app.newAccount');
            };

            $scope.goAbout = function () {
                $state.go('app.about');
            };

            //TODO: Logout Does not currently work
            $scope.logout = function () {

                Parse.User.logOut();

                $rootScope.loggedIn = false;
                console.log("Logged Out!");
                $ionicLoading.show({template: 'Logged out!', noBackdrop: true, duration: 2000});
                $state.go('app.home');
            };

            //TODO: Implement showFav
            $scope.showFavorites = function (scen) {

                var array = Parse.User.current().get("favArray");
                $rootScope.faves = array;
                $rootScope.userType = '.';
                $rootScope.userScenario = 'faves';
                //console.log(array.toString());
                $state.go('app.detectors',
                        {scenario: scen});

            };
        })

        .controller('HomeCtrl', function ($scope, $rootScope, $state) {

            //go to a list of detectors filtered by desired scenario
            $scope.goScenario = function (scen) {
                $rootScope.userScenario = scen;
                $rootScope.userType = '';
                $state.go('app.detectors',
                        {scenario: scen});
            };

            $scope.searchScenario = function () {
                $state.go('app.scenario');
            };

            $scope.searchType = function () {
                $state.go('app.type');
            };

            $scope.goSearch = function () {
                $state.go('app.search');
            };

        })

        .controller('LoginCtrl', function ($scope, $ionicLoading, $rootScope, $state) {

            //test user credentials:
            //un: testuser
            //pw: pass

            $scope.login = function (un, pw) {
                //console.log("UserName: " + un);
                //console.log("Password: " + pw);

                Parse.User.logIn(un, pw, {
                    success: function (user) {
                        // Do stuff after successful login.
                        console.log("success, your username is: ");
                        console.log(user);
                        $rootScope.loggedIn = true;
                        $ionicLoading.show({template: 'Logged In!', noBackdrop: true, duration: 2000});
                        $state.go('app.home');
                    },
                    error: function (user, error) {
                        // The login failed. Check error to see why.
                        $ionicLoading.show({template: 'Failed to log in', noBackdrop: true, duration: 2000});
                        console.log("Failed to Log in: " + error);
                    }
                });
            };
        })

        .controller('NewAccountCtrl', function ($scope, $rootScope, $state) {

            $scope.newAccount = function (un, em, pw) {

                console.log(un + em + pw);

                var user = new Parse.User();
                user.set("username", un);
                user.set("password", pw);
                user.set("email", em);

                var array = [];
                array.push(100);
                user.set("favArray", array);

                user.signUp(null, {
                    success: function (user) {
                        // Hooray! Let them use the app now.
                        console.log("success, your username is: ");
                        console.log(user);
                        $state.go('app.home');

                    },
                    error: function (user, error) {
                        // Show the error message somewhere and let the user try again.
                        alert("Error: " + error.code + " " + error.message);
                    }
                });

                //cntrol shift f

            };
        })

        .controller('ScenarioCtrl', function ($scope, $rootScope, $state) {

            //go to a list of detectors filtered by desired scenario
            $scope.goScenario = function (scen) {
                //set the rootscope for the desired search param
                $rootScope.userScenario = scen;
                //reset the other rootscope params
                $rootScope.userType = '.';
                $state.go('app.detectors',
                        {scenario: scen});
            };
        })

        .controller('TypeCtrl', function ($scope, $rootScope, $state) {

            //go to a list of detectors filtered by desired scenario
            $scope.goType = function (ty) {
                //set the rootscope for the desired search param
                $rootScope.userType = ty;
                //reset the other rootscope params
                $rootScope.userScenario = '.';
                $state.go('app.detectors',
                        {scenario: ty});
            };
        })

        .controller('SearchCtrl', function ($scope, $rootScope, $state, DetectorFactory) {

            //reset all the user selected values on instantiation of the page
//    $rootScope.userType = null;
//    $rootScope.userScenario = null;
//    $rootScope.userTier = null;

            $scope.typeChange = function (ty) {
                ty = ty.toLowerCase();
                $rootScope.userType = ty;
            };
            $scope.scenarioChange = function (sc) {
                sc = sc.toLowerCase();
                $rootScope.userScenario = sc;
            };
//    $scope.tierChange = function(ti){
//        $rootScope.userTier = ti;
//    };
//    $scope.sysCostChange = function(sco){
//        sco = sco.toLowerCase();
//        sco = Number(sco.replace(/[^0-9\.]+/g,""));
//        $rootScope.sysCost = sco;
//    };

            $scope.search = function () {
                $state.go('app.detectors');
                //console.log("Type: " + $rootScope.userType + "Scen: " + $rootScope.userScenario);
                //console.log($rootScope);
            };

        })

        .controller('DetectorsCtrl', function ($scope, $state, $filter, $rootScope, DetectorFactory) {

            DetectorFactory.getCustomDetectors($rootScope.userType, $rootScope.userScenario, $rootScope.userTier, $rootScope.faves).then(function (dets) {
                $scope.detectors = dets;
            });

            //go to a specific detector
            $scope.goDetails = function (det) {
                $rootScope.selected = det;
                $state.go('app.details',
                        {detectorDetails: det});
            };

            $scope.getTypeImage = function (detector) {
                switch (detector.type) {
                    case "bio":
                        return "lib/detectorData/img/type-1.png";
                        break;
                    case "chem":
                        return"lib/detectorData/img/type-2.png";
                        break;
                    case "rad":
                        return "lib/detectorData/img/type-3.png";
                        break;
                    case "bio & chem":
                        return "lib/detectorData/img/type-4.png";
                        break;
                    case "bio & rad":
                        //no current detectors for this scenario, no image avail
                        break;
                    case "bio & chem & rad":
                        return "lib/detectorData/img/type-6.png";
                        break;
                    case "chem & rad":
                        return "lib/detectorData/img/type-7.png";
                        break;
                    default:
                        return null;
                }
            };

            $scope.getMobImage = function (detector) {
                if (detector.bioMobTier <= 2 || detector.chemMobTier <= 2 || detector.radMobTier <= 2) {
                    return "lib/detectorData/img/mobile.png";
                }
                ;
            };
            $scope.getFieldImage = function (detector) {
                if (detector.bioFieldTier <= 2 || detector.chemFieldTier <= 2 || detector.radFieldTier <= 2) {
                    return "lib/detectorData/img/field.png";
                }
                ;
            };
            $scope.getAnalImage = function (detector) {
                if (detector.bioAnalTier <= 2 || detector.chemAnalTier <= 2 || detector.radAnalTier <= 2) {
                    return "lib/detectorData/img/analytic.png";
                }
                ;
            };
            $scope.getDiagImage = function (detector) {
                if (detector.bioDiagTier <= 2 || detector.chemDiagTier <= 2 || detector.radDiagTier <= 2) {
                    return "lib/detectorData/img/diagnostic.png";
                }
                ;
            };

            $scope.totalDisplayed = 10;

            $scope.addMoreItem = function () {
                $scope.totalDisplayed += 10;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };
        })

        .controller('DetectorDetailsCtrl', function ($scope, $rootScope, $state, $stateParams, $ionicLoading) {

            //set the proper rad/chem/bio image
            switch ($rootScope.selected.type) {
                case "bio":
                    $scope.typeImage = "lib/detectorData/img/type-1.png";
                    break;
                case "chem":
                    $scope.typeImage = "lib/detectorData/img/type-2.png";
                    break;
                case "rad":
                    $scope.typeImage = "lib/detectorData/img/type-3.png";
                    break;
                case "bio & chem":
                    $scope.typeImage = "lib/detectorData/img/type-4.png";
                    break;
                case "bio & rad":
                    //no current detectors for this scenario, no image avail
                    break;
                case "bio & chem & rad":
                    $scope.typeImage = "lib/detectorData/img/type-6.png";
                    break;
                case "chem & rad":
                    $scope.typeImage = "lib/detectorData/img/type-7.png";
                    break;
                default:
                    $scope.typeImage = null;
            }

            //for the tier table
            //set the proper icons for Field use
            $scope.bioFieldTierImg = function (det) {
                switch (det.bioFieldTier) {
                    case "1":
                        return "lib/detectorData/img/tier1.png";
                        break;
                    case "2":
                        return "lib/detectorData/img/tier2.png";
                        break;
                    case "3":
                        return "lib/detectorData/img/tier3.png";
                        break;
                    case "4":
                        return "lib/detectorData/img/tier4.png";
                        break;
                    case "5":
                        return "lib/detectorData/img/tier5.png";
                        break;
                    default:
                        return "lib/detectorData/img/tier.png";
                }
            };
            $scope.chemFieldTierImg = function (det) {
                switch (det.chemFieldTier) {
                    case "1":
                        return "lib/detectorData/img/tier1.png";
                        break;
                    case "2":
                        return "lib/detectorData/img/tier2.png";
                        break;
                    case "3":
                        return "lib/detectorData/img/tier3.png";
                        break;
                    case "4":
                        return "lib/detectorData/img/tier4.png";
                        break;
                    case "5":
                        return "lib/detectorData/img/tier5.png";
                        break;
                    default:
                        return "lib/detectorData/img/tier.png";
                }
            };
            $scope.radFieldTierImg = function (det) {
                switch (det.radFieldTier) {
                    case "1":
                        return "lib/detectorData/img/tier1.png";
                        break;
                    case "2":
                        return "lib/detectorData/img/tier2.png";
                        break;
                    case "3":
                        return "lib/detectorData/img/tier3.png";
                        break;
                    case "4":
                        return "lib/detectorData/img/tier4.png";
                        break;
                    case "5":
                        return "lib/detectorData/img/tier5.png";
                        break;
                    default:
                        return "lib/detectorData/img/tier.png";
                }
            };

            //set the icons for mobile use
            $scope.bioMobTierImg = function (det) {
                switch (det.bioMobTier) {
                    case "1":
                        return "lib/detectorData/img/tier1.png";
                        break;
                    case "2":
                        return "lib/detectorData/img/tier2.png";
                        break;
                    case "3":
                        return "lib/detectorData/img/tier3.png";
                        break;
                    case "4":
                        return "lib/detectorData/img/tier4.png";
                        break;
                    case "5":
                        return "lib/detectorData/img/tier5.png";
                        break;
                    default:
                        return "lib/detectorData/img/tier.png";
                }
            };
            $scope.chemMobTierImg = function (det) {
                switch (det.chemMobTier) {
                    case "1":
                        return "lib/detectorData/img/tier1.png";
                        break;
                    case "2":
                        return "lib/detectorData/img/tier2.png";
                        break;
                    case "3":
                        return "lib/detectorData/img/tier3.png";
                        break;
                    case "4":
                        return "lib/detectorData/img/tier4.png";
                        break;
                    case "5":
                        return "lib/detectorData/img/tier5.png";
                        break;
                    default:
                        return "lib/detectorData/img/tier.png";
                }
            };
            $scope.radMobTierImg = function (det) {
                switch (det.radMobTier) {
                    case "1":
                        return "lib/detectorData/img/tier1.png";
                        break;
                    case "2":
                        return "lib/detectorData/img/tier2.png";
                        break;
                    case "3":
                        return "lib/detectorData/img/tier3.png";
                        break;
                    case "4":
                        return "lib/detectorData/img/tier4.png";
                        break;
                    case "5":
                        return "lib/detectorData/img/tier5.png";
                        break;
                    default:
                        return "lib/detectorData/img/tier.png";
                }
            };

            //set the icons for diag use
            $scope.bioDiagTierImg = function (det) {
                switch (det.bioDiagTier) {
                    case "1":
                        return "lib/detectorData/img/tier1.png";
                        break;
                    case "2":
                        return "lib/detectorData/img/tier2.png";
                        break;
                    case "3":
                        return "lib/detectorData/img/tier3.png";
                        break;
                    case "4":
                        return "lib/detectorData/img/tier4.png";
                        break;
                    case "5":
                        return "lib/detectorData/img/tier5.png";
                        break;
                    default:
                        return "lib/detectorData/img/tier.png";
                }
            };
            $scope.chemDiagTierImg = function (det) {
                switch (det.chemDiagTier) {
                    case "1":
                        return "lib/detectorData/img/tier1.png";
                        break;
                    case "2":
                        return "lib/detectorData/img/tier2.png";
                        break;
                    case "3":
                        return "lib/detectorData/img/tier3.png";
                        break;
                    case "4":
                        return "lib/detectorData/img/tier4.png";
                        break;
                    case "5":
                        return "lib/detectorData/img/tier5.png";
                        break;
                    default:
                        return "lib/detectorData/img/tier.png";
                }
            };
            $scope.radDiagTierImg = function (det) {
                switch (det.radDiagTier) {
                    case "1":
                        return "lib/detectorData/img/tier1.png";
                        break;
                    case "2":
                        return "lib/detectorData/img/tier2.png";
                        break;
                    case "3":
                        return "lib/detectorData/img/tier3.png";
                        break;
                    case "4":
                        return "lib/detectorData/img/tier4.png";
                        break;
                    case "5":
                        return "lib/detectorData/img/tier5.png";
                        break;
                    default:
                        return "lib/detectorData/img/tier.png";
                }
            };

            //set the anal images
            $scope.bioAnalTierImg = function (det) {
                switch (det.bioAnalTier) {
                    case "1":
                        return "lib/detectorData/img/tier1.png";
                        break;
                    case "2":
                        return "lib/detectorData/img/tier2.png";
                        break;
                    case "3":
                        return "lib/detectorData/img/tier3.png";
                        break;
                    case "4":
                        return "lib/detectorData/img/tier4.png";
                        break;
                    case "5":
                        return "lib/detectorData/img/tier5.png";
                        break;
                    default:
                        return "lib/detectorData/img/tier.png";
                }
            };
            $scope.chemAnalTierImg = function (det) {
                switch (det.chemAnalTier) {
                    case "1":
                        return "lib/detectorData/img/tier1.png";
                        break;
                    case "2":
                        return "lib/detectorData/img/tier2.png";
                        break;
                    case "3":
                        return "lib/detectorData/img/tier3.png";
                        break;
                    case "4":
                        return "lib/detectorData/img/tier4.png";
                        break;
                    case "5":
                        return "lib/detectorData/img/tier5.png";
                        break;
                    default:
                        return "lib/detectorData/img/tier.png";
                }
            };
            $scope.radAnalTierImg = function (det) {
                switch (det.radAnalTier) {
                    case "1":
                        return "lib/detectorData/img/tier1.png";
                        break;
                    case "2":
                        return "lib/detectorData/img/tier2.png";
                        break;
                    case "3":
                        return "lib/detectorData/img/tier3.png";
                        break;
                    case "4":
                        return "lib/detectorData/img/tier4.png";
                        break;
                    case "5":
                        return "lib/detectorData/img/tier5.png";
                        break;
                    default:
                        return "lib/detectorData/img/tier.png";
                }
            };

            $scope.addFavorite = function (id) {
                var user = Parse.User.current().addUnique("favArray", id);

                user.save(null, {
                    success: function () {
                        // Hooray! Saved
                        $ionicLoading.show({template: 'Added to favorites!', noBackdrop: true, duration: 2000});

                    },
                    error: function () {
                        // Show the error message somewhere and let the user try again.
                        $ionicLoading.show({template: 'Was not able to add to favorites!', noBackdrop: true, duration: 2000});
                    }
                });

            };

            $scope.addComment = function () {
                $state.go('app.comment');
            };

        })


        .controller('CommentCtrl', function ($scope) {
            $scope.submitComment = function (id, comment) {
                console.log(id, comment);

                var DetectComment = Parse.Object.extend("DetectorComment");

              
                var theComment = {
                    "id": id,
                    "comment": comment
                };
                
                /*
                var theComment2 = {
                    "id": id + 1,
                    "comment": comment + " yo"
                };
                */

                /*
                var userId = "" + Parse.User.current().id;
                console.log(userId);

                var comment = new DetectComment();
                
                comment.set("userId", userId.toString());
            
                comment.addUnique("comment", theComment);
                comment.addUnique("comment", theComment2);
                comment.save(null, {
                    success: function (object) {
                        console.log("success");
                    },
                    error: function (model, error) {
                        console.log(error);
                    }
                });
                
                */

                var user = Parse.User.current();
                
                var comment = new DetectComment();
                comment.addUnique("comment", theComment);
                comment.addUnique("comment", theComment2);
                
                comment.set("user", user);

                comment.save(null, {
                    success: function (object) {
                        console.log("success");
                    },
                    error: function (model, error) {
                        console.log(error);
                    }
                });


            };
        })

        .controller('AboutCtrl', function () {

        });
