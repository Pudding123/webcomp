/**
 * Created by yanghl on 16-5-19.
 */
define(function(require, exports, module){
    'use strict';

    var Application = require("../common/application");
    var MainComp = require("./component/MainComp");

    /**
     * App 应用入口类
     *
     * @class App
     */
    var App =  Application.extend({

        start: function () {
            new MainComp().render(null, "body");
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
