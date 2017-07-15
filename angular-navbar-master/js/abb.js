/**
 * Created by JMTJ on 2017/1/9.
 */
var myapp = angular.module("myapp",[]);
myapp.run(['$rootScope',function($rootScope){
    $rootScope.nativeId=getCurrentNativeId();
    function getCurrentNativeId(){
        var str = "#/index";
        var href=window.location.href;
        var index = href.indexOf("#/");
        if(index != -1){
            str = href.substring(index,href.length);
        }
        return str;
    }
}])
myapp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {//��ҳ·��                   //����ָ��ui-sref="***"  ���á�.������Ӧ��/�����������ݣ�
            url: '/home',                            //����ָ���ص�ַ��#/���������   {�ɴ�����}
            views: {
                '': {
                    templateUrl: 'home.html'    //����ָ��ʹ�õĸ���ģ��
                },
                '11@home': {
                    templateUrl: 'tmpls/11.html'       //����ָ�򸸼�ģ����ʹ�õ�ģ��
                },
                '22@home': {
                    templateUrl: 'tmpls/22.html'
                },
                'gameTopics@home': {
                    templateUrl: 'tmpls/33.html'
                },
                '44@home': {
                    templateUrl: 'tmpls/44.html'
                },
                '55@home': {
                    templateUrl: 'tmpls/55.html'
                }
            }
        })
})
myapp.directive('native',['$rootScope',function($rootScope,$cookies){
    return{
        restrict:'A',
        link:function(scope,element,attrs){
            element.bind('click', function () {
                scope.$apply(function(){
                    $rootScope.nativeId = attrs.href;
                });
            })
        }
    }
}]);