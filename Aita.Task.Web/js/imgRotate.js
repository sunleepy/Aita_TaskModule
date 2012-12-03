/* 
 * 图片放在缩小，旋转控件
 */
(function($){
    if (!$) return;
    $.fn.extend({
        imgRotate:function(option){
            var defaults = {maxWidth:440};
            var _this = this;
            defaults = $.extend(defaults, option);
            _this.each(function(){
                $(this).find("img").attr("ifAction","1");
                this.timeout = false;
            });
            _this.find("div.content-img").css("max-width",defaults.maxWidth+"px");
            _this.click(function(e){
                var tarGet = e.target;
                var loadingObj = $(tarGet).closest(".image-container");
                var imageWrapper = $(tarGet).closest("."+_this.get(0).className);
                //alert(imageWrapper.get(0).timeout);
                if(imageWrapper.length<=0||imageWrapper.get(0).timeout!==false){return;}
                if(tarGet.tagName.toUpperCase() == "IMG"){
                    var titleObj = imageWrapper.find("div.image-wrapper-title");
                    imageWrapper.get(0).timeout = setTimeout(function(){
                        imageWrapper.get(0).timeout = false;
                    },600);
                    if($(tarGet).attr("ifAction")=="1"){
                        $(tarGet).attr("ifAction","");
                        var currentUrl = $(tarGet).attr("data-src");
                        if($.trim($(tarGet).attr("small-src"))==''){
                            $(tarGet).attr("small-src",tarGet.src);
                        }
                        if($.trim($(tarGet).attr("current-type")) == "1"){
                            currentUrl = $.trim($(tarGet).attr("small-src"));
                            $(tarGet).attr("current-type","");
                                //$(tarGet).css("-moz-transform","rotate(0deg)").css("-moz-transition","").css("-webkit-transform","rotate(0deg)").css("-webkit-transition","all 0.5s ease-in-out").css("-ms-transform","rotate(0deg)").css("-ms-transition","all 0.5s ease-in-out").css("-o-transform","rotate(0deg)").css("-o-transition","all 0.5s ease-in-out").css("margin","0px");
                                $(tarGet).removeAttr("style");
                                $(tarGet).parent().removeAttr("style");
                                imageWrapper.attr("rotate","");
                                $(tarGet).parent().css("width","auto");
                                $(tarGet).closest("div.image-container").css("padding","0px");
                                titleObj.slideUp();
                                $(tarGet).animate({width:$(tarGet).attr("data-width"),height:$(tarGet).attr("data-height")},function(){
                                    tarGet.src = currentUrl;
                                    $(tarGet).attr("ifAction","1");
                                    $(tarGet).removeClass("cursor-big");
                                });
                         }else{
                            $(tarGet).attr("current-type","1");
                            loadingObj.addClass("content-loading");
                            comment.getImgOffset(currentUrl,function(sizeData){
                                var currentSize = comment.calculateSize(sizeData.width,sizeData.height,defaults.maxWidth,"auto");
                                $(tarGet).attr("data-width",$(tarGet).width());
                                $(tarGet).attr("data-height",$(tarGet).height());
                                loadingObj.removeClass("content-loading");
                                titleObj.slideDown();
                                $(tarGet).closest("div.image-container").css("padding","0px 5px 5px");
								tarGet.style.height = "auto";
                                $(tarGet).animate({width:currentSize[0]},function(){
                                    tarGet.src = currentUrl;
                                    $(tarGet).attr("ifAction","1");
                                    $(tarGet).addClass("cursor-big");
                                });
                            });
                        }
                    }

                }else if(tarGet.tagName.toUpperCase() == "A" && tarGet.className.indexOf("image-rotate")>-1){
                    
                    var className = tarGet.className;
                    var imgObj = imageWrapper.find(".content-img img").get(0);
                    var rotate = 0;
                    imageWrapper.get(0).timeout = setTimeout(function(){
                        imageWrapper.get(0).timeout = false;
                    },600);
                    if(imageWrapper.attr("rotate")&&!isNaN(imageWrapper.attr("rotate"))){
                        rotate = parseInt(imageWrapper.attr("rotate"));
                    }

                    if(className.indexOf("image-rotate-left")>-1){
                        rotate++;
                        comment.imgRotate(imgObj, rotate, 'left',defaults.maxWidth)
                    }else if(className.indexOf("image-rotate-right")>-1){
                        rotate--;
                        comment.imgRotate(imgObj, rotate, 'right',defaults.maxWidth);
                    }
                    imageWrapper.attr("rotate",rotate);
                }else if(tarGet.tagName.toUpperCase() == "A" && tarGet.className.indexOf("image-fold")>-1){
                    imageWrapper.find("img").click();
                }
            });
        }
    });
    
})(jQuery)

