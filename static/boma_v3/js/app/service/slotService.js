/**
 * [slotService 提供老虎机相关服务]
 */
(function(){

	angular.module('slot.service', [])

	.factory('$$slot', 
		[
			'$log', 
			'$cookies',
			'$$request',
			'$rootScope', function($log, $cookies, $$request, $rootScope) {

		return{

			/**
			 * 更新PT平台密码
			 */
			modifyPTPwd: function(val, callback){

				var r = $$request.packageReq('modify-pt-pwd', null, {'password': val}, 'PUT', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			/**
			 * 获取幸运玩家
			 */
			getSlotLuckGuy: function(callback){

				var r = $$request.packageReq('slot-luckguy', null, null, 'GET', false, false, -1);

				$$request.action(r, function(result){

					callback(result);

				});

			},


		}

	}])


})();