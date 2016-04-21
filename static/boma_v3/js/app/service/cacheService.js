/**
 * [Cache 缓存服务 - 使用HTML5 LOCALSTORAGE 来提供本地cache服务]
 */
(function(){

	angular.module('cache.service', [])

	.factory('$$cache', 
		[
			'$log', 
			'$rootScope', function($log, $rootScope) {

		return{

			// 设置缓存 [expires - 过期天数, -1 代表同session一同过期]
			put: function(key, value, expires){

				if (!window.localStorage) {return null};

				if (this.get('key')) {

					this.remove('key');

				};

				var o = {"expires": expires, "createDate": new Date(), "data":value };
				window.localStorage.setItem(key, angular.toJson(o));

			},

			// 获取缓存
			get: function(key){

				if (!window.localStorage) {return null};
				if (!window.localStorage.getItem(key)) {return null};

				var o = angular.fromJson( window.localStorage.getItem(key) );

				if(o.expires !== -1 && parseInt( ((new Date()).getTime() - (new Date(o.createDate).getTime())) / 1000 ) > (o.expires * 60 * 60 * 24)){

					window.localStorage.removeItem(key);
					return null;

				}

				return o;

			},

			// 删除缓存
			remove: function(key){

				if (!window.localStorage) {return null};
				if (!window.localStorage.getItem(key)) {return null};

				window.localStorage.removeItem(key);

			},

			// 日志
			logs: function(type, url, param, erroMsg){

				var u = 'NONE', e = {};
				if($rootScope.user){
					u = $rootScope.user.username
				};
				e["username"] = u;
				e["timestamp"] = parseInt( (new Date()).getTime() / 1000 );
				e["type"] = type;
				e["url"] = url;
				e["param"] = param;
				e["errorMsg"] = erroMsg;
				var os = angular.fromJson( window.localStorage.getItem('logs') );
				if (!os) {

					os = [];

				};
				os.push(e);
				window.localStorage.setItem("logs", angular.toJson(os));
			}

		}

	}])


})();