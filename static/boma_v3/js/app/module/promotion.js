(function() {

angular.module('promotion', [])


/**
 * [Controller]
 * 优惠活动控制器
 */
.controller('__promotion', ['$scope', '$rootScope', '$$request', '$$modal', '$interval', '$stateParams',
	function($scope, $rootScope, $$request, $$modal, $interval, $stateParams) {

		/* 变量声明 */
		{

			$rootScope.page.code = "promotion";
			$rootScope.bg = 'promotion';
			$scope._ca = '';

		}

		/* 业务逻辑 */
		{

			// 监听进入详情
			var w = $scope.$watch('$stateParams.id', function(newValue, oldValue, scope) {
				
				if (!newValue) {return;};
				
				$scope.i = $interval(function(){

					if ($('#modal-promotion').length > 0) {

						$.each($scope.promotions, function(index, val) {
							 /* iterate through array or object */

							 if (val.id == newValue) {

							 	$scope.detail(val);
							 	return false;

							 };


						});

						$interval.cancel($scope.i);
					};

				}, 50)

			});

			$scope.switchNav = function(item){

				$scope._ca = item || '';

			}

			$scope.toggleNav = function(){

				return 'promotionbar-' + $scope._ca;

			}

			// 获取活动列表
			$scope.getPromotions = function(){

				var r = $$request.packageReq('pomotion-list', null, null, 'GET', false, false);

				$$request.action(r, function(result){

					$scope._p = [];
					$.each(result.data, function(index, val) {
						 /* iterate through array or object */
						
						if (val['new'] === 1) {

							var o = angular.copy(val);
							o.category = '1';
							$scope._p.push(o);

						};

					});

					result.data = result.data.concat($scope._p);

					$scope.promotions = result.data;

				});

			}

			// 查询活动详情
			$scope.detail = function(item){

				$$modal.popupClose();
				$$modal.popup($scope, 'promotion');
				$scope._promotion = item;

				if (angular.isDefined($scope._promotion.desc)) {return};

				var r = $$request.packageReq('pomotion-desc', [item.id], null, 'GET', false, false);
				$$request.action(r, function(result){

					$scope._promotion.desc = result.data;

				});

			}

		}

		/* 初始化  */
		{
			
			$scope.getPromotions();

		}

		/* 销毁  */
		{

			$scope.$on('$destroy', function(){

				if ($scope.i) {

					$interval.cancel($scope.i);

				};

				w();

			});
		
		}

	}])

})();