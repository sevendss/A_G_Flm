(function() {

    /**
     * 首页指令
     */
    angular.module('framework.directive', [])

    //轮播图片
    //生成banner
    .directive('bannerMaker', ['$compile', '$rootScope', '$timeout', '$$common', '$rootScope', function ($compile, $rootScope, $timeout, $$common, $rootScope) {

        return {

            restrict: 'AE',
            link: function(scope, element, attr) {

               // 生成动态
               scope.makeFilx = function(){

                    tpl =   '<div class="flexslider" id="bannerFilex">'+
                            '   <ul class="slides">'+
                            '       <li class="pointer" href-plus url="{{item.url}}" ng-repeat="item in $root.banners" style="background:url({{$root.workspace}}{{item.path}}) 50% 0% no-repeat black"></li>'+
                            '   </ul>'+
                            '</div>';

                    element.html(tpl);
                    $compile(element.contents())(scope);

                    $timeout(function(){

                        seajs.use('static/boma_v3/pulgin/flexslider/jquery.flexslider-min', function(){

                            $("#bannerFilex").flexslider({
                                slideshowSpeed: 5000, 
                                animationSpeed: 1000,
                                directionNav: true,
                                pauseOnAction: false,
                                pauseOnHover: true
                            });

                        });

                    })

               }

               scope.makeBanner = function(){

                    var tpl;

                    // 首页生成可变换的banner
                    if ($rootScope.page.code === 'home' || $rootScope.page.code === 'spread') {

                        if (!$rootScope.banners) {

                            $$common.getBanners(function(result){

                                $rootScope.banners = result.data;
                                scope.makeFilx();

                            })

                        };

                        scope.makeFilx();
                        return;

                    };
					//此处有改动
                    // 普通不滚动
                    angular.element(element).css('background', 'url('+$rootScope.workspace+'static/boma_v3/skin/v3_normal/images/'+$rootScope.lang+'/banners/'+$rootScope.page.code+'.jpg) no-repeat center top black');


               }();

            }
        };
    }])

})();