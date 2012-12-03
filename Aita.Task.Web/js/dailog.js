/* 
 * 公用弹框
 * author tzq
 * time 2012-10-26
 */

(function($){
    if (!$) return;
    $.fn.extend({
        dailog:function(option){
			if(this.html()==null||$.trim(this.html())==""){
				return;
			}
            var defaults = { width:500,height:"auto",id:"pobBox",title:"温馨提示",titleClass:"",closeCallback:function(){}},_this=this,boxObj = null,bgBox=null,htmlObj=null,left=0,top=0;
            var getSys = comment.getSys();
			
            defaults = $.extend(defaults, option);
            if($("#"+defaults.id).length>0){
                pobObj = $("#"+defaults.id);
            }else{
                pobObj = $("<div id='"+defaults.id+"' class='dailog-box'><a href='javascript:;' class='close pob-close'>&nbsp;</a><div class='pob-bg-box'><div class='content-box'></div></div></div>");
                pobObj.appendTo("body");
            }
            if($("#pobBgBox").length>0){
                bjBox  = $("#pobBgBox");
            }else{
                bgBox = $("<div id='pobBgBox'></div>");
                bgBox.appendTo("body");
            }
            defaults.width = isNaN(defaults.width)||defaults.width<=0?500:defaults.width;
            defaults.height = isNaN(defaults.height)||defaults.height<=0?'auto':defaults.height;
            pobObj.css({width:defaults.width,height:defaults.height});
            if(getSys.ie){
                pobObj.find("div.pob-bg-box").css("background-color","#f5f5f5");
            }
            
            htmlObj = this.clone(true);
            htmlObj.attr("id",this.attr("id"));
            this.attr("id",function(){return this.id+'-pob-box'});
            pobObj.find("div.content-box").append("<h2 class='dailog-titel "+defaults.titleClass+"'>"+defaults.title+"</h2>");
            pobObj.find("div.content-box").append(htmlObj);
            $("#pobBgBox").show();
            htmlObj.show();
            pobObj.css({opacity:0}).show();
            top = parseInt($(window).scrollTop())+(parseInt($(window).height()/2)-parseInt(pobObj.height()/2));
            left = parseInt($(window).scrollLeft())+(parseInt($(window).width()/2)-parseInt(pobObj.width()/2));
            top = $(window).height()<pobObj.height()?$(window).scrollTop():top;
            left = $(window).width()<pobObj.width()?$(window).scrollTop():left;
            pobObj.css({top:top,left:left}).animate({opacity:1},function(){
                if(getSys.ie){
                    $(this).css("opacity","");
                }
            });
            pobObj.find("a.pob-close,[close=1]").unbind("click").click(function(){
                closeDailog(_this,pobObj,htmlObj,defaults.closeCallback);
            });
			
        },
        dailogClose:function(){
            var _this = this,id=this.attr("id");
            var callback = arguments[0] || function(){};
            if(this.closest("div.dailog-box").length>0){
                closeDailog($("#"+id+"-pob-box"),this.closest("div.dailog-box"),this,callback);
            }
        },
        floatDailog:function(options){
			var this0 = this;
            var defaults = {referObj:null,width:180,height:"auto",callBack:function(){},type:"bottom",tips:false,poorLeft:"0",poorTop:"0",zIndex:"90"};
            var floatDailogObj = $("#float-dailog"),conetntObj = null,offesets = null,left,top;
            var newObj = this.clone();
			this0.closeFloat = function(type){
				if(defaults.referObj.get(0).closeAction==true){
					return;
				}
				defaults.referObj.get(0).closeAction = true;
				if(defaults.type == "bottom"){
					   floatDailogObj.animate({height:0},300,function(){
							$(this).css("height","auto").hide();
							defaults.referObj.get(0).closeAction = false;
					   });
				}else{
					   floatDailogObj.animate({top:top+objHeight,height:0},300,function(){
							$(this).css("height","auto").hide();
							defaults.referObj.get(0).closeAction = false;
					   });
				}
			};
			
            newObj.attr("id",function(){return this.id+"-clone"});
            defaults = $.extend(defaults, options);
			if(defaults.referObj.get(0).action == true){
				return;
			}
			defaults.referObj.get(0).action = true;
            if(defaults.referObj == null)
                   return ;
            if(defaults.type == ""){
                defaults.type = "bottom";
            }
            offesets = defaults.referObj.offset();
            if(floatDailogObj.length<=0){
                floatDailogObj = $('<div class="pob cardT" style="display:none;" id="float-dailog"><div class="posBox" style="display:block"><div class="float-content-box"></div><s class="without-top"><i></i></s></div></div>');
                floatDailogObj.appendTo("body");
            }
            $("body").unbind("click");
            conetentObj = floatDailogObj.find("div.float-content-box");
            conetentObj.html("");
            newObj.appendTo(conetentObj);
            newObj.show();
            if(!isNaN(defaults.width)){
                floatDailogObj.css("width",defaults.width);
            }
            if(!isNaN(defaults.height)){
                floatDailogObj.css("height" ,defaults.height);
            }
			if(!isNaN(defaults.zIndex)){
                floatDailogObj.css("zIndex" ,defaults.zIndex);
            }
            floatDailogObj.css({zIndex:-1}).show();
			var objHeight = parseInt(floatDailogObj.height());
			floatDailogObj.css({height:0,overflow:"hidden"})
            if(defaults.type == "bottom"){
                 left  = offesets.left - defaults.poorLeft;
                 if(defaults.tips){
                     top = parseInt(offesets.top)+parseInt(defaults.referObj.height())+5+parseInt(defaults.poorTop);
                     floatDailogObj.find("s.without-top").hide();
                 }else{
                     top = parseInt(offesets.top)+parseInt(defaults.referObj.height()) + 12;
                     floatDailogObj.find("s.without-top").css({left:defaults.referObj.width()/2-8});
                 }
				 floatDailogObj.css({height:0,top:top,left:left,zIndex:defaults.zIndex}).animate({height:objHeight},300,function(){
				 	defaults.referObj.get(0).action = false;
					$(this).css({overflow:"visible"});
				 });
				 floatDailogObj.find("a.close,[close=1]").click(function(){
					   this0.closeFloat(defaults.type);
				 })
             }else{
				 left  = offesets.left - defaults.poorLeft;
                 top = parseInt(offesets.top)-objHeight-parseInt(defaults.poorTop); 
				 if(defaults.tips){
					 var tipsObj = floatDailogObj.find("s.without-top");
                	 tipsObj.removeClass().addClass("without-bottom");
					 tipsObj.css("left",(parseInt(defaults.poorLeft)+defaults.referObj.width()/2-8)+"px").show();
				 	 top = top+tipsObj.height();
				 }else{
				 	 floatDailogObj.find("s.without-top").hide(); 
				 }
				 floatDailogObj.css({top:top+objHeight,left:left,zIndex:defaults.zIndex}).animate({top:top,height:objHeight},300,function(){defaults.referObj.get(0).action = false; $(this).css({overflow:"visible"});});
				 floatDailogObj.find("a.close,[close=1]").click(function(){
					   this0.closeFloat(defaults.type);
				 })
				 
             }
			 $("body").click(function(e) {
                    defaults.referObj.get(0)==e.target||floatDailogObj.get(0) == e.target || jQuery.contains(floatDailogObj.get(0), e.target) || floatDailogObj.hide();
                    
             });
			 return this;
        }
        
    });
    function closeDailog(obj,pobObj,htmlObj,callback){
        pobObj.animate({opacity:0},function(){
			$("#pobBgBox").hide();
            $(this).hide();
            obj.attr("id",htmlObj.attr("id"));
            htmlObj.parent().html("");
            pobObj.hide();
            if(typeof callback == "function"){
                callback();
            }
         })
         
    }
    $.ifAlert = true;
    $.alertDallog = function(options){ 
			if($.ifAlert){
				$.ifAlert = false;
				var defaults = {msg:'您上传的文件过大！',title:"温馨提示"},contentObj;
				defaults = $.extend(defaults, options);
				contentObj = $("<div class='alert-msg'>"+defaults.msg+"<div class='alert-button'><input type='button' value='确定' class='gren-button' close=1 /></div></div>");
				contentObj.dailog({width:300,height:"auto",id:"pobBox",title:defaults.title,closeCallback:function(){$.ifAlert = true;}});
			}
      }
    
})(jQuery);