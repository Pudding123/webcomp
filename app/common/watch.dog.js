define(function(require, exports) {
    var WatchDog = (function () {
        /**
         * 
        * @param onTimeOut {Function}
        * @param [interval=10*1000] {number} 监视时间间隔 (ms)
        * @example
        *      var wd = new WatchDog(function(){alert("bow-wow");}, 60*1000);
        *      wd.reset(); // 60秒以内reset
        */
        function WatchDog(onTimeOut, interval) {
            if (typeof interval === "undefined") { interval = WatchDog.DEFAULT_WATCH_DOG_INTERVAL; }
            this.onTimeOut = onTimeOut;
            this.interval = interval;
            if (!onTimeOut) {
                throw new Error("need onTimeOut callback.");
            }
            this.reset();
        }
        /**
        * @method reset
        */
        WatchDog.prototype.reset = function () {
            var _this = this;
            this.stop();
            this._tid = setTimeout(function () {
                _this.onTimeOut.call(_this);
            }, this.interval);
        };

        /**
        * @method stop
        */
        WatchDog.prototype.stop = function () {
            if (this._tid) {
                clearTimeout(this._tid);
                this._tid = null;
            }
        };
        WatchDog.DEFAULT_WATCH_DOG_INTERVAL = 60 * 1000;
        return WatchDog;
    })();

    return WatchDog;
});
