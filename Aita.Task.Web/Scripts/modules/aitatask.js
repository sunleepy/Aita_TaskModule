"use strict"

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//通过php设置
var task_api_url = 'http://localhost:9000';
var currentUserId = GetQueryString('userId');
var currentDisplayMode = GetQueryString('displayMode');
var currentTaskId = GetQueryString('taskId');

var aitatask = angular.module('aitatask', []);
(function () {

    //URL配置
    aitatask.value('urls', {
        map_url: '/Handlers/UrlMapHandler.ashx',
        getTasksByCreator_url: 'url_getTasksByCreator',
        getTasksByAssignee_url: 'url_getTasksByAssignee',
        getRelatedTasks_url: 'url_getRelatedTasks',
        taskInfo_url: 'url_taskInfo',
        changeCompleted_url: 'url_changeCompleted',
        changePriority_url: 'url_changePriority'
    });
    //当前用户
    aitatask.value('userId', currentUserId);
    aitatask.value('displayMode', currentDisplayMode);
    aitatask.value('taskId', currentTaskId);

})();