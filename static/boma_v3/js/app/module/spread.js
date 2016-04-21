(function() {

angular.module('spread', [])


/**
 * [Controller]
 * 首页控制器
 */
.controller('__spread', ['$scope', '$rootScope', '$$base', '$$game', '$$dic', '$$user','$$request','$timeout','$cookies','$stateParams',
    function($scope, $rootScope, $$base, $$game, $$dic, $$user,$$request,$timeout,$cookies,$stateParams) {

		/* 变量声明 */
		{

			$rootScope.page.code = "spread";
            //游戏平台
            $scope.pfs = $$dic.conf('game-pfs');
		}

		/* 业务逻辑 */
		{

			// 进入平台
            $scope.enterGameHall = function(item){

                $$game.enterGameHall(item);

            }

			// 鼠标移动进游戏平台
            $scope.inGameHall = function(item){

                $scope._hall = item;

            }

            // 鼠标移动出游戏平台图标
            $scope.outGameHall = function(){

                $scope._hall = undefined;

            }


			//鼠标移动到图片上
			$scope.inGameArea = function(item){

				$scope._cgame = item['name'];

			}

			// 鼠标移动开图片
			$scope.outGameArea = function(){

				$scope._cgame = undefined;

			}

			$scope.trySlot = function(item){

				var url = $$dic.conf('try_slot_' + item.pfCode) + item.gameid;

				$tools.openWindow(url);

			}

			$scope.playVideo = function(item){

				document.getElementById('myvideo').play(); // 播放

			}

			$scope.getfreegame = function() {
				var r = $$request.packageReq('free-hotgames', null, {}, 'POST', true, false);
					
				$$request.action(r, function(result) {
					if(result.data){
						$scope.hotgames = result.data;
					}
				});
			}

			//生成代理cookie
			$scope.initcookie = function(){
				if(/^\d{6}$/.test($stateParams.agentcode)){
					$cookies.put('agent_code',$stateParams.agentcode);
				}
			}

			//热门游戏滚动
			$scope.$on('onFinishRender', function(){
				seajs.use('static/boma_v3/pulgin/flexslider/jquery.flexslider-min', function(){
					$("#flexslider").flexslider({
						animation: "slide",
				        animationLoop: true,
				        itemWidth: 210,
				        itemMargin: 5,
						minItems: 7,
						directionNav:false,
						slideshowSpeed:5000,
						pauseOnHover:true
					});
				});
			})
		}

		//init
		{
			$scope.getfreegame();
			$scope.initcookie();
		}

        // 销毁
        {


        }

	}])

})();