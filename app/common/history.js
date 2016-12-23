/**
 * Created by yanghailang on 2016/12/10.
 */


define(function (require, exports, module) {

    require("underscore");

    var History = (function () {

        var routeStripper = /^[#\/]|\s+$/g;

        var rootStripper = /^\/+|\/+$/g;

        var pathStripper = /#.*$/;

        /**
         * @class common.History
         * @constructor
         */
        function History() {
            this.handlers = [];
            _.bindAll(this, 'checkUrl');

            if (typeof window !== 'undefined') {
                this.location = window.location;
                this.history = window.history;
            }
        }

        History.started = false;

        History.prototype.interval = 50;

        /**
         * History
         * @method atRoot
         * */
        History.prototype.atRoot = function () {
            var path = this.location.pathname.replace(/[^\/]$/, '$&/');
            return path === this.root && !this.getSearch();
        };


        /**
         * History
         * @method matchRoot
         * */
        History.prototype.matchRoot = function () {
            var path = this.decodeFragment(this.location.pathname);
            var root = path.slice(0, this.root.length - 1) + '/';
            return root === this.root;
        };


        /**
         * History
         * @method decodeFragment
         * */
        History.prototype.decodeFragment = function (fragment) {
            return decodeURI(fragment.replace(/%25/g, '%2525'));
        };


        /**
         * History
         * @method getSearch
         * */
        History.prototype.getSearch = function () {
            var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
            return match ? match[0] : '';
        };


        /**
         * History
         * @method getHash
         * */
        History.prototype.getHash = function (window) {
            var match = (window || this).location.href.match(/#(.*)$/);
            return match ? match[1] : '';
        };

        /**
         * History
         * @method getPath
         * */
        History.prototype.getPath = function () {
            var path = this.decodeFragment(
                this.location.pathname + this.getSearch()
            ).slice(this.root.length - 1);
            return path.charAt(0) === '/' ? path.slice(1) : path;
        };


        History.prototype.getFragment = function (fragment) {
            if (fragment == null) {
                if (this._usePushState || !this._wantsHashChange) {
                    fragment = this.getPath();
                } else {
                    fragment = this.getHash();
                }
            }
            return fragment.replace(routeStripper, '');
        };


        History.prototype.start = function (options) {
            if (History.started) throw new Error('Backbone.history has already been started');
            History.started = true;

            this.options = _.extend({root: '/'}, this.options, options);
            this.root = this.options.root;
            this._wantsHashChange = this.options.hashChange !== false;
            this._hasHashChange = 'onhashchange' in window;
            this._useHashChange = this._wantsHashChange && this._hasHashChange;
            this._wantsPushState = !!this.options.pushState;
            this._hasPushState = !!(this.history && this.history.pushState);
            this._usePushState = this._wantsPushState && this._hasPushState;
            this.fragment = this.getFragment();

            this.root = ('/' + this.root + '/').replace(rootStripper, '/');

            if (this._wantsHashChange && this._wantsPushState) {

                if (!this._hasPushState && !this.atRoot()) {
                    var root = this.root.slice(0, -1) || '/';
                    this.location.replace(root + '#' + this.getPath());
                    return true;

                } else if (this._hasPushState && this.atRoot()) {
                    this.navigate(this.getHash(), {replace: true});
                }

            }

            if (!this._hasHashChange && this._wantsHashChange && !this._usePushState) {
                var iframe = document.createElement('iframe');
                iframe.src = 'javascript:0';
                iframe.style.display = 'none';
                iframe.tabIndex = -1;
                var body = document.body;
                this.iframe = body.insertBefore(iframe, body.firstChild).contentWindow;
                this.iframe.document.open().close();
                this.iframe.location.hash = '#' + this.fragment;
            }

            var addEventListener = window.addEventListener || function (eventName, listener) {
                    return attachEvent('on' + eventName, listener);
                };

            if (this._usePushState) {
                addEventListener('popstate', this.checkUrl, false);
            } else if (this._useHashChange && !this.iframe) {
                addEventListener('hashchange', this.checkUrl, false);
            } else if (this._wantsHashChange) {
                this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
            }

            if (!this.options.silent) return this.loadUrl();
        };


        History.prototype.stop = function () {
            var removeEventListener = window.removeEventListener || function (eventName, listener) {
                    return detachEvent('on' + eventName, listener);
                };

            if (this._usePushState) {
                removeEventListener('popstate', this.checkUrl, false);
            } else if (this._useHashChange && !this.iframe) {
                removeEventListener('hashchange', this.checkUrl, false);
            }

            if (this.iframe) {
                document.body.removeChild(this.iframe.frameElement);
                this.iframe = null;
            }

            if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
            History.started = false;
        };

        History.prototype.route = function (route, callback) {
            this.handlers.unshift({route: route, callback: callback});
        };

        History.prototype.checkUrl = function (e) {
            var current = this.getFragment();
            if (current === this.fragment && this.iframe) {
                current = this.getHash(this.iframe);
            }
            if (current === this.fragment) return false;
            if (this.iframe) this.navigate(current);
            this.loadUrl();
        };

        History.prototype.loadUrl = function (fragment) {
            if (!this.matchRoot()) return false;
            fragment = this.fragment = this.getFragment(fragment);
            return _.any(this.handlers, function (handler) {
                if (handler.route.test(fragment)) {
                    handler.callback(fragment);
                    return true;
                }
            });
        };


        History.prototype.navigate = function (fragment, options) {
            if (!History.started) return false;
            if (!options || options === true) options = {trigger: !!options};

            fragment = this.getFragment(fragment || '');

            var root = this.root;
            if (fragment === '' || fragment.charAt(0) === '?') {
                root = root.slice(0, -1) || '/';
            }
            var url = root + fragment;

            fragment = this.decodeFragment(fragment.replace(pathStripper, ''));

            if (this.fragment === fragment) return;
            this.fragment = fragment;

            if (this._usePushState) {
                this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

            } else if (this._wantsHashChange) {
                this._updateHash(this.location, fragment, options.replace);
                if (this.iframe && (fragment !== this.getHash(this.iframe))) {
                    if (!options.replace) this.iframe.document.open().close();
                    this._updateHash(this.iframe.location, fragment, options.replace);
                }

            } else {
                return this.location.assign(url);
            }
            if (options.trigger) return this.loadUrl(fragment);
        };


        History.prototype._updateHash = function (location, fragment, replace) {
            if (replace) {
                var href = location.href.replace(/(javascript:|#).*$/, '');
                location.replace(href + '#' + fragment);
            } else {
                location.hash = '#' + fragment;
            }
        };

        return History;

    })();


    return History;

});
