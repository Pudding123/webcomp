/**
 * Created by yanghailang on 2016/12/23.
 */

define(function (require, exports, module) {

    'use strict';
    var Component = require("Component");

    /**
     * 组件描述
     * @class HeaderComp
     */
    var HeaderComp = Component.extend({

        url : "PlatApi/GetUserInfo",

        /**
         * @class HeaderComp
         * @constructor
         */
        initialize: function (options, data) {
            if (typeof options === "undefined") {
                options = {};
            }
            Component.prototype.initialize.call(this, options)
        }
    });


    /**
     * 预编译后的模板渲染成html
     * @method template
     * @param  {any} data
     * @return {string} html
     * */
    HeaderComp.prototype.template = function (data) {
        if (typeof data === "undefined") {
            data = {};
        }
        return JST["common/component/HeaderComp"](data);
    };

    /**
     * 界面渲染前执行方法。
     * @method beforeRender
     * @public
     */
    HeaderComp.prototype.beforeRender = function () {
    };


    /**
     * 界面渲染执行方法。
     * @method render
     * @public
     */
    HeaderComp.prototype.render = function (data, to) {
        Component.prototype.render.call(this, data, to);
        return this;
    };

    /**
     * 界面渲染后执行方法。
     * @method afterRender
     * @public
     */
    HeaderComp.prototype.afterRender = function () {
        Component.prototype.afterRender.call(this);
        var self = this;
        self._fetchData({ "user_type": 0, "id": "33a5256e8b454a5e80b0476f5d489d26", "action": "action1"});
    };


    /**
     * dom绑定事件
     * @method bindEvents
     * @return {Object}
     * @example function(){
     *
     *  var self= this, events ={};
     *  events[ this.createEventName("click", "class or id") ] = this.callback;
     *  return events;
     *  // createEventName  
     *      第一个参数 事件名称,
     *      第二个参数 需要绑定的选择器。
     *      callback  绑定回调函数。接收个参数 function(e){}
     *       e 只绑定的事件
     * }
     */
    HeaderComp.prototype.bindEvents = function () {
        var self = this, events = {};
        return events;
    };


    /**
     * 订阅消息
     * @method subscribe
     * @return {Object}
     * @example  function(){
     *   var self= this, sub ={};
     *   sub[eventName] = self.callback;
     *   eventName: 事件名称
     *   callback: 绑定回调函数
     *   callback 接收两个参数 function(context, data){}
     *   context : 谁发送的消息   data: 消息内容。
     * }
     */
    HeaderComp.prototype.subscribe = function () {
        var self = this, sub = {};
        return sub;
    };


    /**
     * 界面渲染后执行方法，可重写。
     * @method fetchData
     * @param data { "user_type": 0, "id": "33a5256e8b454a5e80b0476f5d489d26"}
     * @private
     */
    HeaderComp.prototype._fetchData = function (param) {
        var self = this;
        self.submit({
            url : self.url,
            data : JSON.stringify(param),
            success: function(context, data){
                self._setUserInfo(data);
            },
            error: function(){
            }
        })
    };

    /**
     * 设置个人信息。
     * @method _setUserInfo
     * @private
     */
    HeaderComp.prototype._setUserInfo = function (data) {
        var self = this;
        var $userIcon = self.$el.find(".user-panel>.image>img");
        var $userName = self.$el.find(".user-panel>.info>p");
        var name = data.Data.Name;
        $userName.text(name);
        self.dispatch("E_USER_INFO", self, data);
    };



    return HeaderComp;
});
