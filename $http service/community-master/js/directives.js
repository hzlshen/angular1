var communityDirectives = angular.module('communityDirectives',[]);

communityDirectives.directive('questionItem',
	function(){
		return {
			restrict : 'EA',
			scrope: {},
			//replace : true,//这个地方设为true就报错啊...
			templateUrl: 'templates/question.html'
		}
	}
);
communityDirectives.directive('articleItem',
	function(){
		return {
			restrict : 'EA',
			scrope: {},
			//replace : true,//这个地方设为true就报错啊...
			templateUrl: 'templates/article.html'
		}
	}
);
communityDirectives.directive('answerItem',
	function(){
		return {
			restrict : 'EA',
			templateUrl : 'templates/answer.html',
			scope : {
				answer : "=",
				afterSetAccept :　"&"
			},
			controller :　function($rootScope,$scope,QuestionService){
				$(".vote-btn").tooltip();
				$rootScope.$watch('canSetQues',function(){
					$scope.hasRight = $rootScope.canSetQues;
				});
				$scope.solved = $scope.answer.solveFlag == "1";
				
				//采纳答案
				$scope.acceptAnswer = function(){
					$scope.solved = true;
					//设置该问题采纳
					QuestionService.acceptAnswer({
						answerId : $scope.answer.id
					},null,function(){
						$scope.afterSetAccept();
					});
				}
				//取消采纳
				$scope.cancelAccept = function(){
					$scope.solved = false;
					//取消该问题采纳
					QuestionService.cancelAccept({
						answerId : $scope.answer.id
					},null,function(){
						$scope.afterSetAccept();
					});
				}
				
				$scope.addVote = function() {
					var voteNum = $scope.answer.voteNum + 1;
					$scope.setVoteNum(voteNum,1);
				}
				$scope.subVote = function() {
					var voteNum = $scope.answer.voteNum - 1;
					$scope.setVoteNum(voteNum,0);
				}
				$scope.setVoteNum = function(voteNum,flag){
					//flag 1表示顶，0表示踩
					var userName = $rootScope.nav_userName;
			
					if(!userName){
						$('#loginModal').modal('show');
					}else{
						QuestionService.saveAnswerIndex({
							answerId : $scope.answer.id,
							userId : $rootScope.nav_userName,
							answerIndex : "voteNum"
						},{
							voteNum:voteNum,
							answerEval:flag
						},function(data){
							console.log(data);
							if(data.evalFlag == 0){
								alert("该回答您已经踩过！");
							}else if(data.evalFlag == 1){
								alert("该回答您已经顶过！");
							}else{
								$scope.answer.voteNum = voteNum;
							}
						});
					}
				}
			}
		}
	}
);

communityDirectives.directive('pubNav',
	function(){
		return {
			restrict : 'EA',
			templateUrl : 'templates/nav.html'
		}
	}
);

communityDirectives.directive('loginDialog',
	function(){
		return {
			restrict : 'EA',
			templateUrl : 'templates/loginDialog.html'
		}
	}
);

communityDirectives.directive('expander',
	function(){
		return {
			restrict : 'EA',
			replace : true,
			transclude : true,
			controller:function($http){
				this.getLabels = function(){
					return $http({
						method:"POST",
						url:"/UEP-PUB/community/communityAction.do",
						params:{
							action:"getAllLables"
						},
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
			},
			template : '<div class="label-expander mb-10">'+
							'<input class="title" ng-readonly="true" ng-model="question.tags" ng-click="expanderToggle()" placeholder="选择标签"></input>'+
							'<div class="body" ng-show="showMe"></div>'+
					   '</div>',
			link : function(scope,iElement,iAttrs,controller){
				scope.showMe = false;
				scope.question.tags = "";
				
				scope.expanderToggle = function(){
					if(iElement.children().eq(1).children().length == 0){
						scope.setLabel();
					}
					scope.showMe = !scope.showMe;
					iElement.toggleClass('mb-10');
				}
				
				scope.setLabel = function(){
					var promise = controller.getLabels();
					promise.success(function(data){
						var titleElement = iElement.children().eq(0);
						var bodyElement = iElement.children().eq(1);
						
						var bodyHtml = "";
						for(var i = 0; i < data.length; i++){
							bodyHtml = bodyHtml + '<span class="cus-label">'+data[i].name+'</span>';
						}
						bodyElement.append(bodyHtml);
						
						var lables = bodyElement.children();
						lables.bind("click",function(){
							$(this).toggleClass('label-selected');
							
							var label = $(this).text() + "  ";
							if($(this).hasClass('label-selected')){
								scope.$apply(function(){
									scope.question.tags = scope.question.tags + label;
								});
							}else{
								var labelArr = scope.question.tags.split(label);
								var text = "";
								for(var i = 0; i < labelArr.length; i++){
									text = text + labelArr[i];
								}
								scope.$apply(function(){
									scope.question.tags = text;
								});
							}
						})
					});
				}
			}
		}
	}
);

communityDirectives.directive('pagination',
	function(){
		return {
			restrict : 'EA',
			replace : true,
			transclude : true,
			templateUrl : 'templates/pagination.html',
			scope:{
				id:'@',
				getPageSizeAction:'@',
				changePage:'&'
			},
			controller: function($scope,$http,searchParam){
				this.getPageSize = function(){
					return $http({
						method:"POST",
						url:"/UEP-PUB/community/communityAction.do",
						params:{
							action:$scope.getPageSizeAction,
							searchInfo:searchParam.searchInfo,
							searchTag:searchParam.searchTag
						},
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
			},
			link : function(scope,iElement,iAttrs,controller){
				var promise = controller.getPageSize();
				promise.success(function(data){
					//设置当前页码
					scope.currentPage = 1;
					//一共多少页
					scope.pageSize = data.allPageNum;
					scope.pageNumArr = [];
					for(var i = 0; i < scope.pageSize; i++){
						scope.pageNumArr.push(i+1);
						//这里先不管了，把分页先 全加载出来吧
						/*if(i >= 4){
							break;
						}*/
					}
				})
				
				
				//设置分页
				scope.setPagination = function(currentPage){
					scope.currentPage = currentPage;
					
					var i , showPageId, hidePageId;
					
					if(currentPage >= 4){
						//只保留当前页的前面2页，
						var prevPage = currentPage-3;
						var i;
						
						//最大隐藏两个
						for(i = prevPage; i > prevPage-2; i--){
							hidePageId = "page_"+i;
							$("#"+scope.id+" #"+hidePageId).hide();
						}
						for(i = currentPage-1; i > prevPage; i--){
							showPageId = "page_"+(i);
							$("#"+scope.id+" #"+showPageId).show();
						}
						
						//只保留当前页的后面2页
						var nextPage = currentPage + 3;
						for(i = currentPage + 1; i < nextPage; i++){
							showPageId = "page_"+i;
							$("#"+scope.id+" #"+showPageId).show();
						}
						//最多也就隐藏两个
						for(i = nextPage; i < nextPage+2; i++){
							hidePageId = "page_"+i;
							$("#"+scope.id+" #"+hidePageId).hide();
						}
					}else{
						//如果当前页小于4，那么就显示前5页
						for(i = 0; i < 5; i++){
							var showPageId = "page_"+(i+1);
							$("#"+scope.id+" #"+showPageId).show();
						}
						for(i = 6; i <= 7; i++){
							var hidePageId = "page_"+i;
							$("#"+scope.id+" #"+hidePageId).hide();
						}
					}
					//获取分页信息
					scope.getPageInfo();
				}
				
				//获取前一页的分页信息
				scope.getPrevPage = function(){
					if(scope.currentPage == 1){
						return;
					}
					scope.setPagination(scope.currentPage-1);
				}
				
				//获取后一页的分页信息
				scope.getNextPage = function(){
					if(scope.currentPage == scope.pageSize){
						return;
					}
					scope.setPagination(scope.currentPage+1);
				}
				
				scope.getPageInfo = function(){
					scope.changePage({curPageNum:scope.currentPage});
				}
			}
		};
	}
);

communityDirectives.directive('answerContent',
	function(){
		return {
			restrict : 'EA',
			replace : true,
			transclude : true,
			template : '<div></div>',
			scope :　{
				content : "="
			},
			link : function(scope,iElement,iAttrs){
				var contentHtml = scope.content;
				iElement.append(contentHtml);
			}
		};
	}
);

communityDirectives.directive('uploadHeadimgDialog',
	function(){
		return {
			restrict : 'EA',
			templateUrl : 'templates/uploadImgDialog.html'
		}
	}
);

communityDirectives.directive('questionTags',
	function(){
		return {
			restrict : 'EA',
			replace : true,
			transclude : true,
			//require:"^?questionTags",
			controller:function($http){
				this.getLabels = function(){
					return $http({
						method:"POST",
						url:"/UEP-PUB/community/communityAction.do",
						params:{
							action:"getAllLables"
						},
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
			},
			template : '<div class="label-expander mb-10">'+
							'<ul class="list-inline	question-tags">'+
								'<li>'+'<div class="">'+ '<input type="text" class="question-tag-input" placeholder="标签，如：java" ng-keyup="inputKeyup()" ng-keydown="inputKeydown()"></input>'+ '</div>'+
									'<ul class="tags-layer"></ul>'+
								'</li>'+
							'</ul>'+
							'<input id="tagsInput" type="hidden" ng-model="question.tags">'+
					   '</div>',
			link : function(scope,iElement,iAttrs,controller){
				scope.question.tags = "";
				
				var allTags = [],
					promise = controller.getLabels(),
					newInputTemp = '<li>'+'<div class="">'+ '<input type="text" class="question-tag-input" placeholder="标签，如：java" ng-focus></input>'+
										'</div>'+
										'<ul class="tags-layer"></ul>'+
									'</li>';
				promise.success(function(data){
					for(var i = 0; i < data.length; i++){
						allTags.push(data[i].name);
					}
				});
				
				scope.inputKeyup = function(){
					inputKeyup();
				}
				
				scope.inputKeydown = function(){
					inputKeydown();
				}
				
				var inputKeyup = function(){
					var event = event? event:window.event,
						tagList = iElement.children().eq(0).children().last().children(),
						currentTagInput = $(tagList[0]).children().eq(0),
						currentTagLayer = tagList[1],
						searchText = $(currentTagInput).val(), 
						layerHtml = "";

					if(event.keyCode == 38){
						//向上方向键
						var showTags = $(currentTagLayer).children();
						if(showTags.length > 0){
							var Tagslenght =  showTags.length;
							for(var j = 0; j < Tagslenght; j++){
								if($(showTags[j]).hasClass('active')){
									$(showTags[j]).removeClass('active');
									if(j == 0){
										//当前是第一个tag，那么把第最后一个tag样式设为active
										$(showTags[Tagslenght - 1]).addClass('active');
									}else{
										//上面一个tag样式变为active
										$(showTags[j-1]).addClass('active');
									}
									break;
								}							
							}
						}
					}else if(event.keyCode == 40){
						//向下方向键
						var showTags = $(currentTagLayer).children();
						if(showTags.length > 0){
							var Tagslenght =  showTags.length;
							for(var j = 0; j < Tagslenght; j++){
								if($(showTags[j]).hasClass('active')){
									$(showTags[j]).removeClass('active');
									if(j == Tagslenght - 1){
										//当前是最后一个tag，那么把第一个tag样式设为active
										$(showTags[0]).addClass('active');
									}else{
										//下面一个tag样式变为active
										$(showTags[j+1]).addClass('active');
									}
									break;
								}							
							}
						}
					}else if(event.keyCode == 13){
						//回车键
						if($(currentTagLayer).css("display")=="block"){
							console.log("enter----block");
							var showTags = $(currentTagLayer).children();
							if(showTags.length > 0){
								var Tagslenght =  showTags.length;
								for(var j = 0; j < Tagslenght; j++){
									if($(showTags[j]).hasClass('active')){
										console.log($(showTags[j]).text());
										setInputValue(currentTagInput,currentTagLayer,$(showTags[j]).text());
										break;
									}							
								}
							}
						}
					}else{
						if(event.keyCode == 8 && searchText==""){
							//删除键，如果输入框中没有内容设置layer隐藏
							$(currentTagLayer).css("display","none");
						}else{
							console.log("allTags.length:"+allTags.length);
							for(var i = 0, count = 0; i < allTags.length; i++){
								if(count > 6){
									break;
								}
								if(allTags[i].indexOf(searchText) >= 0){
									var text = allTags[i];
									text = text.replace(searchText,'<strong>'+searchText+'</strong>');
									var prev = allTags[i].split(searchText)[0];
									var next = allTags[i].split(searchText)[1];
									if(count == 0){
										layerHtml += '<li class="active"><a href="javascript:void(0)">'+text+'</a></li>';
									}else{
										layerHtml += '<li><a href="javascript:void(0)">'+text+'</a></li>';
									}
									count++;
								}
							}
							if(count < 7){
								$(currentTagLayer).css("height",200-(7-count)*27);
							}else{
								$(currentTagLayer).css("height",200);
							}
							$(currentTagLayer).empty().undelegate().append(layerHtml);
							$(currentTagLayer).delegate("a","click",function(){
								setInputValue(currentTagInput,currentTagLayer,$(this).text());
							})
							$(currentTagLayer).css("display","block");
						}
					}
				}
				$(document).click(function(event){
					var tagList = iElement.children().eq(0).children().last().children();
					var currentTagInput = $(tagList[0]).children().eq(0),
						currentTagLayer = tagList[1];
					if($(currentTagLayer).css("display")!="none"){
						$(currentTagLayer).css("display","none");
						$(currentTagInput).val("");
					}
				})
				
				var inputKeydown = function(){
					var event = event? event:window.event;
					if(event.keyCode == 9){
						//TAB键
						var tagList = iElement.children().eq(0).children().last().children();
						var currentTagInput = $(tagList[0]).children().eq(0),
							currentTagLayer = tagList[1];
						$(currentTagLayer).css("display","none");
						$(currentTagInput).val("");
					}
				}
				
				var setTag = function(tag,flag){
					console.log("==========="+tag);
					if(flag == "add"){
						//将隐藏域里的值删除
						var labelArr = scope.question.tags.split(tag);
						var text = "";
						for(var i = 0; i < labelArr.length; i++){
							text = text + labelArr[i];
						}
						scope.question.tags = text;
						//allTags数组中添加该tag
						allTags.unshift(tag);
					}else if(flag == "delete"){
						//将隐藏域值添加该tag
						scope.question.tags += tag + "  ";
						//allTags数组中删除该tag
						for(var i = 0; i < allTags.length; i++){
							if(allTags[i] == tag){
								allTags.splice(i,1);
							}
						}
					}
				}
				
				var setInputValue = function(currentTagInput,currentTagLayer,value){
					//设置input的值，并将该input设为只读且增加一个关闭按钮，产生一个新的input
					$(currentTagInput).val(value);
					$(currentTagLayer).css("display","none");
					//从数组中删除该元素，防止重复选中
					setTag(value,"delete");
					
					//设只读
					$(currentTagInput).attr("disabled","disabled");
					
					//增加关闭按钮
					$(currentTagInput).parent().append('<div href="javascript:void(0);" class="tag-close">×</div>');
					var closeButton = $(currentTagInput).parent().children().last();
					
					$(closeButton).bind("click",function(){
						//删除整个input
						setTag($($(this).prev()).val(),"add");
						if($(iElement.children().eq(0).children().last().children().eq(0).children().eq(0)).attr("disabled") == "disabled"){
							$(this).parent().parent().remove();
							addTagInput();
						}else{
							$(this).parent().parent().remove();
						}
						
					});
					
					//一个问题最多关联4个tag
					if(iElement.children().eq(0).children().length < 4){
						addTagInput();
					}					
				}
				
				var addTagInput = function(){
					//产生一个新的input
					$(iElement.children().eq(0)).append(newInputTemp);
					
					//绑定事件
					var newInput = iElement.children().eq(0).children().last().children().eq(0).children().eq(0);
					
					$(newInput).bind("keyup",function(){
						inputKeyup();
					}).bind("keydown",function(){
						inputKeydown();
					});
					
					//新增加的input获取焦点
					setTimeout(function(){
						$(newInput).focus();
					},0)
					
				}
			}
		}
	}
);