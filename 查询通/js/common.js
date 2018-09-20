(function() {

	/**
	 * @author FengXin
	 * 此js是公共方法，方便调newInterface、简化一些繁重的写法
	 * 每个HTML页面需引用它才能调用里面的方法
	 */
	var gP,
		gM,
		gObject,
		topBarType,
		gRuntime,
		gOs,
		tap_first,
		gType;

	window.rd = window.dj = {

		/**
		 * 初始化
		 */
		init: function(BarType) {
			/**
			 * true 深色  | false 浅色
			 */
			if(BarType) {
				topBarType = 'UIStatusBarStyleDefault';
			} else {
				topBarType = 'UIStatusBarStyleBlackOpaque';
			}
			var topBar = rd.tagName('header')['0'];
			gM = mui;
			gM.plusReady(function() {
				gP = plus;
				gOs = plus.os;
				gRuntime = plus.runtime;
				gType=mui.os.android;
				//仅支持竖屏显示
				plus.screen.lockOrientation("portrait-primary");
				//隐藏滚动条
				plus.webview.currentWebview().setStyle({
					scrollIndicator: 'none'
				});
				if(topBar) {
					var topBarColor = getComputedStyle(topBar, false)['backgroundColor'];
					if(mui.os.ios) {
						plus.navigator.setStatusBarStyle(topBarType);
						plus.navigator.setStatusBarBackground(topBarColor);
					} else {
						plus.navigator.setStatusBarStyle('light');
						plus.navigator.setStatusBarBackground('#3b78c8');
					}
				}
			});
		},
		/**
		 * 通过ID获取元素
		 * id_element 为id名
		 * @param {Object} id_data
		 */
		id: function(id_element) {
			return document.getElementById(id_element);
		},
		/**
		 * 通过Class获取元素
		 * classElement 为class名
		 * @param {Object} parentElement 父级元素
		 * @param {Object} classElement
		 */
		className: function(parentElement, classElement) {
			if(classElement == undefined) {
				return document.getElementsByClassName(parentElement);
			}
			return parentElement.getElementsByClassName(classElement);
		},
		/**
		 * 通过标签获取元素
		 * tagElement 为元素名
		 * @param {Object} parentElement 父级元素
		 * @param {Object} tagElement
		 */
		tagName: function(parentElement, tagElement) {
			if(tagElement == undefined) {
				return document.getElementsByTagName(parentElement);
			}

			return parentElement.getElementsByTagName(tagElement);
		},
		/**
		 * 获得屏幕的高度
		 * @param {Object} element
		 */
		getScreenInfo: function(element) {
			if(element == 'width') {
				return document.documentElement.clientWidth || document.body.clientWidth;
			} else {
				return document.documentElement.clientHeight || document.body.clientHeigth;
			}
		},
		/**
		 * 单击事件
		 * @param {Object} element 元素
		 * @param {Object} succfn  成功的回调
		 */
		click: function(elementData, succfn) {
			elementData.addEventListener('tap', function() {
				succfn(this);
			});
		},
		/**
		 * 打开新页面
		 * @param {Object} jsonData
		 */
		newInterface: function(jsonData) {
			if(jsonData.styles == undefined) {
				var styles = {};
				styles.top = '0px';
				styles.bottom = '0px';
				styles.width = '100%';
				styles.height = '100%';
				jsonData.styles = styles;
			} else {
				if(jsonData.styles.top == undefined) {
					jsonData.styles.top = "0px";
				}
				if(jsonData.styles.bottom == undefined) {
					jsonData.styles.bottom = "0px";
				} else {
					jsonData.styles.height = rd.getScreenInfo('height') - parseInt(jsonData.styles.bottom) + 'px';
				}
				if(jsonData.styles.width == undefined) {
					jsonData.styles.width = "100%";
				}
				if(jsonData.styles.height == undefined) {
					jsonData.styles.height = "100%";
				}
			}
			if(jsonData.show == undefined) {
				jsonData.show = true;
			}
			if(jsonData.showType == undefined) {
				jsonData.showType = 'zoom-fade-out';
			}
			if(jsonData.showTime == undefined) {
				jsonData.showTime = 350;
			}
			if(jsonData.waiting == undefined) {
				jsonData.waiting = false;
			}
			gM.openWindow({
				url: jsonData.url,
				id: jsonData.id,
				styles: {
					top: jsonData.styles.top,
					bottom: jsonData.styles.bottom,
					width: jsonData.styles.width,
					height: jsonData.styles.height,
					scrollIndicator: 'none', //隐藏滚动条
				},
				show: {
					autoShow: jsonData.show,
					aniShow: jsonData.showType,
					duration: jsonData.showTime
				},
				waiting: {
					autoShow: jsonData.waiting,
				}
			});
		},
		/**	
		 * 关闭当前界面
		 */
		closeCurrentInterface: function() {
			gM.back();
		},
		/**
		 * Ajax - get 请求
		 * @param {Object} url 请求Url
		 * @param {Object} data   参数-Json格式
		 * @param {Object} succFn	  回调
		 * 测试地址: http://test.rdxueyuan.com/index.php/link_app/get?state=index
		 */
		get: function(jsonData) {
			rd.ajax({
				url: jsonData.url,
				data: jsonData.data,
				succFn: jsonData.succFn,
				type: 'get'
			});
		},
		/**
		 * Ajax - post 请求
		 * @param {Object} url 请求Url
		 * @param {Object} data   参数-Json格式
		 * @param {Object} succFn	  回调
		 * 测试地址: http://test.rdxueyuan.com/index.php/link_app/post?state=index
		 */
		post: function(jsonData) {
			rd.ajax({
				url: jsonData.url,
				data: jsonData.data,
				succFn: jsonData.succFn,
				type: 'post'
			});
		},
		/**
		 * Ajax
		 * @param {Object} json
		 */
		ajax: function(json) {
			var timer = null;
			json = json || {};
			if(!json.url) {
				rd.prompt('请求url不存在');
				return;
			}
			json.type = json.type || 'get';
			json.time = json.time || 10;
			json.data = json.data || {};
			if(window.XMLHttpRequest) {
				var oAjax = new XMLHttpRequest();
			} else {
				var oAjax = new ActiveXObject('Microsoft.XMLHTTP');
			}
			switch(json.type.toLowerCase()) {
				case 'get':
					oAjax.open('GET', json.url + '?' + json2url(json.data), true);
					//				console.log(json.url+'?'+json2url(json.data));
					oAjax.send();
					break;
				case 'post':
					oAjax.open('POST', json.url, true);
					oAjax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					oAjax.send(json2url(json.data));
					break;
			}
			oAjax.onreadystatechange = function() {
				if(oAjax.readyState == 4) {
					if(oAjax.status >= 200 && oAjax.status < 300 || oAjax.status == 304) {
						clearTimeout(timer);
						json.succFn && json.succFn(oAjax.responseText);
					} else {
						clearTimeout(timer);
						json.errFn && json.errFn(oAjax.status);
					}
				}
			}
			timer = setTimeout(function() {
				rd.prompt('网络超时,请检查网络设置！');
				dj.closeWaiting();
				oAjax.onreadystatechange = null;
			}, json.time * 1500);

			function json2url(json) {
				json.t = Math.random();
				var arr = [];
				for(var name in json) {
					arr.push(name + '=' + json[name]);
				}
				return arr.join('&');
			}
		},
		/**
		 * 获得起始页对象或者首页
		 * @param {Object} 
		 */
		getStartInterface: function(callback) {
			gM.plusReady(function() {
				callback && callback(gP.webview.getLaunchWebview());
			});
		},
		/**
		 * 获得当前页对象 
		 * @param {Object} 
		 */
		getCurrentInterface: function(callback) {
			gM.plusReady(function() {
				callback && callback(gP.webview.currentWebview());
			});
		},
		/**
		 * 获得目标页对象
		 * @param {Object} 
		 */
		getTargetInterface: function(targetInterface, callback) {
			gM.plusReady(function() {
				callback && callback(gP.webview.getWebviewById(targetInterface));
			});
		},
		/**
		 * 预加载
		 * @param {Object} arrayData
		 * @param {Object} fn
		 */
		preLoad: function(arrayData, fn) {
			var array = [];
			gM.plusReady(function() {
				for(var a = 0; a < arrayData.length; a++) {
					var productView = gM.preload({
						url: arrayData[a].url,
						id: arrayData[a].id,
					});
					array.push(productView);
				}
				fn && fn(array)
			});
		},
		/**
		 * 弹出框
		 * @param {Object} jsonData
		 */
		alert: function(jsonData) {
			gM.alert(jsonData.content, jsonData.title, function() {
				jsonData.callback && jsonData.callback();
			});
		},
		/**
		 * 确认提示框
		 * @param {Object} jsonData
		 */
		confirm: function(jsonData) {
			var btnArray = ['是', '否'];
			gM.confirm(jsonData.content, jsonData.title, btnArray, function(e) {
				if(e.index == 0) {
					jsonData.callback && jsonData.callback(true);
				} else {
					jsonData.callback && jsonData.callback(false);
				}
			});
		},
		/**
		 * 输入提示框
		 * @param {Object} jsonData
		 */
		inputPrompt: function(jsonData) {
			var btnArray = ['确定', '取消'];
			gM.prompt(jsonData.content, '', jsonData.title, btnArray, function(e) {
				if(e.index == 0) {
					jsonData.callback && jsonData.callback(e.value);
				} else {
					jsonData.callback && jsonData.callback(false);
				}
			});
		},
		/**
		 * 自动消失提示框
		 * @param {Object} m 提示信息
		 */
		prompt: function(m) {
			mui.toast(m);
		},
		/**
		 * 原生actionSheet 
		 * @param {Object} arrayData
		 * @param {Object} jsonData & isUpload | uploadUrl
		 */
		actionSheet: function(arrayData, jsonData) {
			gM.plusReady(function() {
				plus.nativeUI.actionSheet({
						title: "请选择",
						cancel: "取消",
						buttons: arrayData
					},
					function(e) {
						var index = e.index;
						if(index == 0) {
							return;
						}
						index--;
						if(arrayData[index].title == '照相机') {
							rd.camera({
								succFn: function(path, name) {
									if(jsonData && jsonData.isUpload) {
										rd.uploadFiles(jsonData.uploadUrl, path, function(imgPath) {
											jsonData.succFn(imgPath);
										}, function(error) {
											jsonData.errFn && jsonData.errFn(error);
										});
									} else {
										jsonData.succFn(path, name)
									}
								}
							});
						} else if(arrayData[index].title == '相册') {
							rd.album({
								succFn: function(path) {
									if(jsonData && jsonData.isUpload) {
										rd.uploadFiles(jsonData.uploadUrl, path, function(imgPath) {
											jsonData.succFn(imgPath);
										}, function(error) {
											jsonData.errFn && jsonData.errFn(error);
										});
									} else {
										jsonData.succFn(path);
									}
								}
							});
						} else {
							jsonData.succFn(index);
						}
					});
			});
		},
		/**
		 * 遮罩
		 * @param {Object} callback
		 */
		showMask: function(callback) {
			var mask = gM.createMask(callback);
			mask.show();
		},
		/**
		 * 显示等待框
		 * @param {Object} watingPrompt
		 */
		showWaiting: function(watingPrompt) {
			mui.plusReady(function() {
				plus.nativeUI.showWaiting(watingPrompt);
			});

		},
		/**
		 * 关闭等待框
		 */
		closeWaiting: function() {
			mui.plusReady(function() {
				plus.nativeUI.closeWaiting();
			});

		},

		/**
		 *显示当前页面 
		 */
		showCurrent: function() {
			mui.plusReady(function() {
				var self = plus.webview.currentWebview();
				self.show('zoom-fade-out', 350);
			});

		},

		/**	
		 * 照相机 
		 * @param {Object} succFn
		 * @param {Object} errFn
		 */
		camera: function(jsonData) {
			gM.plusReady(function() {
				var cmr = plus.camera.getCamera();
				cmr.captureImage(function(p) {
					plus.io.resolveLocalFileSystemURL(p, function(entry) {
						var img_name = entry.name;
						var img_path = entry.toLocalURL();
						jsonData.succFn && jsonData.succFn(img_path, img_name);
					}, function(e) {
						jsonData.errFn && jsonData.errFn(e.message);
					});
				}, function(e) {
					jsonData.errFn && jsonData.errFn(e.message);
				}, {
					filename: '_doc/camera/',
					index: 1
				});
			});
		},
		/**
		 * 相册
		 * @param {Object} succFn
		 * @param {Object} errFn
		 */
		album: function(jsonData) {
			gM.plusReady(function() {
				plus.gallery.pick(function(path) {
					jsonData.succFn && jsonData.succFn(path);
				}, function(e) {
					jsonData.errFn && jsonData.errFn(e.message);
				}, {
					filter: "image"
				});
			});
		},
		/**
		 * 蜂鸣
		 */
		beep: function() {
			gM.plusReady(function() {
				switch(plus.os.name) {
					case "iOS":
						if(plus.device.model.indexOf("iPhone") >= 0) {
							plus.device.beep();
						} else {
							rd.prompt('此设备不支持蜂鸣');
						}
						break;
					default:
						plus.device.beep();
						break;
				}
			});
		},
		/**	
		 * 手机震动
		 */
		vibrate: function() {
			gM.plusReady(function() {
				switch(plus.os.name) {
					case "iOS":
						if(plus.device.model.indexOf("iPhone") >= 0) {
							plus.device.vibrate();
						} else {
							rd.prompt('此设备不支持震动');
						}
						break;
					default:
						plus.device.vibrate();
						break;
				}
			});
		},
		/**
		 * 设备信息
		 * @param {Object} callback
		 */
		getDeviceInfo: function(callback) {
			gM.plusReady(function() {
				var json = {};
				json.model = gP.device.model;
				json.vendor = gP.device.vendor;
				json.imei = gP.device.imei;
				json.uuid = gP.device.uuid;
				var str = '';
				for(i = 0; i < gP.device.imsi.length; i++) {
					str += gP.device.imsi[i];
				}
				json.imsi = str;
				json.resolution = gP.screen.resolutionWidth * gP.screen.scale + " x " + gP.screen.resolutionHeight * gP.screen.scale;
				json.pixel = gP.screen.dpiX + " x " + gP.screen.dpiY;
				callback(json);
			});
		},
		/**
		 * 手机信息 
		 * @param {Object} callback
		 */
		getMachineInfo: function(callback) {
			gM.plusReady(function() {
				var json = {};
				json.name = gP.os.name;
				json.version = gP.os.version;
				json.language = gP.os.language;
				json.vendor = gP.os.vendor;
				var types = {};
				types[gP.networkinfo.CONNECTION_UNKNOW] = "未知";
				types[gP.networkinfo.CONNECTION_NONE] = "未连接网络";
				types[gP.networkinfo.CONNECTION_ETHERNET] = "有线网络";
				types[gP.networkinfo.CONNECTION_WIFI] = "WiFi网络";
				types[gP.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
				types[gP.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
				types[gP.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
				json.network = types[gP.networkinfo.getCurrentType()];
				callback(json);
			});
		},
		/**
		 * 拨打电话
		 * @param {Object} phone
		 */
		callPhone: function(targetPhone) {
			gP.device.dial(targetPhone, false);
		},
		/**	
		 * 邮件
		 * @param {Object} targetEmail
		 */
		sendEmail: function(targetEmail) {
			location.href = "mailto:" + targetEmail;
		},
		/**
		 * 地理位置 - 获得当前位置
		 * @param {Object} succFn 成功回调
		 * @param {Object} errFn  失败回调
		 */
		getCurrentPosition: function(jsonData) {
			gM.plusReady(function() {
				gP.geolocation.getCurrentPosition(function(position) {
					var timeflag = position.timestamp;
					var codns = position.coords;
					var lat = codns.latitude;
					var longt = codns.longitude;
					var alt = codns.altitude;
					var accu = codns.accuracy;
					var altAcc = codns.altitudeAccuracy;
					var head = codns.heading;
					var sped = codns.speed;
					var baidu_map = "http://api.map.baidu.com/geocoder/v2/?output=json&ak=BFd9490df8a776482552006c538d6b27&location=" + lat + ',' + longt;
					rd.ajax({
						url: baidu_map,
						data: {},
						succFn: function(data) {
							jsonData.succFn && jsonData.succFn(data);
						}
					});
				}, function(e) {
					jsonData.errFn && jsonData.errFn(e.message);
				});
			})
		},
		/**
		 * 浏览器打开网页
		 * @param {Object} targetUrl
		 */
		openUrl: function(targetUrl) {
			gP.runtime.openURL(targetUrl);
		},
		/**
		 * 设置完手动关闭启动页 manifest.json -> 启动图片 -> 选择手动关闭启动界面
		 * 关闭启动页
		 */
		closeStartPage: function() {
			gM.plusReady(function() {
				plus.navigator.closeSplashscreen();
			});
		},
		/**
		 * 双击返回键退出
		 */
		dblclickExit: function() {
			var first = null;
			gM.back = function() {
				if(!first) {
					first = new Date().getTime();
					rd.prompt('再按一次退出应用');
					setTimeout(function() {
						rd.dblclickExit();
					}, 1000);
				} else {
					if(new Date().getTime() - first < 1000) {
						gP.runtime.quit();
					}
				}
			}
		},
		/**
		 * 隐藏界面滚动条
		 */
		hiddenScroll: function() {
			gM.plusReady(function() {
				var self = plus.webview.currentWebview();
				self.setStyle({
					scrollIndicator: 'none'
				});
			});
		},
		/**
		 * 禁止界面弹动
		 */
		stopBounce: function() {
			var self = gP.webview.currentWebview();
			self.setStyle({
				setBounce: 'none'
			});
		},

		/**
		 * 获得Runtime信息
		 */
		getRuntime: function(path) {
			if(path) {
				return gRuntime[path];
			} else {
				return gRuntime;
			}
		},

		/**
		 * 获得APP版本号
		 * 
		 */
		getOs: function(path) {
			if(path) {
				return gOs[path];
			} else {
				return gOs;
			}
		},
		isEmpty: function(arg) {
			return arg === null || arg === '' || arg === undefined;
		},
		isJSON: function(target) {
			return typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object   object]" && !obj.length;
		},
		setObjField: function(OJson) {
			return function() {
				if(!arguments.length > 0) {
					return OJson;
				}
				var index = 0;
				if(dj.isEmpty(OJson) && dj.isJSON(arguments[0])) {
					OJson = arguments[0];
					index = 1;
				}

				for(var i = index, len = arguments.length; i < len; i++) {
					var _arg = arguments[i];
					for(var j in _arg) {
						OJson[j] = _arg[j];
					}
				}
				return OJson;
			}

		},
		extendsField: function() {
			if(!arguments || arguments.length === 0) {
				return undefined;
			}
			if(arguments.length === 1) {
				return arguments[0];
			}
			var obj = arguments[0];
			for(var i = 1; i < arguments.length; i++) {
				var arg = arguments[i];
				if(arg === undefined || arg === null || arg === "") {
					continue;
				}

				for(var key in arg) {
					if(arg[key] === undefined || arg[key] === null || arg[key] === "") {
						continue;
					}
					obj[key] = arg[key];
				}
			}
			return obj;
		},
		setCheckVals: function(checkboxs, attr) {
			var ChecckVals = "";
			for(var i = 0, len = checkboxs.length; i < len; i++) {
				if(i == 0) {
					ChecckVals = checkboxs[i][attr];
				} else {
					ChecckVals += "," + checkboxs[i][attr];
				}
			}

			return ChecckVals;
		},

		/**
		 * 自定义弹出层
		 * @param {Object} opt
		 */
		popover: function(opt) {
			var el;
			if(typeof opt === 'object') {
				el = document.querySelector(opt.el);
				if(opt.style) {
					el.setAttribute('style', opt.style);
				}
			} else {
				el = document.querySelector(opt);
			}

			var mask = mui.createMask(function() {
				el.classList.remove('mui-active');
			});

			this.open = function() {
				mask.show();
				el.classList.add('mui-active');
			}

			this.close = function() {
				mask.close();
				el.classList.remove('mui-active');
			}
		},

		/**
		 * 多选CheckBox获取值
		 */
		getCheckBoxRes: function(className) {
			var rdsObj = document.getElementsByClassName(className);
			var checkVal = new Array();
			var k = 0;
			for(i = 0; i < rdsObj.length; i++) {
				if(rdsObj[i].checked) {
					checkVal[k] = rdsObj[i].value;
					k++;
				}
			}
			return checkVal;
		},

		/**
		 * 单选Radio获取值
		 */
		getRadioRes: function(className) {
			var rdsObj = document.getElementsByClassName(className);
			var checkVal = null;
			for(i = 0; i < rdsObj.length; i++) {
				if(rdsObj[i].checked) {
					checkVal = rdsObj[i].value;
				}
			}
			return checkVal;
		},

		/**
		 * 提示框 
		 * @param {Object} msg
		 * @param {Object} duration
		 */
		toast: function(msg, duration) {
			duration = isNaN(duration) ? 1500 : duration;
			var m = document.createElement('div');
			m.innerHTML = msg;
			m.style.cssText = "width: 60%;min-width: 150px;opacity: 0.7;height: 45px;color: rgb(255, 255, 255);line-height: 45px;text-align: center;border-radius: 5px;position: fixed;top: 50%;left: 20%;z-index: 999999;background: rgb(0, 0, 0);font-size: 14px;";
			document.body.appendChild(m);
			setTimeout(function() {
				var d = 0.5;
				m.style.webkitTransition = '-webkit-transform ' + d + 's ease-out, opacity ' + d + 's ease-in';
				m.style.opacity = '0';
				setTimeout(function() {
					document.body.removeChild(m)
				}, d * 350);
			}, duration);
		},

		/**
		 * 防止连续点击
		 */
		unsafe_tap: function() {
			if(!tap_first) {
				tap_first = new Date().getTime();
				setTimeout(function() {
					tap_first = null;
				}, 1500)
			} else {
				return true;
			}
		},

		/**
		 * 删除申请办理模块下列表item
		 * @param {Object} request_url
		 * @param {Object} msid
		 * @param {Object} delId
		 * @param {Object} selectIndex
		 * @param {Object} callback
		 */
		getDelete: function(request_url, msid, delId, selectIndex, callback, callwait) {
			$.ajax({
				type: "post",
				url: request_url,
				timeout: 10000, //超时时间设置，单位毫秒
				data: {
					cmd: "APP_MOBILE_DeleteProcess",
					sid: msid,
					bindid: delId,
				},
				success: function(data) {
					console.log(data);
					if(data == "no1") {
						mui.toast("已被办理不允许删除");
						setTimeout(function() {
							mui.swipeoutClose(selectIndex);
						}, 300);
					} else if(data == "no2") {
						mui.toast("业务数据删除失败");
						setTimeout(function() {
							mui.swipeoutClose(selectIndex);
						}, 300);
						callwait();
					} else if(callback) {
						callback(data);
					}

				}
			});
		},

		/**
		 * 是否展示应用
		 * @param {Object} request_url
		 * @param {Object} msid
		 * @param {Object} callback
		 */
		isShowIcon: function(request_url, msid, callback) {
			$.ajax({
				type: "post",
				url: request_url,
				timeout: 10000, //超时时间设置，单位毫秒
				data: {
					cmd: "APP_MOBILE_jurisdiction",
					sid: msid
				},
				success: function(data) {
					callback(data);
				}
			});
		},

		/**
		 * APP版本升级
		 * @param {Object} request_url
		 * @param {Object} msid
		 * @param {Object} version
		 */
		checkUpdate: function(request_url, msid, version, callback) {
			$.ajax({
				type: "post",
				url: request_url,
				timeout: 10000, //超时时间设置，单位毫秒
				data: {
					cmd: "APP_MOBILE_getVersion",
					sid: msid,
					apkVersion: version
				},
				success: function(data) {
					callback(data);
				}
			});
		},

		
		/**
		 * 兼容Android和iOS的列表一致
		 * @param {Object} id
		 */
		setListHeight:function(id,name){
			var element=document.getElementById(id);
			 if (gType) {
			 	element.style.marginTop="-15px";
			 } else {
			 	if (name=="SQBL") { //SQBL代表申请办理
			 		element.style.marginTop="85px";
			 		
			 	} else{
			 		element.style.marginTop="40px";
			 	} 
			 }
		},

		/**
		 * IOS,Android调用原生代码拨打电话
		 * @param {Object} number
		 */
		phone: function(number) {
			if(gOs.name == "Android") {
				var Intent = plus.android.importClass("android.content.Intent");
				var Uri = plus.android.importClass("android.net.Uri");
				var main = plus.android.runtimeMainActivity();
				var uri = Uri.parse("tel:" + number);
				var call = new Intent("android.intent.action.CALL", uri);
				main.startActivity(call);
			} else {
				var UIAPP = plus.ios.importClass("UIApplication");
				var NSURL = plus.ios.importClass("NSURL");
				var app = UIAPP.sharedApplication();
				app.openURL(NSURL.URLWithString("tel://" + number));
			}
		}

	}

})();