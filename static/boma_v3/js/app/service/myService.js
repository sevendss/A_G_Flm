/**
 * [myService 提供个人中心相关服务]
 */
(function(){

	angular.module('my.service', [])

	.factory('$$my', 
		[
			'$log', 
			'$$request',
			'$$dic',
			'$filter',
			'$rootScope', function($log, $$request, $$dic, $filter, $rootScope) {

		return{

			// 删除绑定银行卡
			delBindBankCard: function(data, callback){

				var r = $$request.packageReq('del-bind-bankcard', null, data, 'POST', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 获取绑定的银行卡
			getBindBankCard: function(callback){

				var r = $$request.packageReq('get-bind-bankcard', null, null, 'GET', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 读取邮件
			readMesaage: function(data, callback){

				var r = $$request.packageReq('read-message', null, data, 'POST', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 一键回收平台余额
			onekeyBack: function(callback){

				var r = $$request.packageReq('onekey-back', null, null, 'POST', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 找回密码第一步
			getUserByFindPwd: function(data, callback){

				var r = $$request.packageReq('findPwd-1', null, data, 'POST', true, true);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 验证安全问题答案
			checkQA: function(data, callback){

				var r = $$request.packageReq('checkQA', null, data, 'POST', true, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 更新绑定邮箱
			changeMail: function(data, callback){

				var r = $$request.packageReq('change-mail', null, data, 'POST', true, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 检查老邮箱
			checkOldMail: function(data, callback){

				var r = $$request.packageReq('check-mail', null, data, 'POST', true, true);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 删除系统消息
			deleteMessage: function(data, callback){

				var r = $$request.packageReq('delete-message', null, data, 'POST', true, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 获取系统通知
			getMessage: function(data, callback){

				var r = $$request.packageReq('get-message', null, data, 'POST', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 更新用户信息
			modifyInfo: function(data, callback){

				var r = $$request.packageReq('modify-info', null, data, 'POST', true, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 绑定密保
			bindQa: function(data, callback){

				var r = $$request.packageReq('bind-qa', null, data, 'POST', true, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 绑定邮箱 
			bindMail: function(data, callback){

				var r = $$request.packageReq('bind-mail', null, data, 'POST', true, true);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 获取邮箱验证码
			getMailAuth: function(data, callback ){

				var r = $$request.packageReq('get-mail-auth', null, data, 'POST', true, true);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 绑定实名
			bindRealName: function(data, callback){

				var r = $$request.packageReq('bind-realname', null, data, 'POST', true, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 修改资金密码
			changeSafetyPwd: function(data, callback){

				var r = $$request.packageReq('change-safety-pwd', null, data, 'POST', true, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 修改登录密码
			changeLoginPwd: function(data, callback){

				var r = $$request.packageReq('change-pwd', null, data, 'POST', true, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 转账
			transfers: function(data, callback){

				var r = $$request.packageReq('transfers', null, data, 'POST', true, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 提现限制
			getLimit: function(callback){

				var r = $$request.packageReq('withdraw-limit', null, null, 'GET', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 申请提现
			withdraw: function(data, callback){

				var r = $$request.packageReq('withdraw', null, data, 'POST', true, false, false, true);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 微信支付宝充值
			aliPay: function(data, callback){

				var r = $$request.packageReq('aliPay', null, data, 'POST', true, false, false, true);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 转账充值
			transPay: function(data, callback){

				var r = $$request.packageReq('transPay', null, data, 'POST', true, false, false, true);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 在线充值
			onlinePay_s1: function(data, callback){

				var r = $$request.packageReq('onlinePay_s1', null, data, 'POST', true, false, false, true);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			/**
			 * 从字典中获取真实的页面名称
			 */
			 setSubTitle: function(id, scope){

				var d    = $$dic.conf('my-navs');
				var name = null;

			 	$.each(d, function(index, item) {
			 		 /* iterate through array or object */
			 		 $.each(item.children, function(index, val) {
			 		 	 /* iterate through array or object */

			 		 	 if (val.navId === id) {

			 		 	 	name = val[$rootScope.lang];
			 		 	 	return false;

			 		 	 };

			 		 });

			 		 if (name) {return false};

			 	});

			 	scope.$emit('switchNav', id);

			 	return name;

			 },

			/**
			 * 获取充值方式和银行对应关系
			 */
			getRechargePayment: function(callback){

				var r = $$request.packageReq('recharge_payment', null, null, 'GET', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			/**
			 * 获取各种记录列表
			 */
			getSearchDatas: function(code, query, callback){

				var o = null;

				// 是否需要求和总值
				if (angular.isUndefined(query.sum)) {

					query.sum = 1;
					query.startDate = query.startDate || $filter('date')(new Date(), 'yyyy-MM-dd');
					query.endDate = query.endDate || $filter('date')(new Date(), 'yyyy-MM-dd');

				};

				switch(code){

					case 'bonus': {

						this.getBonus(query, function(result){

							o = {

								"data": result.data.list,
								"counts": result.data.counts,
								"template": "table/bonus.html",
								"total": result.data.total

							}

							callback(o);

						})

					}break;
					case 'transfers': {

						this.getTransfers(query, function(result){

							o = {

								"data": result.data.list,
								"counts": result.data.counts,
								"total": result.data.total,
								"template": "table/transfers.html"

							}

							callback(o);

						})

					}break;
					case 'withdraw': {

						this.getWithdrawal(query, function(result){

							o = {

								"data": result.data.list,
								"counts": result.data.counts,
								"total": result.data.total,
								"template": "table/withdrawal.html"

							}

							callback(o);

						})

					}break;
					case 'recharge': {

						this.getCharge(query, function(result){

							o = {

								"data": result.data.list,
								"counts": result.data.counts,
								"total": result.data.total,
								"template": "table/recharge.html"

							}

							callback(o);

						})

					}break;
					case 'betting': {

						this.getBetting(query, function(result){

							o = {

								"data": result.data.list,
								"counts": result.data.counts,
								"total_bet": result.data.total_bet,
								"total_winloss": result.data.total_winloss,
								"template": "table/betting.html"

							}

							callback(o);

						})

					}break;

				}

			},

			/**
			 * 获取红利列表
			 */
			getBonus: function(query, callback){

				var r = $$request.packageReq('bonus-list', null, query, 'POST', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			/**
			 * 获取转账列表
			 */
			getTransfers: function(query, callback){

				var r = $$request.packageReq('transfers-list', null, query, 'POST', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			/**
			 * 获取提款列表
			 */
			getWithdrawal: function(query, callback){

				var r = $$request.packageReq('withdrawal-list', null, query, 'POST', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			/**
			 * 获取充值列表
			 */
			getCharge: function(query, callback){

				var r = $$request.packageReq('recharge-list', null, query, 'POST', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			/**
			 * 获取投注列表
			 */
			getBetting: function(query, callback){

				var r = $$request.packageReq('betting-list', null, query, 'POST', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			}

		}

	}])


})();