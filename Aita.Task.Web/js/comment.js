/* 
 * public js
 * time:2012 11 22
 * author tzq
 */

var comment ={
    getImgOffset:function(url,callback){
        if(typeof url != "string"||url==''){
            return null;
        }
        var divObj = $("<div></div>");
        var imgObj = $("<img src='"+url+"' />");
        var returnObj = {};
        divObj.css({zIndex:"-1",position:"absolute", opacity:"0px",top: "-1000000px"})
        divObj.appendTo("body");
        imgObj.appendTo(divObj);
        imgObj.get(0).onload = function(){
            returnObj.width = imgObj.width();
            returnObj.height = imgObj.height();
            if(typeof callback == 'function'){
                divObj.remove();
                callback(returnObj);
            }
            //alert(imgObj.width());
        }
        return returnObj;
    },
    testCss3:function() {
        var div = document.createElement('div'),
        vendors = 'Khtml Ms O Moz Webkit'.split(' '),
        len = vendors.length;

        return function(prop) {
        if ( prop in div.style ) return true;

        prop = prop.replace(/^[a-z]/, function(val) {
        return val.toUpperCase();
        });
        1
        while(len--) {
        if ( vendors[len] + prop in div.style ) {
        // browser supports box-shadow. Do what you need.
        // Or use a bang (!) to test if the browser doesn't.
        return true;
        }
        }
        return false;
        };
    },
    calculateSize:function(actualW,actualH,targetW,targetH){
        var height='auto',width='auto';
        actualW = parseInt(actualW);
        actualH = parseInt(actualH);
        if(actualW<targetW&&actualH<targetH){
            return [actualW,actualH];
        }
        if(actualW<targetW&&(targetH==0||targetH=="auto")){
            return [actualW,actualH];
        }
        if(actualW>actualH){
                if(actualW>targetW){
                        width = targetW;
                        height = Math.floor(actualH*width/actualW);
                }else{
                        width = actualW;
                        height = actualH;
                }
        }else if(actualW<actualH){
                if(targetH=="auto"||targetH==0){
                    if(actualW>targetW){
                        width = targetW;
                        height = Math.floor(actualH*width/actualW);
                    }else{
                        width = targetW;
                        height = targetH;
                    }
                }else{
                   if(actualH>targetW){
                        height = targetW;
                        width = Math.floor(actualW*targetW/actualH);
                    }else{
                            width = actualW;
                            height = actualH;	
                    } 
                }
                
        }else{
                if(actualW>targetW){
                        width = targetW;
                        height = targetH;
                }else{
                        width = targetW;
                        height = targetH;
                }
        }
        return [width,height];
    },
    getSys:function(){
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
        return Sys;
    },
    imgRotate:function(target,degree,type,maxWidth){
		var isIE = /*@cc_on!@*/!1;
		var _this = this;
        var css3Degree = degree;
        var isCss3 = comment.testCss3();
        var getSys = comment.getSys();
		if(degree<-3){
			degree = -degree%4
		}
		if(degree>3){
			degree = degree%4
		}
		_this.r = degree;
		if(degree<0){
			_this.r = degree+4;
		}
		this._img = typeof target == 'string'?document.getElementById(target):target;
        
        if(getSys.firefox||getSys.chrome||getSys.opera||getSys.safari){
            var radiu = -css3Degree*90;
            if(this._img.height>this._img.width){
                var imgSize,cha;
                if($(this._img).attr("max-size")&&$(this._img).attr("max-size")!=''){
                    imgSize = $(this._img).attr("max-size").split("|");
                }else{
                    imgSize = comment.calculateSize($(this._img).height(), $(this._img).width(), maxWidth,0);
                    $(this._img).attr("max-size",imgSize.join("|"));
                    $(this._img).attr("old-size",$(this._img).height()+"|"+$(this._img).width());
                }
                if(css3Degree%2 == 0){
                    imgSize = $(this._img).attr("old-size").split("|");
                }
                cha = Math.ceil((imgSize[0]-imgSize[1])/2);
                $(this._img).css({width:imgSize[1],height:imgSize[0]});
                this._img.height = imgSize[0];
                this._img.width = imgSize[1];
                $(this._img).parent().css({width:css3Degree%2 == 0?"auto":imgSize[0]+'px'});
                $(this._img).css({marginTop:-((css3Degree%2!=0)?cha:0)+'px',marginBottom:-((css3Degree%2!=0)?cha:0)+'px'});//return [actualW,actualH];
            }else{
                var cha = Math.ceil((this._img.height-this._img.width)/2);
                $(this._img).parent().css({width:css3Degree%2 == 0?"auto":this._img.height+'px'});
                $(this._img).css({marginTop:-((css3Degree%2!=0)?cha:0)+'px',marginBottom:-((css3Degree%2!=0)?cha:0)+'px',marginLeft:((css3Degree%2!=0)?cha:0)+'px'});
            }
            
            $(this._img).css("-moz-transform","rotate("+radiu+"deg)").css("-moz-transition","all 0.5s ease-in-out").css("-webkit-transform","rotate("+radiu+"deg)").css("-webkit-transition","all 0.5s ease-in-out").css("-ms-transform","rotate("+radiu+"deg)").css("-ms-transition","all 0.5s ease-in-out").css("-o-transform","rotate("+radiu+"deg)").css("-o-transition","all 0.5s ease-in-out");
            return ;
        }

        
	 if (!isIE){
            if(this._img.parentNode.getElementsByTagName("CANVAS").length>0){
               var canvas = this._img.parentNode.getElementsByTagName("CANVAS")[0];
               canvas.style.display = '';
               this._img.style.display = "none";
            }else{
                var canvas = document.createElement('CANVAS');
                this._img.parentNode.appendChild(canvas,this._img);
                this._img.style.display = "none";
            } 

            this._ghost = this._img.parentNode.getElementsByTagName("IMG")[0];
            this._ghost.width = this._ghost.style.width.replace("px",'');
            this._ghost.height = this._ghost.style.height.replace("px",'');
            this._img = new Image();
            this._img.src = './images/test2-2-big.png';
            this._img1 = this._img;
            var ctx = canvas.getContext('2d');
//			canvas.setAttribute('width',this._ghost.width);
//			canvas.setAttribute('height',this._ghost.height);
//			ctx.drawImage(this._img,0,0);
            this._img = canvas;

            $(canvas).click(function(){
                var imgObjs = this.parentNode.getElementsByTagName("IMG");
                if(imgObjs.length>0){
                    var imgObj = imgObjs[0];
                    this.style.display = 'none';
                    _this._img.setAttribute('width',_this._ghost.width);
                    _this._img.setAttribute('height',_this._ghost.height);
                    ctx.drawImage(_this._img1,0,0);
                    imgObj.style.display = '';
                    $(imgObj).trigger("click");
                    $(imgObj).closest("div.image-wrapper").attr("rotate","0");
                }
            });
            
            this._img1.onload = function(){
                switch (_this.r){
                    case 0:
                            _this._img.setAttribute('width',_this._ghost.width);
                            _this._img.setAttribute('height',_this._ghost.height);
                            ctx.drawImage(_this._img1,0,0);
                            break;
                    case 1:
                            _this._img.setAttribute('width',_this._ghost.height);
                            _this._img.setAttribute('height',_this._ghost.width);
                            ctx.rotate(270*Math.PI/180);
                            ctx.drawImage(_this._img1,-_this._ghost.width,0);

                            break;
                    case 2:

                            _this._img.setAttribute('width',_this._ghost.width);
                            _this._img.setAttribute('height',_this._ghost.height);
                            ctx.rotate(180*Math.PI/180);
                            ctx.drawImage(_this._img1,-_this._ghost.width,-_this._ghost.height);
                            break;
                    case 3:
                            _this._img.setAttribute('width',_this._ghost.height);
                            _this._img.setAttribute('height',_this._ghost.width);
                            ctx.rotate(90*Math.PI/180);
                            ctx.drawImage(_this._img1,0,-_this._ghost.height);
                            break;
                }               
            }
	}else{
                var width,height;
                if($(this._img).attr("data-size")&&$(this._img).attr("data-size")!=""){
                    var sizeArr = $(this._img).attr("data-size").split("--");
                    width = parseInt(sizeArr[0]);
                    height = parseInt(sizeArr[1]);
                }else{
                   width = $(this._img).width();
                   height = $(this._img).height(); 
                   $(this._img).attr("data-size",width+"--"+height);
                }
                
		if(_this.r==1||_this.r==3){
                    if(height>width){
                        var getSize = comment.calculateSize(height,width,maxWidth,"auto");
                        this._img.style.height = getSize[0]+"px";
                        this._img.style.width = getSize[1]+"px"; 
                        $(this._img).parent().css({textAlign:"left",height:getSize[1],width:getSize[0]});
                    }else{
                        $(this._img).parent().css({width:height});
						 $(this._img).parent().css({height:width});
                    }
		}else{
                    if(height>width){
                       this._img.style.height = height+"px";
                       this._img.style.width = width+"px";  
                       $(this._img).parent().css({textAlign:"center",height:height,width:"auto"}); 
                    }else{
                       $(this._img).parent().css({width:width});
					   $(this._img).parent().css({height:height});
                    }
                    /*this._img.width = width;
                    $(this._img).removeAttr("height");
                    $(this._img).parent().css({height:height,width:width});*/
		}

		this._img.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(Rotation=' + (4-_this.r) + ')';
	}
		
		
    },
    //获得屏幕左上角的绝对xy值
    getScrollXY:function() {
           var x, y;
           if (document.body.scrollTop) {
                   x = document.body.scrollLeft;
                   y = document.body.scrollTop;
           } else {
                   x = document.documentElement.scrollLeft;
                   y = document.documentElement.scrollTop;
           }
           return [x, y];
    },
    //获得屏幕的宽高 返回数组
    getPageSize:function() {
            var myWidth = 0,
            myHeight = 0;
            var scrolls = comment.getScrollXY();
            if (typeof(window.innerWidth) == 'number') { //Non-IE
                    myWidth = window.innerWidth;
                    myHeight = window.innerHeight;
            } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) { //IE 6
                    myWidth = document.documentElement.clientWidth;
                    myHeight = document.documentElement.clientHeight;
            } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) { //IE 4
                    myWidth = document.body.clientWidth;
                    myHeight = document.body.clientHeight;
            }

            return {clientWidth: myWidth, clientHeight: myHeight, pageWidth: scrolls[0] + myWidth, pageHeight: scrolls[1] + myHeight };
    },
    //获取页面元素到body的坐标
    getElementPos:function(elementId) {
            var ua = navigator.userAgent.toLowerCase();
            var isOpera = (ua.indexOf('opera') != -1);
            var isIE = (ua.indexOf('msie') != -1 && !isOpera); // not opera spoof
            if('object' == typeof elementId){
                    var el = elementId;
            }else{
                    var el = document.getElementById(elementId);
            }
            if(el.parentNode === null || el.style.display == 'none') {
               return false;
            }
            var parent = null;
            var pos = [];
            var box;
            if(el.getBoundingClientRect)    //IE
            {
               box = el.getBoundingClientRect();
               var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
               var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
               return {x:box.left + scrollLeft, y:box.top + scrollTop};
            }else if(document.getBoxObjectFor)    // gecko
            {
               box = document.getBoxObjectFor(el);
               var borderLeft = (el.style.borderLeftWidth)?parseInt(el.style.borderLeftWidth):0;
               var borderTop = (el.style.borderTopWidth)?parseInt(el.style.borderTopWidth):0;
               pos = [box.x - borderLeft, box.y - borderTop];
            } else    // safari & opera
            {
               pos = [el.offsetLeft, el.offsetTop];
               parent = el.offsetParent;
               if (parent != el) {
                    while (parent) {
               pos[0] += parent.offsetLeft;
               pos[1] += parent.offsetTop;
               parent = parent.offsetParent;
                    }
               }
               if (ua.indexOf('opera') != -1 || ( ua.indexOf('safari') != -1 && el.style.position == 'absolute' )) {
                    pos[0] -= document.body.offsetLeft;
                    pos[1] -= document.body.offsetTop;
               }
            }
            if (el.parentNode) {
                    parent = el.parentNode;
            } else {
                    parent = null;
            }
            while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') { // account for any scrolled ancestors
               pos[0] -= parent.scrollLeft;
               pos[1] -= parent.scrollTop;
               if (parent.parentNode) {
                            parent = parent.parentNode;
               } else {
                            parent = null;
               }
            }
            return {x:pos[0], y:pos[1]};
    },
    //为文本输入设置焦点
    setCursorPosition:function(textarea, rangeData) {
        if(!rangeData) {
                return;
        }
        $(textarea).focus();
        if (textarea.setSelectionRange) {
                // W3C textarea.focus();
                textarea.setSelectionRange(rangeData.start,rangeData.end);
                $(textarea).focus();
                //return;
        } else if (textarea.createTextRange) {
                // IE
                var oR = textarea.createTextRange();
                // Fixbug :
                // In IE, if cursor position at the end of textarea, the setCursorPosition function don't work
                oR.collapse(true);
                oR.moveEnd('character', rangeData.end);
                oR.moveStart('character', rangeData.start);
                oR.select();
        }
    },
    //获取文本输入的焦点
    getCursorPosition:function(textarea) {
            var rangeData = {text: "", start: 0, end: 0 };
            textarea.focus();
            if (textarea.setSelectionRange) { // W3C
                    rangeData.start= textarea.selectionStart;
                    rangeData.end = textarea.selectionEnd;
                    rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end): "";
            } else if (document.selection) { // IE
                    var i, oS = document.selection.createRange(), // Don't: oR = textarea.createTextRange()
                    oR = document.body.createTextRange();
                    oR.moveToElementText(textarea);
                    rangeData.text = oS.text;
                    if(textarea.tagName == "TEXTAREA"){
                            rangeData.bookmark = oS.getBookmark();
                            var Sel2 = oS.duplicate();
                            Sel2.moveToElementText(textarea);
                            var CaretPos = -1;
                            while(Sel2.inRange(oS)){
                                   Sel2.moveStart('character');
                                   CaretPos++;
                            }
                            rangeData.start = CaretPos;
                   }else{
                           oS.moveStart("character",-event.srcElement.value.length);
                           rangeData.start = oS.text.length;
                   }
                   rangeData.end = rangeData.text.length + rangeData.start;
           }
           return rangeData;
   },
   imgUploadDisable:function(obj,b) {
        if(obj.attr("id").indexOf("img")>-1){
            obj.uploadify('settings','buttonCursor',b?'arrow':'pointer');
            obj.uploadify('settings','buttonImage','/images/'+(b?'image_upload_gray.png':'image_upload.png'));
            obj.uploadify('disable', b?true:false);
        }else if(obj.attr("id").indexOf("file")>-1){
            obj.uploadify('settings','buttonImage','/images/'+(b?'attachment_gray.png':'attachment.png'));
            obj.uploadify('settings','buttonCursor',b?'arrow':'pointer');
            obj.uploadify('disable', b?true:false);
        }
   },
   attachClose:function(e){
       var tarGet = e.target;
       var this0 = this;
       var formObj = $(this0).parents("form");
       var fileId = formObj.attr("file-id");
       if(tarGet.tagName.toUpperCase() == "A"&&tarGet.className=='close'){
           var parentObj = $(tarGet).parent().parent();
           var attachBox = $(tarGet).closest("div.attach-box");
           if($(tarGet).attr("ifcomment") == 'true'){
               var fileType = $(tarGet).attr("filetype");
               $("#"+fileId+"_"+fileType).uploadify('cancel', tarGet.rel);
			   comment.attachValue($("input[name=attach_ids]",formObj),$(tarGet).attr("close-id"),"jian");
               $(tarGet).parent().fadeIn(function(){$(this).remove();},function(){
                         //$(".attach-video",formObj).removeClass("video-disable");
						 /*if(fileType=="img"){
						 	comment.textDefault($("textarea.text-div",formObj),"分享图片",true);
						 }else{
						 	comment.textDefault($("textarea.text-div",formObj),"分享文件",true);
						 }*/
                         comment.imgUploadDisable($("#"+fileId+"_img"));
						 comment.imgUploadDisable($("#"+fileId+"_file"));
               });
           }else{
                if($(tarGet).closest("div.atta-list").length>0){
                    
                    $("#"+fileId+"_file").uploadify('cancel', tarGet.rel);
					comment.attachValue($("input[name=attach_ids]",formObj),$(tarGet).attr("close-id"),"jian");
                    $(tarGet).parent().stop().fadeOut(100,function(){
						$(this).remove();
					},function(){
                        if(parentObj.children("div.uploadify-progress").length<=5){
                             //$(".attach-video",formObj).removeClass("video-disable");
                             comment.imgUploadDisable($("#"+fileId+"_file"));
                        }
						if(parentObj.children("div.uploadify-progress").length-1<=0){
							comment.textDefault($("textarea.text-div",formObj),"分享文件",true);
							if(attachBox.find("div.img-attach").find("img").length>0){
								comment.textDefault($("textarea.text-div",formObj),"分享图片");
							}
						}
                    });
                }else if($(tarGet).closest("div.img-attach").length>0){
                    $(tarGet).closest("div.img-attach").find("img").fadeOut(function(){$(this).remove();$(tarGet).closest("div.img-attach").hide(); });
                    //$(".attach-video",formObj).removeClass("video-disable
                    $("#"+fileId+"_img").uploadify('cancel', '*');
                    comment.imgUploadDisable($("#"+fileId+"_img"));
					
					comment.textDefault(formObj.find("textarea.text-div"),"分享图片",true);
					if(attachBox.find("div.atta-list>div.uploadify-progress").length>0){
						comment.textDefault(formObj.find("textarea.text-div"),"分享文件");
					}
					
                }else if($(tarGet).closest("div.post-video-box").length>0){
                    var videoBox = $(tarGet).parents("div.post-video-box").hide();
                    videoBox.find("div.add-video").show();
                    videoBox.find("div.show-video").html("").hide();
                    $("#"+videoBox.find("div.add-video").find("input").attr("id")+"_span").hide();
                    $(".attach-video",formObj).removeClass("video-disable");
                    comment.imgUploadDisable($("#"+fileId+"_img",formObj));
                    comment.imgUploadDisable($("#"+fileId+"_file",formObj));
                }else if($(tarGet).closest("div.action-error-msg").length>0){
                    $(tarGet).closest("div.action-error-msg").hide();
                }else if($(tarGet).closest("div.group-list").length>0){
                    $(tarGet).closest("div.gl-list").fadeOut(function(){
						comment.attachValue(formObj.find("input[name=group_ids]"),$(tarGet).attr("id").replace("group_",""));											  
						$(this).remove();
					})
                    if($(tarGet).closest("div.group-list").find("div.gl-list").length<=0){
                        $(tarGet).closest("div.group-list").hide();
                    }
                }
				
				
          }
		  
          if(attachBox.find("div.img-attach").find("img").length<=0&&attachBox.find("div.atta-list>div.uploadify-progress").length<=0&&attachBox.find("div.group-list>div.gl-list").length<=0){
                attachBox.hide();
          }
		  
       }
       
   },
   uploadFile:function(fileObj,formObj,ifComment){
       var fileType = fileObj.attr("filetype");
       var fileId = formObj.attr("file-id");
	   var user_id = $("input[name=user_id]").val();
	   if($("input[name=user_id]").length<=0){
	   		user_id="";
	   }
	   var data = {"is_attachment":(fileType=="img"?0:1),"user_id":user_id};
       fileObj.uploadify({
            uploader 	 : '/attachment/upload',
            fileObjName  : "fileData",
			formData     : data,
            buttonImage  : fileType=="img"?'/images/image_upload.png':'/images/attachment.png',
            swf      	 : '/js/uploadify.swf',
            width    	 : 42,
            height   	 : 13,
            fileSizeLimit: '10MB',
            multi    	 : fileType=="file"&&ifComment==false?true:false,
            queueSizeLimit: ifComment||fileType=="img"?1:5,
            //uploadLimit  : ifComment||fileType=="img"?1:5,
            fileTypeDesc : fileType=="img"?'*.jpg;*.gif;*.png;*.JPG;*.PNG;*.GIF;*.jpeg;*.JPEG':'*.jpg;*.gif;*.png;*.JPG;*.PNG;*.GIF;*.jpeg;*.JPEG;*.bmp;*.BMP;*.zip;*.ZIP;*.rar;*.RAR;*.doc;*.DOC;*.docx;*DOCX;*.txt;*.TXT;.*.pages;*.PAGES;*.wps;*.WPS;*.PDF;*pdf;*.xls;*.XLS;*.xlsx;*.XLSX;*.ET;*.et;*.numbers;*.NUMBERS;*.PPT;*.ppt;*.pptx;*.PPTX;*.PPS;*.pps;*.PPSX;*.ppsx;*.dps;*.DPS;*.KEYNOTE;*.keynote;*.iso;*.ISO;*.dmg;*.DMG;*.img;*.IMG;*.mp3;*.MP3;*.WMA;*.wma;*.wav;*.wav;*.avi;*.AVI;*.RMVB;*.rmvb;*.rm;*.RM;*.ASF;*.asf;*.mpg;*.MPG;*.MPEG;*.mpeg;*.wmv;*.WMV;*.MP4;*.mp4;*.mov;*.MOV;*.MKV;*.mkv;*.dat;*.DAT;*.RP;*.rp;*.XMIND;*.xmind;*.mm;*.MM;*.TORRENT;*.torrent',
            fileTypeExts : fileType=="img"?'*.jpg;*.gif;*.png;*.JPG;*.PNG;*.GIF;*.jpeg;*.JPEG':'*.jpg;*.gif;*.png;*.JPG;*.PNG;*.GIF;*.jpeg;*.JPEG;*.bmp;*.BMP;*.zip;*.ZIP;*.rar;*.RAR;*.doc;*.DOC;*.docx;*DOCX;*.txt;*.TXT;.*.pages;*.PAGES;*.wps;*.WPS;*.PDF;*pdf;*.xls;*.XLS;*.xlsx;*.XLSX;*.ET;*.et;*.numbers;*.NUMBERS;*.PPT;*.ppt;*.pptx;*.PPTX;*.PPS;*.pps;*.PPSX;*.ppsx;*.dps;*.DPS;*.KEYNOTE;*.keynote;*.iso;*.ISO;*.dmg;*.DMG;*.img;*.IMG;*.mp3;*.MP3;*.WMA;*.wma;*.wav;*.wav;*.avi;*.AVI;*.RMVB;*.rmvb;*.rm;*.RM;*.ASF;*.asf;*.mpg;*.MPG;*.MPEG;*.mpeg;*.wmv;*.WMV;*.MP4;*.mp4;*.mov;*.MOV;*.MKV;*.mkv;*.dat;*.DAT;*.RP;*.rp;*.XMIND;*.xmind;*.mm;*.MM;*.TORRENT;*.torrent',
            queueID  	 : fileType=="img"&&ifComment==false?$("div.img-upload-load",formObj):$('div.atta-list',formObj),	//指定进度容器
            itemTemplate : '<div id="${fileID}" class="uploadify-progress" data-id="${instanceID}"><a href="javascript:;" title="删除" rel="${fileID}" class="close">&nbsp;</a> <span class="uploadify-bar-text" style="float:left;"><span class="file-name">${fileName}</span> <span class="gray">(${fileSize})</span> <font id="${fileID}_progress"></font> </span><span class="errormsg"></span><i class="upok-icon">&nbsp;</i><span class="loading-bar"><strong class="uploadify-progress-bar"> </strong> </span></div>',
            
             removeCompleted : fileType=="img"&&ifComment==false?true:false,                                
             onUploadProgress : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
                //$('#'+file.id+' .progress').html("file:"+file+" bytesUploaded:"+bytesUploaded+" bytesTotal:"+bytesTotal+" totalBytesUploaded"+totalBytesUploaded+" totalBytesTotal+"+totalBytesTotal);
                $('#'+file.id+'_progress').html(parseInt(bytesUploaded*100/bytesTotal)+"%");
                //小文件，完成进度100%。
            },
            onUploadSuccess : function(file, data, response) {
                  formObj.find("#"+file.id+" .uploadify-progress-bar").css("width","100%");
                  formObj.find('#'+file.id+'_progress').html("100%");
				  try{
				  	var db = $.parseJSON(data);
				  }catch(e){
				  	var db = "";
				  }
				 
				  if(db==""||db.state != 0){
					if(db == "")db.msg = "上传失败";
				  	if(fileType=="img"&&ifComment==false){
						$("div.action-error-msg",formObj).show().find(".msg").html(db.msg);
						$("div.action-error-msg",formObj).find("a.close").show();
						//comment.imgReLoad($("div.action-error-msg",formObj).find("span.reload-file>input"));
					}else{
						var currentBarObj = $("div#"+file.id,formObj);
						currentBarObj.find("i.upok-icon").hide();
						currentBarObj.find("span.loading-bar").hide();
						if(db==""){
							currentBarObj.find(".errormsg").html("文件上传失败！").show();
						}else{
							currentBarObj.find(".errormsg").html(db.msg).show();
						}
						currentBarObj.find("a.close").show();
					}
					if(ifComment==true){
						comment.imgUploadDisable($("#"+fileId+"_img"));
						comment.imgUploadDisable($("#"+fileId+"_file"));
					}else{
						if(fileType=="img"){
							comment.imgUploadDisable($("#"+fileId+"_"+fileType));
						}	
					}
					return ;
				  }
				  comment.attachValue($("input[name=attach_ids]",formObj),db.msg.id,"add");
			
                  if(fileType=="img"&&ifComment==false){
					  comment.textDefault($("textarea.text-div",formObj),"分享图片");
                    // alert(data);
                     comment.getImgOffset(db.msg.tmp_path, function(size){
                        var calculateImg = comment.calculateSize(size.width, size.height, 200, 200);
                        $("div.img-attach",formObj).show();
                        $("div.img-upload-load",formObj).hide();
                        $("div.img-attach",formObj).append($("<img width='"+calculateImg[0]+"' height='"+calculateImg[1]+"' src='"+db.msg.tmp_path+"' />"));
						if($("div.img-attach",formObj).children("a.close").length>0){
							$("div.img-attach",formObj).children("a.close").attr("close-id",db.msg.id).show();
						}
                     });
                      comment.imgUploadDisable($("#"+fileId+"_img"),true);
                  }else{
                     var currentBarObj = formObj.find("#"+file.id);
                     currentBarObj.find("a.close").attr("filetype",fileType).attr("close-id",db.msg.id).attr("ifcomment",ifComment).show();
                     currentBarObj.find("span.loading-bar").hide().find("strong").css({width:"0"});
                     currentBarObj.find("i.upok-icon").show();
                      if(ifComment == true){
                         comment.imgUploadDisable($("#"+fileId+"_img"),true);
						 comment.imgUploadDisable($("#"+fileId+"_file"),true);
						 if(fileType=="img"){
							//comment.textDefault($("textarea.text-div",formObj),"分享图片");
							var fileNameObj = currentBarObj.find(".file-name");
						 	fileNameObj.html("<a target='_blank' href='"+db.msg.tmp_path+"'>"+fileNameObj.html()+"</a>");
							fileNameObj.find("a").mouseover(comment.showCommentImg);
						 }else{
						 	//comment.textDefault($("textarea.text-div",formObj),"分享文件");
						 }
                     }else{
                           if($("div.atta-list",formObj).find("div.uploadify-progress").length>=5){
								comment.imgUploadDisable($("#"+fileId+"_file"),true);
						   }
						   comment.textDefault($("textarea.text-div",formObj),"分享文件");
                     }
                  }
                  //$(".attach-video",formObj).addClass("video-disable");
                  //comment.imgUploadDisable($("#"+fileId+"_file",formObj),true);
            },
            onUploadError : function(file, errorCode, errorMsg, errorString) {
                if(fileType=="img"&&ifComment==false){
                    $("div.action-error-msg",formObj).show().find(".msg").html("上传失败，");
                }else{
                     var currentBarObj = $("div#"+file.id,formObj);
                     currentBarObj.find("i.upok-icon").hide();
                     currentBarObj.find("span.loading-bar").hide();
                     currentBarObj.find(".errormsg").html("上传失败，请删除后重新上传!").show();
                }
				if(ifComment==true){
					comment.imgUploadDisable($("#"+fileId+"_img",formObj));
					comment.imgUploadDisable($("#"+fileId+"_file",formObj));
				}else{
					if(fileType=="img"){
						comment.imgUploadDisable($("#"+fileId+"_"+fileType,formObj));
					}	
				}
                //alert('The file ' + file.name + ' could not be uploaded: ' + errorString);
            },
            onDialogClose : function(queue) {
                $("div.attach-box",formObj).show();
                if(fileType=="img"){
                    $("div.img-upload-load",formObj).show();
                }
                return false;
            },
			onUploadStart:function(){
				if(ifComment==true){
					comment.imgUploadDisable($("#"+fileId+"_img"),true);
					comment.imgUploadDisable($("#"+fileId+"_file"),true);
				}else{
					if(fileType=="img"){
						comment.imgUploadDisable($("#"+fileId+"_"+fileType),true);
					}	
				}
				formObj.find("input[type=submit]").attr("disabled",true);
				
			},
			onQueueComplete:function(){
				formObj.find("input[type=submit]").attr("disabled",false);
			}
        });       
   },
   textDefault:function(textObj,text){
	   var value = $.trim(textObj.val());
	   var fix = value.substr(0,4);
	   var ifDelete = arguments[2]?true:false;
	   if(ifDelete){
		   if(value=="分享图片"||value=="分享文件"){
		   		textObj.val("");
				textObj.blur();
		   }else{
		   		if(fix==$.trim(text)){
					value = value.replace(fix,"");
					textObj.val(value);
		   		}
		   }
	   }else{
		   if(value==""){
				textObj.val(text);
				textObj.focus();
				comment.setCursorPosition(textObj.get(0),{start:textObj.val().length,end:textObj.val().length});
		   }
	   }
   },
   attachValue:function(hideObj,val,type){
	   var value = hideObj.val();
	   var valueArr = [];
	   if($.trim(value)!=''){
	   		valueArr = value.split(",");
	   }
	   if(type=="add"){
	  		valueArr.push(val);
	   }else{
			var leng = valueArr.length;
			if(leng>0){
				for(var i =0; i<leng;i++){
					if($.trim(val)==$.trim(valueArr[i])){
						valueArr.splice(i,1);
					}
				}
		    }
	   }
	   hideObj.val(valueArr.join(","));
   },
   attachVideo:function(currentObj,formObj){
       if(currentObj.className.indexOf("video-disable")>-1){
            return;
       }else{
          var fileId = formObj.attr("file-id");
          $(currentObj).addClass("video-disable");
          comment.imgUploadDisable($("#"+fileId+"_img",formObj),true);
          comment.imgUploadDisable($("#"+fileId+"_file",formObj),true);
          
          var showObj = formObj.find("div.post-video-box").show();
          showObj.find("div.add-video").show();
          comment.inputTopic(showObj.find("input[type=text]").get(0));
          showObj.find("input[type=button]").click(function(){
              var button = $(this);
              button.attr("disabled",true);
              $.get(button.attr("video-url"),{url:showObj.find("input[type=text]").val()},function(data){
                  button.attr("disabled",false);
                  if($.trim(data)!=''){
                      if(data=="-1"){
                          
                      }else{
                          formObj.find("div.add-video").hide();
                          formObj.find("div.show-video").html(data).show();
                          
                      }
                  }
              })
          }); 
       }
   },
   attachGroup:function(groupObj,textObj){
       var formObj = $(textObj).closest("form");
       var grouplistObj = $("div.group-list",formObj);
       var attachBox = $("div.attach-box",formObj);
	   if(groupObj.isPrivate=="1"){
	   		attachBox.show();
			attachBox.find(".action-error-msg").show().find(".msg").html("因为@了私密群所以本信息将只有被@的人可以看见");
			attachBox.find(".action-error-msg").find("a.close").show();
	   }
       /*var  obj = $('<div class="gl-list"><a href="javascript:;" id="'+groupObj.id+'" class="close" title="关闭">&nbsp;</a><div class="group-message"><a href="">'+groupObj.name+'</a><p>'+groupObj.other+'</p></div><a href=""><img  src="http://img.f2e.taobao.net/all.png_35x35.jpg" /></a></div>');
	   
       attachBox.show();
       grouplistObj.show();
       obj.appendTo(grouplistObj);
	   obj.find("a.close").show();
	   comment.attachValue(formObj.find("input[name=group_ids]"),groupObj.id.replace("group_",""),"add");*/
       
 },
 attachmentBindEvent:function(attachObj){
       if(attachObj&&attachObj.length>0&&attachObj.attr("bind")!="1"){
           var formObj = attachObj.parents("form");
           var faceBox = $("span.attach-face",attachObj);
           var imgBox = $("span.attach-img",attachObj);
           var fileBox = $("span.attach-attachment",attachObj);
           var videoBox = $("span.attach-video",attachObj);
           var topicBox = $("span.attach-topic",attachObj);
           var ifComment = attachObj.attr("comment")=="1"?true:false;
           var fileId = Math.random().toString().replace(".","_");
           formObj.attr("file-id",fileId);
           if(faceBox.length>0){
               faceBox.showFace();
           }
           if(imgBox.length>0){
               var fileObj = $("<input filetype='img' id='"+fileId+"_img' type='file' />");
               imgBox.append(fileObj);
               comment.uploadFile(fileObj,formObj,ifComment);
           }
           if(fileBox.length>0){
               var fileObj = $("<input filetype='file' id='"+fileId+"_file' type='file' />");
               fileBox.append(fileObj);
               comment.uploadFile(fileObj,formObj,ifComment);
           }
           if(videoBox.length>0){
               $(".attach-video").click(function(){
                    comment.attachVideo(this,formObj);
               });
           }
           if(topicBox.length>0){
               topicBox.showTopic();
           }
		   if(formObj.length>0){
		   		formObj.unbind("submit").submit(comment.formSubmit);
				formObj.keydown(function(e){
					if(e.ctrlKey&&e.keyCode=="13"){
						formObj.trigger("submit");
					}
				});
		   }
           attachObj.attr("bind","1");
       }
       
   },
   formSubmit:function(event){
	   if(window.event) { event.returnValue = false; } else { event.preventDefault();}
	   var formObj = $(this);
	   var buton = formObj.find("input[type=submit]");
	   var textObj = $.trim(formObj.find("textarea").val());
	   var attachObj = formObj.find("div.attachment");
	   var ifComment = attachObj.attr("comment")>0?true:false;
	   var ifRepeat = false;
	   var attachIds = $.trim(formObj.find("input[name=attach_ids]").val());
	   if(formObj.attr("repeat")&&formObj.attr("repeat")=="1"){
	   		ifRepeat = true;
	   }
	   if(attachIds==""||ifComment==true){
		   if($.trim(textObj)==''&&ifRepeat==false){
				$("div.action-error-msg",formObj).find("a.close").show();
				if(ifComment==true){
					$("div.action-error-msg",formObj).show().find(".msg").html("回复内容不能为空！");
					$("div.action-error-msg",formObj).show().find("a.close").show();
				}else{
					$("div.action-error-msg",formObj).show().find(".msg").html("发布的信息不能为空！");
					$("div.action-error-msg",formObj).show().find("a.close").show();
				}
				$("div.action-error-msg",formObj).show().find("a.close").show();
				$("div.attach-box",formObj).show();
				return false;
		   }
	   }
	   if(ifComment||ifRepeat){
		   if(comment.getLength(textObj)>140){
			    $("div.action-error-msg",formObj).find("a.close").show();
				$("div.action-error-msg",formObj).show().find(".msg").html("回复信息不能超过140个字！");
				$("div.attach-box",formObj).show();
				return false;
		   }
	   }else{
		   if(comment.getLength(textObj)>500){
			    $("div.action-error-msg",formObj).find("a.close").show();
				$("div.action-error-msg",formObj).show().find(".msg").html("发布的信息不能超过500个字！");
				$("div.action-error-msg",formObj).show().find("a.close").show();
				$("div.attach-box",formObj).show();
				return false;
		   }
	   }
	   buton.attr("disabled",true);
	   $.post(formObj.attr("action"),formObj.serialize(),function(data){
			buton.attr("disabled",false);
			try{
				var data = eval("("+data+")");
			}catch(e){
				var data = '';
			}
			if(data != ""){
				if(data.state!=0){
					$("div.action-error-msg",formObj).show().find(".msg").html(data.msg);
					$("div.action-error-msg",formObj).show().find("a.close").show();
					$("div.action-error-msg",formObj).parent().show();
					$("div.attach-box",formObj).show();
				}else{
					
					if(ifRepeat){
						//comment.msgBox("转发成功。");
						$("#forward-pob").dailogClose();
						if($("div.detail-main-content").length>0||$(".no-add-list").length>0){
							comment.msgBox("转发成功。");
							return;
						}
						comment.listAddNewMessage(data.msg);
						return ;
					}
					if(ifComment){
						//comment.msgBox("评论成功。");
						comment.setCommentNumber(formObj);
						comment.commetnAddList(data.msg,formObj);
					}else{
						//comment.msgBox("发布成功。");
						comment.listAddNewMessage(data.msg);
					}
					comment.clearText(formObj);
				}
			}else{
				comment.msgBox("系统超时，请稍后重试！","error");
			}
										  
	   });
	   return false;
   },
   setCommentNumber:function(formObj){
	   var type = arguments[1]&&arguments[1]==true?true:false;
	   var commentNumObj = formObj.closest("li").find("span.comment-number");
	   var number = parseInt(commentNumObj.text()); 
	   if(commentNumObj.length<=0){
			return false;
	   }
   	   if(type == true){
	   		number--;
	   }else{
	   		number++;
	   }
	   if(isNaN(number)||number<0){
		   	number = 0;
	   }
	   commentNumObj.text(number);
   },
   listAddNewMessage:function(msg){
	   if(msg != ""){
	   		var listObj = $("<ul>"+msg+"</ul>");
			listObj =  listObj.find("li");
			var ulObj = $("#main-msg");
			if(listObj.length>0){
				listObj.css("display","none");
				listObj.prependTo(ulObj);
				listObj.slideDown();
				listObj.each(comment.bindLiEvent);
				if(listObj.find("dt").length>0){
					listObj.find("dt").each(comment.bindReplyLi);
				}
			}
			
	   }
   },
   commetnAddList:function(data,formObj){
	   var listObj = formObj.closest("div.com-list-box").find(".comment-list");
	   var dataObj = $("<dl>"+data+"</dl>");
	   if(listObj.length<=0){
	   		var listObj = $("<dl class=\"comment-list\"></dl>");
			listObj.prependTo(formObj.closest("div.com-list-box"));
	   }
	   dataObj = dataObj.find("dt");
	   dataObj.css("display","none");
	   dataObj.appendTo(listObj);
	   dataObj.each(function(){
	   		comment.bindReplyLi.call(this);
	   });
   	   dataObj.slideDown();
   },
   bindLiEvent:function(){
	    var imgWidth = 440;
	    if($(this).attr("img-width")&&$(this).attr("img-width")>0){
			imgWidth = $(this).attr("img-width");
		}
   		$(".text-area",$(this)).focus(comment.showText);
		$(".text-area",$(this)).each(comment.inputTopic);
		$("a.comment-link",$(this)).click(comment.commentLinkTrigger);
		$(".image-wrapper",$(this)).imgRotate({maxWidth:imgWidth});
		$("a.list-img",$(this)).showUserCard({clickFunction:comment.attention,getUrl:"/userinfo"});
		$("a.forward").unbind("click").click(comment.pobForward);
		$("a.forward-list",$(this)).click(comment.showForwardList);
		$(".li-more-comment",$(this)).click(comment.showMoreComment);
		if($(".li-more-group",$(this)).length>0){
			$(".li-more-group",$(this)).toggle(function(){
				var overObj = $(this).parent();
				var height = overObj.children(".li-topic").length*(parseInt(overObj.children(".li-topic").eq(0).height())+5);
				overObj.animate({height:height},200);
				$(this).find("i").get(0).className = "more-icon-down";
			},function(){
				var overObj = $(this).parent();
				overObj.animate({height:60},200);
				$(this).find("i").get(0).className = "more-icon";
			});
		}
		$(this).hover(function(){ $(this).children("a.close").show()},function(){$(this).children("a.close").hide()});
		
		$(this).children("a.close").click(comment.delCommentMessage);
   },
   bindReplyLi:function(){
   		$("a.reply-link",$(this)).click(comment.replyFocus);
		$("a.list-img",$(this)).showUserCard({clickFunction:comment.attention,getUrl:"/userinfo"});
		$(this).hover(function(){ $(this).children("a.close").show()},function(){var closeObj = $(this).children("a.close");$(this).children("a.close").hide()});
		$("a.comment-img",$(this)).mouseover(comment.showCommentImg);
	    $(this).children("a.close").click(comment.delCommentMessage);
   },
   showCommentImg:function(){

  		var curretnObj = $(this);
		var this0 = this;
		var offsets = curretnObj.offset(),left,top;
		var floatObj = $("#float-comment-id");
		var src = this.href;
		left = offsets.left;
		top = offsets.top;
		if(floatObj.length<=0){
			floatObj =  $("<div id='float-comment-id' class='comment-float-img'></div>");
			floatObj.appendTo($("body"));
		}
		var hideFloat = function(){
			if(this0.timeout&&this0.timeout>0){
				return;
			}
			this0.timeout = setTimeout(function(){
				floatObj.hide();								
			},300);
		}
		curretnObj.mouseout(hideFloat);
		comment.getImgOffset(src,function(size){
			var getSize = comment.calculateSize(size.width,size.height,500,500);
			floatObj.html("<img src='"+src+"' width='"+getSize[0]+"' height='"+getSize[1]+"' />");
			floatObj.show();
			clearTimeout(this0.timeout);
			this0.timeout = -1;
			top =  ((top+floatObj.height())>$(window).scrollTop()+$(window).height())&&(floatObj.height()+curretnObj.height())<top?top-floatObj.height()-curretnObj.height():top+19;
			floatObj.css({left:left,top:top});
			floatObj.mouseover(function(){
				clearTimeout(this0.timeout);
				this0.timeout = -1;
				floatObj.show();
			});
			floatObj.mouseout(hideFloat);
		});
		
		
   },
   replyFocus:function(){
	   var this0 = $(this);
	   var formObj = this0.closest("div.com-list-box,li.commenttome").find("form");
	   var textObj = formObj.find("textarea.text-area");
	   var postObj = this0.closest("div.com-list-box,li.commenttome").find("div.list-action-box");
	   if(postObj.get(0)&&postObj.get(0).style.display=="none"){
	   		postObj.show();
	   }
	   textObj.val(this0.attr("rel")).focus();
	   comment.setCursorPosition(textObj.get(0),{start:textObj.val().length,end:textObj.val().length});
	   
   },
   commentLinkTrigger:function(){
		var liObj = $(this).closest("li");
		liObj.find("textarea.text-area").trigger("focus");
   },
   showText:function(){
   		var currentText = $(this);
		var formObj = currentText.closest("form");
		var attachObj = formObj.find("div.attachment");
		var ifComment = attachObj.attr("comment")=="1"?true:false;
		var ifRe = formObj.attr("repeat")==1?true:false;
		var sys = comment.getSys();
		
		comment.attachmentBindEvent(attachObj);
		//comment.textareaHeight(currentText);
		
		if(!ifComment){
			if($.trim(currentText.val())==""||(currentText.attr("text-content")&&$.trim(currentText.attr("text-content"))!="")){
				currentText.animate({height:80},500,function(){
					currentText.autoTextarea({minHeight:80});
				});
			}
			currentText.textArrayFloat({userUrl:"/autoprompt",topicUrl:"/autoprompt"});
			//currentText.textArrayFloat({userUrl:"/html/atgorup.php",topicUrl:"/autoprompt"});
 		}else{
			if(ifRe){
				currentText.textArrayFloat({userUrl:"/autoprompt"});
			}else{
				currentText.textArrayFloat({userUrl:"/autoprompt?type=reply"});
			}
			currentText.autoTextarea();
		}
		
		$("div.attach-box",formObj).unbind("click").click(comment.attachClose);
		if(!ifRe){
			formObj.find("a.clear-text,input.clear-text").show().unbind("click").click(comment.clearText);
		}else{
			formObj.find("a.clear-text,input.clear-text").show().unbind("click").click(function(){
				formObj.find("textarea").blur();
				formObj.find("a.clear-text").hide();
				formObj.find("textarea,input[name=attach_ids]").val("");
				formObj.find("textarea").animate({height:18});
				formObj.find("textarea").blur();
				attachObj.slideUp();
			});
		}
		attachObj.slideDown();
   },
   clearText:function(){
	    if(arguments[0]&&arguments[0].length>0){
			var formObj = arguments[0];
		}else{
			var currentObj = $(this);
			var formObj = currentObj.closest("form");
		}
		var ifRe = formObj.attr("repeat")==1?true:false;
		var attachObj = formObj.find("div.attachment");
		var textAreaObj = formObj.find("textarea");
		
		if(textAreaObj.attr("text-content")&&$.trim(textAreaObj.attr("text-content"))!=""){
			textAreaObj.val(textAreaObj.attr("text-content"));
			formObj.find("input[name=attach_ids]").val("");
			textAreaObj.blur();
		}else{
			formObj.find("textarea,input[name=attach_ids]").val("");
			formObj.find("textarea").blur();
		}
		formObj.find("a.clear-text").hide();
		formObj.find("textarea").animate({height:18});
		formObj.find("div.action-error-msg").hide();
		formObj.find("div.img-upload-load").hide();
		formObj.find("div.attach-box").hide();
		attachObj.slideUp();
		if(!ifRe){
			formObj.find("div.attach-box").find("a.close").each(function(){
				if($(this).closest(".img-attach").length>0){
					if($(this).closest(".img-attach").find("img").length>0){
						$(this).trigger("click");
					}
				}else if($(this).closest(".atta-list").length>0){
					$(this).trigger("click");
				}
			});
		}
   },
   newMessageTime:false,
   getNewMessage:function(){
   		if(comment.newMessageTime == false){
			comment.newMessageTime = setInterval(comment.getNewMessage,60000);
			comment.getNewMessage();
		}else{
			$.get("/msglist/tips?time="+Math.random(),{since_id:$("#main-msg").find("li").eq(0).attr("id")},function(data){
				try{
					data = eval("("+data+")");
				}catch(e){
					data = "";
				}
				if(data != ""){
					if(data.state==0){
						if(data.msg.newnotice.number>0){
							$("#new-more-msg").show();
							$("#new-more-msg").find("span").text(data.msg.newnotice.number);
							$("#new-more-msg").unbind("click").click(function(){comment.getNewMessgeList(data.msg.newnotice,this);});
						}
						if(data.msg.notification>0){
							$("#top-tips").html(data.msg.notification);
							$("#top-tips").show();
						}else{$("#top-tips").hide();}
					}
				}
			});
		}
   },
   getNewMessgeList:function(datas,obj){
	    var getUrl = "/notice/more";
		if($(obj).attr("get-url")&&$(obj).attr("get-url")!=""){
			getUrl  = $(obj).attr("get-url");
		}
		if($(obj).attr("get-ajax")=="1"){
			return false;
		}
		$(obj).attr("get-ajax","1");
   		if(datas){
			$.get(getUrl+"?time"+Math.random(),{since_id:datas.since_id,number:datas.number},function(data){
				$(obj).attr("get-ajax","0");
				if(data != ""){
					try{
						data = eval("("+data+")");
					}catch(e){
						data = "";
					}
					if(data != ""){
						$("#new-more-msg").fadeOut();
						if(data.state==0){
							comment.listAddNewMessage(data.msg);
						}else{
							comment.msgBox(data.msg,"errror");
						}
					}else{
						comment.msgBox("系统超时，请稍后重试！","error");
					}
				}
			});
		}
   },
   loadInterestMember:function(){
	    var number = 3;
   		if(arguments[0]&& typeof arguments[0] == "number"){
			number = 1;
			var currentObj = arguments[1];
		}else{
			var this0 = this;
			$(this).addClass("reseat-load");
		}
                
		var userIds = new Array();
		var strUserIds = '';
		$("#reseat-box li").each(function(){
			var userId = $(this).attr('user-id');
			strUserIds += ","+userId;
		});
        if($.loadInterestMember == true){
			return ;
		} 
		$.loadInterestMember = true;
		$.get("/interest",{number:number,not_display_user_ids:strUserIds},function(data){
			$.loadInterestMember = false;
			try{
			   data = eval("("+data+")"); 
			}catch(e){
			   data = ""; 
			}
			if(data != ''){
				if(data.state == 0){
					dataObj = $("<ul>"+data.msg+"</ul>");
					dataObj = dataObj.find("li");
					dataObj.css("opacity","0");
					if(number==1){
						currentObj.animate({opacity:0},function(){
							dataObj.replaceAll($(this));
							dataObj.animate({opacity:1});
						});
                    }else{
						$(this0).removeClass("reseat-load");
						var length = dataObj.length;
						var j = length-$("#reseat-box").find("li").length;
						$("#reseat-box").find("li").animate({opacity:0},function(){
							var i = $(this).index();
							dataObj.eq(i).replaceAll($(this));
							dataObj.eq(i).animate({opacity:1});
						});
						while(j>0){
							dataObj.eq(3-j).appendTo($("#reseat-box"));
							dataObj.eq(3-j).animate({opacity:1});
							j--
						}
						/*while(length>-1){
							dataObj.eq(length).appendTo($(this));
							dataObj.eq(length).animate({opacity:1});
							length--;
						}*/
					}
					dataObj.each(function(){
						$("a.list-img",$(this)).showUserCard({clickFunction:comment.attention,getUrl:"/userinfo"});
					});
				}else{
                                     comment.msgBox(data.msg, "error");
                                }
			}else{
                            comment.msgBox("系统超时，请稍后重试！", "error");
                        }
		});
   },
   tabChecked:function(tabId,contentId){
   		var tabObj = $("#"+tabId);
		var contentObj = $("#"+contentId);
		//var lineLength = tabObj.children(".line-span").length;
		tabObj.click(function(e){
			var targetObj = e.target;
			if(targetObj.tagName.toUpperCase() == "SPAN"&&targetObj.className.indexOf("line-span")<0){
				var index = $(targetObj).index();
				if(index>0)index--;
				tabObj.children(".current").removeClass("current");
				contentObj.children().hide();
				contentObj.children().eq(index).slideDown();
				targetObj.className = "current";
			}
		});
   },
   inputTopic:function(){
        var intpObj = this;
        if(arguments[0]&&typeof arguments[0] =="object"){
            intpObj = arguments[0];
        }
        var message = '请输入关键字！';
        var offect = $(intpObj).offset();
        var heights = $(intpObj).height();
        var id = '';
        if(this.id==''){
                id = Math.random();
                id = id.toString().substr(id.toString().indexOf(".")+1);
                intpObj.id = id;
                id = id+'_span';
        }else{
                id = intpObj.id+"_span";
        }
        if($(intpObj).attr("topic")&&$(intpObj).attr("topic")!=''){
            message = $(intpObj).attr("topic");
        }

        if($("#"+id).length<1){
                var topicObj = $("<font id='"+id+"' class='search-topic'>" + message + "</font>");
                topicObj.appendTo($(intpObj).parent());
                $(intpObj).parent().css("position","relative");
        }else{
                topicObj = 	$("#"+id);
        }
        topicObj.css({ left:  (offect.left-$(intpObj).parent().offset().left+5)+ "px", top: (offect.top-$(intpObj).parent().offset().top+parseInt(heights >= 23 ? 4 : 6)) + 'px' });

        if ('' != $.trim(intpObj.value)) {
                topicObj.hide();
        }
        topicObj.click(function () {
                $(intpObj).focus();
                $(this).hide();
        });
        $(intpObj).focus(function () {
                topicObj.hide();
        });
        $(intpObj).blur(function () {
                if ('' == $.trim(this.value)) {
                    topicObj.show();
                }
               
        });
        if ('' == $.trim(intpObj.value)) {
            topicObj.show();
        }
    },
	msgBox:function(msg,type,oTtime) {
	   var typeClass = '';
	   if(arguments[2] == undefined){
			oTtime = 1200;
	   }
	    if(arguments[1] != undefined){
			if(type == "error"){
				typeClass = 'pob-msg-box-error';
			}
	   }
       var msgObj = $('<div class="pob-msg-box '+typeClass+'"><div class="msg-right-box">'+msg+'</div></div>');
	   msgObj.appendTo('body');
	   var page = comment.getPageSize();
	   var getScroll = comment.getScrollXY();
	   var left = (page.clientWidth-msgObj.width())/2+parseInt(getScroll[0]);
	   var top = (page.clientHeight-msgObj.height())/2+parseInt(getScroll[1]);
	   msgObj.css({top:top+'px',left:left+'px'});
	   setTimeout(function(){msgObj.animate({opacity:100},1500).remove();},oTtime);
    },
    getLength:function(str) {
        var reg = /(?:http|https):\/\/[A-Za-z0-9\.\?\&\=_\#\[\]\*\+\-\(\)\%\@]+(?:\/[^\s]*\s?|[^\u4e00-\u9fa5])/g;
        /*var regexp = new RegExp("(http://)+(([-A-Za-z0-9]+(.[-A-Za-z0-9]+)*(.[-A-Za-z]{2,5}))|([0-9]{1,3}(.[0-9]{1,3}){3}))(:[0-9]*)?(/[-A-Za-z0-9_$.+!*(),;:@&=?/~#%]*)*", "gi");*/
        var len = $.trim(str).length;
        if (len > 0) {
            var min = 41,
            max = 140,
            tmp = str;
            var urls = str.match(reg) || [];
            var urlCount = 0;
            for (var i = 0,len = urls.length; i < len; i++) {
                var count = comment.byteLength(urls[i]);
                if (count > min) {
                    urlCount += count <= max ? 21 : (21 + (count - max) / 2);
                }
                tmp = tmp.replace(urls[i], "");
            }
            return Math.ceil(urlCount + comment.byteLength(tmp) / 2)
         } else {
            return 0
         }
    },
    byteLength:function(str){
        if (typeof str == "undefined") {
                return 0
        }
        var aMatch = str.match(/[^\x00-\x80]/g);
        return (str.length + (!aMatch ? 0 : aMatch.length));
    },
    attention:function(e,obj){
        var tarGet = e.target;
        if(tarGet.tagName.toUpperCase() == "INPUT"){
            if(tarGet.value == "关注"){
			   var attentionType = $(tarGet).attr("attetype");
               var userId = $(tarGet).attr("user-id");
			   if($(tarGet).attr("ifPost")!="1"){
				   $(tarGet).attr("ifPost","1");
 				   $.get("/subscribed/follow",{subscribed:userId},function(data){
 						try{
						   data = eval("("+data+")"); 
						}catch(e){
						   data = "";
						}
				   		if(data!=""){
							if(data.state == 0){
								if($(tarGet).attr("atten-type")=="card"){
									$(tarGet).attr("ifPost","");
                                	var dataObj = $("<div class='float-u'>"+obj.datas+"</div>");
									dataObj.find("input").parent().html("已关注");
									$(tarGet).parent().html("已关注");
									obj.datas = dataObj.html();
								}else{
									comment.loadInterestMember(1,$(tarGet).closest("li"));
								}
								
							}else{
								$(tarGet).attr("ifPost","");
                                comment.msgBox(data.msg, "error");
							}
						}else{
							$(tarGet).attr("ifPost","");
                            comment.msgBox("系统超时，请稍后重试！", "error");
                        }
				   });
			   }
            } else if(tarGet.value == "加入" || tarGet.value == "申请加入" ){
                var groupId = $(tarGet).attr('group-id');
				if(tarGet.ifPost == true){
					return;
				}
				tarGet.ifPost = true;
                $.post(
                    '/group/addmember',
                    {group_id:groupId},
                    function(response){tarGet.ifPost = false;
                        if(response.state == -1){
                           comment.msgBox(response.msg,"error");
                        } else {
                            //comment.msgBox(response.msg);
							if($(tarGet).attr("add-type")=="list"){
								if(tarGet.value == "加入"){
									window.location.href = "/group/"+groupId;
								}else if(tarGet.value == "申请加入"){
									var aImgObj = $(tarGet).closest("div.group-li").find("a.show-card");
									$(tarGet).parent().html('<a class="button-joingg" href="javascript:;">申请已提交</a>');
									if(aImgObj.get(0)!= undefined){
										aImgObj.get(0).datas='';
									}
								}
								
							}else{
								if(tarGet.value == "加入"){
									var dataObj = $("<div class='float'>"+obj.datas+"</div>");
									var topicHtml = '<a class="button-havegg" href="javascript:;">已加入</a> <input type="button" class="small-gray-button ml-5" group-id="'+groupId+'" value="退出" />';
									dataObj.find("input").parent().html(topicHtml);
									$(tarGet).parent().html(topicHtml);
									obj.datas = dataObj.html();
								}else if(tarGet.value == "申请加入"){
									var dataObj = $("<div class='float'>"+obj.datas+"</div>");
									var topicHtml = '<a class="button-joingg" href="javascript:;">申请已提交</a><span class="mt-10 ml-5">等待群主审批</span>';
									dataObj.find("input").parent().html(topicHtml);
									$(tarGet).parent().html(topicHtml);
									obj.datas = dataObj.html();
								}else{
									
								}
							}
                           // window.location = window.location;
                        }
                    },
                    'json'
                );
            } else if(tarGet.value == "退出"){//allow_all deny_all need_check  
                var groupId = $(tarGet).attr('group-id');
				if(tarGet.ifPost==true){
					return ;
				}
				tarGet.ifPost = true;
                $.post(
                    '/group/exitgroup',
                    {group_id:groupId},
                    function(response){tarGet.ifPost = false;
                        if(response.state == -1){
                            comment.msgBox(response.msg,"error");
                        } else {
                            //comment.msgBox(response.msg);
							var dataObj = $("<div class='float'>"+obj.datas+"</div>");
							//var actionBox = dataObj.find("input").parent();
							if($(obj).attr("memberjoin")=="need_check"){
								var html = '<input type="button" value="申请加入" group-id="'+groupId+'" class="gren-button" />';
							}else{
								var html = '<input type="button" value="加入" group-id="'+groupId+'" class="gren-button" />';
							}
							dataObj.find("input").parent().html(html);
							$(tarGet).parent().html(html);
							obj.datas = dataObj.html();
                            //window.location = window.location;
                        }
                    },
                    'json'
                );
                
            }else{
               //tarGet.value = "关注"; 
            }
        }
    },
    commentListArr :[],
    showMoreComment:function(){
        var this0 = $(this);
		var _this = this;
        var getUrl = this0.attr("data-url");
        var iconObj = this0.find("i").get("0");
        var comentList = this0.next("div.com-list-box");
		var oldDt = comentList.find("dt");
        if(iconObj.className.indexOf("more-icon-hide")>-1){
		/*	if(comentList.find("dl").length<=2){
				return false;
			}*/

           //comentList.find("dt[new-data=1]").slideUp();
		   var dataLi = comentList.find("dt[new-data=1]");
		   var le = dataLi.length;
		   var time = Math.ceil(400/le);
		   var i = 0;
           
		   var upAction = function(obj){
				obj.slideUp(time,function(){
					i++;
					if(i<le){
						upAction(dataLi.eq(i));
						if(i==le-1){
							iconObj.className = "more-icon";
							_this.action = false;
						}
					}
					obj.remove();
				});
			}
			if(_this.action==true){
				return ;
			}
			if(le>0){
				_this.action = true;
				upAction(dataLi.eq(i));
			}
        }else{
            var showList = function(data){
                var lisObj = $("<div>"+data+"</div>");
				lisObj = lisObj.find("dt");
				var length = lisObj.length;
                lisObj.css("display","none");
				if(length<=2){
					return false;
				}
				var dlObj = comentList.find("dl");
				var i = 0;
				var time = Math.ceil(400/(length-2));
				var dowonAction = function(obj){
					//obj.prependTo(dlObj);
					obj.attr("new-data","1");
					obj.slideDown(time,function(){
						i++;
						if(i<length-2){
							dowonAction(lisObj.eq(i));
							if(i==length-3){
								iconObj.className = "more-icon-hide";
								_this.action = false;
							}
						}
					});
				}
				dlObj.prepend(lisObj);
				 
				if(_this.action==true){
					return ;
				}
				if(length>2){
					_this.action = true;
					lisObj.eq(length-1).remove();
					lisObj.eq(length-2).remove();
					dowonAction(lisObj.eq(0)); 
				}
                //
				lisObj.each(comment.bindReplyLi);
                //lisObj.attr("new-data",function(i){ if(i<length-2)return "1";else return "";});
                //lisObj.slideDown(100);
				//oldDt.remove();
            }
            
            if(!isNaN(this0.attr("data-id"))){
                showList(comment.commentListArr[this0.attr("data-id")]);
                return ;
            }
			if(this0.attr("get-bind")=="1"){
				return ;
			}
			this0.attr("get-bind","1");
            $.get(getUrl,function(data){
				   this0.attr("get-bind","");
				   try{
				   		data = eval("("+data+")");
				   }catch(e){
				   		data = "";
				   }
                   if(data!= ''){
					   if(data.state==0){
						   showList(data.msg);
						   this0.attr("data-id",comment.commentListArr.length);
						   comment.commentListArr[comment.commentListArr.length] = data.msg;
					   }else{
					   	   comment.msgBox(data.msg,"error");
					   }
                   }
             })
        }
        
    },
    forwardArr:[],
    pobForward:function(){
         var this0 = $(this);
         var getHtmlUrl = this0.attr("data-url");
         var showDailog = function(data){
             var forwardObj = $("#forward-pob");
             if(forwardObj.length<=0){
                 forwardObj = $("<div id='forward-pob' style='display:none;'></div>");
                 forwardObj.appendTo("body");
             }
             forwardObj.html(data);
             forwardObj.dailog({width:500,title:"转发消息"});
			 $("#forward-pob").find("textarea.text-area").each(comment.inputTopic);
             $("#forward-pob").find("textarea.text-area").focus(comment.showText);
			 $("#forward-pob").find("textarea.text-area").focus();
			 //$("#forward-pob").find("form").unbind("submit").submit(comment.formSubmit);
         }
         if(this0.attr("click")!="1"){
             this0.attr("click","1");
             if(!isNaN(this0.attr("data-id"))){
				 	
                    showDailog(comment.forwardArr[this0.attr("data-id")]);
                    this0.attr("click","0");
                    return ;
             }
             $.get(getHtmlUrl,function(data){
					this0.attr("click","0");
				    try{
						data = eval("("+data+")");	
					}catch(e){
						data = "";
					}
                    if(data!= ''){
						if(data.state==0){
							showDailog(data.msg);
							this0.attr("data-id",comment.forwardArr.length);
							comment.forwardArr[comment.forwardArr.length] = data.msg;
						}else{
							comment.msgBox(data.msg,"error");
						}
                    }else{
						comment.msgBox("系统超时，请稍后重试！","error");	
					
					}
              })
         }
         
    },
    forwardListArr:[],
    showForwardList:function(){
		return false;
        /*var this0 = $(this);
         var getListUrl = this0.attr("data-url");
         if(this0.attr("click")!="1"){
             this0.attr("click","1");
             if(!isNaN(this0.attr("data-id"))){
                    $(comment.forwardListArr[this0.attr("data-id")]).floatDailog({referObj:this0});
                    this0.attr("click","0");
                    return ;
              }
             $.get(getListUrl,function(data){
                    if(data!= ''){
                        $(data).floatDailog({referObj:this0});
                        this0.attr("data-id",comment.forwardArr.length);
                        comment.forwardListArr[comment.forwardListArr.length] = data;
                        this0.attr("click","0");
                    }
              })
         }*/
    },
    delCommentMessage:function(){
        var this0 = this;
		var msg = "确定删除该消息?";
		var ifcomment = false;
		if(this0.parentNode.tagName.toUpperCase()=="DT"){
			msg = "确定删除该回复?";
			ifcomment = true;
		}
        comment.confirmFloatBox($(this), msg, function(){
			if($(this0).attr("isDel")=="1"){
				return ;
			}	
			$(this0).attr("isDel","1");
			$.get(this0.rel,function(data){
				$(this0).attr("isDel","0");
				try{
					data = eval("("+data+")");
				}catch(e){
					data = "";
				}	
				if(data != ""){
					if(data.state==0){
						comment.msgBox("删除成功。");
						if($(this0).attr("d-type")=="detail"){
							window.location.href = "/";
						}else{
							if(ifcomment == true){
								comment.setCommentNumber($(this0),true);
							}
							$(this0).parent().hide();
						}
					}else{
						comment.msgBox(data.msg,"error");
					}
				}else{
					comment.msgBox("系统超时，请稍后重试！","error");
				}
			})												  
            
        })
    },
    confirmFloatBox:function(obj,msg,okCallback){
        var htmlObj = $("<div id='confirm-box' class='confirm-box'><p>"+msg+"</p><div class='button-box'><input type='button'  class='gray-button mr-3' close=1 value='取消' />  <input type='button' class='gren-button'  value='确定' /></div></div>");
		var zIndex = arguments[3]?arguments[3]:90;
		var poorTop = -5;
		var poorLeft = 60;
		if(obj.attr("poor-top")&&!isNaN(obj.attr("poor-top"))){
			poorTop = obj.attr("poor-top");
		}
		if(obj.attr("poor-left")&&!isNaN(obj.attr("poor-left"))){
			poorLeft = obj.attr("poor-left");
		}
        var floatDailogObj = htmlObj.floatDailog({referObj:obj,tips:true,poorLeft:poorLeft,poorTop:poorTop,width:215,type:"top",zIndex:zIndex});
        $("#confirm-box-clone").find("input.gren-button").click(function(){
             if(typeof okCallback == "function"){
                 okCallback();
                 floatDailogObj.closeFloat("top");
             }
        });
    },
    groupActive:function(){
        var this0 = this;
        var id = '';
        if($(this0).attr("action-type")=="1"){
            var htmlObj = $("#group-float-exitbox");
            id = "#group-float-exitbox-clone";
        }else{
            var htmlObj = $("#group-float-box");
            id = "#group-float-box-clone";
        }
        htmlObj.floatDailog({referObj:$(this0),width:147,tips:true,poorTop:10});
        $(id).click(function(e){
                var tarGet = e.target;
                if(tarGet.tagName.toUpperCase() == "A"){
                    var groupId = $(tarGet).attr('group_id');
                    switch(tarGet.id){
                       case "update-admin":
                           comment.updateGroup(groupId);
                            break;
                       case "kicked-out":
                           comment.kickedOut(groupId);
                            break;
                        case "new-admin":
                            comment.newAdmin();
                            break;
                        case "disband-group":
                            comment.disbandGroup();
                            break;
                        case "exit-group":
                            comment.exitGroup.call(tarGet,$(this0));
                            break;
						case "Invite-member":
							comment.inviteMember();
							break;
                    }
                }
        });
    },
    creatGroup:function(){
		if($.creatGroup==true){
			return ;
		}
		$.creatGroup = true;
        $.get(
            '/group/add', 
            {},
            function(response){
				$.creatGroup = false;
                if(response.state == 0){
                    var addGroupObj = $("#add-group-box");
                    addGroupObj.html("");
                    addGroupObj.append(response.msg);
                    addGroupObj.dailog({width:700,height:"auto",id:"groupPobBox",title:"创建群组",titleClass:"add-group-pob-title"});
                    $("#add-group-box").find("input[type=text],textarea").each(comment.inputTopic);
                    $("#add-group-box input[name=is_public]").change(function(){
                            if(this.value=="0"){
                                    $("#add-group-box .form-join-radio").hide();
                                    $("#add-group-box .form-join-radio").next().find("input").attr("checked",true);
                            }else{
                                    $("#add-group-box .form-join-radio").show();
                                    $("#add-group-box .form-join-radio").find("input").attr("checked",true);
                            }
                    });
                    $("#add-group-box").find("form").submit(function(event){
                        if (window.event) { event.returnValue = false; } else { event.preventDefault();}
                        var formObj = $(this);
                        var button = formObj.find("input[type=submit]");
                        var name = formObj.find("input[name=name]");
                        var jianjie = formObj.find("textarea[name=descritpion]");
                        if($.trim(name.val())==""){
                                 comment.msgBox("请输入群名称！","error");
                                 name.focus();
                                return false;
                        }
                        if(comment.getLength($.trim(jianjie.val()))>40){
                                comment.msgBox("群简介不能超过40个字！","error");
                                jianjie.focus();
                                return false;
                        }
                        button.attr("disabled",true);
                        $.post(
                            '/group/add',
                            formObj.serialize(),
                            function(response){
                                button.attr("disabled",false);
                                try{
                                      if(typeof data == "string")
                                           var data = eval("("+response+")");
                                      else
                                           var data = response;
                                }catch(e){
                                      var data = '';
                                }
                                if(data!=""){
                                        if(data.state==0){
                                                //comment.msgBox("添加成功！");
												window.location.href = "/mygroups";
                                                $("#add-group-box").dailogClose();
                                        }else{
                                               comment.msgBox(data.msg,"error");
                                        }
                                }else{
                                        comment.msgBox("请求超时，请稍后重试！","error");
                                }
                            },
                            'json'
                        );
                        return false;
                    });
					
					 $("#add-group-box").find("input.gray-button").click(function(){
							var input = $("#add-group-box").find("input[name=name]").val();
							if($.trim(input)!=""){
								comment.confirmFloatBox($(this), '确定要取消创建群组吗?', function(){
									$("#add-group-box").dailogClose();
								},150);
							}else{
								$("#add-group-box").dailogClose();
							}
					 });
					
                } else {
                    
                    var addGroupObj = $("#add-group-box");
                    addGroupObj.html("");
                    addGroupObj.append(response.msg);
                    addGroupObj.dailog({width:700,height:"auto",id:"groupPobBox",title:"创建群组",titleClass:"add-group-pob-title"});
					$("#add-group-box").find("input.gray-button").click(function(){
						$("#add-group-box").dailogClose();
					});
					
                    
                }
                
            }, 
            'json'
        );
        
    },
    updateGroup:function(groupId){
        var updateGroupObj = $("#update-group-box");
		if($.updateGroup==true){
			return;
		}
		$.updateGroup = true;
        $.get('/group/edit/'+groupId,function(data){
           var groupObj = $(data);
		   $.updateGroup = false;
           updateGroupObj.html("");
           groupObj.appendTo(updateGroupObj);
           updateGroupObj.dailog({width:700,height:"auto",id:"updatePobBox",title:"修改群组",titleClass:"add-group-pob-title"});
           $("#update-group-box").find("input[type=text],textarea").each(comment.inputTopic);
           //alert(updateGroupObj.find("form").html());
		   $("#update-group-box input[name=is_public]").change(function(){
				if(this.value=="0"){
					$("#update-group-box .form-join-radio").hide();
					$("#update-group-box .form-join-radio").next().find("input").attr("checked",true);
				}else{
					$("#update-group-box .form-join-radio").show();
					$("#update-group-box .form-join-radio").find("input").attr("checked",true);
				}
			});
           $("#update-group-box").find("form").submit(function(event){
               if (window.event) { event.returnValue = false; } else { event.preventDefault();}
               var formObj = $(this);
			   var button = formObj.find("input[type=submit]");
			   var announcement = formObj.find("textarea[name=announcement]").val();
			   var name = formObj.find("input[name=name]");
				var jianjie = formObj.find("textarea[name=description]");
			   if($.trim(name.val())==""){
					 comment.msgBox("请输入群名称！","error");
					 name.focus();
					 return false;
			   }
			   if(comment.getLength($.trim(jianjie.val()))>40){
					comment.msgBox("群简介不能超过40个字！","error");
					jianjie.focus();
					return false;
				}
				if(comment.getLength($.trim(announcement))>40){
					comment.msgBox("群公告不能超过40个字！","error");
					return false;
				}
			   button.attr("disabled",true);
               $.post(
                   '/group/edit/' + groupId,
                   formObj.serialize(),
                   function(response){
					  button.attr("disabled",false);
					  try{
						if(typeof data == "string")
					  		var data = eval("("+response+")");
						else
							var data = response;
					  }catch(e){
					  	var data = '';
					  }
					  if(data!=""){
						  if(data.state==0){
							  comment.msgBox("修改成功！");
							  $("#update-group-box").dailogClose();
							  if($.trim(announcement)!=""){
								  	announcement = announcement.replace(/>/g,"&gt;").replace(/</g,"&lt;").replace(/(\r\n)|\r|\n/g,"<br />");
							  		$("#announcemen-content").html(announcement);
							  }
						  }else{
						  	 comment.msgBox(data.msg,"error");
						  }
					  }else{
					  	  comment.msgBox("请求超时，请稍后重试！","error");
					  }
                   },
                   'json'
               );
               return false;
           });
		   
		   $("#update-group-box").find("input.gray-button").click(function(){
				comment.confirmFloatBox($(this), '确定要取消编辑吗?', function(){
					$("#update-group-box").dailogClose();
				},150);
		   });
		   
		   
        })
    },
    inviteMember:function(groupId){
        var inviteButton = $("#Invite-member");
        var groupId = inviteButton.attr("group-id");
		if(inviteButton.attr("ifGet")=="1")
			return false;
		inviteButton.attr("ifGet","1");
        $.get('/group/invite/'+groupId,"",function(response){
				inviteButton.attr("ifGet","");								   
                var inviteGroupObj = $("#invite-pob-box");
                inviteGroupObj.html("");
                $(response).appendTo(inviteGroupObj);
                inviteGroupObj.dailog({width:700,height:"auto",id:"invitePobBox",title:"邀请成员",titleClass:"add-group-pob-title"});
				var pobObj = $("#invite-pob-box");
				var numObj = pobObj.find("span.select-num");
				numObj.html("");
                var selectorObj = pobObj.find("#selUser").attr("id","selUserPob").Selector({ dropListUrl:"/user/finduser", ifRepeat:true,removeToken:function(data){
					pobObj.find("input[id="+data.id+"]").attr("checked",false);
					var length = $(".tokenList",pobObj).children().length-1;
					numObj.html(length);
						
				},callBack:function(data){
					pobObj.find("input[id="+data.id+"]").attr("checked",true);	
					var length = $(".tokenList",pobObj).children().length-1;
					numObj.html(length);
				}});
                $("#invite-pob-box").find("input[type=checkbox]").change(function(){
					var id = $(this).attr("id");
					var name = $(this).attr("data-name");
					if(this.checked == true){
						selectorObj.addToken(name,id,true);
						var length = $(".tokenList",pobObj).children().length-1;
						numObj.html(length);
					}else{
						var emObj = $("#invite-pob-box").find("em#emdel_"+id).get(0);
						selectorObj.delToken.call(emObj);
					}
				});
                $("#invite-pob-box").find('form').submit(function(event){
                    if (window.event) { event.returnValue = false; } else { event.preventDefault();}
                        var formObj = $(this);
                        var param = "";
                        var userIds = Array();
                        var count = 0;
						var button = formObj.find("input[type=submit]");
                        formObj.find('.tokenList li').each(function(){
                            userIds[count] = $(this).attr('friendid');
                            count++;
                        });
						var length = $(".tokenList",pobObj).children().length-1;
						if(length<=0){
							comment.msgBox("请选择邀请成员！","error");
							return false;
						}
                        button.attr("disabled",true);
                        $.post(
                            '/group/invite/' + groupId,
                            "user_ids="+userIds.join(','),
                            function(response){
								button.attr("disabled",false);
								try{
									var data = eval("("+response+")"); 
								 }catch(e){
									var data = '';
								 }
								 if(data!=""){
									  if(data.state==0){
										 // comment.msgBox("邀请成功！");
										  $("#invite-pob-box").dailogClose();
										  window.location.reload();
									  }else if(data.state==-2){
									  	 comment.msgBox(data.msg);
									  }else{
										 comment.msgBox(data.msg,"error");
									  }
								 }else{
									  comment.msgBox("请求超时，请稍后重试！","error");
								 }
                            },
                            'html'
                        );
                        return false;
                });
                
            },
            'html'
        );
        
        
        
    },
    newAdmin:function(){
        var inviteGroupObj = $("#new-admin-box");
        inviteGroupObj.dailog({width:550,height:"auto",id:"newAdminPobBox",title:"任命新群主",titleClass:"add-group-pob-title"});
        $("#new-admin-box").find("#newAdmin").attr("id","newAdminPob").Selector({ dropListUrl:"/user/finduser", ifRepeat:true,maxToken:1});
		var formObj = $("#new-admin-box").find("form");
		formObj.submit(function(event){
			 if (window.event) { event.returnValue = false; } else { event.preventDefault();}
			 var users = formObj.find("input[name=receiverId]").val();
			 if($.trim(users)==''){
					comment.msgBox("请选择新群主！","error");
					return false;
			 }
			 var button = formObj.find("input[type=submit]");
			 comment.confirmFloatBox(button, '任命新群主后，你将不是该群的群主，将作为群成员?', function(){
			 		button.attr("disabled",true);
					$.post(
						formObj.attr("action"),
						formObj.serializeArray(),
						function(response){
							button.attr("disabled",false);
							try{
								var data = eval("("+response+")"); 
							 }catch(e){
								var data = '';
							 }
							 if(data!=""){
								  if(data.state==0){
									  //comment.msgBox("操作成功！");
									  $("#new-admin-box").dailogClose();
									  window.location.reload();
								  }else{
									 comment.msgBox(data.msg,"error");
								  }
							 }else{
								  comment.msgBox("请求超时，请稍后重试！","error");
							 }
						},
						'html'
					);
			 },150);
			return false;
		});
    },
    kickedOut:function(groupId){
		if($.kickedOut==true){
			return;
		}
		$.kickedOut = true;
        $.get('/group/deletemember/'+ groupId, {},function(response){
			$.kickedOut = false;											   
            var addGroupObj = $("#member-list-box");
            addGroupObj.html("");
            $(response).appendTo(addGroupObj);
            addGroupObj.dailog({width:700,height:"auto",id:"memberPobBox",title:"群成员",titleClass:"add-group-pob-title"});
            $("#member-list-box").find("a.close").click(function(){
                var userId = $(this).attr('user-id');
                var groupId = $(this).attr('group-id');
				var this0 = $(this);
                comment.confirmFloatBox($(this), '确定要删除该成员吗?', function(){
					 if(this0.attr("ifDel")=="1"){
						return ;	
					 }
					 this0.attr("ifDel","1");
                     $.post(
                        '/group/deletemember/' + groupId,
                        {user_ids:userId},
                        function(response){
							this0.attr("ifDel","");
                            if(response.state == -1){
                                comment.msgBox(response.msg,"error");
                            } else {
                                //comment.msgBox('该成员已删除。');
								this0.parent().remove();
								//window.location.reload();
								
                            }
                        }
                     );
                     //$(this0).parent().hide();
                },"105");
            });
            
            
        },'html');
        
        
    },
	selectMember:function(){
		var groupId = $(this).attr('group-id');
		var this0 = this;
		var getUrl = '/group/memberlist/'+ groupId;
		var title = "群成员";
		if($(this).attr('rel')&&$(this).attr('rel')!=""){
			getUrl = $(this).attr('rel');
		}
		if($(this).attr("top-title")&&$.trim($(this).attr("top-title"))!=""){
			title = $(this).attr("top-title");
		}
		if($(this).attr("get")=="1"){
			return false;
		}
		$(this).attr("get","1");
        $.get(getUrl,function(response){
			$(this0).attr("get","0");											   
            var addGroupObj = $("#member-list-box");
            addGroupObj.html("");
            $(response.msg).appendTo(addGroupObj);
            addGroupObj.dailog({width:700,height:"auto",id:"memberPobBox",title:title,titleClass:"add-group-pob-title"});
        },'json');
    },
	joinGroup:function(){
		var this0 = this;
		var groupId = $(this).attr('group-id');
		if(this0.ifPost==true){
			return;
		}
		this0.ifPost = true;
        $.post(
            '/group/addmember',
            {group_id:groupId},
            function(response){this0.ifPost = false;
                if(response.state == -1){
                    comment.msgBox(response.msg,"error");
                } else {
                   // comment.msgBox(response.msg);
				   window.location.reload();
					/*$(this0).hide();
					$(this0).parent().find("#group-action").show();*/
                } 
            },
            'json'
        );
	},
    exitGroup:function(floatObj){
		var groupId = $(this).attr('group-id');
		$("#exit-group-box").dailog({width:500});
		$("#exit-group-box").find("input.gren-button").unbind().click(function(){
			if($.exitGroup==true){
				return;
			}
			$.exitGroup = true;
			$.post(
                '/group/exitgroup',
                {group_id:groupId},
                function(response){$.exitGroup = false;
                    if(response.state == -1){
                       commetn.msgBox(data.msg,"error");
                    } else {
                        //comment.msgBox(response.msg);
						/*floatObj.hide();
						floatObj.parent().find("#join-button").show();
						$("#exit-group-box").dailogClose();*/
                        window.location.reload();
                    } 
                },
                'json'
            );
		});        
    },
	exitGroupFLoat:function(){
	    var this0 = this;
		var groupId = $(this).attr('group-id');
		comment.confirmFloatBox($(this), '确定要退出群?', function(){
			 if(this0.ifDel == true){
				return;	
			 }		
			 this0.ifDel = true;
			 $.post(
				  '/group/exitgroup',
				  {group_id:groupId},
				  function(response){
					  this0.ifDel = false;
					 // response = eval("(" +response+ ")");
					  if(response.state != 0) {
						  comment.msgBox(response.msg,"error");
					  }else{
						  comment.msgBox("您已经退出该群。");
						  var currentLi = $(this0).closest("div.group-li");
						  var nextLi = currentLi.nextAll("div.group-li");
						  var currentType = currentLi.get(0).className.indexOf("fr")>-1?true:false;
						  var allList = $(this0).attr("all-list");
						  if(allList&&allList=="1"){
							  /*var parentActionObj = $(this0).parent();
							  parentActionObj.html("");*/
							  window.location.reload();
						  }else{
							  $(this0).closest("div.group-li").remove();
							  if(nextLi.length>0){
								nextLi.each(function(i){
									if(currentType){
										if(i%2==0){
											$(this).addClass("fr");
										}else{
											$(this).removeClass("fr");
										}
									}else{
										if(i%2==0){
											$(this).removeClass("fr");
										}else{
											$(this).addClass("fr");
										}
									}
								});
							  }
						  }
						  
					  }
				  },
				  'json'
			 );
		});
	},
	privateGroup:function(){
		var aLinkObj = $(this).closest("div.group-li").find("h2>a");
		aLinkObj.click(function(event){
			if (window.event) { event.returnValue = false; } else { event.preventDefault();}
			$("#private-box").dailog({width:550,height:"auto",id:"disbandPobBox",title:"友情提示",titleClass:"add-group-pob-title"});
		});
	},
    disbandGroup:function(){
    var disbandBoxObj = $("#disband-box");
            disbandBoxObj.dailog({width:550,height:"auto",id:"disbandPobBox",title:"解散群",titleClass:"add-group-pob-title"});
            $("#disband-box").find("form").submit(function(event){
                  if (window.event) { event.returnValue = false; } else { event.preventDefault();}
                  var button = $(this).find("input[type=submit]");
                  var formObj = $(this);
                  button.attr("disabled",true);
                  $.post(
                   formObj.attr("action"),
                   formObj.serialize(),
                     function(response){
                         button.attr("disabled",false);
                    if(response.state == -1){
                       commetn.msgBox(data.msg,"error");
                    } else {
                        comment.msgBox(response.msg);
						$("#disband-box").dailogClose();
                        window.location.href = "/mygroups";
                    } 
                    },
                    'json'
                  );
                 return false;
              });      
    },
	commentHeader:function(){
		$(".fans-list li").hover( function(){$(this).find("a.close-ico").show()},function(){$("a.close-ico").hide();});
		$("#new-msg-ico").hover(function(){
			$(this).addClass("alert-hover");
			var this0 = this;
			if(this0.ifGet == true){
				return;
			}
			this0.ifGet = true;
			$.get("/msglist/tipslayer",function(data){
				this0.ifGet = false;
				try{
					data = eval("("+data+")");
				}catch(e){
					data = "";
				}
				if(data != ""){
					if(data.state==0){
						$("#msgListBox").find("ul").html("");
						$(data.msg).appendTo($("#msgListBox").find("ul"));
					}
				}else{}
			});
		}
		,function(){
			if($(this).attr("getbind")==null||$(this).attr("getbind")==""){
				$("#msgListBox").hide();
				$("#new-msg-ico").removeClass("alert-hover");
			}
		});
		$("#new-msg-ico").click(function(){
			if($(this).attr("getbind")==null||$(this).attr("getbind")==""){
				$(this).attr("getbind","1");
				$("#msgListBox").show();
			}else{
				$(this).attr("getbind","");
				$("#msgListBox").hide();
			}
			$(document).unbind("click").click(function (e) {
				if(!($("#new-msg-ico").get(0) == e.target || $("#msgListBox").get(0) == e.target || jQuery.contains($("#msgListBox").get(0), e.target))){
					$("#new-msg-ico").attr("getbind","");
					$("#new-msg-ico").removeClass("alert-hover");
					$("#msgListBox").hide();
				}
			});
		});
//		$("#msgListBox").hover(function(){
			
//		},function(){
//			$("#new-msg-ico").attr("getbind","");
//			$("#new-msg-ico").removeClass("alert-hover");
//			$("#msgListBox").hide();
//		});

	},
	commentSearch:function(){
		$("#search-text").bind({
			focus:function(){
				if($(this).val()=="姓名、花名、工号..."){
					$(this).attr("value","");
				}
				if($(this).val()!=null && $(this).val()!=""){
					var this0 = this;
					$.ajax({
						type: "POST",
						url: "/search",
						data: {q:$(this).val()},
						cache: false,
						dataType: "json",
						success: function(html){
							$("#nav-keylist").html(html.msg);
							if($("#nav-keylist").text()!=null&&$("#nav-keylist").text()!=""&&$("#nav-keylist").text()!="\t\t\t\t"){
								$("#nav-keylist").show();
								$(document).unbind("click").click(function(e){
									 this0==e.target||$("#nav-keylist").get(0) == e.target || jQuery.contains($("#nav-keylist").get(0), e.target) || $("#nav-keylist").hide();
								});
							}else{
								$("#nav-keylist").hide();
							}
						}
					});
				}
				$(this).attr("class","search-text-focus");
				$("#search-but").attr("class","search-but-focus");
			},
			blur:function(){
				if($(this).val()==""||$(this).val()==null){
					$(this).attr("value","姓名、花名、工号...");
				}
				$(this).attr("class","search-text");
				$("#search-but").attr("class","search-but");
			},
			keyup:function(event){
				
				if($(this).val()!=null && $(this).val()!=""){
					var this0 = this;
					var getData = function(){
						$.ajax({
							type: "POST",
							url: "/search",
							data: {q:$(this0).val()},
							cache: false,
							dataType: "json",
							success: function(html){
								$("#nav-keylist").html(html.msg);
								if($("#nav-keylist").text()!=null&&$("#nav-keylist").text()!=""&&$("#nav-keylist").text()!="\t\t\t\t"){
									$("#nav-keylist").css("display","block");
									$(document).unbind("click").click(function(e){
										 this0==e.target||$("#nav-keylist").get(0) == e.target || jQuery.contains($("#nav-keylist").get(0), e.target) || $("#nav-keylist").hide();
									});
								}else{$("#nav-keylist").hide();}
							}
						});
					}
					clearTimeout($.searchTime);
					$.searchTime = setTimeout(getData,200);
				}else{
					$("#nav-keylist").hide();
				}
			}
		});
		$("#search-but").click(function(){
			if($("#search-text").val()!=null && $("#search-text").val()!="" && $("#search-text").val()!="姓名、花名、工号..."){
				$("#search-form").submit();
			}else{
				$("#search-text").focus();
			}
		});
		$("#search-form").submit(function(){
			if($("#search-text").val()=="姓名、花名、工号、座机..."){
				return false;
			}
			
		});
		$("#search-form").keydown(function(event){
			if(event.keyCode==13){
				$("#search-form").submit();
			}
		});
	},
	addAtta:function(){//个人粉丝页面添加关注
		var this0 = this;
		var url = this0.rel;
		var partLi = $(this0).closest("li");
		var iCon = partLi.find("ico-a");
		if(this0.ifGet == true){
			return;
		}
		this0.ifGet = true;
		$.get(url,function(data){
			this0.ifGet = false;
			if(data==""){
				comment.msgBox("系统超时，请稍后重试！","error");
				return;
			}
			try{
				data = eval("("+data+")");
			}catch(e){
				data = "";
			}
			if(data != ""){
				if(data.state==0){
					//comment.msgBox("添加关注成功。");
					if($(this0).attr("relation")&&$(this0).attr("relation")=="1")
						$(this0).removeClass().addClass("ico recv-ico");
					else
						$(this0).removeClass().addClass("ico fans-ico");
					$(this0).unbind("click");
				}else{
					comment.msgBox(data.msg,"error");
				}
			}else{
				comment.msgBox("系统超时，请稍后重试！","error");
			}
		});
	},
	cancelAtta:function(){//个人粉丝页面取消关注
		var this0 = this;
		var url = this0.rel;
		var partLi = $(this0).closest("li");
		var iCon = partLi.find("ico-a");
		var msg = "你确定要移除粉丝吗?";
		var state = 0;
		if($(this0).attr("confirm")&&$(this0).attr("confirm")!=""){
			msg = $(this0).attr("confirm");
			state = 1;
		}
		comment.confirmFloatBox($(this), msg, function(){
				if($(this0).attr("click")=="1")
					return;
				$(this0).attr("click","1");
				$.get(url,function(data){$(this0).attr("click","0");
					if(data==""){
						comment.msgBox("系统超时，请稍后重试！","error");
						return;
					}
					try{
						data = eval("("+data+")");
					}catch(e){
						data = "";
					}
					if(data != ""){
						if(data.state ==0){
							/*if(state == 1)
								comment.msgBox("取消关注成功。");
							else
								comment.msgBox("移除数丝成功。");*/
							iCon.removeClass().addClass("ico opt-ico ico-a");
							partLi.remove();
						}else{
							comment.msgBox(data.msg,"error");
						}
					}else{
						comment.msgBox("系统超时，请稍后重试！","error");
					}
				});
		});
	},
	searchAtta:function(){
		var obj=this;
		$.ajax({
			type: "POST",
			url:$(this).attr("href"),
			cache: false,
			dataType: "json",
			success: function(html){
				if(html.state=="0"){
					$(obj).removeAttr("id");
					$(obj).removeAttr("href");
					if(true){
						$(obj).attr("class","list-havegg");
						$(obj).text("已关注");
					}else{
						$(obj).attr("class","list-hxgg");
						$(obj).text("互相关注");
					}
					comment.msgBox("关注成功");
				}
			}
		});
		return false;
	},
	getMoreMessage:function(){
		var this0 = $(this);
		var putId = this0.attr("put-id");
		var moreId = $.trim(this0.attr("id"));
		var getData = {time:Math.random()};
		var totalPage = 0;
		var topic = "已经到最后一页了哟";
		if(this0.attr("click")=="1"){
			return;
		}
		getData.max_id = $("#"+putId).find("li").last().attr("id");
		getData.page = this0.attr("current-page");
		if(this0.attr("total-page")&&this0.attr("total-page")>0){
			totalPage = this0.attr("total-page");
		}
		
		if(getData.page>0){
            this0.attr("current-page",(parseInt(getData.page)+1));
		}
		this0.attr("click","1");
		this0.addClass("mid-loading");
		this0.find("a").hide();
		
		$.get(this0.attr("get-url"),getData,function(data){
			this0.removeClass("mid-loading");
			this0.attr("click","");
			this0.find("a").show();
			try{
				var data = eval("("+data+")");
			}catch(e){
				var data = "";
			}
			if(data != ""){
				if(data.state==0){
					if($.trim(data.msg) == ""){
                       return ;
					}
					
					if(moreId == "get-more-group"){
						var dataObj = $("<div>"+data.msg+"</div>");
						dataObj = dataObj.children("div.group-li");
						var currentLi = $("#"+putId).find("div.group-li").last();
					}else{
						var dataObj = $(data.msg);
					}
					$("#"+putId).append(dataObj);
					if(moreId == "get-more-index"){
						dataObj.each(comment.bindLiEvent);
						dataObj.find("dt").each(comment.bindReplyLi);
					}else if(moreId == "get-more-group"){
						var currentType = currentLi.get(0).className.indexOf("fr")>-1?true:false;
						dataObj.each(function(i){
							$("a.list-img",$(this)).showUserCard({clickFunction:comment.attention,getUrl:"/group/card",width:418});
							$(this).find('a.ri-action').click(comment.exitGroupFLoat);
							$("span.group-li-action-box",$(this)).click(comment.attention);
							$("input[is-pob=1]",$(this)).each(comment.privateGroup);
							if(currentType){
								if((i+1)%2==0){
									$(this).addClass("fr");
									this.className = this.className+" fr";
								}else{
									$(this).removeClass("fr");
								}
							}else{
								if((i+1)%2==0){
									$(this).removeClass("fr");
								}else{
									$(this).addClass("fr");
								}
							}
						});
  					}else if(moreId == "get-more-member"){
						dataObj.each(function(){
							$("a.close",$(this)).click(comment.cancelAtta); //取消关注
							$("a.ico-a",$(this)).click(comment.addAtta);
							$("a.list-img",$(this)).showUserCard({clickFunction:comment.attention,getUrl:"/userinfo"});
						 });
					}else if(moreId == "get-more-search-mem"){
						dataObj.each(function(){
							$("#gz",$(this)).click(comment.searchAtta);
						 });
					}else if(moreId == "get-more-search-group"){
						dataObj.each(function(){
							$("a.close",$(this)).click(comment.exitGroupFLoat);
							
						});
					}
					if(totalPage>0&&totalPage<parseInt(getData.page)+1){
						this0.html(topic);
						this0.unbind();
					}
				}else if(data.state=="-100"){
					 this0.html(topic);
					 this0.unbind();
                 }else{
					 comment.msgBox(data.msg,"error");
				}
			}else{
				comment.msgBox("请求超时，请稍后重试！","error");
			}
		})
	},
	scrollTop:function(clickType){
		var page = comment.getPageSize();
		var left = 0;
		if(page.clientWidth<=980){
			left = 	page.clientWidth-18;
		}else{
			left = (page.clientWidth-980)/2+972;
		}
		if($(window).scrollTop()>0){
			$('.scroll-top').css({left:left+'px'});
			var browser=navigator.appName
			var b_version=navigator.appVersion
			var version=b_version.split(";");
			if(version[1]!=undefined){
				var trim_Version=version[1].replace(/[ ]/g,"");
				if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE6.0")
				{
					$('.scroll-top').css({top:($(window).scrollTop()+$(window).height()-100)+'px'});
				}
			}
			$('.scroll-top').show();
		}else{
			$('.scroll-top').hide();
		}
		if(clickType){
			$('.scroll-top').click(function(){
				$(window).scrollTop(0);
				$(this).hide();
			});
		}
	}
};

//审核群加入申请
function checkGroupApply(tarA, sign, groupId, applyId, status){
	var obj=$(tarA);
	if($.checkGroupApply==true){
		return;
	}
	$.checkGroupApply = true;
    $.post(
        '/group/checkapply',
        {group_id:groupId,sign:sign,apply_id:applyId,status:status},
        function(response){
			$.checkGroupApply = false;
            if(response.state == 0){
                obj.parent().parent().remove();
				if(status==1){
					comment.msgBox("审批成功");
				}else if(status==0){
					comment.msgBox("消息已忽略");
				}else{
					comment.msgBox("操作成功");
				}
				$.get("/msglist/tips?time="+Math.random(),{since_id:$("#main-msg").find("li").eq(0).attr("id")},function(data){
					try{
						data = eval("("+data+")");
					}catch(e){
						data = "";
					}
					if(data != ""){
						if(data.state==0){
							if(data.msg.newnotice.number>0){
								$("#new-more-msg").show();
								$("#new-more-msg").find("span").text(data.msg.newnotice.number);
								$("#new-more-msg").unbind("click").click(function(){comment.getNewMessgeList(data.msg.newnotice,this);});
							}
							if(data.msg.notification>0){
								$("#top-tips").html(data.msg.notification);
								$("#top-tips").show();
							}else{$("#top-tips").hide();}
						}
					}
				});
            } else {
                //alert(response.msg);
				comment.msgBox("操作超时，请稍后重试","error");
            }
        },
        'json'
    );
}

//设置通知为以读
function setState(tarA,sign){
	if($.setState==true){
		$.setState = true;
	}
	$.setState = true;
    $.post(
        '/msglist/setstate',
        {sign:sign},
        function(response){
			$.setState = false;
            if(response.state == 0){
                $(tarA).parent().parent().remove();
				//comment.msgBox("消息已忽略");
				$.get("/msglist/tips?time="+Math.random(),{since_id:$("#main-msg").find("li").eq(0).attr("id")},function(data){
					try{
						data = eval("("+data+")");
					}catch(e){
						data = "";
					}
					if(data != ""){
						if(data.state==0){
							if(data.msg.newnotice.number>0){
								$("#new-more-msg").show();
								$("#new-more-msg").find("span").text(data.msg.newnotice.number);
								$("#new-more-msg").unbind("click").click(function(){comment.getNewMessgeList(data.msg.newnotice,this);});
							}
							if(data.msg.notification>0){
								$("#top-tips").html(data.msg.notification);
								$("#top-tips").show();
							}else{$("#top-tips").hide();}
						}
					}
				});
            } else {
                alert(response.msg);
            }
        },
        'json'
    );
}