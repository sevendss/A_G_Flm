(function() {

    /**
     * 老虎机指令
     */
    angular.module('slot.directive', [])

    // 生成总奖池样式
    .directive('totlePrize', ['$compile', function($compile) {

        return {

            restrict: 'AE',
            scope: {

                number: "="

            },
            link: function(scope, element, attr) {

               var w = scope.$watch('number', function(newValue){

                    if (!newValue) {return};

                    var tpl = "";
                    var n = ""+ parseInt(newValue);

                    for(i=0; i<n.length; i++){

                         tpl += "<span class='slot-totle-priz'>"+n[i]+"</span>";

                    };

                    element.html(tpl);


               })

               scope.$on('$destroy', function(){

                    w();

               });

            }
        };
    }])

})();