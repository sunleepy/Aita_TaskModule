/* 
 * selector 搜人控件
 */
(function ($) {
    if (!$) return;
    $.fn.extend({
        GetSelectorVal: function(){
            return this.find("input[type='hidden']").val();
        },
        GetSelectorData:function () {
        	var _db = $("#"+this.attr("id")+" [data-tokenval]"), data=[];
        	_db.each(function(n){
        		data.push($.parseJSON(_db.eq(n).attr("data-tokenval")));
        	});
        	return data.length>0?data:"";
        },
        Selector : function(o){
            var selector = { 
                id: "selector",
                data: [{ id: "1", name: "龙地" }, { id: "2", name: "飞天" }, { id: "3", name: "蹲地" }, { id: "4", name: "出入" }, { id: "5", name: "平安"}],
                input: "",
                value: "",
                inputMaxWidth: 100,
                required: true,
                dropListUrl: "FindUsers.json",
                dataFormat: "string",
                timeOut: 200,
                maxToken: 0,
                initData:{},
                callBack:function(data){},
                compart:"/",
                maxDrop:12,
                tips:"请输入关键字",
                ifSelect:false,
                ifRepeat:false,
                templet: {
                    dropWrapDefault: '<li class="default"><span>{$tips}</span></li>',
                    dropWrapList: '<li class="{$class}" friendid="{$id}" data-index="{$index}"><img src="{$img}" />{$name}{$icon}</li>',
                    addToken: '<li friendname="{$name}" friendid="{$id}" data-tokenval=\'{$val}\' ><a href="javascript:;"><span>{$name}{$icon}<em id="emdel_{$id}" class="x addx" ></em></span></a></li>'
                },
                init: function () {
                    //this.find(".tokenList").bind("click", selector.showInput);
                    selector.input = $(selector.id + ".tokenList input[type='text']");
                    selector.value = $(selector.id + ".tokenList input[type='hidden']");
                    $(selector.id + ".tokenList").unbind("click").bind("click", selector.showInput);
                    //$(".tokenList a").bind("click", this.selectToken);
                    
                    selector.input.unbind().bind("blur", (!selector.required ? function () { setTimeout(selector.addToken, 200) } : function () { setTimeout(selector.dropListClose, 200); }))
                    /*.bind($.browser.msie?"propertychange":"input", selector.inputMonitor)*/
					.bind("keyup", selector.inputMonitor)
                    .bind("keydown", selector.inputBackspace);
                    selector.clearToken();
                    if(selector.initData) { selector.loadData(selector.initData) }
					if(selector.ifSelect){
						selector.showInput();
					}
                },
                loadData: function (d) {
                    //if(d){selector.clearToken();}
                    for (var n=0; n<d.length; n++) {
                        selector.dataIndex=d[n];
                        if (d[n]["name"] && (n < selector.maxToken||selector.maxToken==0)) selector.addToken(d[n]["name"], d[n]["id"]);
                    }
                    $(selector.id + ".dropWrap>.popLayer").hide();
                },
                showInput: function (e) {
                    //console.debug(this);
                    //console.debug(selector.id);
                   
					//console.debug($(selector.id + ".dropWrap>.popLayer"));
					if(!selector.ifSelect){
						var _tokenLength = $(selector.id + ".tokenList>li").length;
						if (_tokenLength <= selector.maxToken||selector.maxToken==0) {
							selector.input.width(25).show().focus();
							$(selector.id + ".dropWrap>.popLayer .dropList").html(selector.templet.dropWrapDefault.replace("{$tips}",selector.tips));
							$(selector.id + ".dropWrap>.popLayer").show();
						} else {
							selector.input.hide();
						}
					}else{
						selector.input.parent('li').css('width','90%');
						selector.input.css('width','100%').show();
					}
                },
                selectToken: function () {
                    return false;
                },
                delToken: function () {
                	var _target = $(this).parents(".tokenList>li");
                    _target.remove();
                    selector.setTokenVal();
                    $.isFunction(selector.removeToken) && selector.removeToken({id:_target.attr("friendid"), name: _target.text()});
                    return false;
                },
                addToken: function (val, id) {
                    var _word = typeof (val) == "string" ? val : selector.input.val();
                    id = id || _word;
                    if (_word) {
                                if(selector.ifSelect){
                                        selector.input.val(_word.split(selector.compart)[0]);
                                        selector.dropListClose();
                                        selector.setTokenVal();
                                        //selector.input.focus();
                                }else{
                                        //console.time("addToken"); //console.profile("addToken");
                                        _word = _word.split(selector.compart)[0];
                                        var _icon = "";
                                        /*if(selector.dataIndex.tags){
                                                var _i = selector.dataIndex.tags.split(",");
                                                for(var n= 0; n<_i.length; n++){
                                                        _icon += '<i class="jscore-icon-'+_i[n]+'"></i>'; 
                                                }
                                        }*/

                                        var _templet = $(selector.templet.addToken.replace(/{\$name}/g, _word).replace(/{\$id}/g, id).replace("{$val}", jsCore.tools.jsonTostring(selector.dataIndex)).replace("{$icon}",_icon)); //'<li friendname="' + $.trim(this.value) + '" friendid="{1}"><a href="javascript:;"><span>' + $.trim(this.value) + '<em class="x addx" onclick="selector.delToken.call(this);" ></em></span></a></li>';
                                        _templet.find("em.x").bind("click", selector.delToken);

                                        var _tokenList = $(selector.id + ".tokenList>li");
                                        if (_tokenList.length == 1) { _tokenList.before(_templet); } else { _tokenList.eq(_tokenList.length - 2).after(_templet); }
                                        selector.dropListClose();
                                        selector.setTokenVal();
										if(!(arguments[2]&&arguments[2]==true)){
                                        	$(this.id + ".tokenList").trigger("click");
										}
                                        //console.timeEnd("addToken"); //console.profileEnd("addToken");
                                }
                    }
                },
                inputBackspace: function (e) {
                	//console && console.log(e.which);
                    switch (e.which) {
                        case 8: if (this.value == "") { 
                        //$(this).parent().prev().remove();
                        $(this).parent().prev().find("em.x").trigger("click");
                        selector.dropListClose(); } break;
                        case 13: return false;  break;
                    }
                },
                inputMonitor: function (e) {
					if(!selector.ifSelect){
						var _inputWidth = parseInt(this.value.length + "0", 10) * 2;
						this.style.width = _inputWidth > selector.inputMaxWidth ? selector.inputMaxWidth : (_inputWidth < 25 ? 25 : _inputWidth) + "px";
					}
					switch(e.which){
						case 40:
							if (window.event) { e.returnValue = false; } else { e.preventDefault(); }
							selector.upAndDown('down');
							return false;
							break;
						case 38:
							if (window.event) { e.returnValue = false; } else { e.preventDefault(); }
							selector.upAndDown('up');
							return false;
							break;
						case 13:
							if (window.event) { e.returnValue = false; } else { e.preventDefault(); }
							window.event ? event.cancelBubble = true : e.stopPropagation();
							selector.dropListSelecte.call($(selector.id + ".on"));
							return false;
							break;
					}
					
                    //selector.dropListInit(selector.data);        
                    if (this.value && $.trim(this.value) != "") {
                        if (selector._timeOut) clearTimeout(selector._timeOut);
                        selector._timeOut = setTimeout(selector.getDropList, selector.timeOut);
                    }else{
						selector.dropListClose();	
					}
                    //console.debug("自定义调试信息：%s", this.value);
                    //console.log(e.which);
                    //console.dir(this);
                    //console.dirxml(this);
                    //console.error(this);
                },
                setTokenVal: function () {
                    var _tokenList = $(selector.id + ".tokenList>li");
                    var allVal = "", allName = "", allValJson = [];
                    _tokenList.each(function () {
                        var _o = $(this);
                        allVal += _o.attr("friendid") ? (_o.attr("friendid") + "||") : "";
                        allName += _o.attr("friendname") ? (_o.attr("friendname") + "||") : "";
                        _o.attr("friendid") && allValJson.push('{ id:\''+_o.attr("friendid")+'\', name:\''+_o.attr("friendname")+'\' }');
                    });
                    allVal = allVal.substring(0, allVal.length - 2);
                    allName = allName.substring(0, allName.length - 2);
                    selector.value.val(selector.dataFormat == "json" ? selector.arrayToJson(allVal.split("||"), "id") : allVal);
                    selector.value.attr("friendname",allName);
                    selector.value.attr("data-val", allValJson.toString());
                },
                clearToken: function(){
                    var _tokenList = $(selector.id + ".tokenList>li");
                    _tokenList.each(function(){
                        $(this).attr("friendid")&&$(this).remove();
                    });
                    selector.setTokenVal();
                },
                getDropList: function () {
                    $(selector.id+">.tokenList").addClass("t-loading");
                    $.getJSON(selector.dropListUrl, { name: selector.input.val(), _:(selector.cache&&jsCore.tools.timestamp()) }, selector.dropListInit);
                },
                dropListInit: function (data) {
                    var _templet = selector.templet.dropWrapList;
                    var _searchList = "", _icon="";
					if(data!=null && data!=""){
//						$(".dropList").parent().show();
						for (var n=0; n<data.length;n++) {
							
							if((selector.ifRepeat && selector.value.val().indexOf(data[n]["id"])!=-1) || (selector.filter && selector.filter.indexOf(data[n]["id"])!=-1))
									continue;
							if(n == selector.maxDrop)break;
							
							//if(data[n]["name"].toUpperCase().indexOf(selector.input.val().toUpperCase())!=-1){	//前端过滤
								_searchList += _templet.replace(/{\$name}/g, data[n]["name"]).replace(/{\$id}/g, data[n]["id"]).replace("{$index}", n).replace("{$icon}",_icon).replace("{$img}", data[n]["img"]);
							//}
							_icon = "";
						}
					}else{
						
					}
					selector.selectData = data;
					$(selector.id+">.tokenList").removeClass("t-loading");
                    $(selector.id + ".dropList").html(_searchList.replace("{$class}","on").replace(/{\$class}/g, ""));
                    $(selector.id + ".dropList>li").mouseover(selector.dropListFocus).click(selector.dropListSelecte);
                    $(selector.id + ".dropWrap>.popLayer").show();
                    
                },
                dropListFocus: function () {
                    $(selector.id + ".dropList .on").removeClass("on");
                    $(this).addClass("on");
                },
                dropListSelecte: function () {
					//selector.selectData=selector.selectData&&selector.selectData[$(this).index()];
					var _id=$(this).attr("friendid"), _name=$(this).text();
					if(_id && _name){
						selector.dataIndex = selector.selectData[$(this).attr("data-index")];	//temp
	                    selector.addToken(_name, _id);
	                    selector.dropListClose();
						if($.isFunction(selector.callBack)){
							selector.callBack(selector.selectData[$(this).attr("data-index")]);
						}
					}
                },
                dropListClose: function () {
                    $(selector.id + ".dropWrap>.popLayer").hide();
                    $(selector.id + ".dropWrap>.popLayer .dropList").html(selector.templet.dropWrapDefault);
					if(!selector.ifSelect){
                    	selector.input.val("");
					}
                },
                arrayToJson: function (obj, name) {
                    var a = new Array();
                    for (i in obj) {
                        if (obj[i]) { a[i] = "{" + name + ":'" + obj[i].replace(/\"/g, "\\\"") + "'}"; }
                    }
                    return a.length>0?"[" + a.join(",") + "]":"";
                },
				upAndDown:function(type){
					var lis = $(selector.id + ".dropWrap>.popLayer").get(0).getElementsByTagName("li");
					var liLength = lis.length;
					//var height = lis[0].offsetHeight;
					//var scrollDiv = $(topic).find("div.autoCmt");
					for(var i=0;i<liLength;i++){
						
						if(lis[i].className.indexOf("on")>=0){
							if("up" == type){
								lis[i].className = '';
								if(i-1<0){
									lis[liLength-1].className = 'on';
									//scrollDiv.scrollTop(liLength*height);
								}else{
									lis[i-1].className = 'on';
								}
							}else if("down"==type){
								lis[i].className = '';
								if(i==(liLength-1)){
									lis[0].className = 'on';
									//scrollDiv.scrollTop(0);
								}else{
									lis[i+1].className = 'on';
								}
							}
							/*if((i+1)>3){
								scrollDiv.scrollTop((i-2)*height);
							}else{
								scrollDiv.scrollTop(0);
							}*/
							break;
						}
					}
				}
            }

            o && $.extend(selector, o);

            selector.id = "#"+ this.attr("id") +" ";

            selector.init();
			return selector;
            //return this.attr("id") + " "+ selector.id;
        }
    });

})(jQuery);

var jsCore = {
    date: "2010-05-18",
    versions: 1.0,
    tools: {
        ajaxLock: function (url, pars, callback, obj, opts) {
            /// <summary> ajax提交锁定按钮(防止重复点击) </summary>
            /// <param name="url" type="String">服务端地址</param>
            /// <param name="pars" type="Object">参数</param>
            /// <param name="callback" type="Function">回调函数(data,object)</param>
            /// <param name="obj" type="Object">被点击按钮</param>
            /// <param name="opts" type="Object">{dataType:"json", type:"POST"}</param>
            ///	<returns type="Object" />
            if ($.isFunction(pars)) {
                opts = opts || obj;
                obj = obj || callback;
                callback = pars;
                pars = {}
            }
            $(obj).attr("disabled", true);
            $.ajax({
                data: pars,
                url: url,
                cache: false,
                dataType: (opts && opts.dataType) ? opts.dataType : "json",
                type: (opts && opts.type) ? opts.type : "POST",
                success: function (data) {
                    $(obj).attr("disabled", false);
                    callback(data, obj);
                },
                error: function (xml, status, t) {
                    $(obj).attr("disabled", false);
                    if (status == 'error') {
                        try {
                            jsCore.ui.msgBox("发生错误:" + xml.responseText);
                        } catch (e) { jsCore.ui.msgBox("发生错误：" + e); }
                    } else {
                        (console && console.debug) && console.debug(xml);
                        jsCore.ui.msgBox(xml ? xml.responseText : status);
                    }
                }
            });
            return this;
        },
        cookie: function (name, value, options) {
            /// <summary> 设置获取删除三位一体(以后肢解)
    			///	@example cookie('the_cookie', 'the_value').
    			/// @desc Set the value of a cookie.
    
    			/// @example cookie('the_cookie', 'the_value', {expires: 7, path: '/', domain: 'jquery.com', secure: true}).
    			/// @desc Create a cookie with all available options.
    			
    			/// @example cookie('the_cookie', 'the_value');
    			/// @desc Create a session cookie.
    			
    			/// @example cookie('the_cookie', null);
    			/// @desc Delete a cookie by passing null as value.
    
    			/// @example cookie('the_cookie');
    			/// @desc Get the value of a cookie.
            /// </summary>
            /// <param name="name" type="String">key</param>
            /// <param name="value" type="String">value</param>
            /// <param name="options" type="Object"> {expires: 7, path: '/', domain: 'jquery.com', secure: true}</param>
            /// <returns type="String">Get有返回值[没有返回null]</returns>
            if (typeof value != 'undefined') { // name and value given, set cookie
                options = options || {};
                if (value === null) {
                    value = '';
                    options.expires = -1;
                }
                var expires = '';
                if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                    var date;
                    if (typeof options.expires == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                    } else {
                        date = options.expires;
                    }
                    expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
                }
                var path = options.path ? '; path=' + options.path : '';
                var domain = options.domain ? '; domain=' + options.domain : '';
                var secure = options.secure ? '; secure' : '';
                document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            } else { // only name given, get cookie
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = cookies[i].replace(/(^\s*)|(\s*$)/g, "");
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
    	},
        sbc2dbc: function (str) {    /// <summary> 半角转全角 </summary>
            var ret = [], i = 0, len = str.length, code, chr, hash = { '32': '\u3000' };
            for (; i < len; ++i) {
                code = str.charCodeAt(i);
                chr = hash[code];
                if (!chr && code > 31 && code < 127) {
                    chr = hash[code] = String.fromCharCode(code + 65248);
                }
                ret[i] = chr ? chr : str.charAt(i);
            }
            return ret.join('');
        },
        dbc2sbc: function (str) {/// <summary> 全角转半角 </summary>
            var ret = [], i = 0, len = str.length, code, chr, hash = { '12288': ' ' };
            for (; i < len; ++i) {
                code = str.charCodeAt(i);
                chr = hash[code];
                if (!chr && code > 65280 && code < 65375) {
                    chr = hash[code] = String.fromCharCode(code - 65248);
                }
                ret[i] = chr ? chr : str.charAt(i);
            }
            return ret.join('');
        },
        sbc2dbc_w: function (str) {/// <summary> 半角转全角(转换 [0-9a-zA-Z]) </summary>
            var ret = [], i = 0, len = str.length, code, chr, hash = {};
            for (; i < len; ++i) {
                code = str.charCodeAt(i);
                chr = hash[code];
                if (!chr &&
			(47 < code && code < 58 ||
				64 < code && code < 91 ||
				96 < code && code < 123)) {
                    chr = hash[code] = String.fromCharCode(code + 65248);
                }
                ret[i] = chr ? chr : str.charAt(i);
            }
            return ret.join('');
        },
        preventEvent: function (e) {    /// <summary> 防止默认事件执行 </summary>
            if (window.event) { event.returnValue = false; } else { e.preventDefault(); }
        },
        cancelBubble: function (e) {    /// <summary> 取消事件冒泡 </summary>
            window.event ? event.cancelBubble = true : e.stopPropagation();
        },
        windowClose: function () {    /// <summary> 关闭当前页面 </summary>
            window.opener = null; window.open('', '_self'); window.close();
        },
        refreshList: function (f, isClose) {  //刷新列表页(来源页面)
            opener && (opener.jsCore && opener.jsCore.tools.submitList(f));
            isClose && jsCore.tools.windowClose();
        },
        submitList: function (f, p, fn) { //提交当前页
            if ($.isFunction(f)) {
                fn = f;
                f = "";
            }
            if ($.isFunction(p)) {
                fn = p;
                p = "";
            }
            $("#sys_IsResetPage").val(p || 0);
            $.isFunction(fn) && fn();
            $("#" + (f ? f : "search-form")).submit();
            return false;
        },
        newGuid: function () {
            return "00000000-0000-0000-0000-000000000000".replace(/0+/g, function (o) { return Math.random().toString(16).substr(2, o.length).toUpperCase() });
        },
        random: function (under, over) {
            /// <summary> 随机数 </summary>
            switch (arguments.length) {
                case 1: return parseInt(Math.random() * under + 1);
                case 2: return parseInt(Math.random() * (over - under + 1) + under);
                default: return Math.random() * Math.random();
            }
        },
        timestamp:function(){
        	/// <summary> 当前时间戳 </summary>
        	return	new Date().getTime();
        },
        serialize: function (obj) {
            var returnVal;
            if (obj != undefined) {
                switch (obj.constructor) {
                    case Array:
                        var vArr = "[";
                        for (var i = 0; i < obj.length; i++) {
                            if (i > 0) vArr += ",";
                            vArr += this.serialize(obj[i]);
                        }
                        returnVal = vArr + "]";
                        break;
                    case String:
                        returnVal = "\""+obj+"\"";//escape("'" + obj + "'");
                        break;
                    case Number:
                        returnVal = isFinite(obj) ? obj.toString() : null;
                        break;
                    case Date: returnVal = "#" + obj + "#";
                        break;
                    default:
                        if (typeof obj == "object") {
                            var vobj = []; for (attr in obj) {
                                if (typeof obj[attr] != "function") {
                                    vobj.push('"' + attr + '":' + this.serialize(obj[attr]));
                                }
                            }
                            if (vobj.length > 0) {
                                returnVal = "{" + vobj.join(",") + "}";
                            }
                            else { returnVal = "{}"; }
                        }
                        else {
                            returnVal = obj.toString();
                        }
                        break;
                }
                return returnVal;
            }
            return null;
        },
		cvsToBase64: function (o, x, y, w, h) {
			//cvsToBase64（可裁减x:-10,y:-10）
			o = o || $0;
			var cvs = document.createElement("canvas");
			var ctx = cvs.getContext('2d');
			var img = new Image();
			img.src = o.src;
			cvs.width = w||o.width;
			cvs.height = h||o.height;
			//ctx.drawImage(img,0,0,o.width,o.height);
			ctx.drawImage(img, 0, 0, o.width, o.height, x||0, y||0, o.width, o.height);
			window.open(cvs.toDataURL());
			return cvs.toDataURL();
		},
		imgToBase64:function (file) {
			if("files" in file){
				var _fr = new FileReader();
				_fr.readAsDataURL(file.files[0]);
				return _fr.result;
			}
		},
        arrayToJson: function(obj){
        	var opts = {};
	        for(var n=0; n<obj.length; n++){
	        	opts[obj[n]["name"]] = obj[n]["value"];
	        }
	        return opts;
        },
        htmlEncode: function(val){
            return $('<div/>').text(val).html();
        },
        htmlDecode: function(val) {
            return $('<div/>').html(val).text();
        },
        enterSubmit:function(o, fn) {
        	$(o).bind("keydown",function(e) {
        		 if (e.which == 13)fn();
        	});
        },
		jsonTostring:function (obj) {
		     var t = typeof (obj);
		     if (t != "object" || obj === null) {
		         // simple data type
		         if (t == "string") obj = '"'+obj+'"';
		         return String(obj);
		     }
		     else {
		         // recurse array or object
		         var n, v, json = [], arr = (obj && obj.constructor == Array);
		         for (n in obj) {
		             v = obj[n]; t = typeof(v);
		             if (t == "string") v = '"'+v+'"';
		             else if (t == "object" && v !== null) v = JSON.stringify(v);
		             json.push((arr ? "" : '"' + n + '":') + String(v));
		         }
		         return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
		     }
		 }
    },
    ui: {
        msgBox: function (msg, fnClose) {
            /// <summary> 信息提示框 </summary>
            ///	<param name="msg" type="String"> 信息内容 </param>
            ///	<param name="fnClose" type="Funtion"> [可选]关闭回调方法 </param>
            ///	<returns />
            $("#msgError-jscore").dialog("close").remove();
            msg && $('<div id="msgError-jscore" style="padding:10px">' + msg + '</div>').dialog({ title: "友情提示", resizable: false, modal: true, close: function () { if (fnClose) fnClose(); }, buttons: { "关闭": function () { $(this).dialog("close"); } } });
        },
        confirm: function (msg, fn) {
	        /// <summary> 信息确认框 </summary>
	        ///	<param name="msg" type="String"> 确认信息内容 </param>
	        ///	<param name="fn" type="Funtion"> [必选]确定回调方法 </param>
	        ///	<returns />
            $("#msgConfirm-jscore").dialog("close").remove();
            fn && $('<div id="msgConfirm-jscore" style="padding:10px">' + (msg || "是否确定?") + '</div>').dialog({ title: "是否确定", resizable: false, modal: true, buttons: { "确定": function () { $(this).dialog("close"); fn(); }, "取消": function () { $(this).dialog("close"); } } });
        },
        dialog: function (obj, buttons, opts) {
	        /// <summary> 模态对话框 </summary>
	        ///	<param name="obj" type="Element||String||jQuery"> 对话框主体元素 </param>
	        ///	<param name="buttons" type="Object"> [可选]操作按钮{"保存":Function, "删除":Function, "取消":Function} </param>
	        ///	<param name="opts" type="Object"> [可选]扩展参数{title:"信息操作框",width:"500px",height:"300px"} </param>
	        ///	<returns />
            obj && function () {
                $("#msgDialog-jscore").dialog("close").remove();
                obj = typeof (obj) == "string" ? $('<div id="msgDialog-jscore" style="padding:10px">' + obj + '</div>') : $(obj);
                var defaultOpts = {
                    title: "信息操作框",
                    zIndex: 1000,
                    width: "50%",
                    height: "auto",
                    close: function () { },
                    resizable: true
                }
                //opts = opts || {};
                $.extend(defaultOpts, opts);
                return obj.dialog({ zIndex: defaultOpts.zIndex, width: defaultOpts.width, height: defaultOpts.height, resizable: defaultOpts.resizable, title: defaultOpts.title, modal: true, close: function () { if (opts && opts.close && $.isFunction(opts.close)) opts.close(); }, buttons: buttons || {} });
            } ();
            this.dialog.close = function(){$("#msgDialog-jscore").dialog("close").remove();}
        },
        window: function (title, src, width, height) {
	        /// <summary> iframe 弹窗 </summary>
	        ///	<param name="title" type="String"> 标题 </param>
	        ///	<param name="src" type="String"> iframeURL </param>
	        ///	<param name="width" type="Number"> 宽度 </param>
	        ///	<param name="height" type="Number"> 高度 </param>
	        $("#msgDialog-jscore").dialog("close").children().remove();
            src && this.dialog("<iframe width='100%' height='98%' frameborder='no' border='0' marginwidth='0' marginheight='0' style='overflow-y: auto; overflow-x:hidden;' src='" + src + "'></iframe>", null, { title: title || "信息操作框", width: width, height: height });
            
            this.window.close = function(){$("#msgDialog-jscore").dialog("close").children().remove();}
        },
        msgbox: function (msg, type, time) {
            /// <summary> 弱信息提示层 </summary>
            ///	<param name="msg" type="String"> 要提示的文本信息 </param>
            ///	<param name="type" type="String"> [可选]枚举类型(“error”,“succeed”)，默认“succeed” </param>
            ///	<param name="time" type="Number"> [可选]提示层停留时间(默认"1200/毫秒") </param>
            ///	<returns />
            if(msg){
	            clearTimeout(this.timeOut);$("#msgBox-jscore").remove();
	            var typeClass = (type == "error")?"pob-msg-box-error":"";
	            time = time || 1200;
	            var msgObj = $('<div id="msgBox-jscore" class="pob-msg-box ' + typeClass + '"><div class="msg-right-box">' + msg + '</div></div>');
	            msgObj.appendTo('body');
	            var left = ($(window).width() - msgObj.width()) / 2 + $(document).scrollLeft();
	            var top = ($(window).height() - msgObj.height()) / 2 + $(document).scrollTop();
	            msgObj.css({ top: top + 'px', left: left + 'px' });
	            this.timeOut = setTimeout(function () { msgObj.animate({ opacity: 100 }, 1500).remove(); }, time);
            }
        },
        loading: function (bSwitch, opt) {
        	/// <summary> 全屏居中Loading效果 </summary>
        	///	<param name="bSwitch" type="String"> [可选]枚举类型(“show”,“hide”)，默认“show” </param>
        	///	<returns />
           	$("#jsCore-loadding").remove();
           	if(!bSwitch){
	        	var msgObj = $('<s id="jsCore-loadding"></s>').appendTo('body');
	        	var left = ($(window).width() - msgObj.width()) / 2 + $(document).scrollLeft();
	        	var top = ($(window).height() - msgObj.height()) / 2 + $(document).scrollTop();
	        	msgObj.css({ top: top + 'px', left: left + 'px' });
        	}
        	//console.log(bSwitch);
        },
        ajaxLoading:function (time) {
        	/// <summary> 开启ajaxLoading效果(ajax请求时,默认等待1秒后>出现loading>请求成功后>loading自动隐藏) </summary>
        	///	<param name="time" type="Number"> [可选]loading显示延迟时间(默认:1000/毫秒) </param>
        	///	<returns />
        	$(function(){
        		jsCore.ui.loading.time = time || 1000;
				$("<s>").ajaxStart(function(){
					jsCore.ui.loading.timeOut = setTimeout("jsCore.ui.loading()", jsCore.ui.loading.time);

				});
				$("<s>").ajaxComplete(function(evt, request, settings){
					clearTimeout(jsCore.ui.loading.timeOut);
					jsCore.ui.loading("hide");
				});
			});
        }
    }
};