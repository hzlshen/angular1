var communityServices = angular.module('communityServices',[
		'ngResource'
	]);

communityServices.factory('QuestionsService',['$resource', 
	function($resource){
		//return $resource('data/questions/:type/questions.json',{type:'@type'});
		return $resource(
			'/UEP-PUB/community/communityAction.do',
			{
				curPageNum:'@curPageNum',
				searchInfo:'@searchInfo',
				userId:'@userId'
			},
			{
				getNewQuestions : {
					method:"GET",
					params:{action: 'getAllQuestions'},
					isArray:true
				},
				getCollectedQuestions : {
					method:"GET",
					params:{action: 'getCollectedQuestions'},
					isArray:true
				},
				getUnsolvedQuestions : {
					method:"GET",
					params:{action: 'getUnSolvedQuestions'},
					isArray:true
				},
				getAnsweredQuestions : {
					method:"GET",
					params:{action: 'getAnsweredQues'},
					isArray:true
				},
				getArticles : {
					method:"GET",
					params:{action: 'getAllShares'},
					isArray:true
				},
				getUserCreatedQuestions : {
					method:"GET",
					params:{action: 'getUserCreatedQuestions'},
					isArray:true
				},
				getUserCollects : {
					method:"GET",
					params:{action: 'getUserCollects'},
					isArray:true
				},
				getHotQuestions : {
    				method:"GET",
					params:{action: 'getHotQuestions'},
					isArray:true
    			},
    			getHotTags : {
    				method:"GET",
					params:{action: 'getHotTags'},
					isArray:true
    			},
    			getAllTags : {
    				method:"GET",
					params:{action: 'getAllLables'},
					isArray:true
    			}
			}
		)
	}]);

communityServices.factory('UserInfoService',['$resource', 
	function($resource){
		return $resource('/UEP-PUB/community/userAction.do', 
			{
				userId:'@userId'
			},
			{
				getUserInfo : {
					method:"GET",
					params:{action: 'getCurUserImg'},
					isArray:false
				},getFocuses : {
					method:"GET",
					params:{action: 'getFocusUserImgs'},
					isArray:true
				},getFans : {
					method:"GET",
					params:{action: 'getFanUserImgs'},
					isArray:true
				},saveUserInfo : {
					method:"POST",
  					params:{action: 'saveInfo'},
  					headers:{
						'X-Requested-With':'XMLHttpRequest',
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					},
					transformRequest: function(obj) {  
						var str = [];  
						for(var p in obj){  
							str.push("userInfoMap."+encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
						}  
						return str.join("&");  
					}
				},setFocus : {
					method:"POST",
					params:{action: 'focusUser',focusUserId:'@focusUserId'},
					headers:{
						'X-Requested-With':'XMLHttpRequest',
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					}
				},cancelFocus : {
					method:"POST",
					params:{action: 'unFocusUser',focusUserId:'@focusUserId'},
					headers:{
						'X-Requested-With':'XMLHttpRequest',
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					}
				},getFocusFlag : {
					method:"GET",
					params:{action: 'hasFocused'},
					isArray:false
				}
			});
	}]);

communityServices.factory('QuestionService',['$resource', 
  	function($resource){
  		return $resource(
  			'/UEP-PUB/community/communityAction.do',
  			{questionId : "@questionId"},
  			{
  				getQuestionDetail : {
  					method:"GET",
					params:{action: 'getQuestion'},
					isArray:false
  				},
  				saveQuestionIndex : {
  					method:"POST",
  					params:{action: 'saveQuestionIndex'},
  					headers:{
						'X-Requested-With':'XMLHttpRequest',
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					},
					transformRequest: function(obj) {  
						var str = [];  
						for(var p in obj){  
							str.push("questionIndexMap."+encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
						}  
						return str.join("&");  
					}
  				},
  				getAnswers : {
  					method:"GET",
					params:{action: 'getAllAnswers'},
					isArray:true
  				},
  				saveAnswerIndex : {
  					method:"POST",
  					params:{action: 'saveAnswerIndex'},
  					headers:{
						'X-Requested-With':'XMLHttpRequest',
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					},
					transformRequest: function(obj) {  
						var str = [];  
						for(var p in obj){  
							str.push("answerIndexMap."+encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
						}  
						return str.join("&");  
					}
  				},
  				saveAnswer : {
  					method:"POST",
					params:{action: 'saveAnswer'},
					headers:{
						'X-Requested-With':'XMLHttpRequest',
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					},
					transformRequest: function(obj) {  
						var str = [];  
						for(var p in obj){  
							str.push("answerMap."+encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
						}  
						return str.join("&");  
					}
  				},
  				acceptAnswer : {
  					method:"POST",
					params:{action: 'solveQuestion'},
					headers:{
						'X-Requested-With':'XMLHttpRequest',
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					}
  				},
  				cancelAccept : {
  					method:"POST",
					params:{action: 'cancleSolveAnswer'},
					headers:{
						'X-Requested-With':'XMLHttpRequest',
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					}
  				},hasCollected : {
					method:"GET",
					params:{action: 'hasCollected'},
					isArray:false
				},cancelCollected : {
					method:"POST",
					params:{action: 'cancleQuestionCollected',questionId:'@questionId'},
					headers:{
						'X-Requested-With':'XMLHttpRequest',
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					}
				},
				getSimilarQuestions : {
    				method:"GET",
					params:{action: 'getSimilarQuestions'},
					isArray:true
    			}
  			}
  		);
  	}]);

communityServices.factory('ArticleService',['$resource',
	function($resource){
  		return $resource(
  			'/UEP-PUB/community/communityAction.do',
  			{shareId : "@articleId"},
  			{
				getArticleDetail : {
    				method:"GET",
					params:{action: 'getShareDetail'},
					isArray:false
    			}
    			,getComments : {
    				method:"GET",
					params:{action: 'getShareComments'},
					isArray:true
    			}
    			,saveComment : {
  					method:"POST",
					params:{action: 'saveComment'},
					headers:{
						'X-Requested-With':'XMLHttpRequest',
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					},
					transformRequest: function(obj) {  
						var str = [];  
						for(var p in obj){  
							str.push("commentMap."+encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
						}  
						return str.join("&");  
					}
  				}
  				,saveArticleIndex : {
					method:"POST",
					params:{action: 'saveShareIndex'},
					headers:{
						'X-Requested-With':'XMLHttpRequest',
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					},
					transformRequest: function(obj) {  
						var str = [];  
						for(var p in obj){  
							str.push("shareIndexMap."+encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
						}  
						return str.join("&");  
					}
				}
				,cancelCollected : {
					method:"POST",
					params:{action: 'cancleShareCollected',shareId:'@shareId'},
					headers:{
						'X-Requested-With':'XMLHttpRequest',
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					}
				}
				,hasCollected : {
					method:"GET",
					params:{action: 'hasCollected'},
					isArray:false
				}
				,hasVoted : {
					method:"GET",
					params:{action: 'getShareEval'},
					isArray:false
				}
  			}
  		);
	}
])


communityServices.factory('CommentsService',['$resource', 
  	function($resource){
//    	return $resource('data/commons/:answerId.json',{
//      		answers: "@answerId"
//    	});
  		return $resource(
  			'/UEP-PUB/community/communityAction.do',
  			{answerId : "@answerId"},
  			{
  				getComments : {
  					method:"GET",
					params:{action: 'getAllComments'},
					isArray:true
  				},
  				saveComment : {
  					method:"POST",
					params:{action: 'saveComment'},
					headers:{
						'X-Requested-With':'XMLHttpRequest',
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					},
					transformRequest: function(obj) {  
						var str = [];  
						for(var p in obj){  
							str.push("commentMap."+encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
						}  
						return str.join("&");  
					}
  				}
  			}
  		);
  	}]);

communityServices.factory('askService',['$resource', '$http',
  function($resource,$http){
    return {
    	saveQuestion : function(question){
    		return $http({
				method:"POST",
				url:"/UEP-PUB/community/communityAction.do",
				params:{
					action:"saveQuestion"
				},
				data:question,
				headers:{
					'X-Requested-With':'XMLHttpRequest',
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				transformRequest: function(obj) {  
					var str = [];  
					for(var p in obj){  
						str.push("questionMap."+encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
					}  
					return str.join("&");  
				}
			});
    	},
    	saveArticle : function(question){
    		return $http({
				method:"POST",
				url:"/UEP-PUB/community/communityAction.do",
				params:{
					action:"saveNewShare"
				},
				data:question,
				headers:{
					'X-Requested-With':'XMLHttpRequest',
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				transformRequest: function(obj) {  
					var str = [];  
					for(var p in obj){  
						str.push("questionMap."+encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
					}  
					return str.join("&");  
				}
			});
    	}
    };
  }]);
  
communityServices.factory('loginService',['$http',
	function($http){
		return {
			login : function(username,password){
				return $http({
					method:"POST",
					url:"/UEP-PUB/pubclient/userLogin.do",
					params:{
						action:"login"
					},
					data:{
						"userName":username,
						"userPassword":password
					},
					headers:{
						'X-Requested-With':'XMLHttpRequest',
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					},
					transformRequest: function(obj) {  
						var str = [];  
						for(var p in obj){  
							str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
						}  
						return str.join("&");  
					}
				});
			}
		};
	}
])