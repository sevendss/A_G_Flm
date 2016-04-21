{	
	var getUrlParam = function(name){
		var url = window.location.href.toLowerCase(); 
	    var results = (new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)")).exec(url);
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results || !results[2]){
	    	return null
	    }else{
	    	return decodeURIComponent(results[2].replace(/\+/g, " "));
	    }
	}

	/**
	 * 读取cookie
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	var getCookie = function(key){

		var arr,reg=new RegExp("(^| )"+key+"=([^;]*)(;|$)");

		if(arr=document.cookie.match(reg))

			return unescape(arr[2]);

		else

		return null;
	}


	/**
	 * 获取设备类型
	 * @return {[type]} [PC/TABLET/MOBILE]
	 */
	var getDevice = function(){

		// Agent
		var agent     = navigator.userAgent;

		// Tablet
	  	var tabletReg = /^.*iPad.*$|^.*tablet.*$|^.*Android\\s3.*$|^(?!.*Mobile.*).*Android.*$/;

	    // Mobile
	    var mobileReg = /^.*(iPhone|iPod|Android.*Mobile|Windows\\sPhone|IEMobile|BlackBerry|Mobile).*$
/;


	    if (tabletReg.test(agent)) {

	    	return 'tablet';

	    };

	    if (mobileReg.test(agent)) {

	    	return 'mobile';

	    };

	    return 'pc';

	}


	/**
	 * 获取浏览器信息
	 * @return {[type]} [description]
	 */
	var getBrowser = function(){

		//只判断4种浏览器
		var userAgent = navigator.userAgent;
		var isIE = userAgent.indexOf("MSIE") > -1;
		var isFF = userAgent.indexOf("Firefox") > -1;
		var isSafari = userAgent.indexOf("Safari") > -1;
		var isChrome = userAgent.indexOf("Chrome") > -1;

		var browser;

		// IE求版本
		if (isIE) {

			browser = {"name": "ie", "version": navigator.userAgent.toLowerCase().match(/msie ([\d.]+)/)[1]}

		}

		if (isFF) {

			browser = {"name": "firefox", "version": navigator.userAgent.toLowerCase().match(/firefox\/(.*)/)
[1]};

		}

		if (isSafari) {

			browser = {"name": "safari",  "version": navigator.userAgent.toLowerCase().match(/safari\/(.*)/)[1
]};

		}

		if (isChrome) {

			browser = {"name": "chrome",  "version": navigator.userAgent.toLowerCase().match(/chrome\/(.* +)/
)[1]};

		};

		if (!browser) {

			browser = {"name": navigator.userAgent};

		};

		if(browser.name === 'ie' && Number(browser.version) < 9){

			window.location.href = "/update.html";

			return false;

		}

		return browser;

	}

	var map2Array = function(map){
		var list = new Array();
		$.each(map, function(key, value){
			var obj = new Object();
			obj.key = key;
			obj.value = value;
			list.push(obj);
		});
		return list;
	}


	var openWindow = function(url){
		var a = $("<a href="+url+" target='_blank' ></a>").get(0);
		var e = document.createEvent('MouseEvents');
		e.initEvent('click', true, true);
		a.dispatchEvent(e);
	}

}

/**
 * 工具方法注册
 * @type {Object}
 */
window.$tools = {

	getCookie	: getCookie,
	getDevice	: getDevice,
	getBrowser	: getBrowser,
	map2Array   : map2Array,
	getUrlParam : getUrlParam,
	openWindow  : openWindow

};

// 为了9以下引导
getBrowser();