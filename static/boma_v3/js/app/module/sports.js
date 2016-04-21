(function() {

angular.module('sports', [])


/**
 * [Controller]
 * 体育控制器
 */
.controller('__sports', ['$scope', '$rootScope', '$$dic', '$sce',
	function($scope, $rootScope, $$dic, $sce) {

		/* 变量声明 */
		{

			$rootScope.page.code        = "sports";
			$rootScope.bg   			= 'sports';
			$rootScope._displaySportsAD = $rootScope._displaySportsAD || 1;

		}

		/* 业务逻辑 */
		{

			// 登录前后URL地址切换
			var w = $scope.$watch('$root.user', function(newValue, oldValue, scope) {
				
				if (!newValue) {

					$scope.sbUrl = $sce.trustAsResourceUrl($$dic.conf('play_sports_sb_b'));
					return;

				}

				$scope.sbUrl = $sce.trustAsResourceUrl($$dic.conf('play_sports_sb_a'));

			});

		}

		/* 初始化  */
		{

			// 关闭浮动广告
			$scope.closeFloatAD = function(){

				$rootScope._displaySportsAD = 2;

			}

		}

		/* 销毁 */
		{

			$scope.$on('$destroy', function(){

				w();

			});

		}

	}])
	
})();