var communityControllers = angular.module('communityControllers', []);

communityControllers.controller('QuestionsController', ['$rootScope' ,'$scope', '$http', '$location', 'QuestionsService','searchParam',
	function($rootScope, $scope, $http, $location, QuestionsService,searchParam) {
		//????
		$scope.searchInfo = searchParam.searchInfo;
		$scope.searchTag = searchParam.searchTag;
		//??Tab?
		$scope.activedTabId = 1;
		
		$scope.newTabId = 1;
		$scope.hotTabId = 2;
		$scope.unsolvedTabId = 3;
		$scope.articleTabId = 4;
		$scope.showDiff = false;//???false???????????? 
		
		$scope.newQuestions = QuestionsService.getNewQuestions({curPageNum:1,searchInfo:searchParam.searchInfo,searchTag:searchParam.searchTag},function(data){
			for (var i = 0; i < $scope.newQuestions.length; i++) {
				$scope.newQuestions[i].status = $scope.newQuestions[i].solveFlag ? "??" : "??";
				$scope.newQuestions[i].status_class = $scope.newQuestions[i].solveFlag ? "q-solved" : ($scope.newQuestions[i].answerNum > 0 ? "q-hasanswers" : "q-noanswers");
				$scope.newQuestions[i].tags = eval($scope.newQuestions[i].tags);
			}
		})
		
		$scope.tabClick = function(tabId){
			$scope.activedTabId = tabId;
			$scope.changePage(tabId,1);
		}
		
		$scope.changePage = function(tabId,curPageNum){
			if(tabId == 1){
				$scope.newQuestions = QuestionsService.getNewQuestions({curPageNum:curPageNum,searchInfo:searchParam.searchInfo,searchTag:searchParam.searchTag},function(data){
					for (var i = 0; i < $scope.newQuestions.length; i++) {
						$scope.newQuestions[i].status = $scope.newQuestions[i].solveFlag ? "??" : "??";
						$scope.newQuestions[i].status_class = $scope.newQuestions[i].solveFlag ? "q-solved" : ($scope.newQuestions[i].answerNum > 0 ? "q-hasanswers" : "q-noanswers");
						$scope.newQuestions[i].tags = eval($scope.newQuestions[i].tags);
					}
				})
			}else if(tabId == 2){
				$scope.collectedQuestions = QuestionsService.getCollectedQuestions({curPageNum:curPageNum,searchInfo:searchParam.searchInfo,searchTag:searchParam.searchTag},function(data){
					for (var i = 0; i < $scope.collectedQuestions.length; i++) {
						$scope.collectedQuestions[i].status = $scope.collectedQuestions[i].solveFlag ? "??" : "??";
						$scope.collectedQuestions[i].status_class = $scope.collectedQuestions[i].solveFlag ? "q-solved" : ($scope.collectedQuestions[i].answerNum > 0 ? "q-hasanswers" : "q-noanswers");
						$scope.collectedQuestions[i].tags = eval($scope.collectedQuestions[i].tags);
					}
				});
			}else if(tabId == 3){
				$scope.unsolvedQuestions = QuestionsService.getUnsolvedQuestions({curPageNum:curPageNum,searchInfo:searchParam.searchInfo,searchTag:searchParam.searchTag},function(data){
					for (var i = 0; i < $scope.unsolvedQuestions.length; i++) {
						$scope.unsolvedQuestions[i].status = "??";
						$scope.unsolvedQuestions[i].status_class = $scope.unsolvedQuestions[i].solveFlag ? "q-solved" : ($scope.unsolvedQuestions[i].answerNum > 0 ? "q-hasanswers" : "q-noanswers");
						$scope.unsolvedQuestions[i].tags = eval($scope.unsolvedQuestions[i].tags);
					}
				});
			}else if(tabId == 4){
				$scope.articles = QuestionsService.getArticles({curPageNum:curPageNum,searchInfo:searchParam.searchInfo,searchTag:searchParam.searchTag},function(data){
					for (var i = 0; i < $scope.articles.length; i++) {
						$scope.articles[i].status_class = $scope.articles[i].voteNum > 0 ? "a-hasvotes" : "a-novotes";
						$scope.articles[i].tags = eval($scope.articles[i].tags);
					}
				});
			}
		}
		
		$scope.searchQuestions = function(){
			angular.extend(searchParam, {searchInfo:$scope.searchInfo});
			//?????????????
			var path = $location.path()+"index.html";
			$location.path(path).replace();
		}
		
		//?????????
		$scope.showTitle = "????";
		$scope.expendFlag = true;
		$scope.hotQuestions = QuestionsService.getHotQuestions();
		$scope.hotTags = QuestionsService.getHotTags();
		$scope.getAllTags = function(){
			$scope.hotTags = QuestionsService.getAllTags({},function(data){
				$scope.showTitle = "????";
				$scope.expendFlag = false;
			});
		}
		$scope.tagClick = function(tagName){
			angular.extend(searchParam, {searchTag:tagName});
		}
	}
]);

communityControllers.controller('QuestionController', ['$rootScope', '$scope', '$routeParams', 'QuestionService', 'searchParam',
	function($rootScope, $scope, $routeParams, QuestionService, searchParam) {
		$(".vote-btn").tooltip();
		
		QuestionService.getQuestionDetail({
			questionId: $routeParams.questionId
		}, function(question) {
			$scope.question = question;
			$scope.question.tags = eval(question.tags);
			//????
			$("#questionContent").append(question.content);
			
			//????1
			$scope.question.viewNum += 1;
			$scope.addView();
			if($rootScope.nav_userName){
				if(question.userId == $rootScope.nav_userName){
					$rootScope.canSetQues = true;
					$rootScope.canCollect = false;
					$rootScope.showCancelCollected = false;
				}else{
					$rootScope.canSetQues = false;
					$rootScope.canCollect = true;
					QuestionService.hasCollected({
						userId:$rootScope.nav_userName,questionId:question.id
					},function(data){
						$rootScope.showCancelCollected = data.collected;
					});
				}
			}else{
				$rootScope.showCancelCollected = false;
			}
		})
		$scope.addView = function(){
			QuestionService.saveQuestionIndex(
				{
					questionId: $routeParams.questionId,
					questionIndex:"viewNum"
				},
				{
					viewNum:$scope.question.viewNum
				}
			);
		}
		//??
		$scope.collect = function() {
			$scope.question.collectNum += 1;
			QuestionService.saveQuestionIndex({
				questionId: $routeParams.questionId,
				questionIndex:"collectNum",
				userId:$rootScope.nav_userName
			},{
				collectNum:$scope.question.collectNum
			},function(){
				$rootScope.showCancelCollected = true;
			});
		}
		//????
		$scope.cancelCollected = function(){
			$scope.question.collectNum -= 1;
			
			QuestionService.cancelCollected({userId:$rootScope.nav_userName,questionId: $routeParams.questionId},null,function(){
				$rootScope.showCancelCollected = false;
			})
		}
		$scope.addVote = function() {
			var voteNum = $scope.question.voteNum + 1;
			$scope.setVoteNum(voteNum,1);
		}
		$scope.subVote = function() {
			var voteNum = $scope.question.voteNum - 1;
			$scope.setVoteNum(voteNum,0);
		}
		$scope.setVoteNum = function(voteNum,flag){
			var userName = $rootScope.nav_userName;
			
			if(!userName){
				$('#loginModal').modal('show');
			}else{
				//flag 1????0???
				QuestionService.saveQuestionIndex({
					questionId: $routeParams.questionId,
					userId: $rootScope.nav_userName,
					questionIndex:"voteNum"
				},{
					voteNum:voteNum,
					quesEval:flag
				},function(data){
					if(data.evalFlag == 0){
						alert("?????????");
					}else if(data.evalFlag == 1){
						alert("?????????");
					}else{
						$scope.question.voteNum = voteNum;
					}
				});
			}
		}
		//??????
		QuestionService.getSimilarQuestions({
			questionId: $routeParams.questionId
		}, function(data) {
			$scope.similarQuestions = data;
		});
		
		$scope.tagClick = function(tagName){
			angular.extend(searchParam, {searchTag:tagName});
		}
	}
]);

communityControllers.controller('AnswersController', ['$rootScope','$scope', '$routeParams', 'QuestionService',
	function($rootScope, $scope, $routeParams, QuestionService) {
		var ue = UE.getEditor('answerEditor',{
			toolbars: [
        		[	
        			'undo','redo','|',
        			'forecolor','backcolor','bold','italic','underline','|',
        			'link','blockquote','insertcode','simpleupload','|',
        			'insertorderedlist','insertunorderedlist','horizontal','|',
        			'preview'
        		]
        	]
		});
		
		QuestionService.getAnswers({
			questionId: $routeParams.questionId
		},function(data){
			$scope.answers = data;
		});
		
		$scope.submitAnswer = function(){
			var userName = $rootScope.nav_userName;
			
			if(!userName){
				$('#loginModal').modal('show');
			}else{
				var answer = {
					content : ue.getContent(),
					userId : userName
				};
				if(answer.content == ""){
					alert("?????????");
					return;
				}
				$("#submitAnswer").addClass("disabled");
				QuestionService.saveAnswer({
					questionId: $routeParams.questionId
				},answer,function(){
					//????????
					QuestionService.getAnswers({
						questionId: $routeParams.questionId
					},function(data){
						$scope.answers = data;
						ue.setContent("");
						$("#submitAnswer").removeClass("disabled");
					});
				});
			}
		}
		//??????????????????????????
		$scope.afterSetAccept = function(){
			QuestionService.getAnswers({
				questionId: $routeParams.questionId
			},function(data){
				$scope.answers = data;
			});
		}
	}
]);

communityControllers.controller('CommentsController', ['$rootScope', '$scope', 'CommentsService',
	function($rootScope, $scope, CommentsService) {
		CommentsService.getComments({
			answerId: $scope.answer.id
		}, function(data) {
			$scope.comments = data;
		})
		
		$scope.showComments = false;
		$scope.checkComment = function() {
			$scope.showComments = !$scope.showComments;
		}
		
		$scope.showReply = false;
		$scope.newComment = {
			answerId : $scope.answer.id,
			commentedUser : $scope.answer.userId
		};
		
		$scope.replyClick = function(comment) {
			$scope.showReply = true;
			//???????
			$scope.newComment.commentedUser = comment.userId;
		}
		$scope.deleteUser = function(){
			$scope.showReply = false;
			$scope.newComment.commentedUser = $scope.answer.userId;
		}
		
		$scope.submitComment = function(){
			var userName = $rootScope.nav_userName;
			
			if(!userName){
				$('#loginModal').modal('show');
			}else{
				var comment = {
					content : $scope.newComment.content,
					userId : userName,
					commentedUser:$scope.newComment.commentedUser
				};

				if(!comment.content || comment.content == "undefined"){
					alert("??????????");
					return;
				}
				$("#submitComment").addClass("disabled");
				
				CommentsService.saveComment({
					answerId: $scope.answer.id
				},comment,function(){
					//??????
					CommentsService.getComments({
						answerId: $scope.answer.id
					}, function(data) {
						$scope.comments = data;
						$scope.newComment.content = "";
						$("#submitComment").removeClass("disabled");
						$scope.deleteUser();
					})
				});
			}
		}
	}
]);

communityControllers.controller('UserInfoController', ['$rootScope', '$scope', '$routeParams','UserInfoService',
	function($rootScope, $scope, $routeParams, UserInfoService) {
		//????bug?????????????????????rootscope????????undefined,???????...
		$scope.canEditSignature = false;
		if($rootScope.nav_userName){
			if($rootScope.nav_userName==$routeParams.userName){
				$rootScope.showFocus = false;
			}else{
				$rootScope.showFocus = true;
				UserInfoService.getFocusFlag({
					userId:$rootScope.nav_userName,focusUserId:$routeParams.userName
				},function(data){
					$rootScope.canFocus = !data.focused;
				});
			}
		}else{
			$rootScope.showFocus = false;
			//?????????????bug
			$rootScope.$watch('nav_userName',function(){
				if($rootScope.nav_userName && $rootScope.nav_userName != $routeParams.userName){
					UserInfoService.getFocusFlag({
						userId:$rootScope.nav_userName,focusUserId:$routeParams.userName
					},function(data){
						$rootScope.canFocus = !data.focused;
					});
					$rootScope.showFocus = true;
				}
		    })
		}
		//??????
		UserInfoService.getUserInfo({
			userId:$routeParams.userName
		},function(data){
			$scope.userInfo = data;
			$scope.userInfo.signature = $scope.userInfo.signature?$scope.userInfo.signature:"????????????^.^";
			if(!data.bigImg){
				$scope.userInfo.bigImg = "img/headImg.png";
			}
		});
		
		$scope.setFocus = function(){
			UserInfoService.setFocus({
				userId : $rootScope.nav_userName,
				focusUserId : $routeParams.userName
			},null,function(){
				//?????????
				UserInfoService.getFans({userId:$routeParams.userName},function(data){
					$scope.fans = data;
					for(var i = 0; i < $scope.fans.length; i++){
						$scope.fans[i].smallImg = $scope.fans[i].smallImg ? $scope.fans[i].smallImg : "img/small.png";
					}
				},function(error){
					console.log(error);
				});
				$rootScope.canFocus = false;
			});		
		}
		
		$scope.cancelFocus = function(){
			UserInfoService.cancelFocus({
				userId : $rootScope.nav_userName,
				focusUserId : $routeParams.userName
			},null,function(){
				//?????????
				UserInfoService.getFans({userId:$routeParams.userName},function(data){
					$scope.fans = data;
					for(var i = 0; i < $scope.fans.length; i++){
						$scope.fans[i].smallImg = $scope.fans[i].smallImg ? $scope.fans[i].smallImg : "img/small.png";
					}
				},function(error){
					console.log(error);
				});
				$rootScope.canFocus = true;
			})
		}
		
		//??????
		UserInfoService.getFocuses({userId:$routeParams.userName},function(data){
			$scope.focuses = data;
			for(var i = 0; i < $scope.focuses.length; i++){
				$scope.focuses[i].smallImg = $scope.focuses[i].smallImg ? $scope.focuses[i].smallImg : "img/small.png";
			}
		},function(error){
			console.log(error);
		});
		UserInfoService.getFans({userId:$routeParams.userName},function(data){
			$scope.fans = data;
			for(var i = 0; i < $scope.fans.length; i++){
				$scope.fans[i].smallImg = $scope.fans[i].smallImg ? $scope.fans[i].smallImg : "img/small.png";
			}
		},function(error){
			console.log(error);
		});
		
		//??????
		$scope.editSignature = function(){
			$scope.canEditSignature = true;
			setTimeout(function(){
				$("#signatureInput").focus();
			},1);
		}
		//??????????????
		$scope.signatureInputBlur = function(){
			$scope.canEditSignature = false;
			var userInfo = {
    			userId : $routeParams.userName,
    			signature : $scope.userInfo.signature
    		}
    		UserInfoService.saveUserInfo({
				userId:$routeParams.userName
			},userInfo,function(){});
		}
		
		//?????
		$scope.uploadImg = function(){
			$("#uploadImgModal").modal('show');
			$scope.setCroper();
		}
		
		$scope.setCroper = function(){
			$scope.cropper = $(".cropper");
	
	  		$scope.cropper.cropper({
	    		aspectRatio: 1 / 1,
			    data: {
			      	x: 420,
			      	y: 50,
			      	width: 480,
			      	height: 480
			    },
	    		preview: ".preview"
			});
		}

		$scope.zoomIn = function(){
			$scope.cropper.cropper("zoom", 0.1);
		}
		$scope.zoomOut = function(){
			$scope.cropper.cropper("zoom", -0.1);
		}
		$scope.submitImg = function(){
			var bigImgUrl = $scope.cropper.cropper("getDataURL", {
      			width: 132,
      			height: 132
    		}),
    		smallImgUrl = $scope.cropper.cropper("getDataURL", {
      			width: 60,
      			height: 60
    		});

    		var userInfo = {
    			userId : $routeParams.userName,
    			bigImg : bigImgUrl,
    			smallImg : smallImgUrl
    		}
    		UserInfoService.saveUserInfo({
    				userId:$routeParams.userName
    			},userInfo,
    			function(){
    				//????
    				$scope.userInfo = UserInfoService.getUserInfo({
						userId:$routeParams.userName
					});
					$('#uploadImgModal').modal('hide');
    			}
    		);
		}
	}
]);

communityControllers.controller('selectImgController',['$scope',
	function($scope){
		var $inputImage = $("#inputImage");
		
	  	if (window.FileReader) {
	    	$inputImage.change(function() {
	      		var fileReader = new FileReader(),
	          	files = this.files,
	          	file;
	
		      	if (!files.length) {
		        	return;
		      	}
		
		      	file = files[0];
		
		      	if (/^image\/\w+$/.test(file.type)) {
		        	fileReader.readAsDataURL(file);
		        	fileReader.onload = function () {
		          		$scope.cropper.cropper("reset", true).cropper("replace", this.result);
		          		$inputImage.val("");
		        	};
		      	} else {
		        	showMessage("Please choose an image file.");
		      	}
	    	});
	  	} else {
	    	$inputImage.addClass("hide");
	  	}
	}
]);
communityControllers.controller('UserQuestionsController',['$scope','$rootScope','$location','$routeParams','QuestionsService','searchParam',
	function($scope,$rootScope,$location,$routeParams,QuestionsService,searchParam){
		$scope.activedTabId = 1;
		$scope.showDiff = true;//???false???????????? 
		
		$scope.askTabId = 1;
		$scope.answerTabId = 2;
		$scope.articleTabId = 3;
		$scope.collectTabId = 4;
		
		$scope.createdQuestions = QuestionsService.getUserCreatedQuestions({userId:$routeParams.userName},function(data){
			for (var i = 0; i < $scope.createdQuestions.length; i++) {
				$scope.createdQuestions[i].status = $scope.createdQuestions[i].solveFlag ? "??" : "??";
				$scope.createdQuestions[i].status_class = $scope.createdQuestions[i].solveFlag ? "q-solved" : ($scope.createdQuestions[i].answerNum > 0 ? "q-hasanswers" : "q-noanswers");
				$scope.createdQuestions[i].tags = eval($scope.createdQuestions[i].tags);
			}
		});
		
		$scope.tabClick = function(tabId){
			$scope.activedTabId = tabId;
			$scope.changePage(tabId,1);
		}
		
		$scope.changePage = function(tabId,curPageNum){
			if(tabId == $scope.askTabId){
				$scope.createdQuestions = QuestionsService.getUserCreatedQuestions({userId:$routeParams.userName},function(data){
					for (var i = 0; i < $scope.createdQuestions.length; i++) {
						$scope.createdQuestions[i].status = $scope.createdQuestions[i].solveFlag ? "??" : "??";
						$scope.createdQuestions[i].status_class = $scope.createdQuestions[i].solveFlag ? "q-solved" : ($scope.createdQuestions[i].answerNum > 0 ? "q-hasanswers" : "q-noanswers");
						$scope.createdQuestions[i].tags = eval($scope.createdQuestions[i].tags);
					}
				});
			}else if(tabId == $scope.answerTabId){
				$scope.answers = QuestionsService.getAnsweredQuestions({userId:$routeParams.userName},function(data){
					for (var i = 0; i < $scope.answers.length; i++) {
						$scope.answers[i].status = $scope.answers[i].solveFlag ? "??" : "??";
						$scope.answers[i].status_class = $scope.answers[i].solveFlag ? "q-solved" : ($scope.answers[i].answerNum > 0 ? "q-hasanswers" : "q-noanswers");
						$scope.answers[i].tags = eval($scope.answers[i].tags);
					}
				});
			}else if(tabId == $scope.articleTabId){
				$scope.articles = QuestionsService.getArticles({userId:$routeParams.userName},function(data){
					for (var i = 0; i < $scope.articles.length; i++) {
						$scope.articles[i].status_class = $scope.articles[i].upNum > 0 ? "a-hasvotes" : "a-novotes";
						$scope.articles[i].tags = eval($scope.articles[i].tags);
					}
				});
			}else if(tabId == $scope.collectTabId){
				$scope.collects = QuestionsService.getUserCollects({userId:$routeParams.userName},function(data){
					for (var i = 0; i < $scope.collects.length; i++) {
						//$scope.collects[i].status = $scope.collects[i].solveFlag ? "??" : "??";
						//$scope.collects[i].status_class = $scope.collects[i].solveFlag ? "q-solved" : ($scope.collects[i].answerNum > 0 ? "q-hasanswers" : "q-noanswers");
						$scope.collects[i].status_class = $scope.collects[i].voteNum > 0 ? "a-hasvotes" : "a-novotes";
						$scope.collects[i].tags = eval($scope.collects[i].tags);
					}
				});
				console.log($scope.collects);
			}
		}
		$scope.tagClick = function(tagName){
			angular.extend(searchParam, {searchTag:tagName});
		}
	}
]);

communityControllers.controller('askController',['$scope','$rootScope','$location','askService',
	function($scope,$rootScope,$location,askService){
		$scope.share = function(){
			$(".dropdown-label").text("??");
			$scope.placeholder = "????????";
			$scope.publishButton = "????";
		}
		$scope.ask = function(){
			$(".dropdown-label").text("??");
			$scope.placeholder = "??????????????????";
			$scope.publishButton = "????";
		}
		//??????backspace?????????????
		$(document).keydown(function(event){
			if(event.keyCode == 8){
				var evt = event.srcElement ? event.srcElement : event.target;
				if (evt.tagName.toUpperCase()!="INPUT" && evt.tagName.toUpperCase()!="TEXTAREA" && evt.tagName.toUpperCase()!="TEXT")   
		    	{   
		            event.preventDefault();
		        } 
		        if((evt.tagName.toUpperCase() == "INPUT" || evt.tagName.toUpperCase() == "TEXTAREA") && evt.readOnly == true){
		         	event.preventDefault();
		        }   
			}
		});
		$scope.question = {};
		$scope.question.title = "";
		$scope.question.tags = "";
		$scope.placeholder = "??????????????????";
		$scope.publishButton = "????";
		
		var ue = UE.getEditor('editor',{
			toolbars: [
        		[	
        			'undo','redo','|',
        			'forecolor','backcolor','bold','italic','underline','|',
        			'link','blockquote','insertcode','simpleupload','|',
        			'insertorderedlist','insertunorderedlist','horizontal','|',
        			'preview',
        			'fullscreen'
        		]
        	]
		});

		$scope.publishQuestion = function(){
			//var userName = $.cookie('userName');
			var userName = $rootScope.nav_userName;
			
			if(!userName){
				$('#loginModal').modal('show');
			}else{
				$scope.question.loginCode = userName;
				$scope.question.content = ue.getContent();
				if($scope.question.title == ""){
					if($scope.publishButton == "????"){
						alert("?????????");
					}else{
						alert("?????????");
					}
					return;
				}
				if($scope.question.tags==""){
					if($scope.publishButton == "????"){
						alert("???????????");
					}else{
						alert("???????????");
					}
					return;
				}
				if($scope.question.content==""){
					if($scope.publishButton == "????"){
						alert("???????????");
					}else{
						alert("???????????");
					}
					return;
				}
				$("#publishQuestion").addClass("disabled");
				
				if($scope.publishButton == "????"){
					askService.saveQuestion($scope.question).success(function(){
						//?????????
						$("#publishQuestion").removeClass("disabled");
						var path = $location.path().replace("/askQuestion","");
						$location.path(path).replace();
					});
				}else{
					askService.saveArticle($scope.question).success(function(){
						//?????????
						$("#publishQuestion").removeClass("disabled");
						var path = $location.path().replace("/askQuestion","");
						$location.path(path).replace();
					});
				}
			}
		}
	}
])

communityControllers.controller('loginController',['$scope','$routeParams','$rootScope','loginService','UserInfoService','QuestionService','ArticleService',
	function($scope,$routeParams,$rootScope,loginService,UserInfoService,QuestionService,ArticleService){
		$scope.login = function(){
			loginService.login($scope.username,$scope.password).success(
				function(data){
					if(data.isLogin == "-2"){
		        		alert("??????")
		        	}else if(data.isLogin == "-3"){
			        	alert("???????")
				    }else if(data.isLogin=="0"){
			        	loginCallback();
					}else{
						alert("????????")
					}
				}
			);
			var loginCallback = function(){
				$.cookie('userName',$scope.username,{path:"/"});
				$('#loginModal').modal('hide');
							
				$rootScope.nav_userName = $scope.username;
				if($rootScope.nav_userName){
					$rootScope.nav_hasLogin = !$rootScope.nav_hasLogin;
				}
				
				$rootScope.showFocus = true;
				if($routeParams.userName){
					//?userInfo????????????
					if($routeParams.userName==$rootScope.nav_userName){
						$rootScope.showFocus = false;
					}else{
						UserInfoService.getFocusFlag({
							userId:$rootScope.nav_userName,focusUserId:$routeParams.userName
						},function(data){
							$rootScope.canFocus = !data.focused;
						});
					}
				}
				if($routeParams.questionId){
					QuestionService.getQuestionDetail({
						questionId: $routeParams.questionId
					}, function(question) {
						if(question.userId == $rootScope.nav_userName){
							$rootScope.canSetQues = true;
							$rootScope.canCollect = false;
							$rootScope.showCancelCollected = false;
						}else{
							$rootScope.canCollect = true;
							QuestionService.hasCollected({
								questionId: $routeParams.questionId,
								userId:$rootScope.nav_userName
							}, function(data) {
								$rootScope.showCancelCollected = data.collected;
							});
						}
					});
				}else if($routeParams.articleId){
					ArticleService.getArticleDetail({
						shareId: $routeParams.articleId
					}, function(article) {
						if(article.userId == $rootScope.nav_userName){
							$rootScope.canCollect = false;
							$rootScope.showCancelCollected = false;
						}else{
							$rootScope.canCollect = true;
							ArticleService.hasCollected({
								userId:$rootScope.nav_userName,
								shareId:article.shareId
							}, function(data) {
								$rootScope.showCancelCollected = data.collected;
							});
							ArticleService.hasVoted({
								userId:$rootScope.nav_userName,
								shareId:article.shareId
							}, function(data) {
								if(data.evalFlag == -1){
									//????????
									$rootScope.canVote = true;
								}else{
									$rootScope.canVote = false;
								}
							})
						}
					});
				}
			}
		}
	}
])

communityControllers.controller('navController',['$scope','$rootScope','searchParam',
	function($scope,$rootScope,searchParam){
		$rootScope.nav_hasLogin = false;
		
		var userName = $.cookie('userName');
		if(userName){
			$rootScope.nav_hasLogin = true;
			$rootScope.nav_userName = userName;
		}
		
		$scope.login = function(){
			$('#loginModal').modal('show');
		}
		$scope.logout = function(){
			$.cookie('userName',"",{path:"/"});
			$rootScope.nav_hasLogin = false;
			$rootScope.nav_userName = "";
			$rootScope.showFocus = false;
			$rootScope.canSetQues = false;
			//???????????????????????????????????
			$rootScope.canCollect = false;
			$rootScope.showCancelCollected = false;
		}
		$scope.communityClick = function(){
			//?????tagName="";
			angular.extend(searchParam, {searchTag:""});
			angular.extend(searchParam, {searchInfo:""});
		}
	}
])

communityControllers.controller('ArticleController',['$scope','$rootScope','$routeParams','ArticleService',
	function($scope,$rootScope,$routeParams,ArticleService){
		$scope.article = ArticleService.getArticleDetail({
			shareId: $routeParams.articleId
		}, function(article) {
			$scope.article.tags = eval(article.tags);
			//????
			$("#articleContent").append(article.content);
			
			//????1
			$scope.article.viewNum += 1;
			$scope.addView();
			$rootScope.canVote = false;
			if($rootScope.nav_userName){
				if(article.userId == $rootScope.nav_userName){
					$rootScope.canCollect = false;
					$rootScope.showCancelCollected = false;
				}else{
					$rootScope.canCollect = true;
					ArticleService.hasCollected({
						userId:$rootScope.nav_userName,
						shareId:article.shareId
					},function(data){
						$rootScope.showCancelCollected = data.collected;
					});
					ArticleService.hasVoted({
						userId:$rootScope.nav_userName,
						shareId:article.shareId
					}, function(data) {
						if(data.evalFlag == -1){
							//????????
							$rootScope.canVote = true;
						}
					})
				}
			}else{
				$rootScope.showCancelCollected = false;
			}
		});
		
		$scope.addView = function(){
			ArticleService.saveArticleIndex(
				{
					shareId: $routeParams.articleId,
					shareIndex:"viewNum"
				},
				{
					viewNum:$scope.article.viewNum
				}
			);
		}
		
		//??
		$scope.collect = function() {
			$scope.article.collectNum += 1;
			ArticleService.saveArticleIndex({
				shareId: $routeParams.articleId,
				shareIndex:"collectNum",
				userId:$rootScope.nav_userName
			},{
				collectNum:$scope.article.collectNum
			},function(){
				$rootScope.showCancelCollected = true;
			});
		}
		
		//????
		$scope.cancelCollected = function(){
			$scope.article.collectNum -= 1;
			
			ArticleService.cancelCollected({userId:$rootScope.nav_userName,shareId: $routeParams.articleId},null,function(){
				$rootScope.showCancelCollected = false;
			})
		}
		
		$scope.vote = function() {
			var voteNum = $scope.article.upNum + 1;
			var userName = $rootScope.nav_userName;
			
			if(!userName){
				$('#loginModal').modal('show');
			}else{
				//flag 1????0???
				ArticleService.saveArticleIndex({
					shareId: $routeParams.articleId,
					userId: $rootScope.nav_userName,
					shareIndex:"voteNum"
				},{
					voteNum:voteNum,
					quesEval:1
				},function(data){
					$rootScope.canVote = false;
				});
			}
		}
		
		$scope.newComment = {
			commentedUser : $scope.article.userId
		};
		
		ArticleService.getComments({
			shareId: $routeParams.articleId
		}, function(data) {
			$scope.comments = data;
		});
		
		$scope.submitComment = function(){
			var userName = $rootScope.nav_userName;
			
			if(!userName){
				$('#loginModal').modal('show');
			}else{
				var comment = {
					content : $scope.newComment.content,
					userId : userName,
					commentedUser:$scope.newComment.commentedUser ? $scope.newComment.commentedUser : $scope.article.userId
				};
				
				if(!comment.content || comment.content == "undefined"){
					alert("??????????");
					return;
				}
				$("#submitComment").addClass("disabled");
				
				ArticleService.saveComment({
					shareId: $routeParams.articleId
				},comment,function(){
					//??????
					ArticleService.getComments({
						shareId: $routeParams.articleId
					}, function(data) {
						$scope.comments = data;
						$scope.newComment.content = "";
						$("#submitComment").removeClass("disabled");
						$scope.deleteUser();
					})
				});
			}
		}
		
		$scope.deleteUser = function(){
			$scope.showReply = false;
			$scope.newComment.commentedUser = $scope.article.userId;
		}
		
		$scope.replyClick = function(comment) {
			$scope.showReply = true;
			//???????
			$scope.newComment.commentedUser = comment.userId;
		}
	}
])