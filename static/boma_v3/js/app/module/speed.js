(function() {

angular.module('speed', [])


/**
 * [Controller]
 * 游戏规则控制器
 */
.controller('__speed', ['$scope', '$rootScope','$stateParams','$location',
	function($scope, $rootScope,$stateParams,$location) {

		/* 初始化  */
		{
			$rootScope.page.code = "speed";
			$scope.tim       =  new Date().getTime();
			$scope.seed      =  0;
			$scope.count     =  0;
			$scope.finalurl  = new Array();
			$scope.opts = {};
			$rootScope.bg        = undefined;
		}

		// 业务逻辑 
		{
			$scope.init = function(type){

				var urls = ['http://www.boma365.net','http://www.boma365.com','http://www.boma365.org',
							'http://www.boma365.info','http://www.boma116.com','http://www.boma118.com',
							'http://www.188bm365.com','http://www.188bm365.net','http://www.777boma365.com',
							'http://www.zuqiubm365.com','http://www.777boma365.net','http://www.zuqiubm365.net',
							'http://www.boma9.com','http://www.djjd0.com']

				for (var i = 0; i < urls.length; i++){
                	if (i <= 2){
						$scope.gettime(urls[i]);
                		continue;
                	}
                	var img = new Image();
                	
                	img.onerror = (function(url){
                			$scope.gettime(url);
                	})(urls[i]);
                	
                	img.src = urls[i] + "/" + Math.random();
                }

			}

			$scope.gettime = function(url){
				var max_speed = 1100;
				if ($scope.count <= 2){
					if (!$scope.seed){
						$scope.seed = parseInt(Math.random()*200 + 200);
					}
					ms = parseInt(Math.random()*50) + $scope.seed;
				}else{
					var ms = new Date().getTime() - $scope.tim;
					var tmp = ms;
					var step = 0;

					if ($scope.seed >= max_speed){
						step = 0;
					}else{
						step = (max_speed - $scope.seed) / 5 - 50;
					}
					tmp = parseInt(Math.random() * step + 20) + $scope.seed;

					if (ms < $scope.seed){
						ms = tmp; 
					}else{
						ms = Math.min(ms, tmp);
					}

				}
				// seed = ms;
				if(ms>=max_speed) ms = max_speed-1;
				var tmp_rate = parseInt((max_speed-ms)/10); 
				var tmp_str = '网址'+ ($scope.count+1) + ':' + url;
				$scope.finalurl[$scope.count] = {'urlstr':tmp_str,'url':url,'time':tmp_rate};
				$scope.count ++;
			}
			
		}

		/* 初始化  */
		{

			$scope.init();

		}

	}])


})();