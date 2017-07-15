/**
 * Created by JMTJ on 2017/1/17.
 */
//声明
var module=angular.module('freefedApp',['freefedService'])
    .config('userServiceProvider',['userServiceProvider', function (userServiceProvider) {
        //当我们希望在应用当前打开对service进行配置的时候就需要使用到provider()
        userServiceProvider.baseUrl = 'http://product.freefed.com';
}]);


//声明module
/*
module.controller('userCtrl',['$scope','ajaxService', function ($scope, ajaxService) {
    var vm = $scope.vm = $scope.vm || {};
    vm.user={};
    //调用ajaxService的服务
    ajaxService.ajaxFunc({
        url:'/getUser.php'
    }).then(function (data) {
        vm.user.pic = data.pic;
        vm.username= data.name;
    }, function (error) {
        alert(error.msg);
    })
}]);*/

module.controller('userCtrl',['$scope','userService', function ($scope, userService) {
    var vm = $scope.vm = $scope.vm || {};
    vm.user = {};
    //调用userService服务
    userService.getUser();
}])
