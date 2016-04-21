/**
 * [HttpService 请求相关服务]
 */
(function(){

	angular.module('request', [])

	.factory('$$request', 
		[
			'$log', 
			'$q',
			'$http',
			'$rootScope',
			'$cookies',
			'$$cache',
			'$$modal', function($log, $q, $http, $rootScope, $cookies, $$cache, $$modal) {

		return{

			//请求地址
			interfaceUrl: function(key){

				var maps = [];

				// 登录
				maps['login'] = 'api/user/login';

				// 获取用户收藏的游戏
				maps['register'] = 'api/register';
				
				// 获取用户余额信息
				maps['user-balance'] = 'api/user/balance';

				// 获取用户通用信息
				maps['user-info'] = 'api/user/info';

				// 获取用户安全信息
				maps['user-safety'] = 'api/user/api_get_base_info';

				// 获取热门推荐游戏
				maps['game-hot'] = 'api/game/hot/$';

				// 获取用户收藏的游戏
				maps['game-collected'] = 'api/collect';

				// 设置收藏的游戏
				maps['set-collect'] = 'api/collect/$'

				// 获取老虎机游戏列表
				maps['game-slot'] = 'api/game/slot';

				// 获取老虎机累计奖池
				maps['slot-prizepool'] = 'api/game/prizepool';

				// 更新PT平台密码
				maps['modify-pt-pwd'] = 'api/pt/password';

				// SLOT幸运玩家
				maps['slot-luckguy'] = 'api/game/get_max_winloss';

				// 活动列表 此处有改动
				//maps['pomotion-list'] = 'api/promotion';
				maps['pomotion-list'] = 'dataJson/promotion.json';

				// 活动内容
				maps['pomotion-desc'] = 'api/promotion/$';

				// 红利列表
				maps['bonus-list'] = 'api/bonus/query';

				// 转账列表
				maps['transfers-list'] = 'api/transfers/query';

				// 提款列表
				maps['withdrawal-list'] = 'api/withdrawal/query';

				// 充值列表
				maps['recharge-list'] = 'api/recharge/query';

				// 投注列表
				maps['betting-list'] = 'api/betting/query';

				// 字典表获取器
				maps['dictionary'] = 'api/dic/$';

				// 获取充值方式和银行对应关系
				maps['recharge_payment'] = 'api/hdmeinv';

				// 以下无文档
				// 在线充值第一步
				maps['onlinePay_s1'] = 'api/chenyuanyuan/wusangui';

				// 银行转账充值
				maps['transPay'] = 'api/chenyuanyuan/lizicheng';

				// 支付宝充值
				maps['aliPay'] = 'api/recharge/wxTransfer';

				// 提款
				maps['withdraw'] = 'api/shenwansan';

				// 提款限制
				maps['withdraw-limit'] = 'api/withdrawal/info';

				// 转账
				maps['transfers'] = 'api/weizhongxian';

				// 修改登录密码
				maps['change-pwd'] = 'api/user/change_pwd';

				// 修改资金密码
				maps['change-safety-pwd'] = 'api/user/change_fundpassword';

				// 更新个人资料
				maps['modify-info'] = 'api/user/api_update_user_info';

				// 绑定实名
				maps['bind-realname'] = 'api/user/bind_realname';

				// 获取邮箱验证码
				maps['get-mail-auth'] = 'api/user/get_email_auth_code';

				// 绑定邮箱
				maps['bind-mail'] = 'api/user/bind_email';

				// 绑定密保
				maps['bind-qa'] = 'api/user/set_user_security';

				// 获取系统通知
				maps['get-message'] = 'api/message/inbox';

				// 删除消息
				maps['delete-message'] = 'api/message/delete';

				// 检查老邮箱
				maps['check-mail'] = 'api/user/email_auth';

				// 变更邮箱
				maps['change-mail'] = 'api/user/change_mail';

				// 给字典名称和字典KEY 获取字典value
				maps['converter'] = 'api/dic/get_map_value';

				// 验证密保问题
				maps['checkQA'] = 'api/user/answer_auth';

				// 意见反馈
				maps['feedback'] = 'api/user/api_save_feedback';

				// 找回密码第一步
				maps['findPwd-1'] = 'api/user/account';

				// 一键回收
				maps['onekey-back'] = 'api/user/api_balance_platform_to_center';
				
				//域名验证
				maps['check-url'] = 'api/common/domain';

				// 读取收件箱
				maps['read-message'] = 'api/message/read';

				//获取免费热门游戏
				maps['free-hotgames'] = 'api/game/freehot';

				// 获取窗口图片
				maps['activity_window'] = 'api/promotion/activity_window';

				// 获取banner
				maps['get-banners'] = 'api/common/banner';

				// 全局TOKEN
				maps['get-token'] = 'api/user/randomcode';

				// 跑马灯公告
				//maps['get-notice'] = 'api/message/notice';				
				maps['get-notice'] = 'dataJson/notice.json';
				// 常用银行卡
				maps['get-bind-bankcard'] = 'api/user/get_binding_bankcard';

				// 删除银行卡
				maps['del-bind-bankcard'] = 'api/user/del_binding_bankcard';

				// 上次日志
				maps['post-logs'] = 'index/givemedata';

				//返回
				if (!maps[key]) {

					$log.error('####未找到请求地址:' + key + '####');
					return;

				};

				return maps[key];

			},

			/**
			 * 打包请求对象
			 * @param  {[type]} key       		[请求地址Key]
			 * @param  {[type]} urlParam  		[URL资源参数，对象数组]
			 * @param  {[type]} postParam 		[对象/JSON串]
			 * @param  {[type]} method    		[请求方式 GET, POST, PUT, DELETE  ]
			 * @param  {[type]} loading    		[是否需要loading遮罩  ]
			 * @param  {[type]} errorProcess    [是否需要在业务层处理错误，FALSE时统一由HTTPSERVICE处理  ]
			 * @param  {[type]} cache           [是否对数据做本地缓存处理，传入缓存时效，参考cacheService  ]
			 * @param  {[type]} riskIobb        [是否需要在请求中封装风控IOBB参数  ]
			 * @return {[type]}           [请求对象]
			 */
			packageReq: function(key, urlParam, postParam, method, loading, errorProcess, cache, riskIobb){

				var req = {};
				req.url = this.interfaceUrl(key);
				req.method = method || 'GET';

				if (!req.url) {return;}

				var paramMap = req.url.split("$");

				//URL参数组装
				if (paramMap.length > 1) {

					req.url = '';
					$.each(paramMap, function(index, val) {

						if (paramMap.length-1 === index) {return};

						req.url += (val + urlParam[index]);

					});

				};

				//POST数据
				req.data = (postParam)? angular.copy(postParam): '';

				// 请求日志
				var l = ["recharge_payment","onlinePay_s1","transPay","withdraw","withdraw-limit","transfers","get-bind-bankcard"];
				if (l.indexOf(key) > -1) {

					$$cache.logs('HTTP REQUEST', req.url, angular.toJson(req.data));

				};

				if (riskIobb) {

					req.data.ioBB = $("#ioBB").val();

				};

				//loading 遮罩
				req.loading = loading || false;

				//错误处理
				req.errorProcess = errorProcess || false;

				//本地缓存
				if (cache) {

					req.cache = {'key': key, 'expires': cache};

				};

				return req;

			},

			/**
			 * 发送请求
			 * @param  {[type]}   request   [打包好的请求]
			 * @param  {Function} callback [回调函数]
			 */
			action: function(request, callback){

				if (!request) {return;};

				//若是cache先取缓存
				if (request.cache && $$cache.get(request.cache.key)) {

					callback( $$cache.get(request.cache.key).data );
					return;

				};

				//遮罩
				if (request.loading) {$$modal.loading();};

				//保持原有对象
				var r = angular.copy(request);	

				if (angular.isObject(r.data)) {

					r.data = angular.toJson(r.data);

				};

				var promise = $http({

					headers: {
						'Api_version'	: '1.0',
						'Api_type'		: 'web',
						'Authorization' : $rootScope.sessionId
					},
					responseType: "json",
					method: r.method,
					url: encodeURI(r.url + '?tk='+$rootScope.token+'&r=' + Math.ceil(Math.random() * 9999999999)) ,
					data: r.data,

				})

				//请求返回
				$q.all([promise]).then(function(response) {

					if (r.loading) {$$modal.loading();};

					if (response[0].status == 200){

						if (!response[0].data || angular.isUndefined(response[0].data.status)) {

							$log.error('###API返回值出错###');
							$log.error('###API地址:'+r.url+'###');
							$log.error('###response[0].data:'+ angular.toJson(response[0].data)+'###');

							$$cache.logs('HTTP RESPONSE ERROR 4 200CODE', r.url, null, "response[0].data:" + angular.toJson(response[0].data));

							return;

						};

						if (response[0].data.status === -1000) {

							$cookies.remove('user');
							$rootScope.sessionId = null;
							$rootScope.user = undefined;

							if (window.location.href.indexOf("my") > -1) {

								window.location.href = "#/";
								return false;
								
							};

							return false;

						};

						if (response[0].data.status < 0 && !r.errorProcess) {

							$$modal.alert(null, response[0].data.msg, 'error');

							return;
							
						};
						
						if (angular.isFunction(callback)) {

							// 缓存本地数据
							if (r.cache) {

								$$cache.put(r.cache.key, response[0].data, r.cache.expires);

							};

							callback(response[0].data);
							
						};


					}else{

						$$modal.alert(null, response[0].data.msg, 'error');
					
					}

				});

			}

		}

	}])


})();