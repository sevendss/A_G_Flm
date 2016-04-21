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