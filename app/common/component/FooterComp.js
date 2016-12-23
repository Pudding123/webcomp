/**
 * Created by yanghailang on 2016/12/23.
 */

define(function (require, exports, module) {

    'use strict';
    var Component = require("Component");

    /**
     * 组件描述
     * @class FooterComp
     */
    var FooterComp = Component.extend({

        /**
         * @class FooterComp
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
    FooterComp.prototype.template = function (data) {
        if (typeof data === "undefined") {
            data = {};
        }
        return JST["common/component/FooterComp"](data);
    };

    /**
     * 界面渲染前执行方法。
     * @method beforeRender
     * @public
     */
    FooterComp.prototype.beforeRender = function () {
    };


    /**
     * 界面渲染执行方法。
     * @method render
     * @public
     */
    FooterComp.prototype.render = function (data, to) {
        Component.prototype.render.call(this, data, to);
        return this;
    };

    /**
     * 界面渲染后执行方法。
     * @method afterRender
     * @public
     */
    FooterComp.prototype.afterRender = function () {
        Component.prototype.afterRender.call(this);
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
    FooterComp.prototype.bindEvents = function () {
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
    FooterComp.prototype.subscribe = function () {
        var self = this, sub = {};
        return sub;
    };


    return FooterComp;
});
