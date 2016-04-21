/**
 * [userService 提供用户相关服务]
 */
(function(){

	angular.module('user', [])

	.factory('$$user', 
		[
			'$log', 
			'$cookies',
			'$$request',
			'$$modal',
			'$$base',
			'$timeout',
			'$$slot',
			'$rootScope', function($log, $cookies, $$request, $$modal, $$base, $timeout, $$slot, $rootScope) {

		return{

			// 刷新用户安全信息
			refreshSafety: function(){

				this.getUserSafety(function(result){

					if (!$rootScope.user) {return;};

					$rootScope.user.safety = result.data;
				
				});

			},

			// 更新PT平台密码
			modifyUserInfo: function(data, callback){

				var r = $$request.packageReq('set-user-info', null, data, 'POST', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 更新PT平台密码
			modifyPTPwd: function(){

				$$modal.input($$base.i18n('common-changePwd'), $$base.i18n('placeholder_inputpwd'), null, null, $$base.i18n('pt-password-reg'), function(swal, value){

					var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,14}$/;

					if (!reg.test(value)) {

						swal.showInputError($$base.i18n('common-wrongReg'));
						return;

					};

					$$slot.modifyPTPwd(value, function(result){

						$$modal.alert(null, $$base.i18n('common-changePwd-s'), 'success', null, null);

						$rootScope.user.pfAcc[0].password = value;

					});

				})

			},

			/**
			 * 设置用户上下文环境
			 * @param  {[type]} data [参数]
			 */
			setUserContext: function(data){

				$cookies.remove('account');
				if (data.remember) {
					var now = new Date();
					now.setDate(now.getDate() + 30);
					$cookies.put('account', data.username, {'expires': now});
				}

				$cookies.remove('error-times');

				$cookies.put('user', angular.toJson(data));

				if (window.localStorage) {

					window.localStorage['user'] = angular.toJson(data);

				};

				$rootScope.sessionId = data.sessionId;
				$rootScope.user = data;
			},

			/**
			 * 重设用户上下文环境
			 * @param  {[type]} data [参数]
			 */
			resetUserContext: function(user){

				$cookies.put('user', angular.toJson(user));

			},

			/**
			 * 获取用户余额信息
			 */
			getUserBalance: function(callback){
				
				if ($rootScope.user.balance) {
					$rootScope.user.balance.totleBalance = '';
				};

				var r = $$request.packageReq('user-balance', null, null, 'GET', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			/**
			 * 获取某平台余额信息(强制从平台刷新){
			 * data: {"mode": 1, "pf": xx}	
			 */
			 getUserBalanceWithPF: function(data, callback){

			 	var r = $$request.packageReq('user-balance', null, data, 'POST', false, false);

				$$request.action(r, function(result){

					// 失败取原有值
					if (result.status < 0) {return};

					callback(result);

				});

			 },

			/**
			 * 获取用户通用信息
			 */
			getUserInfo: function(callback){

				// $rootScope.user.info = {};

				var r = $$request.packageReq('user-info', null, null, 'GET', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			/**
			 * 获取用户账号安全等级信息
			 */
			getUserSafety: function(callback){

				// $rootScope.user.safety = {};

				var r = $$request.packageReq('user-safety', null, null, 'GET', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			/**
			 * 检查是否登录
			 */
			loginCheck: function(href, scope){

				if (!$rootScope.user) {

					$$modal.confirm(null, $$base.i18n('common-login-yet'), $$base.i18n('modal-register-goLogin'), function(){

						$rootScope.triggers.login = {'bullet': Math.ceil(Math.random() * 1000000)};
						$timeout(function(){

                   			scope.$apply();
							
						})
						
					});

					window.location.href = href;

					return false;
				}

				return true;

			},

			/**
			 * 退出登录
			 */
			logout: function(){

				$cookies.remove('user');
				$cookies.remove('boma8_front_session');
				$cookies.remove('PHPSESSID');
				if (window.localStorage) {
					window.localStorage.removeItem('user');
				};
				$rootScope.sessionId = null;
				$rootScope.user = undefined;

			}
			

		}

	}])


})();