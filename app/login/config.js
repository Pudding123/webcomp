/**
 * Created by yanghl on 2016/8/31.
 */
requirejs.config({
    baseUrl: "./app",
    shim: {
        jquery: {
            exports: "$"
        },
        underscore: {
            exports: "_"
        },
        jtouch:{
            exports: "jtouch",
            deps: ["jquery"]
        },
        Ajax:{
            exports: "Ajax",
            deps: ["jquery"]
        },
        bootstrap:{
            exports: "Bootstrap",
            deps: ["jquery"]
        },
        rivets:{
            exports: "rivets",
            deps: ["sightglass"]
        },
        lte: {
            exports: "LTE",
            deps: ["jquery", "bootstrap"]
        },
        CommonUtil: {
            exports: "CommonUtil",
            deps: ["bignum"]
        }
    },
    paths: {
        /*=====================================================================================================*/
        /*  libs 配置*/
        /*=====================================================================================================*/
        //libs
        "jquery": "../lib/jquery/jquery-2.1.0",
        "lte": "../lib/lte/lte",
        "bootstrap": "../bootstrap/js/bootstrap",
        "jtouch": "../lib/jquery/jquery.touch",
        "bignum":"../lib/big/bignumber",
        "underscore": "../lib/common/underscore",
        "rivets": "../lib/binder/rivets",
        "sightglass": "../lib/binder/sightglass",
        "CommonUtil": "./common/common.util",
        "EventBus": "./common/event.bus",
        "Component": "./common/component",
        "WatchDog": "./common/watch.dog",
        "Core": "./common/core",
        "Ajax": "./common/ajax"
    }
});

require(["login/app"], function(App) {
    $(function(){
        var app = App.getInstance();
        app.start();
    });
});