(function() {

angular.module('help', [])


/**
 * [Controller]
 * 游戏规则控制器
 */
.controller('__help', ['$scope', '$rootScope','$stateParams','$location',
	function($scope, $rootScope,$stateParams,$location) {

		/* 初始化  */
		{
			$rootScope.page.code = "help";
		}

		// 业务逻辑 
		{
			$scope.init = function(type){
				$scope._cururl = '/#' + $location.url();
				$scope.menu =   [
									{'zh-cn':'常见问题','url':'/#/help/often'},
									{'zh-cn':'条款与规则','url':'/#/help/rules'},
									{'zh-cn':'隐私政策','url':'/#/help/privacy'},
									{'zh-cn':'博彩责任','url':'/#/help/duty'}
								];
				$scope.htmlname =   'help/' + lang + '/'+$stateParams.type+'.html';
			}

			$scope.jump = function(url){
				window.location.href = url;
			}

			var w_pf = $scope.$watch('$stateParams.type', function(newValue) {
				
				if (!$scope.init) {$scope.init = true; return;};
				$scope.init(newValue);

			});

		}

		/* 初始化  */
		{

			//$scope.init();

		}

		/* 销毁  */
		{
			$scope.$on('$destroy', function(){

                w_pf();

            });
		
		}




	}])


})();