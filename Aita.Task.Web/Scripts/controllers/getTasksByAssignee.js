
function GetTasksByAssigneeCtrl($scope, $rootScope, $http, $location, $routeParams, $element, urls, userId, displayMode) {

    ////////////////////////////////////////////////////////////////////////////////////////
    //切换完成状态
    //并调用任务API - ChangeCompleted
    $scope.setIsCompleted = function (t, isCompleted) {
        if (t.isEditable) {
            t.isCompleted = isCompleted;
        }
    }
    //切换完成图标
    $scope.completedIcon = function (t) {
        return t.isCompleted ? 'icon-ok' : '';
    }
    //选择自我安排
    $scope.chooseMeAssigntoMe = function () {
        $scope.isMeAssigntoMe = !$scope.isMeAssigntoMe;

        reloadPage();
    }
    //自我安排的图标
    $scope.meAssigntoMeIcon = function () {
        return $scope.isMeAssigntoMe ? 'btn btn-primary' : 'btn';
    }
    //选择分配他人
    $scope.chooseOtherAssignToMe = function () {
        $scope.isOtherAssignToMe = !$scope.isOtherAssignToMe;

        reloadPage();
    }
    //分配他人的图标
    $scope.otherAssignToMeIcon = function () {
        return $scope.isOtherAssignToMe ? 'btn btn-primary' : 'btn';
    }
    //选择任务来源
    $scope.chooseSource = function (source) {
        if (source.isChoose === undefined) {
            source.isChoose = false;
        }
        source.isChoose = !source.isChoose;

        reloadPage();
    }
    //任务来源的图标
    $scope.sourceIcon = function (source) {
        return source.isChoose ? 'btn btn-primary source' : 'btn source';
    }
    $scope.getFormatDate = function (date) {
        //        return moment(date).format('YYYY-MM-DD HH:mm:ss');
        if (date == null)
            return '待定';
        return moment(date).format('MM-DD'); ;
    }
    $scope.init = function (me) {
        $('#' + me).datepicker('show');
    }
    $scope.openUrl = function (task) {
        if (task.isEditable) {
            location.href = '/TaskInfo.htm?userId=' + userId + '&taskId=' + task.id;
        }
        else {
            location.href = task.relatedUrl;
        }
    }
    $scope.equalDisplayMode = function (d) {
        return displayMode == d;
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    //初始化页面
    function initPage(params) {
        var url = urls.getTasksByAssignee_url;
        url += '?userId=' + userId;
        url += params;
        url = escape(url);
        $('#loading-cooper').show();
        $('#main-cooper').hide();

        if (displayMode == 1) {

            $http.get(urls.map_url + '?url=' + url + '&_=' + new Date().getTime())
                .success(function (data, status, headers, config) {
                    if (data.state == 0) {
                        $scope.meAssigntoMe = data.data.meAssigntoMe;
                        $scope.otherAssignToMe = data.data.otherAssignToMe;
                        $scope.sources = data.data.sources;

                        $scope.tasks = data.data.tasks;

                        $('#main-cooper').show();
                        $('#loading-cooper').hide();
                    }
                    else {
                        alert(data.data);
                    }
                })
                .error(function (data, status, headers, config) {
                    alert('error:' + data);
                });
        }
        else if (displayMode == 2) {

            $http.get(urls.map_url + '?url=' + url + '&_=' + new Date().getTime())
                .success(function (data, status, headers, config) {
                    if (data.state == 0) {
                        $scope.meAssigntoMe = data.data.meAssigntoMe;
                        $scope.otherAssignToMe = data.data.otherAssignToMe;
                        $scope.sources = data.data.sources;

                        $scope.taskDict = data.data.taskDict;

                        $('#main-cooper').show();
                        $('#loading-cooper').hide();
                    }
                    else {
                        alert(data.data);
                    }
                })
                .error(function (data, status, headers, config) {
                    alert('error:' + data);
                });
        }
    }
    //重新刷新页面
    function reloadPage() {
        var arr = [];
        for (var i = 0; i < $scope.sources.length; i++) {
            var source = $scope.sources[i];
            if (source.isChoose !== undefined && source.isChoose) {
                arr.push(source);
            }
            var sourcesJson = angular.toJson(arr);
        }
        var params = '&key=&isAssignee=' + $scope.isMeAssigntoMe + '&isAssignedToOther=' + $scope.isMeAssignToOther + '&externalTaskSourceJson=' + sourcesJson;
        initPage(params);
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    $scope.isMeAssigntoMe = false;
    $scope.isOtherAssignToMe = false;
    initPage('&isCreator=&isCompleted=&key=&externalTaskSourceJson=&displayMode=' + displayMode);
}