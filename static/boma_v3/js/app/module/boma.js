/**
 * bomaV3 全站依赖注入工作区
 * 严禁在此添加非全局模块
 */
(function() {

	window.$boma = angular;

	angular.module('boma', [

		'ngCookies',
		'w5c.validator',
		'ngClipboard',
		'pascalprecht.translate',
		'framework',
		'framework.directive',
		'bomaRouter',
		'ngAnimate',
		'base.service',
		'base.filter',
		'base.directive',
		'cache.service',
		'dic.service',
		'static.service',
		'modal',
		'request',
		'verify',
		'home',
		'user',
		'slot',
		'slot.directive',
		'slot.service',
		'casino',
		'casino.directive',
		'sports',
		'lottery',
		'promotion',
		'promotion.directive',
		'client',
		'my',
		'my.service',
		'game',
		'common.service',
		'help',
		'rule',
		'speed',
		'domain',
		'spread'
	])

	/**
	 * 注册全局事件，定义全局变量等
	 * @param  {[type]} $rootScope) {		$rootScope.$path [description]
	 * @return {[type]}             [description]
	 */
	.run(['$rootScope', '$cookies', '$$dic', '$log', function ($rootScope, $cookies, $$dic, $log) {

		//静态资源地址
		$rootScope.workspace = window.$path;	

		//客户端环境
		window.client = $rootScope.client 	 = {};
		$rootScope.client.browser = $tools.getBrowser();
		$rootScope.client.device  = $tools.getDevice();
		$rootScope.client.screen  = {height: screen.height, width: screen.width};

		if (window.model === 'dev') {

			$log.info("##browser:" + $rootScope.client.browser.name +" #version:"+ $rootScope.client.browser.version);
			$log.info("##device:" + $rootScope.client.device);
			$log.info("##screen:" + $rootScope.client.screen.width + "*" + $rootScope.client.screen.height);
			
		};

		//语言设置
		$rootScope.lang = $cookies.get('lang') || 'zh-cn';
		$cookies.put('lang', $rootScope.lang);

		//AJAX加载script允许走cache
		$.ajaxSettings.cache = true;

		//当前环境
		$rootScope.token = '';
		$rootScope.sessionId = $cookies.get('sessId') || null;

		// 是否是代理
		$rootScope.isAgent  = (window.$agent)? true: false;

		//缓存设置
		if (window.localStorage) {

			if(window.localStorage['cache_version'] != $$dic.conf('cache_version')){

				window.localStorage.clear();

			}

			window.localStorage.setItem('cache_version', $$dic.conf('cache_version'));

			// 遍历删除本地缓存
			var di = [];
			for (var i = 0; i < window.localStorage.length; i++) {
				
				try{

				 	var o = angular.fromJson( window.localStorage[window.localStorage.key(i)] );
				 	if (o && o.expires && o.expires === -1) {

					 	di.push(window.localStorage.key(i));
					 	
					};

				}catch(e){
					//do nothing
				}
				 

			};

			$.each(di, function(index, val) {
				 /* iterate through array or object */

				 window.localStorage.removeItem(val);

			});

		};

		//初始化设置
		if (window.localStorage && window.localStorage['user']) {

			if (angular.fromJson($cookies.get('user'))) {

				$rootScope.user = angular.fromJson(window.localStorage['user']);
				
			}else{

				window.localStorage.removeItem('user');
				$rootScope.user = undefined;

			}

		}else{

			$rootScope.user = angular.fromJson($cookies.get('user')) || undefined;

		}
		$rootScope.conf = {};
		$rootScope.conf.showBalance = false;
		$rootScope.triggers = {};

	}])


	.config(['ngClipProvider', function(ngClipProvider) {
		//此处有改动
	    ngClipProvider.setPath(window.$path + "static/boma_v3/pulgin/ZeroClipboard/ZeroClipboard.swf");
	
	}])

	/**
	 * 全局校验框架
	 */
	.config(["w5cValidatorProvider", function (w5cValidatorProvider) {
			
		w5cValidatorProvider.config({
			blurTrig: true,
			showError: true,
			removeError: true
		});
		
	}])


	/**
	 * 国际化
	 * @param  {[type]} $translateProvider){                     var lang [description]
	 * @return {[type]}                       [description]
	 */
	.config(['$translateProvider', function($translateProvider){

		//语言预设置
		window.lang = $tools.getCookie('lang') || 'zh-cn';


		$translateProvider.useStaticFilesLoader({
			//prefix: 'i18n/',此处有动，静态配时改回
			prefix: 'i18n/',
			suffix: '.html'

		})

		$translateProvider.useLoaderCache(true);
		$translateProvider.preferredLanguage(window.lang);

	}])

	.filter("i18n", ['$parse', '$translate', '$rootScope', function ($parse, $translate, $rootScope) {
		
		var translateFilter = function (translationId, interpolateParams, interpolation) {

		    if (!angular.isObject(interpolateParams)) {

		      interpolateParams = $parse(interpolateParams)(this);

		    }

	    	return $translate.instant(translationId, interpolateParams, interpolation);

	  	};

	  	translateFilter.$stateful = true;
	  	return translateFilter;

	}])

	/**
	 * 一级 AJAX 请求拦截器
	 * @param  {[type]} $q             [description]
	 * @param  {[type]} $rootScope     [description]
	 * @param  {[type]} response:      正常返回
	 * @param  {[type]} responseError: 返回错误
	 */
	.factory('httpInterceptor',['$q', '$rootScope', '$log', '$$cache', function ($q, $rootScope, $log, $$cache) {

	    return {

	        request: function (config) {

	        	//20秒请求超时
	        	config.timeout = 30000;

	            return config || $q.when(config);
	        
	        },

	        response: function (response) {

	        	// 语言文件
	        	if (response.config.url.indexOf('/i18n/') > -1) {

	        		$rootScope.translateState = true;
	        		
	        	};

	        	return response || $q.when(response);

	        },

	        responseError: function (response) {
	            
	        	switch (response.status){

	        		case 403 : $log.error('#######夭寿啦，服务器罢工啦（403）########'); break; // 重定向
	        		case 404 : $log.error('#######夭寿啦，服务器罢工啦（404）########'); break; // 重定向
                    case 408 : $log.error('#######夭寿啦，服务器罢工啦（408）########'); break; // 超时
                    case 500 : $log.error('#######夭寿啦，服务器罢工啦（500）########'); break; // 内部错误
                    case 502 : $log.error('#######夭寿啦，服务器罢工啦（502）########'); break; // BAD GATEWAY
                    case -1  : $log.error('#######夭寿啦，服务器请求超时（TIMEOUT）URL: '+response.config.url+'########'); break; // 请求超时

                }

                if([403,404,408,500,502,-1].indexOf(response.status) > -1){

                	if ($('.fakeloader').length > 0) {

						$('#fakeloader').fadeOut();
						$('#fakeloader').remove();

					};

                }

            	$$cache.logs("HTTP RESPONSE ERROR", response.config.url, null, response.status);
    			//  toastr.options = {
				// 	"closeButton": true,
				// 	"positionClass": "toast-bottom-right"
				// }

				// toastr['error']('出错了，请刷新后再试（'+response.status+'）');

                return $q.reject(response);

	        }

	    };

	}])

	.config(['$httpProvider', function ($httpProvider) {

	    $httpProvider.interceptors.push('httpInterceptor');

	}])

	/**
	 * [ExceptionHandler]
	 * 全站框架级别容错
	 */
	.factory('$exceptionHandler',['$log', function($log) {

		return function errorCatcherHandler(exception, cause) {

				$log.error('#### Catch Error Begin ####');
				$log.info("#### Message ####");
				$log.info(exception.message);
				$log.info("#### Cause ####")
				$log.info(cause);
				$log.debug('#### Catch Error End   ####');

				var u = 'NONE', e = {};
				if (window.localStorage.getItem('user')) {u = angular.fromJson( window.localStorage.getItem('user') )};
				e["username"] = u;
				e["timestamp"] = parseInt( (new Date()).getTime() / 1000 );
				e["type"] = "JS ERROR";
				e["url"] = null;
				e["param"] = null;
				e["errorMsg"] = "MESSAGE:" + exception.message + "##/##CAUSE:"+ cause;
				var os = angular.fromJson( window.localStorage.getItem('logs') );
				if (!os) {

					os = [];

				};
				os.push(e);
				window.localStorage.setItem("logs", angular.toJson(os));

				// $$cache.logs("JS ERROR", null, null, "MESSAGE:" + exception.message + "##/##CAUSE:"+ cause);
				

		};

	}]);

})();