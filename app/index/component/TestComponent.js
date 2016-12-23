/**
 * Created by yanghailang on 2016/12/20.
 */

define(function (require, exports, module) {

    'use strict';
    var Component = require("../../common/component");

    /**
     * 组件描述
     * @class TestComponent
     */
    var TestComponent = Component.extend({

        /**
         * @class TestComponent
         * @constructor
         */
        initialize: function (options) {
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
    TestComponent.prototype.template = function (data) {
        if (typeof data === "undefined") {
            data = {};
        }
        return JST["index/component/TestComponent"](data);
    };

    /**
     * 界面渲染前执行方法，可重写。
     * @method beforeRender
     * @public
     */
    TestComponent.prototype.beforeRender = function () {
    };


    /**
     * 界面渲染后执行方法，渲染。
     * @method render
     * @public
     */
    TestComponent.prototype.render = function (data, to) {
        Component.prototype.render.call(this, data, to);
        return this;
    };

    /**
     * 界面渲染后执行方法，可重写。
     * @method afterRender
     * @public
     */
    TestComponent.prototype.afterRender = function () {
        Component.prototype.afterRender.call(this);
        this.registerFormatFn({
            classFormat: function (checked) {
                if (checked){
                    return "red";
                }
                return "green";
            }
        });
        this.setData();
    };


    TestComponent.prototype.setData = function () {
        var self = this;



        var data = {
            user:{
            name: "lkg-text"
            }
        };
        self.setModel(data);


        setTimeout(function () {
            data.user.html = "<div style='background: #ff0000;'>lkg-html</div>";
            self.setModel(data);
        }, 500);

        setTimeout(function () {
            data.user.name = "inputValue";
            self.setModel(data);
        }, 1000);

        setTimeout(function () {
            data.user.checked = true;
            self.setModel(data);
        }, 1500);


        setTimeout(function () {
            data.user.checked = false;
            self.setModel(data);
        }, 2500);


        setTimeout(function () {
            data.list = [
                {
                    checked: true,
                    name: "name1"
                },
                {
                    checked: false,
                    name: "name2"
                },
                {
                    checked: true,
                    name: "name3"
                },
                {
                    checked: true,
                    name: "name4"
                },
                {
                    checked: false,
                    name: "name5"
                }

            ];
            self.setModel(data);
        }, 2600);
    };





    return TestComponent;
});
