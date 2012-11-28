
function CreateTaskCtrl($scope, $rootScope, $http, $location, $routeParams, $element, urls, userId) {
    $scope.userInfoUrl = urls.map_url + '?url=url_userInfo&_=' + new Date().getTime();
    $scope.findUserUrl = urls.map_url + '?url=url_findUser&_=' + new Date().getTime();
    $scope.createTaskUrl = urls.map_url + '?url=url_createTask&_=' + new Date().getTime();
    $scope.redirectUrl = "GetTasksByCreator.htm?userId=" + userId;

    $scope.subject = null;
    $scope.body = null;
    $scope.dueTime = null;
    $scope.priority = 0;

    //发送http post请求获取当前登录用户信息，用于初始化默认任务处理人
    var data = { user_id: userId };
    $http.post($scope.userInfoUrl, data).success(function (result, status, headers, config) {
        if (result.state == 0) {
            $("#assigneeSelector").Selector(
            {
                dropListUrl: $scope.findUserUrl,
                ifRepeat: false,
                maxDrop: 11,
                maxToken: 1,
                initData: [{ id: userId, name: result.data.displayName }]
            });
        }
        else {
            $("#assigneeSelector").Selector(
            {
                dropListUrl: $scope.findUserUrl,
                ifRepeat: false,
                maxDrop: 11,
                maxToken: 1,
                initData: []
            });
        }
    });

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

    //Save Button
    $scope.saveTask = function () {
        var data = {
            userId: userId,
            subject: $scope.subject,
            body: $scope.body,
            dueTime: $("#dueTime").val(),
            priority: $scope.priority,
            assigneeUserId: $("#assigneeUserId").val(),
            relatedUserJson: $("#relatedUserIds").val()
        };

        //send http post request
        $http.post($scope.createTaskUrl, data).success(function (result, status, headers, config) {
            if (result.state == 0) {
                window.location = $scope.redirectUrl;
            }
            else {
                alert(result.data);
            }
        });
    };

    //Cancel Button
    $scope.cancel = function () {
        window.location = $scope.redirectUrl;
    };
}