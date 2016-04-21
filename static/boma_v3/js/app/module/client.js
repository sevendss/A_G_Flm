(function() {

angular.module('client', [])


/**
 * [Controller]
 * 体育控制器
 */
.controller('__client', ['$scope', '$rootScope', '$$base', '$$modal', '$$user', '$timeout',
	function($scope, $rootScope, $$base, $$modal, $$user, $timeout) {

		/* 变量声明 */
		{

			$rootScope.page.code = "client";

		}

		/* 业务逻辑 */
		{

			$scope.copy = function(type){

				$$modal.tips($$base.i18n('client-copy-' + type));

			}

			$scope.modifyPTPwd= function(){

				$$user.modifyPTPwd();

			}

			$scope.pcDownload = function(){

				$$modal.alert(null, '网站改版，新版客户端敬请期待…', 'info');

			}

		}

		/* 初始化  */
		{

			var p = $$base.switchBG('client');

		}

		/* 销毁 */
		{

			$scope.$on('$destroy', function(){

				$timeout.cancel(p);
				$rootScope.bg = 'client';

			});

		}

	}])
	
})();