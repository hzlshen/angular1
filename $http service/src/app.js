/**
 * Created by JMTJ on 2017/1/17.
 */
//����
var module=angular.module('freefedApp',['freefedService'])
    .config('userServiceProvider',['userServiceProvider', function (userServiceProvider) {
        //������ϣ����Ӧ�õ�ǰ�򿪶�service�������õ�ʱ�����Ҫʹ�õ�provider()
        userServiceProvider.baseUrl = 'http://product.freefed.com';
}]);


//����module
/*
module.controller('userCtrl',['$scope','ajaxService', function ($scope, ajaxService) {
    var vm = $scope.vm = $scope.vm || {};
    vm.user={};
    //����ajaxService�ķ���
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
    //����userService����
    userService.getUser();
}])
