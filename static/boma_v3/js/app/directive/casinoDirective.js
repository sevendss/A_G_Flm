(function() {

    /**
     * 真人指令
     */
    angular.module('casino.directive', [])

    //轮播图片
    .directive('carousellit', ['$compile', '$timeout', function($compile, $timeout) {

        return {

            restrict: 'AE',
            scope: {

                pf: "=",
                data: "="

            },
            link: function(scope, element, attr) {
				//此处有改动
                var tpl =   '<div class="games" id="carouse_'+scope.pf+'">'+
                            '    <ul>'+
                            '        <li class="slides am-text-center" ng-repeat="i in data track by $index" ng-mouseenter="inGameArea(i)" on-finish-render >'+
                            '            <img style="width:130px;height:88px;" lazy isrc="{{$root.workspace}}static/boma_v3/skin/v3_normal/images/common/casino/'+scope.pf+'/{{$index + 1}}.png" />'+
                            '            <div class="slides-title"><span ng-bind="i[$root.lang]"></span></div>'+
                            '            <div class="rule"><a class="boma-color-white" href="{{i.rule}}" target="_blank" class="boma-btn-white-xs"><span ng-bind="&quot;common-rule&quot; | i18n"></span></a></div>'+
                            '        </li>'+
                            '    </ul>'+
                            '   <button class="left-circle" id="l-'+scope.pf+'"></button>'+
                            '   <button class="right-circle" id="r-'+scope.pf+'"></button>'+
                            '</div>';

                element.html(tpl);
                $compile(element.contents())(scope);

                scope.bindEvent = function(){

                    var ele = angular.element(element);

                    ele.find('li.slides').bind('mouseenter', function(event) {

                        $('.casino-games').find('li.slides div.rule').hide();
                        $(this).find('div.rule').show();

                    });

                    ele.find('div.rule').bind('mouseleave', function(event) {

                        $('.casino-games').find('li.slides div.rule').hide();

                    });

                }

                scope.$on('onFinishRender', function(){

                    $("#carouse_"+scope.pf).show().jCarouselLite({
                        btnNext: "#r-"+scope.pf,
                        btnPrev: "#l-"+scope.pf,
                        visible: 4
                    });

                    scope.bindEvent();


                });

            }
        };
    }])

})();