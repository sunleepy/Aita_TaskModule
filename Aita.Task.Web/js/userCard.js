/* 
 * 用户头像显示chajian
 * v 1.0
 * auther tzq
 */
(function($){
    if (!$) return;
    $.fn.extend({
        showUserCard:function(option){
            var _this = this;
            var defaults = {timeOut:100,getUrl:'card.php',clickFunction:function(){}};
            var floatObj = null;
            var closeTimeOut = true;
            var x = 0,x_1 = 0;
            var y = 0,y_1 = 0;
            defaults = $.extend(defaults, option);
			if(_this.attr("bind-hover")=="1"){
				return;
			}
			_this.attr("bind-hover","1");
            if($("#userCard").length>0){
                floatObj = $("#userCard");
            }else{
                floatObj = $('<div class="pob cardT" id="userCard" style="top:0px; left: 0px;"><div class="user-card posBox"><div class="user-pic po-a"><br /><br /><br /></div></div></div>');
                floatObj.hide();
                floatObj.appendTo("body");                
            }
            
            this.each(function(){
                this.timeout = true;
                this.ifAction = true;
            })
           /* 
            this.live("mousemove",function(e){
                var tarGet = this;
                if(this.box&&this.box==1)return;
                if(this.timeout == true){
                   this.timeout = setInterval(function(){
                        if(x_1!=0&&y_1!=0){
                            if(x==x_1&&y==y_1){
                                getData(x,y,tarGet);
                                clearInterval(tarGet.timeout);
                                tarGet.timeout = true;
                                tarGet.box = 1;
                            }else{
                                x = x_1;
                                y = y_1;
                            }
                        }
                    },100);
                }
                x_1 = e.clientX;
                y_1 = e.clientY;
            });
            */
            this.mousemove(function(e){
                var this0 = this;
                clearTimeout(this.timeout);
                if($(this).attr("box")&&$(this).attr("box")==1)return;
                this.timeout = setTimeout(function(){
                    var x = e.clientX;
                    var y = e.clientY;
                    $(this0).attr("box","1");
                    getData(x,y,this0);
                },350);
            });
            
            this.mouseout(function(){
                    clearTimeout(this.timeout);
                    hideCard(this);
            });
            
            function getData(x,y,obj){
                var this0 = obj;
                if(obj.datas&&obj.datas!=""){
                   showCard(obj,x,y);
                }else{
                    $(obj).addClass("content-loading");
					if(obj.id){
						obj.id = obj.id.replace("id_","");
					}
                    $.post(defaults.getUrl+"?id="+obj.id,{id:obj.id},function(data){
                        if(data != ''){
                            obj.datas = data;
                            $(obj).removeClass("content-loading");
                            showCard(obj,x,y);
                        }
                    })   
                }
                
            }
                     
            function showCard(obj,x,y){
                if(!obj.ifAction) return ;
                var data = obj.datas;
                var left = $(window).scrollLeft()+parseInt(x);
                var top =  $(window).scrollTop()+parseInt(y);
                var chaju = 8;
                
                
                floatObj.unbind("hover").hover(function(){
                    clearTimeout(closeTimeOut);
                    closeTimeOut = true;
                },function(){
                   obj.box = '';
                   floatObj.animate({opacity:"0"},400,function(){
                       $(this).hide();
                   });
                })
                
                
                floatObj.find(".user-card").html(data);
                floatObj.css("opacity","0");
                floatObj.stop(this,true);
                floatObj.show();
                left = (left+chaju+floatObj.width()>$(window).scrollLeft()+$(window).width())?left-floatObj.width()-chaju:left+parseInt(chaju);
                top = (top+chaju+floatObj.height()>$(window).scrollTop()+$(window).height())?top-floatObj.height()-chaju:top+parseInt(chaju);
                floatObj.css({left:left,top:top});
                obj.ifAction = false;
                floatObj.animate({opacity:"1"},400,function(){
                    obj.ifAction = true;
					if(typeof defaults.clickFunction == "function"){
						floatObj.unbind("click").click(function(e){
							defaults.clickFunction.call(this,e,obj);
					    });
					} 
                });
                               
            } 
            function hideCard(obj){
                if(closeTimeOut==true){
                    closeTimeOut = setTimeout(function(){
                       floatObj.animate({opacity:"0"},400,function(){
                           $(this).hide();
                       });
                       closeTimeOut = true;
                       //obj.box = '';
                       obj.data = floatObj.find(".user-card").html();
                       $(obj).attr("box","");
                    },defaults.timeOut);
                }
            }
        }
    });
    
})(jQuery);