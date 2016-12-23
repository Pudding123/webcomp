/**
 * Created by yanghl on 16-5-19.
 */
define(function (require, exports, module) {
    'use strict';

    var Application = require("../common/application");
    var CommonUtil = require("CommonUtil");
    /**
     * App 应用入口类
     *
     * @class App
     */

    var App = Application.extend({

        /**
         * 应用启动入口
         */
        start: function () {
        },


        bindEvents: function () {
            var self = this, events = {};
            events[self.createEventName("click", "#submit")] = self.login;
            return events;
        },


        /**
         * 执行登录
         * @method doLogin
         */
        login: function (e) {
            var self = this;
            var userName = self.$el.find("#email").val();
            var password = self.$el.find("#password").val();
            this._doLogin({UserName: userName, Password: password});
        },


        /**
         * 执行登录
         * @method _doLogin
         * @private
         */
        _doLogin: function (data) {
            var self = this;

            self.submit({
                url: "api/login",
                data: JSON.stringify(data),
                success: function (context, data) {
                    var mData = data.Data;

                    if (!CommonUtil.isEmpty(mData)) {
                        if (mData.LoginStatus) {
                            window.location.href = "./index.html";
                        }else {
                            alert("用户名或密码错误!");
                        }
                    }else {
                        alert("用户名或密码错误!");
                    }
                },
                error: function (resp) {
                    alert("请求失败!");
                }
            })
        }
    });

    /**
     * App 实例
     * @property _instance
     * @type {App}
     * @default null
     * @private
     * @static
     */
    App._instance = null;


    /**
     * @static
     * @method getInstance
     * @public
     */
    App.getInstance = function () {
        if (App._instance === null) {
            App._instance = new App();
        }
        return App._instance;
    };

    return App;
});
