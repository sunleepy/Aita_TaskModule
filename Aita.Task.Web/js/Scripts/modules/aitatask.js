"use strict"

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//var currentTaskId = GetQueryString('taskId');
var aitatask = angular.module('aitatask', []);

(function () {

    var urls;
    if(isPhp) { //TODO:Php
        urls = {
            map_url: '/task/request',
            getTasksByCreator_call: 'GetTasksByCreator',
            getTasksByAssignee_call: 'GetTasksByAssignee',
            getRelatedTasks_call: 'GetRelatedTasks',
            taskInfo_call: 'TaskInfo',
            changeCompleted_call: 'ChangeCompleted',
            changePriority_call: 'ChangePriority',
            changeDueTime_call: 'ChangeDueTime'
        };
    }
    else {
        urls = {
             map_url: '/Handlers/UrlMapHandler.ashx',
            getTasksByCreator_call: 'url_getTasksByCreator',
            getTasksByAssignee_call: 'url_getTasksByAssignee',
            getRelatedTasks_call: 'url_getRelatedTasks',
            taskInfo_call: 'url_taskInfo',
            changeCompleted_call: 'url_changeCompleted',
            changePriority_call: 'url_changePriority',
            changeDueTime_call: 'url_changeDueTime'
        };
    }
    //URL配置
    aitatask.value('urls', urls);
    if(currentUserId !== undefined) {
        //当前用户编号
        aitatask.value('userId', currentUserId);
    }
    if(currentTaskId !== undefined) {
        //当前任务编号
        aitatask.value('taskId', currentTaskId);
    }
})();