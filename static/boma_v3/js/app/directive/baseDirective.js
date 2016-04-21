(function() {

    /**
     * 公共指令
     */
    angular.module('base.directive', [])

    //环形百分比
    .directive('circleProgress', ['$compile', function($compile) {

        return {

            restrict: 'AE',
            scope: {

                img: "@",
                rate: "@"

            },
            link: function(scope, element, attr) {

                var ranId = "cp" + Math.ceil(Math.random() * 1000000);
                var p = '<div id=' + ranId + '></div><img lazy isrc=' + scope.img + ' />';

                element.html(p);
                $compile(element.contents())(scope);

                window.setTimeout(function() {
					//此处有改动
                    seajs.use('static/boma_v3/pulgin/jquery-circle-progress/dist/circle-progress', function(){

                         $('#' + ranId).circleProgress({
                            startAngle: -Math.PI / 4 * 2,
                            reverse: true,
                            value: scope.rate,
                            size: 155,
                            thickness: 5,
                            emptyFill: "#3a2c40",
                            fill: {
                                gradient: ["#f9564e", "#e93c67"]
                            }
                        })
                        
                    })

                });

            }
        };
    }])
    //自定义样式的checkbox
    .directive('bomaCheckbox', ['$compile', function($compile) {

        return {

            restrict: 'AE',
            scope: {

                text: "@",
                model: "=ngModel",

            },
            require: "ngModel",
            link: function(scope, element, attr) {

                scope.model = scope.model || 0;
                var tp = '',
                    saving = scope.model;


                scope.$watch('model', function(newValue) {

                    scope.model = scope.model || saving;

                    if (scope.model) {

                        tp = '<span ng-click="toggle()" class="checkbox-container" ><span class="boma-checkbox boma-checkbox-active"></span><span class="boma-checkbox-text" ng-if="text" ng-bind="text | i18n" ></span></span>';

                    } else {

                        tp = '<span ng-click="toggle()" class="checkbox-container" ><span class="boma-checkbox"></span><span class="boma-checkbox-text" ng-if="text" ng-bind="text | i18n"></span></span>';

                    }

                    element.html(tp);
                    $compile(element.contents())(scope);

                });

                scope.toggle = function() {

                    scope.model = (scope.model) ? 0 : 1;
                    saving = scope.model;

                }


            }
        };
    }])

    //抗锯齿
    .directive('antiAliasing', ['$compile', function ($compile) {

        return {

            restrict: 'A',
            link: function(scope, element, attr) {

                var ele = angular.element(element);

                scope.anti = function(){

                    h = ele.height();

                    if (h%2 === 1) {

                        h++;

                        ele.height( h );

                    };
                }

                //chrome 下高度为单数时模糊
                $(ele).resize(function(e){

                   scope.anti();

                });

                scope.anti();
            }
        };
    }])

    // 客服中心
    .directive('serviceBar', ['$compile','$timeout', '$$modal', function ($compile, $timeout, $$modal) {

        return {

            restrict: 'A',
            link: function(scope, element, attr) {

                scope.resetWindow = function(){

                    var top = (window.innerHeight - 280)/2;

                    //110, 280
                    var tp ='<a service-trigger style="top:'+ (top+40) +'px" class="service" ng-class="{&quot;service-lg&quot; : idx===0}" ng-mouseenter="showBiger(0);" ng-mouseleave="showSmaller()"></a>'+
                            // '<div style="top:'+ (Number(top)+40)+'px" class="regeister" ng-class="{&quot;regeister-lg&quot; : idx===1}" ng-mouseenter="showBiger(1);" ng-mouseleave="showSmaller()" register-trigger></div>'+
                            '<div style="top:'+ (Number(top)+80)+'px" class="promotion" ng-click="goPromotion();" ng-class="{&quot;promotion-lg&quot; : idx===2}" ng-mouseenter="showBiger(2);" ng-mouseleave="showSmaller()"></div>'+
                            '<div style="top:'+ (Number(top)+120) +'px" class="client" ng-click="goClient();" ng-class="{&quot;client-lg&quot; : idx===3}" ng-mouseenter="showBiger(3);" ng-mouseleave="showSmaller()"></div>'+
                            '<div style="top:'+ (Number(top)+160) +'px" class="feedback" login-checker="goFeedback()" ng-class="{&quot;feedback-lg&quot; : idx===4}" ng-mouseenter="showBiger(4);" ng-mouseleave="showSmaller()"></div>'+
                            '<div style="top:'+ (Number(top)+200) +'px" class="totop" ng-click="goTop();" ng-class="{&quot;totop-lg&quot; : idx===5}" ng-mouseenter="showBiger(5);" ng-mouseleave="showSmaller()"></div>';

                    element.html(tp);
                    $compile(element.contents())(scope);

                }

                scope.goFeedback = function(){

                    $$modal.popup(scope, 'feedback');

                }

                scope.goClient = function(){

                    window.location.href = '#/client';

                }

                scope.goPromotion = function(){

                    window.location.href = '#/promotion';

                }

                scope.goTop = function(){

                     $('body,html').animate({ scrollTop: 0 }, 500);

                }

                scope.showSmaller = function(){

                    scope.idx = undefined;

                }

                scope.showBiger = function(idx){

                    scope.idx = idx;

                }

                window.onresize = function(){

                    scope.resetWindow();

                }

                scope.resetWindow();
            }
        };
    }])

    // 去登录
    .directive('loginTrigger', ['$rootScope', function ($rootScope) {

        return {

            restrict: 'A',
            link: function(scope, element, attr) {

                element.click(function(event) {

                    $rootScope.triggers.login ={'bullet': Math.ceil(Math.random() * 1000000)};

                    scope.$apply();

                });


            }
        };
    }])

    // 去注册
    .directive('registerTrigger', ['$rootScope', function ($rootScope) {

        return {

            restrict: 'A',
            link: function(scope, element, attr) {

                element.click(function(event) {

                    $rootScope.triggers.register = Math.ceil(Math.random() * 1000000);

                    scope.$apply();

                });


            }
        };
    }])

    // 公告栏
    .directive('announcement', ['$compile', '$$common', function ($compile, $$common) {

        return {

            scope:{

                size: "@"

            },

            restrict: 'A',
            link: function(scope, element, attr) {

                $$common.getNotice(function(result){

                    scope.msgs = result.data;

                    var tpl ='<div class="am-container boma-container index-game-head">'+
                        '  <marquee class="main-announcement" scrollamount="3" scrolldelay="60" class="annoucement"><span ng-if="msgs.length > 0" class="announcement-icon">　　';
                        $.each(result.data, function(index, val) {
                             /* iterate through array or object */

                             tpl += '</span><span class="am-margin-right-xl">'+val.content+'</span>';

                        });
                        tpl += '</marquee></div>';

                    if (scope.size == 'mini') {

                        tpl = '<marquee class="main-announcement-mini" ng-style="myStyle" scrollamount="3" scrolldelay="60" class="annoucement"><span ng-if="msgs.length > 0" class="announcement-icon">　　';
                        $.each(result.data, function(index, val) {
                             /* iterate through array or object */

                              tpl += '</span><span class="am-margin-right-xl">'+val.content+'</span>';

                        });
                              
                        tpl += '</marquee>';

                    };

                    element.html(tpl);
                    $compile(element.contents())(scope);

                })

                var w = scope.$watch('$root.user', function(newValue, oldValue, scope) {

                    if (!newValue) {

                        scope.myStyle = {'width': '1000px'}
                        
                    }else{

                        scope.myStyle = {};

                    }
                    
                });

                scope.$on('$destroy', function(){

                    w();

                });

            }
        };
    }])

    // IFRAME 加载完成
    .directive('iframeOnload', ['$$modal', '$timeout', '$$base', function($$modal, $timeout, $$base) {

        return {

            link: function(scope, element, attrs) {

                // scope.timeout = false;
                // $$modal.loading();

                // // 30秒加载不出来就超时
                // $timeout(function(){

                //     if (scope.timeout) {return};
                    
                //     $$modal.loading();
                //     $$modal.alert($$base.i18n('common-iframe-timeout-t'), $$base.i18n('common-iframe-timeout-c'));

                //     scope.timeout = true;

                // }, 30000)

                // // 加载完成
                // element.on('load', function() {

                //     // 延时三秒保证加载完整
                //     $timeout(function(){

                //         if (scope.timeout) {return};

                //         $$modal.loading();
                //         scope.timeout = true;

                //     }, 3000);


                // })

            }
        }
    }])

    // 校验是否登录
    .directive('loginChecker', ['$$modal', '$rootScope', '$$base', function ($$modal, $rootScope, $$base) {

        return {

            scope: {

                callback: "&loginChecker"

            },
            restrict: 'A',
            link: function(scope, element, attr) {

                // 状态确认
                scope.checkLogin = function(){

                    if (!$rootScope.user) {

                        $$modal.confirm(null, $$base.i18n('common-login-yet'), $$base.i18n('modal-register-goLogin'), scope.openLogin, null, null);

                        return;
                    };

                    if (angular.isFunction(scope.callback)) {

                        scope.callback();

                    };

                }

                // 打开登录框
                scope.openLogin = function(){

                    $rootScope.triggers.login = {'bullet': Math.ceil(Math.random() * 1000000)}
                    if (angular.isFunction(scope.callback)) {

                        $rootScope.triggers.login.fn = scope.callback;

                    };

                    scope.$apply();

                }
               
                element.bind('click', scope.checkLogin);

            }
        };
    }])
    
    // ng-repeat 渲染完成时
    .directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function() {
                        scope.$emit('onFinishRender');
                    });
                }
            }
        };
    })

    // 渲染插入HTML
    .directive('render', ['$compile', function ($compile) {
        return {
            scope: {
                contents: "="
            },
            restrict: 'A',
            link: function(scope, element, attr) {
            
                var w = scope.$watch('contents', function(newValue, oldValue, scope) {
                    
                    if (!newValue) {return};

                    element.html(scope.contents);
                    $compile(element.contents())(scope);

                });

                scope.$on('$destroy', function(){

                    w();

                });
               

            }
        };
    }])

    // 分页
    .directive('paging', ['$compile', function ($compile) {
        return {
            scope: {
                count: "=",
                max  : "@",
                page : "=",
                action: "="
            },
            restrict: 'A',
            link: function(scope, element, attr) {

                // 生成5个将被显示出来的页数, 少于5个显示所有页数
                scope.showNumbers = function(){

                    // 算出总页数
                    scope.totleNo = parseInt(scope.count/ scope.max);
                    
                    if ((scope.count % scope.max) > 0 || !scope.count || scope.count === 0) {

                        scope.totleNo ++;

                    };

                    var numbers = [];

                    if(scope.totleNo <= 5){

                        scope.showNo = scope.totleNo;
                        for (var i = 0; i < scope.totleNo; i++) {
                            numbers.push(i+1);
                        };

                        return numbers;

                    }else{

                        // 后二
                        if ((scope.pageNo + 2) > scope.totleNo) {

                            if (scope.pageNo === scope.totleNo) {

                                return [scope.pageNo -4 , scope.pageNo-3, scope.pageNo-2, scope.pageNo-1, scope.pageNo];

                            }else{

                                return [scope.pageNo-3, scope.pageNo-2, scope.pageNo-1, scope.pageNo, scope.pageNo+1];

                            }

                        };

                        // 前二
                        if ((scope.pageNo - 2) < 1) {

                            if (scope.pageNo === 1) {

                                return [scope.pageNo, scope.pageNo+1, scope.pageNo+2, scope.pageNo+3, scope.pageNo+4];

                            }else{

                                return [scope.pageNo-1, scope.pageNo, scope.pageNo+1, scope.pageNo+2, scope.pageNo+3];

                            }

                        };

                        return [scope.pageNo-2, scope.pageNo-1, scope.pageNo, scope.pageNo+1, scope.pageNo+2];

                    }

                }

                // 往后翻页
                scope.pagePlus = function(){

                    if(scope.pageNo === scope.totleNo){return;}
                    scope.pageNo ++;
                    scope.genPaging();
                    scope.action(scope.pageNo);

                }

                // 往前翻页
                scope.pageSubt = function(){

                    if (scope.pageNo === 1) {return;};
                    scope.pageNo --;
                    scope.genPaging();
                    scope.action(scope.pageNo);

                }

                // 前往页数
                scope.changePage = function(no){

                    if (no == scope.pageNo) {return};
                    scope.pageNo = no;
                    scope.genPaging();
                    scope.action(scope.pageNo);

                }

                // 生成列表
                scope.genPaging = function(){

                    tpl = "<div class='boma-paging'><span class='left' ng-click='pageSubt()'>　</span>";
                    $.each(scope.showNumbers(), function(index, val) {
                         /* iterate through array or object */

                         tpl += "<span ng-click='changePage("+val+")' ng-class='{&quot;active&quot;: pageNo === "+val+"}'>" + val + "</span>";

                    });
                    tpl += "<span class='right' ng-click='pagePlus()'>　</span></div>";

                    element.html(tpl);
                    $compile(element.contents())(scope);

                }

                var w = scope.$watch('count', function(newValue, oldValue, scope) {
                    
                    if (angular.isUndefined(scope.count) || angular.isUndefined(scope.action)) {return};

                    scope.pageNo = scope.page || 1;
                    scope.genPaging();

                });

                var w2 = scope.$watch('action', function(newValue, oldValue, scope) {
                    
                    if (angular.isUndefined(scope.count) || angular.isUndefined(scope.action)) {return};

                    scope.pageNo = 1;
                    scope.genPaging();

                });

                scope.$on('$destroy', function(){

                    w();
                    w2();

                });
                


            }
        };
    }])

    // 表格映射，为了使同一个模板表格使用用一个数据名称，该指令将其统一数据名称为dataset
    .directive('tableRender', ['$compile', function ($compile) {
        return {
            scope: {
                dataset: "=",
                template: "@"
            },
            restrict: 'A',
            link: function(scope, element, attr) {
            
                scope.$watch('template', function(newValue, oldValue, scope) {
                    
                    if (!scope.template) {return};
                    
                    var tpl = '<div ng-include="&quot;'+scope.template+'&quot;"></div>';
                    element.html(tpl);
                    $compile(element.contents())(scope);

                });

                scope.callback = function(fn, data){

                    if (angular.isFunction(eval('scope.$parent.' + fn))) {

                        eval('scope.$parent.' + fn + '(data)');

                    };

                }

            }
        };
    }])

    // 获取字典表MAP
    .directive('dictionary', ['$$common', '$timeout', '$rootScope', '$$base', function ($$common, $timeout, $rootScope, $$base) {
        return {
            scope: {
                model: "=ngModel",
                name : "@",
                filter : "@"
            },
            require:['ngModel'],
            replace: true,
            restrict: 'AE',
            template: '<select class="boma-select"><option title="{{item.value}}" ng-repeat="item in dictionary" value="{{item.key}}">{{item.value}}</select>',
            link: function(scope, element, attr) {
            
                $$common.getDictionary(scope.name, function(result){

                    $.each(result.data, function(index, val) {
                         /* iterate through array or object */
                         val.key = String(val.key);

                    });

                    scope.dictionary = new Array();

                    if (scope.filter && scope.filter === 'all') {

                        scope.dictionary.push({'key': '', 'value': $$base.i18n('common-all')});

                    };

                    scope.dictionary = scope.dictionary.concat(result.data);

                    $timeout(function(){

                        scope.model = scope.model || scope.dictionary[0].key;
                        scope.model = ""+scope.model;
                        scope.$apply();

                    })

                });

            }
        };
    }])

    // 通过字典KEY NAME 获取真实值
    .directive('converter', ['$$common', function ($$common) {
        return {
            scope: {
                type: "@",
                key : "="
            },
            replace: true,
            restrict: 'AE',
            template: '<span ng-bind="value"></span>',
            link: function(scope, element, attr) {
            
                $$common.getDicValue({'type':scope.type, 'key': scope.key}, function(result){

                   scope.value = result.data.value;

                });

            }
        };
    }])

    // 让所有组件都增加herf功能
    .directive('hrefPlus', ['$compile', '$timeout', function ($compile, $timeout) {
        return {
            scope: {
                target: "@",
                url: "@"
            },
            restrict: 'A',
            link: function(scope, element, attr) {
            
                element.bind('click',  function(event) {
                    /* Act on the event */

                    if ($('.md-overlay-show').length > 0) {

                        $('.md-overlay').click();

                        $timeout(function(){

                             if (scope.target === '_blank') {

                                $tools.openWindow(scope.url);

                            }else{

                                window.location.href = scope.url;

                            }

                        }, 300)

                    }else{

                        if (scope.target === '_blank') {

                            $tools.openWindow(scope.url);

                        }else{

                            window.location.href = scope.url;

                        }

                    }

                });

            }
        };
    }])

    // 日期控件
    .directive('datePicker', ['$filter', function ($filter) {
        return {
            scope: {
                model: "=ngModel",
                format: "@",
                min: "@",
                max: "@"
            },
            require:['ngModel'],
            restrict: 'AE',
            link: function(scope, element, attr) {

                today = new Date();
                scope.format = scope.format || 'Y-m-d';
                scope.min = scope.min || '2000-01-01';
                scope.max = scope.max || (today.getFullYear() + '-' + (today.getMonth() + 1) + '-' +today.getDate());
                
                var ele = angular.element(element);

                seajs.use('static/boma_v3/pulgin/datePicker/jquery.datetimepicker', function(){

                    scope.model = $filter('date')(new Date(), 'yyyy-MM-dd');

                    ele.datetimepicker({
                        // yearOffset: -1,
                        lang:'ch',
                        timepicker:false,
                        format: scope.format,
                        formatDate: scope.format,
                        minDate: scope.min,
                        maxDate: scope.max,
                        onClose: function(a,b,c){
                            scope.model = $filter('date')(a, 'yyyy-MM-dd');
                        }
                    });
                    
                    ele.next().bind('click', function(event) {
                        ele.focus();
                    });


                });
                
            }
        };
    }])

    // 进度条
    .directive('progress', ['$timeout', '$compile', function ($timeout, $compile) {
        return {
            scope: {
               rate: "=",
               opts: "="
            },
            restrict: 'AE',
            link: function(scope, element, attr) {

                scope.opts = scope.opts || {display_text: 'center', use_percentage: false};

                var w = scope.$watch('rate', function(newValue, oldValue, scope) {
                    
                    if (!newValue) {return};

                    if (newValue < 60) {level = 'progress-bar-danger'};
                    if (newValue >= 60 && newValue < 80) {level = 'progress-bar-warning'};
                    if (newValue >= 80) {level = 'progress-bar-success'};

                    var id = 'progress' + Math.ceil(Math.random() * 1000000);

                    var tpl = '<div class="progress progress-striped active">'+
                              '    <div id="'+id+'" class="progress-bar '+level+'" role="progressbar" data-transitiongoal="'+scope.rate+'"></div>'+
                              '</div>';

                    element.html(tpl);
                    $compile(element.contents())(scope);

                    $timeout(function(){

                        $('#' + id).progressbar( scope.opts );

                    })

                });


                scope.$on('$destroy', function(){

                    w();

                });

            }
        };
    }])

    // 清空值
    .directive('clearModel', ['$filter', function ($filter) {
        return {
            scope: {
                model: "=ngModel",
            },
            require:['ngModel'],
            restrict: 'AE',
            replace: true,
            template: '<span class="clear-model" ng-show="model"></span>',
            link: function(scope, element, attr) {

                element.bind('click', function(event) {

                    scope.model = '';
                    scope.$apply();

                });


            }
        };
    }])

    // 帮助中心,收起展开
    .directive('silde', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
            
               var show = true;
               element.bind('click', function(){
                    if (show) {

                        angular.element(element).parent().next().show();
                        angular.element(element)['0'].className='helpcentercloseme';
                        angular.element(element).context.innerHTML='&nbsp;&nbsp;&nbsp;&nbsp;<span  style="cursor: pointer;text-decoration: underline;">隐藏</span>&nbsp;&nbsp;&nbsp;&nbsp;    ';

                    }else{
                        angular.element(element)['0'].className='helpcenteropenme';
                        angular.element(element).context.innerHTML='&nbsp;&nbsp;&nbsp;&nbsp;<span  style="cursor: pointer;text-decoration: underline;">展开</span>&nbsp;&nbsp;&nbsp;&nbsp;    ';
                        angular.element(element).parent().next().hide();

                    }

                    show = !show;

               })

            }
        };
    }])

    // JS锚点
    .directive('anchor', ['$compile', function ($compile) {
        return {
            scope:{
                href: "@"
            },
            restrict: 'A',
            link: function(scope, element, attr) {
            
               var t = $(scope.href)[0].offsetTop;

               element.bind('click', function(event) {

                    $('body,html').animate({ scrollTop: t }, 500);

               });

            }
        };
    }])
    
    // 域名验证空值fouce效果
    .directive('nullValue', ['$compile', function($compile) {

        return {
            scope: {
                model: "=ngModel",
                txt: "@"
            },
            restrict: 'A',
            link: function(scope, element, attr) {

                element.focus(function() {

                    if (scope.model === scope.txt) {

                        scope.model = "";
                        scope.$apply();
                    };

                });

                element.blur(function() {

                    if (scope.model === "") {

                        scope.model = scope.txt;
                        scope.$apply();

                    };

                })

            }
        };
    }])

    // service按钮点了之后，是boma365客服还是球神客服
    .directive('serviceTrigger', ['$rootScope', '$$dic', function($rootScope, $$dic) {

        return {
          
            restrict: 'A',
            link: function(scope, element, attr) {

                element.bind('click', function(event) {
                    /* Act on the event */

                    if ($rootScope.isAgent) {

                        // 在线客服
                        if (Number(window.$agent.cs_type) === 1) {

                            $tools.openWindow(window.$agent.cs_data);
                            return false;

                        };

                        window.callQQService();
                        return;

                    }

                    $tools.openWindow($$dic.contact('service_online'));
                    return false;

                });

            }
        };
    }])

    // 输入框限制输入
    .directive('inputLimit', function() {

        return {
          
            restrict: 'A',
            scope: {

                'model': '=ngModel',
                'pattern':'@re'

            },
            link: function(scope, element, attr) {
                
                if (scope.pattern) {

                    scope.re = new RegExp( scope.pattern.substring(1, scope.pattern.length-1) );

                };

                scope.$watch('model', function(newValue, oldValue, scope) {
                    
                    if (!scope.model || !scope.pattern) {return};

                    if (!scope.re.test(scope.model)) {

                        scope.model = oldValue;

                    };

                });

            }
        };
    })

    // IMG标签文件指纹
    .directive('lazy', ['$$res', function($$res) {

        return {
            
            scope:{
                src: "@isrc"
            },
            restrict: 'A',
            link: function(scope, element, attr) {

                scope.sourceSrc = '';
                
                scope.genSrc = function(src){

                    var path = src.substr(src.indexOf('images') + 6);
                    var md5 = $$res.md5(path);
                    scope.sourceSrc = src;

                    if (md5) {

                        scope.sourceSrc += "?v=" + md5;

                    };

                    $(element).first().attr('src', scope.sourceSrc);

                }

                var w = scope.$watch(function(){return attr.isrc}, function(newValue, oldValue, scope) {

                    if (!newValue) {return};
                    scope.genSrc(newValue);
                    
                });

                scope.$on('$destroy', function(){

                    w();

                });

            }
        };
    }])

    // password 域
    .directive('password', function() {

        return {
            
            restrict: 'A',
            link: function(scope, element, attr) {

                $(element).focus(function(event) {
                    /* Act on the event */

                    $(this).attr('type', 'password');

                });

            }
        };
    })

    // 头部滚动侦探
    .directive('headerBar', ['$rootScope', function($rootScope) {

        return {
            
            restrict: 'A',
            link: function(scope, element, attr) {

                $(window).bind('scroll', function(){

                    if ($(window).scrollTop() >= 100 ) {

                        $rootScope.fixedHeader = true;
                        scope.$apply();

                    }else{

                        $rootScope.fixedHeader = false;
                        scope.$apply();

                    }

                })

            }
        };
    }])
    


})();