/**
 * Created by yanghailang on 2016/12/10.
 */

define(function (require, exports, module) {


    var History = require("./history");
    var Core = require("./core");

    var optionalParam = /\((.*?)\)/g;
    var namedParam = /(\(\?)?:\w+/g;
    var splatParam = /\*\w+/g;
    var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

    var Router = Core.extend({

        /**
         * 初始化函数
         * @param options
         */
        initialize: function (options) {
            options || (options = {});

            if (options.routes) this.routes = options.routes;

            this._bindRoutes();

        }

    });


    /**
     * Router
     * @method initialize
     * */
    Router.prototype.route = function (route, name, callback) {
        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
        if (_.isFunction(name)) {
            callback = name;
            name = '';
        }
        if (!callback) callback = this[name];
        var router = this;
        Router.history.route(route, function (fragment) {
            var args = router._extractParameters(route, fragment);
            if (router.execute(callback, args, name) !== false) {
                // router.trigger.apply(router, ['route:' + name].concat(args));
                // router.trigger('route', name, args);
                // Router.history.trigger('route', router, name, args);
            }
        });
        return this;
    };


    Router.prototype.execute = function (callback, args, name) {
        if (callback) callback.apply(this, args);
    };

    Router.prototype.navigate = function (fragment, options) {
        Router.history.navigate(fragment, options);
        return this;
    };

    Router.prototype._bindRoutes = function () {
        if (!this.routes) return;
        this.routes = _.result(this, 'routes');
        var route, routes = _.keys(this.routes);
        while ((route = routes.pop()) != null) {
            this.route(route, this.routes[route]);
        }
    };

    Router.prototype._routeToRegExp = function (route) {
        route = route.replace(escapeRegExp, '\\$&')
            .replace(optionalParam, '(?:$1)?')
            .replace(namedParam, function (match, optional) {
                return optional ? match : '([^/?]+)';
            })
            .replace(splatParam, '([^?]*?)');
        return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    };


    Router.prototype._extractParameters = function (route, fragment) {
        var params = route.exec(fragment).slice(1);
        return _.map(params, function (param, i) {
            if (i === params.length - 1) return param || null;
            return param ? decodeURIComponent(param) : null;
        });
    };

    Router.history = new History;

    return Router;

});

