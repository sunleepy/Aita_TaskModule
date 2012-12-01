function TaskInfoCtrl($scope, $rootScope, $http, $location, $routeParams, $element, urls, userId, taskId) {
    if (isPhp) {
        $scope.updateTaskUrl = urls.map_url;
        $scope.taskInfoUrl = urls.map_url;
        $scope.changeCompletedUrl = urls.map_url;
        $scope.findUserUrl = "http://w.taobao.ali.com/task/autoprompt";
        $scope.returnUrl = "/task/todo";
    }
    else {
        $scope.findUserUrl = urls.map_url + '?url=url_findUser&_=' + new Date().getTime();
        $scope.updateTaskUrl = urls.map_url + '?url=url_updateTask&_=' + new Date().getTime();
        $scope.taskInfoUrl = urls.map_url + '?url=url_taskInfo&_=' + new Date().getTime();
        $scope.changeCompletedUrl = urls.map_url + '?url=url_changeCompleted&_=' + new Date().getTime();
        $scope.returnUrl = "/GetTasksByAssignee.htm?userId=" + userId;
    }

    $scope.userId = userId;
    $scope.taskId = taskId;
    $scope.editMode = false;
    $scope.isTransferingToOther = false;

    $scope.subject = "";
    $scope.body = "";
    $scope.creator = null;
    $scope.assignee = null;
    $scope.related = null;
    $scope.duetime = null;
    $scope.isCompleted = 0;
    $scope.displayPriority = null;

    //保存任务的最初原始处理人
    $scope.originalAssigneeId = "";

    $scope.currentAssigneeJson = null;
    $scope.currentRelatedJson = null;

    //根据服务器端过来的处理人json刷新处理人选人控件
    $scope.refreshAssignee = function (assigneeJson) {
        //根据当前处理人信息初始化当前处理人选人控件
        if (assigneeJson != null) {
            var assigneeUser = [{ id: assigneeJson.id, name: assigneeJson.displayname}];
            $("#assigneeSelector").Selector(
            {
                dropListUrl: $scope.findUserUrl,
                ifRepeat: false,
                maxDrop: 8,
                maxToken: 1,
                initData: assigneeUser
            });
            $("#assigneeSelector_forTransfor").Selector(
            {
                dropListUrl: $scope.findUserUrl,
                ifRepeat: false,
                maxDrop: 8,
                maxToken: 1,
                initData: assigneeUser
            });
            $scope.currentAssigneeJson = assigneeUser;
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
            $("#assigneeSelector_forTransfor").Selector(
            {
                dropListUrl: $scope.findUserUrl,
                ifRepeat: false,
                maxDrop: 8,
                maxToken: 1,
                initData: []
            });
            $scope.currentAssigneeJson = [];
        }
    }

    $scope.displayTaskData = function (result) {

        //显示标题
        $scope.subject = result.data.subject;
        //显示说明
        $scope.body = result.data.body;
        //显示创建人
        $scope.creator = result.data.creator.displayname;
        //显示处理人
        if (result.data.assignee != null) {
            $scope.assignee = result.data.assignee.displayname;
            $scope.originalAssigneeId = result.data.assignee.id;
        }

        //显示相关人员
        var userStr = "";
        for (var index in result.data.related) {
            userStr += result.data.related[index].displayname + " ";
        }
        $scope.related = userStr;

        //显示期望完成时间
        $scope.duetime = result.data.duetime;

        //显示是否完成
        $scope.isCompleted = result.data.isCompleted;
        $scope.refreshCompleted(result.data.isCompleted);

        //显示优先级
        $scope.displayPriority = $scope.getDisplayPriority(result.data.priority);
        $scope.refreshPriority($scope.displayPriority);

        //显示处理人
        $scope.refreshAssignee(result.data.assignee);

        //根据相关人员信息初始化相关人员选人控件
        var relatedUsers = [];
        for (var index in result.data.related) {
            relatedUsers.push({ id: result.data.related[index].id, name: result.data.related[index].displayname });
        }
        $("#relatedSelector").Selector(
        {
            dropListUrl: $scope.findUserUrl,
            ifRepeat: false,
            maxDrop: 8,
            maxToken: 999,
            initData: relatedUsers
        });
        $scope.currentRelatedJson = relatedUsers;

        //如果当前登录用户与当前任务处理人相同，则显示任务操作区域
        if (result.data.assignee != null && result.data.assignee.id == userId) {
            $("#task-detail-but").show();
        }
    };

    //这里的逻辑用于任务详情页面显示时从服务器获取任务数据并显示任务数据
    if (taskId != null && taskId != "") {
        var data = { id: taskId, call: urls.taskInfo_call };

        $http({
            method: 'POST',
            url: $scope.taskInfoUrl,
            data: $.param(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (result, status, headers, config) {
            if (result.state == 0) {
                if (result.data != null) {
                    $scope.displayTaskData(result);
                }
                else {
                    comment.msgBox("任务不存在！", "error");
                }
            }
            else {
                if (result.data == null) {
                    comment.msgBox("获取任务信息失败！", "error");
                }
                else {
                    comment.msgBox(result.data, "error");
                }
            }
        });
    }

    //是否完成按钮点击响应函数
    $("#task-complete").click(function () {
        if ($(this).text() == "完成") {
            $scope.changeCompleted(1);
        } else {
            $scope.changeCompleted(0);
        }
    });

    //刷新是否完成按钮的显示
    $scope.refreshCompleted = function (isCompleted) {
        if (isCompleted == 0 || isCompleted == "0") {
            $("#task-complete").text("完成");
            $("#task-complete").attr("class", "task-detail-but-no");
        }
        else if (isCompleted == 1 || isCompleted == "1") {
            $("#task-complete").text("已完成");
            $("#task-complete").attr("class", "task-detail-but-yes");
        }
    }

    //修改是否任务完成的状态
    $scope.changeCompleted = function (isCompleted) {
        if ($scope.taskId == null || $scope.taskId == "") {
            comment.msgBox("当前任务不存在！", "error");
            return;
        }

        if ($scope.originalAssigneeId != userId) {
            comment.msgBox("当前用户无权修改任务！", "error");
            return;
        }

        var data = {
            id: taskId,
            isCompleted: isCompleted,
            call: urls.changeCompleted_call
        };

        $http({
            method: 'POST',
            url: $scope.changeCompletedUrl,
            data: $.param(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (result, status, headers, config) {
            if (result.state == 0) {
                $scope.refreshCompleted(isCompleted);
            }
            else {
                if (result.data != null) {
                    comment.msgBox(result.data, "error");
                }
                else {
                    comment.msgBox("修改任务是否完成失败！", "error");
                }
            }
        });
    };

    //保存任务
    $scope.save = function () {
        if ($scope.taskId == null || $scope.taskId == "") {
            comment.msgBox("当前任务不存在！", "error");
            return;
        }
        if ($scope.originalAssigneeId != userId) {
            comment.msgBox("当前用户无权修改任务！", "error");
            return;
        }
        if ($scope.subject == null || $scope.subject == "") {
            comment.msgBox("请输入任务标题！", "error");
            return;
        }

        var assigneeUserId = null;
        if ($scope.isTransferingToOther) {
            assigneeUserId = $("#assigneeUserId_forTransfor").val();
        }
        else {
            assigneeUserId = $("#assigneeUserId").val();
        }

        var priority = $scope.getPriority($("#task-yx-color").attr("value"));

        var data = {
            id: taskId,
            subject: $scope.subject,
            body: $scope.body,
            dueTime: $("#duetime").val(),
            priority: priority,
            assigneeUserId: assigneeUserId,
            relatedUserJson: $("#relatedUserIds").val(),
            isCompleted: 0,
            call: urls.updateTask_call
        };

        $http({
            method: 'POST',
            url: $scope.updateTaskUrl,
            data: $.param(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (result, status, headers, config) {
            if (result.state == 0) {
                if (result.data != null) {
                    $scope.editMode = false;

                    $scope.duetime = data.dueTime;
                    $scope.assignee = result.data.assignee;
                    $scope.related = result.data.related;
                    $scope.displayPriority = $scope.getDisplayPriority(data.priority);

                    $scope.refreshAssignee(result.data.assigneeJson);
                    $scope.updateRelatedUserSelector(result.data.relatedUsers);
                    $scope.refreshPriority($scope.displayPriority);

                    $("#task-alert-action").hide();
                }
                else {
                    comment.msgBox("保存任务失败！", "error");
                }
            }
            else {
                if (result.data != null) {
                    comment.msgBox(result.data, "error");
                }
                else {
                    comment.msgBox("保存任务失败！", "error");
                }
            }
        });
    };

    //根据数据库的优先级值得到要显示的优先级值，显示的优先级值比数据库的值大1
    $scope.getDisplayPriority = function (priority) {
        if (priority == null) {
            return "";
        }
        else if (priority == "0") {
            return "1";
        }
        else if (priority == "1") {
            return "2";
        }
        else if (priority == "2") {
            return "3";
        }
        return "";
    }

    //根据显示的优先级值得到数据库的优先级值
    $scope.getPriority = function (displayPriority) {
        if (displayPriority == null) {
            return "";
        }
        else if (displayPriority == "1") {
            return "0";
        }
        else if (displayPriority == "2") {
            return "1";
        }
        else if (displayPriority == "3") {
            return "2";
        }
        return "";
    }

    //刷新优先级控件显示颜色样式和文本
    $scope.refreshPriority = function (displayPriority) {
        $("#task-yx-color").attr("value", displayPriority);
        $("#task-yx-color").text(displayPriority);

        if (displayPriority == "1") {
            $("#task-yx-color").attr("class", "ring-red");
            $("#priorityIcon").attr("class", "ring-red");
        }
        else if (displayPriority == "2") {
            $("#task-yx-color").attr("class", "ring-yellow");
            $("#priorityIcon").attr("class", "ring-yellow");
        }
        else if (displayPriority == "3") {
            $("#task-yx-color").attr("class", "ring-blue");
            $("#priorityIcon").attr("class", "ring-blue");
        }
        else if (displayPriority == "") {
            $("#task-yx-color").attr("class", "ring-gray");
            $("#priorityIcon").attr("class", "ring-gray");
        }
    }

    //根据服务器获取到的相关人员信息更新选人控件
    $scope.updateRelatedUserSelector = function (relatedUsersFromServer) {
        var relatedUsers = [];
        for (var index in relatedUsersFromServer) {
            relatedUsers.push({ id: relatedUsersFromServer[index].id, name: relatedUsersFromServer[index].displayname });
        }
        $("#relatedSelector").Selector(
        {
            dropListUrl: $scope.findUserUrl,
            ifRepeat: false,
            maxDrop: 8,
            maxToken: 999,
            initData: relatedUsers
        });
        $scope.currentRelatedJson = relatedUsers;
    }

    //点击编辑按钮时进入编辑模式
    $scope.enterEditMode = function () {
        if ($scope.originalAssigneeId != userId) {
            comment.msgBox("当前用户无权修改任务！", "error");
            return;
        }

        //保存修改前的值
        $scope.originalSubject = $scope.subject;
        $scope.originalBody = $scope.body;
        $scope.originalAssigneeJson = $scope.currentAssigneeJson;
        $scope.originalRelated = $scope.currentRelatedJson;
        $scope.originalDueTime = $scope.duetime;
        $scope.originalDisplayPriority = $scope.displayPriority;

        $scope.editMode = true;
        $scope.isTransferingToOther = false;
    };

    //点击取消按钮时进入查看模式，需要将编辑模式下各个控件的值还原到编辑前的状态
    $scope.enterViewMode = function () {
        $scope.editMode = false;

        //隐藏弹出菜单
        $("#task-alert-action").hide();

        //还原标题
        $scope.subject = $scope.originalSubject;
        //还原说明
        $scope.body = $scope.originalBody;

        //还原当前处理人
        $("#assigneeSelector").Selector(
        {
            dropListUrl: $scope.findUserUrl,
            ifRepeat: false,
            maxDrop: 8,
            maxToken: 1,
            initData: $scope.originalAssigneeJson
        });
        $("#assigneeSelector_forTransfor").Selector(
        {
            dropListUrl: $scope.findUserUrl,
            ifRepeat: false,
            maxDrop: 8,
            maxToken: 1,
            initData: $scope.originalAssigneeJson
        });

        //还原相关人员
        $("#relatedSelector").Selector(
        {
            dropListUrl: $scope.findUserUrl,
            ifRepeat: false,
            maxDrop: 8,
            maxToken: 999,
            initData: $scope.originalRelated
        });

        //还原期望完成时间
        $scope.duetime = $scope.originalDueTime;
        $("#duetime").attr("value", $scope.originalDueTime);

        //还原优先级
        $scope.displayPriority = $scope.originalDisplayPriority;
        $scope.refreshPriority($scope.originalDisplayPriority);
    };

    //进入转交模式
    $scope.enterTransferMode = function () {
        if ($scope.originalAssigneeId != userId) {
            comment.msgBox("当前用户无权修改任务！", "error");
            return;
        }

        $("#assigneeSelector").Selector(
        {
            dropListUrl: $scope.findUserUrl,
            ifRepeat: false,
            maxDrop: 8,
            maxToken: 1,
            initData: $scope.currentAssigneeJson
        });
        $("#assigneeSelector_forTransfor").Selector(
        {
            dropListUrl: $scope.findUserUrl,
            ifRepeat: false,
            maxDrop: 8,
            maxToken: 1,
            initData: $scope.currentAssigneeJson
        });

        $("#task-alert-action").hide();

        //保存转交前的处理人
        $scope.originalAssigneeJson = $scope.currentAssigneeJson;

        $scope.isTransferingToOther = true;
    };

    //离开转交模式
    $scope.leaveTransferMode = function () {

        //还原当前处理人
        $("#assigneeSelector").Selector(
        {
            dropListUrl: $scope.findUserUrl,
            ifRepeat: false,
            maxDrop: 8,
            maxToken: 1,
            initData: $scope.originalAssigneeJson
        });
        $("#assigneeSelector_forTransfor").Selector(
        {
            dropListUrl: $scope.findUserUrl,
            ifRepeat: false,
            maxDrop: 8,
            maxToken: 1,
            initData: $scope.originalAssigneeJson
        });

        $scope.isTransferingToOther = false;
    };

    //返回到任务待办列表
    $scope.back = function () {
        window.location = $scope.returnUrl;
        return false;
    };
}