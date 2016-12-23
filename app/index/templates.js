this["JST"] = this["JST"] || {};

this["JST"]["index/component/MainComp"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="wrapper">\n   <header class="main-header"></header>\n   <aside class="main-sidebar"></aside>\n   <div class="content-wrapper">\n      <div class="chart-wrap" style="display: none;"></div>\n      <div class="list-wrap" style="display: none;"></div>\n   </div>\n\n   <footer class="main-footer"></footer>\n</div>\n';

}
return __p
};

this["JST"]["index/component/TestComponent"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div lkg-text="user.name"></div>\n\n<section lkg-html="user.html"></section>\n\n\n<input type="text" lkg-value="user.name"/>\n\n<input type="checkbox" lkg-checked="user.checked"/>\n\n<div lkg-class="user.checked | classFormat">lkg-class</div>\n\n<ul>\n    <li lkg-each-item="list">\n        <input type="checkbox" lkg-checked="item.checked"> { item.name }\n    </li>\n</ul>';

}
return __p
};

this["JST"]["index/component/chart/ChartComp"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- Content Header (Page header) -->\n<section class="content-header">\n    <h1>\n        图标分析\n    </h1>\n    <ol class="breadcrumb">\n        <li><a href="#"><i class="fa fa-dashboard"></i> 个人中心 </a></li>\n        <li class="active" bind-text="data">图表分析</li>\n    </ol>\n</section>\n\n<section class="content">\n    <div class="list"></div>\n\n    <div class="chart"></div>\n    <div class="row">\n        <!-- /.col (LEFT) -->\n        <div class="col-md-6">\n            <div id="slip" class="box box-info">\n            </div>\n\n            <div id="payment" class="box box-success">\n\n            </div>\n        </div>\n\n\n        <!-- /.col (RIGHT) -->\n        <div class="col-md-6">\n            <div id="slip1" class="box box-info">\n            </div>\n\n            <div id="payment1" class="box box-success">\n            </div>\n\n        </div>\n    </div>\n    <!-- /.row -->\n\n</section>';

}
return __p
};

this["JST"]["index/component/list/ListComp"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>\n\n    <ul>\n        <li lkg-each-item="Data">\n            { item.name }\n        </li>\n    </ul>\n\n</div>';

}
return __p
};