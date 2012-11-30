
function CreateTaskCtrl($scope, $rootScope, $http, $location, $routeParams, $element, urls, userId) {
    if (isPhp) {
        $scope.createTaskUrl = urls.map_url;
        $scope.userInfoUrl = "http://api.w.taobao.ali.com/sys/userinfo";
        $scope.findUserUrl = "http://w.taobao.ali.com/task/autoprompt";
    }
    else {
        $scope.userInfoUrl = urls.map_url + '?url=url_userInfo&_=' + new Date().getTime();
        $scope.findUserUrl = urls.map_url + '?url=url_findUser&_=' + new Date().getTime();
        $scope.createTaskUrl = urls.map_url + '?url=url_createTask&_=' + new Date().getTime();
    }

    $scope.userId = userId;
    $scope.subject = null;
    $scope.body = null;
    $scope.dueTime = null;
    $scope.priority = 0;

    $("#assigneeSelector").Selector(
    {
        dropListUrl: $scope.findUserUrl,
        ifRepeat: false,
        maxDrop: 8,
        maxToken: 1,
        initData: []
    });
    $("#relatedSelector").Selector(
    {
        dropListUrl: $scope.findUserUrl,
        ifRepeat: true,
        maxDrop: 8,
        maxToken: 999
    });

    if (userId != null && userId != "") {
        var data = { user_id: userId };
        $http({
            method: 'POST',
            url: $scope.userInfoUrl,
            data: $.param(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (result, status, headers, config) {
            if (result.state == 0 && result.data != null && result.data != "") {
                $("#assigneeSelector").Selector(
                {
                    dropListUrl: $scope.findUserUrl,
                    ifRepeat: false,
                    maxDrop: 8,
                    maxToken: 1,
                    initData: [{ id: userId, name: result.data.displayName }]
                });
            }
        });
    }

    $scope.save = function () {
        var data = {
            userId: userId,
            subject: $scope.subject,
            body: $scope.body,
            dueTime: $("#duetime").val(),
            priority: $("#task-yx-color").attr("value"),
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
                parent.history.back();
            }
            else {
                alert(result.data);
            }
        });
    };

    $scope.cancel = function () {
        parent.history.back();
    };
}