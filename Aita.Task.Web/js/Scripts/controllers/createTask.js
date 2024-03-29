﻿
function CreateTaskCtrl($scope, $rootScope, $http, $location, $routeParams, $element, urls, userId, userName) {
    if (isPhp) {
        $scope.createTaskUrl = urls.map_url;
        $scope.userInfoUrl = "http://api.w.taobao.ali.com/sys/userinfo";
        $scope.findUserUrl = "http://w.taobao.ali.com/task/autoprompt?self=1";
        $scope.returnUrl = "/task/created";
    }
    else {
        $scope.userInfoUrl = urls.map_url + '?url=url_userInfo&_=' + new Date().getTime();
        $scope.findUserUrl = urls.map_url + '?url=url_findUser&_=' + new Date().getTime();
        $scope.createTaskUrl = urls.map_url + '?url=url_createTask&_=' + new Date().getTime();
        $scope.returnUrl = "/GetTasksByCreator.htm?userId=" + userId;
    }

    $scope.userId = userId;
    $scope.subject = "";
    $scope.body = "";
    $scope.dueTime = null;
    $scope.priority = 0;

    if (isPhp) {
        $("#assigneeSelector").Selector(
        {
            dropListUrl: $scope.findUserUrl,
            ifRepeat: false,
            maxDrop: 8,
            maxToken: 1,
            initData: [{ id: userId, name: userName}]
        });
    }
    else {
        $("#assigneeSelector").Selector(
        {
            dropListUrl: $scope.findUserUrl,
            ifRepeat: false,
            maxDrop: 8,
            maxToken: 1,
            initData: []
        });
    }

    $("#relatedSelector").Selector(
    {
        dropListUrl: $scope.findUserUrl,
        ifRepeat: true,
        maxDrop: 8,
        maxToken: 999
    });

    if (!isPhp) {
        if (userId != null && userId != "") {
            var data = { user_id: userId };
            $http({
                method: 'POST',
                url: $scope.userInfoUrl,
                data: $.param(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (result, status, headers, config) {
                if (result.state == 0) {
                    if (result.data != null) {
                        $("#assigneeSelector").Selector(
                        {
                            dropListUrl: $scope.findUserUrl,
                            ifRepeat: false,
                            maxDrop: 8,
                            maxToken: 1,
                            initData: [{ id: userId, name: result.data.displayName}]
                        });
                    }
                    else {
                        comment.msgBox("当前用户信息不存在！", "error");
                    }
                }
                else {
                    if (result.data != null) {
                        comment.msgBox(result.data, "error");
                    }
                    else {
                        comment.msgBox("获取当前用户信息失败！", "error");
                    }
                }
            });
        }
    }

    $scope.save = function () {
        if ($scope.subject == null || $scope.subject == "") {
            comment.msgBox("请输入任务标题！", "error");
            return;
        }
        var priorityValue = $("#task-yx-color").attr("value");
        if (priorityValue != null) {
            priorityValue = parseInt(priorityValue) - 1;
        }
        var data = {
            userId: userId,
            subject: $scope.subject,
            body: $scope.body,
            dueTime: $("#duetime").val(),
            priority: priorityValue,
            assigneeUserId: $("#assigneeUserId").val(),
            relatedUserJson: $("#relatedUserIds").val(),
            call: urls.createTask_call
        };

        $http({
            method: 'POST',
            url: $scope.createTaskUrl,
            data: $.param(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (result, status, headers, config) {
            if (result.state == 0) {
                window.location = $scope.returnUrl;
            }
            else {
                if (result.data != null) {
                    comment.msgBox(result.data, "error");
                }
                else {
                    comment.msgBox("创建任务失败！", "error");
                }
            }
        });
    };

    $scope.cancel = function () {
        window.location = $scope.returnUrl;
    };
}