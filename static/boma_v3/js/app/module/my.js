(function() {

angular.module('my', [])


/**
 * [Controller]
 * 个人中心控制器
 */
.controller('__my', ['$scope', '$rootScope', '$$base', '$state', '$$dic', '$$modal', '$$user', '$timeout',
	function($scope, $rootScope, $$base, $state, $$dic, $$modal, $$user, $timeout) {

		/* 变量声明 */
		{

			if (!$rootScope.user) {window.location.href = "#/"; return false;};
			$rootScope.page.code = "my";
			$scope.navId = 10;

		}

		/* 业务逻辑 */
		{

			// 刷新个人信息
			$scope.$on('refreshBalance', function(event){

				$scope.refreshInfo();
				event.stopPropagation();

			});

			// 底层控制当前域选中菜单
			$scope.$on('switchNav', function(e, id){

				$scope.navId = id;
				e.stopPropagation();

			});

			// 跳转页面
			$scope.hrefPage = function(item){

				// $tools.openWindow()
				$scope.navId = item.navId;
				window.location.href = item.href; 

			}

			// 刷新个人信息
			$scope.refreshInfo = function(){

				if (!$rootScope.user) {return;};

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

			}

		}

		/* 初始化  */
		{	

			var p = $$base.switchBG('my');

			var w = $scope.$watch('$root.user', function(newValue, oldValue, scope) {
				
				if (!newValue) {

					$state.go('index');

				};

			});

			// 获取菜单
			$scope.navs = $$dic.conf('my-navs');

		}

		/* 销毁  */
		{

			$scope.$on('$destroy', function(){

				w();
				$timeout.cancel(p);
				
			});

		}

	}])

	// 个人中心首页
	.controller('__my.index', ['$scope', '$rootScope', '$$base', '$state', '$$dic', '$$my', '$$user', '$$modal',
		function($scope, $rootScope, $$base, $state, $$dic, $$my, $$user, $$modal) {

			/* 变量声明 */
		{

			$scope.tabs  = $$dic.conf('my-tabs');
			$scope.query = {"pageNo": 1, 'sum': 0};
			$scope._tab  = $scope.tabs[0];

		}

		/* 业务逻辑 */
		{

			// 一键回收
			$scope.onekeyBack = function(){

				$$modal.loading();
				$$user.getUserBalance(function(result){

					$$modal.loading();

					if (!$rootScope.user) {return;};

					$rootScope.user.balance = result.data;
					var tm = Number($rootScope.user.balance.centreBalance);
					$.each($rootScope.user.balance.platform, function(index, val) {
						 /* iterate through array or object */
						 tm += Number(val.balance);

					});

					$rootScope.user.balance.totleBalance = tm;
					
					$$modal.confirm(null, $$base.i18n('my-onekey-confirm-1')+$rootScope.user.balance.pfBalance+$$base.i18n('my-onekey-confirm-2'), null, function(){

						$$my.onekeyBack(function(result) {

							var message = '';

							$rootScope.user.balance.centreBalance = result.data.centreBalance;
							$rootScope.user.balance.lockedBalance = result.data.lockedBalance;

							// 回收成功
							if (angular.isArray(result.data.success) && result.data.success.length > 0) {

								message += $$base.i18n('my-onekey-result-1');

								$.each(result.data.success, function(index, val) {
									 /* iterate through array or object */

									$.each($rootScope.user.balance.platform, function(idx, v) {
										 /* iterate through array or object */

										 if (angular.uppercase(v.pf) == val.platform) {

										 	v.balance = val.balance;
										 	message  += v.name + "：" + val.amount + "\n";

										 };

									});

								});

							};

							// 回收失败
							if (angular.isArray(result.data.fail) && result.data.fail.length > 0) {

								message += $$base.i18n('my-onekey-result-2');

								$.each(result.data.fail, function(index, val) {
								 	/* iterate through array or object */

									$.each($rootScope.user.balance.platform, function(idx, v) {
										 /* iterate through array or object */

										 if (angular.uppercase(v.pf) == val.platform) {

										 	v.balance = val.balance;
										 	message  += v.name + "：" + val.amount + "\n";

										 };

									});

								});

							};

							$$modal.alert($$base.i18n('my-onekey-result-title'), message, 'success');

						})

					})

				})

			}

			// 查看更多记录
			$scope.showMore = function(){

				window.location.href = "#/my/history/" + $scope._tab.code;
				return false;

			}

			// 切换tab
			$scope.switchTab = function(item){

				if (item === $scope._tab) {return};

				$scope.query = {"pageNo": 1, 'sum': 0};
				$scope._tab = item;

				$scope.getTableDatas(item);

			}

			// 获取表格数据
			$scope.getTableDatas = function(item){

				$$my.getSearchDatas(item.code, $scope.query, function(result){

					$scope._display = result;

				});

			}

			// 转账到
			$scope.goTransfer = function(item){

				$rootScope._transfersTo = item.pf;
				$state.go('my.transfers');

			}

		}

		/* 初始化  */
		{	

			$$my.setSubTitle(10, $scope);
			$scope.getTableDatas($scope.tabs[0]);

		}

		
	}])

	// 充值控制器
	.controller('__my.recharge', ['$scope', '$rootScope', '$$my', '$$modal', '$$base',
		function($scope, $rootScope, $$my, $$modal, $$base) {


			/* 业务逻辑 */
			{

				// 获取付款方式
				$scope.getPayments = function(){

					$$my.getRechargePayment(function(result){

					 	$scope._payments = result.data;

					 	$scope.switchOnlinePayment($scope._payments.online[0]);

					})

				}

				// 切换在线支付的支付方式
				$scope.switchOnlinePayment = function(item){

					$scope._onlinebanks              = item;
					$scope._recharge.online.pay_type = item.id;
					$scope._recharge.online.bank_code = item.banks[0].code;

				}

				// 切换选中银行
				$scope.switchOnlineBank = function(item){

					$scope._recharge.online.bank_code = item.code;

				}

				// 切换选中转账银行
				$scope.switchTransBank = function(item){

					if ($scope._active.step === 2) {return;};

					$scope._bankTrans               = item;
					$scope._recharge.bank.bank_code = item.code;
					$scope._recharge.bank.card_no   = item.accountNo;

				}

				// 切换大的付款方式
				$scope.switchPayment = function(item){

					$scope._pType = item;

					if ($scope._pType === 'online') {

						$scope.switchOnlinePayment($scope._payments.online[0]);

					};

					if ($scope._pType === 'bank') {

						$scope.switchTransBank($scope._payments.transfer[0]);

					};

				}

				// 在线存款第一步
				$scope.onlinePay_s1 = function(){

					$scope._recharge.online.platform = $scope._recharge.pf;

					if ($scope._recharge.online.amount.indexOf('.') === ($scope._recharge.online.amount.length -1) ) {

						$scope._recharge.online.amount = parseInt($scope._recharge.online.amount);
						
					};

					$$my.onlinePay_s1($scope._recharge.online, function(result) {

						$$modal.confirm(null, $$base.i18n('recharge-online_s1') + result.data.order + '\n' + $$base.i18n('recharge-money') + $scope._recharge.online.amount + 'RMB',
							$$base.i18n('recharge-confirm-pay'), function() {

								$tools.openWindow(result.data.url);

							}, $$base.i18n('common-close'), null, false, true)

					})

				}

				// 银行转账第一步
				$scope.transPay = function(){

					$scope._recharge.bank.platform = $scope._recharge.pf;

					if ($scope._recharge.bank.amount.indexOf('.') === ($scope._recharge.bank.amount.length -1) ) {

						$scope._recharge.bank.amount = parseInt($scope._recharge.bank.amount);
						
					};

					$$my.transPay($scope._recharge.bank, function(result) {

						// $$modal.alert(null, $$base.i18n('recharge-trans_s1') + result.data.msg, 'success', null , null)

						$scope._active.step     = 2;
						$scope._active.code     = result.data.msg;
						$scope._active.bank_url = result.data.bank_url;

					})

				}

				// 支付宝微信付款
				$scope.aliPay = function(){

					$scope._recharge.alipay.platform = $scope._recharge.pf;

					if ($scope._recharge.alipay.amount.indexOf('.') === ($scope._recharge.alipay.amount.length -1) ) {

						$scope._recharge.alipay.amount = parseInt($scope._recharge.alipay.amount);
						
					};

					$$my.aliPay($scope._recharge.alipay, function(result) {

						$scope._wxInfo = result.data;

						$scope._alipayDetail = true;

						$scope._alipayType = 'a1';

					})

				}

				// 切换微信和支付宝支付
				$scope.switchAlipayType = function(item){

					$scope._alipayType = item;

				}

				// 复制
				$scope.copy = function(){

					$$modal.tips('复制附言成功');

				}


			}

			/* 初始化  */
			{

				$scope.title     = $$my.setSubTitle(11, $scope);
				$scope._recharge = {"online":{}, "bank":{}, "alipay":{}};
				$scope._payments = {};
				$scope._pType    = 'online';
				$scope._active   = {"step": 1};

				var w = $scope.$watch('$root.user.safety', function(newValue){

					if (!newValue || angular.isUndefined(newValue.is_realname)) {return};

					// 没有实名认证等
					// if (newValue.is_realname === -1 || newValue.is_fund_password === -1) {

					// 	$$modal.alert(null, $$base.i18n('my-risk'), 'info', null, function(){

					// 		window.location.href = "#/my/safety";
					// 		return false;

					// 	});

					// 	return;

					// };

					$scope.getPayments();


				});
				

			}

			/* 初始化  */
			{

				$scope.$on('$destroy', function(){

					w();

				});

			}

	}])

	// 提款
	.controller('__my.withdraw', ['$scope', '$rootScope', '$$my', '$$modal', '$$base',
		function($scope, $rootScope, $$my, $$modal, $$base) {

			/* 变量声明 */
		{

			$scope._withdraw = {};
			
		}

		/* 业务逻辑 */
		{

			// 提款详情
			$scope.showRule = function(){

				$$modal.popup($scope, 'withdraw');

			}

			// 提现
			$scope.withdraw = function(){

				$$my.withdraw($scope._withdraw, function(result){

					$scope.getBindBankCard();

					$$modal.alert(null, result.msg, 'success', null , null);

					var b = $scope._withdraw.bank_code;
					$scope._withdraw = {};
					$scope._withdraw.bank_code = b;

					$scope.$emit('refreshBalance');

				})

			}

			// 获取提现限制
			$scope.getLimit = function(){

				$$my.getLimit(function(result){

					$scope._limit = result.data;

				})

			}

			// 获取绑定银行卡
			$scope.getBindBankCard = function(){

				$$my.getBindBankCard(function(result){

					$scope.bindCards = result.data;

					$scope.setBindCard($scope.bindCards[0]);

				})

			}

			// 删除银行卡 
			$scope.delBindBankCard = function(item){

				var array = [];
				$.each($scope.bindCards, function(index, val) {
					 /* iterate through array or object */

					 if (val.id !== item.id) {

					 	array.push(val);

					 };

				});

				$scope.bindCards = array;

				$$my.delBindBankCard({"id": item.id}, function(result){

					$$modal.tips($$base.i18n('withdraw-del-card') + item.card_no.substr(item.card_no.length - 4), 'success');

				})

			}

			// 设置绑定的银行卡
			$scope.setBindCard = function(item){

				item = item || null;
				if (item) {

					$scope._withdraw.bank_code = item.bank_code;
					$scope._withdraw.bank_address = item.bank_address;
					$scope._withdraw.branch_name = item.branch_name;
					$scope._withdraw.card_no = item.card_no;

				}else{

					$scope._withdraw.bank_address = "";
					$scope._withdraw.branch_name = "";
					$scope._withdraw.card_no = "";

				}

				$scope._b = item;

			}

		}

		/* 初始化  */
		{	

			$scope.title = $$my.setSubTitle(12, $scope);

			var w = $scope.$watch('$root.user.safety', function(newValue){

				if (!newValue || angular.isUndefined(newValue.is_realname)) {return};

				// 没有实名认证等
				if (newValue.is_realname === -1 || newValue.is_fund_password === -1) {

					$$modal.alert(null, $$base.i18n('my-risk'), 'info', null, function(){

						window.location.href = "#/my/safety";
						return false;

					});

					return;

				};

				$scope.getLimit();

			});

			$scope.getBindBankCard();
			
		}

		/* 销毁  */
		{

			$scope.$on('$destroy', function(){

				w();

			});

		}

		
	}])

	// 转账
	.controller('__my.transfers', ['$scope', '$rootScope', '$$my', '$$modal', '$$base', '$$user',
		function($scope, $rootScope, $$my, $$modal, $$base, $$user) {

		/* 变量声明 */
		{

			// 当前已刷新过
			$scope.tempRefresh = {};

			$scope._transfers            = {};
			$scope._transfers.trans_to = $rootScope._transfersTo || 'GD';
			$rootScope._transfersTo    = undefined;
			$scope.title  = $$my.setSubTitle(13, $scope);

		}

		/* 业务逻辑 */
		{

			// 切换平台
			$scope.selectPf = function(key){

				if ($scope._transfers.trans_from == 'CENTER' && $scope._transfers.trans_to == 'CENTER') {

					if (key === 'from') {

						$scope._transfers.trans_to = 'GD';
						
					}else{

						$scope._transfers.trans_from = 'GD';
						
					}


				};

				if ($scope._transfers.trans_from != 'CENTER' && $scope._transfers.trans_to != 'CENTER') {

					if (key === 'from') {

						$scope._transfers.trans_to = 'CENTER';
						
					}else{

						$scope._transfers.trans_from = 'CENTER';
						
					}

				};

				// 刷新平台余额
				if ($scope._transfers.trans_from == 'CENTER') {

					$scope.getUserBalanceWithPF($scope._transfers.trans_to);

				}else{

					$scope.getUserBalanceWithPF($scope._transfers.trans_from);

				}

			}

			// 转账
			$scope.transfers = function(){

				if ($scope._transfers.trans_amount.indexOf('.') === ($scope._transfers.trans_amount.length -1) ) {

					$scope._transfers.trans_amount = parseInt($scope._transfers.trans_amount);
					
				};

				$$my.transfers($scope._transfers, function(result){

					$$modal.alert(null, $$base.i18n('transfers-scuess'), 'success');
					
					$scope._transfers.trans_amount  = '';
					$scope._transfers.fund_password = '';

					$scope.$emit('refreshBalance');

				})

			}

			// 交换平台
			$scope.changePf = function(){

				var o1 = angular.copy($scope._transfers.trans_from);
				var o2 = angular.copy($scope._transfers.trans_to);

				$scope._transfers.trans_from = o2;
				$scope._transfers.trans_to 	 = o1;

			}

			// 刷新平台余额
			$scope.getUserBalanceWithPF = function(pf){

				// 先从临时最新余额取值避免重复刷新
				var refreshed = false;
				if (angular.isDefined($scope.tempRefresh[pf])) {refreshed = true; return false};
				if (refreshed) {return;};

				// 发送请求从后台刷
				$$user.getUserBalanceWithPF({"mode": 1, "pf": pf}, function(result){

					$scope.tempRefresh[pf] = '￥' + result.data;

				})

			}

		}

		/* 初始化  */
		{	

			$scope.getUserBalanceWithPF($scope._transfers.trans_to);

		}

		/* 销毁  */
		{

			$scope.$on('$destroy', function(){

				$scope.$emit('refreshBalance');
				
			});

		}
		
	}])

	// 记录明细
	.controller('__my.history', ['$scope', '$rootScope', '$$my', '$$dic', '$filter', '$$base',
		function($scope, $rootScope, $$my, $$dic, $filter, $$base) {

		/* 变量声明 */
		{

			
		}

		/* 业务逻辑 */
		{

			// 切换TAB
			$scope.switchTab = function(item){

				window.location.href = '#/my/history/' + item.code;

			}

			// 查询红利
			$scope.search_bonus = function(pageNo){

				$scope._bonusQ.pageNo = pageNo || 1;

				$$my.getSearchDatas('bonus', $scope._bonusQ, function(result){

					result.fn = $scope.search_bonus;
					$scope._totalcontent = $$base.i18n('his-total-bonus') + '<label>'+ $filter('currency')(result.total, '', 2)+'</label>';
					$scope._display = result;

				});

			}

			// 转账
			$scope.search_transfers = function(pageNo){

				$scope._transfersQ.pageNo = pageNo || 1;

				$$my.getSearchDatas('transfers', $scope._transfersQ, function(result){

					result.fn = $scope.search_transfers;
					$scope._totalcontent = $$base.i18n('his-total-trans') + '<label>'+ $filter('currency')(result.total, '', 2)+'</label>';
					$scope._display = result;

				});

			}

			// 提款
			$scope.search_withdraw = function(pageNo){

				$scope._withdrawQ.pageNo = pageNo || 1;

				$$my.getSearchDatas('withdraw', $scope._withdrawQ, function(result){

					result.fn = $scope.search_withdraw;
					$scope._totalcontent = $$base.i18n('his-total-draw') + '<label>'+ $filter('currency')(result.total, '', 2)+'</label>';
					$scope._display = result;

				});

			}

			// 充值
			$scope.search_recharge = function(pageNo){

				$scope._rechargeQ.pageNo = pageNo || 1;

				$$my.getSearchDatas('recharge', $scope._rechargeQ, function(result){

					result.fn = $scope.search_recharge;
					$scope._totalcontent = $$base.i18n('his-total-chrage') + '<label>'+ $filter('currency')(result.total, '', 2)+'</label>';
					$scope._display = result;

				});

			}

			// 投注
			$scope.search_betting = function(pageNo){

				$scope._bettingQ.pageNo = pageNo || 1;

				$$my.getSearchDatas('betting', $scope._bettingQ, function(result){

					result.fn = $scope.search_betting;
					$scope._totalcontent = $$base.i18n('his-total-bet1') + '<label>'+ $filter('currency')(result.total_bet, '', 2)+'</label>　　';
					$scope._totalcontent += $$base.i18n('his-total-bet2') + '<label>'+ $filter('currency')(result.total_winloss, '', 2)+'</label>';
					$scope._display = result;

				});

			}

			// 监听URL
			var w = $scope.$watch('$stateParams.type', function(newValue, oldValue, scope) {

				$scope._tc = newValue;
				
				// 获取表格数据, 变换标题
				switch (newValue){

					case 'bonus': { $scope.search_bonus();  $scope.title     = $$my.setSubTitle(21, $scope);} break;
					case 'withdraw': { $scope.search_withdraw(); $scope.title  = $$my.setSubTitle(22, $scope);} break;    
					case 'transfers':{ $scope.search_transfers(); $scope.title = $$my.setSubTitle(23, $scope);} break;      
					case 'betting': { $scope.search_betting(); $scope.title   = $$my.setSubTitle(24, $scope);} break;  
					case 'recharge':{ $scope.search_recharge(); $scope.title  = $$my.setSubTitle(25, $scope);} break;    

				}
				
			});

		}

		/* 初始化  */
		{	

			$scope.tabs  = $$dic.conf('my-tabs');
			$scope._display = {};
			$scope._bonusQ = {};
			$scope._transfersQ = {};
			$scope._withdrawQ = {};
			$scope._rechargeQ = {};
			$scope._bettingQ = {};

		}

		/* 销毁监听  */
		{

			$scope.$on('$destroy', function(){

				w();

			});

		}

		
	}])

	// 安全中心
	.controller('__my.safety', ['$scope', '$rootScope', '$$my', '$$modal', '$$base', '$$user', '$timeout', '$location',
		function($scope, $rootScope, $$my, $$modal, $$base, $$user, $timeout, $location) {

		/* 变量声明 */
		{


		}

		/* 业务逻辑 */
		{

			// 回到安全中心首页
			$scope.$on('backSafetyCenter', function(e){

				window.location.href = '#/my/safety';
				$scope._display = undefined;
				e.stopPropagation();
				$timeout(function(){$scope.$apply()})

			});

			// 绑定安全问题
			$scope.bindQa = function(){

				$$my.bindQa($scope._qa, function(result){

					$$modal.alert(null, $$base.i18n('my-bindqa-success'), 'success', null, function(){
						
						$$user.refreshSafety();
						$scope._qa = {};
						$scope._display = undefined;
						window.location.href = '#/my/safety';
						$scope.$apply();

					});

				});

			}

			// 获取邮箱验证码
			$scope.getAuthCode = function(){

				var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

				if (!reg.test($scope._mail.email)) {

					$$modal.alert(null, $$base.i18n('my-mail-format-error'), 'error');
					return;

				};

				$scope._checkMail = true;
				$$my.getMailAuth($scope._mail, function(result){

					if (result.status < 0) {

						$scope._checkMail = false;
						$$modal.alert(null, result.msg, 'error');
						return;

					};

					$$modal.alert(null, $$base.i18n('my-mail-send'), 'success');

				});

			}

			// 绑定邮箱
			$scope.bindMail = function(){

				var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

				if (!reg.test($scope._mail.email)) {

					$$modal.alert(null, $$base.i18n('my-mail-format-error'), 'error');
					return;

				};

				$$my.bindMail($scope._mail, function(result){

					if (result.status < 0) {

						$scope._checkMail = false;
						$$modal.alert(null, result.msg, 'error');
						return;

					};

					$$modal.alert(null, $$base.i18n('my-bind-mail-success'), 'success', null, function(){

						$$user.refreshSafety();
						$scope._mail = {};
						$scope._display = undefined;
						window.location.href = '#/my/safety';
						$scope.$apply();

					});

				});

			}

			// 跳转链接
			$scope.linkTo = function(code){

				window.location.href = '#/my/safety/' + code;
				return false;

			}

			// 去操作
			$scope.goBind = function(code){


				if (code === 'pwd') {

					window.location.href = '#/my/password';
					return;

				};

				if (code === 'safetypwd') {

					window.location.href = '#/my/password';
					$rootScope.changePwdType = 'safety';
					return;

				};

				if (!$rootScope.user.safety) {

					$$modal.tips($$base.i18n('my-loading-safe'), 'info');
					return;

				};

				if (code === 'realname') {

					if ($rootScope.user.safety.is_realname === 0) {

						$$modal.alert(null, $$base.i18n('my-realname-done') + $rootScope.user.safety.realname, 'info');
						window.location.href = '#/my/safety';
						return false;

					};

					$scope._display = 'realName';
					return;
					
				};

				if (code === 'mail') {

					if ($rootScope.user.safety.is_email === 0) {

						$$modal.confirm(null, $$base.i18n('my-mail-done'), $$base.i18n('my-mail-done-btn'), function(){

							$scope._display = 'changeMail';
							$scope.$apply();

						}, null, function(){

							window.location.href = '#/my/safety';
							return false;

						});

						return;

					};

					$scope._display = 'mail';
					return;

				};

				if (code === 'qa') {

					if ($rootScope.user.safety.is_answer === 0) {

						$scope._display = 'changeQa';
						return;

					};

					$scope._display = 'qa';
					return;

				};

			}

			// 绑定实名
			$scope.bindRealName = function(){

				$$my.bindRealName($scope._realName, function(){

					$$modal.alert(null, $$base.i18n('my-realname-done1'), 'success', null, function(){

						$$user.refreshSafety();
						$scope._realName = {};
						$scope._display  = undefined;
						window.location.href = '#/my/safety';
						$scope.$apply();

					});
				})

			}


		}

		/* 初始化  */
		{	

			$scope.title     = $$my.setSubTitle(30, $scope);
			$scope._realName = {};
			$scope._mail     = {};
			$scope._qa       = {}

			var w_in = $scope.$watch('$stateParams.in', function(newValue, oldValue, scope) {
				
				if (newValue && ['realname', 'safetypwd','mail','qa'].indexOf(newValue) > -1) {

					$scope.goBind(newValue);
					return;
				}

				$scope._display  = undefined;

			});
			
		}

		/* 销毁  */
		{

			$scope.$on('$destroy', function(){

				w_in();

			});

		}

		
	}])

	// 更改密码
	.controller('__my.changePwd', ['$scope', '$rootScope', '$$my', '$$modal', '$$base', '$$user',
		function($scope, $rootScope, $$my, $$modal, $$base, $$user) {

		
		/* 业务逻辑 */
		{

			// 切换TAB
			$scope.switchTab = function(code){

				$scope._tc = code;

			}

			// 修改登录密码
			$scope.changeLoginPwd = function(){

				$$my.changeLoginPwd($scope._loginP, function(){

					$$modal.alert(null, $$base.i18n('my-change-login-pass-c'), 'success', null, null);
					$scope._loginP = {};

				})

			}

			// 修改资金密码
			$scope.changeSafetyPwd = function(){

				$$my.changeSafetyPwd($scope._safety, function(){

					$$modal.alert(null, $$base.i18n('my-change-safe-pass-c'), 'success', null, null);
					$$user.refreshSafety();
					$scope._safety = {};

				})

			}

		}

		/* 初始化  */
		{	

			$scope.title             = $$my.setSubTitle(32, $scope);
			$scope._tc               = $rootScope.changePwdType || 'login';
			$rootScope.changePwdType = undefined;
			$scope._safety           = {};
			$scope._loginP           = {};

		}

		
	}])

	// 更改密码
	.controller('__my.info', ['$scope', '$rootScope', '$$my', '$$modal', '$$base',
		function($scope, $rootScope, $$my, $$modal, $$base) {


		/* 业务逻辑 */
		{

			var w = $scope.$watch('$root.user.info', function(newValue, oldValue, scope) {
				
				if (!newValue) {return};

				$scope._info = angular.copy($rootScope.user.info);

			});	


			// 更新个人信息
			$scope.modifyInfo = function(){

				$$my.modifyInfo($scope._info, function(){

					$rootScope.user.info.gender = angular.copy($scope._info.gender);
					$rootScope.user.info.cellPhone = angular.copy($scope._info.cellPhone);
					$rootScope.user.info.qq = angular.copy($scope._info.qq);
					$$modal.alert(null, $$base.i18n('my-change-info'), 'success', null, null);

				})

			}

		}

		/* 初始化  */
		{	

			$scope.title = $$my.setSubTitle(31, $scope);

			$scope.$on('$destroy', function(){

				w();

			});
			
		}

		
	}])

	// 系统通知
	.controller('__my.message', ['$scope', '$rootScope', '$$my', '$$modal', '$$base',
		function($scope, $rootScope, $$my, $$modal, $$base) {


		/* 业务逻辑 */
		{

			// 查询消息
			$scope.search_message = function(pageNo){

				$scope.pageNo = pageNo || 1;

				$$my.getMessage({'page': $scope.pageNo}, function(result){

					result.data.fn = $scope.search_message;
					$scope._display = result.data;

				});

			}

			$scope.showContent = function(item){

				// $$modal.alert(null, item.content, 'info');

				$scope._message = item.content.replace(/\n/g,"<br>");

				$$modal.popup($scope, 'message-detail')

				if (item.is_read != 0) {return;};

				$$my.readMesaage({'ids':[item.id]}, function(result){

					item.is_read = 1;
					$rootScope.user.info.unreadMsg -- ;

				})

			}

			$scope.deleteMsg = function(item){

				$$my.deleteMessage({'ids':[item.id]}, function(){

					$$modal.alert(null, $$base.i18n('my-delete-message'), 'success', null, null);

					$scope._display.list.splice($scope._display.list.indexOf(item), 1);

					if ($scope._display.list.length === 0) {

						var t = parseInt($scope._display.counts/ 15);

						if ($scope._display.counts % 15 !== 0) {t++;};

						if ($scope.pageNo === t) {$scope.pageNo --;}

						$scope.search_message($scope.pageNo);

					};

				})

			}

			// 全部标记为已读
			$scope.readAll = function(){

				var delIds = [];

				$.each($scope._display.list, function(index, val) {
					 /* iterate through array or object */

					 if (val.is_read == 0) {

					 	delIds.push(val.id);

					 };

				});

				if (delIds.length === 0) {

					$$modal.alert(null, $$base.i18n('my-message-read'), 'info');
					return;

				};

				$$modal.confirm(null, $$base.i18n('my-message-read-c'), null, function(){

					$$my.readMesaage({'ids': delIds}, function(result){

						// 标记已读
						$.each($scope._display.list, function(index, val) {

							 if (val.is_read == 0) {

							 	val.is_read = 1;
							 	$rootScope.user.info.unreadMsg -- ;

							 };

						});

						$$modal.alert(null, '标记已读成功', 'success');

					})

				})

			}

			// 删除全部
			$scope.delAll = function(){

				if ($scope._display.list.length === 0) {

					$$modal.alert(null, $$base.i18n('my-message-del'), 'info');
					return;

				};

				var delIds = [];

				$.each($scope._display.list, function(index, val) {
					 /* iterate through array or object */

					 delIds.push(val.id);

				});

				$$modal.confirm(null, $$base.i18n('my-message-del-c'), null, function(){

					$$my.deleteMessage({'ids':delIds}, function(result){

						var t = parseInt($scope._display.counts/ 15);
							
						if ($scope._display.counts % 15 !== 0) {t++;};

						if ($scope.pageNo === t) {$scope.pageNo --;}

						$scope.search_message($scope.pageNo);	

						$$modal.alert(null, '清空消息成功', 'success');

					})

				})

			}

		}

		/* 初始化  */
		{	

			$scope.title = $$my.setSubTitle(41, $scope);
			$scope._display = {};
			$scope._display.template = 'table/message.html';
			$scope.search_message();

		}

		
	}])

	// 修改绑定邮箱
	.controller('__my.c.mail', ['$scope', '$rootScope', '$$my', '$$modal', '$$base', '$$user',
		function($scope, $rootScope, $$my, $$modal, $$base, $$user) {


		/* 业务逻辑 */
		{

			// 获取验证码
			$scope.getAuthCode = function(step){

				if (step === 1) {

					$scope._mailToken = true;
					$$my.getMailAuth(null, function(result){

						if (result.status < 0) {

							$scope._mailToken = false;
							$$modal.alert(null, result.msg, 'error');
							return;

						};

						$$modal.alert(null, $$base.i18n('my-mail-send'), 'success');

					});
				
					return;	
				};

				if (step === 2) {

					var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

					if (!reg.test($scope._newMail.email)) {

						$$modal.alert(null, $$base.i18n('my-mail-format-error'), 'error');
						return;

					};

					$scope._mailToken = true;
					$$my.getMailAuth($scope._newMail, function(result){

						if (result.status < 0) {

							$scope._mailToken = false;
							$$modal.alert(null, result.msg, 'error');
							return;

						};

						$$modal.alert(null, $$base.i18n('my-mail-send'), 'success');

					});

				};

			}

			// 验证老邮箱
			$scope.changeBindMail = function(){

				var o = angular.copy($scope._oldMail);
				delete o.email;
				$$my.checkOldMail(o, function(result){

					if (result.status < 0) {

						$scope._mailToken = false;
						$$modal.alert(null, result.msg, 'error');
						return;

					};

					$scope._newMail.token = result.data.token;
					$scope._s = 2;
					$scope._mailToken = false;

				})

			}

			// 设置新邮箱
			$scope.bindNewMail = function(){

				var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

				if (!reg.test($scope._newMail.email)) {

					$$modal.alert(null, $$base.i18n('my-mail-format-error'), 'error');
					return;

				};

				$$my.changeMail($scope._newMail, function(result){

					$$modal.alert(null, $$base.i18n('my-bind-mail-success'), 'success', null, function(){

						$$user.refreshSafety();
						$scope.$emit('backSafetyCenter');

					});

				});

			}


		}

		/* 初始化  */
		{	

			$scope._s = 1;
			$scope._oldMail = {};
			$scope._oldMail.email = angular.copy($rootScope.user.safety.email);
			$scope._newMail = {};

		}

		
	}])

	// 修改安全问题
	.controller('__my.c.qa', ['$scope', '$rootScope', '$$my', '$$modal', '$$base', '$$user',
		function($scope, $rootScope, $$my, $$modal, $$base, $$user) {


		/* 业务逻辑 */
		{

			// 获取验证码
			$scope.getAuthCode = function(step){

				$scope._mailToken = true;
				$$my.getMailAuth(null, function(result){

					if (result.status < 0) {

						$scope._mailToken = false;
						$$modal.alert(null, result.msg, 'error');
						return;

					};

					$$modal.alert(null, $$base.i18n('my-mail-send'), 'success');

				});

			}

			// 验证安全问题
			$scope.checkQA = function(){

				$$my.checkQA($scope._oldQa, function(result){

					$scope._qa.token = result.data.token;
					$scope._s = 2;

				})

			}

			// 验证老邮箱
			$scope.checkMail = function(){

				var o = angular.copy($scope._oldMail);
				delete o.email;
				$$my.checkOldMail(o, function(result){

					if (result.status < 0) {

						$scope._mailToken = false;
						$$modal.alert(null, result.msg, 'error');
						return;

					};

					$scope._qa.token = result.data.token;
					$scope._s = 2;

				})

			}

			// 更改密保
			$scope.changeBindQA = function(){

				$$my.bindQa($scope._qa, function(result){

					$$modal.alert(null, $$base.i18n('my-bindqa-success'), 'success', null, function(){
						
						$$user.refreshSafety();
						$scope.$emit('backSafetyCenter');

					});

				});

			}


		}

		/* 初始化  */
		{	

			$scope._s = 1;
			$scope._oldQa = {};
			$scope._oldQa.prob_id = $rootScope.user.safety.answer_key;

			$scope._qa = {};

			$scope._oldMail = {};
			$scope._oldMail.email = angular.copy($rootScope.user.safety.email);

		}

		
	}])

	// 找回密码
	.controller('__my.c.pwd', ['$scope', '$rootScope', '$$my', '$$modal', '$$base', '$timeout',
		function($scope, $rootScope, $$my, $$modal, $$base, $timeout) {


		/* 业务逻辑 */
		{

			// 获取用户ID等信息
			$scope.getUserByFindPwd = function(){

				$$my.getUserByFindPwd($scope._user, function(result){

					if (result.status < 0) {

						// 刷新验证码
						$rootScope.checkcode_ran = Math.ceil(Math.random()*100000000);
						$$modal.alert(null, result.msg, 'error');
						return;
					};

					if (!result.data.email && !result.data.problem_id) {

						$$modal.alert(null, $$base.i18n('my-findPwd-noSafe'), 'info');
						return;

					};

					$scope._safety = result.data;
					$scope._safety.prob_id = result.data.problem_id;
					$scope._safety.auth_type = 1; //接口表示找回密码，需要传userid
					$scope._s = 2;

				})

			}

			// 获取验证码
			$scope.getAuthCode = function(step){

				$scope._mailToken = true;
				$$my.getMailAuth($scope._safety, function(result){

					if (result.status < 0) {

						$scope._mailToken = false;
						$$modal.alert(null, result.msg, 'error');
						return;

					};

					$$modal.alert(null, $$base.i18n('my-mail-send'), 'success');

				});

			}

			// 验证安全问题
			$scope.checkQA = function(){

				$$my.checkQA($scope._safety, function(result){

					$scope._newPwd.token = result.data.token;
					$scope._s = 3;

				})

			}

			// 验证老邮箱
			$scope.checkMail = function(){

				var o = angular.copy($scope._safety);
				delete o.email;
				$$my.checkOldMail(o, function(result){

					if (result.status < 0) {

						$scope._mailToken = false;
						$$modal.alert(null, result.msg, 'error');
						return;

					};

					$scope._newPwd.token = result.data.token;
					$scope._s = 3;

				})

			}

			// 更改密码
			$scope.changePwd = function(){

				$scope._newPwd.id = $scope._safety.id;
				$scope._newPwd.auth_type = 1;

				$$my.changeLoginPwd($scope._newPwd, function(){

					$scope._s = 4;

				})

			}

			// 去登录
			$scope.goLoginI = function(){

				$$modal.popupClose();

				$timeout(function(){

					$rootScope.triggers.login ={'bullet': Math.ceil(Math.random() * 1000000)};
					$scope.$apply();

				}, 300)
			}


		}

		/* 初始化  */
		{	

			$scope.$on('clear', function(){
				
				$scope._s = 1;
				
				$scope._user = {};
				$scope._qa = {};
				$scope._mail = {};
				$scope._newPwd = {};

				$scope._mailToken = false;
				
			});

		}

		
	}])

})();