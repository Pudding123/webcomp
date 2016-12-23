/**
 * Created by yanghailang on 2016/12/23.
 */

define(function (require, exports, module) {

    'use strict';
    var Component = require("Component");

    /**
     * 组件描述
     * @class ListComp
     */
    var ListComp = Component.extend({

        url : "list/test",

        /**
         * @class ListComp
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
    ListComp.prototype.template = function (data) {
        if (typeof data === "undefined") {
            data = {};
        }
        return JST["index/component/list/ListComp"](data);
    };

    /**
     * 界面渲染前执行方法。
     * @method beforeRender
     * @public
     */
    ListComp.prototype.beforeRender = function () {
    };


    /**
     * 界面渲染执行方法。
     * @method render
     * @public
     */
    ListComp.prototype.render = function (data, to) {
        Component.prototype.render.call(this, data, to);
        return this;
    };

    /**
     * 界面渲染后执行方法。
     * @method afterRender
     * @public
     */
    ListComp.prototype.afterRender = function () {
        Component.prototype.afterRender.call(this);
        this.getData();
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
    ListComp.prototype.bindEvents = function () {
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
    ListComp.prototype.subscribe = function () {
        var self = this, sub = {};
        return sub;
    };


    /**
     * 获取数据
     */
    ListComp.prototype.getData = function () {
        var self = this;
        self.submit({
            url : self.url,
            data : JSON.stringify({}),
            success: function(context, data){
                self.setModel(data);
            },
            error: function(){
            }
        })
    };


    return ListComp;
});
