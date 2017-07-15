'use strict';

var page2 = angular.module('page2', ['ui.bootstrap', 'ngRoute']);

page2.config(['$routeProvider', '$locationProvider', '$sceProvider', function ($routeProvider, $locationProvider, $sceProvider) {
    $routeProvider
        .when('/', {controller: 'DemoCtrl'})
        .when('/abc', {controller: 'DemoCtrl'})
        .when('/123', {controller: 'DemoCtrl'})
        .otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
}]);

page2.controller('NavbarCtrl', function ($scope, $location) {
    $scope.isActive = function (route) {
        if ($location.path().indexOf('/dropdown') == 0) {
            return  route === '/dropdown';
        }
        return route === $location.path();
    }
});

page2.controller('DemoCtrl', function () {
    // nothing
});


var page4 = angular.module('page4', ['ui.bootstrap', 'ngRoute']);

page4.config(['$routeProvider', '$locationProvider', '$sceProvider', function ($routeProvider, $locationProvider, $sceProvider) {
    $routeProvider
        .when('/', {controller: 'DemoCtrl'})
        .otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
}]);

page4.controller('NavbarCtrl', function ($scope,$http,$location) {
    $http.get("/js/nav.json").success(function(json){
        $scope.navbar = json;
    });
});

page4.controller('DemoCtrl', function () {
    // nothing
});

