// 必须是先初始化才能拿到spring实例
var spring = (function() {
    // 可以放一些私有变量
    function Spring(options) {
        // options{type:'callMa/callNative'}
        this.init(options)
    }
    // 公有方法，存放在原型对象中
    Spring.prototype = {
        'constructor': Spring,
        init: function(options) {
            if (options.type === 'callNative') {
                this.controller = options.controller
            } else {
                this.ip = options.ip
                this.port = options.port
                this.controller = options.contextmapping
            }
        },
        proxy: function() {
            if (!(this.ip || this.port)) {
                throw new Error('请设置IP和PORT！')
                return
            }
            return "http://" + this.ip + ":" + this.port + "/umserver/core"
        },
        isMobile: function() {
            var regexp = /(android|os) (\d{1,}(\.|\_)\d{1,})/
            return regexp.test(spring.userAgent())
        },
        isIphone: function() {
            var regexp = /iphone|ipad|ipod/
            return regexp.test(spring.userAgent())
        },
        isAndroid: function() {
            var regexp = /android/
            return regexp.test(spring.userAgent())
        },
        userAgent: function() {
            return navigator.userAgent.toLowerCase()
        },
        isUndefined: function(data) {

        },
        // date: dateObj  fmt:日期格式
        formatDate: function(date, fmt) {
            var o = {
                "M+": date.getMonth() + 1, //月份 
                "d+": date.getDate(), //日 
                "h+": date.getHours(), //小时 
                "m+": date.getMinutes(), //分 
                "s+": date.getSeconds(), //秒 
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
                "S": date.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        },
        // 补0
        padLeftZero: function(str) {
            return ('00' + str).substr(str.length)
        },
        // 等比缩放图片 
        compressImg: function(image, maxWidth, maxHeight) {
            var maxWidth = maxWidth;
            var maxHeight = maxHeight;
            var hRatio;
            var wRatio;
            var Ratio = 1;
            var w = image.width;
            var h = image.height;
            wRatio = maxWidth / w;
            hRatio = maxHeight / h;
            if (maxWidth == 0 && maxHeight == 0) {
                Ratio = 1;
            } else if (maxWidth == 0) { //
                if (hRatio < 1) Ratio = hRatio;
            } else if (maxHeight == 0) {
                if (wRatio < 1) Ratio = wRatio;
            } else if (wRatio < 1 || hRatio < 1) {
                Ratio = (wRatio <= hRatio ? wRatio : hRatio);
            }
            if (Ratio < 1) {
                w = w * Ratio;
                h = h * Ratio;
            }
            var imgDom = new Image();
            imgDom.height = h;
            imgDom.width = w;
            return imgDom;
        },
        // 保存数据到本地
        setStorage: function(key, value) {
            var saveObj = window.localStorage._saveObj_;
            if (!saveObj) {
                saveObj = {}
            } else {
                saveObj = JSON.parse(saveObj)
            }
            saveObj[key] = value;
            window.localStorage._saveObj_ = JSON.stringify(saveObj);
        },
        // 从本地加载数据 def:为默认值
        getStorage: function(key, def) {
            var saveObj = window.localStorage._saveObj_
            if (!saveObj) {
                return def
            }
            saveObj = JSON.parse(saveObj)
            var ret = saveObj[key]
            return ret || def
        },
        // 从本地存储中移除某一个属性
        removeStorageItem: function(key) {
            var saveObj = window.localStorage._saveObj_;
            if (saveObj) {
                saveObj = JSON.parse(saveObj);
                delete saveObj[key]
                window.localStorage._saveObj_ = JSON.stringify(saveObj)
            }
        },
        // 清除所有的存储
        clearStorage: function() {
            window.localStorage.clear()
        },
        // 获取url里面的一些参数
        getQueryByName: function(name) {
            var params = decodeURI(location.search);
            var result = params.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
            if (result == null || result.length < 1) {
                return "";
            }
            return result[1];
        },
        // url后面拼接参数, 
        addUrlParam: function(url, name, value) {
            // 拼接的参数多时,可以传一个url,一个json.单个时可以传url,key,valu
            url += (url.indexOf("?") == -1 ? "?" : "&");
            if (arguments.length === 3) {
                url += name + "=" + value
                return url;
            }
            var options = name; // 第二个参数为json
            for (var key in options) {
                url += key + "=" + options[key]
            }
            return url;
        },
        getData: function(options) {
            // 如果开启https的话，目前请求需要走原生
            if (this._requestParams.ishttps) {
                if (spring.isMobile()) {
                    // 走原生 或者 ma
                    $.callServiceNative(options)
                } else {
                    // pc调式，ajax
                    $._requestAjax(options)
                }

            } else {
                if (spring.isMobile()) {
                    // 走原生 或者 ma
                    $.callAction(options)
                } else {
                    // pc调式，ajax
                    $._requestAjax(options)
                }
            }

        },
        // ip: string ,port:string
        writeConfig: function(ip, port) {
            summer.writeConfig({
                'host': ip || appsettings.params.requestParams.ip, //向configure中写入host键值
                'port': port || appsettings.params.requestParams.port //向configure中写入port键值
            })
        },
        // options: {action: "",params:{},sucess: fn,error: fn,timeout: num}
        callAction: function(options) {
            // 拿到前面设置的参数
            var requestParams = this._requestParams
                // ip,port可以前面设置,也可以动态的获取
            var ip = spring.getStorage("ip") ? spring.getStorage("ip") : requestParams.ip;
            var port = spring.getStorage("port") ? spring.getStorage("port") : requestParams.port;
            $.writeConfig(ip, port)
            var params = {
                'appid': requestParams.appid, //当前应用id
                'viewid': requestParams.viewid, //后台带包名的Controller名
                'action': options.action || requestParams.action, //方法名
                'params': options.params, //自定义参数
                'callback': mycallback, //请求回来后执行的js方法
                'timeout': options.timeout || 10, // 请求ma的超时时间,summer底层默认的也是10s
                'error': myerror, //失败回调的js方法
                'header': {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'imgfornote'
                }
            }

            function mycallback(data) {
                options.success(data); // 处理数据,去掉一些不必要的包裹层
            }

            function myerror(data) {
                options.error(data) // 数据处理
            }
            summer.callAction(params)
        },
        // 谷歌浏览器  属性 目标文件   加上 --args  --disable-web-security --user-data-dir解除谷歌安全策略
        _requestAjax: function(options) {
            var tempData = this._requestParams.params
            var data = {
                tip: "none",
                data: ''
            };
            var proxyIp = this._requestParams.ip,
                httpMesg = "http",
                proxyPort = this._requestParams.port;
            tempData.servicecontext.actionid = options.action || this._requestParams.action
            tempData.servicecontext.params = options.params
            data.data = JSON.stringify(tempData)
            if (this._requestParams.ishttps) {
                httpMesg = "https"
            }
            if (spring.getStorage("ip") && spring.getStorage("port")) {
                proxyIp = spring.getStorage("ip")
                proxyPort = spring.getStorage("port")
            }

            $.ajax({
                url: httpMesg + "://" + proxyIp + ":" + proxyPort + "/umserver/core",
                data: data,
                timeout: options.timeout || 10, // 可以根据需要自己设置超时时间
                dataType: "json",
                success: function(data) {
                    // 数据处理
                    options.success(data)
                },
                error: function(e) {
                    options.error(e)
                }
            })
        },
        // 监听物理返回键,  传一个回调
        onWatchBackBtn: function(callback) {
            document.addEventListener("deviceready", function() {
                document.addEventListener("backbutton", function() {
                    callback() // 执行回调,
                }, false);
            }, false);
        },
        // 退出H5小应用
        functionback: function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
            var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            if (isAndroid) {
                navigator.app.exitApp();
            }
            if (isIOS) {
                var pamn = {
                    "params": {
                        "transtype": "exit_back"
                    }
                };
                summer.callService("SummerService.gotoNative", pamn, false);
            }
        },
        // options:{transtype: str,innerParams:{},callback:fn,error:fn} 
        // transtype: "openalbum" 通过原生打开相册,并返回解压后的base64 (0.85)
        // transtype: "request_token" 通过原生获取用户的信息,ip,port,token,登录的信息和domain
        // transtype: "serviceCall" 通过原生去调ma拿数据
        // transtype: "takephote" 通过原生打开相机,并返回解压后的base64
        callServiceNative: function(options) {
            // 如果不传params,默认的获取的是用户的信息
            var transType = typeof options.transtype === "undefined" ? "request_token" : options.transtype;
            var params = {
                "params": {
                    transtype: transType,
                    innerParams: options.innerParams ? options.innerParams : {}
                },
                "callback": function(data) {
                    // 对数据做一些处理
                    options.callback(data)
                },
                "error": function(err) {
                    // 对数据做一些处理
                    options.error(err)
                }
            }
            if (options.innerParams) {
                params.params.innerParams = options.innerParams
            }
            if (options.controllerId) {
                params.params.controllerId = options.controllerId
            }
            // false:异步   true: 同步
            summer.callService("SummerService.gotoNative", params, false);
        },
        requestParams: function() {
            var request = {}
            request.appid = this.appid; // appid
            request.viewid = this.viewid; // 后台ma controller
            request.action = this.action; // controller中的方法,默认handler,可以传入
            request.ip = this.ip;
            request.port = this.port;
            request.token = "";
            request.isHttps = false
            request.params = {
                "serviceid": "umCommonService",
                "appcontext": {
                    "appid": request.appid,
                    "tabid": "",
                    "funcid": "",
                    "funcode": request.appid,
                    "userid": "",
                    "forelogin": "",
                    "token": "",
                    "pass": "",
                    "sessionid": "",
                    "devid": "C3474B8E-888D-4937-BDBA-025D8DAE3AE4",
                    "groupid": "",
                    "massotoken": "",
                    "user": ""
                },
                "servicecontext": {
                    "actionid": "",
                    "viewid": request.viewid,
                    "contextmapping": {
                        "result": "result"
                    },
                    "params": {
                        "chamc_mobiletoken": request.token,
                        "transtype": "urlparamrequest",
                        "contextmapping": '{"result" : "result"}',
                        "reqmethod": "POST",
                    },
                    "actionname": request.action,
                    "callback": ""
                },
                "deviceinfo": {
                    "firmware": "",
                    "style": "ios",
                    "lang": "zh-CN",
                    "imsi": "",
                    "wfaddress": "C3474B8E-888D-4937-BDBA-025D8DAE3AE4",
                    "imei": "",
                    "appversion": "1",
                    "uuid": "C3474B8E-888D-4937-BDBA-025D8DAE3AE4",
                    "bluetooth": "",
                    "rom": "",
                    "resolution": "",
                    "name": "kl",
                    "wifi": "",
                    "mac": "C3474B8E-888D-4937-BDBA-025D8DAE3AE4",
                    "ram": "",
                    "model": "iPhone",
                    "osversion": "iphone",
                    "devid": "C3474B8E-888D-4937-BDBA-025D8DAE3AE4",
                    "mode": "kl",
                    "pushtoken": "",
                    "categroy": "iPhone",
                    "screensize": {
                        "width": window.screen.width,
                        "heigth": window.screen.height
                    }
                }

            };
            return {
                requestParams: request
            }
        }
    }
    return (function() {
        // 现在js库比较小，可以再页面加载时，全部加载。复杂的时候，还是使用惰性加载比较好。
        return {
            init: function(options) {
                if (this instanceof Spring) {
                    return
                }
                window.spring = new Spring(options)
                return spring
            }
        }
    })()
})();