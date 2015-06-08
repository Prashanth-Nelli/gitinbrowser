(function(){

	var app = angular.module('gitinbrowser',[]);
	
	app.config(['$sceProvider',function($sceProvider){
		$sceProvider.enabled(false);
	}]);
	
	app.controller('appCtrl',['$scope','$http',function($scope,$http){

		$scope.command=null;
		$scope.output=null;

		$scope.execute=function(){
			console.log($scope.command);
			$http.post('/git',{command:$scope.command}).then(function(res){
				$scope.output=res.data;
			},function(err){
				$scope.output=err.data;
			});
		};

		
	}]);

}());
