window.include = function(f) {
    document.write("<script language='JavaScript' type='text/javascript' src='" + f + ".js'></script>")
}
// 设置运行环境
{
    var url = window.location.href.toLowerCase(); 
    var name = 'model';
    var results = (new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)")).exec(url);
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results || !results[2]){
    	window.model = 'dev';
    }else{
    	window.model = decodeURIComponent(results[2].replace(/\+/g, " "));
    }
}

seajs.config({
	base: window.$path,
});

// 工具类
include(window.$path + "http://7xim5b.com1.z0.glb.clouddn.com/static/boma_v3/js/util/tools");
include(window.$path + 'static/boma_v3/js/libs/jquery-1.11.1.min');


/**
 *  全站库依赖
 */

if (window.model === 'dev') {

	include(window.$path + 'static/boma_v3/js/libs/angular/angular-1.4.7');

}else{

	include(window.$path + 'static/boma_v3/js/libs/angular/angular.min');

}

include(window.$path + 'static/boma_v3/js/libs/angular/angular-cookies.min');
include(window.$path + 'static/boma_v3/js/libs/angular/angular-ui-router.min');
include(window.$path + 'static/boma_v3/js/libs/angular/angular-animate.min');
include(window.$path + 'static/boma_v3/js/libs/angular/angular-translate.min');
include(window.$path + 'static/boma_v3/js/libs/angular/angular-translate-loader-static-files.min');
include(window.$path + 'static/boma_v3/js/libs/angular/w5cValidator');
include(window.$path + 'static/boma_v3/pulgin/ZeroClipboard/ng-clip.min');

/**
 *  全站 modules/service/directive/filiter 依赖 
 */

// Modules
if (window.model === 'dev') {

    include(window.$path + 'static/boma_v3/js/app/module/boma');
    include(window.$path + 'static/boma_v3/js/app/module/router');
    include(window.$path + 'static/boma_v3/js/app/module/framework');
    include(window.$path + 'static/boma_v3/js/app/module/home');
    include(window.$path + 'static/boma_v3/js/app/module/user');
    include(window.$path + 'static/boma_v3/js/app/module/slot');
    include(window.$path + 'static/boma_v3/js/app/module/casino');
    include(window.$path + 'static/boma_v3/js/app/module/sports');
    include(window.$path + 'static/boma_v3/js/app/module/lottery');
    include(window.$path + 'static/boma_v3/js/app/module/promotion');
    include(window.$path + 'static/boma_v3/js/app/module/client');
    include(window.$path + 'static/boma_v3/js/app/module/my');
    include(window.$path + 'static/boma_v3/js/app/module/rule');
    include(window.$path + 'static/boma_v3/js/app/module/help');
    include(window.$path + 'static/boma_v3/js/app/module/speed');
    include(window.$path + 'static/boma_v3/js/app/module/domain');
    include(window.$path + 'static/boma_v3/js/app/module/spread');

    // Services
    include(window.$path + 'static/boma_v3/js/app/service/baseService');
    include(window.$path + 'static/boma_v3/js/app/service/dicService');
    include(window.$path + 'static/boma_v3/js/app/service/modalService');
    include(window.$path + 'static/boma_v3/js/app/service/httpService');
    include(window.$path + 'static/boma_v3/js/app/service/verifyService');
    include(window.$path + 'static/boma_v3/js/app/service/userService');
    include(window.$path + 'static/boma_v3/js/app/service/gameService');
    include(window.$path + 'static/boma_v3/js/app/service/slotService');
    include(window.$path + 'static/boma_v3/js/app/service/myService');
    include(window.$path + 'static/boma_v3/js/app/service/commonService');
    include(window.$path + 'static/boma_v3/js/app/service/cacheService');
    include(window.$path + 'static/boma_v3/js/app/service/staticService');

    // Filters
    include(window.$path + 'static/boma_v3/js/app/filter/baseFilter');

    // Directives
    include(window.$path + 'static/boma_v3/js/app/directive/baseDirective');
    include(window.$path + 'static/boma_v3/js/app/directive/casinoDirective');
    include(window.$path + 'static/boma_v3/js/app/directive/frameworkDirective');
    include(window.$path + 'static/boma_v3/js/app/directive/promotionDirective');
    include(window.$path + 'static/boma_v3/js/app/directive/slotDirective');

}else{

    document.write("<script language='JavaScript' type='text/javascript' src='"+window.$path+"static/boma_v3/build/app/app-min.js?v=e1d2bef0'></script>");

}

/**
 * jquery 插件
 */
include(window.$path + 'static/boma_v3/pulgin/jquery-modal-webkit/js/classie');
include(window.$path + 'static/boma_v3/pulgin/sweetalert-master/dist/sweetalert.min');
include(window.$path + 'static/boma_v3/pulgin/ZeroClipboard/ZeroClipboard.min');

// 自制插件
include(window.$path + "static/boma_v3/js/util/plugin");

// 球神单独引用
window.$kb_domains = [  'www.boma365.at',
                        'www.boma365.so',
                        'www.boma365.me',
                        'www.boma365net.net',
                        'www.bm365.cc',
                        'www.boma1688.com',
                        'boma1688.com',
                        'boma365net.net',
                        'boma365.at',
                        'boma365.so',
                        'boma365.me',
                        'bm365.cc',
                        'www.boma01.com',
                        'boma01.com',
                        'www.boma02.com',
                        'boma02.com',
                        'www.boma03.com',
                        'boma03.com',
                        'www.boma04.com',
                        'boma04.com'
                     ];

if (window.$kb_domains.indexOf(window.location.host) > -1) {

    include(window.$path + "/static/boma_v3/js/util/qs");

};


//引用风控脚本
window.io_operation                   = 'ioBegin';
window.io_bbout_element_id            = 'ioBB';
window.io_install_stm                 = false; 
window.io_exclude_stm                 = 12; 
window.io_install_flash               = false; 
window.io_install_rip                 = true; 
window.io_flash_needs_update_handler  = "";
window.io_install_flash_error_handler = "";

include( window.$path + 'static/boma_v3/js/util/snare');
include( window.$path + 'static/boma_v3/pulgin/jquery-circle-progress/dist/circle-progress')

//var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
//document.write(unescape("%3Cspan style='display:none' id='cnzz_stat_icon_1255246242'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s11.cnzz.com/z_stat.php%3Fid%3D1255246242' type='text/javascript'%3E%3C/script%3E"));

//分析脚本，等待整个页面加载完成后才开始加载
//var _inn = window.setInterval(function(){

 //   if (document.readyState === 'complete') {

//        (function(i, s, o, g, r, a, m) {
 //           i['GoogleAnalyticsObject'] = r;
 //           i[r] = i[r] || function() {
 //               (i[r].q = i[r].q || []).push(arguments)
  //          }, i[r].l = 1 * new Date();
  //          a = s.createElement(o),
 //              m = s.getElementsByTagName(o)[0];
  //          a.async = 1;
  //          a.src = g;
   //         m.parentNode.insertBefore(a, m);
   //     })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    //    ga('create', 'UA-42515382-1', 'auto'); 
     //   ga('send', 'pageview'); 


    //    window.clearInterval(_inn);
    //};

//}, 3000)
        