/**
 * Created by JMTJ on 2017/1/17.
 */
    //service
/*angular.module('freefedService',[]).factory('ajaxService',['$http','$q', function ($http, $q) {
    var deferred = $q.defer();
    return {
        ajaxFunc: function (params) {
            var params = params || {};
            $http({
                method:params.method || 'post',
                url:params.url || '',
                data:params.data || {},
                responseType:params.type || 'json'
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        }
    }
}]);*/


    angular.module('freefedService',[]).provider('userService', function () {
        var baseUrl= 'http//:dev.freefed.com'
        this.setUrl = function (base) {
            baseUrl= base || baseUrl;
        }
        this.$get = function ($http) {//依赖注入在此加入
            return {
                getUser : function () {
                    $http({
                        url:baseUrl + '/getUser.php'
                    });
                }
            };
        };
    });




/*angular.module('freefedService',[]).service('myService', function () {
    this.getUser= function () {

    }
});*/

/*angular.module('freefedService',[]).service('myService', function () {
    var _version = '1.1.0';//私有属性
    var _method = function () {//私有方法
        return new function(){
            this.getVersion = function () {
                return _version;
            }
            this.method= function () {
                _method();//调用私有方法
            }
        };
    };
});


//普通事例
angular.module('freefedService',[]).factory('myService', function () {
    return {
        getUser: function () {

        }
    };
});

angular.module('freefedService',[]).provider('myService', function () {
    this.setUrl = function () {

    };
    this.$get = function ($http) { //依赖注入在此加入
        return {
            getUser: function () {

            }
        };
    };
});*/

/*
angular.module('freefedService',[]).provider('myService',{
    setUrl : function(){};
    $get: function( $http ){   //依赖注入在此加入
    return {
        getUser :  function(){}
        };
    };
});
*/




























