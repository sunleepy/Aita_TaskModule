﻿"use strict"

//通过php设置
var task_api_url = 'http://localhost:9000';
var currentUserId = GetQueryString('userId');
var currentDisplayMode = GetQueryString('displayMode');

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

})();