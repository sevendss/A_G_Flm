(function() {

angular.module('rule', [])


/**
 * [Controller]
 * 游戏规则控制器
 */
.controller('__rule', ['$scope', '$rootScope',
	function($scope, $rootScope) {

		/* 初始化  */
		{
			$rootScope.page.code = "gamerule";
			// window.location.href='#/rule/casino/ag.jsbjl'
			// 当前只有真人游戏有游戏规则
			// window.location.href = '#/rule/casino/ag.jsbjl';

		}

	}])

// 真人游戏规则
.controller('__rule_casino', ['$scope', '$rootScope', '$stateParams','$$dic','$location','$$game',
	function($scope, $rootScope, $stateParams, $$dic, $location, $$game) {

		/* 变量声明 */
		{
		
		}

		/* 业务逻辑 */
		{

			// 进入平台
            $scope.enterGameHall = function(item){
                $$game.enterGameHall(item);

            }

			$scope.init = function(gamename){
				$scope._url = '/#' + $location.url();
				$scope.rulename =   'rule/' + lang + '/casino/'+$stateParams.game+'.html';
				if(!gamename)  gamename = $stateParams.game;
				$scope._spf = angular.uppercase(gamename.split('.')['0']);
				$scope.casinos = $$dic.conf('casino-pfs-menu');
			}
			
			$scope.jump = function(url){
				window.location.href = url;
			}

			var w_pf = $scope.$watch('$stateParams.game', function(newValue) {
				
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