/**
 * Created by yanghl on 2016/5/30.
 */

define(function (require, exports, module) {

    var Router  = require("../common/router");

    var AppRouter = Router.extend({

        /**
         * 默认
         * @method defaultRoute
         */
        routes: {
            "": "defaultRoute",
            "list": "list",
            "chart": "chart"
        },

        /**
         * 默认
         * @method defaultRoute
         */
        defaultRoute: function () {
            this.dispatch("ROUTER_LIST", {
                data: AppRouter.TYPE_LIST
            });
        },


        /**
         * chart
         * @method chart
         */
        chart: function () {
            this.dispatch("ROUTER_CHART", {
                data: AppRouter.TYPE_CHART
            });
        },

        /**
         * list
         * @method chart
         */
        list: function () {
            this.dispatch("ROUTER_LIST", {
                data: AppRouter.TYPE_LIST
            });
        }

    });

    AppRouter.TYPE_LIST = 0;
    AppRouter.TYPE_CHART = 1;

    return AppRouter;
});