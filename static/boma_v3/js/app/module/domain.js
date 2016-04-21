(function() {

	angular.module('domain', [])


	/**
	 * [Controller]
	 * 游戏规则控制器
	 */
	.controller('__domain', ['$scope', '$rootScope', '$stateParams', '$location', '$$request', '$$modal', '$$base',
			function($scope, $rootScope, $stateParams, $location, $$request, $$modal, $$base) {

				/* 初始化  */
				{
					$rootScope.page.code = "domain";
					$rootScope.bg        = undefined;
					$scope.random = Math.random();
					$scope._r = {
						'url': $$base.i18n('modal-enter-url'),
						'checkcode': $$base.i18n('modal-enter-checkcode')
					};
				}

				// 业务逻辑 
				{

					//刷新验证码
					$scope.changecode = function() {
						$scope.random = Math.random();
					};

					//异步验证URL 的合法性
					$scope.checkUrl = function() {

						var data = {
							'url': $scope._r.url.trim(),
							'checkcode': $scope._r.checkcode.trim()
						}

						if (!data.url || data.url == $$base.i18n('modal-enter-url')) {

							$$modal.alert(null, $$base.i18n('modal-url-none'), 'error');
							return;

						}

						if (!data.checkcode || data.checkcode == $$base.i18n('modal-enter-checkcode')) {

							$$modal.alert(null, $$base.i18n('modal-checkcode-none'), 'error');
							return;

						}

						var r = $$request.packageReq('check-url', null, data, 'POST', true, false);
						
						$$request.action(r, function(result) {

							$scope.random = Math.random(); //刷新验证码

							if (result.data.istrue == 3) {

								$$modal.alert(null, $$base.i18n('modal-checkcode-wrong'), 'error');
								return;

							} 

							if (result.data.istrue == 2) {

								$$modal.alert(null, $$base.i18n('modal-url-wrong'), 'error');
								return;

							} 

							$$modal.alert(null, $$base.i18n('modal-url-right'), 'success');

						});
					}

				}


			}
		])

})();