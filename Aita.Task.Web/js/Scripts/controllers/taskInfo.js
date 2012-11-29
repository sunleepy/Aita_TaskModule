function TaskInfoCtrl($scope, $rootScope, $http, $location, $routeParams, $element, urls, userId, taskId) {

    $scope.findUserUrl = urls.map_url + '?url=url_findUser&_=' + new Date().getTime();
    $scope.updateTaskUrl = urls.map_url + '?url=url_updateTask&_=' + new Date().getTime();
    $scope.taskInfoUrl = urls.map_url + '?url=url_taskInfo&_=' + new Date().getTime();

    $scope.editMode = false;

    $scope.subject = null;
    $scope.body = null;
    $scope.priority = 0;

    //发送http post请求获取当前登录用户信息，用于初始化默认任务处理人
    if (taskId != null && taskId != "") {
        var data = { id: taskId };
        $http.post($scope.taskInfoUrl, data).success(function (result, status, headers, config) {
            if (result.state == 0) {
                //设置模型数据
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

                //设置优先级选中状态
                $('#priority button').removeClass('active');
                $('#priority button[value=' + result.data.priority + ']').toggleClass("active");

                //设置相关人员
                if (result.data.assignee != null && result.data.assignee != "") {
                    var assigneeUser = [ { id: result.data.assignee.id, name: result.data.assignee.displayname }];
                    $("#assigneeSelector").Selector(
                    {
                        dropListUrl: $scope.findUserUrl,
                        ifRepeat: false,
                        maxDrop: 11,
                        maxToken: 1,
                        initData: assigneeUser
                    });
                }

                //设置相关人员
                var relatedUsers = [];
                for (var index in result.data.related) {
                    relatedUsers.push({ id: result.data.related[index].id, name: result.data.related[index].displayname });
                }
                $("#relatedSelector").Selector(
                {
                    dropListUrl: $scope.findUserUrl,
                    ifRepeat: true,
                    maxDrop: 11,
                    maxToken: 999,
                    initData: relatedUsers
                });
            }
            else {
                alert(result.data);
            }
        });
    }

    //优先级
    $("#priority button").click(function (e) {
        $scope.priority = $(this).val();
        $('#priority button').removeClass('active');
        $(this).toggleClass("active");
    });

    //点击保存按钮的响应函数
    $scope.save = function () {

        var data = {
            id: taskId,
            userId: userId,
            subject: $scope.subject,
            body: $scope.body,
            dueTime: $("#duetime").val(),
            priority: $scope.priority,
            assigneeUserId: $("#assigneeUserId").val(),
            relatedUserJson: $("#relatedUserIds").val(),
            isCompleted: 0
        };

        //send http post request
        $http.post($scope.updateTaskUrl, data).success(function (result, status, headers, config) {
            if (result.state == 0) {
                $scope.editMode = false;
                $scope.duetime = data.dueTime;
                $scope.assignee = result.data.assignee;
                $scope.related = result.data.related;
            }
            else {
                alert(result.data);
            }
        });
    };

    //点击编辑按钮的响应函数
    $scope.enterEditMode = function () {
        $scope.editMode = true;
    };

    //点击保存按钮的响应函数
    $scope.openTransaferDialog = function () {
        alert("open transafer dialog.");
    };
}