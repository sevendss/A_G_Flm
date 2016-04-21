/**
 * [commonService 公共请求服务]
 */
(function(){

	angular.module('common.service', [])

	.factory('$$common', 
		[
			'$log', 
			'$$request',
			'$$cache',
			'$rootScope', function($log, $$request, $$cache, $rootScope) {

		return{

			// 获取跑马灯公告
			getNotice: function(callback){

				var r = $$request.packageReq('get-notice', null, null, 'GET', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 获取服务器请求参数
			getToken: function(callback){

				var r = $$request.packageReq('get-token', null, null, 'GET', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 获取BANNER图片
			getBanners: function(callback){

				var r = $$request.packageReq('get-banners', null, null, 'GET', false, false, -1);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 获取活动图片
			getActivityWindow: function(callback){

				var r = $$request.packageReq('activity_window', null, null, 'GET', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			// 获取字典表
			getDictionary: function(name, callback){

				if ($$cache.get('dic.' + name)) {

					callback( $$cache.get('dic.' + name).data );
					return;

				};

				var r = $$request.packageReq('dictionary', [name], null, 'GET', false, false);

				$$request.action(r, function(result){

					$$cache.put('dic.' + name, result, 7);

					callback(result);

				});

			},

			// 通过给出字典NAME和KEY查询真实值
			getDicValue: function(data, callback){

				var r = $$request.packageReq('converter', null, data, 'POST', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			postLogs: function(data, callback){

				var r = $$request.packageReq('post-logs', null, data, 'POST', false, true);

				$$request.action(r, function(result){

					if(result.status < 0){return;}

					callback(result);

				});
				
			}


		}

	}])


})();