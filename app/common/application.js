/**
 * Created by yanghailang on 2016/12/21.
 */

define(function (require, exports, module) {

    var Core = require("Core");
    var Ajax = require("Ajax");
    var CommonUtil = require("CommonUtil");
    var Rivets = require("rivets");


    var Application = Core.extend({

        /**
         * Application 初始化方法
         * @method initialize
         * @param options
         * */
        initialize: function (options) {

            /**
             * application唯一ID
             * @property cid
             * @type {String}
             */
            this.appid = _.uniqueId('app');

            //ajax 初始化
            Ajax.initialize();
            this._initViewBind();
            this._setElement("body");
            this.createEventBindings();
            Core.prototype.initialize.call(this, options);
        },

        /**
         * Application 初始化方法
         * @method initialize
         * @param options
         * */
        _initViewBind: function () {

            Rivets.configure({
                // 模板标识符
                prefix: 'lkg',
                // 预加载
                preloadData: true,
                rootInterface: '.',
                //模板标识符   绑定文字
                templateDelimiters: ['{', '}'],
                iterationAlias: function (modelName) {
                    return '%' + modelName + '%';
                },
                handler: function (target, event, binding) {
                    this.call(target, event, binding.view.models)
                },
                executeFunctions: false
            })

        },

        /**
         * 设置元素
         * @method _setElement
         * @param el
         * @private
         * */
        _setElement: function (el) {
            var self = this;

            if (CommonUtil.isEmpty(el)) {
                el = "body";
            }
            self.$el = el instanceof $ ? el : $(el);
            if (CommonUtil.isEmpty(self.$el.attr("id"))) {
                self.$el.attr("id", self.cid);
            }
            self.el = self.$el[0];
        }

    });


    return Application;

});
