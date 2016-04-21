(function() {

	angular.module('framework', [])


	/**
	 * [Controller]
	 * 站点主控制器
	 */
	.controller('__framework', ['$scope', '$cookies', '$rootScope', '$$base', '$interval', '$$common', '$$modal', '$timeout', '$$request', '$$user', '$$dic',
		function($scope, $cookies, $rootScope, $$base, $interval, $$common, $$modal, $timeout, $$request, $$user, $$dic){

		/* 声明变量 */
		{

			$rootScope.page = {};
			$scope._login    = {};
			$scope._register = {};
			$scope._feedback = {};

		}

		/* 业务逻辑 */
		{

			// 弹出登录
			$scope.$watch('$root.triggers.login.bullet', function(value, oldValue) {

				if (!value) {return};

				$scope.showLogin($rootScope.triggers.login.fn);

			});

			// 弹出注册
			$scope.$watch('$root.triggers.register', function(value, oldValue) {

				if (!value) {return};

				$scope.showRegister();

			});

			// 找回密码
			$scope.findPassword = function(){

				$$modal.popupClose();

				$timeout(function(){

					$$modal.popup($scope, 'findPwd');

					$scope.$broadcast('clear');
					
				}, 300);

			}

			// 意见建议
			$scope.feedback = function(){

				var r = $$request.packageReq('feedback', null, $scope._feedback, 'POST', true, false);

				$$request.action(r, function(result){

					$$modal.alert(null, $$base.i18n('feedback-success-c') , 'success', null, function(){

						$scope._feedback = {};
						
						$$modal.popupClose();

					});

				})

			}

			//先注册
			$scope.goregister = function(){

				$$modal.popupClose();

				$timeout(function(){

					$scope.showRegister();
					
				}, 300);

			}

			//打开注册窗口
			$scope.showRegister = function(){

				$scope.refreshCheckCode();

				if ($rootScope.user) {

					$$modal.tips($$base.i18n('common-reged'), 'info');
					return;
				};

				$scope._register = {};
				//如果有代理的cookie 自动填充cookie
				$scope.agent_code_readonly = false;
				if($cookies.get('agent_code')){

					$scope._register.spreadCode = $cookies.get('agent_code');
					$scope.agent_code_readonly = true;

				}  


				$$modal.popup($scope, 'register');

			}

			//去登录
			$scope.gologin = function(){

				$$modal.popupClose();

				$timeout(function(){

					$scope.showLogin();
					
				}, 300);

			}

			//打开登录窗口
			$scope.showLogin = function(callback){

				$scope.callbackWhenLogin = undefined;

				$scope._login = {};
				$scope.errorTimes = $cookies.get('error-times') || 0;
				$scope.refreshCheckCode();

				if ($cookies.get('account')) {

					$scope._login.username = $cookies.get('account');
					$scope._login.remember = 1;

				};

				$$modal.popup($scope, 'login');

				if (angular.isFunction(callback)) {

					$scope.callbackWhenLogin = callback;

				}

			}

			//刷新验证码
			$scope.refreshCheckCode = function(data){

				$rootScope.checkcode_ran = Math.ceil(Math.random()*100000000);

			}
			
			//登录
			$scope.login = function(callback){

				var r = $$request.packageReq('login', null, $scope._login, 'POST', true, true);
				r.data.password = $.md5(r.data.password);

				$$request.action(r, function(result){

					//登录失败
					if (result.status < 0) {

						$$modal.alert(null, result.msg, 'error');

						var now = new Date();
						now.setDate(now.getDate() + 365);
						$cookies.put('error-times', ++$scope.errorTimes, {'expires': now});
						if ($scope.errorTimes >= 3 || result.status === -1031) {

							$scope.refreshCheckCode();
							if ($scope.errorTimes < 3) {

								$scope.errorTimes = 3;

							};

						};
						return;

					};

					//登录成功
					c = result.data;
					c.username = r.data.username;
					c.remember = $scope._login.remember;
					$$user.setUserContext(c);

					$$modal.popupClose();

					$scope.getPromotionImage();

					if (angular.isFunction($scope.callbackWhenLogin)) {

						$scope.callbackWhenLogin();

					};

				})

			}

			// 注册
			$scope.register = function(){

				var r = $$request.packageReq('register', null, $scope._register, 'POST', true, true, false, true);

				$$request.action(r, function(result){

					// 注册失败
					if (result.status < 0) {

						$$modal.alert(null, result.msg, 'error');
						$scope.refreshCheckCode();
						return;

					}

					$$modal.alert($$base.i18n('register-success-t'), $$base.i18n('register-success-c') + $$dic.conf('preaccount') +$scope._register.username , 'success', null, function(){

						$$modal.popupClose();

						// 马上登录去
						$scope._login.username = $$dic.conf('preaccount') + angular.copy($scope._register.username);
						$scope._login.password = angular.copy($scope._register.password);

						$timeout(function(){

							$scope.login();
							$scope.$apply();

						}, 300)

						// 清空关闭
						$scope._register = {};


					});

				})

			}

			// 活动图片
            $scope.getPromotionImage = function(){

                $$common.getActivityWindow(function(result){

                    if (result.data.window_image) {

                        $rootScope._promotion.url = result.data.window_image;
                        $rootScope._promotion.id = result.data.id;
                        $$modal.popup($scope, 'promotion-lite');

                    };
                  
                })

            }
			
			/**
			 * [设置页面标题]
			 */
			$scope.$watch('[$root.page.code, $root.translateState]', function(value) {

				if (!$rootScope.page || !$rootScope.translateState) {return};

			    document.title = $$base.i18n('pageTitle-' + $rootScope.page.code) + ' - ' + $$base.i18n('appName');

			}, true);


			/**
			 * [设置body背景]
			 */
			$scope.switchBg = function(className){

				$rootScope.bg = className || 'default';

				return 'bg-'+$rootScope.bg;

			}

			$scope.$watch('$root.user', function(newValue, oldValue, scope) {
	 		
	 			if (!newValue || !window.localStorage) {return};

	 			window.localStorage.setItem('user', angular.toJson(newValue));

			}, true);

			// 轮询获取请求token
			$$common.getToken(function(result){

				$rootScope.token = result.data.token;

			})

			$interval(function(){

				$$common.getToken(function(result){

					$rootScope.token = result.data.token;

				})

			}, 540000);

			// 轮询发送日志
			$interval(function(){

				if (!window.localStorage) {return null};
				if (!window.localStorage.getItem('logs')) {return null};

				var o = angular.fromJson( window.localStorage.getItem('logs') );

				$$common.postLogs({"logs": o}, function(result){

					window.localStorage.removeItem('logs');

				})

			}, 10000);

		}

		/* 初始化 */
		{


		}


	}])

	/**
	 * [Controller]
	 * 页面头控制器
	 */
	.controller('__header', ['$scope', '$rootScope', '$$base', '$$modal', '$$request', '$state', '$cookies', '$$user', '$timeout', '$$game', '$$dic', '$$common',
		function($scope, $rootScope, $$base, $$modal, $$request, $state, $cookies, $$user, $timeout, $$game, $$dic, $$common){


		//业务逻辑
		{

			// 跳转页面
			$scope.goPage = function(item){

				if (item.herf === '#') {return};

				$state.go(item.herf);

			}


			// 监听用户状态
			$scope.$watch('$root.user', function(value, oldValue) {

				if (!value) {

					$scope.menus = $$dic.conf('menu-logout');
					return false;
				};

				$scope.menus = $$dic.conf('menu-login');

				$rootScope.sessionId = $rootScope.user.sessionId;
				
				$$common.getToken(function(result){

					$rootScope.token = result.data.token;

					// 获取余额信息
					$$user.getUserBalance(function(result){

						if (!$rootScope.user) {return;};

						$rootScope.user.balance = result.data;
						var tm = Number($rootScope.user.balance.centreBalance);
						$.each($rootScope.user.balance.platform, function(index, val) {
							 /* iterate through array or object */
							 tm += Number(val.balance);

						});

						$rootScope.user.balance.totleBalance = tm;
					
					});

					// 获取用户通用信息
					$$user.getUserInfo(function(result){

						if (!$rootScope.user) {return;};

						$rootScope.user.info = result.data;
					
					});

					// 获取用户安全信息
					$$user.getUserSafety(function(result){

						if (!$rootScope.user) {return;};

						$rootScope.user.safety = result.data;
					
					});

				})

			});

			// 显示状态栏公告
			$scope.showAnnouncement = function(){

				if (!$rootScope.page || !$rootScope.page.code) {return false};

				list = $$dic.conf('hide-announcement');

				if (list.indexOf($rootScope.page.code) > -1) {return false};

				if ($rootScope.user && $rootScope.page.code === 'home') {return false};

				return true;

			}

			// 退出登录
			$scope.logout = function(){

				$$user.logout();

			}

			// 切换显示余额
			$scope.toggleBalance = function(){

				$rootScope.conf.showBalance = !$rootScope.conf.showBalance;

			}

			// 鼠标进入下拉选择游戏
			$scope.triggerDropGame = function(item, status){

				if (!$rootScope.user) {return};

				if (status === 2) {

					$timeout.cancel($scope.dropGamePromise);
					return;

				};

				if (status === 1) {

					if ($scope.dg) {$timeout.cancel($scope.dropGamePromise);};

					$scope.dg = item.lable;

				};

				if (status === 0) {

					$scope.dropGamePromise = $timeout(function(){

						$scope.dg = undefined;

					},100)

				};

			}

			

		}


	}])


	/**
	 * [Controller]
	 * 页脚控制器
	 */
	.controller('__footer', ['$scope', '$rootScope', '$$base', '$$modal', function($scope, $rootScope, $$base, $$modal){

		$scope.feedback = function(){

			$$modal.popup($scope, 'feedback');

		}

	}])

	/**
	 * [Controller]
	 * BANNER控制器
	 */
	.controller('__banners', ['$scope', '$rootScope', function($scope, $rootScope){

		

	}])

})();