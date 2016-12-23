var createObj, distFun, htmlFiles, jasmineFiles, jasmineHelperFiles, jsFiles, port, proxyPort,
    proxySnippet, lessFiles, split, templateFiles, createRequireObj,distRequireFun, distHtmlFun, jstFun, uglifyFun;
jsFiles = ["dist/**/*.js"];
jasmineFiles = ["spec/jasmine/**/*Spec.js"];
jasmineHelperFiles = ["spec/jasmine/*Helper.js"];
templateFiles = ["app/**/*.html"];
htmlFiles = ["./*.html"];
lessFiles = ["less/**/*.less"];
port = 9001;
proxyPort = 3000;
var imageFiles = "./resources/images/";

var DIST_HTML_PATH = "dist/";
var COMMON = "common";
var DIST_CSS_PATH = "./dist/resources/css/";
var DIST_JS_PATH = "./dist/app/";
var DIST_LIBJS_PATH = "./dist/lib/lib.min.js";
var DIST_IMAGE_PATH = "./dist/resources/images";

createObj = function (key, value) {
    var obj ={};
    obj[key] = value;
    return obj;
};
distFun = function (items) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        _results.push(createObj("release/" + item+".html", item +".html"));
    }
    return _results;
};

jstFun = function (items) {
    var item, _i, _len, _results;
    var list = items;
    var common = COMMON;
    _results = [];

    for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        _results.push(createObj("app/" + item+"/templates.js", ["app/"+ item +"/**/*.html"]));
        _results.push(createObj("app/" + item+"/templates.common.js", ["app/"+ common +"/**/*.html"]));
    }
    return _results;
};

uglifyFun =  function (items) {
    var item, _i, _len, _results;
    var list = items;
    var common = COMMON;

    var obj = {
        "dist/lib/require.min.js": ["lib/require/require.js"],
        "dist/lib/respond/html5.js": ["lib/respond/html5.js"],
        "dist/lib/respond/respond.js": ["lib/respond/respond.js"]
    };
    for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        var key = DIST_JS_PATH + item  +"/templates.min.js";
        var  _results = [];
        _results.push("app/" + item +"/templates.js");
        _results.push("app/" + item +"/templates.common.js");
        obj[key] = _results;
    }
    return obj;

};

distHtmlFun = function (items) {
    var item, _i, _len, _results;
    _results = [];

    for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        _results.push(createObj(DIST_HTML_PATH + item + ".html",  "release/" + item + ".html"));
    }
    return _results;
};

createRequireObj = function (item) {
    var obj= {
        options: {
            baseUrl: "./app",
            out: DIST_JS_PATH + item+"/app.min.js",
            name: item+"/config",
            exclude: ['lib.config'],
            insertRequire: ['lib.config'],
            optimize: 'uglify2',
            uglify2:{
                mangle:{
                    except: ["$super"]
                },
                compress:{
                    drop_console:true
                }
            },
            generateSourceMaps: false,
            preserveLicenseComments: false,
            findNestedDependencies: true,
            skipDirOptimize: true,
            mainConfigFile: ["./app/"+item+"/config.js"]
        }
    };
    return obj;
};

var createRequireLib = function () {
    var obj= {
        options: {
            baseUrl: "./app",
            out: DIST_LIBJS_PATH,
            name: "lib.config",
            include: ['lib.config'],
            generateSourceMaps: false,
            preserveLicenseComments: false,
            findNestedDependencies: true,
            skipDirOptimize: true,
            mainConfigFile: ["./app/lib.config.js"]
        }
    };
    return obj;
};

distRequireFun = function (items) {
    var item, _i, _len, _results;
    _results = {};
    _results.libs =  createRequireLib();
    for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        _results[item] = createRequireObj(item);
    }
    return _results;
};

proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
split = require("split");
module.exports = function (grunt) {
    var phase, task, _i, _len, _ref;
    var distConfig = grunt.file.readJSON("config/dist.json");
    phase = grunt.option("phase") || 3;
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        /* watch 用于文件监视，如果文件有改变， 则执行tasks中的任务 */
        watch: {
            template: {
                files: templateFiles,
                tasks: ["htmlhint:template", "jst"]
            },
            html: {
                files: htmlFiles,
                tasks: ["htmlhint:html"]
            },
            css: {
                files: lessFiles,
                tasks: ["less:development"]
            }
        },
        jshint: {
            options: {
                jshintrc: "config/.jshintrc"
            },
            jasmine: {
                files: {
                    src: jasmineFiles
                }
            }
        },
        jst: {
            compile: {
                options: {
                    processName: function (filename) {
                        return filename.replace(/(app\/|.html)/g, "");
                    }
                },
                files: jstFun(distConfig.config)
            }
        },
        htmlhint: {
            options: {
                htmlhintrc: "config/.htmlhintrc"
            },
            html: {
                src: htmlFiles
            },
            template: {
                src: templateFiles
            }
        },
        karma: {
            unit: {
                configFile: grunt.option('karmaconf') || 'spec/jasmine/karma.conf.js'
            },
            jenkins: {
                configFile: grunt.option('karmaconf') || 'spec/jasmine/karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS'],
                logLevel: 'INFO',
                reporters: ['progress', 'coverage'],
                coverageReporter: {
                    reporters: [
                        {
                            type: 'cobertura',
                            file: 'coverage.xml'
                        }, {
                            type: 'html',
                            file: 'coverage.html'
                        }
                    ]
                }
            },
            compass: {
                dist: {
                    options: {
                        sassDir: "resources/sass",
                        imagesDir: "resources/images/sprite",
                        cssDir: "resources/",
                        relativeAssets: true
                    }
                }
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            target: {
                files:uglifyFun(distConfig.config)
            }
        },
        concat: {
            css: {
                src: ['./resources/css/*.css'],
                dest: './release/app.css'
            }
        },
        //配置插件(css压缩)
        cssmin: {
            minify: {
                expand: true,
                cwd: "resources/css/",
                src: ["*.css", "!*.min.css"],
                dest: "./dist/resources/css",
                ext: ".min.css"
            },
            skin_mini: {
                expand: true,
                cwd: "resources/css/skins",
                src: ["*.css", "!*.min.css"],
                dest: "./dist/resources/css/skins",
                ext: ".min.css"
            }
        },
        // 配置插件(图片压缩)
        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 3 // png图片优化水平，3是默认值，取值区间0-7
                },
                files: [
                    {
                        expand: true, // 开启动态扩展
                        cwd: imageFiles, // 当前工作路径
                        src: ["**/*.{png,jpg,gif}"], // 要出处理的文件格式(images下的所有png,jpg,gif)
                        dest: DIST_IMAGE_PATH // 输出目录(直接覆盖原图)
                    }
                ]
            }
        },
        
        //执行copy
        copy: {
            // image: {
            //     src: "resources/images/*",
            //     dest: "dist/"
            // },
            font: {
                src: "resources/fonts/*",
                dest: "dist/"
            }
        },
        targethtml: {
            dist: {
                options: {
                    curlyTags: {
                        rlsdate: 'lkg<%= grunt.template.today("yyyymmddss")%>'
                    }
                },
                files: distFun(distConfig.config)
            }
        },
        htmlmin: {
            dist: {
                options: {
                       removeComments: true,
                        removeCommentsFromCDATA: true,
                        collapseWhitespace: true,
                        keepClosingSlash: true,
                        collapseBooleanAttributes: true,
                        removeAttributeQuotes: true,
                        removeRedundantAttributes: true,
                        useShortDoctype: true,
                        removeEmptyAttributes: true,
                        removeOptionalTags: true
                },
                files: distHtmlFun(distConfig.config)
            }
        },
        yuidoc: {
            compile: {
                name: "<%= pkg.name %>",
                description: "<%= pkg.description %>",
                version: "<%= pkg.version %>",
                url: "",
                options: {
                    linkNatives: "true",
                    attributesEmit: "true",
                    selleck: "true",
                    paths: "app/",
                    outdir: "doc/api/web-api/",
                    themedir: "doc/api/themes/"
                }
            }
        },
        clean: {
            base: ["dist", "release"],
            options: {
                force: true
            }
        },
        less: {
            // compileCore: {
            //     options: {
            //         strictMath: true,
            //         sourceMap: false,
            //         outputSourceFiles: true,
            //         sourceMapURL: '<%= pkg.name %>.css.map',
            //         sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
            //     },
            //     src: 'less/bootstrap.less',
            //     dest: './resources/css/bootstrap.css'
            // },
            // Development not compressed
            development: {
                options: {
                    // Whether to compress or not
                    compress: false
                },
                files: {
                    // compilation.css  :  source.less
                    "resources/css/app.css": "less/app.less",
                    //Non minified skin files
                    "resources/css/skins/skin-blue.css": "less/skins/skin-blue.less",
                    "resources/css/skins/skin-black.css": "less/skins/skin-black.less",
                    "resources/css/skins/skin-yellow.css": "less/skins/skin-yellow.less",
                    "resources/css/skins/skin-green.css": "less/skins/skin-green.less",
                    "resources/css/skins/skin-red.css": "less/skins/skin-red.less",
                    "resources/css/skins/skin-purple.css": "less/skins/skin-purple.less",
                    "resources/css/skins/skin-blue-light.css": "less/skins/skin-blue-light.less",
                    "resources/css/skins/skin-black-light.css": "less/skins/skin-black-light.less",
                    "resources/css/skins/skin-yellow-light.css": "less/skins/skin-yellow-light.less",
                    "resources/css/skins/skin-green-light.css": "less/skins/skin-green-light.less",
                    "resources/css/skins/skin-red-light.css": "less/skins/skin-red-light.less",
                    "resources/css/skins/skin-purple-light.css": "less/skins/skin-purple-light.less",
                    "resources/css/skins/_all-skins.css": "less/skins/_all-skins.less"
                }
            }
            
        },
        connect: {
            static: {
                options: {
                    port: port,
                    base: './',
                    keepalive: true,
                    hostname: '*',
                    middleware: function (connect) {
                        var func;
                        func = function (req, res, next) {
                            if (req.url.match(/\/ct\/[^\/]*\/resources/)) {
                                req.url = req.url.replace(/\/ct\/[^\/]*\/resources/, "/resources");
                            }
                            return next();
                        };
                        return [func, connect.static(require('path').resolve(".")), proxySnippet];
                    }
                }
            },
            proxies: [
                {
                    context: '/',
                    host: 'localhost',
                    port: proxyPort,
                    https: false,
                    changeOrigin: false,
                    rewrite: {
                        '^/ct/[^/]*': ''
                    }
                }
            ]
        },
        easymock: {
            api: {
                options: {
                    port: proxyPort,
                    path: 'mock-server/api',
                    // keepalive: true,
                    config: {
                        routes: [
                            "/resource/rank/:rankName/details",
                            "/command/selstock/getprices",
                            "/resource/symbols/:symbolTyp/:symbol/:marketCd/trades",
                            "/resource/symbols/fashions/more",
                            "/resource/symbols/:symbolTyp/:symbol/:marketCd/2/ohlcs",
                            "/resource/symbols/:symbolTyp/:symbol/:marketCd/4/ohlcs"
                        ]
                    }
                }
            }
        },
        requirejs: distRequireFun(distConfig.config),
        replace: {
            release: {
                src: ['index.html'],
                overwrite: true,
                replacements: [
                    {
                        from: './dist',
                        to: './release'
                    }, {
                        from: /templates.*\.js/,
                        to: 'templates-<%= pkg.version %>.js'
                    }, {
                        from: /all.*\.js/,
                        to: 'all-<%= pkg.version %>.js'
                    }, {
                        from: /app.*\.css/,
                        to: 'app-<%= pkg.version %>.css'
                    }, {
                        from: /\.\/resources\/css\/login_jsp.*\.css/,
                        to: './release/login_jsp-<%= pkg.version %>.css'
                    }, {
                        from: /\.\/resources\/js\/login\/messages.*\.js/,
                        to: './release/messages-<%= pkg.version %>.js'
                    }
                ]
            }
        }
    });
    /* grunt 加载task配置 */
    _ref = [
        "grunt-contrib-compass",
        "grunt-contrib-copy",
        "grunt-contrib-cssmin",
        "grunt-contrib-jasmine",
        "grunt-contrib-jshint",
        "grunt-contrib-jst",
        "grunt-contrib-uglify",
        "grunt-contrib-watch",
        "grunt-contrib-yuidoc",
        "grunt-contrib-htmlmin",
        "grunt-contrib-connect",
        "grunt-connect-proxy",
        "grunt-easymock",
        "grunt-exec",
        "grunt-htmlhint",
        "grunt-notify",
        "grunt-rsync",
        "grunt-karma",
        "grunt-contrib-clean",
        "grunt-markdown-pdf",
        "grunt-contrib-requirejs",
        "grunt-contrib-concat",
        'grunt-text-replace',
        'grunt-targethtml'];


    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        task = _ref[_i];
        grunt.loadNpmTasks(task);
    }

    grunt.registerTask('server', [
        'configureProxies:server',
        'easymock',
        'connect:static'
    ]);
    grunt.registerTask("dist", [
        "less",
        "clean",
        "jst",
        'targethtml:dist',
        "requirejs",
        // "concat:css",
        "uglify",
        "htmlmin:dist",
        "copy",
        "cssmin",
        "imagemin"

    ]);
};