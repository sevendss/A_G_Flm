(function() {

angular.module('slot', [])


/**
 * [Controller]
 * 老虎机控制器
 */
.controller('__slot', ['$scope', '$rootScope', '$$base', '$$game', '$$dic', '$$modal', '$stateParams', '$$slot', '$$user', '$timeout', '$interval', '$$cache',
	function($scope, $rootScope, $$base, $$game, $$dic, $$modal, $stateParams, $$slot, $$user, $timeout, $interval, $$cache) {

		/* 变量声明 */
		{

			$rootScope.page.code = "slot";
			$scope.slots         = [];
			$scope.categories    = [];
			$scope.games         = [];

			
		}

		/* 业务逻辑 */
		{

			var w_pf = $scope.$watch('$stateParams.pf', function(newValue, oldValue, scope) {
				
				if (!$scope.init) {$scope.init = true; return;};

				$scope.changePf($scope.slots[$scope.swithcPF()]);

			});

			// 输入游戏名称
			$scope.searchGame = function(){

				if ($scope._search !== '') {

					$.each($scope.categories, function(index, val) {
						 /* iterate through array or object */

						 if (val.name === $$base.i18n('common-all-games') && val.pf === $scope._cpf) {

						 	$scope.changeCa(val);
						 	return false;

						 };

					});

				};

			}

			// 选取平台ID
			$scope.swithcPF = function(){

				switch ($stateParams.pf){

					case 'pt': idx = 0; break;
					case 'mg': idx = 1; break;

					default: idx = 1;

				}

				return idx;
			}

			// 开始游戏
			$scope.playSlot = function(item, isPrize){

				var url = "";

				if (isPrize) {

					url = $$dic.conf('play_slot_' + angular.lowercase(item.pf.substring(0,2))) + item.game_code;

				}else{

					url = $$dic.conf('play_slot_' + item.pfCode) + item.game_name;
					
				}

				$tools.openWindow(url);

			}

			// 试玩游戏
			$scope.trySlot = function(item){

				var url = $$dic.conf('try_slot_' + item.pfCode) + item.game_name;

				$tools.openWindow(url);

			}

			// 修改PT平台密码
			$scope.changePTPwd = function(){

				$$user.modifyPTPwd();

			}

			// 加载更多游戏
			$scope.showMoreGames = function(){

				$scope.showCount += 25;

			}

			// 切换选中平台
			$scope.changePf = function(item){

				$scope._cco = '';
				$scope._cpf = item.pfName;
				$scope._cca = $rootScope.casino_pt || item.category[0].categoryName;
				$rootScope.casino_pt = undefined;

				$.each($scope.categories, function(index, val) {

					 if (val.pf === item.pfName && val.name === $scope._cca) {

					 	$scope._c = val;
					 	return false;

					 };

				});

				$scope.showCount = 25;

			}

			// 切换类别
			$scope.changeCa = function(item){

				// 筛选收藏
				(item.name === $$base.i18n('common-my-collect'))? $scope._cco = 1: $scope._cco = '';

				$scope._cca = item.filter;
				$scope._c   = item;

				$scope.showCount = 25;

			}
           
			// 鼠标移动到图片上
			$scope.inGameArea = function(item){

				$scope._cgame = item.game_name;

			}

			// 鼠标移动开图片
			$scope.outGameArea = function(){

				$scope._cgame = undefined;

			}

			// 设置收藏的游戏
			$scope.setFavorite = function(item){

				(item.favorite === 0) ? item.favorite = 1: item.favorite = 0;

				// 将相同名称的游戏标为同样状态
				$.each($scope.games, function(index, val) {
					 /* iterate through array or object */
					 if(item.game_name === val.game_name && item.favorite !== val.favorite){

					 	val.favorite = item.favorite;

					 }

				});
				
				$$game.setFavorite(item.game_name, function(){

					if (item.favorite === 1) {

						$$modal.tips($$base.i18n('slot-collect-1'));
						
					}else{

						$$modal.tips($$base.i18n('slot-collect-2'));

					}

				})

			}

			// 获取SLOT幸运玩家
			$scope.getSlotLuckGuy = function(){

				$$slot.getSlotLuckGuy(function(result){

					$scope.luckUsers = [];

					$.each(result.data.mg, function(index, val) {
						 /* iterate through array or object */

						 val.pf = "MG平台";
						 $scope.luckUsers.push(val);

					});

					$.each(result.data.pt, function(index, val) {
						 /* iterate through array or object */

						 val.pf = "PT平台";
						 $scope.luckUsers.push(val);

					});

				})

			}
			

			// 查看PT账号
			$scope.checkoutPtAcc = function(){

				$$modal.alert(null, $$base.i18n('pt-username') + $rootScope.user.pfAcc[0].username +'\n'+$$base.i18n('pt-password')+ $rootScope.user.pfAcc[0].password);

			}

			// 初始化平台游戏
			$scope.initSlotGames = function(collects){

				$$game.getSlotGames(function(result){

					$scope.categories = [];
					$scope.games      = [];
					$scope.slots      = result.data.pf;

					// 分类目录& 游戏列表
					$.each($scope.slots, function(index, item) {

						$.each(item.category, function(idx, val) {

						 	$.each(val.games, function(i, v) {

								_v        = angular.copy(v);
								_v.pf     = item.pfName;
								_v.ca     = val.categoryName;
								_v.pfCode = item.pfCode;

								if (collects && collects.indexOf(_v.game_name) > -1) {

									_v.favorite = 1;

								}

						 		$scope.games.push(_v);

						 	});

						 	$scope.categories.push({'name':val.categoryName, 'filter':val.categoryName, 'pf': item.pfName});

						});

						// 全部游戏
						$scope.categories.push({'name': $$base.i18n('common-all-games'), 'filter':'', 'pf': item.pfName});

						// 我的收藏
						if ($rootScope.user) {

							$scope.categories.push({'name': $$base.i18n('common-my-collect'), 'filter':'', 'pf': item.pfName, 'collect': true});

						};

					});

					$scope.changePf($scope.slots[$scope.initIdx]);

				})

			}
			

			// 获取累计奖池
			$scope.initSlotPrizepool = function(){

				$$game.getSlotPrizepool(function(result){

					$scope._restotle = [{"pf": "MG平台", "total": result.data.mg.total},{"pf": "PT平台", "total": result.data.pt.total}];
					
					// 合并
					var _res = [];
					$.each(result.data.mg.games, function(index, val) {
						 /* iterate through array or object */
						 val.pf = "MG平台";
						 _res.push(val);

					});

					$.each(result.data.pt.games, function(index, val) {
						 /* iterate through array or object */
						  val.pf = "PT平台";
						 _res.push(val);

					});


					var d = new Date();
					var a = d.getHours() * 3600000
					      + d.getMinutes() * 60000
					      + d.getSeconds() * 1000
					      + d.getMilliseconds();


					$scope.prizepool = [];

					a = a/ 50 * 0.33;

					$.each(_res, function(index, item) {

						item.val = item.prizepool+a;
						item.info = item.game_name;
						$scope.prizepool.push(item);

					});

					// 累加
					$scope.i = $interval(function(){

						$.each($scope.prizepool, function(index, item) {
							 /* iterate through array or object */

							 item.val += 0.33;

						});

						$.each($scope._restotle, function(index, val) {
							 /* iterate through array or object */

							 val.total += 11.33;

						});


					}, 50)
					
				})
				
			}

		}

		/* 初始化  */
		{
			
			var p = $$base.switchBG('slot');

			// 初始化平台
			$scope.initIdx = $scope.swithcPF();

			// 获取累计奖池
			$scope.initSlotPrizepool();

			// 幸运玩家
			$scope.getSlotLuckGuy();

			// 监听登录状态
			var w = $scope.$watch('$root.user', function(newValue, oldValue) {

				if (!newValue) {

					$scope.initSlotGames();
					return;
				};

				$$game.getCollectedGame(function(result){

					var collects = [];

					$.each(result.data.games, function(index, val) {
						 /* iterate through array or object */

						 collects.push(val.game_name);

					});

					$scope.initSlotGames(collects);

				})

				
			});

		}

		/* 销毁  */
		{

			$scope.$on('$destroy', function(){

                w();
                w_pf();

                $interval.cancel($scope.i);

                $timeout.cancel(p);
				$rootScope.bg = 'slot';

            });

		}

	}])

})();