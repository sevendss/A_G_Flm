(function() {

angular.module('casino', [])


/**
 * [Controller]
 * 真人控制器
 */
.controller('__casino', ['$scope', '$rootScope', '$$modal', '$$dic', '$timeout', '$stateParams', '$$base', '$$user', '$$game',
	function($scope, $rootScope, $$modal, $$dic, $timeout, $stateParams, $$base, $$user, $$game) {

		/* 变量声明 */
		{

			$rootScope.page.code = "casino";

		}

		/* 业务逻辑 */
		{

			var w_pf = $scope.$watch('$stateParams.pf', function(newValue, oldValue, scope) {
				
				if (!$scope.initPf) {$scope.initPf = true; return;};

				$scope.init();

			});

			// 进入平台
			$scope.enterPf = function(item){

				window.location.href = "#/casino/" + angular.lowercase(item.name);;
				return false;

			}


			// 初始化平台
			$scope.init = function(){

				$rootScope.miniMenu = undefined;
				$scope.showGameHall = undefined;
				$rootScope.preventRefreshBG = false;

				if($$dic.conf('casino_pfs').indexOf($stateParams.pf) > -1){

					if (!$$user.loginCheck("#/casino", $scope)) {return false};

					$$game.enterCasinoPF($scope, $stateParams.pf);

					if (angular.uppercase($stateParams.pf) === 'BBIN') {

						window.location.href = "#/casino";
						return false;

					}

					return;

				}else{
					
						$scope.casinos = $$dic.conf('casino-pfs');
						window.location.href = "#/casino";
						return false;

				}

			};

		}

		/* 初始化  */
		{

			var w = $scope.$watch('$root.user', function(newValue, oldValue, scope) {

				if (!newValue) {$scope.init();};
				
			});

			$scope.init();

			// 未登录或不去游戏
			if (!$scope.showGameHall) {

				var p = $$base.switchBG('casino');

			}

		}

		/* 销毁  */
		{

			$scope.$on('$destroy', function(){

				$rootScope.miniMenu = undefined;

				$rootScope.preventRefreshBG = undefined

				w();

				w_pf();

				$timeout.cancel(p);
				$rootScope.bg = 'casino';

			});

		}

	}])
	
})();