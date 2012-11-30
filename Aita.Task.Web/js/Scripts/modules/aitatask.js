"use strict"

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

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
            changeDueTime_call: 'ChangeDueTime',
            createTask_call: 'CreateTask',
            updateTask_call: 'UpdateTask'
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
            changeDueTime_call: 'url_changeDueTime',
            createTask_call: 'url_createTask',
            updateTask_call: 'url_updateTask'
        };
    }
    //URL配置
    aitatask.value('urls', urls);
    if(currentUserId != null && currentUserId != undefined && currentUserId != "") {
        //当前用户ID
        aitatask.value('userId', currentUserId);
    }
    if(currentUserName != null && currentUserName != undefined && currentUserName != "") {
        //当前用户花名
        aitatask.value('userName', currentUserName);
    }
    if(currentTaskId != null && currentTaskId != undefined && currentTaskId != "") {
        //当前任务ID
        aitatask.value('taskId', currentTaskId);
    }
})();