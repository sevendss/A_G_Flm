/**
 * [ModalService 弹出层服务]
 */
(function(){

	angular.module('modal', [])

	.controller('__modal', ['$scope', '$log', function($scope, $log){

		$scope.data = {};

		//所有方法回调入口
		$scope.callback = function(funcName){

			if (!angular.isFunction(eval('this.$parent.$parent.' + funcName))) {

				$log.error("####没有找到回调方法:" + funcName + "####");
				return;
				
			};

			eval('this.$parent.$parent.' + funcName + '($scope.data)');

		}
		
	}])

	.factory('$$modal', 
		[
			'$log', 
			"$$dic",
			"$$base",
			'$rootScope', function($log, $$dic, $$base, $rootScope) {

		return{

			/**
			 * 提示框，tips
			 * @param  {[type]}   type     [类型: "warning", "error", "success", "info"]
			 * @param  {[type]}   message  [内容]
			 */
			tips: function(message, type){

				type = type || 'success';

				toastr.options = {
					"closeButton": false,
					"debug": false,
					"positionClass": "toast-bottom-right",

				}

				toastr[type](message);

			},

			/**
			 * 弹出框
			 * @param  {[type]}   title    [标题]
			 * @param  {[type]}   message  [信息]
			 * @param  {[type]}   type     [类型: "warning", "error", "success", "info"]
			 * @param  {Function} callback [回调函数]
			 */
			alert: function(title, message, type, confirmButtonText, callback){

				type = type || 'info';
				confirmButtonText = confirmButtonText || $$base.i18n('alert-btn-default-confirm');
				title = title || $$base.i18n('alert-title-default-' + type);
				
				swal({
					title: title,
					text: message,
					type: type,
					confirmButtonColor: "#DB182A",
					confirmButtonText: confirmButtonText,
				}, callback);

			},

			/**
			 * 确认框
			 * @param  {[type]} title          [标题]
			 * @param  {[type]} message        [确认信息 $n 换行]
			 * @param  {[type]} com_text       [确认按钮显示名称]
			 * @param  {[type]} com_callback   [确认按钮回调]
			 * @param  {[type]} cal_text       [取消按钮显示名称]
			 * @param  {[type]} cal_callback   [取消按钮回调]
			 * @param  {[type]} closeOnConfirm [点击确认时是否关闭modal 默认是]
			 * @param  {[type]} closeOnCancel  [点击取消时是否关闭modal 默认是]
			 */
			confirm: function(title, message, com_text, com_callback, cal_text, cal_callback, closeOnConfirm, closeOnCancel, showLoaderOnConfirm, inputType){

				if (angular.isUndefined(closeOnConfirm)) {
					closeOnConfirm = true;
				};

				if (angular.isUndefined(closeOnCancel)) {
					closeOnCancel = true;
				};

				if(angular.isUndefined(showLoaderOnConfirm)){
					showLoaderOnConfirm = false;
				}

				title = title || $$base.i18n('alert-title-default-info');
				cal_text = cal_text || $$base.i18n('alert-btn-default-cancel');
				com_text = com_text || $$base.i18n('alert-btn-default-confirm');


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
						
						if (angular.isFunction(com_callback)) {com_callback();}

					} else {
						
						if (angular.isFunction(cal_callback)) {cal_callback();}

					}

				});

			},


			/**
			 * 输入框
			 * @param  {[type]} title        		[标题]
			 * @param  {[type]} message      		[确认信息 $n 换行]
			 * @param  {[type]} com_text     		[确认按钮显示名称]
			 * @param  {[type]} cal_text     		[取消按钮显示名称]
			 * @param  {[type]} inputPlaceholder    [输入框默认显示]
			 * @param  {[type]} callback 	 		[确认按钮回调]
			 * @param  {[type]} inputType 	 		[输入框类型]
			 */
			input: function(title, message, com_text, cal_text, inputPlaceholder, callback, inputType){

				inputType = inputType || 'text';
				com_text  = com_text  || $$base.i18n('alert-btn-default-confirm');
				cal_text  = cal_text  || $$base.i18n('alert-btn-default-cancel');
				title     = title     || $$base.i18n('alert-btn-default-confirm');

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
					inputType:inputType

				}, function(inputValue){

					if (inputValue === false) {
						return;
					};
					callback(swal, inputValue);

				});

			},

			/**
			 * 弹出自定义层
			 * @param  {[type]} tpUrl [模板路径]
			 */
			popup: function(scope, modalName) {

				var modalId = $$dic.modal(modalName);

				if($(modalId).length < 1){

					this.alert(null, $$base.i18n('common-onloading'), 'info');
					return;

				}

				if (!modalId) {
					return
				};

				$(modalId).modal();

			},

			/**
			 * 关闭自定义弹出层
			 */
			popupClose: function(){

				// $('div.index-header').css('z-index', 2000);
				$('.md-overlay').click();

			},

			/**
			 * loading层
			 */
			loading: function(disappearTime, type){

				var t = this;

				if (type === 'close' && $('.fakeloader').length > 0) {

					$('#fakeloader').fadeOut();
					$('#fakeloader').remove();
					return;

				};

				if ($('.fakeloader').length === 0) {

					$(".fakeloader").fakeLoader({spinner:"spinner6"});
					
				}else{

					$('#fakeloader').fadeOut();
					$('#fakeloader').remove();
					
				}

				if (disappearTime) {

					window.setTimeout(function(){

						t.loading();

					}, disappearTime)
					
				};

			}

		}

	}])


})();