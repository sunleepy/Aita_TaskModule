function TaskInfoCtrl($scope, $rootScope, $http, $location, $routeParams, $element, urls, userId, taskId) {
    if (isPhp) {
        $scope.updateTaskUrl = urls.map_url;
        $scope.taskInfoUrl = urls.map_url;
        $scope.changeCompletedUrl = urls.map_url;
        $scope.findUserUrl = "http://w.taobao.ali.com/task/autoprompt";
    }
    else {
        $scope.findUserUrl = urls.map_url + '?url=url_findUser&_=' + new Date().getTime();
        $scope.updateTaskUrl = urls.map_url + '?url=url_updateTask&_=' + new Date().getTime();
        $scope.taskInfoUrl = urls.map_url + '?url=url_taskInfo&_=' + new Date().getTime();
        $scope.changeCompletedUrl = urls.map_url + '?url=url_changeCompleted&_=' + new Date().getTime();
    }

    $scope.userId = userId;
    $scope.taskId = taskId;
    $scope.editMode = false;
    $scope.isTransferingToOther = false;

    $scope.subject = null;
    $scope.body = null;
    $scope.creator = null;
    $scope.assignee = null;
    $scope.related = null;
    $scope.duetime = null;
    $scope.isCompleted = 0;
    $scope.priority = 0;
    $scope.priorityClass = null;
    $scope.displayPriority = null;

    $scope.currentAssigneeJson = null;

    if (taskId != null && taskId != "") {
        var data = { id: taskId, call: urls.taskInfo_call };

        $http({
            method: 'POST',
            url: $scope.taskInfoUrl,
            data: $.param(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (result, status, headers, config) {
            if (result.state == 0) {
                $scope.subject = result.data.subject;
                $scope.body = result.data.body;
                $scope.creator = result.data.creator.displayname;
                if (result.data.assignee != null && result.data.assignee != "") {
                    $scope.assignee = result.data.assignee.displayname;
                }
                var userStr = "";
                for (var index in result.data.related) {
                    userStr += result.data.related[index].displayname + " ";
                }
                $scope.related = userStr;
                $scope.duetime = result.data.duetime;
                $scope.priority = result.data.priority;
                $scope.isCompleted = result.data.isCompleted;

                if ($scope.priority == null) {
                    $scope.displayPriority = "";
                }
                else {
                    $scope.displayPriority = parseInt($scope.priority) + 1;
                }

                $scope.refreshPriority(result.data.priority);
                $scope.refreshCompleted(result.data.isCompleted);

                if (result.data.assignee != null && result.data.assignee != "") {
                    var assigneeUser = [{ id: result.data.assignee.id, name: result.data.assignee.displayname}];
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
            }
            else {
                alert(result.data);
            }
        });
    }

    $("#task-complete").click(function () {
        if ($(this).text() == "完成") {
            $scope.changeCompleted(1);
        } else {
            $scope.changeCompleted(0);
        }
    });

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

    $scope.changeCompleted = function (isCompleted) {
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
                alert(result.data);
            }
        });
    };

    $scope.save = function () {

        var assigneeUserId = null;
        if ($scope.isTransferingToOther) {
            assigneeUserId = $("#assigneeUserId_forTransfor").val();
        }
        else {
            assigneeUserId = $("#assigneeUserId").val();
        }

        var priorityValue = $("#task-yx-color").attr("value");
        if (priorityValue != null) {
            priorityValue = parseInt(priorityValue) - 1;
        }

        var data = {
            id: taskId,
            userId: userId,
            subject: $scope.subject,
            body: $scope.body,
            dueTime: $("#duetime").val(),
            priority: priorityValue,
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
                $scope.editMode = false;
                $scope.duetime = data.dueTime;
                $scope.assignee = result.data.assignee;
                $scope.related = result.data.related;
                $scope.priority = data.priority;

                $("#task-alert-action").hide();

                $scope.updateRelatedUserSelector(result.data.relatedUsers);
                $scope.refreshPriority(data.priority);

                if (data.priority == null) {
                    $scope.displayPriority = "";
                }
                else {
                    $scope.displayPriority = parseInt(data.priority) + 1;
                }

                //下面的代码用于同步选人控件的值
                if ($scope.isTransferingToOther) {
                    $scope.isTransferingToOther = false;
                    if (result.data.assignee != null && result.data.assignee != '') {
                        $("#assigneeSelector").Selector(
                        {
                            dropListUrl: $scope.findUserUrl,
                            ifRepeat: false,
                            maxDrop: 8,
                            maxToken: 1,
                            initData: [{ id: assigneeUserId, name: result.data.assignee}]
                        });
                        $scope.currentAssigneeJson = [{ id: assigneeUserId, name: result.data.assignee}];
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
                        $scope.currentAssigneeJson = [];
                    }
                }
                else {
                    if (result.data.assignee != null && result.data.assignee != '') {
                        $("#assigneeSelector_forTransfor").Selector(
                        {
                            dropListUrl: $scope.findUserUrl,
                            ifRepeat: false,
                            maxDrop: 8,
                            maxToken: 1,
                            initData: [{ id: assigneeUserId, name: result.data.assignee}]
                        });
                        $scope.currentAssigneeJson = [{ id: assigneeUserId, name: result.data.assignee}];
                    }
                    else {
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
            }
            else {
                alert(result.data);
            }
        });
    };

    $scope.refreshPriority = function (currentPriority) {
        $("#task-yx-color").attr("value", currentPriority);
        if (currentPriority != null) {
            if (currentPriority == "0") {
                $("#task-yx-color").attr("class", "ring-red");
                $("#priorityIcon").attr("class", "ring-red");
                var priorityValue = "";
                if (currentPriority != null) {
                    priorityValue = parseInt(currentPriority) + 1;
                }
                $("#task-yx-color").text(priorityValue);
            }
            else if (currentPriority == "1") {
                $("#task-yx-color").attr("class", "ring-yellow");
                $("#priorityIcon").attr("class", "ring-yellow");
                var priorityValue = "";
                if (currentPriority != null) {
                    priorityValue = parseInt(currentPriority) + 1;
                }
                $("#task-yx-color").text(priorityValue);
            }
            else if (currentPriority == "2") {
                $("#task-yx-color").attr("class", "ring-blue");
                $("#priorityIcon").attr("class", "ring-blue");
                var priorityValue = "";
                if (currentPriority != null) {
                    priorityValue = parseInt(currentPriority) + 1;
                }
                $("#task-yx-color").text(priorityValue);
            }
        }
        else {
            $("#task-yx-color").attr("class", "");
            $("#priorityIcon").attr("class", "");
            $("#task-yx-color").text("");
        }
    }
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
        $("#assigneeSelector_forTransfor").Selector(
        {
            dropListUrl: $scope.findUserUrl,
            ifRepeat: false,
            maxDrop: 8,
            maxToken: 999,
            initData: relatedUsers
        });
    }

    $scope.enterEditMode = function () {
        $scope.editMode = true;
    };
    $scope.enterViewMode = function () {
        $scope.editMode = false;
    };
    $scope.enterTransferMode = function () {
        $scope.isTransferingToOther = true;
        $("#task-alert-action").hide();
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
    };
    $scope.leaveTransferMode = function () {
        $scope.isTransferingToOther = false;
    };

    $scope.back = function () {
        parent.history.back();
        return false;
    };

}