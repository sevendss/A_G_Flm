/**
 * [verifiicationService 特殊校验服务]
 */
(function(){

	angular.module('verify', [])

	.factory('$$verify', 
		[
			'$log', 
			'$$base',
			'$rootScope', function($log, $$base, $rootScope) {

		return{

			s_withdrawForm: function(scope){

				var result = {'status': 0};

				var d1 = new Date(scope._withdrawQ.startDate).getTime();
				var d2 = new Date(scope._withdrawQ.endDate).getTime();

				if (d1> d2){

					result.status = -1;
					result.message = $$base.i18n('verify-date-1');

					return result;

				};

				return result;

			},

			s_transfersForm: function(scope){

				var result = {'status': 0};

				var d1 = new Date(scope._transfersQ.startDate).getTime();
				var d2 = new Date(scope._transfersQ.endDate).getTime();

				if (d1> d2){

					result.status = -1;
					result.message = $$base.i18n('verify-date-1');

					return result;

				};

				return result;

			},

			s_rechargeForm: function(scope){

				var result = {'status': 0};

				var d1 = new Date(scope._rechargeQ.startDate).getTime();
				var d2 = new Date(scope._rechargeQ.endDate).getTime();

				if (d1> d2){

					result.status = -1;
					result.message = $$base.i18n('verify-date-1');

					return result;

				};

				return result;

			},

			s_bettingForm: function(scope){

				var result = {'status': 0};

				var d1 = new Date(scope._bettingQ.startDate).getTime();
				var d2 = new Date(scope._bettingQ.endDate).getTime();

				if (d1> d2){

					result.status = -1;
					result.message = $$base.i18n('verify-date-1');

					return result;

				};

				return result;

			},

			s_bonusForm: function(scope){

				var result = {'status': 0};

				var d1 = new Date(scope._bonusQ.startDate).getTime();
				var d2 = new Date(scope._bonusQ.endDate).getTime();

				if (d1> d2){

					result.status = -1;
					result.message = $$base.i18n('verify-date-1');

					return result;

				};

				return result;

			},

			// 找回密码最后一步
			changeLoginPwdForm: function(scope){

				var result = {'status': 0};

				if (!scope.$parent._newPwd.newpassword || !scope.$parent._newPwd.cNewpassword){

					result.status = -1;
					result.message = $$base.i18n('verify-changePwd-1');

					return result;

				};

				return result;

			},

			// 找回密码第一步
			getUserByFindPwdForm: function(scope){

				var result = {'status': 0};

				if (!scope.$parent._user.account || !scope.$parent._user.token){

					result.status = -1;
					result.message = $$base.i18n('verify-findpwd-1');

					return result;

				};

				return result;

			},

			// 意见反馈
			feedbackForm: function(scope){

				var result = {'status': 0};

				if (!scope.$parent.$parent._feedback.title || !scope.$parent.$parent._feedback.content){

					result.status = -1;
					result.message = $$base.i18n('verify-feedback-1');

					return result;

				};

				if (scope.$parent.$parent._feedback.title.length > 50) {

					result.status = -1;
					result.message = $$base.i18n('verify-feedback-2');

					return result;

				};

				if (scope.$parent.$parent._feedback.content.length > 200) {

					result.status = -1;
					result.message = $$base.i18n('verify-feedback-3');

					return result;

				};

				return result;

			},

			// 个人信息变更
			modifyInfoForm: function(scope){

				var result = {'status': 0};

				if (scope._info.gender === $rootScope.user.info.gender &&
					scope._info.cellPhone === $rootScope.user.info.cellPhone &&
					scope._info.qq === $rootScope.user.info.qq){

					result.status = -1;
					result.message = $$base.i18n('verify-modifyInfo-1');

					return result;

				};

				return result;

			},

			// 绑定安全问题
			bindQaForm: function(scope){

				var result = {'status': 0};

				if (!scope._qa.problem_id) {

					result.status = -1;
					result.message = $$base.i18n('verify-QA-1');

					return result;

				};

				return result;

			},

			// 注册校验 
			registerForm: function(scope){

				var result = {'status': 0};

				if (!scope.$parent._register.username) {

					result.status = -1;
					result.message = $$base.i18n('verify-register-2');

					return result;

				};

				if (!/^[a-zA-Z_]\w{3,19}$/.test(scope.$parent._register.username)) {

					result.status = -1;
					result.message = $$base.i18n('verify-register-5');

					return result;

				};

				if (!scope.$parent._register.password) {

					result.status = -1;
					result.message = $$base.i18n('verify-register-3');

					return result;

				};

				if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,14}$/.test(scope.$parent._register.password)) {

					result.status = -1;
					result.message = $$base.i18n('verify-register-6');

					return result;

				};

				if (scope.$parent._register.password !== scope.$parent._register.password2) {

					result.status = -1;
					result.message = $$base.i18n('verify-register-4');

					return result;

				};

				if (!scope.$parent._register.checkcode) {

					result.status = -1;
					result.message = $$base.i18n('verify-register-7');

					return result;

				};

				if (!/^\w{4,4}$/.test(scope.$parent._register.checkcode)) {

					result.status = -1;
					result.message = $$base.i18n('verify-register-8');

					return result;

				};

				if (!scope.$parent._register.agree) {

					result.status = -1;
					result.message = $$base.i18n('verify-register-1');

					return result;

				};

				return result;

			},

			// 在线充值
			onlineForm: function(scope){

				var result = {'status': 0};

				if (!scope.$parent._recharge.pf) {

					result.status = -1;
					result.message = $$base.i18n('verify-recharge-1');

					return result;

				};

				if (Number(scope.$parent._recharge.online.amount) < Number(scope.$parent._payments.min_save) || 
					Number(scope.$parent._recharge.online.amount) > Number(scope.$parent._payments.max_save)) {

					result.status = -1;
					result.message = $$base.i18n('verify-recharge-2');

					return result;

				};

				return result;

			},

			// 银行转账
			transForm: function(scope){

				var result = {'status': 0};

				if (!scope.$parent._recharge.pf) {

					result.status = -1;
					result.message = $$base.i18n('verify-recharge-1');

					return result;

				};

				if (Number(scope.$parent._recharge.online.amount) < Number(scope.$parent._payments.min_save) || 
					Number(scope.$parent._recharge.online.amount) > Number(scope.$parent._payments.max_save)) {

					result.status = -1;
					result.message = $$base.i18n('verify-recharge-2');

					return result;

				};

				return result;

			},

			// 微信支付
			alipayForm: function(scope){

				var result = {'status': 0};

				if (!scope.$parent._recharge.pf) {

					result.status = -1;
					result.message = $$base.i18n('verify-recharge-1');

					return result;

				};

				if (Number(scope.$parent._recharge.online.amount) < Number(scope.$parent._payments.min_save) || 
					Number(scope.$parent._recharge.online.amount) > Number(scope.$parent._payments.max_save)) {

					result.status = -1;
					result.message = $$base.i18n('verify-recharge-2');

					return result;

				};

				return result;

			},

			// 提款
			withdrawForm: function(scope){

				var result = {'status': 0};

				if (!scope._withdraw.bank_code) {

					result.status = -1;
					result.message = $$base.i18n('verify-withdraw-1');

					return result;

				};

				if (Number(scope._withdraw.amount) < Number(scope._limit.per_min) || 
					Number(scope._withdraw.amount) > Number(scope._limit.per_max)) {

					result.status = -1;
					result.message = $$base.i18n('verify-withdraw-2');

					return result;

				};

				return result;

			},

			// 转账
			transfersForm: function(scope){

				var result = {'status': 0};

				if (!scope._transfers.trans_from || !scope._transfers.trans_to) {

					result.status = -1;
					result.message = $$base.i18n('verify-transfers-1');

					return result;

				};

				if (scope._transfers.trans_from === scope._transfers.trans_to) {

					result.status = -1;
					result.message = $$base.i18n('verify-transfers-2');

					return result;

				};

				return result;

			}

		}

	}])


})();