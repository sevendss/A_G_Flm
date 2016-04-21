/**
 * [BaseServices]
 * @return {[type]} [基础服务]
 */
(function(){

	angular.module('base.service', [])

	.factory('$$base', 
		[
			'$log', 
			'$filter', 
			'$q', 
			'$http', 
			'$rootScope', 
			'$timeout', 
			'$translate', function($log, $filter, $q, $http, $rootScope, $timeout, $translate) {

		return{

			// 延迟切换背景图
			switchBG: function(page){

				return $timeout(function(){

					$rootScope.bg = page;

				}, 1000);

			},

			/**
			 * 远端服务器获取JSON文件
			 * @param  {[type]}   url      [description]
			 * @param  {[type]}   options  [description]
			 * @param  {Function} callback [description]
			 * @return {[void]}            [description]
			 */
			loadJson: function(url, refresh, callback){

				refresh = refresh || false;

				if (refresh) {

					url += '?r=' + Math.ceil(Math.random()*999999999);

				};

				$.getJSON((window.$path + url), null, function(json, textStatus) {
						
					if (angular.isFunction(callback)) {

						callback(json);

					};

					return json;	

				});

			},

			/**
			 * 国际化JS中匹配
			 * @param  {[type]} key [description]
			 * @return {[type]}     [description]
			 */
			i18n: function(key) {

	            if(key){

	                return $translate.instant(key);

	            }

	            return key;

	        },
	        /**
	        *
	        *
	        */
	        postions: function(ement1 , ement2){
	        	var left = ement1.offset().left + ement1.width()-ement2.width();
	        	return left;
	        }

	        
		}

	}])


})();