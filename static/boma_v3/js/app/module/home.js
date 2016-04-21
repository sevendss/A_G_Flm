(function() {

angular.module('home', [])


/**
 * [Controller]
 * 首页控制器
 */
.controller('__home', ['$scope', '$rootScope', '$$base', '$$game', '$$dic', '$$user', '$$common', '$$modal', '$interval', '$timeout', '$cookies',
    function($scope, $rootScope, $$base, $$game, $$dic, $$user, $$common, $$modal, $interval, $timeout, $cookies) {

		/* 变量声明 */
		{

			$rootScope.page.code = "home";
            $rootScope.bg        = undefined;

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


            // 刷新余额
            $scope.refreshBalance = function(){

                $$user.getUserBalance(function(result){

                    if (!$rootScope.user) {return;};

                    $rootScope.user.balance = result.data;
                    var tm = Number($rootScope.user.balance.centreBalance);
                    $.each($rootScope.user.balance.platform, function(index, val) {
                         /* iterate through array or object */
                         tm += Number(val.balance);

                    });

                    $rootScope.user.balance.totleBalance = tm;
                
                });

            }

            // 鼠标进入游戏图片
            $scope.inGameArea = function(item, type){

                // 热门游戏
                if (type === 1) {

                    $scope.showPlayGame_hot = item.game_name;

                };

                // 收藏的游戏
                if (type === 2) {

                    $scope.showPlayGame_collected = item.game_name;

                };

            }

            // 鼠标移除游戏图片
            $scope.outGameArea = function(){

                $scope.showPlayGame_hot = undefined;
                $scope.showPlayGame_collected = undefined;

            }

            // 切换热门游戏
            $scope.changeHotGame = function(){

                $rootScope.hotGames = undefined;
                
                $$game.getHotGame(function(result){

                    $rootScope.hotGames = result.data;

                })

            }

            // 开始游戏
            $scope.playSlot = function(item){

                var pf = null;

                switch (item.platform){

                    case 'mggames': pf = 'mg'; break;
                    case 'ptgames': pf = 'pt'; break;

                }

                var url = $$dic.conf('play_slot_' + pf) + item.game_name;

                $tools.openWindow(url);

            }

            // 监听登录状态 
            var w = $scope.$watch('$root.user', function(newValue, oldValue, scope) {

                if (!newValue) {return};

                // 获取热门推荐游戏
                $$game.getHotGame(function(result){

                    $rootScope.hotGames = result.data;

                })

                // 获取收藏过的游戏
                $$game.getCollectedGame(function(result){

                    if (!$rootScope.user) {return;};

                    $rootScope.user.collectedGames = result.data;

                })

            });

		}

        // 初始化
        {

            var i = $interval(function(){

                if($('#modal-promotion-lite').length > 0){

                    if (!$rootScope._promotion) {

                        $rootScope._promotion = {};
                        
                    };

                    $interval.cancel(i);

                }

            }, 50)


        }

        // 销毁
        {

            $scope.$on('$destroy', function(){

                w();
                $interval.cancel(i);

            });

        }

	}])

})();