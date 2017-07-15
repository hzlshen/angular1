
app.controller('helloCtrl', function ($scope, demoService) { //注入service
    $scope.author = demoService.publicAuthor;   //获取私有属性
    $scope.updatePublic = function () {  //更新数据
        demoService.publicAuthor={
            name:'fei',
            sex:'femaile'
        }
        $scope.author = demoService.publicAuthor;
    }
})
app.controller('worldCtrl', function ($scope, demoService) {
    $scope.author = demoService.publicAuthor;//获取公有属性
    $scope.update = function () {
        $scope.author = demoService.publicAuthor;
    }
})