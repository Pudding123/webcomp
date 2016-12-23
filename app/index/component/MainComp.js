/**
 * Created by yanghailang on 2016/12/23.
 */

define(function (require, exports, module) {

    'use strict';
    var Component = require("Component");

    var CommonUtil = require("CommonUtil"),
        AppRouter = require("../app.router"),
        Router = require("../../common/router"),
        HeaderComp = require("../../common/component/HeaderComp"),
        FooterComp = require("../../common/component/FooterComp"),
        AsideComp = require("../../common/component/AsideComp"),
        ChartComp = require("./chart/ChartComp"),
        ListComp = require("./list/ListComp");


    /**
     * 组件描述
     * @class MainComp
     */
    var MainComp = Component.extend({

        /**
         * @class MainComp
         * @constructor
         */
        initialize: function (options, data) {
            if (typeof options === "undefined") {
                options = {};
            }

            var components = {};
            components["HeaderComp"] = {
                klass: HeaderComp,
                rel: "HeaderComp",
                el: ".main-header"
            };

            components["FooterComp"] = {
                klass: FooterComp,
                rel: "FooterComp",
                el: ".main-footer"
            };

            components["AsideComp"] = {
                klass: AsideComp,
                rel: "AsideComp",
                el: ".main-sidebar",
                data: {type: AsideComp.TYPE_2}
            };

            options = _.extend(options, {components: components});

            Component.prototype.initialize.call(this, options)
        }
    });


    /**
     * 预编译后的模板渲染成html
     * @method template
     * @param  {any} data
     * @return {string} html
     * */
    MainComp.prototype.template = function (data) {
        if (typeof data === "undefined") {
            data = {};
        }
        return JST["index/component/MainComp"](data);
    };

    /**
     * 界面渲染前执行方法。
     * @method beforeRender
     * @public
     */
    MainComp.prototype.beforeRender = function () {
    };


    /**
     * 界面渲染执行方法。
     * @method render
     * @public
     */
    MainComp.prototype.render = function (data, to) {
        Component.prototype.render.call(this, data, to);
        return this;
    };

    /**
     * 界面渲染后执行方法。
     * @method afterRender
     * @public
     */
    MainComp.prototype.afterRender = function () {
        Component.prototype.afterRender.call(this);
        require(["lte"], function () {});
        new AppRouter();
        Router.history.start();
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
    MainComp.prototype.bindEvents = function () {
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
    MainComp.prototype.subscribe = function () {
        var self = this, sub = {};
        sub["ROUTER_LIST"] = self.routerCallback;
        sub["ROUTER_CHART"] = self.routerCallback;
        return sub;
    };


    /**
     * router 接收函数
     * @param context
     * @param data
     */
    MainComp.prototype.routerCallback = function (context, data) {
        var self = this;
        var type = data.data;

        switch (type){
            case AppRouter.TYPE_LIST:
                self.showList();
                break;
            case AppRouter.TYPE_CHART:
                self.showChart();
                break;
        }
    };



    /**
     * 显示chart
     * @method showChart
     */
    MainComp.prototype.showChart = function () {
        var self = this;
        self.$el.find(".content-wrapper>div").hide();
        self.$el.find(".chart-wrap").show();
        if (!self.getComponentByName("ChartComp")){
            self.renderChart();
        }
    };


    /**
     * 显示列表
     * @method showList
     */
    MainComp.prototype.showList = function () {
        var self = this;
        self.$el.find(".content-wrapper>div").hide();
        self.$el.find(".list-wrap").show();

        if (!self.getComponentByName("ListComp")){
            self.renderList();
        }
    };


    /**
     * 渲染chart
     * @method renderChart
     */
    MainComp.prototype.renderChart = function () {
        var self = this, components = {};
        components["ChartComp"] = {
            klass: ChartComp,
            rel: "ChartComp",
            el: ".chart-wrap"
        };
        self.renderComponents(components);
    };


    /**
     * 渲染list
     * @method renderList
     */
    MainComp.prototype.renderList = function () {
        var self = this,  components = {};
        components["ListComp"] = {
            klass: ListComp,
            rel: "ListComp",
            el: ".list-wrap"
        };
        self.renderComponents(components);
    };

    return MainComp;
});
