(function() {

    /**
     * 全站顶级路由表
     */
    angular.module('bomaRouter', ['ui.router'])

    .run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

    }])

    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        /////////////////////////////
        // Redirects and Otherwise //
        /////////////////////////////

        $urlRouterProvider.otherwise('/');


        //////////////////////////
        // State Configurations //
        //////////////////////////

        $stateProvider

        // 首页
        .state("index", {

            url: "/",
            templateUrl: 'home.html'

        })

        // 老虎机
        .state("slot", {

            url: "/slot",
            templateUrl: 'slot.html'

        })

        .state("slot.pf", {

            url: "/:pf",
            templateUrl: 'slot.html'

        })

        // 真人游戏
        .state("casino", {

            url: "/casino",
            templateUrl: 'casino.html'

        })

        .state("casino.pf", {

            url: "/:pf",
            templateUrl: 'casino.html'

        })

        // 体育游戏
        .state("sports", {

            url: "/sports",
            templateUrl: 'sports.html'

        })

        // 彩票游戏
        .state("lottery", {

            url: "/lottery",
            templateUrl: 'lottery.html'

        }) 

        .state("lottery.pf", {

            url: "/:pf",
            templateUrl: 'lottery.html'

        }) 

        // 优惠活动
        .state("promotion", {

            url: "/promotion",
            templateUrl: 'promotion.html'

        }) 

        .state("promotion.detail", {

            url: "/:id",
            templateUrl: 'promotion.html'

        })

        // 客户端
        .state("client", {

            url: "/client",
            templateUrl: 'client.html'

        })

        // 游戏规则
        .state("rule", {

            url: "/rule",
            templateUrl: 'rule.html'

        })

        .state("rule.casino", {

            url: "/casino",
            templateUrl: function(){
                lang = getCookie('lang') || 'zh-cn';
                return 'rule/' + lang + '/casino/index.html';
            }

        })

        .state("rule.casino.game", {

            url: "/:game",
            templateUrl: function(){
                lang = getCookie('lang') || 'zh-cn';
                return 'rule/' + lang + '/casino/index.html';
            }

        })

         // 帮助中心
        .state("help", {

            url: "/help",
            templateUrl: 'help.html'

        })

        // 帮助中心首页
        .state("help.usual", {
            url: "/:type",
            templateUrl: 'help.html'
        })

        //测速
        .state("speed", {
            url: "/speed",
            templateUrl: 'speed.html'
        })

        //域名验证
        .state("domain", {
            url: "/domain",
            templateUrl: 'domain.html'
        })

        //推广注册
        .state("spread", {
            url: "/spread",
            templateUrl: 'spread.html'
        })

          //推广页面绑定代理号
        .state("spread.usual", {
            url: "/:agentcode",
            templateUrl: 'spread.html'
        })

        // 个人中心
        .state("my", {

            url: "/my",
            templateUrl: 'my.html'

        })

        // 个人中心首页
        .state("my.index", {

            url: "/index",
            templateUrl: "my/my_index.html"

        })

        // 存款
        .state("my.recharge", {

            url: "/recharge",
            templateUrl: "my/recharge.html"

        })

        // 提现
        .state("my.withdraw", {

            url: "/withdraw",
            templateUrl: "my/withdraw.html"

        })


        // 转账
        .state("my.transfers", {

            url: "/transfers",
            templateUrl: "my/transfers.html"

        })

        // 历史记录
        .state("my.history", {

            url: "/history/:type",
            templateUrl: "my/history.html"

        })

        // 安全中心
        .state("my.safety", {

            url: "/safety",
            templateUrl: "my/safety.html"

        })

        .state("my.safety.in", {

            url: "/:in",
            templateUrl: "my/safety.html"

        })

        // 修改密码
        .state("my.password", {

            url: "/password",
            templateUrl: "my/changePwd.html"

        })

        // 修改个人信息
        .state("my.info", {

            url: "/info",
            templateUrl: "my/info.html"

        })

        // 系统通知
        .state("my.message", {

            url: "/message",
            templateUrl: "my/message.html"

        })

        // 开发测试页面使用
        // .state("dev", {

        //     url: "/dev",
        //     templateUrl: 'dev.html'

        // })

        // .state("plug", {

        //     url: "/plug",
        //     templateUrl: 'plugtester.html'

        // })
        
    }]);

})();