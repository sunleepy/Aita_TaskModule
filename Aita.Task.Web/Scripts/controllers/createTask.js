
function CreateTaskCtrl($scope, $rootScope, $http, $location, $routeParams, $element, urls, userId) {

    //初始化页面
    function initPage(params) {
        $('#main').show();

        $scope.innerFindUserUrl = 'http://localhost:9000/sys/autoprompt';
        $scope.innerCreateTaskUrl = 'http://localhost:9000/EnterpriseTask/CreateTask';

        $scope.findUserUrl = urls.map_url + '?url=' + $scope.innerFindUserUrl + '&_=' + new Date().getTime();
        $scope.createTaskUrl = urls.map_url + '?url=' + $scope.innerCreateTaskUrl + '&_=' + new Date().getTime();

        $scope.subject = null;
        $scope.body = null;
        $scope.priority = 0;
        $scope.dueTime = null;

        //负责人
        $("#assigneeSelector").Selector(
        {
            dropListUrl: $scope.findUserUrl,
            ifRepeat: true,
            maxDrop: 11,
            maxToken: 999,
            initData: [{ id: '10000', name: '何望' }, { id: '10001', name: '侯昆'}]
        });

        //相关人员
        $("#relatedSelector").Selector(
        {
            dropListUrl: $scope.findUserUrl,
            ifRepeat: true,
            maxDrop: 11,
            maxToken: 999,
            initData: [{ id: '10000', name: '何望' }, { id: '10004', name: '萧玄'}]
        });

        //优先级
        $("#priority button").click(function (e) {
            $scope.priority = $(this).val();
            $('#priority button').removeClass('active');
            $(this).toggleClass("active");
        });

        //期望完成时间
        $('#dueTime').datepicker({ format: 'yyyy-mm-dd' })
            .on('changeDate', function (e) {
                var value = e.date.valueOf();
                $scope.dueTime = new Date(value);
                $('#dueTime').datepicker('hide');
        });

        $scope.saveTask = function () {
            var data = {
                userId: userId,
                subject: $scope.subject,
                body: $scope.body,
                dueTime: $scope.dueTime,
                priority: $scope.priority,
                assigneeUserId: $("#assigneeUserId").val(),
                relatedUserJson: $("#relatedUserIds").val()
            };

            $http.post($scope.createTaskUrl, data).success(function (data, status, headers, config) {
                if (data.state == 0) {
                    alert('任务创建成功，任务ID:' + data.data);
                    window.location = "GetTasksByCreator.htm?userId=" + userId + "&key=&isAssignee=false&isAssignedToOther=false&externalTaskSourceJson=";
                }
                else {
                    alert(data.data);
                }
            });
        };
        $scope.cancel = function () {
            //TODO, 重定向到任务列表页面
            alert("task create canceled, redirect to task list page.");
        };
    }

    initPage();
}