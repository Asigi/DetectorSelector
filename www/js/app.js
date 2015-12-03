// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('DetectorSelector', ['ionic', 'DetectorSelector.controllers', 'DetectorSelector.services', 'ngSanitize', 'ngIOS9UIWebViewPatch'])

        .run(function ($ionicPlatform, $rootScope) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)


                Parse.initialize("vNjxA8HNaeiyoMcTvZsW246oW1sFjqUrHEJzYBqv",
                        "1K4Y79A83J8fKVePwxIrXTqHi2mu8ntsdMDGUkUv");

                if ($rootScope.loggedIn === true) {
                    Parse.User.logOut();
                    console.log("user was logged out");
                }

                $rootScope.loggedIn = false;



                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
            });
        })

        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider

                    .state('app', {
                        url: "/app",
                        abstract: true,
                        templateUrl: "templates/menu.html",
                        controller: 'MenuCtrl'
                    })

                    .state('app.home', {
                        url: "/home",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/home.html",
                                controller: 'HomeCtrl'
                            }
                        }
                    })

                    .state('app.about', {
                        url: "/about",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/about.html",
                                controller: 'AboutCtrl'
                            }
                        }
                    })

                    .state('app.search', {
                        url: "/search",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/search.html",
                                controller: "SearchCtrl"
                            }
                        }
                    })

                    .state('app.login', {
                        url: "/login",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/login.html",
                                controller: "LoginCtrl"
                            }
                        }
                    })

                    .state('app.newAccount', {
                        url: "/newAccount",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/newAccount.html",
                                controller: "NewAccountCtrl"
                            }
                        }
                    })
                    .state('app.scenario', {
                        url: "/scenario",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/scenario.html",
                                controller: 'ScenarioCtrl'
                            }
                        }
                    })

                    .state('app.type', {
                        url: "/type",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/type.html",
                                controller: 'TypeCtrl'
                            }
                        }
                    })

                    .state('app.detectors', {
                        url: "/detectors/:scenario",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/detectors.html",
                                controller: 'DetectorsCtrl'
                            }
                        }
                    })

                    .state('app.comment', {
                        url: "/comment",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/comment.html",
                                controller: 'CommentCtrl'
                            }
                        }
                    })
                    .state('app.details', {
                        url: "/detectors/:detectorDetails",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/detectorDetails.html",
                                controller: 'DetectorDetailsCtrl'
                            }
                        }
                    });
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/home');
        });
