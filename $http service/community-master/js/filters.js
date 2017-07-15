var communityFilters = angular.module('communityFilters',[]);

communityFilters.filter('floorFilter',
	function(){
		return function(input){
			if(input){
				return "#"+input;
			}
		};
	});

communityFilters.filter('commentDateFilter',
	function(){
		return function(input){
			if(input){
				return "·"+input+"·";
			}
		};
	});