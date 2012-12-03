/** 
 * 修改用户头像
*/

(function($){
    if (!$) return;
    var parentBoxId = '';
    $.fn.extend({
        jcrop:function(option){
            var _this = this,boxObj = null;
            var defaults = {maxWidth:300,maxHeight:300,photoBoxId:"update-user-card",loadBack:function(){}};
            defaults = $.extend(defaults, option);
            boxObj = $("#"+defaults.photoBoxId);
            _this.change(function(){
                var form2 = $('<form enctype="multipart/form-data" method="post" action="'+$(this).attr('upload-url')+'" ></form>');
                var this0 = this;
				var parentSpan = $(this0).closest("span");
                var newFile = $(this).parent().children('input').clone(true);
                var divObj = $(this).parent();
				var fix  = this0.value.substr(this0.value.lastIndexOf(".")+1);
				fix = fix.toUpperCase();
				if(fix!="JPG"&&fix!="JPEG"&&fix!="GIF"&&fix!="PNG"){
					comment.msgBox("请选择jpg(jpeg),gif,png格式的图片！","error");
					return false;
				}
                form2.appendTo('body');
                $(this).parent().children('input').appendTo(form2);
                newFile.appendTo(divObj);
                form2.ajaxForm({
                        dataType: 'text',
                        timeout: 6000,
                        beforeSend: function(formData) {
								$(newFile).attr("disabled");
								parentSpan.addClass("content-loading");
                                return true;
                        },
                        error: function (xhr, textStatus, errorThrown) {
								$(newFile).attr("disabled",false);
								parentSpan.removeClass("content-loading");
                                return;
                        },
                        success: function(data, textStatus) {
							$(newFile).attr("disabled",false);
							parentSpan.removeClass("content-loading");
							try{
								var data = eval('('+data+')');
							}catch(e){
								var data = "";
							}
                            if(''!=data){
                                    if(data.state=="0"){
                                        comment.getImgOffset(data.msg, function(size){
                                            var getSize = comment.calculateSize(size.width,size.height,defaults.maxWidth,defaults.maxHeight);
                                            if($('div.jcrop-holder',boxObj).length>0){
                                                $("#avatar_original",boxObj).children().remove();
                                                $("#avatar_original",boxObj).append("<img width='"+getSize[0]+"' height='"+getSize[1]+"' src='' />");
                                            }
                                            $("#avatar_original img",boxObj).attr('src',data.msg).attr("width",getSize[0]).attr("height",getSize[1]);
                                            $('#avatar_preview_middle img',boxObj).attr('src',data.msg);
                                            $('#avatar_preview_big img',boxObj).attr('src',data.msg);
                                            $('#avatar_preview_small img',boxObj).attr('src',data.msg);
											$('#avatar_url',boxObj).val(data.msg);
											$('#avatar_width',boxObj).val(getSize[0]);
											$('#avatar_height',boxObj).val(getSize[1]);
                                            boxObj.dailog({width:640,title:"修改头像"});
                                            //newFile.hide();
                                            crop($("#"+defaults.photoBoxId+" #avatar_original img"),defaults.maxWidth,defaults.photoBoxId);
                                            if(typeof defaults.loadBack == "function"){
                                                defaults.loadBack("#"+defaults.photoBoxId);
                                            }
                                        
                                        })
                                    }else{
                                        comment.msgBox(data.msg,"error");
                                    }
                            }else{
                                   comment.msgBox('请求超时！',"error");	
                            }
                        }
                });	
                form2.submit();
                form2.hide();
            });
        }
    });
    function crop(imgObj,maxWidth,boxObjId){
        var x =  0;
        var y = 0;
        var w = $("#"+boxObjId+" #avatar_original img").width();
        var h = $("#"+boxObjId+" #avatar_original img").height();
        parentBoxId = boxObjId;
        $("#"+boxObjId+" #avatar_crop_x").val(x);
        $("#"+boxObjId+" #avatar_crop_y").val(y);
        if(w>h){
                w = h;
        }else if(h>w){
                h = w;
        }
        $("#"+boxObjId+" #avatar_crop_w").val(w);
        $("#"+boxObjId+" #avatar_crop_h").val(h);
        imgObj.Jcrop({
                onChange: showPreview,
                setSelect: [x,y,w,h],
                onSelect: updateCoords,
                aspectRatio: 1,
                boxWidth: maxWidth,
                boxHeight: maxWidth,
                bgColor: '#CCCCCC',
                bgOpacity: .4,
                allowSelect:false
        });

    }


    function showPreview(coords) {
            var rx = 36 / coords.w;
            var ry = 36 / coords.h;
            var rx_big = 100 /coords.w;
            var ry_big = 100 /coords.h;
            var rx_small = 25 /coords.w;
            var ry_small = 25 /coords.h;
            var img_width = $('#'+parentBoxId+' #avatar_original img').attr("width");
            var img_height = $('#'+parentBoxId+' #avatar_original img').attr("height");
            $('#'+parentBoxId+' #avatar_preview_small img').css({
                    width: Math.round(rx_small *img_width) + 'px',
                    height: Math.round(ry_small * img_height) + 'px',
                    marginLeft: '-' + Math.round(rx_small * coords.x) + 'px',
                    marginTop: '-' + Math.round(ry_small * coords.y) + 'px'
            });
            $('#'+parentBoxId+' #avatar_preview_middle img').css({
                    width: Math.round(rx *img_width) + 'px',
                    height: Math.round(ry * img_height) + 'px',
                    marginLeft: '-' + Math.round(rx * coords.x) + 'px',
                    marginTop: '-' + Math.round(ry * coords.y) + 'px'
            });
            $('#'+parentBoxId+' #avatar_preview_big img').css({
                    width: Math.round(rx_big *img_width) + 'px',
                    height: Math.round(ry_big * img_height) + 'px',
                    marginLeft: '-' + Math.round(rx_big * coords.x) + 'px',
                    marginTop: '-' + Math.round(ry_big * coords.y) + 'px'
            });

    };

    function updateCoords(c) {
            $('#'+parentBoxId+' #avatar_crop_x').val(c.x);
            $('#'+parentBoxId+' #avatar_crop_y').val(c.y);
            $('#'+parentBoxId+' #avatar_crop_w').val(c.w);
            $('#'+parentBoxId+' #avatar_crop_h').val(c.h);
    };
})(jQuery);