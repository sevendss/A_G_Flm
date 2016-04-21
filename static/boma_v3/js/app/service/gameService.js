/**
 * [gameService 提供游戏相关服务]
 */
(function(){

	angular.module('game', [])

	.factory('$$game', 
		[
			'$log', 
			'$cookies',
			"$$base",
			'$$request',
			'$timeout',
			'$$dic',
			'$sce',
			'$rootScope', function($log, $cookies, $$base, $$request, $timeout, $$dic, $sce, $rootScope) {

		var hotGamePageNo = 0;

		return{

			// 进入游戏大厅
			enterGameHall: function(item){

				var i        = angular.uppercase(item);
                var location = null;

                if ('GD' === i) {

                	$tools.openWindow('#/casino/gd?in=1');
                	return false;

                };

                if ('AG' === i) {

                	$tools.openWindow('#/casino/ag?in=1');
                	return false;

                };

                if ('BBIN' === i) {

                	$tools.openWindow($$dic.conf('play_casino_bbin'));
                	return false;

                };

                if (['PT','MG'].indexOf(i) > -1) {

                	window.location.href = "#/slot/" + angular.lowercase(item);
                	return false;

                };


                if (i === 'SB'){

                    window.location.href = '#/sports';
                    return false;

                };

                if (i === 'WBG') {

                    $tools.openWindow('#/lottery/wbg?in=1');
                    return false;

                };


			},

			// 进入casino平台
			enterCasinoPF: function(scope, pfName){

				scope.gameUrl = $$dic.conf('play_casino_' + angular.lowercase(pfName));

				// PT真人
				if (angular.uppercase(pfName) === 'PT') {

					$rootScope.casino_pt = $$base.i18n('pt-casino');
					window.location.href = scope.gameUrl;
					return false;

				};

				// BBIN 跳出窗口
				if (angular.uppercase(pfName) === 'BBIN') {

					$tools.openWindow(scope.gameUrl);
					return false;

				}

				if ($tools.getUrlParam('in') == 1) {

						scope.showGameHall = true;
						// 1366分辨率
						$timeout(function(){

							if($(window).width() <= 1570){

								$('iframe').width($(window).width() - 90);

							}
							
						}, 500)
					
					$timeout(function(){

						scope.gameUrl		= $sce.trustAsResourceUrl(scope.gameUrl);
						$rootScope.bg 		= 'casino-if';
						$rootScope.miniMenu = true;

					})

				}else{

					$tools.openWindow("#/casino/" +angular.lowercase(pfName)+ "?in=1");
					window.location.href = "#/casino/";

				}


			},

			/**
			 * 获取热门游戏
			 */
			getHotGame: function(callback){

				var r = $$request.packageReq('game-hot', [++hotGamePageNo], null, 'GET', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},
			
			/**
			 * 获取用户收藏的游戏
			 */
			getCollectedGame: function(callback){

				var r = $$request.packageReq('game-collected', null, null, 'GET', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			/**
			 * 获取老虎机游戏
			 */
			getSlotGames: function(callback){

				var r = $$request.packageReq('game-slot', null, null, 'GET', false, false, 7);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			/**
			 * 获取老虎机累计奖池
			 */
			getSlotPrizepool: function(callback){

				var r = $$request.packageReq('slot-prizepool', null, null, 'GET', false, false, -1);

				$$request.action(r, function(result){

					callback(result);

				});

			},

			/**
			 * 设置收藏的游戏
			 */
			setFavorite:function(game_code, callback){

				var urlParam = [game_code];

				var r = $$request.packageReq('set-collect', urlParam, null, 'PUT', false, false);

				$$request.action(r, function(result){

					callback(result);

				});

			}


		}

	}])


})();