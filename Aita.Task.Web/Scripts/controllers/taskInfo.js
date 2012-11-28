function TaskInfoCtrl($scope, $rootScope, $http, $location, $routeParams, $element, urls, userId, taskId) {

    $scope.userInfoUrl = urls.map_url + '?url=url_userInfo&_=' + new Date().getTime();
    $scope.findUserUrl = urls.map_url + '?url=url_findUser&_=' + new Date().getTime();
    $scope.createTaskUrl = urls.map_url + '?url=url_createTask&_=' + new Date().getTime();
    $scope.taskInfoUrl = urls.map_url + '?url=url_taskInfo&_=' + new Date().getTime();
    $scope.redirectUrl = "GetTasksByCreator.htm?userId=" + userId + "&key=&isAssignee=false&isAssignedToOther=false&externalTaskSourceJson=";

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

                //设置期望完成日期控件
                $('#duetime').datepicker({ format: 'yyyy-mm-dd' })
                    .on('changeDate', function (e) {
                        var value = e.date.valueOf();
                        $scope.dueTime = new Date(value);
                        $('#duetime').datepicker('hide');
                    });
                $('#duetime').datepicker('setValue', $scope.duetime);

                //设置相关人员
                if (result.data.assignee != null && result.data.assignee != "") {
                    var assigneeUser = [ { id: result.data.assignee.id, name: result.data.assignee.displayname }];
                    $("#assigneeSelector").Selector(
                    {
                        dropListUrl: $scope.findUserUrl,
                        ifRepeat: false,
                        maxDrop: 11,
                        maxToken: 999,
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

    //相关人员
    $("#relatedSelector").Selector(
        {
            dropListUrl: $scope.findUserUrl,
            ifRepeat: true,
            maxDrop: 11,
            maxToken: 999
        });

    //优先级
    $("#priority button").click(function (e) {
        $scope.priority = $(this).val();
        $('#priority button').removeClass('active');
        $(this).toggleClass("active");
    });

    //点击保存按钮的响应函数
    $scope.save = function () {
        $scope.editMode = false;
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