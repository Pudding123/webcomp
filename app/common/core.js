/**
 * Created by yanghailang on 2016/12/21.
 */
define(function (require, exports, module) {

    require("jquery");

    var EventBus = require("EventBus");

    var Core = (function () {

        /**
         * @class common.Core
         * @constructor
         */
        function Core(options) {
            options || (options = {});

            this.initialize.apply(this, arguments);
        }


        /**
         * Core 初始化方法
         * @method initialize
         * @param options
         * */
        Core.prototype.initialize = function (options) {

        };

        /**
         * 创建事件绑定
         * @method createEventBindings
         * @private
         */
        Core.prototype.createEventBindings = function () {
            var self = this;
            var events = self.bindEvents();
            if (_.isObject(events)) {
                var $document = $(document);
                self.__bindingEvents = {};
                _.extend(self.__bindingEvents, events);
                _.each(events, function (value, key) {

                    var array = key.split("~");
                    var type = array[0];
                    var selector = array[1];

                    if (!_.isUndefined(type) && !_.isUndefined(selector)) {
                        $document.on(type, selector, _.bind(value, self));
                    }
                })
            }
        };

        /**
         * 创建所有事件绑定
         * @method removeEventBindings
         * @private
         */
        Core.prototype.removeEventBindings = function () {
            var self = this;
            var events = self.__bindingEvents;
            if (_.isObject(events)) {
                var $document = $(document);
                _.each(events, function (value, key) {
                    var array = key.split("~");
                    var type = array[0];
                    var selector = array[1];
                    if (!_.isUndefined(type) && !_.isUndefined(selector)) {
                        $document.off(type, selector);
                    }
                })
            }
        };

        /**
         * 增加单个事件绑定
         * @method addEventBinding
         * @param type 事件类型
         * @param selector 选择器
         * @param fn 绑定函数
         * @private
         */
        Core.prototype.addEventBinding = function (type, selector, fn) {
            var self = this;
            var events = self.__bindingEvents;
            if (_.isObject(events)) {
                var $document = $(document);
                var eventName = self.createEventName(type, selector);

                if (!_.isUndefined(type) && !_.isUndefined(selector) && !_.isUndefined(fn))
                    if (_.isUndefined(events[eventName])) {
                        $document.on(type, selector, _.bind(fn, self));
                    }
            }
        };

        /**
         * 解除单个事件绑定
         * @method removeEventBinding
         * @private
         */
        Core.prototype.removeEventBinding = function (type, selector) {
            var self = this;
            var events = self.__bindingEvents;
            if (_.isObject(events)) {
                var $document = $(document);
                var eventName = self.createEventName(type, selector);

                if (!_.isUndefined(type) && !_.isUndefined(selector))
                    if (!_.isUndefined(events[eventName])) {
                        $document.on(type, selector);
                    }
            }
        };


        /**
         * 绑定事件
         * @method bindEvents
         * @return {Object}
         * @example function(){
         *
         *  var events ={};
         *
         *  // createEventName  第一个参数 事件名称, 第二个参数 需要绑定的选择器  第三个指的绑定回调函数。
         *  events[ this.createEventName("click", ".class") ] = this.callback;
         *  return events;
         *
         * }
         */
        Core.prototype.bindEvents = function () {
            return {};
        };

        /**
         * 创建事件名称
         * @method createEventName
         * @param type 类型
         * @param selector 选择器
         * @return {String}
         */
        Core.prototype.createEventName = function (type, selector) {
            return type + "~" + selector;
        };


        /**
         * 订阅消息
         * @method subscribe
         * @example function(scope, data){
         *  //scope 作用域, data //dispatch data
         * }
         */
        Core.prototype.createSubscribe = function () {
            var self = this;
            //订阅列表
            self.__subscribe  = self.__subscribe || {};
            if (_.isFunction(self.subscribe)) {
                var subs = self.subscribe();
                if (_.isObject(subs)) {
                    _.each(subs, function (value, key) {
                        if (!self.hasSubscribe(key, value, self)) {
                            self.__subscribe[key] = value;
                            EventBus.addEventListener(key, value, self);
                        }
                    })
                }
            }
        };


        /**
         * 订阅消息
         * @method subscribe
         * @return {Object}
         * @example
         * {
         *    eventName: bindFn    //事件名称和  绑定函数
         * }
         */
        Core.prototype.subscribe = function () {
            return {};
        };




        /**
         * 增加消息订阅
         * @method addSubscribe
         * @eventName {String}订阅事件名称
         * @callback {Function}订阅回调
         */
        Core.prototype.addSubscribe = function (eventName, callback) {
            var self = this;
            if (!self.hasSubscribe(eventName, callback, self)) {
                self.__subscribe[eventName] = callback;
                EventBus.addEventListener(eventName, callback, self);
            }
        };



        /**
         * 取消所有订阅
         * @method unsubscribe
         */
        Core.prototype.unsubscribe = function () {
            var self = this;
            if (_.isObject(self.__subscribe)) {
                _.each(self.__subscribe, function (value, key) {
                    EventBus.removeEventListener(key, value, self);
                })
            }
        };

        /**
         * 取消一个订阅
         * @method unsubscribeOne
         * @param type
         * @param callback
         * @param scope
         */
        Core.prototype.unsubscribeOne = function (type, callback) {
            var self = this;
            EventBus.removeEventListener(type, callback, this);
            self.__subscribe[type] = undefined;
        };

        /**
         * 组件间发送消息
         * @method dispatch
         * @param type
         * @param args 发送的参数
         */
        Core.prototype.dispatch = function (type, args) {
            var self = this;
            EventBus.dispatch(type, self, args);
        };

        /**
         * 是否已经订阅
         * @method hasSubscribe
         * @param type
         * @param callback
         * @param scope
         * @returns {*}
         */
        Core.prototype.hasSubscribe = function (type, callback, scope) {
            return EventBus.hasEventListener(type, callback, scope);
        };

        /**
         * 获取服务端数据。
         * @method fetch
         * @param options
         * @param post 是否使用POST {}
         * @example  options = {
         *   url: "",
         *   data: {},
         *   success:function(){},
         *   error:function(){}
         * }
         * @public
         */
        Core.prototype.fetch = function (options, post) {
            var self = this;
            if (typeof options === "undefined") {
                options = {};
            }
            self.fetched = false;
            return $.ajax({
                url: options.url || this.url,
                type: post ? "POST" : "GET",
                data: options.data ? options.data : ""
            }).done(function (resp) {
                if (options.success) {
                    options.success(self, resp, options);
                }
            }).fail(function (resp) {
                if (options.error) {
                    options.error(self, resp, options);
                }
            }).always(function (resp) {
                self.fetched = true;
            });
        };


        /**
         * POST提交数据。
         * @method submit
         * @param options
         * @example  options = {
         *   url: "",
         *   data: {},
         *   success:function(){},
         *   error:function(){}
         * }
         * @public
         */
        Core.prototype.submit = function (options) {
            var self = this;
            return self.fetch(options, true);
        };

        return Core;

    })();

    /**
     *  Core 继承实现
     *  @method extend
     * */
    var extend = function (protoProps, staticProps) {
        var parent = this;
        var child;
        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () {
                return parent.apply(this, arguments);
            };
        }
        _.extend(child, parent, staticProps);
        var Surrogate = function () {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;
        if (protoProps) _.extend(child.prototype, protoProps);
        child.__super__ = parent.prototype;
        return child;
    };

    Core.extend = extend;

    return Core;

});
