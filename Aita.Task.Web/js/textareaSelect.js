//提示框js
(function($){
    if (!$) return;
    $.fn.extend({
        textArrayFloat: function (option) {
            var defaults = {
                userUrl:"",
                groupUrl:"",
                topicUrl:"",
                userTopic:"",
                groupTopic:"＊群组, 就能收到",
                topicTopic:""
            };
            var createDiv = createFloatDiv();
            var textArrayDiv = createDiv.textArrayDiv
            var topic = createDiv.topicDiv;
            defaults = $.extend(defaults, option);
            
            this.each(function(){
                var this0 = this;
                this0.ifEnterOk = -1;
                this0.dianCursor = -1;
                this0.cursorEndContent = '';
				if($(this0).attr("bind-select")=="1"){
					return ;
				}
				$(this0).attr("bind-select","1");
                $(this0).keydown(function(event){
//                        event = event||window.event;
                          this0.cursorPosition = comment.getCursorPosition(this0);
//                        var textValue = obj.value.replace(/\r/ig,'');
//                        this0.cursorEndContent = textValue.substr(0,this0.cursorPosition.end);
                        if(event.keyCode==39||event.keyCode==37){
                                topic.style.display='none';
                        }else if(event.keyCode == 13){
                            if(topic.style.display!='none'){
                                if (window.event) { event.returnValue = false; } else { event.preventDefault();}
                                this0.ifEnterOk = 1;
                                return false;
                            }
                        }else if(event.keyCode==38){
                            if(topic.style.display!='none'){
                                    if (window.event) { event.returnValue = false; } else { event.preventDefault(); }
                                    this0.dianCursor = this0.cursorPosition.end;
                                    nextChange("up",topic);
                                    return false;
                            }
                        }else if(event.keyCode==40){
                            if(topic.style.display!='none'){
                                     if (window.event) { event.returnValue = false; } else { event.preventDefault(); }
                                     this0.dianCursor = this0.cursorPosition.end;
                                     nextChange("down",topic);
                                     return false;
                             }
                        }
                });

                $(this0).keyup(function(event){
                        var obj = this;
                        var textValue = obj.value.replace(/\r/ig,'');
                        event = event||window.event;
                        this0.cursorPosition = comment.getCursorPosition(obj);
                        this0.cursorEndContent = textValue.substr(0,this0.cursorPosition.end);
                        //var xinLast = Math.max(this0.cursorEndContent.lastIndexOf('×'),this0.cursorEndContent.lastIndexOf('*'));
                        var xinLast = -1;
                        var atLast = Math.max(this0.cursorEndContent.lastIndexOf('＠'),this0.cursorEndContent.lastIndexOf('@'));
                        var jinLast = Math.max(this0.cursorEndContent.lastIndexOf('#'),this0.cursorEndContent.lastIndexOf('＃'));
                        var fix = '@';
                        var getUrl = defaults.userUrl;
                        var bottomTopic = defaults.userTopic;
                        var nextChart = textValue.substr(this0.cursorPosition.end,1);
                        var jinObj = this0.cursorEndContent.match(/#/ig);
                        var jinLength = jinObj==null?0:jinObj.length;
                        
                        if(xinLast>atLast){
                            fix = '*';
                            getUrl = defaults.groupUrl;
                            bottomTopic = defaults.groupTopic;
                            if(jinLast>xinLast){
                                    fix = '#';
                                    getUrl = defaults.topicUrl;
                                    bottomTopic = defaults.topicTopic;
                            }
                        }else{
                            if(jinLast>atLast){
                                    fix = '#';
                                    getUrl = defaults.topicUrl;
                                    bottomTopic = defaults.topicTopic;
                            }	
                        }
                        if($.trim(this0.cursorEndContent)==''){
                                topic.style.display = 'none';
                                return;
                        }
                        if(/[  \.。$%\^\&\(\)\[\]\{\}\\\/\;"',<>\?`\~，？‘’“”\-=——\+、]/.test(this0.cursorEndContent.substr(this0.cursorEndContent.length-1))){
                                topic.style.display = 'none';
                                return;
                        }
                        if(event.keyCode == 13){
                               // &&this0.ifEnterOk>-1
                                //if (window.event) { event.returnValue = false; } else { event.preventDefault(); }
                                if(topic.style.display!='none'){
										var currentObj = $(topic).find('li.curent');
                                        var cols = currentObj.text();
                                        var ifGroup = $(topic).find('li.curent').attr("ifGroup");
										var isUser = $(topic).find('li.curent').attr("isuser");
										if(isUser&&fix=='@'){
											cols = currentObj.attr("nickname");
										}
                                        if(""!=cols){
                                                if(fix == "#"){
                                                        if(nextChart == "#"){
                                                           this0.ifEnterOk = setContent(cols+'',this0,-2,fix);
                                                           this0.ifEnterOk++;
                                                        }else{
                                                           this0.ifEnterOk = setContent(cols+'#',this0,-2,fix);  
                                                        }
                                                            
                                                }else{
                                                        if(ifGroup&&fix=='@'){
                                                            comment.attachGroup({id:currentObj.attr("id"),name:cols,other:currentObj.attr("other"),isPrivate:currentObj.attr('is_private')},obj);
                                                        }
														
                                                        this0.ifEnterOk = setContent(cols+' ',this0,-2,fix);
                                                }
                                                $(topic).hide();
                                                comment.setCursorPosition(obj,{start:this0.ifEnterOk,end:this0.ifEnterOk});
                                        }
                                }
                                if(this0.ifEnterOk!=-1){
                                    this0.ifEnterOk = -1;
                                }
                                return false;
                        }else if((event.keyCode==38||event.keyCode==40)&&this0.dianCursor>-1){
                                if(topic.style.display!='none'){
                                        if (window.event) { event.returnValue = false; } else { event.preventDefault(); }
                                        comment.setCursorPosition(obj,{start:this0.dianCursor,end:this0.dianCursor});
                                        return false;
                                }
                        }else if(event.keyCode!=190&&event.keyCode!=38&&event.keyCode!=40){
                               /* var reg = /#/ig;
                                var cursorPosition = getCursorPosition(obj);
                                this0.cursorEndContent = textValue.substr(0,cursorPosition.end);
                                var xinLast = this0.cursorEndContent.lastIndexOf('*');
                                var atLast = this0.cursorEndContent.lastIndexOf('@');
                                var jinLength = this0.cursorEndContent.match(reg);

                                if(jinLength==null||jinLength.length%2==0){
                                        var jinLast = -1;	
                                }else{
                                        var jinLast = this0.cursorEndContent.lastIndexOf('#');
                                }
                                var fix = '@';
                                var getUrl = this0.defaults.getUrl;
                                var ifGeg = true;

                                if(xinLast>atLast){
                                        fix = '*';
                                        getUrl = groupUrl;
                                        if(jinLast>xinLast){
                                                fix = '#';
                                                getUrl = topicUrl;	
                                        }
                                }else{
                                        if(jinLast>atLast){
                                                fix = '#';
                                                getUrl = topicUrl;	
                                        }	
                                }*/
                                
                                //如果＃号为双则不出现浮框
                                if(fix == '#'&&jinLength%2==0){
                                    
                                    return;
                                }
                                
                                var ifGeg = true;
                                var lastAt = this0.cursorEndContent.substr(this0.cursorEndContent.lastIndexOf(fix)+1);
                                /*if($.trim(lastAt).length<=0){
                                        ifGeg = false;
                                }*/
                                //if(!(/[  ]|\./.test(lastAt))&&lastAt.length>0&&(xinLast>=0||atLast>=0)){
                                if((xinLast>=0||atLast>=0||jinLast>=0)&&ifGeg){
                                        if(""!=this0.cursorEndContent){
                                                var lastn = this0.cursorEndContent.lastIndexOf(' ');
                                                var lasttrim = this0.cursorEndContent.lastIndexOf(fix);
                                                if(lastn<=lasttrim){
                                                        var keyword = this0.cursorEndContent.substr(lasttrim+1,this0.cursorEndContent.length-1);
                                                        $(textArrayDiv).css({width:$(obj).width()+'px',height:$(obj).height()+'px',top:($(obj).offset().top+10)+'px',left:($(obj).offset().left+10)+'px',paddingTop:$(obj).css("paddingTop")+'px',paddingLeft:$(obj).css("paddingLeft")});
                                                        textArrayDiv.innerHTML = this0.cursorEndContent.substr(0,this0.cursorEndContent.lastIndexOf(fix)).replace(/( | )/ig,'<span>&nbsp;</span>').replace(/\n/g,"<br />")+"<span id='cursorSpan'>"+fix+"</span>";
                                                        var left = parseInt($("#cursorSpan").offset().left);
                                                        var top = parseInt($("#cursorSpan").offset().top-parseInt($(this0).scrollTop())+19);
                                                        if($.trim(bottomTopic)==""){
                                                            $(topic).find("div.tips").remove();
                                                        }else{
                                                            $(topic).find("div.tips").html(bottomTopic);
                                                        }
														if(getUrl==""){
															return ;
														}
                                                        //改为异步方式提取
														var getsData = function(){
                                                        	$.ajax({
                                                                type: "GET",
                                                                url: getUrl,
                                                                data: {s:fix+keyword},
                                                                success: function(data){
                                                                            var data = $.trim(data);
                                                                            if(false!=this0.getData&&''!=this0.getData){
//                                                                                iframe调用时让浮动框在可视化区域内
//                                                                                if(window.location.href.indexOf('f_sys_url')>-1){
//                                                                                        var scrollHeight=Math.min(221,$(window).height()-top-12);
//                                                                                }else{
//                                                                                        var scrollHeight = 221;
//                                                                                }
                                                                                $(topic).find("div#topic_content").html('');
                                                                                if(fix=='*'){
                                                                                        $(topic).find("div#topic_content").append(jsonToHtml('',this0,data,topic,-2));
                                                                                }else if(fix=='#'){
                                                                                        $(topic).find("div#topic_content").append(jsonToHtml('',this0,data,topic,-3,nextChart));
                                                                                }else{
                                                                                        $(topic).find("div#topic_content").append(jsonToHtml('',this0,data,topic));
                                                                                }
                                                                                $(topic).css({left:left+'px',top:top+'px'});
                                                                                $("div.atWrap").hide();
																				if($(topic).find("li").length>0){
                                                                                	$(topic).show();
																				}
                                                                                $(topic).find(".musicTab").hide();
                                                                                //$(topic).find(".autoCmt").height(scrollHeight);
                                                                                this0.dianCursor = this0.cursorPosition.end;
                                                                                $("body").bind("click", function (e) {
                                                                                        this0.topic == e.target || jQuery.contains(topic, e.target) || $(topic).hide();
                                                                                });
                                                                            }
                                                                },
                                                                error: function () {
                                                                        //alert("请求超时！");
                                                                        //alert("transfrom error...");
                                                                },
                                                                cache: false
                                                        });
														}
														clearTimeout($.textTim);
														$.textTim = setTimeout(getsData,200);
														//getData();

                                                }else{
                                                       topic.style.display = 'none';
                                                }
                                        }else{
                                                 topic.style.display = 'none';
                                        }
                              }
                         }
                    });

                });
             }
        });
       

	//组装html
function jsonToHtml(text,obj,getData,toipc,type){
		var type = jsonToHtml.arguments[4];
                var nextChart = jsonToHtml.arguments[5];
		var html = "";
		var fix = '@';
		if(arguments[5]&&arguments[5]!=''){
			fix = arguments[5];
		}
		if(""!=getData){
			try{
				json = eval('('+getData+')');
			}catch(e){
				json = "";
			}
			if(json == ""){
				return;
			}
		
			if(json.state==0){
				json.data = json.msg;
				
				html = '<ul>';
                                //alert(json.data);
				for(var key  in json.data){
								var img = '';
								var ifGroup = "";
								var nickname = "";
								if(json.data[key].avatar&&$.trim(json.data[key].avatar)){
									img = "<img src='"+json.data[key].avatar+"' />";
								}
								if(json.data[key].type == "group"){
									ifGroup = "ifGroup = 'true' id='group_"+json.data[key].id+"' other='"+json.data[key].other+"' is_private='"+json.data[key].is_private+"' ";
								}else if(json.data[key].type == "user"){
									nickname = " nickname='"+json.data[key].nickname+"' isUser='true' ";
								}
				                if(key == 0){
									html += '<li '+ifGroup+nickname+' class="curent">'+img+'<span>'+json.data[key].name+'</span></li>';
											 }else{
									html += '<li '+ifGroup+nickname+' >'+img+'<span>'+json.data[key].name+'</span></li>';
								}
				}
				html += '</ul>';
			}else{
				html ='<div></div>';
			}
			html = $(html);
			var lis = html.find("li");
			lis.hover(function(){
				lis.each(function(){
					this.className = '';
				});
				this.className = 'curent';
			});
			lis.click(function(event){
                                                            if (event) //停止事件冒泡
                                                                    event.stopPropagation();
                                                            else
                                                                    window.event.cancelBubble = true;
                                                            $(obj).focus();
															var currentObj = $(this);
                                                            var cols = currentObj.text();
                                                            var ifGroup = currentObj.attr("ifGroup");
                                                            var ifUser = currentObj.attr("isuser");
															if(ifUser=="true"&&fix=="@"){
																cols = currentObj.attr("nickname");
															}
                                                            if(""!=cols){
                                                                    if(ifGroup=="true"&&fix=="@"){
																		comment.attachGroup({id:currentObj.attr("id"),name:cols,other:currentObj.attr("other"),isPrivate:currentObj.attr('is_private')},obj);
                                                                    }
																	
                                                                    if(type == true){
                                                                            var cursor = setContent(fix+cols+' ',obj,true);
                                                                            obj.value = obj.value.replace('#'+huatiTopic+'#','');
                                                                    }else if(type == -1){
                                                                            var cursor = setContent('*'+cols+' ',obj,true);
                                                                    }else if(type== -2){
                                                                            var cursor = setContent(cols+' ',obj,-2,'*');
                                                                    }else if(type== -3){
                                                                            if(nextChart == "#"){
                                                                               var cursor = setContent(cols+'',obj,-2,'#');
                                                                               cursor++;
                                                                            }else{
                                                                               var cursor = setContent(cols+'#',obj,-2,'#'); 
                                                                            }
                                                                    }else{
                                                                            var cursor = setContent(cols+' ',obj);
                                                                    }
                                                                    $(toipc).hide();
                                                                    comment.setCursorPosition(obj,{start:cursor,end:cursor});
                                                                    return ;
                                                            }
 			});
		}

		return html;
	}

	//为文本框添加内容
	function setContent(content,obj,types){
		var type = setContent.arguments[2];
		var cursorPosition = comment.getCursorPosition(obj);
		var textValue = obj.value;
		var cursorEndContent = textValue.replace(/\r/ig,'').substr(0,cursorPosition.end);
		var fix = '@';
		if(arguments[3]&&arguments[3]!=''){
			fix = arguments[3];
		}
//		if($(obj).attr("noat") == 1){
//			types = true;
//		}
		if(type === true){
			var begin = cursorEndContent+content;
		}else if(types==-1){//插入数据到当前输入区焦点位置
			var begin = textValue.substr(0,cursorPosition.start)+content;
		}else{
			var begin = cursorEndContent.substr(0,cursorEndContent.lastIndexOf(fix)+1)+content;
		}
		var end = textValue.replace(/\r/ig,'').substr(cursorPosition.end);
		//alert(end);
		var srTop = obj.scrollTop;
		obj.value = begin+end;
		obj.scrollTop = srTop;
		//begin = begin.replace(/\r/ig,'');
		if(type === true){
			comment.setCursorPosition(obj,{start:cursorPosition.end+1,end:begin.lastIndexOf('#')});
		}
		return begin.length;
	}

	/*nextAndUp select*/
	function nextChange(type,topic){
		var lis = topic.getElementsByTagName("li");
		var liLength = lis.length;
		if(liLength>0){
			var height = lis[0].offsetHeight;
			var scrollDiv = $(topic).find("div.autoCmt");
			for(var i=0;i<liLength;i++){
				if("curent" == lis[i].className){
					if("up" == type){
						lis[i].className = '';
						if(i-1<0){
							lis[liLength-1].className = 'curent';
							scrollDiv.scrollTop(liLength*height);
							break;
						}else{
							lis[i-1].className = 'curent';
							if((i+1)>2){
								scrollDiv.scrollTop((i-2)*height);
							}
						}

					}else if("down"==type){
						lis[i].className = '';
						if(i==(liLength-1)){
							lis[0].className = 'curent';
							scrollDiv.scrollTop(0);
							break;
						}else{
							lis[i+1].className = 'curent';
							scrollDiv.scrollTop(i*height);
						}
					}
					break;
				}
			}
		}
	}
        //创建浮动框
	function createFloatDiv(id){
		var topic1;
		var textArrayDiv = $("#textarray_div");
		var topicDiv = $("#text_topic");
		if(textArrayDiv.length<1){
			textArrayDiv = $("<div id='textarray_div' class='text-div' style='position:absolute; overflow-y:auto; word-wrap:break-word; overflow-x:hidden; left:0px; top:0px; filter:alpha(opacity=0); opacity:0;z-index:-999;'></div>").appendTo('body');
		}
		if(typeof id == 'string'){
			if($("#text_topic_"+id).length>0){
				topic1 = $("#text_topic_"+id);
			}else{
				topic1 = $('<div id="text_topic_'+id+'" style="display:none" class="atWrap"><div style="display: none;" class="musicTab"><div class="atSearch"><input type="text" class="inputTxt"><span class="atbtn"><input type="button" class="btn_search2"><a title="清空" class="del" href="#"></a></span></div><a title="关闭" class="close " href="#">&nbsp;</a></div><div style=" overflow-x: hidden;" class="autoCmt"><div class="autoCmtAll" style="display: block;" id="topic_content"></div></div><div style="" class="tips">@小二账号,Ta 就能收到</div></div>').appendTo('body');
			}
		}else{
			if(topicDiv.length<1){
				topic1 = $('<div id="text_topic" style="display:none" class="atWrap"><div style="display: none;" class="musicTab"><div class="atSearch"><input type="text" class="inputTxt"><span class="atbtn"><input type="button" class="btn_search2"><a title="清空" class="del" href="#"></a></span></div><a title="关闭" class="close " href="#">&nbsp;</a></div><div style=" overflow-x: hidden;" class="autoCmt"><div class="autoCmtAll" style="display: block;" id="topic_content"></div></div><div style="" class="tips">@小二账号,Ta 就能收到</div></div>').appendTo('body');
			}else{
				topic1 = topicDiv;
			}
		}
		//topic1
		return {textArrayDiv:textArrayDiv.get(0),topicDiv : topic1.get(0)};
	}
	
	
	$.fn.autoTextarea = function(options) {
        var defaults={
            maxHeight:1000,//文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度
            minHeight:$(this).height() //默认最小高度，也就是文本框最初的高度，当内容高度小于这个高度的时候，文本以这个高度显示
        };
        var opts = $.extend({},defaults,options);
		var autoTextarea = function (elem, extra, maxHeight) {
			extra = extra || 0;
			var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
			isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
			addEvent = function (type, callback) {
				elem.addEventListener ? elem.addEventListener(type, callback, false) : elem.attachEvent('on' + type, callback);
			},
			getStyle = elem.currentStyle ? function (name) {
			var val = elem.currentStyle[name];
			if (name === 'height' && val.search(/px/i) !== 1) {
			var rect = elem.getBoundingClientRect();
			return rect.bottom - rect.top -
				parseFloat(getStyle('paddingTop')) -
				parseFloat(getStyle('paddingBottom')) + 'px';
			};
			return val;
			} : function (name) {
			return getComputedStyle(elem, null)[name];
			},
			minHeight = parseFloat(getStyle('height'));
			elem.style.maxHeight = elem.style.resize = 'none';
			var change = function () {
			var scrollTop, height,
			padding = 0,
			style = elem.style;
			if (elem._length === elem.value.length) return;
			elem._length = elem.value.length;
			if (!isFirefox && !isOpera) {
			padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
			};
			scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			elem.style.height = minHeight + 'px';
			if (elem.scrollHeight > minHeight) {
			if (maxHeight && elem.scrollHeight > maxHeight) {
			height = maxHeight - padding;
			style.overflowY = 'auto';
			} else {
			height = elem.scrollHeight - padding;
			style.overflowY = 'hidden';
			};
			style.height = height + extra + 'px';
			scrollTop += parseInt(style.height) - elem.currHeight;
			/*document.body.scrollTop = scrollTop;
			document.documentElement.scrollTop = scrollTop;*/
			elem.currHeight = parseInt(style.height);
			};
			};
			addEvent('propertychange', change);
			addEvent('input', change);
			addEvent('focus', change);
			change();
		}; 
		return $(this).each(function() {
			autoTextarea(this,0,opts.maxHeight);
		});
		
		
		
        /*return $(this).each(function() {
			this.style.height =  opts.minHeight + 'px';
			var style = this.style;
			var this0 = this;
            $(this).bind("paste cut keyup",function(){
                var height,style=this.style;
                if (this.scrollHeight>0&&this.scrollHeight > opts.minHeight) {
                    if (opts.maxHeight && this.scrollHeight > opts.maxHeight) {
                        height = opts.maxHeight;
                        style.overflowY = 'scroll';
                    } else {
						if(this.scrollHeight>style.height.replace("px",""))
                        	height = this.scrollHeight;
                        style.overflowY = 'hidden';
                    }
					
                    $(this0).css("height",height + 'px');
                }
            });
        });*/
    };
	
})(jQuery);