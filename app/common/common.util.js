/**
 * Created by yanghl on 2016/5/23.
 */

define(function(require, exports, module){


    var BigNumber = require("bignum");
    /**
     * 工具类
     * @class common.CommonUtil
     */
    var CommonUtil = {};

    /**
     * 显示小数点后几位
     * */
    CommonUtil.DECIMAL_PLACE = 2;

    /**
     * 显示小数点后几位
     * */
    CommonUtil.DECIMAL_PLACE_3 = 3;

    /**
     * 显示小数点后几位
     * */
    CommonUtil.DECIMAL_PLACE_0 = 0;



    /**
     * 判断是否为空
     * @method isEmpty
     * @param  val
     * @return {boolean}
     */
    CommonUtil.isEmpty = function (val) {
        return val === null || val === undefined || val==="" || val.length === 0;
    };


    /**
     * 工具类 获取url 参数
     * @method getUrlParam
     * @private
     */
    CommonUtil.getUrlParam =function(name, h){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        if(h){
            var hash =  window.location.hash;
            var arr = hash.split("?");
            if(!CommonUtil.isEmpty(arr[1])){
                var r = arr[1].match(reg);  //匹配目标参数
                if (r!=null) return unescape(r[2]);
                return null; //返回参数值
            }
        }else{
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r!=null) return unescape(r[2]);
            return null; //返回参数值
        }
    };

    /**
     * 判断是不是数字
     *
     * @static
     * @method isNumeric
     * @param  src
     * @return {boolean}
     */
    CommonUtil.isNumeric = function (src) {
        return $.isNumeric(src);
    };



    /**
     * 小数点第３位以(DECIMAL_PLACE = 2)
     *
     * @method floor
     * @param  text
     * @param  [decimalPlace=DECIMAL_PLACE]
     * @return {string}
     * @static
     */
    CommonUtil.floor = function (text, decimalPlace) {
        if (typeof decimalPlace === "undefined") {
            decimalPlace = CommonUtil.DECIMAL_PLACE;
        }
        if (CommonUtil.isNumeric(text)) {
            return new BigNumber(text).round(decimalPlace, BigNumber.ROUND_DOWN).toFixed(decimalPlace);
        } else {
            return text;
        }
    };

    /**
     * 小数点第３位以(DECIMAL_PLACE = 2)
     *
     * @method floor
     * @param  text
     * @param  [decimalPlace=DECIMAL_PLACE]
     * @return {string}
     * @static
     */
    CommonUtil.floor3 = function (text, decimalPlace) {
        if (typeof decimalPlace === "undefined") {
            decimalPlace = CommonUtil.DECIMAL_PLACE;
        }
        if (CommonUtil.isNumeric(text)) {
            return new BigNumber(text).round(decimalPlace, BigNumber.ROUND_HALF_UP).toFixed(decimalPlace);
        } else {
            return text;
        }
    };

    /**
     * 更新样式  为红色 -为绿色
     *
     * @method
     * @param  $el
     * @param  val
     * @param  [option={}]
     * @param  [option._raw]
     * @static
     */
    CommonUtil.updateArryRatioStyle = function (val) {
        var prentPrice = val[0];
        var prevClose = val[1];
        if (CommonUtil.isNumeric(prentPrice) && CommonUtil.isNumeric(prevClose)) {
            var comp = new BigNumber(prentPrice).comparedTo(new BigNumber(prevClose));
            var klass = (comp > 0) ? "value-up" : ((comp < 0) ? "value-down" : undefined);
            return klass;
        }
    };

    /**
     * 判断百分百是否为负数
     * @param str
     * @returns {boolean}
     */
    CommonUtil.upPercentStyle = function(str){
        var reg = /^\-\d+\.?\d+%$/;
        var reg1 = /^\-\d+\.?\d+%$/;
        var isDown = reg.test(str);
        if(isDown){
            return "value-down";
        } else if(parseFloat(str) != 0) {
            return "value-up";
        }
    };



    return CommonUtil;
});
