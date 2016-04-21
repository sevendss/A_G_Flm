
(function() {

angular.module('lottery', [])


/**
 * [Controller]
 * ���˿�����
 */
.controller('__lottery', ['$scope', '$rootScope', '$$dic', '$timeout', '$stateParams', '$$user', '$sce', '$$base',
	function($scope, $rootScope,  $$dic, $timeout, $stateParams, $$user, $sce, $$base) {

		/* �������� */
		{

			$rootScope.page.code = "lottery";

		}

		/* ҵ���߼� */
		{

			var w_pf = $scope.$watch('$stateParams.pf', function(newValue, oldValue, scope) {
				
				if (!$scope.initPf) {$scope.initPf = true; return;};

				$scope.init();

			});


			// ����ƽ̨
			$scope.enterPf = function(pf){

				window.location.href = "#/lottery/" + angular.lowercase(pf);
				return false;

			}

			// ��ʼ��ƽ̨
			$scope.init = function(){

				$rootScope.miniMenu = undefined;
				$scope.showGameHall = undefined;

				if($$dic.conf('lottery_pfs').indexOf($stateParams.pf) > -1){

					if (!$$user.loginCheck("#/lottery/", $scope)) {return false};

					$scope.gameUrl  = $$dic.conf('play_lottery_' + $stateParams.pf);

					// BBIN ��������
					if (angular.lowercase($stateParams.pf) === 'bbin') {

						$tools.openWindow($scope.gameUrl);
						window.location.href = "#/lottery/";
						return false;

					}

					// wbg -- �˶��߼��Ƚϸ��ӣ���url = 'lottery/wbg ʱ����ǰҳ����ת��#/lottery/ �¿�TAB�� lottery/wgb?in=1 �¿�ҳ��ֱ�Ӵ�iframe'
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

		/* ��ʼ��  */
		{

			

			var w = $scope.$watch('$root.user', function(newValue, oldValue, scope) {

				if (!newValue) {$scope.init();};
				
			});

			$scope.init();

			// δ��¼��ȥ��Ϸ
			if (!$scope.showGameHall) {

				var p = $$base.switchBG('lottery');

			}


		}

		/* ����  */
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
