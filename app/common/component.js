/**
 * Created by yanghl on 16-5-19.
 */
define(function (require, exports, module) {

    'use strict';
    require("underscore");
    var CommonUtil = require("CommonUtil");
    var rivets = require("rivets");
    var Core = require("Core");

    /**
     * 基础组件
     * @class common.Component
     */
    var Component = Core.extend({

        /**
         * Component 初始化方法
         * @method initialize
         * */
        initialize: function (options, data) {

            /**
             * 组件唯一ID
             * @property cid
             * @type {String}
             */
            this.cid = _.uniqueId('comp');

            /**
             *
             * 是否已经渲染
             * @property rendered
             * @type {Boolean}
             * */
            this.rendered = false;


            /**
             *
             * 是否延迟渲染 如果延迟渲染的话,则渲染的时候不执行render方法
             * @property rendered
             * @type {Boolean}
             * */
            this.deferRender = false;

            /**
             * 是否已经绑定
             *  @property hasViewBind
             *  @type {boolean}
             */
            this.hasViewBind = false;

            options || (options = {});
            _.extend(this, options);

            this._ensureElement();

            this._initComponent(options);

            Core.prototype.initialize.call(this, options);
        }
    });

    /**
     *
     * @method template
     * @param data
     * @public
     */
    Component.prototype.template = function (data) {};


    /**
     * 执行初始化所有的子ViewController，包括存储
     *
     * @private
     * @method _initController
     * @options
     * @example components= {};
     *   components[PAGE.CTR_MENU] = {
         *       klass: component,
         *       rel: PAGE.CTR_MENU,
         *       el:".x-more-container",
         *       data:{
         *           groupID:groupID
         *       }
         *   };
     * @return null
     */
    Component.prototype._initComponent = function (options) {
        var self = this;
        if (typeof options === "undefined" || options === null) {
            options = {};
        }

        self.childrenComponent = this.childrenComponent || {};
        self.relationships = {};
        self.model = {};

        self.createSubscribe();

        self.render = (_.wrap(self.render, function (render) {
            var arg = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                arg[_i] = arguments[_i + 1];
            }
            self.beforeRender();
            render.call(self, arg[0], arg[1]);
            self.afterRender();
            return self;
        }));
        self._setComponents(options.components);
    };

    /**
     *
     * 渲染组件
     * @method renderComponents
     * @param components
     */
    Component.prototype.renderComponents = function (components) {
        this._setComponents(components, true);
    };


    /**
     * 继续触发事件。
     *
     * @method _setComponents
     * @param components
     */
    Component.prototype._setComponents = function (components, requireRender) {
        var self = this;
        if (typeof components === "undefined") {
            components = {};
        }
        self.childrenComponent = _.extend(self.childrenComponent, components);
        var index = 0;
        _.each(components, function (component, key) {
            if (!component.instance) {
                component.index = index;
                if (!component.instance && component.klass) {
                    var data = component.data;
                    component.instance = new component.klass(null, data);
                    if (requireRender) {
                        component.instance.render(data, component.el);
                    }
                }
                component.instance._setComponentName(key);
                if (component.rel) {
                    component.instance.relKey = component.rel;
                    var rel = {};
                    rel[component.rel] = component.instance;
                    self._setRelationships(rel);
                }
                index++;
            }
        });
    };



    /**
     * 注册一个模板函数。
     * @method registerFormatFn
     * @param options
     * @example  options = {
         *   fnName: function,
         * }
     * @public
     */
    Component.prototype.registerFormatFn = function (options) {
        var self = this;
        options = options || {};
        _.each(options, function (value, key) {
            if(!CommonUtil.isEmpty(key) && _.isFunction(value)){
                rivets.formatters[key] = value;
            }
        });
    };


    /**
     * 解除注册一个模板函数。
     * @method unRegisterFormatFn
     * @param fnName
     * @public
     */
    Component.prototype.unRegisterFormatFn = function (fnName) {
        var self = this;
        options = options || {};
        if( _.isFunction(rivets.formatters[fnName])){
            rivets.formatters[fnName] = undefined;
        }
    };


    /**
     *
     * 设置data
     * @method setModel
     * @param model
     */
    Component.prototype.setModel = function (model) {
        var self = this;
        self.$el.unbind();
        model = CommonUtil.isEmpty(model) ? {} : model;
        self.model = CommonUtil.isEmpty(self.model) ? {} : self.model;
        _.extend(self.model, model);

        if (!self.hasViewBind) {
            rivets.bind(self.$el, self.model);
            self.hasViewBind = true;
        }
    };


    /**
     *
     * 更新Model绑定值 data
     * @method setModel
     * @param model
     */
    Component.prototype.updateModel = function (model) {
        var self = this;
        model = CommonUtil.isEmpty(model) ? {} : model;
        self.model = model;
        if (!self.hasViewBind) {
            rivets.bind(self.$el, self.model);
            self.hasViewBind = true;
        }
    };


    /**
     * 设置映射关系。
     *
     * @method _setRelationships
     * @param rel
     */
    Component.prototype._setRelationships = function (rel) {
        var self = this;
        if (typeof rel === "undefined") {
            rel = {};
        }
        self.relationships = _.extend(self.relationships, rel);
    };


    /**
     * 界面渲染后执行方法，渲染。
     * @method render
     * @public
     */
    Component.prototype.render = function (data, to) {
        var self = this;
        if (typeof data === "undefined") {
            data = {};
        }
        if (typeof to === "undefined") {
            to = self.el;
        }
        self.setElement(to);
        //渲染后的html 放到指定的元素中去
        var _$el = self.$el;

        var html = self.template(data);
        var $html = $(html);

        _.each(this.childrenComponent, function (c, key) {
            if (c.el != undefined || c.el != null) {
                if (c.instance) {
                    c.instance.setElement($html.find(c.el));
                    if (!c.instance.deferRender) {
                        c.instance.render(_.extend({}, data));
                    }
                }
            }
        });

        if (!CommonUtil.isEmpty(html)) {
            _$el.append($html);
        }

        self.rendered = true;

        //创建事件绑定
        self.createEventBindings(self.getComponentID());
        return this;
    };

    /**
     * 界面渲染后执行方法，可重写。
     * @method afterRender
     * @public
     */
    Component.prototype.afterRender = function () {
        var self = this;
    };

    /**
     * 根据组件名称 获取组件。
     * @method getComponentByName
     * @public
     */
    Component.prototype.getComponentByName = function (name) {
        return this.relationships[name];
    };

    /**
     * 设置组件名称。
     * @method _setComponentName
     * @method name //组件名称
     * @public
     */
    Component.prototype._setComponentName = function (name) {
        this.componentName = name;
    };

    /**
     * 获取组件名称。
     * @method getComponentName
     * @public
     */
    Component.prototype.getComponentName = function () {
        return this.componentName;
    };

    /**
     * 设置组件Element。
     * @method setElement
     * @public
     */
    Component.prototype.setElement = function (element) {
        this._setElement(element);
        return this;
    };

    /**
     * 销毁组件
     * @method destroy
     * @public
     * */
    Component.prototype.destroy = function () {
        var self = this;
        self._removeElement();
        self.unsubscribe();
        self.relationships[self.getComponentName()] = undefined;
        return this;
    };

    /**
     * 清空组件下的DOM元素
     * @method empty
     * @public
     * */
    Component.prototype.empty = function () {
        var self = this;
        if (!_.isUndefined(self.$el)) {
            self.$el.empty();
        }
    };

    /**
     * 显示组件
     * @method show
     * @public
     * */
    Component.prototype.show = function () {
        var self = this;
        if (!_.isUndefined(self.$el)) {
            self.$el.show();
        }
    };

    /**
     * 隐藏组件
     * @method hide
     * @public
     * */
    Component.prototype.hide = function () {
        var self = this;
        if (!_.isUndefined(self.$el)) {
            self.$el.hide();
        }
    };


    /**
     * 获取组件ID
     * @method hide
     * @param noSymbol {Boolean} 是否带有#标记
     * @public
     * */
    Component.prototype.getComponentID = function (noSymbol) {
        var self = this;
        if (noSymbol){
            return self.cid;
        }
        return "#"+ self.cid;
    };

    /**
     * 检测元素是否存在
     * @method _ensureElement
     * @private
     * */
    Component.prototype._ensureElement = function () {
        if (!this.el) {
            var attrs = _.extend({}, _.result(this, 'attributes'));
            if (this.id) attrs.id = _.result(this, 'id');
            if (this.className) attrs['class'] = _.result(this, 'className');
            this.setElement(this._createElement(_.result(this, 'tagName')));
            this._setAttributes(attrs);
        } else {
            this.setElement(_.result(this, 'el'));
        }
    };


    /**
     * 创建元素
     * @method _createElement
     * @param tagName
     * @private
     * */
    Component.prototype._createElement = function (tagName) {
        return document.createElement(tagName);
    };


    /**
     * 设置元素
     * @method _setElement
     * @param el
     * @private
     * */
    Component.prototype._setElement = function (el) {
        var self = this;

        if (CommonUtil.isEmpty(el)) {
            el = "body";
        }
        self.$el = el instanceof $ ? el : $(el);
        if (CommonUtil.isEmpty(self.$el.attr("id"))) {
            self.$el.attr("id", self.cid);
        }
        self.el = self.$el[0];
    };

    /**
     * 设置元素基本属性
     * @method _setAttributes
     * @param attributes
     * @private
     * */
    Component.prototype._setAttributes = function (attributes) {
        this.$el.attr(attributes);
    };

    /**
     * 清空组件dom
     * @method _removeElement
     * @private
     * */
    Component.prototype._removeElement = function () {
        this.$el.unbind();
        this.$el.empty();
    };





    return Component;
});
