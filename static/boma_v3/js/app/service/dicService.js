/**
 * [DicServices]
 * @return {[type]} [字典服务]
 */
(function(){

	angular.module('dic.service', [])

	.factory('$$dic', 
		[
			'$log', 
			'$rootScope', function($log, $rootScope) {

		return{

			/**
			 * 全站配置参数
			 * @param  {[type]} key [description]
			 * @return {[type]}     [description]
			 */
			conf: function(key){

				var map = {};

				map['my-tabs'] = [{"code":"bonus","zh-cn":"红利记录"},{"code":"betting","zh-cn":"投注记录"},{"code":"recharge","zh-cn":"充值记录"},{"code":"withdraw","zh-cn":"提款记录"},{"code":"transfers","zh-cn":"转账记录"}];

				//个人中心左侧菜单栏项目【格式化JSON串后修改】
				map['my-navs'] = [{"zh-cn":"我的账户","navId":1,"icon":"my-icon-account","children":[{"zh-cn":"账户概况","navId":10,"href":"#/my/index"},{"zh-cn":"充值","navId":11,"href":"#/my/recharge"},{"zh-cn":"提现","navId":12,"href":"#/my/withdraw"},{"zh-cn":"转账","navId":13,"href":"#/my/transfers"}]},{"zh-cn":"账户明细","navId":2,"icon":"my-icon-detail","children":[{"zh-cn":"红利记录","navId":21,"href":"#/my/history/bonus"},{"zh-cn":"投注记录","navId":24,"href":"#/my/history/betting"},{"zh-cn":"充值记录","navId":25,"href":"#/my/history/recharge"},{"zh-cn":"提款记录","navId":22,"href":"#/my/history/withdraw"},{"zh-cn":"转账记录","navId":23,"href":"#/my/history/transfers"}]},{"zh-cn":"账户安全","navId":3,"icon":"my-icon-safety","children":[{"zh-cn":"安全中心","navId":30,"href":"#/my/safety"},{"zh-cn":"个人资料","navId":31,"href":"#/my/info"},{"zh-cn":"修改密码","navId":32,"href":"#/my/password"}]},{"zh-cn":"我的消息","navId":4,"icon":"my-icon-message","children":[{"zh-cn":"系统通知","navId":41,"href":"#/my/message"}]}];

				//真人游戏平台游戏对应关系【格式化JSON串后修改】
				map['casino-pfs'] = [
						{"name":"AG","url":"#","image":"ag.png","title":{"zh-cn":"最具创新人气最旺"},"desc":{"zh-cn":"女忧、名模荷官不定期与你面面派牌，让你High翻全场"},"games":[{"zh-cn":"急速百家乐","rule":"/#/rule/casino/ag.jsbjl"},{"zh-cn":"6牌百家乐","rule":"/#/rule/casino/ag.6pbjl"},{"zh-cn":"免佣百家乐","rule":"/#/rule/casino/ag.tybjl"},{"zh-cn":"自选多台","rule":"/#/rule/casino/ag.zxdt"},{"zh-cn":"骰宝","rule":"/#/rule/casino/ag.sb"},{"zh-cn":"轮盘","rule":"/#/rule/casino/ag.lp"},{"zh-cn":"龙虎斗","rule":"/#/rule/casino/ag.lhd"}]},
						{"name":"BBIN","url":"#","image":"bbin.png","title":{"zh-cn":"亚洲最稳健的娱乐平台"},"desc":{"zh-cn":"如临现场的丰富娱乐享受，实力深厚值得信赖！"},"games":[{"zh-cn":"骰宝","rule":"/#/rule/casino/bbin.sb"},{"zh-cn":"轮盘","rule":"/#/rule/casino/bbin.lp"},{"zh-cn":"龙虎斗","rule":"/#/rule/casino/bbin.lhd"},{"zh-cn":"三公","rule":"/#/rule/casino/bbin.sg"},{"zh-cn":"德州扑克","rule":"/#/rule/casino/bbin.dzpk"},{"zh-cn":"无线21点","rule":"/#/rule/casino/bbin.wx21d"},{"zh-cn":"百家乐","rule":"/#/rule/casino/bbin.bjl"},{"zh-cn":"温州牌九","rule":"/#/rule/casino/bbin.wzpj"},{"zh-cn":"牛牛","rule":"/#/rule/casino/bbin.nn"},{"zh-cn":"二八杠","rule":"/#/rule/casino/bbin.28g"},{"zh-cn":"色蝶","rule":"/#/rule/casino/bbin.sd"}]},
						{"name":"PT","url":"#","image":"pt.png","title":{"zh-cn":"玩法丰富实力超群"},"desc":{"zh-cn":"靓丽中文荷官动人声线的即时互动，真人娱乐最强现场"},"games":[{"zh-cn":"Vip百家乐","rule":"/#/rule/casino/pt.vipbjl"},{"zh-cn":"实况法式轮盘赌","rule":"/#/rule/casino/pt.skfslpd"},{"zh-cn":"真人骰子","rule":"/#/rule/casino/pt.zrsz"},{"zh-cn":"累积百家乐","rule":"/#/rule/casino/pt.vipbjl"},{"zh-cn":"迷你百家乐","rule":"/#/rule/casino/pt.vipbjl"},{"zh-cn":"真人百家乐","rule":"/#/rule/casino/pt.vipbjl"},{"zh-cn":"真人二十一点","rule":"/#/rule/casino/pt.zr21d"},{"zh-cn":"真人轮盘","rule":"/#/rule/casino/pt.zrlp"}]},
						{"name":"GD","url":"#","image":"gd.png","title":{"zh-cn":"技术专注品质卓越"},"desc":{"zh-cn":"完美的百家乐之旅，连串、多台、多彩、3D、传统百家乐"},"games":[{"zh-cn":"3d百家乐","rule":"/#/rule/casino/gd.3dbjl"},{"zh-cn":"多彩百家乐","rule":"/#/rule/casino/gd.3dbjl"},{"zh-cn":"新式百家乐","rule":"/#/rule/casino/gd.3dbjl"},{"zh-cn":"传统百家乐","rule":"/#/rule/casino/gd.3dbjl"},{"zh-cn":"轮盘","rule":"/#/rule/casino/gd.lp"}]}];

				//游戏规则左边菜单
				map['casino-pfs-menu'] = [
						{"name":"AG","url":"#","image":"ag.png","title":{"zh-cn":"最具创新人气最旺"},"desc":{"zh-cn":"女忧、名模荷官不定期与你面面派牌，让你High翻全场"},"games":[{"zh-cn":"急速百家乐","rule":"/#/rule/casino/ag.jsbjl"},{"zh-cn":"6牌百家乐","rule":"/#/rule/casino/ag.6pbjl"},{"zh-cn":"免佣百家乐","rule":"/#/rule/casino/ag.tybjl"},{"zh-cn":"自选多台","rule":"/#/rule/casino/ag.zxdt"},{"zh-cn":"骰宝","rule":"/#/rule/casino/ag.sb"},{"zh-cn":"轮盘","rule":"/#/rule/casino/ag.lp"},{"zh-cn":"龙虎斗","rule":"/#/rule/casino/ag.lhd"}]},
						{"name":"BBIN","url":"#","image":"bbin.png","title":{"zh-cn":"亚洲最稳健的娱乐平台"},"desc":{"zh-cn":"如临现场的丰富娱乐享受，实力深厚值得信赖！"},"games":[{"zh-cn":"骰宝","rule":"/#/rule/casino/bbin.sb"},{"zh-cn":"轮盘","rule":"/#/rule/casino/bbin.lp"},{"zh-cn":"龙虎斗","rule":"/#/rule/casino/bbin.lhd"},{"zh-cn":"三公","rule":"/#/rule/casino/bbin.sg"},{"zh-cn":"德州扑克","rule":"/#/rule/casino/bbin.dzpk"},{"zh-cn":"无线21点","rule":"/#/rule/casino/bbin.wx21d"},{"zh-cn":"百家乐","rule":"/#/rule/casino/bbin.bjl"},{"zh-cn":"温州牌九","rule":"/#/rule/casino/bbin.wzpj"},{"zh-cn":"牛牛","rule":"/#/rule/casino/bbin.nn"},{"zh-cn":"二八杠","rule":"/#/rule/casino/bbin.28g"},{"zh-cn":"色蝶","rule":"/#/rule/casino/bbin.sd"}]},
						{"name":"PT","url":"#","image":"pt.png","title":{"zh-cn":"玩法丰富实力超群"},"desc":{"zh-cn":"靓丽中文荷官动人声线的即时互动，真人娱乐最强现场"},"games":[{"zh-cn":"百家乐","rule":"/#/rule/casino/pt.vipbjl"},{"zh-cn":"实况法式轮盘赌","rule":"/#/rule/casino/pt.skfslpd"},{"zh-cn":"真人骰子","rule":"/#/rule/casino/pt.zrsz"},{"zh-cn":"真人二十一点","rule":"/#/rule/casino/pt.zr21d"},{"zh-cn":"真人轮盘","rule":"/#/rule/casino/pt.zrlp"}]},
						{"name":"GD","url":"#","image":"gd.png","title":{"zh-cn":"技术专注品质卓越"},"desc":{"zh-cn":"完美的百家乐之旅，连串、多台、多彩、3D、传统百家乐"},"games":[{"zh-cn":"百家乐","rule":"/#/rule/casino/gd.3dbjl"},{"zh-cn":"轮盘","rule":"/#/rule/casino/gd.lp"}]}];

				//前台菜单(登录前)
				map['menu-logout'] = [

					{'lable':'home',"detail":0, "herf": "index"},
					{'lable':'slot',"detail":1, "herf": "slot"},
					{'lable':'casino',"detail":1, "herf": "casino"},
					{'lable':'sports',"detail":1, "herf": "sports"},
					{'lable':'lottery',"detail":1, "herf": "lottery"},
					{'lable':'promotion',"detail":0, "herf": "promotion"},
					{'lable':'client',"detail":0, "herf": "client"}

				];

				//前台菜单(登录后)
				map['menu-login'] = [

					{'lable':'home',"detail":0, "herf": "index"},
					{'lable':'slot',"detail":1, "herf": "slot"},
					{'lable':'casino',"detail":1, "herf": "casino"},
					{'lable':'sports',"detail":1, "herf": "sports"},
					{'lable':'lottery',"detail":1, "herf": "lottery"},
					{'lable':'promotion',"detail":0, "herf": "promotion"},
					{'lable':'client',"detail":0, "herf": "client"},
					{'lable':'my',"detail":0, "herf": "my.index"}

				];

				//游戏平台
				map['game-pfs'] = ['MG','SB','WBG','PT','AG','GD','BBIN'];

				//累计奖池游戏(4个)
				map['prizepool-games'] = [

					{'name': '蜘蛛侠', 'icon': 'prizepool_icon2.png'},
					{'name': '钢铁侠', 'icon': 'prizepool_icon1.png'},
					{'name': '神奇四侠', 'icon': 'prizepool_icon4.png'},
					{'name': '雷神', 'icon': 'prizepool_icon3.png'}

				];

				// 真人游戏平台
				map['casino_pfs'] = ['ag', 'bbin', 'pt', 'gd'];

				// 彩票游戏平台
				map['lottery_pfs'] = ['wbg', 'bbin'];

				// 彩票游戏BBIN大厅URL
				map['play_lottery_bbin'] = '/play/bbin?type=lt';

				// 彩票游戏WBG大厅URL
				map['play_lottery_wbg'] = '/play/wbg';

				// 真人游戏PT去大厅URL
				map['play_casino_pt'] = '#/slot/pt';

				// 真人游戏AG去大厅URL
				map['play_casino_ag'] = 'play/ag';

				// 真人游戏BBIN去大厅URL
				map['play_casino_bbin'] = '/play/bbin';

				// 真人游戏GD去大厅URL
				map['play_casino_gd'] = '/play/gd';

				// 沙巴客户端地址
				map['sb_client'] = 'http://www.boma365.com/msb';

				// MG老虎机开始游戏地址
				map['play_slot_mg'] = '/play/mg?gamename=';

				// MG老虎机试玩游戏地址
				map['try_slot_mg'] = 'https://redirector3.valueactive.eu/Casino/Default.aspx?applicationid=1023&theme=quickfiressl&usertype=5&sext1=demo&sext2=demo&csid=1866&serverid=1866&variant=MIT-Demo&ul=zh&gameid=';

				// PT老虎机开始游戏地址
				map['play_slot_pt'] = '/pt/jump?code=';

				// PT老虎机试玩游戏地址
				map['try_slot_pt'] = 'http://cache.download.banner.mightypanda88.com/casinoclient.html?language=ZH-CN&nolobby=1&mode=offline&affiliates=1&game=';

				// 沙巴登录前地址
				map['play_sports_sb_b'] = 'http://mkt.qwek5.com/vender.aspx?lang=cs';

				// 沙巴登录后地址
				map['play_sports_sb_a'] = '/play/sb';

				// 顶部公告不显示的页面
				map['hide-announcement'] = ['slot', 'casino', 'lottery','spread'];

				// 用户名前缀
				map['preaccount'] = 'bm365';

				// 当前缓存数据版本号
				map['cache_version'] = '1.0.1';

				//返回
				if (angular.isUndefined(map[key])) {

					$log.debug('####未设置字典类型:conf/ key：' + key + '####');

					return '';

				};

				return map[key];

			},

			/**
			 * 客户端下载地址
			 * @param  {[type]} key [description]
			 * @return {[type]}     [description]
			 */
			client: function(key){

				var map = {};

				map['pt'] =  'http://cdn.jackpotmatrix.com/boma365prod/d/setup.exe';
				map['boma'] = 'http://www.boma365.com/uploads/boma.exe';

				//返回
				if (!map[key]) {

					$log.debug('####未设置字典类型:client/ key：' + key + '####');

					return '';

				};

				return map[key];

			},

			/**
			 * 站点联系信息
			 * @param  {[type]} key [description]
			 * @return {[type]}     [description]
			 */
			contact: function(key){

				var map = {};

				map['service_online'] = 'https://v2.live800.com/live800/chatClient/chatbox.jsp?companyID=288008&jid=1654927440&enterurl&s=1';
				map['service_mail']   = 'CS@boma365.com';
				map['hotline']        = '400-682-8278';
				map['domain']         = 'BOMA365.COM';
				map['aff']         	  = 'http://aff.boma365.com';

				//返回
				if (!map[key]) {

					$log.debug('####未设置字典类型:contact/ key：' + key + '####');

					return '';

				};

				return map[key];

			},

			modal: function(key){

				var map = {};

				map['login']          = "#modal-login";
				map['register']       = "#modal-register";
				map['promotion']      = "#modal-promotion";
				map['feedback']       = "#modal-feedback";
				map['findPwd']        = "#modal-findPwd";
				map['withdraw']       = "#modal-withdraw";
				map['promotion-lite'] = "#modal-promotion-lite";
				map['message-detail'] = "#modal-message-detail";
				//返回
				if (!map[key]) {

					$log.debug('####未设置字典类型:modal/ key：' + key + '####');

					return '';

				};

				return map[key];

			},

			// 为代理准备的字典
			agent: function(key){

				var map = {};
				var h= window.location.host;

				map['service_mail']   = window.$agent.email;
				map['hotline']        = window.$agent.tel;
				map['domain']         = (h.indexOf('www.') > -1)? angular.uppercase(h.substr(4, h.length-1)): angular.uppercase(h);
				map['aff']         	  = window.$agent.aff;

				//返回
				if (!map[key]) {

					return null;

				};

				return map[key];

			}


		}

	}])


})();