/*添加表情模块*/
(function($){
    /* 设置光标 */
    function setCursorPosition(textarea, rangeData) { 
            if(!rangeData) { 
                    return;
            } 
            $(textarea).focus();
            if (textarea.setSelectionRange) { 
                    // W3C textarea.focus(); 
                    textarea.setSelectionRange(rangeData.start,rangeData.end);
                    return;
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
    }
    /* 获取光标 */
    function getCursortPosition (ctrl) {//获取光标位置函数
                    var CaretPos = 0;    // IE Support
                    if (document.selection) {
                                    ctrl.focus ();
                                    var Sel = document.selection.createRange ();
                                    Sel.moveStart ('character', -ctrl.value.length);
                                    CaretPos = Sel.text.length;
                    }else if (ctrl.selectionStart || ctrl.selectionStart == '0'){
                                    CaretPos = ctrl.selectionStart;
                    }
                    return (CaretPos);
    }		 


    $.fn.extend({
            insertAtCaret: function(myValue) {
                    var $t = $(this)[0];
					if(myValue==undefined)return;
                    if (document.selection) {
                            this.focus();
                            sel = document.selection.createRange();
                            sel.text = myValue;
                            this.focus();
                    } else if ($t.selectionStart || $t.selectionStart == '0') {
                            var startPos = $t.selectionStart;
                            var endPos = $t.selectionEnd;
                            var scrollTop = $t.scrollTop;
                            $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
                            this.focus();
                            $t.selectionStart = startPos + myValue.length;
                            $t.selectionEnd = startPos + myValue.length;
                            $t.scrollTop = scrollTop;
                    } else {
                            this.value += myValue;
                            this.focus();
                    }
            }
    });

    /*创建普通表情列表*/
    $.fn.extend({
        showFace: function() {
               //预览窗口
               var preview = $(".preview"),
                       previewImg = $(".preview img"),
                       previewTitle = $(".preview .title"),
                       DELAY = 400,//预览延迟
                       targetTextarea = null,//目标文本框
                       COUNT = 320,PER_COUNT = 36;//创建魔法表情列表
               /*重置表情容器*/
                var resetFaceSpan = function(){
                       $("a[href='#tabs-1']").trigger("click");
                       $(".magic-pager a:contains('1')").trigger("click");
                }
                var faceBox=function(){

                       var wangWangFaceCount = wangWangFace.length;
                       var vStr = "<ul class='face-list clearfix'>";
                       for (var i = 0; i < wangWangFaceCount; i++) {
                               vStr += "<li class='small'><IMG width=21 height=21 border=0 src='/emotions/" + $.trim(wangWangFace[i].FixedFile) + "' title='"+$.trim(wangWangFace[i].Meaning)+"' alt='"+$.trim(wangWangFace[i].Meaning)+"' data-num='"+i+"'></li>";
                       }
                       vStr += "</ul>";
                       $("#tabs-1").html(vStr);

                       $(".face-list img").unbind("click").click(function(e){
                               var index = $(this).attr("data-num");
                               var curentData = faceConfig;
                               if($.trim($(this).closest("li").attr("class"))=="small"){
                                       curentData = wangWangFace;
                               }
                               var smile = curentData[index].ShortCur;
                               targetTextarea.insertAtCaret(smile);
                               //resetFaceSpan();
                               e.stopPropagation();
                               //$("#faces-container").hide();
                       });
                 }

                 var showFaceSpan = function(e){
                       faceBox();
                       targetTextarea = $(this).closest("form").find("textarea");
                       var parent = $(this);
                       var this1 = this;
					   $(document).unbind("click");
                       targetTextarea.focus();
                       var facePobBox = $("#faces-container");
                       facePobBox.find("s.without-top").css({left:$(this).width()/2})
                       facePobBox.css("left",parent.offset().left).css("top",parent.offset().top + $(this).height()+12).css("zIndex","101").show();
                       //e.stopPropagation();
                       $(document).click(function(e) {
                               /*点击的如果不是表情容器则关闭*/
                               this1==e.target||facePobBox.get(0) == e.target || jQuery.contains(facePobBox.get(0), e.target) || facePobBox.hide();
                               e.stopPropagation();
                       });
                 }
                 this.unbind("click").click(showFaceSpan);
        },
        showTopic:function(){
            var showTopicSpan = function(e){
				
                var _this = $(this);
                var targetTextarea = $(this).closest("form").find("textarea");
                var topicPobBox = $("#topic-container");
                var currentCha = _this.offset().left - _this.parent().offset().left;
				$("body").unbind("click");
                topicPobBox.find("s.without-top").css({left:$(this).width()/2+currentCha})
                topicPobBox.css("left",_this.offset().left-currentCha).css("top",_this.offset().top + _this.height()+12);
                topicPobBox.fadeIn("slow");
               // e.stopPropagation();
               topicPobBox.find("a.close").click(function(){
                   topicPobBox.fadeOut();
               });
                $("body").click(function(e) {
                        /*点击的如果不是表情容器则关闭*/
                        _this.get(0)==e.target||topicPobBox.get(0) == e.target || jQuery.contains(topicPobBox.get(0), e.target) || topicPobBox.hide();
                        //e.stopPropagation();
                        
                });
                if(!_this.attr("event-bind")&&_this.attr("event-bind")!="1"){
                    _this.attr("event-bind","1");
                    topicPobBox.find("div.insert-button-box input").unbind().click(function(){
                        targetTextarea.focus();
                        var str = "#请在这里输入你的话题#",currsort,first;
                        if((first=targetTextarea.val().indexOf(str))>-1){
                            setCursorPosition(targetTextarea.get(0),{start:first+1,end:first+str.length-1}); 
                        }else{
                            targetTextarea.insertAtCaret(str);
                            currsort = getCursortPosition(targetTextarea.get(0));
                            setCursorPosition(targetTextarea.get(0),{start:currsort-str.length+1,end:currsort-1}); 
                        }
                        topicPobBox.hide();
                     });

                     topicPobBox.find("div.topic-tab").unbind().click(function(e){
                         var tarGet = e.target;
                         var this1 = $(this);
                         if(tarGet.tagName.toUpperCase() == "SPAN"&&tarGet.className.indexOf("mid-line")<=-1){
                             var index = $(tarGet).index();
                             var listObj = topicPobBox.find("div.float-topic-list");
                             index = index>1?1:index;
                             this1.find("span").removeClass("cur");
                             listObj.children("ul").hide();
                             tarGet.className = "cur";
                             listObj.children("ul").eq(index).show();
                         }
                     });

                     topicPobBox.find("div.float-topic-list").unbind().click(function(e){
                         var tarGet = e.target,currsort;
                         if(tarGet.tagName.toUpperCase() == "A"){
                            targetTextarea.insertAtCaret("#"+$(tarGet).attr("title")+"#");
                            topicPobBox.hide();
                         }
                     });
                 }
            }
            this.unbind("click").click(showTopicSpan)
        } 
     });
})(jQuery);
	

