//初次化加载全部模块
(function() {
	window.$boma = angular;
	angular.module("boma", ["ngCookies", "w5c.validator", "ngClipboard", "pascalprecht.translate", "framework", "framework.directive", "bomaRouter", "ngAnimate", "base.service", "base.filter", "base.directive", "cache.service", "dic.service", "static.service", "modal", "request", "verify", "home", "user", "slot", "slot.directive", "slot.service", "casino", "casino.directive", "sports", "lottery", "promotion", "promotion.directive", "client", "my", "my.service", "game", "common.service", "help", "rule", "speed", "domain", "spread"]).run(["$rootScope", "$cookies", "$$dic", "$log", function(a, b, f, j) {
		a.workspace = window.$path;
		window.client = a.client = {};
		a.client.browser = $tools.getBrowser();
		a.client.device = $tools.getDevice();
		a.client.screen = {
			height: screen.height,
			width: screen.width
		};
		
		if (window.model === "dev") {
			j.info("##browser:" + a.client.browser.name + " #version:" + a.client.browser.version);
			j.info("##device:" + a.client.device);
			j.info("##screen:" + a.client.screen.width + "*" + a.client.screen.height)
		}
		a.lang = b.get("lang") || "zh-cn";
		b.put("lang", a.lang);
		$.ajaxSettings.cache = true;
		a.token = "";
		a.sessionId = b.get("sessId") || null;
		a.kingBall = (window.$kb_domains.indexOf(window.location.host) > -1) ? true : false;
		//a.kingBall =true;
		if (window.localStorage) {
			if (window.localStorage.cache_version != f.conf("cache_version")) {
				window.localStorage.clear()
			}
			window.localStorage.setItem("cache_version", f.conf("cache_version"));
			var g = [];
			for (var d = 0; d < window.localStorage.length; d++) {
				try {
					var l = angular.fromJson(window.localStorage[window.localStorage.key(d)]);
					if (l && l.expires && l.expires === -1) {
						g.push(window.localStorage.key(d))
					}
				} catch (k) {}
			}
			$.each(g, function(e, m) {
				window.localStorage.removeItem(m)
			})
		}
		if (window.localStorage && window.localStorage.user) {
			if (angular.fromJson(b.get("user"))) {
				a.user = angular.fromJson(window.localStorage.user)
			} else {
				window.localStorage.removeItem("user");
				a.user = undefined
			}
		} else {
			a.user = angular.fromJson(b.get("user")) || undefined
		}
		a.conf = {};
		a.conf.showBalance = false;
		a.triggers = {}
	}]).config(["ngClipProvider", function(a) {
		a.setPath(window.$path + "static/boma_v3/pulgin/ZeroClipboard/ZeroClipboard.swf")
	}]).config(["w5cValidatorProvider", function(a) {
		a.config({
			blurTrig: true,
			showError: true,
			removeError: true
		})
	}]).config(["$translateProvider", function(a) {
		window.lang = $tools.getCookie("lang") || "zh-cn";
		a.useStaticFilesLoader({
			prefix: "i18n/",
			suffix: ".html"
		});
		a.useLoaderCache(true);
		a.preferredLanguage(window.lang)
	}]).filter("i18n", ["$parse", "$translate", "$rootScope", function(d, b, a) {
		var e = function(f, j, g) {
				if (!angular.isObject(j)) {
					j = d(j)(this)
				}
				return b.instant(f, j, g)
			};
		e.$stateful = true;
		return e
	}]).factory("httpInterceptor", ["$q", "$rootScope", "$log", function(b, a, d) {
		return {
			request: function(e) {
				e.timeout = 30000;
				return e || b.when(e)
			},
			response: function(e) {
				if (e.config.url.indexOf("/i18n/") > -1) {
					a.translateState = true
				}
				return e || b.when(e)
			},
			responseError: function(e) {
				switch (e.status) {
				case 403:
					d.error("#######夭寿啦，服务器罢工啦（403）########");
					break;
				case 404:
					d.error("#######夭寿啦，服务器罢工啦（404）########");
					break;
				case 408:
					d.error("#######夭寿啦，服务器罢工啦（408）########");
					break;
				case 500:
					d.error("#######夭寿啦，服务器罢工啦（500）########");
					break;
				case 502:
					d.error("#######夭寿啦，服务器罢工啦（502）########");
					break;
				case -1:
					d.error("#######夭寿啦，服务器请求超时（TIMEOUT）URL: " + e.config.url + "########");
					break
				}
				if ([403, 404, 408, 500, 502, -1].indexOf(e.status) > -1) {
					if ($(".fakeloader").length > 0) {
						$("#fakeloader").fadeOut();
						$("#fakeloader").remove()
					}
				}
				return b.reject(e)
			}
		}
	}]).config(["$httpProvider", function(a) {
		a.interceptors.push("httpInterceptor")
	}]).factory("$exceptionHandler", ["$log", function(b) {
		return function a(d, e) {
			b.error("#### Catch Error Begin ####");
			b.info("#### Message ####");
			b.info(d.message);
			b.info("#### Cause ####");
			b.info(e);
			b.debug("#### Catch Error End   ####")
		}
	}])
})();






(function() {
	
	angular.module("base.directive", []).directive("circleProgress", ["$compile", function($compile) {
		return {
			restrict: "AE",
			scope: {
				img: "@",
				rate: "@"
			},
			link: function(scope, element, attr) {
				var ranId = "cp" + Math.ceil(Math.random() * 1000000);
				var p = "<div id=" + ranId + "></div><img lazy isrc=" + scope.img + " />";
				element.html(p);
				$compile(element.contents())(scope);
				window.setTimeout(function() {
					seajs.use(window.$path + "static/boma_v3/pulgin/jquery-circle-progress/dist/circle-progress", function() {
						$("#" + ranId).circleProgress({
							startAngle: -Math.PI / 4 * 2,
							reverse: true,
							value: scope.rate,
							size: 155,
							thickness: 5,
							emptyFill: "#3a2c40",
							fill: {
								gradient: ["#f9564e", "#e93c67"]
							}
						})
					})
				})
			}
		}
	}]).directive("bomaCheckbox", ["$compile", function($compile) {
		return {
			restrict: "AE",
			scope: {
				text: "@",
				model: "=ngModel",
			},
			require: "ngModel",
			link: function(scope, element, attr) {
				scope.model = scope.model || 0;
				var tp = "",
					saving = scope.model;
				scope.$watch("model", function(newValue) {
					scope.model = scope.model || saving;
					if (scope.model) {
						tp = '<span ng-click="toggle()" class="checkbox-container" ><span class="boma-checkbox boma-checkbox-active"></span><span class="boma-checkbox-text" ng-if="text" ng-bind="text | i18n" ></span></span>'
					} else {
						tp = '<span ng-click="toggle()" class="checkbox-container" ><span class="boma-checkbox"></span><span class="boma-checkbox-text" ng-if="text" ng-bind="text | i18n"></span></span>'
					}
					element.html(tp);
					$compile(element.contents())(scope)
				});
				scope.toggle = function() {
					scope.model = (scope.model) ? 0 : 1;
					saving = scope.model
				}
			}
		}
	}]).directive("antiAliasing", ["$compile", function($compile) {
		return {
			restrict: "A",
			link: function(scope, element, attr) {
				var ele = angular.element(element);
				scope.anti = function() {
					h = ele.height();
					if (h % 2 === 1) {
						h++;
						ele.height(h)
					}
				};
				$(ele).resize(function(e) {
					scope.anti()
				});
				scope.anti()
			}
		}
	}]).directive("serviceBar", ["$compile", "$timeout", "$$modal", function($compile, $timeout, $$modal) {
		return {
			restrict: "A",
			link: function(scope, element, attr) {
				scope.resetWindow = function() {
					var top = (window.innerHeight - 280) / 2;
					var tp = '<a service-trigger style="top:' + (top + 40) + 'px" class="service" ng-class="{&quot;service-lg&quot; : idx===0}" ng-mouseenter="showBiger(0);" ng-mouseleave="showSmaller()"></a><div style="top:' + (Number(top) + 80) + 'px" class="promotion" ng-click="goPromotion();" ng-class="{&quot;promotion-lg&quot; : idx===2}" ng-mouseenter="showBiger(2);" ng-mouseleave="showSmaller()"></div><div style="top:' + (Number(top) + 120) + 'px" class="client" ng-click="goClient();" ng-class="{&quot;client-lg&quot; : idx===3}" ng-mouseenter="showBiger(3);" ng-mouseleave="showSmaller()"></div><div style="top:' + (Number(top) + 160) + 'px" class="feedback" login-checker="goFeedback()" ng-class="{&quot;feedback-lg&quot; : idx===4}" ng-mouseenter="showBiger(4);" ng-mouseleave="showSmaller()"></div><div style="top:' + (Number(top) + 200) + 'px" class="totop" ng-click="goTop();" ng-class="{&quot;totop-lg&quot; : idx===5}" ng-mouseenter="showBiger(5);" ng-mouseleave="showSmaller()"></div>';
					element.html(tp);
					$compile(element.contents())(scope)
				};
				scope.goFeedback = function() {
					$$modal.popup(scope, "feedback")
				};
				scope.goClient = function() {
					window.location.href = "#/client"
				};
				scope.goPromotion = function() {
					window.location.href = "#/promotion"
				};
				scope.goTop = function() {
					$("body,html").animate({
						scrollTop: 0
					}, 500)
				};
				scope.showSmaller = function() {
					scope.idx = undefined
				};
				scope.showBiger = function(idx) {
					scope.idx = idx
				};
				window.onresize = function() {
					scope.resetWindow()
				};
				scope.resetWindow()
			}
		}
	}]).directive("loginTrigger", ["$rootScope", function($rootScope) {
		return {
			restrict: "A",
			link: function(scope, element, attr) {
				element.click(function(event) {
					$rootScope.triggers.login = {
						bullet: Math.ceil(Math.random() * 1000000)
					};
					scope.$apply()
				})
			}
		}
	}]).directive("registerTrigger", ["$rootScope", function($rootScope) {
		return {
			restrict: "A",
			link: function(scope, element, attr) {
				element.click(function(event) {
					$rootScope.triggers.register = Math.ceil(Math.random() * 1000000);
					scope.$apply()
				})
			}
		}
	}]).directive("announcement", ["$compile", "$$common", function($compile, $$common) {
		return {
			scope: {
				size: "@"
			},
			restrict: "A",
			link: function(scope, element, attr) {
				$$common.getNotice(function(result) {
					scope.msgs = result.data;
					var tpl = '<div class="am-container boma-container index-game-head">  <marquee class="main-announcement" scrollamount="3" scrolldelay="60" class="annoucement"><span ng-if="msgs.length > 0" class="announcement-icon">　　';
					$.each(result.data, function(index, val) {
						tpl += '</span><span class="am-margin-right-xl">' + val.content + "</span>"
					});
					tpl += "</marquee></div>";
					if (scope.size == "mini") {
						tpl = '<marquee class="main-announcement-mini" ng-style="myStyle" scrollamount="3" scrolldelay="60" class="annoucement"><span ng-if="msgs.length > 0" class="announcement-icon">　　';
						$.each(result.data, function(index, val) {
							tpl += '</span><span class="am-margin-right-xl">' + val.content + "</span>"
						});
						tpl += "</marquee>"
					}
					element.html(tpl);
					$compile(element.contents())(scope)
				});
				var w = scope.$watch("$root.user", function(newValue, oldValue, scope) {
					if (!newValue) {
						scope.myStyle = {
							width: "1000px"
						}
					} else {
						scope.myStyle = {}
					}
				});
				scope.$on("$destroy", function() {
					w()
				})
			}
		}
	}]).directive("iframeOnload", ["$$modal", "$timeout", "$$base", function($$modal, $timeout, $$base) {
		return {
			link: function(scope, element, attrs) {}
		}
	}]).directive("loginChecker", ["$$modal", "$rootScope", "$$base", function($$modal, $rootScope, $$base) {
		return {
			scope: {
				callback: "&loginChecker"
			},
			restrict: "A",
			link: function(scope, element, attr) {
				scope.checkLogin = function() {
					if (!$rootScope.user) {
						$$modal.confirm(null, $$base.i18n("common-login-yet"), $$base.i18n("modal-register-goLogin"), scope.openLogin, null, null);
						return
					}
					if (angular.isFunction(scope.callback)) {
						scope.callback()
					}
				};
				scope.openLogin = function() {
					$rootScope.triggers.login = {
						bullet: Math.ceil(Math.random() * 1000000)
					};
					if (angular.isFunction(scope.callback)) {
						$rootScope.triggers.login.fn = scope.callback
					}
					scope.$apply()
				};
				element.bind("click", scope.checkLogin)
			}
		}
	}]).directive("onFinishRender", function($timeout) {
		return {
			restrict: "A",
			link: function(scope, element, attr) {
				if (scope.$last === true) {
					$timeout(function() {
						scope.$emit("onFinishRender")
					})
				}
			}
		}
	}).directive("render", ["$compile", function($compile) {
		return {
			scope: {
				contents: "="
			},
			restrict: "A",
			link: function(scope, element, attr) {
				var w = scope.$watch("contents", function(newValue, oldValue, scope) {
					if (!newValue) {
						return
					}
					element.html(scope.contents);
					$compile(element.contents())(scope)
				});
				scope.$on("$destroy", function() {
					w()
				})
			}
		}
	}]).directive("paging", ["$compile", function($compile) {
		return {
			scope: {
				count: "=",
				max: "@",
				action: "="
			},
			restrict: "A",
			link: function(scope, element, attr) {
				scope.showNumbers = function() {
					scope.totleNo = parseInt(scope.count / scope.max);
					if ((scope.count % scope.max) > 0 || !scope.count || scope.count === 0) {
						scope.totleNo++
					}
					var numbers = [];
					if (scope.totleNo <= 5) {
						scope.showNo = scope.totleNo;
						for (var i = 0; i < scope.totleNo; i++) {
							numbers.push(i + 1)
						}
						return numbers
					} else {
						if ((scope.pageNo + 2) > scope.totleNo) {
							if (scope.pageNo === scope.totleNo) {
								return [scope.pageNo - 4, scope.pageNo - 3, scope.pageNo - 2, scope.pageNo - 1, scope.pageNo]
							} else {
								return [scope.pageNo - 3, scope.pageNo - 2, scope.pageNo - 1, scope.pageNo, scope.pageNo + 1]
							}
						}
						if ((scope.pageNo - 2) < 1) {
							if (scope.pageNo === 1) {
								return [scope.pageNo, scope.pageNo + 1, scope.pageNo + 2, scope.pageNo + 3, scope.pageNo + 4]
							} else {
								return [scope.pageNo - 1, scope.pageNo, scope.pageNo + 1, scope.pageNo + 2, scope.pageNo + 3]
							}
						}
						return [scope.pageNo - 2, scope.pageNo - 1, scope.pageNo, scope.pageNo + 1, scope.pageNo + 2]
					}
				};
				scope.pagePlus = function() {
					if (scope.pageNo === scope.totleNo) {
						return
					}
					scope.pageNo++;
					scope.genPaging();
					scope.action(scope.pageNo)
				};
				scope.pageSubt = function() {
					if (scope.pageNo === 1) {
						return
					}
					scope.pageNo--;
					scope.genPaging();
					scope.action(scope.pageNo)
				};
				scope.changePage = function(no) {
					if (no == scope.pageNo) {
						return
					}
					scope.pageNo = no;
					scope.genPaging();
					scope.action(scope.pageNo)
				};
				scope.genPaging = function() {
					tpl = "<div class='boma-paging'><span class='left' ng-click='pageSubt()'>　</span>";
					$.each(scope.showNumbers(), function(index, val) {
						tpl += "<span ng-click='changePage(" + val + ")' ng-class='{&quot;active&quot;: pageNo === " + val + "}'>" + val + "</span>"
					});
					tpl += "<span class='right' ng-click='pagePlus()'>　</span></div>";
					element.html(tpl);
					$compile(element.contents())(scope)
				};
				var w = scope.$watch("count", function(newValue, oldValue, scope) {
					if (angular.isUndefined(scope.count) || angular.isUndefined(scope.action)) {
						return
					}
					scope.pageNo = 1;
					scope.genPaging()
				});
				var w2 = scope.$watch("action", function(newValue, oldValue, scope) {
					if (angular.isUndefined(scope.count) || angular.isUndefined(scope.action)) {
						return
					}
					scope.pageNo = 1;
					scope.genPaging()
				});
				scope.$on("$destroy", function() {
					w();
					w2()
				})
			}
		}
	}]).directive("tableRender", ["$compile", function($compile) {
		return {
			scope: {
				dataset: "=",
				template: "@"
			},
			restrict: "A",
			link: function(scope, element, attr) {
				scope.$watch("template", function(newValue, oldValue, scope) {
					if (!scope.template) {
						return
					}
					var tpl = '<div ng-include="&quot;' + scope.template + '&quot;"></div>';
					element.html(tpl);
					$compile(element.contents())(scope)
				});
				scope.callback = function(fn, data) {
					if (angular.isFunction(eval("scope.$parent." + fn))) {
						eval("scope.$parent." + fn + "(data)")
					}
				}
			}
		}
	}]).directive("dictionary", ["$$common", "$timeout", "$rootScope", "$$base", function($$common, $timeout, $rootScope, $$base) {
		return {
			scope: {
				model: "=ngModel",
				name: "@",
				filter: "@"
			},
			require: ["ngModel"],
			replace: true,
			restrict: "AE",
			template: '<select class="boma-select"><option title="{{item.value}}" ng-repeat="item in dictionary" value="{{item.key}}">{{item.value}}</select>',
			link: function(scope, element, attr) {
				$$common.getDictionary(scope.name, function(result) {
					$.each(result.data, function(index, val) {
						val.key = String(val.key)
					});
					scope.dictionary = new Array();
					if (scope.filter && scope.filter === "all") {
						scope.dictionary.push({
							key: "",
							value: $$base.i18n("common-all")
						})
					}
					scope.dictionary = scope.dictionary.concat(result.data);
					$timeout(function() {
						scope.model = scope.model || scope.dictionary[0].key;
						scope.model = "" + scope.model;
						scope.$apply()
					})
				})
			}
		}
	}]).directive("converter", ["$$common", function($$common) {
		return {
			scope: {
				type: "@",
				key: "="
			},
			replace: true,
			restrict: "AE",
			template: '<span ng-bind="value"></span>',
			link: function(scope, element, attr) {
				$$common.getDicValue({
					type: scope.type,
					key: scope.key
				}, function(result) {
					scope.value = result.data.value
				})
			}
		}
	}]).directive("hrefPlus", ["$compile", "$timeout", function($compile, $timeout) {
		return {
			scope: {
				target: "@",
				url: "@"
			},
			restrict: "A",
			link: function(scope, element, attr) {
				element.bind("click", function(event) {
					if ($(".md-overlay-show").length > 0) {
						$(".md-overlay").click();
						$timeout(function() {
							if (scope.target === "_blank") {
								$tools.openWindow(scope.url)
							} else {
								window.location.href = scope.url
							}
						}, 300)
					} else {
						if (scope.target === "_blank") {
							$tools.openWindow(scope.url)
						} else {
							window.location.href = scope.url
						}
					}
				})
			}
		}
	}]).directive("datePicker", ["$filter", function($filter) {
		return {
			scope: {
				model: "=ngModel",
				format: "@",
				min: "@",
				max: "@"
			},
			require: ["ngModel"],
			restrict: "AE",
			link: function(scope, element, attr) {
				today = new Date();
				scope.format = scope.format || "Y-m-d";
				scope.min = scope.min || "2000-01-01";
				scope.max = scope.max || (today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate());
				var ele = angular.element(element);
				seajs.use("static/boma_v3/pulgin/datePicker/jquery.datetimepicker", function() {
					scope.model = $filter("date")(new Date(), "yyyy-MM-dd");
					ele.datetimepicker({
						lang: "ch",
						timepicker: false,
						format: scope.format,
						formatDate: scope.format,
						minDate: scope.min,
						maxDate: scope.max,
						onClose: function(a, b, c) {
							scope.model = $filter("date")(a, "yyyy-MM-dd")
						}
					});
					ele.next().bind("click", function(event) {
						ele.focus()
					})
				})
			}
		}
	}]).directive("progress", ["$timeout", "$compile", function($timeout, $compile) {
		return {
			scope: {
				rate: "=",
				opts: "="
			},
			restrict: "AE",
			link: function(scope, element, attr) {
				scope.opts = scope.opts || {
					display_text: "center",
					use_percentage: false
				};
				var w = scope.$watch("rate", function(newValue, oldValue, scope) {
					if (!newValue) {
						return
					}
					if (newValue < 60) {
						level = "progress-bar-danger"
					}
					if (newValue >= 60 && newValue < 80) {
						level = "progress-bar-warning"
					}
					if (newValue >= 80) {
						level = "progress-bar-success"
					}
					var id = "progress" + Math.ceil(Math.random() * 1000000);
					var tpl = '<div class="progress progress-striped active">    <div id="' + id + '" class="progress-bar ' + level + '" role="progressbar" data-transitiongoal="' + scope.rate + '"></div></div>';
					element.html(tpl);
					$compile(element.contents())(scope);
					$timeout(function() {
						$("#" + id).progressbar(scope.opts)
					})
				});
				scope.$on("$destroy", function() {
					w()
				})
			}
		}
	}]).directive("clearModel", ["$filter", function($filter) {
		return {
			scope: {
				model: "=ngModel",
			},
			require: ["ngModel"],
			restrict: "AE",
			replace: true,
			template: '<span class="clear-model" ng-show="model"></span>',
			link: function(scope, element, attr) {
				element.bind("click", function(event) {
					scope.model = "";
					scope.$apply()
				})
			}
		}
	}]).directive("silde", ["$compile", function($compile) {
		return {
			restrict: "A",
			link: function(scope, element, attr) {
				var show = true;
				element.bind("click", function() {
					if (show) {
						angular.element(element).parent().next().show();
						angular.element(element)["0"].className = "helpcentercloseme";
						angular.element(element).context.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;<span  style="cursor: pointer;text-decoration: underline;">隐藏</span>&nbsp;&nbsp;&nbsp;&nbsp;    '
					} else {
						angular.element(element)["0"].className = "helpcenteropenme";
						angular.element(element).context.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;<span  style="cursor: pointer;text-decoration: underline;">展开</span>&nbsp;&nbsp;&nbsp;&nbsp;    ';
						angular.element(element).parent().next().hide()
					}
					show = !show
				})
			}
		}
	}]).directive("anchor", ["$compile", function($compile) {
		return {
			scope: {
				href: "@"
			},
			restrict: "A",
			link: function(scope, element, attr) {
				var t = $(scope.href)[0].offsetTop;
				element.bind("click", function(event) {
					$("body,html").animate({
						scrollTop: t
					}, 500)
				})
			}
		}
	}]).directive("nullValue", ["$compile", function($compile) {
		return {
			scope: {
				model: "=ngModel",
				txt: "@"
			},
			restrict: "A",
			link: function(scope, element, attr) {
				element.focus(function() {
					if (scope.model === scope.txt) {
						scope.model = "";
						scope.$apply()
					}
				});
				element.blur(function() {
					if (scope.model === "") {
						scope.model = scope.txt;
						scope.$apply()
					}
				})
			}
		}
	}]).directive("serviceTrigger", ["$rootScope", "$$dic", function($rootScope, $$dic) {
		return {
			restrict: "A",
			link: function(scope, element, attr) {
				element.bind("click", function(event) {
					if ($rootScope.kingBall) {
						window.callKingBallService();
						return
					}
					$tools.openWindow($$dic.contact("service_online"));
					return false
				})
			}
		}
	}]).directive("inputLimit", function() {
		return {
			restrict: "A",
			scope: {
				model: "=ngModel",
				pattern: "@re"
			},
			link: function(scope, element, attr) {
				if (scope.pattern) {
					scope.re = new RegExp(scope.pattern.substring(1, scope.pattern.length - 1))
				}
				scope.$watch("model", function(newValue, oldValue, scope) {
					if (!scope.model || !scope.pattern) {
						return
					}
					if (!scope.re.test(scope.model)) {
						scope.model = oldValue
					}
				})
			}
		}
	}).directive("lazy", ["$$res", function($$res) {
		return {
			scope: {
				src: "@isrc"
			},
			restrict: "A",
			link: function(scope, element, attr) {
				scope.sourceSrc = "";
				scope.genSrc = function(src) {
					var path = src.substr(src.indexOf("images") + 6);
					var md5 = $$res.md5(path);
					scope.sourceSrc = src;
					if (md5) {
						scope.sourceSrc += "?v=" + md5
					}
					$(element).first().attr("src", scope.sourceSrc)
				};
				var w = scope.$watch(function() {
					return attr.isrc
				}, function(newValue, oldValue, scope) {
					if (!newValue) {
						return
					}
					scope.genSrc(newValue)
				});
				scope.$on("$destroy", function() {
					w()
				})
			}
		}
	}]).directive("password", function() {
		return {
			restrict: "A",
			link: function(scope, element, attr) {
				$(element).focus(function(event) {
					$(this).attr("type", "password")
				})
			}
		}
	})
})();
(function() {
	angular.module("casino.directive", []).directive("carousellit", ["$compile", "$timeout", function(b, a) {
		return {
			restrict: "AE",
			scope: {
				pf: "=",
				data: "="
			},
			link: function(g, f, d) {
				var e = '<div class="games" id="carouse_' + g.pf + '">    <ul>        <li class="slides am-text-center" ng-repeat="i in data track by $index" ng-mouseenter="inGameArea(i)" on-finish-render >            <img style="width:130px;height:88px;" lazy isrc="{{$root.workspace}}static/boma_v3/skin/v3_normal/images/common/casino/' + g.pf + '/{{$index + 1}}.png" />            <div class="slides-title"><span ng-bind="i[$root.lang]"></span></div>            <div class="rule"><a class="boma-color-white" href="{{i.rule}}" target="_blank" class="boma-btn-white-xs"><span ng-bind="&quot;common-rule&quot; | i18n"></span></a></div>        </li>    </ul>   <button class="left-circle" id="l-' + g.pf + '"></button>   <button class="right-circle" id="r-' + g.pf + '"></button></div>';
				f.html(e);
				b(f.contents())(g);
				g.bindEvent = function() {
					var j = angular.element(f);
					j.find("li.slides").bind("mouseenter", function(k) {
						$(".casino-games").find("li.slides div.rule").hide();
						$(this).find("div.rule").show()
					});
					j.find("div.rule").bind("mouseleave", function(k) {
						$(".casino-games").find("li.slides div.rule").hide()
					})
				};
				g.$on("onFinishRender", function() {
					$("#carouse_" + g.pf).show().jCarouselLite({
						btnNext: "#r-" + g.pf,
						btnPrev: "#l-" + g.pf,
						visible: 4
					});
					g.bindEvent()
				})
			}
		}
	}])
})();
(function() {
	angular.module("framework.directive", []).directive("bannerMaker", ["$compile", "$rootScope", "$timeout", "$$common", "$rootScope", function(d, a, b, e, a) {
		return {
			restrict: "AE",
			link: function(j, g, f) {
				j.makeFilx = function() {
					tpl = '<div class="flexslider" id="bannerFilex">   <ul class="slides">       <li class="pointer" href-plus url="{{item.url}}" ng-repeat="item in $root.banners" style="background:url({{$root.workspace}}{{item.path}}) 50% 0% no-repeat black"></li>   </ul></div>';
					g.html(tpl);
					d(g.contents())(j);
					b(function() {
						
						seajs.use("static/boma_v3/pulgin/flexslider/jquery.flexslider-min", function() {
							$("#bannerFilex").flexslider({
								slideshowSpeed: 5000,
								animationSpeed: 1000,
								directionNav: true,
								pauseOnAction: false,
								pauseOnHover: true
							})
						})
					})
				};
				j.makeBanner = function() {
					var k;
					if (a.page.code === "home" || a.page.code === "spread") {
						if (!a.banners) {
							e.getBanners(function(l) {
								a.banners = l.data;
								j.makeFilx()
							})
						}
						j.makeFilx();
						return
					}
					angular.element(g).css("background", "url(" + a.workspace + "static/boma_v3/skin/v3_normal/images/" + a.lang + "/banners/" + a.page.code + ".jpg) no-repeat center top black")
				}()
			}
		}
	}])
})();
(function() {
	angular.module("promotion.directive", []).directive("deadline", ["$interval", function(a) {
		return {
			scope: {
				time: "="
			},
			template: '<span ng-bind="&quot;common-deadline&quot; | i18n"></span><span class="time" ng-bind="dd"></span>天<span class="time" ng-bind="hh"></span>时<span class="time" ng-bind="mm"></span>分<span class="time" ng-bind="ss"></span>',
			restrict: "A",
			link: function(f, d, b) {
				f.i = angular.copy(f.time);
				f.genCountdown = function() {
					var g = parseInt(f.i / (3600 * 24));
					var k = parseInt((f.i - g * 3600 * 24) / 3600);
					var l = parseInt(((f.i - g * 3600 * 24) - k * 3600) / 60);
					var j = f.i - g * 3600 * 24 - k * 3600 - l * 60;
					if (k < 10) {
						k = "0" + k
					}
					if (l < 10) {
						l = "0" + l
					}
					if (j < 10) {
						j = "0" + j
					}
					f.dd = g;
					f.hh = k;
					f.mm = l;
					f.ss = j
				};
				f.genCountdown();
				var e = a(function() {
					f.i--;
					if (f.i === 0) {
						a.cancel(e)
					}
					f.genCountdown()
				}, 1000);
				f.$on("$destroy", function() {
					a.cancel(e)
				})
			}
		}
	}]).directive("hotstar", ["$compile", function(a) {
		return {
			scope: {
				rate: "="
			},
			restrict: "A",
			link: function(f, e, b) {
				var d = f.$watch("rate", function(m, j, l) {
					if (!m) {
						return
					}
					var g = "<div class='am-fl star-block'>";
					for (var k = 0; k < l.rate; k++) {
						g += "<span class='hotstar'></span>"
					}
					g += "</div>";
					e.html(g);
					a(e.contents())(l)
				});
				f.$on("$destroy", function() {
					d()
				})
			}
		}
	}])
})();
(function() {
	angular.module("slot.directive", []).directive("totlePrize", ["$compile", function(a) {
		return {
			restrict: "AE",
			scope: {
				number: "="
			},
			link: function(f, e, b) {
				var d = f.$watch("number", function(j) {
					if (!j) {
						return
					}
					var g = "";
					var k = "" + parseInt(j);
					for (i = 0; i < k.length; i++) {
						g += "<span class='slot-totle-priz'>" + k[i] + "</span>"
					}
					e.html(g)
				});
				f.$on("$destroy", function() {
					d()
				})
			}
		}
	}])
})();
(function() {
	angular.module("base.filter", []).filter("dic", ["$$dic", "$log", "$$base", function($$dic, $log, $$base) {
		return function(key, type) {
			if ($$base.isKingBall()) {
				if (eval('$$dic.kingBall("' + key + '")')) {
					return eval('$$dic.kingBall("' + key + '")')
				}
			}
			if (!angular.isFunction(eval("$$dic." + type))) {
				$log.error("####未找到该字典类型:" + type + "####");
				return ""
			}
			return eval("$$dic." + type + '("' + key + '")')
		}
	}]).filter("unique", function() {
		return function(items, filterOn) {
			if (filterOn === false) {
				return items
			}
			if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
				var hashCheck = {},
					newItems = [];
				var extractValueToCompare = function(item) {
						if (angular.isObject(item) && angular.isString(filterOn)) {
							return item[filterOn]
						} else {
							return item
						}
					};
				angular.forEach(items, function(item) {
					var valueToCheck, isDuplicate = false;
					for (var i = 0; i < newItems.length; i++) {
						if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
							isDuplicate = true;
							break
						}
					}
					if (!isDuplicate) {
						newItems.push(item)
					}
				});
				items = newItems
			}
			return items
		}
	}).filter("gamerule", function() {
		return function(item) {
			return item + "娱乐城"
		}
	})
})();


(function() {
	angular.module("casino", []).controller("__casino", ["$scope", "$rootScope", "$$modal", "$$dic", "$timeout", "$stateParams", "$$base", "$$user", "$$game", function(n, k, f, g, e, m, o, d, j) {
		k.page.code = "casino";
		var b = n.$watch("$stateParams.pf", function(r, p, q) {
			if (!n.initPf) {
				n.initPf = true;
				return
			}
			n.init()
		});
		n.enterPf = function(p) {
			window.location.href = "#/casino/" + angular.lowercase(p.name);
			return false
		};
		n.init = function() {
			k.miniMenu = undefined;
			n.showGameHall = undefined;
			k.preventRefreshBG = false;
			if (g.conf("casino_pfs").indexOf(m.pf) > -1) {
				if (!d.loginCheck("#/casino", n)) {
					return false
				}
				j.enterCasinoPF(n, m.pf);
				if (angular.uppercase(m.pf) === "BBIN") {
					window.location.href = "#/casino";
					return false
				}
				return
			} else {
				n.casinos = g.conf("casino-pfs");
				window.location.href = "#/casino";
				return false
			}
		};
		var l = n.$watch("$root.user", function(r, p, q) {
			if (!r) {
				n.init()
			}
		});
		n.init();
		if (!n.showGameHall) {
			var a = o.switchBG("casino")
		}
		n.$on("$destroy", function() {
			k.miniMenu = undefined;
			k.preventRefreshBG = undefined;
			l();
			b();
			e.cancel(a);
			k.bg = "casino"
		})
	}])
})();
(function() {
	angular.module("client", []).controller("__client", ["$scope", "$rootScope", "$$base", "$$modal", "$$user", "$timeout", function(d, b, a, g, f, e) {
		b.page.code = "client";
		d.copy = function(k) {
			g.tips(a.i18n("client-copy-" + k))
		};
		d.modifyPTPwd = function() {
			f.modifyPTPwd()
		};
		d.pcDownload = function() {
			g.alert(null, "网站改版，新版客户端敬请期待…", "info")
		};
		var j = a.switchBG("client");
		d.$on("$destroy", function() {
			e.cancel(j);
			b.bg = "client"
		})
	}])
})();
(function() {
	angular.module("domain", []).controller("__domain", ["$scope", "$rootScope", "$stateParams", "$location", "$$request", "$$modal", "$$base", function(e, b, f, j, d, g, a) {
		b.page.code = "domain";
		b.bg = undefined;
		e.random = Math.random();
		e._r = {
			url: a.i18n("modal-enter-url"),
			checkcode: a.i18n("modal-enter-checkcode")
		};
		e.changecode = function() {
			e.random = Math.random()
		};
		e.checkUrl = function() {
			var l = {
				url: e._r.url.trim(),
				checkcode: e._r.checkcode.trim()
			};
			if (!l.url || l.url == a.i18n("modal-enter-url")) {
				g.alert(null, a.i18n("modal-url-none"), "error");
				return
			}
			if (!l.checkcode || l.checkcode == a.i18n("modal-enter-checkcode")) {
				g.alert(null, a.i18n("modal-checkcode-none"), "error");
				return
			}
			var k = d.packageReq("check-url", null, l, "POST", true, false);
			d.action(k, function(m) {
				e.random = Math.random();
				if (m.data.istrue == 3) {
					g.alert(null, a.i18n("modal-checkcode-wrong"), "error");
					return
				}
				if (m.data.istrue == 2) {
					g.alert(null, a.i18n("modal-url-wrong"), "error");
					return
				}
				g.alert(null, a.i18n("modal-url-right"), "success")
			})
		}
	}])
})();
(function() {
	angular.module("framework", []).controller("__framework", ["$scope", "$cookies", "$rootScope", "$$base", "$interval", "$$common", "$$modal", "$timeout", "$$request", "$$user", "$$dic", function(m, f, l, n, j, k, e, b, g, a, d) {
		l.page = {};
		m._login = {};
		m._register = {};
		m._feedback = {};
		
		m.$watch("$root.triggers.login.bullet", function(p, o) {
			if (!p) {
				return
			}
			m.showLogin(l.triggers.login.fn)
		});
		m.$watch("$root.triggers.register", function(p, o) {
			if (!p) {
				return
			}
			m.showRegister()
		});
		m.findPassword = function() {
			e.popupClose();
			b(function() {
				e.popup(m, "findPwd");
				m.$broadcast("clear")
			}, 300)
		};
		m.feedback = function() {
			var o = g.packageReq("feedback", null, m._feedback, "POST", true, false);
			g.action(o, function(p) {
				e.alert(null, n.i18n("feedback-success-c"), "success", null, function() {
					m._feedback = {};
					e.popupClose()
				})
			})
		};
		m.goregister = function() {
			e.popupClose();
			b(function() {
				m.showRegister()
			}, 300)
		};
		m.showRegister = function() {
			if (l.user) {
				e.tips(n.i18n("common-reged"), "info");
				return
			}
			m._register = {};
			m.agent_code_readonly = false;
			if (f.get("agent_code")) {
				m._register.spreadCode = f.get("agent_code");
				m.agent_code_readonly = true
			}
			e.popup(m, "register")
		};
		m.gologin = function() {
			e.popupClose();
			b(function() {
				m.showLogin()
			}, 300)
		};
		m.showLogin = function(o) {
			m.callbackWhenLogin = undefined;
			m._login = {};
			m.errorTimes = f.get("error-times") || 0;
			if (f.get("account")) {
				m._login.username = f.get("account");
				m._login.remember = 1
			}
			e.popup(m, "login");
			if (angular.isFunction(o)) {
				m.callbackWhenLogin = o
			}
		};
		m.refreshCheckCode = function(o) {
			l.checkcode_ran = Math.ceil(Math.random() * 100000000)
		};
		m.login = function(p) {
			var o = g.packageReq("login", null, m._login, "POST", true, true);
			o.data.password = $.md5(o.data.password);
			g.action(o, function(q) {
				if (q.status < 0) {
					e.alert(null, q.msg, "error");
					var r = new Date();
					r.setDate(r.getDate() + 365);
					f.put("error-times", ++m.errorTimes, {
						expires: r
					});
					if (m.errorTimes >= 3 || q.status === -1031) {
						m.refreshCheckCode();
						if (m.errorTimes < 3) {
							m.errorTimes = 3
						}
					}
					return
				}
				c = q.data;
				c.username = o.data.username;
				c.remember = m._login.remember;
				a.setUserContext(c);
				e.popupClose();
				m.getPromotionImage();
				if (angular.isFunction(m.callbackWhenLogin)) {
					m.callbackWhenLogin()
				}
			})
		};
		m.register = function() {
			var o = g.packageReq("register", null, m._register, "POST", true, true, false, true);
			g.action(o, function(p) {
				if (p.status < 0) {
					e.alert(null, p.msg, "error");
					m.refreshCheckCode();
					return
				}
				e.alert(n.i18n("register-success-t"), n.i18n("register-success-c") + d.conf("preaccount") + m._register.username, "success", null, function() {
					e.popupClose();
					m._login.username = d.conf("preaccount") + angular.copy(m._register.username);
					m._login.password = angular.copy(m._register.password);
					b(function() {
						m.login();
						m.$apply()
					}, 300);
					m._register = {}
				})
			})
		};
		m.getPromotionImage = function() {
			k.getActivityWindow(function(o) {
				if (o.data.window_image) {
					l._promotion.url = o.data.window_image;
					l._promotion.id = o.data.id;
					e.popup(m, "promotion-lite")
				}
			})
		};
		m.$watch("[$root.page.code, $root.translateState]", function(o) {
			if (!l.page || !l.translateState) {
				return
			}
			document.title = n.i18n("pageTitle-" + l.page.code) + " - " + n.i18n("appName")
		}, true);
		m.switchBg = function(o) {
			l.bg = o || "default";
			return "bg-" + l.bg
		};
		m.$watch("$root.user", function(q, o, p) {
			if (!q || !window.localStorage) {
				return
			}
			window.localStorage.setItem("user", angular.toJson(q))
		}, true);
		k.getToken(function(o) {
			l.token = o.data.token
		});
		j(function() {
			k.getToken(function(o) {
				l.token = o.data.token
			})
		}, 540000)
	}]).controller("__header", ["$scope", "$rootScope", "$$base", "$$modal", "$$request", "$state", "$cookies", "$$user", "$timeout", "$$game", "$$dic", "$$common", function(n, m, o, f, j, a, g, d, b, l, e, k) {
		n.goPage = function(p) {
			if (p.herf === "#") {
				return
			}
			a.go(p.herf)
		};
		n.$watch("$root.user", function(q, p) {
			if (!q) {
				n.menus = e.conf("menu-logout");
				return false
			}
			n.menus = e.conf("menu-login");
			m.sessionId = m.user.sessionId;
			k.getToken(function(r) {
				m.token = r.data.token;
				d.getUserBalance(function(s) {
					if (!m.user) {
						return
					}
					m.user.balance = s.data;
					var t = Number(m.user.balance.centreBalance);
					$.each(m.user.balance.platform, function(u, v) {
						t += Number(v.balance)
					});
					m.user.balance.totleBalance = t
				});
				d.getUserInfo(function(s) {
					if (!m.user) {
						return
					}
					m.user.info = s.data
				});
				d.getUserSafety(function(s) {
					if (!m.user) {
						return
					}
					m.user.safety = s.data
				})
			})
		});
		n.showAnnouncement = function() {
			if (!m.page || !m.page.code) {
				return false
			}
			list = e.conf("hide-announcement");
			if (list.indexOf(m.page.code) > -1) {
				return false
			}
			if (m.user && m.page.code === "home") {
				return false
			}
			return true
		};
		n.logout = function() {
			d.logout()
		};
		n.toggleBalance = function() {
			m.conf.showBalance = !m.conf.showBalance
		};
		n.triggerDropGame = function(q, p) {
			if (!m.user) {
				return
			}
			if (p === 2) {
				b.cancel(n.dropGamePromise);
				return
			}
			if (p === 1) {
				if (n.dg) {
					b.cancel(n.dropGamePromise)
				}
				n.dg = q.lable
			}
			if (p === 0) {
				n.dropGamePromise = b(function() {
					n.dg = undefined
				}, 100)
			}
		}
	}]).controller("__footer", ["$scope", "$rootScope", "$$base", function(d, b, a) {}]).controller("__banners", ["$scope", "$rootScope", function(b, a) {}])
})();

//帮助中心控制器
(function() {
	angular.module("help", []).controller("__help", ["$scope", "$rootScope", "$stateParams", "$location", function(d, b, e, f) {
		b.page.code = "help";
		d.init = function(g) {
			d._cururl = "/#" + f.url();
			d.menu = [{
				"zh-cn": "常见问题",
				url: "#/help/often"
			}, {
				"zh-cn": "条款与规则",
				url: "#/help/rules"
			}, {
				"zh-cn": "隐私政策",
				url: "#/help/privacy"
			}, {
				"zh-cn": "博彩责任",
				url: "#/help/duty"
			}];
			d.htmlname = "help/" + lang + "/" + e.type + ".html"
		};
		d.jump = function(g) {
			window.location.href = g
		};
		var a = d.$watch("$stateParams.type", function(g) {
			if (!d.init) {
				d.init = true;
				return
			}
			d.init(g)
		});
		d.$on("$destroy", function() {
			a()
		})
	}])
})();
(function() {
	angular.module("home", []).controller("__home", ["$scope", "$rootScope", "$$base", "$$game", "$$dic", "$$user", "$$common", "$$modal", "$interval", "$timeout", "$cookies", function(o, m, p, l, f, b, k, e, j, a, d) {
		m.page.code = "home";
		m.bg = undefined;
		o.pfs = f.conf("game-pfs");
		o.enterGameHall = function(q) {
			l.enterGameHall(q)
		};
		o.inGameHall = function(q) {
			o._hall = q
		};
		o.outGameHall = function() {
			o._hall = undefined
		};
		o.refreshBalance = function() {
			b.getUserBalance(function(q) {
				if (!m.user) {
					return
				}
				m.user.balance = q.data;
				var r = Number(m.user.balance.centreBalance);
				$.each(m.user.balance.platform, function(s, t) {
					r += Number(t.balance)
				});
				m.user.balance.totleBalance = r
			})
		};
		o.inGameArea = function(r, q) {
			if (q === 1) {
				o.showPlayGame_hot = r.game_name
			}
			if (q === 2) {
				o.showPlayGame_collected = r.game_name
			}
		};
		o.outGameArea = function() {
			o.showPlayGame_hot = undefined;
			o.showPlayGame_collected = undefined
		};
		o.changeHotGame = function() {
			m.hotGames = undefined;
			l.getHotGame(function(q) {
				m.hotGames = q.data
			})
		};
		o.playSlot = function(s) {
			var q = null;
			switch (s.platform) {
			case "mggames":
				q = "mg";
				break;
			case "ptgames":
				q = "pt";
				break
			}
			var r = f.conf("play_slot_" + q) + s.game_name;
			$tools.openWindow(r)
		};
		var n = o.$watch("$root.user", function(s, q, r) {
			if (!s) {
				return
			}
			l.getHotGame(function(t) {
				m.hotGames = t.data
			});
			l.getCollectedGame(function(t) {
				if (!m.user) {
					return
				}
				m.user.collectedGames = t.data
			})
		});
		var g = j(function() {
			if ($("#modal-promotion-lite").length > 0) {
				if (!m._promotion) {
					m._promotion = {}
				}
				j.cancel(g)
			}
		}, 50);
		o.$on("$destroy", function() {
			n();
			j.cancel(g)
		})
	}])
})();
(function() {
	angular.module("lottery", []).controller("__lottery", ["$scope", "$rootScope", "$$dic", "$timeout", "$stateParams", "$$user", "$sce", "$$base", function(m, j, f, e, l, d, g, n) {
		j.page.code = "lottery";
		var b = m.$watch("$stateParams.pf", function(q, o, p) {
			if (!m.initPf) {
				m.initPf = true;
				return
			}
			m.init()
		});
		m.enterPf = function(o) {
			window.location.href = "#/lottery/" + angular.lowercase(o);
			return false
		};
		m.init = function() {
			j.miniMenu = undefined;
			m.showGameHall = undefined;
			if (f.conf("lottery_pfs").indexOf(l.pf) > -1) {
				if (!d.loginCheck("#/lottery/", m)) {
					return false
				}
				m.gameUrl = f.conf("play_lottery_" + l.pf);
				if (angular.lowercase(l.pf) === "bbin") {
					$tools.openWindow(m.gameUrl);
					window.location.href = "#/lottery/";
					return false
				}
				if (angular.lowercase(l.pf) === "wbg") {
					if ($tools.getUrlParam("in") == 1) {
						m.showGameHall = true;
						e(function() {
							m.gameUrl = g.trustAsResourceUrl(m.gameUrl);
							j.bg = "lottery-if";
							j.miniMenu = true
						})
					} else {
						$tools.openWindow("#/lottery/wbg?in=1");
						window.location.href = "#/lottery/"
					}
				}
			} else {
				if (l.pf && l.pf.length > 0) {
					window.location.href = "#/lottery/"
				}
			}
		};
		var k = m.$watch("$root.user", function(q, o, p) {
			if (!q) {
				m.init()
			}
		});
		m.init();
		if (!m.showGameHall) {
			var a = n.switchBG("lottery")
		}
		m.$on("$destroy", function() {
			j.miniMenu = undefined;
			j.preventRefreshBG = undefined;
			k();
			b();
			e.cancel(a);
			j.bg = "lottery"
		})
	}])
})();
(function() {
	angular.module("my", []).controller("__my", ["$scope", "$rootScope", "$$base", "$state", "$$dic", "$$modal", "$$user", "$timeout", function(l, j, m, a, g, f, d, e) {
		j.page.code = "my";
		l.navId = 10;
		l.$on("refreshBalance", function(n) {
			l.refreshInfo();
			n.stopPropagation()
		});
		l.$on("switchNav", function(n, o) {
			l.navId = o;
			n.stopPropagation()
		});
		l.hrefPage = function(n) {
			l.navId = n.navId;
			window.location.href = n.href
		};
		l.refreshInfo = function() {
			if (!j.user) {
				return
			}
			d.getUserBalance(function(n) {
				j.user.balance = n.data;
				var o = Number(j.user.balance.centreBalance);
				$.each(j.user.balance.platform, function(p, q) {
					o += Number(q.balance)
				});
				j.user.balance.totleBalance = o
			})
		};
		var b = m.switchBG("my");
		var k = l.$watch("$root.user", function(p, n, o) {
			if (!p) {
				a.go("index")
			}
		});
		l.navs = g.conf("my-navs");
		l.$on("$destroy", function() {
			k();
			e.cancel(b)
		})
	}]).controller("__my.index", ["$scope", "$rootScope", "$$base", "$state", "$$dic", "$$my", "$$user", "$$modal", function(d, b, a, e, f, k, j, g) {
		d.tabs = f.conf("my-tabs");
		d.query = {
			pageNo: 1,
			sum: 0
		};
		d._tab = d.tabs[0];
		d.onekeyBack = function() {
			g.loading();
			j.getUserBalance(function(l) {
				g.loading();
				if (!b.user) {
					return
				}
				b.user.balance = l.data;
				var m = Number(b.user.balance.centreBalance);
				$.each(b.user.balance.platform, function(n, o) {
					m += Number(o.balance)
				});
				b.user.balance.totleBalance = m;
				g.confirm(null, a.i18n("my-onekey-confirm-1") + b.user.balance.pfBalance + a.i18n("my-onekey-confirm-2"), null, function() {
					k.onekeyBack(function(n) {
						var o = "";
						b.user.balance.centreBalance = n.data.centreBalance;
						b.user.balance.lockedBalance = n.data.lockedBalance;
						if (angular.isArray(n.data.success) && n.data.success.length > 0) {
							o += a.i18n("my-onekey-result-1");
							$.each(n.data.success, function(p, q) {
								$.each(b.user.balance.platform, function(r, s) {
									if (angular.uppercase(s.pf) == q.platform) {
										s.balance = q.balance;
										o += s.name + "：" + q.amount + "\n"
									}
								})
							})
						}
						if (angular.isArray(n.data.fail) && n.data.fail.length > 0) {
							o += a.i18n("my-onekey-result-2");
							$.each(n.data.fail, function(p, q) {
								$.each(b.user.balance.platform, function(r, s) {
									if (angular.uppercase(s.pf) == q.platform) {
										s.balance = q.balance;
										o += s.name + "：" + q.amount + "\n"
									}
								})
							})
						}
						g.alert(a.i18n("my-onekey-result-title"), o, "success")
					})
				})
			})
		};
		d.showMore = function() {
			window.location.href = "#/my/history/" + d._tab.code;
			return false
		};
		d.switchTab = function(l) {
			if (l === d._tab) {
				return
			}
			d.query = {
				pageNo: 1,
				sum: 0
			};
			d._tab = l;
			d.getTableDatas(l)
		};
		d.getTableDatas = function(l) {
			k.getSearchDatas(l.code, d.query, function(m) {
				d._display = m
			})
		};
		d.goTransfer = function(l) {
			b._transfersTo = l.pf;
			e.go("my.transfers")
		};
		k.setSubTitle(10, d);
		d.getTableDatas(d.tabs[0])
	}]).controller("__my.recharge", ["$scope", "$rootScope", "$$my", "$$modal", "$$base", function(e, b, g, f, a) {
		e.getPayments = function() {
			g.getRechargePayment(function(j) {
				e._payments = j.data;
				e.switchOnlinePayment(e._payments.online[0])
			})
		};
		e.switchOnlinePayment = function(j) {
			e._onlinebanks = j;
			e._recharge.online.pay_type = j.id;
			e._recharge.online.bank_code = j.banks[0].code
		};
		e.switchOnlineBank = function(j) {
			e._recharge.online.bank_code = j.code
		};
		e.switchTransBank = function(j) {
			if (e._active.step === 2) {
				return
			}
			e._bankTrans = j;
			e._recharge.bank.bank_code = j.code;
			e._recharge.bank.card_no = j.accountNo
		};
		e.switchPayment = function(j) {
			e._pType = j;
			if (e._pType === "online") {
				e.switchOnlinePayment(e._payments.online[0])
			}
			if (e._pType === "bank") {
				e.switchTransBank(e._payments.transfer[0])
			}
		};
		e.onlinePay_s1 = function() {
			e._recharge.online.platform = e._recharge.pf;
			if (e._recharge.online.amount.indexOf(".") === (e._recharge.online.amount.length - 1)) {
				e._recharge.online.amount = parseInt(e._recharge.online.amount)
			}
			g.onlinePay_s1(e._recharge.online, function(j) {
				f.confirm(null, a.i18n("recharge-online_s1") + j.data.order + "\n" + a.i18n("recharge-money") + e._recharge.online.amount + "RMB", a.i18n("recharge-confirm-pay"), function() {
					$tools.openWindow(j.data.url)
				}, a.i18n("common-close"), null, false, true)
			})
		};
		e.transPay = function() {
			e._recharge.bank.platform = e._recharge.pf;
			if (e._recharge.bank.amount.indexOf(".") === (e._recharge.bank.amount.length - 1)) {
				e._recharge.bank.amount = parseInt(e._recharge.bank.amount)
			}
			g.transPay(e._recharge.bank, function(j) {
				e._active.step = 2;
				e._active.code = j.data.msg;
				e._active.bank_url = j.data.bank_url
			})
		};
		e.aliPay = function() {
			e._recharge.alipay.platform = e._recharge.pf;
			if (e._recharge.alipay.amount.indexOf(".") === (e._recharge.alipay.amount.length - 1)) {
				e._recharge.alipay.amount = parseInt(e._recharge.alipay.amount)
			}
			g.aliPay(e._recharge.alipay, function(j) {
				e._wxInfo = j.data;
				e._alipayDetail = true;
				e._alipayType = "a1"
			})
		};
		e.switchAlipayType = function(j) {
			e._alipayType = j
		};
		e.copy = function() {
			f.tips("复制附言成功")
		};
		e.title = g.setSubTitle(11, e);
		e._recharge = {
			online: {},
			bank: {},
			alipay: {}
		};
		e._payments = {};
		e._pType = "online";
		e._active = {
			step: 1
		};
		var d = e.$watch("$root.user.safety", function(j) {
			if (!j || angular.isUndefined(j.is_realname)) {
				return
			}
			e.getPayments()
		});
		e.$on("$destroy", function() {
			d()
		})
	}]).controller("__my.withdraw", ["$scope", "$rootScope", "$$my", "$$modal", "$$base", function(e, b, g, f, a) {
		e.showRule = function() {
			f.popup(e, "withdraw")
		};
		e.withdraw = function() {
			g.withdraw(e._withdraw, function(k) {
				e.getBindBankCard();
				f.alert(null, k.msg, "success", null, null);
				var j = e._withdraw.bank_code;
				e._withdraw = {};
				e._withdraw.bank_code = j;
				e.$emit("refreshBalance")
			})
		};
		e.getLimit = function() {
			g.getLimit(function(j) {
				e._limit = j.data
			})
		};
		e.getBindBankCard = function() {
			g.getBindBankCard(function(j) {
				e.bindCards = j.data;
				e.setBindCard(e.bindCards[0])
			})
		};
		e.delBindBankCard = function(j) {
			var k = [];
			$.each(e.bindCards, function(l, m) {
				if (m.id !== j.id) {
					k.push(m)
				}
			});
			e.bindCards = k;
			g.delBindBankCard({
				id: j.id
			}, function(l) {
				f.tips(a.i18n("withdraw-del-card") + j.card_no.substr(j.card_no.length - 4), "success")
			})
		};
		e.setBindCard = function(j) {
			j = j || null;
			if (j) {
				e._withdraw.bank_code = j.bank_code;
				e._withdraw.bank_address = j.bank_address;
				e._withdraw.branch_name = j.branch_name;
				e._withdraw.card_no = j.card_no
			} else {
				e._withdraw.bank_address = "";
				e._withdraw.branch_name = "";
				e._withdraw.card_no = ""
			}
			e._b = j
		};
		e.title = g.setSubTitle(12, e);
		var d = e.$watch("$root.user.safety", function(j) {
			if (!j || angular.isUndefined(j.is_realname)) {
				return
			}
			if (j.is_realname === -1 || j.is_fund_password === -1) {
				f.alert(null, a.i18n("my-risk"), "info", null, function() {
					window.location.href = "#/my/safety";
					return false
				});
				return
			}
			e.getLimit()
		});
		e.getBindBankCard();
		e.$on("$destroy", function() {
			d()
		})
	}]).controller("__my.transfers", ["$scope", "$rootScope", "$$my", "$$modal", "$$base", function(e, b, g, f, a) {
		e.selectPf = function(j) {
			if (e._transfers.trans_from == "CENTER" && e._transfers.trans_to == "CENTER") {
				if (j === "from") {
					e._transfers.trans_to = "GD";
					return
				}
				e._transfers.trans_from = "GD";
				return
			}
			if (e._transfers.trans_from != "CENTER" && e._transfers.trans_to != "CENTER") {
				if (j === "from") {
					e._transfers.trans_to = "CENTER";
					return
				}
				e._transfers.trans_from = "CENTER"
			}
		};
		e.transfers = function() {
			if (e._transfers.trans_amount.indexOf(".") === (e._transfers.trans_amount.length - 1)) {
				e._transfers.trans_amount = parseInt(e._transfers.trans_amount)
			}
			g.transfers(e._transfers, function(j) {
				f.alert(null, a.i18n("transfers-scuess"), "success");
				e._transfers.trans_amount = "";
				e._transfers.fund_password = "";
				e.$emit("refreshBalance")
			})
		};
		e.changePf = function() {
			var k = angular.copy(e._transfers.trans_from);
			var j = angular.copy(e._transfers.trans_to);
			e._transfers.trans_from = j;
			e._transfers.trans_to = k
		};
		e.title = g.setSubTitle(13, e);
		e._transfers = {};
		e._transfers.trans_to = b._transfersTo || "GD";
		b._transfersTo = undefined;
		var d = e.$watch("$root.user.safety", function(j) {
			if (!j || angular.isUndefined(j.is_realname)) {
				return
			}
		});
		e.$on("$destroy", function() {
			d()
		})
	}]).controller("__my.history", ["$scope", "$rootScope", "$$my", "$$dic", "$filter", "$$base", function(e, b, j, f, g, a) {
		e.switchTab = function(k) {
			window.location.href = "#/my/history/" + k.code
		};
		e.search_bonus = function(k) {
			e._bonusQ.pageNo = k || 1;
			j.getSearchDatas("bonus", e._bonusQ, function(l) {
				l.fn = e.search_bonus;
				e._totalcontent = a.i18n("his-total-bonus") + "<label>" + g("currency")(l.total, "", 2) + "</label>";
				e._display = l
			})
		};
		e.search_transfers = function(k) {
			e._transfersQ.pageNo = k || 1;
			j.getSearchDatas("transfers", e._transfersQ, function(l) {
				l.fn = e.search_transfers;
				e._totalcontent = a.i18n("his-total-trans") + "<label>" + g("currency")(l.total, "", 2) + "</label>";
				e._display = l
			})
		};
		e.search_withdraw = function(k) {
			e._withdrawQ.pageNo = k || 1;
			j.getSearchDatas("withdraw", e._withdrawQ, function(l) {
				l.fn = e.search_withdraw;
				e._totalcontent = a.i18n("his-total-draw") + "<label>" + g("currency")(l.total, "", 2) + "</label>";
				e._display = l
			})
		};
		e.search_recharge = function(k) {
			e._rechargeQ.pageNo = k || 1;
			j.getSearchDatas("recharge", e._rechargeQ, function(l) {
				l.fn = e.search_recharge;
				e._totalcontent = a.i18n("his-total-chrage") + "<label>" + g("currency")(l.total, "", 2) + "</label>";
				e._display = l
			})
		};
		e.search_betting = function(k) {
			e._bettingQ.pageNo = k || 1;
			j.getSearchDatas("betting", e._bettingQ, function(l) {
				l.fn = e.search_betting;
				e._totalcontent = a.i18n("his-total-bet1") + "<label>" + g("currency")(l.total_bet, "", 2) + "</label>　　";
				e._totalcontent += a.i18n("his-total-bet2") + "<label>" + g("currency")(l.total_winloss, "", 2) + "</label>";
				e._display = l
			})
		};
		var d = e.$watch("$stateParams.type", function(m, k, l) {
			e._tc = m;
			switch (m) {
			case "bonus":
				e.search_bonus();
				e.title = j.setSubTitle(21, e);
				break;
			case "withdraw":
				e.search_withdraw();
				e.title = j.setSubTitle(22, e);
				break;
			case "transfers":
				e.search_transfers();
				e.title = j.setSubTitle(23, e);
				break;
			case "betting":
				e.search_betting();
				e.title = j.setSubTitle(24, e);
				break;
			case "recharge":
				e.search_recharge();
				e.title = j.setSubTitle(25, e);
				break
			}
		});
		e.tabs = f.conf("my-tabs");
		e._display = {};
		e._bonusQ = {};
		e._transfersQ = {};
		e._withdrawQ = {};
		e._rechargeQ = {};
		e._bettingQ = {};
		e.$on("$destroy", function() {
			d()
		})
	}]).controller("__my.safety", ["$scope", "$rootScope", "$$my", "$$modal", "$$base", "$$user", "$timeout", "$location", function(k, j, d, f, l, a, b, g) {
		k.$on("backSafetyCenter", function(m) {
			window.location.href = "#/my/safety";
			k._display = undefined;
			m.stopPropagation();
			b(function() {
				k.$apply()
			})
		});
		k.bindQa = function() {
			d.bindQa(k._qa, function(m) {
				f.alert(null, l.i18n("my-bindqa-success"), "success", null, function() {
					a.refreshSafety();
					k._qa = {};
					k._display = undefined;
					window.location.href = "#/my/safety";
					k.$apply()
				})
			})
		};
		k.getAuthCode = function() {
			var m = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
			if (!m.test(k._mail.email)) {
				f.alert(null, l.i18n("my-mail-format-error"), "error");
				return
			}
			k._checkMail = true;
			d.getMailAuth(k._mail, function(n) {
				f.alert(null, l.i18n("my-mail-send"), "success")
			})
		};
		k.bindMail = function() {
			var m = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
			if (!m.test(k._mail.email)) {
				f.alert(null, l.i18n("my-mail-format-error"), "error");
				return
			}
			d.bindMail(k._mail, function(n) {
				f.alert(null, l.i18n("my-bind-mail-success"), "success", null, function() {
					a.refreshSafety();
					k._mail = {};
					k._display = undefined;
					window.location.href = "#/my/safety";
					k.$apply()
				})
			})
		};
		k.linkTo = function(m) {
			window.location.href = "#/my/safety/" + m;
			return false
		};
		k.goBind = function(m) {
			if (m === "pwd") {
				window.location.href = "#/my/password";
				return
			}
			if (m === "safetypwd") {
				window.location.href = "#/my/password";
				j.changePwdType = "safety";
				return
			}
			if (!j.user.safety) {
				f.tips(l.i18n("my-loading-safe"), "info");
				return
			}
			if (m === "realname") {
				if (j.user.safety.is_realname === 0) {
					f.alert(null, l.i18n("my-realname-done") + j.user.safety.realname, "info");
					window.location.href = "#/my/safety";
					return false
				}
				k._display = "realName";
				return
			}
			if (m === "mail") {
				if (j.user.safety.is_email === 0) {
					f.confirm(null, l.i18n("my-mail-done"), l.i18n("my-mail-done-btn"), function() {
						k._display = "changeMail";
						k.$apply()
					}, null, function() {
						window.location.href = "#/my/safety";
						return false
					});
					return
				}
				k._display = "mail";
				return
			}
			if (m === "qa") {
				if (j.user.safety.is_answer === 0) {
					k._display = "changeQa";
					return
				}
				k._display = "qa";
				return
			}
		};
		k.bindRealName = function() {
			d.bindRealName(k._realName, function() {
				f.alert(null, l.i18n("my-realname-done1"), "success", null, function() {
					a.refreshSafety();
					k._realName = {};
					k._display = undefined;
					window.location.href = "#/my/safety";
					k.$apply()
				})
			})
		};
		k.title = d.setSubTitle(30, k);
		k._realName = {};
		k._mail = {};
		k._qa = {};
		var e = k.$watch("$stateParams.in", function(o, m, n) {
			if (o && ["realname", "safetypwd", "mail", "qa"].indexOf(o) > -1) {
				k.goBind(o);
				return
			}
			k._display = undefined
		});
		k.$on("$destroy", function() {
			e()
		})
	}]).controller("__my.changePwd", ["$scope", "$rootScope", "$$my", "$$modal", "$$base", "$$user", function(d, b, g, f, a, e) {
		d.switchTab = function(j) {
			d._tc = j
		};
		d.changeLoginPwd = function() {
			g.changeLoginPwd(d._loginP, function() {
				f.alert(null, a.i18n("my-change-login-pass-c"), "success", null, null);
				d._loginP = {}
			})
		};
		d.changeSafetyPwd = function() {
			g.changeSafetyPwd(d._safety, function() {
				f.alert(null, a.i18n("my-change-safe-pass-c"), "success", null, null);
				e.refreshSafety();
				d._safety = {}
			})
		};
		d.title = g.setSubTitle(32, d);
		d._tc = b.changePwdType || "login";
		b.changePwdType = undefined;
		d._safety = {};
		d._loginP = {}
	}]).controller("__my.info", ["$scope", "$rootScope", "$$my", "$$modal", "$$base", function(e, b, g, f, a) {
		var d = e.$watch("$root.user.info", function(l, j, k) {
			if (!l) {
				return
			}
			e._info = angular.copy(b.user.info)
		});
		e.modifyInfo = function() {
			g.modifyInfo(e._info, function() {
				b.user.info.gender = angular.copy(e._info.gender);
				b.user.info.cellPhone = angular.copy(e._info.cellPhone);
				b.user.info.qq = angular.copy(e._info.qq);
				f.alert(null, a.i18n("my-change-info"), "success", null, null)
			})
		};
		e.title = g.setSubTitle(31, e);
		e.$on("$destroy", function() {
			d()
		})
	}]).controller("__my.message", ["$scope", "$rootScope", "$$my", "$$modal", "$$base", function(d, b, f, e, a) {
		d.search_message = function(g) {
			d.pageNo = g || 1;
			f.getMessage({
				page: d.pageNo
			}, function(j) {
				j.data.fn = d.search_message;
				d._display = j.data
			})
		};
		d.showContent = function(g) {
			d._message = g.content.replace(/\n/g, "<br>");
			e.popup(d, "message-detail");
			if (g.is_read != 0) {
				return
			}
			f.readMesaage({
				ids: [g.id]
			}, function(j) {
				g.is_read = 1;
				b.user.info.unreadMsg--
			})
		};
		d.deleteMsg = function(g) {
			f.deleteMessage({
				ids: [g.id]
			}, function() {
				e.alert(null, a.i18n("my-delete-message"), "success", null, null);
				d._display.list.splice(d._display.list.indexOf(g), 1)
			})
		};
		d.readAll = function() {
			var g = [];
			$.each(d._display.list, function(j, k) {
				if (k.is_read == 0) {
					g.push(k.id)
				}
			});
			if (g.length === 0) {
				e.alert(null, a.i18n("my-message-read"), "info");
				return
			}
			e.confirm(null, a.i18n("my-message-read-c"), null, function() {
				f.readMesaage({
					ids: g
				}, function(j) {
					$.each(d._display.list, function(k, l) {
						if (l.is_read == 0) {
							l.is_read = 1;
							b.user.info.unreadMsg--
						}
					});
					e.alert(null, "标记已读成功", "success")
				})
			})
		};
		d.delAll = function() {
			if (d._display.list.length === 0) {
				e.alert(null, a.i18n("my-message-del"), "info");
				return
			}
			var g = [];
			$.each(d._display.list, function(j, k) {
				g.push(k.id)
			});
			e.confirm(null, a.i18n("my-message-del-c"), null, function() {
				f.deleteMessage({
					ids: g
				}, function(j) {
					d.search_message();
					e.alert(null, "清空消息成功", "success")
				})
			})
		};
		d.title = f.setSubTitle(41, d);
		d._display = {};
		d._display.template = "table/message.html";
		d.search_message()
	}]).controller("__my.c.mail", ["$scope", "$rootScope", "$$my", "$$modal", "$$base", "$$user", function(d, b, g, f, a, e) {
		d.getAuthCode = function(k) {
			if (k === 1) {
				d._mailToken = true;
				g.getMailAuth(null, function(l) {
					f.alert(null, a.i18n("my-mail-send"), "success")
				});
				return
			}
			if (k === 2) {
				var j = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
				if (!j.test(d._newMail.email)) {
					f.alert(null, a.i18n("my-mail-format-error"), "error");
					return
				}
				d._mailToken = true;
				g.getMailAuth(d._newMail, function(l) {
					f.alert(null, a.i18n("my-mail-send"), "success")
				})
			}
		};
		d.changeBindMail = function() {
			var j = angular.copy(d._oldMail);
			delete j.email;
			g.checkOldMail(j, function(k) {
				d._newMail.token = k.data.token;
				d._s = 2;
				d._mailToken = false
			})
		};
		d.bindNewMail = function() {
			var j = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
			if (!j.test(d._newMail.email)) {
				f.alert(null, a.i18n("my-mail-format-error"), "error");
				return
			}
			g.changeMail(d._newMail, function(k) {
				f.alert(null, a.i18n("my-bind-mail-success"), "success", null, function() {
					e.refreshSafety();
					d.$emit("backSafetyCenter")
				})
			})
		};
		d._s = 1;
		d._oldMail = {};
		d._oldMail.email = angular.copy(b.user.safety.email);
		d._newMail = {}
	}]).controller("__my.c.qa", ["$scope", "$rootScope", "$$my", "$$modal", "$$base", "$$user", function(d, b, g, f, a, e) {
		d.getAuthCode = function(j) {
			d._mailToken = true;
			g.getMailAuth(null, function(k) {
				f.alert(null, a.i18n("my-mail-send"), "success")
			})
		};
		d.checkQA = function() {
			g.checkQA(d._oldQa, function(j) {
				d._qa.token = j.data.token;
				d._s = 2
			})
		};
		d.checkMail = function() {
			var j = angular.copy(d._oldMail);
			delete j.email;
			g.checkOldMail(j, function(k) {
				d._qa.token = k.data.token;
				d._s = 2
			})
		};
		d.changeBindQA = function() {
			g.bindQa(d._qa, function(j) {
				f.alert(null, a.i18n("my-bindqa-success"), "success", null, function() {
					e.refreshSafety();
					d.$emit("backSafetyCenter")
				})
			})
		};
		d._s = 1;
		d._oldQa = {};
		d._oldQa.prob_id = b.user.safety.answer_key;
		d._qa = {};
		d._oldMail = {};
		d._oldMail.email = angular.copy(b.user.safety.email)
	}]).controller("__my.c.pwd", ["$scope", "$rootScope", "$$my", "$$modal", "$$base", "$timeout", function(d, b, g, f, a, e) {
		d.getUserByFindPwd = function() {
			g.getUserByFindPwd(d._user, function(j) {
				if (j.status < 0) {
					b.checkcode_ran = Math.ceil(Math.random() * 100000000);
					f.alert(null, j.msg, "error");
					return
				}
				if (!j.data.email && !j.data.problem_id) {
					f.alert(null, a.i18n("my-findPwd-noSafe"), "info");
					return
				}
				d._safety = j.data;
				d._safety.prob_id = j.data.problem_id;
				d._safety.auth_type = 1;
				d._s = 2
			})
		};
		d.getAuthCode = function(j) {
			d._mailToken = true;
			g.getMailAuth(d._safety, function(k) {
				f.alert(null, a.i18n("my-mail-send"), "success")
			})
		};
		d.checkQA = function() {
			g.checkQA(d._safety, function(j) {
				d._newPwd.token = j.data.token;
				d._s = 3
			})
		};
		d.checkMail = function() {
			var j = angular.copy(d._safety);
			delete j.email;
			g.checkOldMail(j, function(k) {
				d._newPwd.token = k.data.token;
				d._s = 3
			})
		};
		d.changePwd = function() {
			d._newPwd.id = d._safety.id;
			d._newPwd.auth_type = 1;
			g.changeLoginPwd(d._newPwd, function() {
				d._s = 4
			})
		};
		d.goLoginI = function() {
			f.popupClose();
			e(function() {
				b.triggers.login = {
					bullet: Math.ceil(Math.random() * 1000000)
				};
				d.$apply()
			}, 300)
		};
		d.$on("clear", function() {
			d._s = 1;
			d._user = {};
			d._qa = {};
			d._mail = {};
			d._newPwd = {}
		})
	}])
})();
(function() {
	angular.module("promotion", []).controller("__promotion", ["$scope", "$rootScope", "$$request", "$$modal", "$interval", "$stateParams", function(e, a, d, g, j, f) {
		a.page.code = "promotion";
		a.bg = "promotion";
		e._ca = "";
		var b = e.$watch("$stateParams.id", function(m, k, l) {
			if (!m) {
				return
			}
			e.i = j(function() {
				if ($("#modal-promotion").length > 0) {
					$.each(e.promotions, function(n, o) {
						if (o.id == m) {
							e.detail(o);
							return false
						}
					});
					j.cancel(e.i)
				}
			}, 50)
		});
		e.switchNav = function(k) {
			e._ca = k || ""
		};
		e.toggleNav = function() {
			return "promotionbar-" + e._ca
		};
		e.getPromotions = function() {
			var k = d.packageReq("pomotion-list", null, null, "GET", false, false);
			d.action(k, function(l) {
				e._p = [];
				$.each(l.data, function(m, p) {
					if (p["new"] === 1) {
						var n = angular.copy(p);
						n.category = "1";
						e._p.push(n)
					}
				});
				l.data = l.data.concat(e._p);
				e.promotions = l.data
			})
		};
		e.detail = function(l) {
			g.popupClose();
			g.popup(e, "promotion");
			e._promotion = l;
			if (angular.isDefined(e._promotion.desc)) {
				return
			}
			var k = d.packageReq("pomotion-desc", [l.id], null, "GET", false, false);
			d.action(k, function(m) {
				e._promotion.desc = m.data
			})
		};
		e.getPromotions();
		e.$on("$destroy", function() {
			if (e.i) {
				j.cancel(e.i)
			}
			b()
		})
	}])
})();

//注射器加载完成所有模块时，此方法执行一次run
(function() {
	angular.module("bomaRouter", ["ui.router"]).run(["$rootScope", "$state", "$stateParams", function(a, b, d) {
		a.$state = b;
		a.$stateParams = d
	}]).config(["$stateProvider", "$urlRouterProvider", function(b, a) {
		a.otherwise("/");
		b.state("index", {
			url: "/",
			templateUrl: "home.html"
		}).state("slot", {
			url: "/slot",
			templateUrl: "slot.html"
		}).state("slot.pf", {
			url: "/:pf",
			templateUrl: "slot.html"
		}).state("casino", {
			url: "/casino",
			templateUrl: "casino.html"
		}).state("casino.pf", {
			url: "/:pf",
			templateUrl: "casino.html"
		}).state("sports", {
			url: "/sports",
			templateUrl: "sports.html"
		}).state("lottery", {
			url: "/lottery",
			templateUrl: "lottery.html"
		}).state("lottery.pf", {
			url: "/:pf",
			templateUrl: "lottery.html"
		}).state("promotion", {
			url: "/promotion",
			templateUrl: "promotion.html"
		}).state("promotion.detail", {
			url: "/:id",
			templateUrl: "promotion.html"
		}).state("client", {
			url: "/client",
			templateUrl: "client.html"
		}).state("rule", {
			url: "/rule",
			templateUrl: "rule.html"
		}).state("rule.casino", {
			url: "/casino",
			templateUrl: function() {
				lang = getCookie("lang") || "zh-cn";
				return "rule/" + lang + "/casino/index.html"
			}
		}).state("rule.casino.game", {
			url: "/:game",
			templateUrl: function() {
				lang = getCookie("lang") || "zh-cn";
				return "rule/" + lang + "/casino/index.html"
			}
		}).state("help", {
			url: "/help",
			templateUrl: "help.html"
		}).state("help.usual", {
			url: "/:type",
			templateUrl: "help.html"
		}).state("speed", {
			url: "/speed",
			templateUrl: "speed.html"
		}).state("domain", {
			url: "/domain",
			templateUrl: "domain.html"
		}).state("spread", {
			url: "/spread",
			templateUrl: "spread.html"
		}).state("spread.usual", {
			url: "/:agentcode",
			templateUrl: "spread.html"
		}).state("my", {
			url: "/my",
			templateUrl: "my.html"
		}).state("my.index", {
			url: "/index",
			templateUrl: "my/my_index.html"
		}).state("my.recharge", {
			url: "/recharge",
			templateUrl: "my/recharge.html"
		}).state("my.withdraw", {
			url: "/withdraw",
			templateUrl: "my/withdraw.html"
		}).state("my.transfers", {
			url: "/transfers",
			templateUrl: "my/transfers.html"
		}).state("my.history", {
			url: "/history/:type",
			templateUrl: "my/history.html"
		}).state("my.safety", {
			url: "/safety",
			templateUrl: "my/safety.html"
		}).state("my.safety.in", {
			url: "/:in",
			templateUrl: "my/safety.html"
		}).state("my.password", {
			url: "/password",
			templateUrl: "my/changePwd.html"
		}).state("my.info", {
			url: "/info",
			templateUrl: "my/info.html"
		}).state("my.message", {
			url: "/message",
			templateUrl: "my/message.html"
		})
	}])
})();
(function() {
	angular.module("rule", []).controller("__rule", ["$scope", "$rootScope", function(b, a) {
		a.page.code = "gamerule"
	}]).controller("__rule_casino", ["$scope", "$rootScope", "$stateParams", "$$dic", "$location", "$$game", function(d, b, f, e, j, g) {
		d.enterGameHall = function(k) {
			g.enterGameHall(k)
		};
		d.init = function(k) {
			d._url = "/#" + j.url();
			d.rulename = "rule/" + lang + "/casino/" + f.game + ".html";
			if (!k) {
				k = f.game
			}
			d._spf = angular.uppercase(k.split(".")["0"]);
			d.casinos = e.conf("casino-pfs-menu")
		};
		d.jump = function(k) {
			window.location.href = k
		};
		var a = d.$watch("$stateParams.game", function(k) {
			if (!d.init) {
				d.init = true;
				return
			}
			d.init(k)
		});
		d.$on("$destroy", function() {
			a()
		})
	}])
})();
(function() {
	angular.module("slot", []).controller("__slot", ["$scope", "$rootScope", "$$base", "$$game", "$$dic", "$$modal", "$stateParams", "$$slot", "$$user", "$timeout", "$interval", "$$cache", function(r, n, s, m, g, f, q, l, e, d, k, j) {
		n.page.code = "slot";
		r.slots = [];
		r.categories = [];
		r.games = [];
		var b = r.$watch("$stateParams.pf", function(u, p, t) {
			if (!r.init) {
				r.init = true;
				return
			}
			r.changePf(r.slots[r.swithcPF()])
		});
		r.searchGame = function() {
			if (r._search !== "") {
				$.each(r.categories, function(p, t) {
					if (t.name === s.i18n("common-all-games") && t.pf === r._cpf) {
						r.changeCa(t);
						return false
					}
				})
			}
		};
		r.swithcPF = function() {
			switch (q.pf) {
			case "pt":
				idx = 0;
				break;
			case "mg":
				idx = 1;
				break;
			default:
				idx = 1
			}
			return idx
		};
		r.playSlot = function(t, u) {
			var p = "";
			if (u) {
				p = g.conf("play_slot_" + angular.lowercase(t.pf.substring(0, 2))) + t.game_code
			} else {
				p = g.conf("play_slot_" + t.pfCode) + t.game_name
			}
			$tools.openWindow(p)
		};
		r.trySlot = function(t) {
			var p = g.conf("try_slot_" + t.pfCode) + t.game_name;
			$tools.openWindow(p)
		};
		r.changePTPwd = function() {
			e.modifyPTPwd()
		};
		r.showMoreGames = function() {
			r.showCount += 25
		};
		r.changePf = function(p) {
			r._cco = "";
			r._cpf = p.pfName;
			r._cca = n.casino_pt || p.category[0].categoryName;
			n.casino_pt = undefined;
			$.each(r.categories, function(t, u) {
				if (u.pf === p.pfName && u.name === r._cca) {
					r._c = u;
					return false
				}
			});
			r.showCount = 25
		};
		r.changeCa = function(p) {
			(p.name === s.i18n("common-my-collect")) ? r._cco = 1 : r._cco = "";
			r._cca = p.filter;
			r._c = p;
			r.showCount = 25
		};
		r.inGameArea = function(p) {
			r._cgame = p.game_name
		};
		r.outGameArea = function() {
			r._cgame = undefined
		};
		r.setFavorite = function(p) {
			(p.favorite === 0) ? p.favorite = 1 : p.favorite = 0;
			$.each(r.games, function(t, u) {
				if (p.game_name === u.game_name && p.favorite !== u.favorite) {
					u.favorite = p.favorite
				}
			});
			m.setFavorite(p.game_name, function() {
				if (p.favorite === 1) {
					f.tips(s.i18n("slot-collect-1"))
				} else {
					f.tips(s.i18n("slot-collect-2"))
				}
			})
		};
		r.getSlotLuckGuy = function() {
			l.getSlotLuckGuy(function(p) {
				r.luckUsers = [];
				$.each(p.data.mg, function(t, u) {
					u.pf = "MG平台";
					r.luckUsers.push(u)
				});
				$.each(p.data.pt, function(t, u) {
					u.pf = "PT平台";
					r.luckUsers.push(u)
				})
			})
		};
		r.checkoutPtAcc = function() {
			f.alert(null, s.i18n("pt-username") + n.user.pfAcc[0].username + "\n" + s.i18n("pt-password") + n.user.pfAcc[0].password)
		};
		r.initSlotGames = function(p) {
			m.getSlotGames(function(t) {
				r.categories = [];
				r.games = [];
				r.slots = t.data.pf;
				$.each(r.slots, function(u, v) {
					$.each(v.category, function(w, x) {
						$.each(x.games, function(z, y) {
							_v = angular.copy(y);
							_v.pf = v.pfName;
							_v.ca = x.categoryName;
							_v.pfCode = v.pfCode;
							if (p && p.indexOf(_v.game_name) > -1) {
								_v.favorite = 1
							}
							r.games.push(_v)
						});
						r.categories.push({
							name: x.categoryName,
							filter: x.categoryName,
							pf: v.pfName
						})
					});
					r.categories.push({
						name: s.i18n("common-all-games"),
						filter: "",
						pf: v.pfName
					});
					if (n.user) {
						r.categories.push({
							name: s.i18n("common-my-collect"),
							filter: "",
							pf: v.pfName,
							collect: true
						})
					}
				});
				r.changePf(r.slots[r.initIdx])
			})
		};
		r.initSlotPrizepool = function() {
			m.getSlotPrizepool(function(p) {
				r._restotle = [{
					pf: "MG平台",
					total: p.data.mg.total
				}, {
					pf: "PT平台",
					total: p.data.pt.total
				}];
				var u = [];
				$.each(p.data.mg.games, function(w, x) {
					x.pf = "MG平台";
					u.push(x)
				});
				$.each(p.data.pt.games, function(w, x) {
					x.pf = "PT平台";
					u.push(x)
				});
				var v = new Date();
				var t = v.getHours() * 3600000 + v.getMinutes() * 60000 + v.getSeconds() * 1000 + v.getMilliseconds();
				r.prizepool = [];
				t = t / 50 * 0.33;
				$.each(u, function(w, x) {
					x.val = x.prizepool + t;
					x.info = x.game_name;
					r.prizepool.push(x)
				});
				r.i = k(function() {
					$.each(r.prizepool, function(w, x) {
						x.val += 0.33
					});
					$.each(r._restotle, function(w, x) {
						x.total += 11.33
					})
				}, 50)
			})
		};
		var a = s.switchBG("slot");
		r.initIdx = r.swithcPF();
		r.initSlotPrizepool();
		r.getSlotLuckGuy();
		var o = r.$watch("$root.user", function(t, p) {
			if (!t) {
				r.initSlotGames();
				return
			}
			m.getCollectedGame(function(u) {
				var v = [];
				$.each(u.data.games, function(w, x) {
					v.push(x.game_name)
				});
				r.initSlotGames(v)
			})
		});
		r.$on("$destroy", function() {
			o();
			b();
			k.cancel(r.i);
			d.cancel(a);
			n.bg = "slot"
		})
	}])
})();
(function() {
	angular.module("speed", []).controller("__speed", ["$scope", "$rootScope", "$stateParams", "$location", function(b, a, d, e) {
		a.page.code = "speed";
		b.tim = new Date().getTime();
		b.seed = 0;
		b.count = 0;
		b.finalurl = new Array();
		b.opts = {};
		a.bg = undefined;
		b.init = function(j) {
			var k = ["http://www.boma365.net", "http://www.boma365.com", "http://www.boma365.org", "http://www.boma365.info", "http://www.boma116.com", "http://www.boma118.com", "http://www.188bm365.com", "http://www.188bm365.net", "http://www.777boma365.com", "http://www.zuqiubm365.com", "http://www.777boma365.net", "http://www.zuqiubm365.net", "http://www.boma9.com", "http://www.djjd0.com"];
			for (var g = 0; g < k.length; g++) {
				if (g <= 2) {
					b.gettime(k[g]);
					continue
				}
				var f = new Image();
				f.onerror = (function(l) {
					b.gettime(l)
				})(k[g]);
				f.src = k[g] + "/" + Math.random()
			}
		};
		b.gettime = function(k) {
			var n = 1100;
			if (b.count <= 2) {
				if (!b.seed) {
					b.seed = parseInt(Math.random() * 200 + 200)
				}
				j = parseInt(Math.random() * 50) + b.seed
			} else {
				var j = new Date().getTime() - b.tim;
				var l = j;
				var m = 0;
				if (b.seed >= n) {
					m = 0
				} else {
					m = (n - b.seed) / 5 - 50
				}
				l = parseInt(Math.random() * m + 20) + b.seed;
				if (j < b.seed) {
					j = l
				} else {
					j = Math.min(j, l)
				}
			}
			if (j >= n) {
				j = n - 1
			}
			var g = parseInt((n - j) / 10);
			var f = "网址" + (b.count + 1) + ":" + k;
			b.finalurl[b.count] = {
				urlstr: f,
				url: k,
				time: g
			};
			b.count++
		};
		b.init()
	}])
})();
(function() {
	angular.module("sports", []).controller("__sports", ["$scope", "$rootScope", "$$dic", "$sce", function(e, a, f, d) {
		a.page.code = "sports";
		a.bg = "sports";
		a._displaySportsAD = a._displaySportsAD || 1;
		var b = e.$watch("$root.user", function(k, g, j) {
			if (!k) {
				e.sbUrl = d.trustAsResourceUrl(f.conf("play_sports_sb_b"));
				return
			}
			e.sbUrl = d.trustAsResourceUrl(f.conf("play_sports_sb_a"))
		});
		e.closeFloatAD = function() {
			a._displaySportsAD = 2
		};
		e.$on("$destroy", function() {
			b()
		})
	}])
})();
(function() {
	angular.module("spread", []).controller("__spread", ["$scope", "$rootScope", "$$base", "$$game", "$$dic", "$$user", "$$request", "$timeout", "$cookies", "$stateParams", function(l, j, m, g, e, a, f, b, d, k) {
		j.page.code = "spread";
		l.pfs = e.conf("game-pfs");
		l.enterGameHall = function(n) {
			g.enterGameHall(n)
		};
		l.inGameHall = function(n) {
			l._hall = n
		};
		l.outGameHall = function() {
			l._hall = undefined
		};
		l.inGameArea = function(n) {
			l._cgame = n.name
		};
		l.outGameArea = function() {
			l._cgame = undefined
		};
		l.trySlot = function(o) {
			var n = e.conf("try_slot_" + o.pfCode) + o.gameid;
			$tools.openWindow(n)
		};
		l.playVideo = function(n) {
			document.getElementById("myvideo").play()
		};
		l.getfreegame = function() {
			var n = f.packageReq("free-hotgames", null, {}, "POST", true, false);
			f.action(n, function(o) {
				if (o.data) {
					l.hotgames = o.data
				}
			})
		};
		l.initcookie = function() {
			if (/^\d{6}$/.test(k.agentcode)) {
				d.put("agent_code", k.agentcode)
			}
		};
		l.$on("onFinishRender", function() {
			seajs.use("static/boma_v3/pulgin/flexslider/jquery.flexslider-min", function() {
				$("#flexslider").flexslider({
					animation: "slide",
					animationLoop: true,
					itemWidth: 210,
					itemMargin: 5,
					minItems: 7,
					directionNav: false,
					slideshowSpeed: 5000,
					pauseOnHover: true
				})
			})
		});
		l.getfreegame();
		l.initcookie()
	}])
})();
(function() {
	angular.module("base.service", []).factory("$$base", ["$log", "$filter", "$q", "$http", "$rootScope", "$timeout", "$translate", function(f, g, b, j, a, d, e) {
		return {
			switchBG: function(k) {
				return d(function() {
					a.bg = k
				}, 1000)
			},
			loadJson: function(k, l, m) {
				l = l || false;
				if (l) {
					k += "?r=" + Math.ceil(Math.random() * 999999999)
				}
				$.getJSON((window.$path + k), null, function(n, o) {
					if (angular.isFunction(m)) {
						m(n)
					}
					return n
				})
			},
			i18n: function(k) {
				if (k) {
					return e.instant(k)
				}
				return k
			},
			postions: function(l, k) {
				var m = l.offset().left + l.width() - k.width();
				return m
			},
			isKingBall: function() {
				if (window.$kb_domains.indexOf(window.location.host) > -1) {
					return true
				}
				return true
			}
		}
	}])
})();
(function() {
	angular.module("cache.service", []).factory("$$cache", ["$log", "$rootScope", function(b, a) {
		return {
			put: function(e, f, d) {
				if (!window.localStorage) {
					return null
				}
				if (this.get("key")) {
					this.remove("key")
				}
				var g = {
					expires: d,
					createDate: new Date(),
					data: f
				};
				window.localStorage.setItem(e, angular.toJson(g))
			},
			get: function(d) {
				if (!window.localStorage) {
					return null
				}
				if (!window.localStorage.getItem(d)) {
					return null
				}
				var e = angular.fromJson(window.localStorage.getItem(d));
				if (e.expires !== -1 && parseInt(((new Date()).getTime() - (new Date(e.createDate).getTime())) / 1000) > (e.expires * 60 * 60 * 24)) {
					window.localStorage.removeItem(d);
					return null
				}
				return e
			},
			remove: function(d) {
				if (!window.localStorage) {
					return null
				}
				if (!window.localStorage.getItem(d)) {
					return null
				}
				window.localStorage.removeItem(d)
			}
		}
	}])
})();
(function() {
	angular.module("common.service", []).factory("$$common", ["$log", "$$request", "$$cache", "$rootScope", function(e, b, d, a) {
		return {
			getNotice: function(g) {
				var f = b.packageReq("get-notice", null, null, "GET", false, false);
				b.action(f, function(j) {
					g(j)
				})
			},
			getToken: function(g) {
				var f = b.packageReq("get-token", null, null, "GET", false, false);
				b.action(f, function(j) {
					g(j)
				})
			},
			getBanners: function(g) {
				var f = b.packageReq("get-banners", null, null, "GET", false, false, -1);
				b.action(f, function(j) {
					g(j)
				})
			},
			getActivityWindow: function(g) {
				var f = b.packageReq("activity_window", null, null, "GET", false, false);
				b.action(f, function(j) {
					g(j)
				})
			},
			getDictionary: function(f, j) {
				if (d.get("dic." + f)) {
					j(d.get("dic." + f).data);
					return
				}
				var g = b.packageReq("dictionary", [f], null, "GET", false, false);
				b.action(g, function(k) {
					d.put("dic." + f, k, 7);
					j(k)
				})
			},
			getDicValue: function(g, j) {
				var f = b.packageReq("converter", null, g, "POST", false, false);
				b.action(f, function(k) {
					j(k)
				})
			}
		}
	}])
})();
(function() {
	angular.module("dic.service", []).factory("$$dic", ["$log", "$rootScope", function(b, a) {
		return {
			conf: function(d) {
				var e = {};
				e["my-tabs"] = [{
					code: "bonus",
					"zh-cn": "红利记录"
				}, {
					code: "betting",
					"zh-cn": "投注记录"
				}, {
					code: "recharge",
					"zh-cn": "充值记录"
				}, {
					code: "withdraw",
					"zh-cn": "提款记录"
				}, {
					code: "transfers",
					"zh-cn": "转账记录"
				}];
				e["my-navs"] = [{
					"zh-cn": "我的账户",
					navId: 1,
					icon: "my-icon-account",
					children: [{
						"zh-cn": "账户概况",
						navId: 10,
						href: "#/my/index"
					}, {
						"zh-cn": "充值",
						navId: 11,
						href: "#/my/recharge"
					}, {
						"zh-cn": "提现",
						navId: 12,
						href: "#/my/withdraw"
					}, {
						"zh-cn": "转账",
						navId: 13,
						href: "#/my/transfers"
					}]
				}, {
					"zh-cn": "账户明细",
					navId: 2,
					icon: "my-icon-detail",
					children: [{
						"zh-cn": "红利记录",
						navId: 21,
						href: "#/my/history/bonus"
					}, {
						"zh-cn": "投注记录",
						navId: 24,
						href: "#/my/history/betting"
					}, {
						"zh-cn": "充值记录",
						navId: 25,
						href: "#/my/history/recharge"
					}, {
						"zh-cn": "提款记录",
						navId: 22,
						href: "#/my/history/withdraw"
					}, {
						"zh-cn": "转账记录",
						navId: 23,
						href: "#/my/history/transfers"
					}]
				}, {
					"zh-cn": "账户安全",
					navId: 3,
					icon: "my-icon-safety",
					children: [{
						"zh-cn": "安全中心",
						navId: 30,
						href: "#/my/safety"
					}, {
						"zh-cn": "个人资料",
						navId: 31,
						href: "#/my/info"
					}, {
						"zh-cn": "修改密码",
						navId: 32,
						href: "#/my/password"
					}]
				}, {
					"zh-cn": "我的消息",
					navId: 4,
					icon: "my-icon-message",
					children: [{
						"zh-cn": "系统通知",
						navId: 41,
						href: "#/my/message"
					}]
				}];
				e["casino-pfs"] = [{
					name: "AG",
					url: "#",
					image: "ag.png",
					title: {
						"zh-cn": "最具创新人气最旺"
					},
					desc: {
						"zh-cn": "女忧、名模荷官不定期与你面面派牌，让你High翻全场"
					},
					games: [{
						"zh-cn": "急速百家乐",
						rule: "/#/rule/casino/ag.jsbjl"
					}, {
						"zh-cn": "6牌百家乐",
						rule: "/#/rule/casino/ag.6pbjl"
					}, {
						"zh-cn": "免佣百家乐",
						rule: "/#/rule/casino/ag.tybjl"
					}, {
						"zh-cn": "自选多台",
						rule: "/#/rule/casino/ag.zxdt"
					}, {
						"zh-cn": "骰宝",
						rule: "/#/rule/casino/ag.sb"
					}, {
						"zh-cn": "轮盘",
						rule: "/#/rule/casino/ag.lp"
					}, {
						"zh-cn": "龙虎斗",
						rule: "/#/rule/casino/ag.lhd"
					}]
				}, {
					name: "BBIN",
					url: "#",
					image: "bbin.png",
					title: {
						"zh-cn": "亚洲最稳健的娱乐平台"
					},
					desc: {
						"zh-cn": "如临现场的丰富娱乐享受，实力深厚值得信赖！"
					},
					games: [{
						"zh-cn": "骰宝",
						rule: "/#/rule/casino/bbin.sb"
					}, {
						"zh-cn": "轮盘",
						rule: "/#/rule/casino/bbin.lp"
					}, {
						"zh-cn": "龙虎斗",
						rule: "/#/rule/casino/bbin.lhd"
					}, {
						"zh-cn": "三公",
						rule: "/#/rule/casino/bbin.sg"
					}, {
						"zh-cn": "德州扑克",
						rule: "/#/rule/casino/bbin.dzpk"
					}, {
						"zh-cn": "无线21点",
						rule: "/#/rule/casino/bbin.wx21d"
					}, {
						"zh-cn": "百家乐",
						rule: "/#/rule/casino/bbin.bjl"
					}, {
						"zh-cn": "温州牌九",
						rule: "/#/rule/casino/bbin.wzpj"
					}, {
						"zh-cn": "牛牛",
						rule: "/#/rule/casino/bbin.nn"
					}, {
						"zh-cn": "二八杠",
						rule: "/#/rule/casino/bbin.28g"
					}, {
						"zh-cn": "色蝶",
						rule: "/#/rule/casino/bbin.sd"
					}]
				}, {
					name: "PT",
					url: "#",
					image: "pt.png",
					title: {
						"zh-cn": "玩法丰富实力超群"
					},
					desc: {
						"zh-cn": "靓丽中文荷官动人声线的即时互动，真人娱乐最强现场"
					},
					games: [{
						"zh-cn": "Vip百家乐",
						rule: "/#/rule/casino/pt.vipbjl"
					}, {
						"zh-cn": "实况法式轮盘赌",
						rule: "/#/rule/casino/pt.skfslpd"
					}, {
						"zh-cn": "真人骰子",
						rule: "/#/rule/casino/pt.zrsz"
					}, {
						"zh-cn": "累积百家乐",
						rule: "/#/rule/casino/pt.vipbjl"
					}, {
						"zh-cn": "迷你百家乐",
						rule: "/#/rule/casino/pt.vipbjl"
					}, {
						"zh-cn": "真人百家乐",
						rule: "/#/rule/casino/pt.vipbjl"
					}, {
						"zh-cn": "真人二十一点",
						rule: "/#/rule/casino/pt.zr21d"
					}, {
						"zh-cn": "真人轮盘",
						rule: "/#/rule/casino/pt.zrlp"
					}]
				}, {
					name: "GD",
					url: "#",
					image: "gd.png",
					title: {
						"zh-cn": "技术专注品质卓越"
					},
					desc: {
						"zh-cn": "完美的百家乐之旅，连串、多台、多彩、3D、传统百家乐"
					},
					games: [{
						"zh-cn": "3d百家乐",
						rule: "/#/rule/casino/gd.3dbjl"
					}, {
						"zh-cn": "多彩百家乐",
						rule: "/#/rule/casino/gd.3dbjl"
					}, {
						"zh-cn": "新式百家乐",
						rule: "/#/rule/casino/gd.3dbjl"
					}, {
						"zh-cn": "传统百家乐",
						rule: "/#/rule/casino/gd.3dbjl"
					}, {
						"zh-cn": "轮盘",
						rule: "/#/rule/casino/gd.lp"
					}]
				}];
				e["casino-pfs-menu"] = [{
					name: "AG",
					url: "#",
					image: "ag.png",
					title: {
						"zh-cn": "最具创新人气最旺"
					},
					desc: {
						"zh-cn": "女忧、名模荷官不定期与你面面派牌，让你High翻全场"
					},
					games: [{
						"zh-cn": "急速百家乐",
						rule: "/#/rule/casino/ag.jsbjl"
					}, {
						"zh-cn": "6牌百家乐",
						rule: "/#/rule/casino/ag.6pbjl"
					}, {
						"zh-cn": "免佣百家乐",
						rule: "/#/rule/casino/ag.tybjl"
					}, {
						"zh-cn": "自选多台",
						rule: "/#/rule/casino/ag.zxdt"
					}, {
						"zh-cn": "骰宝",
						rule: "/#/rule/casino/ag.sb"
					}, {
						"zh-cn": "轮盘",
						rule: "/#/rule/casino/ag.lp"
					}, {
						"zh-cn": "龙虎斗",
						rule: "/#/rule/casino/ag.lhd"
					}]
				}, {
					name: "BBIN",
					url: "#",
					image: "bbin.png",
					title: {
						"zh-cn": "亚洲最稳健的娱乐平台"
					},
					desc: {
						"zh-cn": "如临现场的丰富娱乐享受，实力深厚值得信赖！"
					},
					games: [{
						"zh-cn": "骰宝",
						rule: "/#/rule/casino/bbin.sb"
					}, {
						"zh-cn": "轮盘",
						rule: "/#/rule/casino/bbin.lp"
					}, {
						"zh-cn": "龙虎斗",
						rule: "/#/rule/casino/bbin.lhd"
					}, {
						"zh-cn": "三公",
						rule: "/#/rule/casino/bbin.sg"
					}, {
						"zh-cn": "德州扑克",
						rule: "/#/rule/casino/bbin.dzpk"
					}, {
						"zh-cn": "无线21点",
						rule: "/#/rule/casino/bbin.wx21d"
					}, {
						"zh-cn": "百家乐",
						rule: "/#/rule/casino/bbin.bjl"
					}, {
						"zh-cn": "温州牌九",
						rule: "/#/rule/casino/bbin.wzpj"
					}, {
						"zh-cn": "牛牛",
						rule: "/#/rule/casino/bbin.nn"
					}, {
						"zh-cn": "二八杠",
						rule: "/#/rule/casino/bbin.28g"
					}, {
						"zh-cn": "色蝶",
						rule: "/#/rule/casino/bbin.sd"
					}]
				}, {
					name: "PT",
					url: "#",
					image: "pt.png",
					title: {
						"zh-cn": "玩法丰富实力超群"
					},
					desc: {
						"zh-cn": "靓丽中文荷官动人声线的即时互动，真人娱乐最强现场"
					},
					games: [{
						"zh-cn": "百家乐",
						rule: "/#/rule/casino/pt.vipbjl"
					}, {
						"zh-cn": "实况法式轮盘赌",
						rule: "/#/rule/casino/pt.skfslpd"
					}, {
						"zh-cn": "真人骰子",
						rule: "/#/rule/casino/pt.zrsz"
					}, {
						"zh-cn": "真人二十一点",
						rule: "/#/rule/casino/pt.zr21d"
					}, {
						"zh-cn": "真人轮盘",
						rule: "/#/rule/casino/pt.zrlp"
					}]
				}, {
					name: "GD",
					url: "#",
					image: "gd.png",
					title: {
						"zh-cn": "技术专注品质卓越"
					},
					desc: {
						"zh-cn": "完美的百家乐之旅，连串、多台、多彩、3D、传统百家乐"
					},
					games: [{
						"zh-cn": "百家乐",
						rule: "/#/rule/casino/gd.3dbjl"
					}, {
						"zh-cn": "轮盘",
						rule: "/#/rule/casino/gd.lp"
					}]
				}];
				e["menu-logout"] = [{
					lable: "home",
					detail: 0,
					herf: "index"
				}, {
					lable: "slot",
					detail: 1,
					herf: "slot"
				}, {
					lable: "casino",
					detail: 1,
					herf: "casino"
				}, {
					lable: "sports",
					detail: 1,
					herf: "sports"
				}, {
					lable: "lottery",
					detail: 1,
					herf: "lottery"
				}, {
					lable: "promotion",
					detail: 0,
					herf: "promotion"
				}, {
					lable: "client",
					detail: 0,
					herf: "client"
				}];
				e["menu-login"] = [{
					lable: "home",
					detail: 0,
					herf: "index"
				}, {
					lable: "slot",
					detail: 1,
					herf: "slot"
				}, {
					lable: "casino",
					detail: 1,
					herf: "casino"
				}, {
					lable: "sports",
					detail: 1,
					herf: "sports"
				}, {
					lable: "lottery",
					detail: 1,
					herf: "lottery"
				}, {
					lable: "promotion",
					detail: 0,
					herf: "promotion"
				}, {
					lable: "client",
					detail: 0,
					herf: "client"
				}, {
					lable: "my",
					detail: 0,
					herf: "my.index"
				}];
				e["game-pfs"] = ["MG", "SB", "WBG", "PT", "AG", "GD", "BBIN"];
				e["prizepool-games"] = [{
					name: "蜘蛛侠",
					icon: "prizepool_icon2.png"
				}, {
					name: "钢铁侠",
					icon: "prizepool_icon1.png"
				}, {
					name: "神奇四侠",
					icon: "prizepool_icon4.png"
				}, {
					name: "雷神",
					icon: "prizepool_icon3.png"
				}];
				e.casino_pfs = ["ag", "bbin", "pt", "gd"];
				e.lottery_pfs = ["wbg", "bbin"];
				e.play_lottery_bbin = "/play/bbin?type=lt";
				e.play_lottery_wbg = "/play/wbg";
				e.play_casino_pt = "#/slot/pt";
				e.play_casino_ag = "play/ag";
				e.play_casino_bbin = "/play/bbin";
				e.play_casino_gd = "/play/gd";
				e.sb_client = "http://www.boma365.com/msb";
				e.play_slot_mg = "/play/mg?gamename=";
				e.try_slot_mg = "https://redirector3.valueactive.eu/Casino/Default.aspx?applicationid=1023&theme=quickfiressl&usertype=5&sext1=demo&sext2=demo&csid=1866&serverid=1866&variant=MIT-Demo&ul=zh&gameid=";
				e.play_slot_pt = "/pt/jump?code=";
				e.try_slot_pt = "http://cache.download.banner.mightypanda88.com/casinoclient.html?language=ZH-CN&nolobby=1&mode=offline&affiliates=1&game=";
				e.play_sports_sb_b = "http://mkt.qwek5.com/vender.aspx?lang=cs";
				e.play_sports_sb_a = "/play/sb";
				e["hide-announcement"] = ["slot", "casino", "lottery", "spread"];
				e.preaccount = "bm365";
				e.cache_version = "1.0.1";
				if (angular.isUndefined(e[d])) {
					b.debug("####未设置字典类型:conf/ key：" + d + "####");
					return ""
				}
				return e[d]
			},
			client: function(d) {
				var e = {};
				e.pt = "http://cdn.jackpotmatrix.com/boma365prod/d/setup.exe";
				e.boma = "http://www.boma365.com/uploads/boma.exe";
				if (!e[d]) {
					b.debug("####未设置字典类型:client/ key：" + d + "####");
					return ""
				}
				return e[d]
			},
			contact: function(d) {
				var e = {};
				e.service_online = "";
				e.service_mail = "CS@boma365.com";
				e.hotline = "400-682-8278";
				e.domain = "BOMA365.COM";
				e.aff = "http://aff.boma365.com";
				if (!e[d]) {
					b.debug("####未设置字典类型:contact/ key：" + d + "####");
					return ""
				}
				return e[d]
			},
			modal: function(d) {
				var e = {};
				e.login = "#modal-login";
				e.register = "#modal-register";
				e.promotion = "#modal-promotion";
				e.feedback = "#modal-feedback";
				e.findPwd = "#modal-findPwd";
				e.withdraw = "#modal-withdraw";
				e["promotion-lite"] = "#modal-promotion-lite";
				e["message-detail"] = "#modal-message-detail";
				if (!e[d]) {
					b.debug("####未设置字典类型:modal/ key：" + d + "####");
					return ""
				}
				return e[d]
			},
			kingBall: function(d) {
				var f = {};
				var e = window.location.host;
				f.service_mail = "CS@boma01.com";
				f.hotline = "400-682-8278";
				f.domain = (e.indexOf("www.") > -1) ? angular.uppercase(e.substr(4, e.length - 1)) : angular.uppercase(e);
				f.aff = (e.indexOf("www.") > -1) ? "http://aff." + e.substr(4, e.length - 1) : "http://aff." + e;
				if (!f[d]) {
					return null
				}
				return f[d]
			}
		}
	}])
})();
(function() {
	angular.module("game", []).factory("$$game", ["$log", "$cookies", "$$base", "$$request", "$timeout", "$$dic", "$sce", "$rootScope", function(l, d, k, f, a, b, g, j) {
		var e = 0;
		return {
			enterGameHall: function(o) {
				var n = angular.uppercase(o);
				var m = null;
				if ("GD" === n) {
					$tools.openWindow("#/casino/gd?in=1");
					return false
				}
				if ("AG" === n) {
					$tools.openWindow("#/casino/ag?in=1");
					return false
				}
				if ("BBIN" === n) {
					$tools.openWindow(b.conf("play_casino_bbin"));
					return false
				}
				if (["PT", "MG"].indexOf(n) > -1) {
					window.location.href = "#/slot/" + angular.lowercase(o);
					return false
				}
				if (n === "SB") {
					window.location.href = "#/sports";
					return false
				}
				if (n === "WBG") {
					$tools.openWindow("#/lottery/wbg?in=1");
					return false
				}
			},
			enterCasinoPF: function(m, n) {
				m.gameUrl = b.conf("play_casino_" + angular.lowercase(n));
				if (angular.uppercase(n) === "PT") {
					j.casino_pt = k.i18n("pt-casino");
					window.location.href = m.gameUrl;
					return false
				}
				if (angular.uppercase(n) === "BBIN") {
					$tools.openWindow(m.gameUrl);
					return false
				}
				if ($tools.getUrlParam("in") == 1) {
					m.showGameHall = true;
					a(function() {
						if ($(window).width() <= 1570) {
							$("iframe").width($(window).width() - 90)
						}
					}, 500);
					a(function() {
						m.gameUrl = g.trustAsResourceUrl(m.gameUrl);
						j.bg = "casino-if";
						j.miniMenu = true
					})
				} else {
					$tools.openWindow("#/casino/" + angular.lowercase(n) + "?in=1");
					window.location.href = "#/casino/"
				}
			},
			getHotGame: function(n) {
				var m = f.packageReq("game-hot", [++e], null, "GET", false, false);
				f.action(m, function(o) {
					n(o)
				})
			},
			getCollectedGame: function(n) {
				var m = f.packageReq("game-collected", null, null, "GET", false, false);
				f.action(m, function(o) {
					n(o)
				})
			},
			getSlotGames: function(n) {
				var m = f.packageReq("game-slot", null, null, "GET", false, false, 7);
				f.action(m, function(o) {
					n(o)
				})
			},
			getSlotPrizepool: function(n) {
				var m = f.packageReq("slot-prizepool", null, null, "GET", false, false, -1);
				f.action(m, function(o) {
					n(o)
				})
			},
			setFavorite: function(o, p) {
				var m = [o];
				var n = f.packageReq("set-collect", m, null, "PUT", false, false);
				f.action(n, function(q) {
					p(q)
				})
			}
		}
	}])
})();
(function() {
	angular.module("request", []).factory("$$request", ["$log", "$q", "$http", "$rootScope", "$cookies", "$$cache", "$$modal", function(g, d, j, a, e, b, f) {
		return {
			interfaceUrl: function(k) {
				var l = [];
				l.login = "api/user/login";
				l.register = "api/register";
				l["user-balance"] = "api/user/balance";
				l["user-info"] = "api/user/info";
				l["user-safety"] = "api/user/api_get_base_info";
				l["game-hot"] = "api/game/hot/$";
				l["game-collected"] = "api/collect";
				l["set-collect"] = "api/collect/$";
				l["game-slot"] = "api/game/slot";
				l["slot-prizepool"] = "api/game/prizepool";
				l["modify-pt-pwd"] = "api/pt/password";
				l["slot-luckguy"] = "api/game/get_max_winloss";
				l["pomotion-list"] = "dataJson/promotion.json";
				l["pomotion-desc"] = "api/promotion/$";
				l["bonus-list"] = "api/bonus/query";
				l["transfers-list"] = "api/transfers/query";
				l["withdrawal-list"] = "api/withdrawal/query";
				l["recharge-list"] = "api/recharge/query";
				l["betting-list"] = "api/betting/query";
				l.dictionary = "api/dic/$";
				l.recharge_payment = "/api/recharge/payment";
				l.onlinePay_s1 = "api/recharge/online";
				l.transPay = "api/recharge/bankTransfer";
				l.aliPay = "api/recharge/wxTransfer";
				l.withdraw = "api/withdrawal/save";
				l["withdraw-limit"] = "api/withdrawal/info";
				l.transfers = "api/transfers/save";
				l["change-pwd"] = "api/user/change_pwd";
				l["change-safety-pwd"] = "api/user/change_fundpassword";
				l["modify-info"] = "api/user/api_update_user_info";
				l["bind-realname"] = "api/user/bind_realname";
				l["get-mail-auth"] = "api/user/get_email_auth_code";
				l["bind-mail"] = "api/user/bind_email";
				l["bind-qa"] = "api/user/set_user_security";
				l["get-message"] = "api/message/inbox";
				l["delete-message"] = "api/message/delete";
				l["check-mail"] = "api/user/email_auth";
				l["change-mail"] = "api/user/change_mail";
				l.converter = "api/dic/get_map_value";
				l.checkQA = "api/user/answer_auth";
				l.feedback = "api/user/api_save_feedback";
				l["findPwd-1"] = "api/user/account";
				l["onekey-back"] = "api/user/api_balance_platform_to_center";
				l["check-url"] = "api/common/domain";
				l["read-message"] = "api/message/read";
				l["free-hotgames"] = "api/game/freehot";
				l.activity_window = "api/promotion/activity_window";
				l["get-banners"] = "api/common/banner";
				l["get-token"] = "api/user/randomcode";
				l["get-notice"] = "api/message/notice";
				l["get-bind-bankcard"] = "api/user/get_binding_bankcard";
				l["del-bind-bankcard"] = "api/user/del_binding_bankcard";
				if (!l[k]) {
					g.error("####未找到请求地址:" + k + "####");
					return
				}
				return l[k]
			},
			packageReq: function(s, t, o, k, n, p, l, m) {
				var r = {};
				r.url = this.interfaceUrl(s);
				r.method = k || "GET";
				if (!r.url) {
					return
				}
				var q = r.url.split("$");
				if (q.length > 1) {
					r.url = "";
					$.each(q, function(u, v) {
						if (q.length - 1 === u) {
							return
						}
						r.url += (v + t[u])
					})
				}
				r.data = (o) ? angular.copy(o) : "";
				if (m) {
					r.data.ioBB = $("#ioBB").val()
				}
				r.loading = n || false;
				r.errorProcess = p || false;
				if (l) {
					r.cache = {
						key: s,
						expires: l
					}
				}
				return r
			},
			action: function(l, n) {
				if (!l) {
					return
				}
				if (l.cache && b.get(l.cache.key)) {
					n(b.get(l.cache.key).data);
					return
				}
				if (l.loading) {
					f.loading()
				}
				var k = angular.copy(l);
				if (angular.isObject(k.data)) {
					k.data = angular.toJson(k.data)
				}
				var m = j({
					headers: {
						Api_version: "1.0",
						Api_type: "web",
						Authorization: a.sessionId
					},
					responseType: "json",
					method: k.method,
					url: encodeURI(k.url + "?tk=" + a.token + "&r=" + Math.ceil(Math.random() * 9999999999)),
					data: k.data,
				});
				d.all([m]).then(function(o) {
					if (k.loading) {
						f.loading()
					}
					if (o[0].status == 200) {
						if (!o[0].data || angular.isUndefined(o[0].data.status)) {
							g.error("###API返回值出错###");
							g.error("###API地址:" + k.url + "###");
							g.error("###response[0].data:" + angular.toJson(o[0].data) + "###");
							return
						}
						if (o[0].data.status === -1000) {
							e.remove("user");
							a.sessionId = null;
							a.user = undefined;
							if (window.location.href.indexOf("my") > -1) {
								window.location.href = "#/";
								return false
							}
							return false
						}
						if (o[0].data.status < 0 && !k.errorProcess) {
							f.alert(null, o[0].data.msg, "error");
							return
						}
						if (angular.isFunction(n)) {
							if (k.cache) {
								b.put(k.cache.key, o[0].data, k.cache.expires)
							}
							n(o[0].data)
						}
					} else {
						f.alert(null, o[0].data.msg, "error")
					}
				})
			}
		}
	}])
})();
(function() {
	angular.module("modal", []).controller("__modal", ["$scope", "$log", function($scope, $log) {
		$scope.data = {};
		$scope.callback = function(funcName) {
			if (!angular.isFunction(eval("this.$parent.$parent." + funcName))) {
				$log.error("####没有找到回调方法:" + funcName + "####");
				return
			}
			eval("this.$parent.$parent." + funcName + "($scope.data)")
		}
	}]).factory("$$modal", ["$log", "$$dic", "$$base", "$rootScope", function($log, $$dic, $$base, $rootScope) {
		return {
			tips: function(message, type) {
				type = type || "success";
				toastr.options = {
					closeButton: false,
					debug: false,
					positionClass: "toast-bottom-right",
				};
				toastr[type](message)
			},
			alert: function(title, message, type, confirmButtonText, callback) {
				type = type || "info";
				confirmButtonText = confirmButtonText || $$base.i18n("alert-btn-default-confirm");
				title = title || $$base.i18n("alert-title-default-" + type);
				swal({
					title: title,
					text: message,
					type: type,
					confirmButtonColor: "#DB182A",
					confirmButtonText: confirmButtonText,
				}, callback)
			},
			confirm: function(title, message, com_text, com_callback, cal_text, cal_callback, closeOnConfirm, closeOnCancel, showLoaderOnConfirm, inputType) {
				if (angular.isUndefined(closeOnConfirm)) {
					closeOnConfirm = true
				}
				if (angular.isUndefined(closeOnCancel)) {
					closeOnCancel = true
				}
				if (angular.isUndefined(showLoaderOnConfirm)) {
					showLoaderOnConfirm = false
				}
				title = title || $$base.i18n("alert-title-default-info");
				cal_text = cal_text || $$base.i18n("alert-btn-default-cancel");
				com_text = com_text || $$base.i18n("alert-btn-default-confirm");
				swal({
					title: title,
					text: message,
					type: "info",
					showCancelButton: true,
					confirmButtonText: com_text,
					cancelButtonText: cal_text,
					confirmButtonColor: "#DB182A",
					closeOnConfirm: closeOnConfirm,
					closeOnCancel: closeOnCancel,
					showLoaderOnConfirm: showLoaderOnConfirm,
				}, function(isConfirm) {
					if (isConfirm) {
						if (angular.isFunction(com_callback)) {
							com_callback()
						}
					} else {
						if (angular.isFunction(cal_callback)) {
							cal_callback()
						}
					}
				})
			},
			input: function(title, message, com_text, cal_text, inputPlaceholder, callback, inputType) {
				inputType = inputType || "text";
				com_text = com_text || $$base.i18n("alert-btn-default-confirm");
				cal_text = cal_text || $$base.i18n("alert-btn-default-cancel");
				title = title || $$base.i18n("alert-btn-default-confirm");
				swal({
					title: title,
					text: message,
					type: "input",
					showCancelButton: true,
					closeOnConfirm: false,
					animation: "slide-from-top",
					confirmButtonText: com_text,
					confirmButtonColor: "#DB182A",
					cancelButtonText: cal_text,
					closeOnCancel: true,
					inputPlaceholder: inputPlaceholder,
					showLoaderOnConfirm: true,
					inputType: inputType
				}, function(inputValue) {
					if (inputValue === false) {
						return
					}
					callback(swal, inputValue)
				})
			},
			popup: function(scope, modalName) {
				var modalId = $$dic.modal(modalName);
				if ($(modalId).length < 1) {
					this.alert(null, $$base.i18n("common-onloading"), "info");
					return
				}
				if (!modalId) {
					return
				}
				$(modalId).modal()
			},
			popupClose: function() {
				$(".md-overlay").click()
			},
			loading: function(disappearTime, type) {
				var t = this;
				if (type === "close" && $(".fakeloader").length > 0) {
					$("#fakeloader").fadeOut();
					$("#fakeloader").remove();
					return
				}
				if ($(".fakeloader").length === 0) {
					$(".fakeloader").fakeLoader({
						spinner: "spinner6"
					})
				} else {
					$("#fakeloader").fadeOut();
					$("#fakeloader").remove()
				}
				if (disappearTime) {
					window.setTimeout(function() {
						t.loading()
					}, disappearTime)
				}
			}
		}
	}])
})();
(function() {
	angular.module("my.service", []).factory("$$my", ["$log", "$$request", "$$dic", "$filter", "$rootScope", function(e, b, d, f, a) {
		return {
			delBindBankCard: function(j, k) {
				var g = b.packageReq("del-bind-bankcard", null, j, "POST", false, false);
				b.action(g, function(l) {
					k(l)
				})
			},
			getBindBankCard: function(j) {
				var g = b.packageReq("get-bind-bankcard", null, null, "GET", false, false);
				b.action(g, function(k) {
					j(k)
				})
			},
			readMesaage: function(j, k) {
				var g = b.packageReq("read-message", null, j, "POST", false, false);
				b.action(g, function(l) {
					k(l)
				})
			},
			onekeyBack: function(j) {
				var g = b.packageReq("onekey-back", null, null, "POST", false, false);
				b.action(g, function(k) {
					j(k)
				})
			},
			getUserByFindPwd: function(j, k) {
				var g = b.packageReq("findPwd-1", null, j, "POST", true, true);
				b.action(g, function(l) {
					k(l)
				})
			},
			checkQA: function(j, k) {
				var g = b.packageReq("checkQA", null, j, "POST", true, false);
				b.action(g, function(l) {
					k(l)
				})
			},
			changeMail: function(j, k) {
				var g = b.packageReq("change-mail", null, j, "POST", true, false);
				b.action(g, function(l) {
					k(l)
				})
			},
			checkOldMail: function(j, k) {
				var g = b.packageReq("check-mail", null, j, "POST", true, false);
				b.action(g, function(l) {
					k(l)
				})
			},
			deleteMessage: function(j, k) {
				var g = b.packageReq("delete-message", null, j, "POST", true, false);
				b.action(g, function(l) {
					k(l)
				})
			},
			getMessage: function(j, k) {
				var g = b.packageReq("get-message", null, j, "POST", false, false);
				b.action(g, function(l) {
					k(l)
				})
			},
			modifyInfo: function(j, k) {
				var g = b.packageReq("modify-info", null, j, "POST", true, false);
				b.action(g, function(l) {
					k(l)
				})
			},
			bindQa: function(j, k) {
				var g = b.packageReq("bind-qa", null, j, "POST", true, false);
				b.action(g, function(l) {
					k(l)
				})
			},
			bindMail: function(j, k) {
				var g = b.packageReq("bind-mail", null, j, "POST", true, false);
				b.action(g, function(l) {
					k(l)
				})
			},
			getMailAuth: function(j, k) {
				var g = b.packageReq("get-mail-auth", null, j, "POST", true, false);
				b.action(g, function(l) {
					k(l)
				})
			},
			bindRealName: function(j, k) {
				var g = b.packageReq("bind-realname", null, j, "POST", true, false);
				b.action(g, function(l) {
					k(l)
				})
			},
			changeSafetyPwd: function(j, k) {
				var g = b.packageReq("change-safety-pwd", null, j, "POST", true, false);
				b.action(g, function(l) {
					k(l)
				})
			},
			changeLoginPwd: function(j, k) {
				var g = b.packageReq("change-pwd", null, j, "POST", true, false);
				b.action(g, function(l) {
					k(l)
				})
			},
			transfers: function(j, k) {
				var g = b.packageReq("transfers", null, j, "POST", true, false);
				b.action(g, function(l) {
					k(l)
				})
			},
			getLimit: function(j) {
				var g = b.packageReq("withdraw-limit", null, null, "GET", false, false);
				b.action(g, function(k) {
					j(k)
				})
			},
			withdraw: function(j, k) {
				var g = b.packageReq("withdraw", null, j, "POST", true, false, false, true);
				b.action(g, function(l) {
					k(l)
				})
			},
			aliPay: function(j, k) {
				var g = b.packageReq("aliPay", null, j, "POST", true, false, false, true);
				b.action(g, function(l) {
					k(l)
				})
			},
			transPay: function(j, k) {
				var g = b.packageReq("transPay", null, j, "POST", true, false, false, true);
				b.action(g, function(l) {
					k(l)
				})
			},
			onlinePay_s1: function(j, k) {
				var g = b.packageReq("onlinePay_s1", null, j, "POST", true, false, false, true);
				b.action(g, function(l) {
					k(l)
				})
			},
			setSubTitle: function(l, j) {
				var k = d.conf("my-navs");
				var g = null;
				$.each(k, function(m, n) {
					$.each(n.children, function(o, p) {
						if (p.navId === l) {
							g = p[a.lang];
							return false
						}
					});
					if (g) {
						return false
					}
				});
				j.$emit("switchNav", l);
				return g
			},
			getRechargePayment: function(j) {
				var g = b.packageReq("recharge_payment", null, null, "GET", false, false);
				b.action(g, function(k) {
					j(k)
				})
			},
			getSearchDatas: function(g, j, l) {
				var k = null;
				if (angular.isUndefined(j.sum)) {
					j.sum = 1;
					j.startDate = j.startDate || f("date")(new Date(), "yyyy-MM-dd");
					j.endDate = j.endDate || f("date")(new Date(), "yyyy-MM-dd")
				}
				switch (g) {
				case "bonus":
					this.getBonus(j, function(m) {
						k = {
							data: m.data.list,
							counts: m.data.counts,
							template: "table/bonus.html",
							total: m.data.total
						};
						l(k)
					});
					break;
				case "transfers":
					this.getTransfers(j, function(m) {
						k = {
							data: m.data.list,
							counts: m.data.counts,
							total: m.data.total,
							template: "table/transfers.html"
						};
						l(k)
					});
					break;
				case "withdraw":
					this.getWithdrawal(j, function(m) {
						k = {
							data: m.data.list,
							counts: m.data.counts,
							total: m.data.total,
							template: "table/withdrawal.html"
						};
						l(k)
					});
					break;
				case "recharge":
					this.getCharge(j, function(m) {
						k = {
							data: m.data.list,
							counts: m.data.counts,
							total: m.data.total,
							template: "table/recharge.html"
						};
						l(k)
					});
					break;
				case "betting":
					this.getBetting(j, function(m) {
						k = {
							data: m.data.list,
							counts: m.data.counts,
							total_bet: m.data.total_bet,
							total_winloss: m.data.total_winloss,
							template: "table/betting.html"
						};
						l(k)
					});
					break
				}
			},
			getBonus: function(j, k) {
				var g = b.packageReq("bonus-list", null, j, "POST", false, false);
				b.action(g, function(l) {
					k(l)
				})
			},
			getTransfers: function(j, k) {
				var g = b.packageReq("transfers-list", null, j, "POST", false, false);
				b.action(g, function(l) {
					k(l)
				})
			},
			getWithdrawal: function(j, k) {
				var g = b.packageReq("withdrawal-list", null, j, "POST", false, false);
				b.action(g, function(l) {
					k(l)
				})
			},
			getCharge: function(j, k) {
				var g = b.packageReq("recharge-list", null, j, "POST", false, false);
				b.action(g, function(l) {
					k(l)
				})
			},
			getBetting: function(j, k) {
				var g = b.packageReq("betting-list", null, j, "POST", false, false);
				b.action(g, function(l) {
					k(l)
				})
			}
		}
	}])
})();
(function() {
	angular.module("slot.service", []).factory("$$slot", ["$log", "$cookies", "$$request", "$rootScope", function(e, d, b, a) {
		return {
			modifyPTPwd: function(g, j) {
				var f = b.packageReq("modify-pt-pwd", null, {
					password: g
				}, "PUT", false, false);
				b.action(f, function(k) {
					j(k)
				})
			},
			getSlotLuckGuy: function(g) {
				var f = b.packageReq("slot-luckguy", null, null, "GET", false, false, -1);
				b.action(f, function(j) {
					g(j)
				})
			},
		}
	}])
})();
(function() {
	angular.module("static.service", []).factory("$$res", ["$log", function(a) {
		return {
			md5: function(b) {
				var d = {};
				d["/zh-cn/modal/login/login_icon.png"] = "cd9b52ae";
				d["/zh-cn/pt/luck_user.png"] = "d747efbc";
				d["/zh-cn/pt/more_games.png"] = "2d540742";
				d["/zh-cn/pt/prizepool.png"] = "c6a3ea31";
				d["/zh-cn/pt/client-download.png"] = "ad91d5aa";
				d["/zh-cn/lottery/panel1.jpg"] = "281a7844";
				d["/zh-cn/lottery/bg.jpg"] = "ea1f08fc";
				d["/zh-cn/lottery/panel2.jpg"] = "d4f2571a";
				d["/zh-cn/casino/bg.jpg"] = "cbba9831";
				d["/zh-cn/domain/bg.jpg"] = "4c80420d";
				d["/zh-cn/domain/textbg.png"] = "14235d07";
				d["/zh-cn/promotion/nav1.png"] = "b1c09891";
				d["/zh-cn/promotion/bg.jpg"] = "4007e311";
				d["/zh-cn/promotion/close-h.png"] = "2a724ca3";
				d["/zh-cn/promotion/nav.png"] = "ae30287d";
				d["/zh-cn/promotion/close.png"] = "288085ce";
				d["/zh-cn/promotion/nav2.png"] = "389c13d3";
				d["/zh-cn/promotion/nav3.png"] = "fbc46f47";
				d["/zh-cn/promotion/nav4.png"] = "0ff9108";
				d["/zh-cn/header/dropmenu-lo.png"] = "ce6cd402";
				d["/zh-cn/header/dropmenu-pt.png"] = "efdae2ee";
				d["/zh-cn/header/dropmenu-ag.png"] = "41f392a5";
				d["/zh-cn/header/dropmenu-sb.png"] = "4b3f68d8";
				d["/zh-cn/banners/slot.jpg"] = "a3d0b764";
				d["/zh-cn/banners/lottery.jpg"] = "8fb8cdaf";
				d["/zh-cn/banners/1.jpg"] = "45272040";
				d["/zh-cn/banners/casino.jpg"] = "45272040";
				d["/zh-cn/banners/client.jpg"] = "5c551dd2";
				d["/zh-cn/banners/0.jpg"] = "8d733a01";
				d["/zh-cn/banners/spread.jpg"] = "8d733a01";
				d["/zh-cn/banners/3.jpg"] = "a3d0b764";
				d["/zh-cn/banners/2.jpg"] = "8fb8cdaf";
				d["/zh-cn/footer/icon_service.png"] = "b64634d2";
				d["/zh-cn/footer/icon_phone.png"] = "82a01f4c";
				d["/zh-cn/footer/icon_mail.png"] = "167405d5";
				d["/zh-cn/footer/license.png"] = "4169dc60";
				d["/zh-cn/sports/sport_android.png"] = "18d5640c";
				d["/zh-cn/sports/bg.jpg"] = "546bf6e4";
				d["/zh-cn/sports/arrow.png"] = "f6dfdc71";
				d["/zh-cn/sports/sport_apple.png"] = "fbb69be7";
				d["/zh-cn/help/arrow-top.png"] = "47de435d";
				d["/zh-cn/help/help.png"] = "ee4588a5";
				d["/zh-cn/help/arrow-down.png"] = "80adbd15";
				d["/zh-cn/help/point.png"] = "5b28528a";
				d["/zh-cn/common/default_promotion.png"] = "b7e53496";
				d["/zh-cn/common/setp_changeMail.png"] = "b49906bd";
				d["/zh-cn/common/setp_foundPwd.png"] = "68953c9e";
				d["/zh-cn/common/setp_changeQA.png"] = "c4a9537d";
				d["/zh-cn/common/service_hover.png"] = "5233830f";
				d["/zh-cn/common/statusBar.png"] = "2360e0bb";
				d["/zh-cn/common/change_hover.png"] = "e4ed0a6f";
				d["/zh-cn/common/default-bg2.png"] = "b7e53496";
				d["/zh-cn/common/change.png"] = "415d8e52";
				d["/zh-cn/common/label-spread.png"] = "b0ab13cb";
				d["/zh-cn/common/default-bg3.png"] = "6a32f868";
				d["/zh-cn/common/logo.png"] = "09c01fb7";
				d["/zh-cn/common/logo1.png"] = "09c01fb7";
				d["/zh-cn/common/default-bg.png"] = "344dbc35";
				d["/zh-cn/common/x.png"] = "2992f9c7";
				d["/zh-cn/common/service.png"] = "2284be9e";
				d["/zh-cn/common/default_collect.png"] = "39ed8da7";
				d["/zh-cn/common/labels.png"] = "f1cea8cb";
				d["/zh-cn/client/sb-text.png"] = "adff8004";
				d["/zh-cn/client/pt-pic.jpg"] = "e2115840";
				d["/zh-cn/client/boma-text.png"] = "d4b06cae";
				d["/zh-cn/client/sb-pic.png"] = "6d69092c";
				d["/zh-cn/client/pt-acc.jpg"] = "e0933045";
				d["/zh-cn/client/ag-text.png"] = "64766a42";
				d["/zh-cn/client/boma-pic.jpg"] = "9bf59631";
				d["/zh-cn/client/ag-pic.jpg"] = "d94ce012";
				d["/zh-cn/client/pt-text.png"] = "59263a13";
				d["/zh-cn/client/banner.jpg"] = "5c551dd2";
				d["/zh-cn/user/icon_game.jpg"] = "ddae97a2";
				d["/zh-cn/user/select_arrow.png"] = "1cb2d7de";
				d["/zh-cn/user/select_arrow.jpg"] = "97e349c2";
				d["/zh-cn/index/c_3.png"] = "0cc86681";
				d["/zh-cn/index/cw_3.png"] = "5407061e";
				d["/zh-cn/index/c_4.png"] = "ee2cf439";
				d["/zh-cn/index/bg.jpg"] = "e2436ca5";
				d["/zh-cn/index/cw_3_1.png"] = "1bee8e09";
				d["/zh-cn/index/cw_2.png"] = "974c69f4";
				d["/zh-cn/index/cw_1_1.png"] = "fc1b565d";
				d["/zh-cn/index/c_2.png"] = "01636aa0";
				d["/zh-cn/index/c_1.png"] = "5a91a542";
				d["/zh-cn/index/cw_4.png"] = "505d72e2";
				d["/zh-cn/index/copywriter_1.png"] = "08166b4e";
				d["/zh-cn/index/cw_1.png"] = "084c6ca0";
				d["/zh-cn/index/cw_2_1.png"] = "b0161bb7";
				d["/zh-cn/index/cw_4_1.png"] = "ea716de1";
				d["/zh-cn/speed/brobg.png"] = "70671151";
				d["/zh-cn/speed/xlcebj.png"] = "a414f7fd";
				d["/zh-cn/speed/bg.png"] = "76527a8";
				d["/zh-cn/speed/bigbg.jpg"] = "8660c51f";
				d["/zh-cn/my/withdraw-detail.png"] = "f1c74fb9";
				d["/zh-cn/my/change.png"] = "414772e1";
				d["/zh-cn/my/msg-detail.png"] = "78925bee";
				d["/zh-cn/my/my_icon.png"] = "b1afa720";
				d["/zh-cn/my/recover.png"] = "94c6dfd4";
				d["/zh-cn/gamerule/bbin-game.png"] = "0165f5b8";
				d["/zh-cn/gamerule/gamerule.png"] = "803613dc";
				d["/zh-cn/gamerule/gd-game.png"] = "f6122d06";
				d["/zh-cn/gamerule/ag-game.png"] = "dad384b";
				d["/zh-cn/gamerule/pt-game.png"] = "4295029e";
				d["/zh-cn/solt/icon/prizepool_icon4.png"] = "659ce56";
				d["/zh-cn/solt/icon/prizepool_icon3.png"] = "4d709825";
				d["/zh-cn/solt/icon/prizepool_icon1.png"] = "130b5ca0";
				d["/zh-cn/solt/icon/prizepool_icon2.png"] = "a41a5ed9";
				d["/zh-cn/solt/try.png"] = "20a5a511";
				d["/common/unfavorite.png"] = "138bc74d";
				d["/common/pt/game_icon/cnf Scratch.jpg"] = "8ad15353";
				d["/common/bell.png"] = "6ba4c6b4";
				d["/common/casino/ag.png"] = "63f7e3f5";
				d["/common/casino/GD/3.png"] = "5019c768";
				d["/common/casino/GD/2.png"] = "2e1ae9a2";
				d["/common/casino/GD/4.png"] = "230c37b6";
				d["/common/casino/GD/5.png"] = "d64dff58";
				d["/common/casino/GD/1.png"] = "ada44ecd";
				d["/common/casino/AG/3.png"] = "9e30af59";
				d["/common/casino/AG/7.png"] = "773ba517";
				d["/common/casino/AG/2.png"] = "271fcf80";
				d["/common/casino/AG/4.png"] = "6f0952a";
				d["/common/casino/AG/6.png"] = "d64dff58";
				d["/common/casino/AG/5.png"] = "2a8200e4";
				d["/common/casino/AG/1.png"] = "01047d6e";
				d["/common/casino/PT/8.png"] = "c7c04699";
				d["/common/casino/PT/3.png"] = "c88cd90e";
				d["/common/casino/PT/7.png"] = "68285b40";
				d["/common/casino/PT/2.png"] = "39c305a7";
				d["/common/casino/PT/4.png"] = "2f667044";
				d["/common/casino/PT/6.png"] = "1b1d6fd9";
				d["/common/casino/PT/5.png"] = "9e52b5f5";
				d["/common/casino/PT/1.png"] = "b69b9521";
				d["/common/casino/pt.png"] = "743582fd";
				d["/common/casino/left.png"] = "bbb2da55";
				d["/common/casino/gd.png"] = "d7ab074";
				d["/common/casino/bbin.png"] = "1145a9e6";
				d["/common/casino/right.png"] = "850d082b";
				d["/common/casino/BBIN/8.png"] = "c50f283f";
				d["/common/casino/BBIN/3.png"] = "773ba517";
				d["/common/casino/BBIN/7.png"] = "271fcf80";
				d["/common/casino/BBIN/2.png"] = "d64dff58";
				d["/common/casino/BBIN/4.png"] = "2a5dbf76";
				d["/common/casino/BBIN/10.png"] = "98764512";
				d["/common/casino/BBIN/6.png"] = "20de3f78";
				d["/common/casino/BBIN/11.png"] = "cd70fb79";
				d["/common/casino/BBIN/5.png"] = "afe6d6a1";
				d["/common/casino/BBIN/1.png"] = "2a8200e4";
				d["/common/casino/BBIN/9.png"] = "8d024a3f";
				d["/common/refresh_s.png"] = "36e84e5a";
				d["/common/arrow-l.png"] = "e56655ac";
				d["/common/lunchuan.png"] = "698d25fa";
				d["/common/pfs/WBG.png"] = "23423687";
				d["/common/pfs/BBIN.png"] = "714e1afc";
				d["/common/pfs/GD.png"] = "6e73c2f9";
				d["/common/pfs/PT.png"] = "72f42af9";
				d["/common/pfs/MG.png"] = "5cc4ca17";
				d["/common/pfs/AG.png"] = "d77c0502";
				d["/common/pfs/SB.png"] = "8abc6836";
				d["/common/mggames/FortuneCookie.jpg"] = "4af9d11f";
				d["/common/mggames/TripleMagic.jpg"] = "4923ddc8";
				d["/common/mggames/Major-Millions.jpg"] = "8e6f4769";
				d["/common/mggames/Dragon-Dance.jpg"] = "5c1f84e0";
				d["/common/mggames/red-hot-devil.jpg"] = "81b0a4f0";
				d["/common/mggames/lucky-twins.jpg"] = "918513be";
				d["/common/mggames/CouchPotato.jpg"] = "0b44c6b9";
				d["/common/mggames/Keno.jpg"] = "de252d97";
				d["/common/mggames/TigerMoon.jpg"] = "35b91d63";
				d["/common/mggames/MonsterMania.jpg"] = "888bc92f";
				d["/common/mggames/CrazyChameleons.jpg"] = "950afb83";
				d["/common/mggames/CoolWolf.jpg"] = "8cb9ddf4";
				d["/common/mggames/HappyHolidays.jpg"] = "348eb9c1";
				d["/common/mggames/LadyinRed.jpg"] = "16518f23";
				d["/common/mggames/SpectacularWheelofWealth.jpg"] = "25f3f35a";
				d["/common/mggames/DoubleJoker.jpg"] = "60d33fb4";
				d["/common/mggames/SpringBreak.jpg"] = "e6458f2e";
				d["/common/mggames/bikini-party.jpg"] = "f1e48c74";
				d["/common/mggames/ReelThunder.jpg"] = "2af2f1da";
				d["/common/mggames/Cashapillar.jpg"] = "6fa05dba";
				d["/common/mggames/JasonandtheGoldenFleece.jpg"] = "6fc332c3";
				d["/common/mggames/RRQueenOfHeart.jpg"] = "f2c2bd5e";
				d["/common/mggames/KittyCabana.jpg"] = "216920a3";
				d["/common/mggames/Serenity.jpg"] = "3ea0b28e";
				d["/common/mggames/Carnaval.jpg"] = "d03b0b83";
				d["/common/mggames/Peek-a-boo.jpg"] = "c47d6bd1";
				d["/common/mggames/DoubleDoubleBonus.jpg"] = "60f0f2a4";
				d["/common/mggames/FootballStar.jpg"] = "4e384450";
				d["/common/mggames/GopherGold.jpg"] = "8f1a2f4d";
				d["/common/mggames/BigTop.jpg"] = "a94b8118";
				d["/common/mggames/TallyHo.jpg"] = "d0bd620";
				d["/common/mggames/avalon.jpg"] = "ecabb53e";
				d["/common/mggames/CashCrazy.jpg"] = "50f2ffb6";
				d["/common/mggames/DoubleMagic.jpg"] = "c06be95";
				d["/common/mggames/HoundHotel.jpg"] = "196a7e20";
				d["/common/mggames/RacingforPinks.jpg"] = "04b4c262";
				d["/common/mggames/SilverFang.jpg"] = "ee9c8333";
				d["/common/mggames/FruitSlots.jpg"] = "44d19611";
				d["/common/mggames/basketballstar.jpg"] = "db0f6931";
				d["/common/mggames/Secret-Admirer.jpg"] = "c8d0b619";
				d["/common/mggames/ReelStrike.jpg"] = "642bdf8d";
				d["/common/mggames/King-Cashalot.jpg"] = "27b6de83";
				d["/common/mggames/TheTwistedCircus.jpg"] = "6187a18c";
				d["/common/mggames/JurassicJackpot.jpg"] = "7ce1b49";
				d["/common/mggames/WowPot.jpg"] = "1915203d";
				d["/common/mggames/5reeldrive.jpg"] = "38a1766e";
				d["/common/mggames/LeaguesofFortune.jpg"] = "8b56a02a";
				d["/common/mggames/RivieraRiches.jpg"] = "ba251712";
				d["/common/mggames/JokerPoker.jpg"] = "e469a4aa";
				d["/common/mggames/avalonII-QuestforTheGrail.jpg"] = "424af90d";
				d["/common/mggames/Mega-Moolah.jpg"] = "ac4f91e7";
				d["/common/mggames/108heroes.jpg"] = "a673d840";
				d["/common/mggames/untamedcrownedeagle.jpg"] = "85065b70";
				d["/common/mggames/StarDust.jpg"] = "082719cb";
				d["/common/mggames/Craps.jpg"] = "aeaacf6d";
				d["/common/mggames/CrownandAnchor.jpg"] = "eb7c6e4b";
				d["/common/mggames/DeucesandJoker.jpg"] = "a175621b";
				d["/common/mggames/GreatGriffin.jpg"] = "a23a51fb";
				d["/common/mggames/Golden-Era.jpg"] = "c9d7b6c5";
				d["/common/mggames/BustTheBank.jpg"] = "dce1e18d";
				d["/common/mggames/RomanRiches.jpg"] = "ab87c2ce";
				d["/common/mggames/SecretAdmirer.jpg"] = "bafa059e";
				d["/common/mggames/Starlight-Kiss.jpg"] = "365aa796";
				d["/common/mggames/SantasWildRide.jpg"] = "6e7a7335";
				d["/common/mggames/LotsALoot-5-Reel.jpg"] = "8fec9e1";
				d["/common/mggames/Fantastic7s.jpg"] = "2884f2b0";
				d["/common/mggames/RhymingReelsHeartsTarts.jpg"] = "730df122";
				d["/common/mggames/WinningWizards.jpg"] = "9a3e3b91";
				d["/common/mggames/Thunderstruck.jpg"] = "1aecdf75";
				d["/common/mggames/acesandfaces.jpg"] = "e2424ea6";
				d["/common/mggames/CashClams.jpg"] = "3482d711";
				d["/common/mggames/HotInk.jpg"] = "f52f05b9";
				d["/common/mggames/barbarsheep.jpg"] = "99b2d6b4";
				d["/common/mggames/HighLimitBaccarat.jpg"] = "c9b15eef";
				d["/common/mggames/UntamedBengalTiger.jpg"] = "b7e5e9b9";
				d["/common/mggames/TensorBetter.jpg"] = "6bb83d31";
				d["/common/mggames/DoubleWammy.jpg"] = "c1dc2008";
				d["/common/mggames/TheFinerReelsofLife.jpg"] = "a6ce34c3";
				d["/common/mggames/WesternFrontier.jpg"] = "281ec40f";
				d["/common/mggames/VinylCountdown.jpg"] = "a474f1d2";
				d["/common/mggames/CashSplash-5-Reel.jpg"] = "f4f6f148";
				d["/common/mggames/MagicBoxes.jpg"] = "3ffc71b5";
				d["/common/mggames/LuckyKoi.jpg"] = "0be77bfd";
				d["/common/mggames/SunTide.jpg"] = "ec4d3420";
				d["/common/mggames/Burning-Desire.jpg"] = "c2e6125e";
				d["/common/mggames/TombRaider.jpg"] = "67902cef";
				d["/common/mggames/Ariana.jpg"] = "a377cb4c";
				d["/common/mggames/JacksorBetter.jpg"] = "44ed697b";
				d["/common/mggames/LuckyZodiac.jpg"] = "eb6f24e0";
				d["/common/mggames/loosecannon.jpg"] = "b105353c";
				d["/common/mggames/BigChef.jpg"] = "17ce59bf";
				d["/common/mggames/WildOrient.jpg"] = "7a5d32ee";
				d["/common/mggames/Lady-in-Red.jpg"] = "4c5378da";
				d["/common/mggames/DolphinQuest.jpg"] = "4284b1e0";
				d["/common/mggames/GoldenDragon.jpg"] = "f3ede910";
				d["/common/mggames/SkullDuggery.jpg"] = "b1c021bf";
				d["/common/mggames/RhymingReelsJackandJill.jpg"] = "884a3e0e";
				d["/common/mggames/SunQuest.jpg"] = "ba10bd68";
				d["/common/mggames/SweetHarvest.jpg"] = "d00d6e4d";
				d["/common/mggames/DeucesWild.jpg"] = "d3dd874d";
				d["/common/mggames/TheJoyofSix.jpg"] = "847ce680";
				d["/common/mggames/Fruit-Fiesta-3-Reel.jpg"] = "43b2bc21";
				d["/common/mggames/HoHoHo.jpg"] = "d6502fe5";
				d["/common/mggames/Treasure-Nile.jpg"] = "34294d3a";
				d["/common/mggames/UntamedGiantPanda.jpg"] = "aa6d3c08";
				d["/common/mggames/TombRaiderII.jpg"] = "17144cb2";
				d["/common/mggames/Doctor-love.jpg"] = "fdb54680";
				d["/common/mggames/BreakAway.jpg"] = "d477c592";
				d["/common/mggames/MermaidsMillions.jpg"] = "f9732d01";
				d["/common/mggames/HotAsHades.jpg"] = "145f7abe";
				d["/common/mggames/OrientalFortune.jpg"] = "ea476a97";
				d["/common/mggames/Fruit-Fiesta-5-Reel.jpg"] = "bbe28924";
				d["/common/mggames/UntamedWolfPack.jpg"] = "39ea6a05";
				d["/common/mggames/GeniesGems.jpg"] = "213ad7bd";
				d["/common/mggames/CashSplash-3-Reel.jpg"] = "567b431c";
				d["/common/mggames/HighLimitEuropeanBlackjack.jpg"] = "cf39087d";
				d["/common/mggames/LadiesNite.jpg"] = "95c74ab0";
				d["/common/mggames/StarlightKiss.jpg"] = "00bea7e2";
				d["/common/mggames/CyberstudPoker.jpg"] = "b5a90be9";
				d["/common/mggames/ReelGems.jpg"] = "465f13fe";
				d["/common/mggames/Love-Bugs.jpg"] = "c3f2f6db";
				d["/common/mggames/LotsALoot-3-Reel.jpg"] = "de8a634e";
				d["/common/mggames/Mega-Moolah-Isis.jpg"] = "4468e8ee";
				d["/common/mggames/CoolBuck.jpg"] = "17991cf4";
				d["/common/mggames/Moonshine.jpg"] = "b5c5762f";
				d["/common/mggames/Untamed-Giant-Panda.jpg"] = "84ba8119";
				d["/common/mggames/GirlswithGunsJungleHeat.jpg"] = "62f94b4f";
				d["/common/mggames/Pistoleras.jpg"] = "c591b74";
				d["/common/mggames/cricketStar.jpg"] = "7fe57fcb";
				d["/common/mggames/ImmortalRomance.jpg"] = "49ef4142";
				d["/common/mggames/Tunzamunni.jpg"] = "c2c05328";
				d["/common/mggames/DrWattsUp.jpg"] = "c936730";
				d["/common/mggames/Scrooge.jpg"] = "45a30638";
				d["/common/mggames/CosmicCat.jpg"] = "2d24b01f";
				d["/common/mggames/RetroReelsDiamondGlitz.jpg"] = "0ca6caee";
				d["/common/mggames/BreakDaBankAgain.jpg"] = "530bf0bd";
				d["/common/mggames/RetroReels.jpg"] = "5f9b30e";
				d["/common/aboutus-min/3.png"] = "63349490";
				d["/common/aboutus-min/dot.png"] = "f3cd07b4";
				d["/common/aboutus-min/bg4.jpg"] = "de03adad";
				d["/common/aboutus-min/bg2.jpg"] = "a18d5342";
				d["/common/aboutus-min/2.png"] = "247cc0d3";
				d["/common/aboutus-min/hover/ag.png"] = "558f40d3";
				d["/common/aboutus-min/hover/sb.png"] = "9cbd0a68";
				d["/common/aboutus-min/hover/wbg.png"] = "1cfebe3b";
				d["/common/aboutus-min/hover/pt.png"] = "e666f563";
				d["/common/aboutus-min/hover/gd.png"] = "7607a992";
				d["/common/aboutus-min/hover/mg.png"] = "c0a05299";
				d["/common/aboutus-min/hover/bbin.png"] = "f3265782";
				d["/common/aboutus-min/4.png"] = "ed242bcc";
				d["/common/aboutus-min/arrow-up.png"] = "47302f3a";
				d["/common/aboutus-min/bg1.jpg"] = "369459cf";
				d["/common/aboutus-min/bg3.jpg"] = "e63985bb";
				d["/common/aboutus-min/6.jpg"] = "0a4027d2";
				d["/common/aboutus-min/purezone.png"] = "088dee0d";
				d["/common/aboutus-min/normal/ag.png"] = "f384ce7";
				d["/common/aboutus-min/normal/sb.png"] = "24b86872";
				d["/common/aboutus-min/normal/wbg.png"] = "81f93c20";
				d["/common/aboutus-min/normal/pt.png"] = "2a8bd564";
				d["/common/aboutus-min/normal/gd.png"] = "e89e48b7";
				d["/common/aboutus-min/normal/mg.png"] = "55f51e89";
				d["/common/aboutus-min/normal/bbin.png"] = "2a07a87f";
				d["/common/aboutus-min/footer.jpg"] = "daca0520";
				d["/common/aboutus-min/arrow-down.png"] = "b23a71cb";
				d["/common/aboutus-min/Thumbs.db"] = "6de1aeda";
				d["/common/aboutus-min/5.png"] = "e4a53022";
				d["/common/aboutus-min/stone.png"] = "091ea7c8";
				d["/common/aboutus-min/1.png"] = "2d8941b3";
				d["/common/aboutus-min/12years.png"] = "a1f63bc";
				d["/common/aboutus-min/newboma.png"] = "75e2ce7a";
				d["/common/aboutus-min/first.png"] = "e0d9d736";
				d["/common/search.png"] = "e853c91a";
				d["/common/sports/close_h.png"] = "f67fe6e";
				d["/common/sports/sb_QR.jpg"] = "2748c713";
				d["/common/sports/close.png"] = "82ae330d";
				d["/common/video.png"] = "6d33eabb";
				d["/common/favorite.png"] = "072fe2a0";
				d["/common/panel/r.png"] = "61fedc7b";
				d["/common/panel/l.png"] = "3e28cef5";
				d["/common/panel/l_hover.png"] = "91f16ded";
				d["/common/panel/c.png"] = "eed6f0dd";
				d["/common/panel/r_hover.png"] = "9b4ff616";
				d["/common/panel/c_hover.png"] = "990ac819";
				d["/common/arrow-d.png"] = "e9ea34c0";
				d["/common/ptgames/er.jpg"] = "83c408bd";
				d["/common/ptgames/gtspwzsc.jpg"] = "f01e5178";
				d["/common/ptgames/gts35.jpg"] = "4be34f0e";
				d["/common/ptgames/pon_mh5.jpg"] = "d9e7f536";
				d["/common/ptgames/nk.jpg"] = "5dac18f0";
				d["/common/ptgames/gts48.jpg"] = "5e8ee4ce";
				d["/common/ptgames/bld.jpg"] = "8629c358";
				d["/common/ptgames/gtslgms.jpg"] = "fbbca2ee";
				d["/common/ptgames/rps.jpg"] = "57e4c13a";
				d["/common/ptgames/drd.jpg"] = "b08b0ec";
				d["/common/ptgames/bj21d_mh.jpg"] = "64c4d8f4";
				d["/common/ptgames/ttcsc.jpg"] = "a76b7750";
				d["/common/ptgames/eas.jpg"] = "74c4a4dd";
				d["/common/ptgames/irm2.jpg"] = "066d0b84";
				d["/common/ptgames/kkgsc.jpg"] = "541549f6";
				d["/common/ptgames/bt.jpg"] = "2797890a";
				d["/common/ptgames/fm.jpg"] = "950f126a";
				d["/common/ptgames/ghl.jpg"] = "df15921d";
				d["/common/ptgames/pmn.jpg"] = "71b9d6c2";
				d["/common/ptgames/dlm.jpg"] = "8696e901";
				d["/common/ptgames/jb4.jpg"] = "c8a6d4e2";
				d["/common/ptgames/cheaa.jpg"] = "43888dd1";
				d["/common/ptgames/gtswng.jpg"] = "e5dfd5d7";
				d["/common/ptgames/gtscnasc.jpg"] = "71a4099b";
				d["/common/ptgames/ttl.jpg"] = "9ca0180d";
				d["/common/ptgames/bjhd_mh5.jpg"] = "5bbfd088";
				d["/common/ptgames/fnf50.jpg"] = "e11c42ef";
				d["/common/ptgames/atw.jpg"] = "866740e5";
				d["/common/ptgames/cm.jpg"] = "164bace4";
				d["/common/ptgames/frm.jpg"] = "4134a665";
				d["/common/ptgames/tr.jpg"] = "e1a0f2d3";
				d["/common/ptgames/rd.jpg"] = "4693cb45";
				d["/common/ptgames/car.jpg"] = "121930ac";
				d["/common/ptgames/rop.jpg"] = "ae9194e3";
				d["/common/ptgames/sib.jpg"] = "f451cbe3";
				d["/common/ptgames/trm.jpg"] = "10e9d09f";
				d["/common/ptgames/gts37.jpg"] = "f340020f";
				d["/common/ptgames/hlk50.jpg"] = "e63c5b51";
				d["/common/ptgames/rofl.jpg"] = "e3991092";
				d["/common/ptgames/qop.jpg"] = "8c9f4b7a";
				d["/common/ptgames/gtstrmsc.jpg"] = "c4ef12b3";
				d["/common/ptgames/essc.jpg"] = "0d57319a";
				d["/common/ptgames/bj_mh5.jpg"] = "625def0c";
				d["/common/ptgames/frr_g.jpg"] = "de00112d";
				d["/common/ptgames/bowl.jpg"] = "1954a8fb";
				d["/common/ptgames/op.jpg"] = "510dacf7";
				d["/common/ptgames/ah2.jpg"] = "7020bfa9";
				d["/common/ptgames/dnr.jpg"] = "fba2b324";
				d["/common/ptgames/c7.jpg"] = "9b9385aa";
				d["/common/ptgames/glg.jpg"] = "cc68789c";
				d["/common/ptgames/spidc.jpg"] = "42c98e20";
				d["/common/ptgames/ba.jpg"] = "93f646ce";
				d["/common/ptgames/ttc.jpg"] = "a76b7750";
				d["/common/ptgames/gtspor.jpg"] = "c610c80";
				d["/common/ptgames/bib.jpg"] = "69becb2b";
				d["/common/ptgames/hljb.jpg"] = "42e2a01a";
				d["/common/ptgames/bjs.jpg"] = "bd2ff390";
				d["/common/ptgames/vbal.jpg"] = "e0532c53";
				d["/common/ptgames/mro.jpg"] = "f8d4586f";
				d["/common/ptgames/ro_g.jpg"] = "72972d1e";
				d["/common/ptgames/tp.jpg"] = "8952ba3a";
				d["/common/ptgames/mcb.jpg"] = "4034a1bc";
				d["/common/ptgames/hlf.jpg"] = "21eb56e8";
				d["/common/ptgames/elr.jpg"] = "65c03e50";
				d["/common/ptgames/cwc.jpg"] = "e20569d8";
				d["/common/ptgames/hlk.jpg"] = "f82a198";
				d["/common/ptgames/dt.jpg"] = "e0041c29";
				d["/common/ptgames/rodz_g.jpg"] = "a08ef43";
				d["/common/ptgames/jb.jpg"] = "f3e271ad";
				d["/common/ptgames/dw4.jpg"] = "a5c21fa4";
				d["/common/ptgames/pl.jpg"] = "5459666f";
				d["/common/ptgames/dctw.jpg"] = "a354290f";
				d["/common/ptgames/gtsgoc.jpg"] = "83dfe69d";
				d["/common/ptgames/gtsdrdv.jpg"] = "6912824b";
				d["/common/ptgames/fnf.jpg"] = "d033be42";
				d["/common/ptgames/bbn.jpg"] = "b786ce6f";
				d["/common/ptgames/cam.jpg"] = "1d6507f";
				d["/common/ptgames/irm50.jpg"] = "a9f6d445";
				d["/common/ptgames/amvp.jpg"] = "8f6d3866";
				d["/common/ptgames/lom.jpg"] = "c5376b67";
				d["/common/ptgames/tst.jpg"] = "48ba5d4d";
				d["/common/ptgames/gtssmbr.jpg"] = "5252ebfd";
				d["/common/ptgames/sbj.jpg"] = "014618a0";
				d["/common/ptgames/tqp.jpg"] = "f8a5130d";
				d["/common/ptgames/ssp.jpg"] = "7e9ce920";
				d["/common/ptgames/hsd.jpg"] = "cd721e3";
				d["/common/ptgames/kn.jpg"] = "febfb442";
				d["/common/ptgames/glrj.jpg"] = "407bff02";
				d["/common/ptgames/wis.jpg"] = "9d56f603";
				d["/common/ptgames/fbm.jpg"] = "c6fd238f";
				d["/common/ptgames/pg.jpg"] = "03dcee25";
				d["/common/ptgames/gts5.jpg"] = "1e563be1";
				d["/common/ptgames/gog.jpg"] = "860e2ecb";
				d["/common/ptgames/frr.jpg"] = "5795367e";
				d["/common/ptgames/8bs.jpg"] = "7ad229cc";
				d["/common/ptgames/ro.jpg"] = "841d4f2d";
				d["/common/ptgames/foy.jpg"] = "7b95150e";
				d["/common/ptgames/ms.jpg"] = "173c47b0";
				d["/common/ptgames/gts36.jpg"] = "1d5999f8";
				d["/common/ptgames/cr.jpg"] = "50bda6f1";
				d["/common/ptgames/gts47.jpg"] = "2eea95a9";
				d["/common/ptgames/tfs.jpg"] = "39af8f69";
				d["/common/ptgames/sro.jpg"] = "233e5e0b";
				d["/common/ptgames/lm.jpg"] = "a772039f";
				d["/common/ptgames/dt2.jpg"] = "9c09dbcf";
				d["/common/ptgames/qbd.jpg"] = "83577b7c";
				d["/common/ptgames/irm3sc.jpg"] = "5e0ec5e1";
				d["/common/ptgames/cifr.jpg"] = "fcb53430";
				d["/common/ptgames/gos.jpg"] = "06dcc73e";
				d["/common/ptgames/gc.jpg"] = "c8266c82";
				d["/common/ptgames/gtsstg.jpg"] = "ffa5c5de";
				d["/common/ptgames/af4.jpg"] = "35a46e85";
				d["/common/ptgames/kkg.jpg"] = "c4aca239";
				d["/common/ptgames/rcd.jpg"] = "5e46e4fe";
				d["/common/ptgames/irm3.jpg"] = "b8df15a";
				d["/common/ptgames/bls.jpg"] = "22fe6650";
				d["/common/ptgames/fff.jpg"] = "a772f5a";
				d["/common/ptgames/mmy.jpg"] = "c60d72ff";
				d["/common/ptgames/gtsjzc.jpg"] = "20f9a19c";
				d["/common/ptgames/sf.jpg"] = "46d10d34";
				d["/common/ptgames/hh.jpg"] = "4f491162";
				d["/common/ptgames/pks.jpg"] = "36dbd671";
				d["/common/ptgames/gtshwkp.jpg"] = "4621f5b2";
				d["/common/ptgames/dw.jpg"] = "15d4644";
				d["/common/ptgames/jb50.jpg"] = "2509ce16";
				d["/common/ptgames/fsc.jpg"] = "1fa96b96";
				d["/common/ptgames/ro3d.jpg"] = "e5ffe7df";
				d["/common/ptgames/head.jpg"] = "04ce1a4b";
				d["/common/ptgames/bal.jpg"] = "eb303a25";
				d["/common/ptgames/7bal.jpg"] = "a6e53b5a";
				d["/common/ptgames/rodz.jpg"] = "a08ef43";
				d["/common/ptgames/po.jpg"] = "8ef11b5d";
				d["/common/ptgames/ghlj.jpg"] = "e00dc5e7";
				d["/common/ptgames/str.jpg"] = "5131fe9c";
				d["/common/ptgames/fow.jpg"] = "ee98169d";
				d["/common/ptgames/avng.jpg"] = "c4676bad";
				d["/common/ptgames/romw.jpg"] = "c27236c7";
				d["/common/ptgames/gtsghrsc.jpg"] = "48a14181";
				d["/common/ptgames/xmn.jpg"] = "d6bca4b8";
				d["/common/ptgames/pfbj_mh5.jpg"] = "f3e29eb1";
				d["/common/ptgames/mj.jpg"] = "9105d088";
				d["/common/ptgames/gts45.jpg"] = "1b28a9c5";
				d["/common/ptgames/sbl.jpg"] = "f495f742";
				d["/common/ptgames/pbro.jpg"] = "b02c1c14";
				d["/common/ptgames/dv2.jpg"] = "41fc1ec9";
				d["/common/ptgames/wvm.jpg"] = "1b6be5cf";
				d["/common/ptgames/pop.jpg"] = "5e3b61f7";
				d["/common/ptgames/rnr.jpg"] = "d3438ab3";
				d["/common/ptgames/jp.jpg"] = "1eb776ed";
				d["/common/ptgames/ct.jpg"] = "2946c0ba";
				d["/common/ptgames/pso.jpg"] = "a28de650";
				d["/common/ptgames/bjl.jpg"] = "6bdd8c1";
				d["/common/ptgames/pbj.jpg"] = "78e135ea";
				d["/common/ptgames/plba.jpg"] = "1a746afc";
				d["/common/ptgames/glr.jpg"] = "f52c8630";
				d["/common/ptgames/iceh.jpg"] = "eef4460b";
				d["/common/ptgames/gs.jpg"] = "cefa1a44";
				d["/common/ptgames/wan.jpg"] = "5ca035e7";
				d["/common/ptgames/bl.jpg"] = "6c75cbb3";
				d["/common/ptgames/af25.jpg"] = "23589d8f";
				d["/common/ptgames/sb.jpg"] = "c2f15b63";
				d["/common/ptgames/hb.jpg"] = "37ab014f";
				d["/common/ptgames/gtsdgk.jpg"] = "85e3588a";
				d["/common/ptgames/sc.jpg"] = "dd983d97";
				d["/common/ptgames/ub.jpg"] = "0c072382";
				d["/common/ptgames/gts46.jpg"] = "961be598";
				d["/common/ptgames/ghr.jpg"] = "1548ffd6";
				d["/common/ptgames/wv.jpg"] = "d287109e";
				d["/common/ptgames/al.jpg"] = "7298070a";
				d["/common/ptgames/ssa.jpg"] = "e3ee164a";
				d["/common/ptgames/rop_g.jpg"] = "ae9194e3";
				d["/common/ptgames/tob.jpg"] = "8625a658";
				d["/common/ptgames/af.jpg"] = "656c0f83";
				d["/common/ptgames/gts39.jpg"] = "0f928d9e";
				d["/common/ptgames/grel.jpg"] = "7673dce";
				d["/common/ptgames/rol.jpg"] = "985d515";
				d["/common/ptgames/gtsavgsc.jpg"] = "d9a90e8";
				d["/common/ptgames/tclsc.jpg"] = "a2fbaa01";
				d["/common/client_icon.png"] = "2b88a3c0";
				d["/common/personalPanel.png"] = "63e7aebb";
				d["/common/aboutus/3.png"] = "f85e5e6b";
				d["/common/aboutus/first.jpg"] = "7a22688d";
				d["/common/aboutus/dot.png"] = "d3621af8";
				d["/common/aboutus/bg4.jpg"] = "de03adad";
				d["/common/aboutus/bg2.jpg"] = "429ae6f5";
				d["/common/aboutus/2.png"] = "8da5537f";
				d["/common/aboutus/hover/ag.png"] = "c16212fc";
				d["/common/aboutus/hover/sb.png"] = "c70aeb95";
				d["/common/aboutus/hover/wbg.png"] = "fcffe166";
				d["/common/aboutus/hover/pt.png"] = "d35ca3a0";
				d["/common/aboutus/hover/gd.png"] = "5a589f43";
				d["/common/aboutus/hover/mg.png"] = "4e76710d";
				d["/common/aboutus/hover/bbin.png"] = "37448217";
				d["/common/aboutus/4.png"] = "d296f2c5";
				d["/common/aboutus/arrow-up.png"] = "47302f3a";
				d["/common/aboutus/bg1.jpg"] = "58be622d";
				d["/common/aboutus/bg3.jpg"] = "e63985bb";
				d["/common/aboutus/6.jpg"] = "024c066b";
				d["/common/aboutus/purezone.png"] = "332c4375";
				d["/common/aboutus/normal/ag.png"] = "f71dbe6a";
				d["/common/aboutus/normal/sb.png"] = "3897a684";
				d["/common/aboutus/normal/wbg.png"] = "fd3aec90";
				d["/common/aboutus/normal/pt.png"] = "904493f4";
				d["/common/aboutus/normal/gd.png"] = "03c32cb3";
				d["/common/aboutus/normal/mg.png"] = "115453cb";
				d["/common/aboutus/normal/bbin.png"] = "7b0a415c";
				d["/common/aboutus/footer.jpg"] = "dc9395cb";
				d["/common/aboutus/arrow-down.png"] = "b23a71cb";
				d["/common/aboutus/5.png"] = "bb0dcaa2";
				d["/common/aboutus/stone.png"] = "88a3c9b4";
				d["/common/aboutus/1.png"] = "7baf2f67";
				d["/common/aboutus/12years.png"] = "fcf240d0";
				d["/common/aboutus/newboma.png"] = "932483ba";
				d["/common/aboutus/first.png"] = "20022968";
				d["/common/refresh_s_h.png"] = "3b469c34";
				d["/common/checkbox_active.png"] = "0b4d236a";
				d["/common/paging_arrow.png"] = "084f7ca3";
				d["/common/clear.png"] = "4c54213a";
				d["/common/my/icon-delete-nomal.png"] = "753475b5";
				d["/common/my/icon-delete-hover.png"] = "056dce99";
				d["/common/my/icon-add-nomal.png"] = "b79f117c";
				d["/common/my/banner1.jpg"] = "89ba1ffa";
				d["/common/my/banner2.jpg"] = "ef39525b";
				d["/common/my/icon-add-hover.png"] = "dd700a46";
				d["/common/promotion_bg.jpg"] = "c2a24f82";
				d["/common/arrow-r.png"] = "3f9f435c";
				d["/common/loading1.gif"] = "1435991f";
				d["/common/loading.gif"] = "f3076899";
				d["/common/ali.jpg"] = "f3b22213";
				d["/common/wx.jpg"] = "f3b22213";
				d["/common/hot.png"] = "02101205";
				d["/common/message/icon-delete-nomal.png"] = "753475b5";
				d["/common/message/icon-empty.png"] = "297ef039";
				d["/common/message/icon-delete-hover.png"] = "056dce99";
				d["/common/video.jpg"] = "1a611534";
				d["/common/arrow-t.png"] = "9f1d72fd";
				return d[b]
			}
		}
	}])
})();
(function() {
	angular.module("user", []).factory("$$user", ["$log", "$cookies", "$$request", "$$modal", "$$base", "$timeout", "$$slot", "$rootScope", function(k, f, d, j, b, g, e, a) {
		return {
			refreshSafety: function() {
				this.getUserSafety(function(l) {
					if (!a.user) {
						return
					}
					a.user.safety = l.data
				})
			},
			modifyUserInfo: function(m, n) {
				var l = d.packageReq("set-user-info", null, m, "POST", false, false);
				d.action(l, function(o) {
					n(o)
				})
			},
			modifyPTPwd: function() {
				j.input(b.i18n("common-changePwd"), b.i18n("placeholder_inputpwd"), null, null, b.i18n("pt-password-reg"), function(l, n) {
					var m = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,14}$/;
					if (!m.test(n)) {
						l.showInputError(b.i18n("common-wrongReg"));
						return
					}
					e.modifyPTPwd(n, function(o) {
						j.alert(null, b.i18n("common-changePwd-s"), "success", null, null);
						a.user.pfAcc[0].password = n
					})
				})
			},
			setUserContext: function(m) {
				f.remove("account");
				if (m.remember) {
					var l = new Date();
					l.setDate(l.getDate() + 30);
					f.put("account", m.username, {
						expires: l
					})
				}
				f.remove("error-times");
				f.put("user", angular.toJson(m));
				if (window.localStorage) {
					window.localStorage.user = angular.toJson(m)
				}
				a.sessionId = m.sessionId;
				a.user = m
			},
			resetUserContext: function(l) {
				f.put("user", angular.toJson(l))
			},
			getUserBalance: function(m) {
				if (a.user.balance) {
					a.user.balance.totleBalance = ""
				}
				var l = d.packageReq("user-balance", null, null, "GET", false, false);
				d.action(l, function(n) {
					m(n)
				})
			},
			getUserInfo: function(m) {
				var l = d.packageReq("user-info", null, null, "GET", false, false);
				d.action(l, function(n) {
					m(n)
				})
			},
			getUserSafety: function(m) {
				var l = d.packageReq("user-safety", null, null, "GET", false, false);
				d.action(l, function(n) {
					m(n)
				})
			},
			loginCheck: function(l, m) {
				if (!a.user) {
					j.confirm(null, b.i18n("common-login-yet"), b.i18n("modal-register-goLogin"), function() {
						a.triggers.login = {
							bullet: Math.ceil(Math.random() * 1000000)
						};
						g(function() {
							m.$apply()
						})
					});
					window.location.href = l;
					return false
				}
				return true
			},
			logout: function() {
				f.remove("user");
				f.remove("boma8_front_session");
				f.remove("PHPSESSID");
				if (window.localStorage) {
					window.localStorage.removeItem("user")
				}
				a.sessionId = null;
				a.user = undefined
			}
		}
	}])
})();
(function() {
	angular.module("verify", []).factory("$$verify", ["$log", "$$base", "$rootScope", function(d, b, a) {
		return {
			s_withdrawForm: function(f) {
				var e = {
					status: 0
				};
				var j = new Date(f._withdrawQ.startDate).getTime();
				var g = new Date(f._withdrawQ.endDate).getTime();
				if (j > g) {
					e.status = -1;
					e.message = b.i18n("verify-date-1");
					return e
				}
				return e
			},
			s_transfersForm: function(f) {
				var e = {
					status: 0
				};
				var j = new Date(f._transfersQ.startDate).getTime();
				var g = new Date(f._transfersQ.endDate).getTime();
				if (j > g) {
					e.status = -1;
					e.message = b.i18n("verify-date-1");
					return e
				}
				return e
			},
			s_rechargeForm: function(f) {
				var e = {
					status: 0
				};
				var j = new Date(f._rechargeQ.startDate).getTime();
				var g = new Date(f._rechargeQ.endDate).getTime();
				if (j > g) {
					e.status = -1;
					e.message = b.i18n("verify-date-1");
					return e
				}
				return e
			},
			s_bettingForm: function(f) {
				var e = {
					status: 0
				};
				var j = new Date(f._bettingQ.startDate).getTime();
				var g = new Date(f._bettingQ.endDate).getTime();
				if (j > g) {
					e.status = -1;
					e.message = b.i18n("verify-date-1");
					return e
				}
				return e
			},
			s_bonusForm: function(f) {
				var e = {
					status: 0
				};
				var j = new Date(f._bonusQ.startDate).getTime();
				var g = new Date(f._bonusQ.endDate).getTime();
				if (j > g) {
					e.status = -1;
					e.message = b.i18n("verify-date-1");
					return e
				}
				return e
			},
			changeLoginPwdForm: function(f) {
				var e = {
					status: 0
				};
				if (!f.$parent._newPwd.newpassword || !f.$parent._newPwd.cNewpassword) {
					e.status = -1;
					e.message = b.i18n("verify-changePwd-1");
					return e
				}
				return e
			},
			getUserByFindPwdForm: function(f) {
				var e = {
					status: 0
				};
				if (!f.$parent._user.account || !f.$parent._user.token) {
					e.status = -1;
					e.message = b.i18n("verify-findpwd-1");
					return e
				}
				return e
			},
			feedbackForm: function(f) {
				var e = {
					status: 0
				};
				if (!f.$parent.$parent._feedback.title || !f.$parent.$parent._feedback.content) {
					e.status = -1;
					e.message = b.i18n("verify-feedback-1");
					return e
				}
				if (f.$parent.$parent._feedback.title.length > 50) {
					e.status = -1;
					e.message = b.i18n("verify-feedback-2");
					return e
				}
				if (f.$parent.$parent._feedback.content.length > 200) {
					e.status = -1;
					e.message = b.i18n("verify-feedback-3");
					return e
				}
				return e
			},
			modifyInfoForm: function(f) {
				var e = {
					status: 0
				};
				if (f._info.gender === a.user.info.gender && f._info.cellPhone === a.user.info.cellPhone && f._info.qq === a.user.info.qq) {
					e.status = -1;
					e.message = b.i18n("verify-modifyInfo-1");
					return e
				}
				return e
			},
			bindQaForm: function(f) {
				var e = {
					status: 0
				};
				if (!f._qa.problem_id) {
					e.status = -1;
					e.message = b.i18n("verify-QA-1");
					return e
				}
				return e
			},
			registerForm: function(f) {
				var e = {
					status: 0
				};
				if (!f.$parent._register.username) {
					e.status = -1;
					e.message = b.i18n("verify-register-2");
					return e
				}
				if (!/^[a-zA-Z_]\w{3,19}$/.test(f.$parent._register.username)) {
					e.status = -1;
					e.message = b.i18n("verify-register-5");
					return e
				}
				if (!f.$parent._register.password) {
					e.status = -1;
					e.message = b.i18n("verify-register-3");
					return e
				}
				if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,14}$/.test(f.$parent._register.password)) {
					e.status = -1;
					e.message = b.i18n("verify-register-6");
					return e
				}
				if (f.$parent._register.password !== f.$parent._register.password2) {
					e.status = -1;
					e.message = b.i18n("verify-register-4");
					return e
				}
				if (!f.$parent._register.checkcode) {
					e.status = -1;
					e.message = b.i18n("verify-register-7");
					return e
				}
				if (!/^\w{4,4}$/.test(f.$parent._register.checkcode)) {
					e.status = -1;
					e.message = b.i18n("verify-register-8");
					return e
				}
				if (!f.$parent._register.agree) {
					e.status = -1;
					e.message = b.i18n("verify-register-1");
					return e
				}
				return e
			},
			onlineForm: function(f) {
				var e = {
					status: 0
				};
				if (!f.$parent._recharge.pf) {
					e.status = -1;
					e.message = b.i18n("verify-recharge-1");
					return e
				}
				if (Number(f.$parent._recharge.online.amount) < Number(f.$parent._payments.min_save) || Number(f.$parent._recharge.online.amount) > Number(f.$parent._payments.max_save)) {
					e.status = -1;
					e.message = b.i18n("verify-recharge-2");
					return e
				}
				return e
			},
			transForm: function(f) {
				var e = {
					status: 0
				};
				if (!f.$parent._recharge.pf) {
					e.status = -1;
					e.message = b.i18n("verify-recharge-1");
					return e
				}
				if (Number(f.$parent._recharge.online.amount) < Number(f.$parent._payments.min_save) || Number(f.$parent._recharge.online.amount) > Number(f.$parent._payments.max_save)) {
					e.status = -1;
					e.message = b.i18n("verify-recharge-2");
					return e
				}
				return e
			},
			alipayForm: function(f) {
				var e = {
					status: 0
				};
				if (!f.$parent._recharge.pf) {
					e.status = -1;
					e.message = b.i18n("verify-recharge-1");
					return e
				}
				if (Number(f.$parent._recharge.online.amount) < Number(f.$parent._payments.min_save) || Number(f.$parent._recharge.online.amount) > Number(f.$parent._payments.max_save)) {
					e.status = -1;
					e.message = b.i18n("verify-recharge-2");
					return e
				}
				return e
			},
			withdrawForm: function(f) {
				var e = {
					status: 0
				};
				if (!f._withdraw.bank_code) {
					e.status = -1;
					e.message = b.i18n("verify-withdraw-1");
					return e
				}
				if (Number(f._withdraw.amount) < Number(f._limit.per_min) || Number(f._withdraw.amount) > Number(f._limit.per_max)) {
					e.status = -1;
					e.message = b.i18n("verify-withdraw-2");
					return e
				}
				return e
			},
			transfersForm: function(f) {
				var e = {
					status: 0
				};
				if (!f._transfers.trans_from || !f._transfers.trans_to) {
					e.status = -1;
					e.message = b.i18n("verify-transfers-1");
					return e
				}
				if (f._transfers.trans_from === f._transfers.trans_to) {
					e.status = -1;
					e.message = b.i18n("verify-transfers-2");
					return e
				}
				return e
			}
		}
	}])
})();