var community = angular.module('community', [
		"ngRoute",
		"ngCookies",
		"communityControllers",
		"communityServices",
		"communityDirectives",
		"communityFilters"
	]);

community.config(["$routeProvider", "$httpProvider",
	function($routeProvider,$httpProvider){
		// Initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
 
        // Enables Request.IsAjaxRequest() in ASP.NET MVC
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
 
        // Disable IE ajax request caching
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        
		$routeProvider.when("/community",{
			templateUrl: 'templates/community.html',
			controller: 'QuestionsController'
		}).when('/community/askQuestion',{
			templateUrl: 'templates/ask.html',
			controller: 'askController'
		}).when('/community/question/:questionId',{
			templateUrl: 'templates/questionDetail.html',
			controller: 'QuestionController'
		}).when('/community/article/:articleId',{
			templateUrl: 'templates/articleDetail.html',
			controller: 'ArticleController'
		}).when('/community/userInfo/:userName',{
			templateUrl: 'templates/userInfo.html',
			controller: 'UserInfoController'
		}).otherwise({
			redirectTo : '/community'
		})
	}]);
	
community.value('searchParam',{
	searchTag:"",
	searchInfo:""
});