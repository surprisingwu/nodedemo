var appsettings = {
        //options{appid: str, viewid: str,actions:str,ip:str,port:str,isHttps:boolean}
        setparams: function(options) {
            var request = this.params.requestParams
            for (var key in options) {
                if (options[key]) {
                    request[key] = options[key]
                }
            }
        },
        params: function() {
            var request = {}
            request.appid = "HRMeap"; // appid
            request.viewid = "com.yyjr.http.HttpClientController"; // 后台ma controller
            request.action = "handler"; // controller中的方法,默认handler,可以传入
            request.ip = "210.75.220.219";
            request.port = "9010";
            request.proxyUrl = "http://" + request.ip + ":" + request.port + "/umserver/core";
            request.proxy = "http://" + request.ip + ":" + request.port;
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
            }()
        }
    }
    // 设置一些可以可以改变的参数
spring.init({
    appid: '',
    action: '',
    viewid: '',
    ip: '',
    port: '',
    isHttps: false
})