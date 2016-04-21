(function() {

    /**
     * 优惠活动指令
     */
    angular.module('promotion.directive', [])

    // 创建deadline指令
    .directive('deadline', ['$interval', function ($interval) {

        return {

            scope: {

                time: "="

            },
            template: '<span ng-bind="&quot;common-deadline&quot; | i18n"></span><span class="time" ng-bind="dd"></span>天<span class="time" ng-bind="hh"></span>时<span class="time" ng-bind="mm"></span>分<span class="time" ng-bind="ss"></span>',
            restrict: 'A',
            link: function(scope, element, attr) {

                scope.i = angular.copy(scope.time);

                // 创建时分秒
                scope.genCountdown = function(){

                    var dd = parseInt(scope.i/(3600*24));
                    var hh = parseInt((scope.i - dd*3600*24)/3600);
                    var mm = parseInt(((scope.i - dd*3600*24) - hh * 3600)/60);
                    var ss = scope.i - dd*3600*24 - hh*3600 - mm*60;

                    if (hh < 10) { hh = "0"+ hh};
                    if (mm < 10) { mm = "0"+ mm};
                    if (ss < 10) { ss = "0"+ ss};

                    scope.dd = dd;
                    scope.hh = hh;
                    scope.mm = mm;
                    scope.ss = ss;

                }
                
                scope.genCountdown();

                var it = $interval(function(){

                    scope.i --;
                    if (scope.i === 0) {

                        $interval.cancel(it);

                    };
                    scope.genCountdown();

                }, 1000)

                scope.$on('$destroy', function(){

                    $interval.cancel(it);

                });

            }

        };
    }])

    //热度，星级
    .directive('hotstar', ['$compile', function ($compile) {

        return {

            scope: {

                rate: "="

            },
            restrict: 'A',
            link: function(scope, element, attr) {

                var w = scope.$watch('rate', function(newValue, oldValue, scope) {

                    if (!newValue) {return};

                    var tpl = "<div class='am-fl star-block'>";

                    for (var i = 0; i < scope.rate; i++) {

                        tpl += "<span class='hotstar'></span>";

                    };

                    tpl += "</div>";

                    element.html(tpl);
                    $compile(element.contents())(scope);
                    
                });

                
                scope.$on('$destroy', function(){

                    w();

                });


            }

        };
    }])

})();