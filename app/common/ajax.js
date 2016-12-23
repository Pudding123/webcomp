/**
 * Created by yanghl on 16-5-19.
 */
define(function (require, exports, module) {
    var WatchDog = require("WatchDog");
    require("underscore");
    /**
     * Ajax扩展类
     *
     * @class common.Ajax
     */
    var Ajax = (function () {
        /**
         * @class common.Ajax
         * @constructor
         */
        function Ajax() {
            /**
             * Ajax Request执行前
             *
             * @property _beforeSendHandler
             * @type {Array}
             * @default []
             * @private
             */
            this._beforeSendHandler = [];
            /**
             * 初始化完了Flg
             *
             * @property _initialized
             * @type {boolean}
             * @default false
             * @private
             */
            this._initialized = false;
            /**
             * loading TExt
             *
             * @property _loadingText
             * @type {string}
             * @default ""
             * @private
             */
            this._loadingText = "";
            /**
             * loading 有效/无效
             *
             * @property _maskEnabled
             * @type {boolean}
             * @default true
             * @private
             */
            this._maskEnabled = true;
            /**
             * loading 调用
             *
             * @property _stack
             * @type {DialogController[]}
             * @default []
             * @private
             */
            this._stack = [];
            /**
             * Alert DIALOG
             *
             * @property _alert
             * @type {DialogController}
             * @private
             */
            if (Ajax._instance) {
                throw new Error("must use the getInstance.");
            }
        }

        /**
         * @static
         * @method getInstance
         * @return {app.framework.common.SessionManager}
         */
        Ajax.getInstance = function () {
            if (this._instance === null) {
                this._instance = new Ajax();
            }
            return this._instance;
        };

        /**
         * Eagle用AjaxParam设定
         * @static
         * @method setupGlobalSettings
         * @param {JQueryAjaxSettings} [setting]
         */
        Ajax.setupGlobalSettings = function (settings) {
            $.ajaxSetup(_.extend({
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: false,
                global: false
            }, settings));
        };

        /**
         * Ajax送信前向追加处理
         * @static
         * @method addBeforeSendHandler
         * @param {Function} fn
         */
        Ajax.addBeforeSendHandler = function (fn) {
            Ajax.getInstance()._beforeSendHandler.push(fn);
        };

        /**
         * Ajax送信前向追加处理增删除
         *
         * @static
         * @method clearBeforeSendHandler
         */
        Ajax.clearBeforeSendHandler = function () {
            Ajax.getInstance()._beforeSendHandler = [];
        };

        /**
         *
         * @static
         * @method setRedirectTo
         * @param {string} to
         */
        Ajax.setRedirectTo = function (to) {
            Ajax.getInstance()._redirectTo = to;
        };

        /**
         * @static
         * @method enableMask
         */
        Ajax.enableMask = function () {
            var me = Ajax.getInstance();
            me._maskEnabled = true;
        };

        /**
         * @static
         * @method disableMask
         */
        Ajax.disableMask = function () {
            var me = Ajax.getInstance(), len = me._stack.length, i;

            for (i = 0; i < len; i++) {
                me._unmask();
            }
            me._maskEnabled = false;
        };

        /**
         * 初始化
         * @static
         * @method initialize
         */
        Ajax.initialize = function () {
            var me = Ajax.getInstance();
            if (me._initialized) {
                // console.warn("already initialized.");
                return;
            }
            me._setupBeforeSend();
            me._customizeAjax();
            Ajax.setupGlobalSettings();
            me._initialized = true;
        };

        /**
         * 设置loading 文字
         * @static
         * @method setLoadingText
         * @param {string} text
         */
        Ajax.setLoadingText = function (text) {
            Ajax.getInstance()._loadingText = text;
        };

        /**
         * @method _setupBeforeSend
         * @private
         */
        Ajax.prototype._setupBeforeSend = function () {
            var me = this;
            $.ajaxSettings.beforeSend = _.wrap($.ajaxSettings.beforeSend, function (original, jqXHR, settings) {
                if (typeof settings === "undefined") {
                    settings = {};
                }
                me._mask(settings["noMask"]);
                _.each(me._beforeSendHandler, function (fn) {
                    return fn(jqXHR, settings);
                });
                if (_.isFunction(original)) {
                    original(jqXHR, settings);
                }
            });
        };

        /**
         * @method _customizeAjax
         * @private
         */
        Ajax.prototype._customizeAjax = function () {
            var self = this;
            $.ajax = _.wrap($.ajax, function (original, settings) {

                if (!_.isUndefined(self._host)) {
                    if (_.isObject(settings)) {
                        settings.url = self._host + settings.url;
                    } else {
                        settings = self._host + settings;
                    }
                    console.log("msg: " + settings.url + "  type:" + settings.type);
                }

                var ajax = original(settings);
                ajax.fail(function (resp, st, msg) {
                    if (!resp.status && st !== "abort") {
                        // XHR error
                    }
                });
                ajax.done(function (resp) {
                    if (typeof resp === "undefined") {
                        resp = {};
                    }
                    if (resp.redirectTo) {
                        if (resp.alertMsg) {

                        } else {
                            self._redirect(resp.redirectTo);
                        }
                    }
                });
                ajax.always(function () {
                    self._unmask();
                });
                return ajax;
            });
        };

        Ajax.prototype._redirect = function (redirectTo) {
            $(window).off();
            location.href = redirectTo;
        };

        /**
         * @method _mask
         * @private
         * @param noMask 
         */
        Ajax.prototype._mask = function (noMask) {
            if (typeof noMask === "undefined") {
                noMask = false;
            }
            var mask = null;
            if (this._maskEnabled && this._canShowMask() && !noMask) {
                mask = null;
                // mask.show();
                this._stack.unshift(mask);
                this._startWatchDog();
            } else {
                this._stack.push(mask);
            }
        };

        /**
         * @method _canShowMask
         * @returns {boolean}
         * @private
         */
        Ajax.prototype._canShowMask = function () {
            return (this._stack.length === 0 || this._stack[0] === null);
        };

        /**
         * @method _startWatchDog
         * @private
         */
        Ajax.prototype._startWatchDog = function () {
            var me = this;
            if (me._watchDog) {
                me._watchDog.reset();
            } else {
                me._watchDog = new WatchDog(function () {
                    var enable = me._maskEnabled;
                    Ajax.disableMask();
                    if (enable) {
                        Ajax.enableMask();
                    }
                });
            }
        };

        /**
         * @method _unmask
         * @private
         */
        Ajax.prototype._unmask = function () {
            var mask = this._stack.pop();
            if (mask) {
                mask.hide();
                this._watchDog.stop();
            }
        };
        Ajax._instance = null;
        return Ajax;
    })();
    return Ajax;
});
