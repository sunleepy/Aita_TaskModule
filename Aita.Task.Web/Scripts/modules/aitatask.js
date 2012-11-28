"use strict"

//通过php设置
var task_api_url = 'http://localhost:9000';
var currentUserId = 10000;
var currentDisplayMode = 1;

var aitatask = angular.module('aitatask', []);
(function () {

    //URL配置
    aitatask.value('urls', {
        map_url: '/Handlers/UrlMapHandler.ashx',
        getTasksByCreator_url: task_api_url + '/EnterpriseTask/GetTasksByCreator',
        getTasksByAssignee_url: task_api_url + '/EnterpriseTask/GetTasksByAssignee',
        getRelatedTasks_url: task_api_url + '/EnterpriseTask/GetRelatedTasks',
        taskInfo_url: task_api_url + '/EnterpriseTask/TaskInfo'
    });

    //当前用户
    aitatask.value('userId', currentUserId);
    aitatask.value('displayMode', currentDisplayMode);

})();