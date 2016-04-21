
(function() {

angular.module('lottery', [])


/**
 * [Controller]
 * 真人控制器
 */
.controller('__lottery', ['$scope', '$rootScope', '$$dic', '$timeout', '$stateParams', '$$user', '$sce', '$$base',
	function($scope, $rootScope,  $$dic, $timeout, $stateParams, $$user, $sce, $$base) {

		/* 变量声明 */
		{

			$rootScope.page.code = "lottery";

		}

		/* 业务逻辑 */
		{

			var w_pf = $scope.$watch('$stateParams.pf', function(newValue, oldValue, scope) {
				
				if (!$scope.initPf) {$scope.initPf = true; return;};

				$scope.init();

			});


			// 进入平台
			$scope.enterPf = function(pf){

				window.location.href = "#/lottery/" + angular.lowercase(pf);
				return false;

			}

			// 初始化平台
			$scope.init = function(){

				$rootScope.miniMenu = undefined;
				$scope.showGameHall = undefined;

				if($$dic.conf('lottery_pfs').indexOf($stateParams.pf) > -1){

					if (!$$user.loginCheck("#/lottery/", $scope)) {return false};

					$scope.gameUrl  = $$dic.conf('play_lottery_' + $stateParams.pf);

					// BBIN 跳出窗口
					if (angular.lowercase($stateParams.pf) === 'bbin') {

						$tools.openWindow($scope.gameUrl);
						window.location.href = "#/lottery/";
						return false;

					}

					// wbg -- 此段逻辑比较复杂，当url = 'lottery/wbg 时，当前页面跳转至#/lottery/ 新开TAB至 lottery/wgb?in=1 新开页面直接打开iframe'
					if (angular.lowercase($stateParams.pf) === 'wbg') {

						if ($tools.getUrlParam('in') == 1) {

							$scope.showGameHall         = true;
							$timeout(function(){

								$scope.gameUrl              = $sce.trustAsResourceUrl($scope.gameUrl);
								$rootScope.bg               = 'lottery-if';
								$rootScope.miniMenu         = true;
								
							})

						}else{

							$tools.openWindow("#/lottery/wbg?in=1");
							window.location.href = "#/lottery/";

						}

					}

				}else{

					if ($stateParams.pf && $stateParams.pf.length > 0) {

						window.location.href = "#/lottery/";

					}

				}
				
			}

		}

		/* 初始化  */
		{

			

			var w = $scope.$watch('$root.user', function(newValue, oldValue, scope) {

				if (!newValue) {$scope.init();};
				
			});

			$scope.init();

			// 未登录或不去游戏
			if (!$scope.showGameHall) {

				var p = $$base.switchBG('lottery');

			}


		}

		/* 销毁  */
		{

			$scope.$on('$destroy', function(){

				$rootScope.miniMenu = undefined;

				$rootScope.preventRefreshBG = undefined;

				w();

				w_pf();

				$timeout.cancel(p);
				$rootScope.bg = 'lottery';

			});

		}

	}])
	
})();
