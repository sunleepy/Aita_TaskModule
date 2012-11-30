
/////////////////////////////////////////////////////////////////////////////////////////
//是否php版本
var isPhp = false;
var currentUserId = null;
var currentUserName = null;
var currentTaskId = null;
var externalUrl = null;

/////////////////////////////////////////////////////////////////////////////////////////
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
/////////////////////////////////////////////////////////////////////////////////////////
//list obj,like array?
var List = function () { this._init.apply(this, arguments); }
List.prototype = {
    _init: function () {
        this.length = 0;
    },
    get: function (i) {
        if (i < 0 || i >= this.length) {
            debuger.error('index ' + i + ' out of range');
            return;
        }
        return this[i];
    },
    add: function (v) {
        this.length += 1;
        this.set(this.length - 1, v);
    },
    set: function (i, v) {
        if (i < 0 || i >= this.length) {
            debuger.error('index ' + i + ' out of range');
            return;
        }
        this[i.toString()] = typeof (v) == 'undefined' ? null : v;
    },
    removeAt: function (i) {
        if (typeof (this[i.toString()]) == 'undefined') return;
        this[i.toString()] = undefined;
        this.length -= 1;
    },
    insertBefore: function (i) { },
    insertAfter: function (i) { },
    insertAt: function (prev, next) { },
    indexOf: function (v) {
        if (v != undefined)
            for (var k in this)
                if (!isNaN(parseInt(k)) && this[k] == v)
                    return parseInt(k);
        return -1;
    }
};