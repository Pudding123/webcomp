this["JST"] = this["JST"] || {};

this["JST"]["common/component/AsideComp"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<!-- sidebar: style can be found in sidebar.less -->\n<section class="sidebar">\n    <ul class="sidebar-menu">\n\n        <li ';
if(type =="1"){;
__p += '\n            class="active"\n        ';
};
__p += ' ><a href="#list"><i class="iconfont icon-suoyoudingdan"></i> <span>报表查询</span></a></li>\n        <li ';
if(type =="2"){;
__p += '\n        class="active"\n        ';
};
__p += ' ><a href="#chart"><i class="iconfont icon-buchongiconsvg14"></i> <span>图表分析</span></a></li>\n\n        <li class="active" style="position: absolute; bottom: 0px; width: 100%;"><a href="./login.html"><i class="iconfont icon-tuichu"></i> <span>退出登录</span></a></li>\n    </ul>\n</section>\n<!-- /.sidebar -->';

}
return __p
};

this["JST"]["common/component/FooterComp"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="pull-right hidden-xs">\n</div>\n<strong>Copyright &copy; Copyright 2015-2016 xxxxxxxxx.</strong>  All rightsreserved.\n';

}
return __p
};

this["JST"]["common/component/HeaderComp"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- Logo -->\n<a class="logo">\n    <!-- mini logo for sidebar mini 50x50 pixels -->\n    <span class="logo-mini"></span>\n    <!-- logo for regular state and mobile devices -->\n    <span class="logo-lg"><b style="padding-left: 10px;">管理系统</b></span>\n</a>\n\n<!-- Header Navbar: style can be found in header.less -->\n<nav class="navbar navbar-static-top">\n    <!-- Sidebar toggle button-->\n    <a href="#" class="sidebar-toggle iconfont icon-menu" data-toggle="offcanvas" role="button">\n        <span class="sr-only " ></span>\n    </a>\n    <!-- Navbar Right Menu -->\n    <div class="navbar-custom-menu">\n\n        <!-- Sidebar user panel -->\n        <div class="user-panel " style="width: 120px;">\n            <div class="pull-left image">\n                <img style="width: 30px; height: 30px;" src="./resources/images/logo.png" class="img-circle" alt="User Image">\n            </div>\n            <div class="pull-left info" style="left: 35px;">\n                <p style="line-height: 20px; "></p>\n            </div>\n        </div>\n    </div>\n\n</nav>';

}
return __p
};