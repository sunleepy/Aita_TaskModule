﻿
function GetRelatedTasksCtrl($scope, $rootScope, $http, $location, $routeParams, $element, urls, userId) {
    ////////////////////////////////////////////////////////////////////////////////////////
    //切换完成状态
    //完成图标
    $scope.completedIcon = function (t) {
        if (t.isEditable) {
            return t.isCompleted ? 'i1' : 'i0';
        }
        else {
            return 'i2';
        }
    }
    //选择自我安排
    $scope.chooseOtherAssignToMe = function () {
        $scope.isOtherAssignToMe = !$scope.isOtherAssignToMe;

        reloadPage();
    }
    //自我安排的图标
    $scope.otherAssignToMeIcon = function () {
        return $scope.isOtherAssignToMe ? 'button-tasknavOn' : 'button-tasknav';
    }
    //选择任务来源
    $scope.chooseSource = function (source) {
        switchSourceDictBySource(source);
        reloadPage();
    }
    //任务来源的图标
    $scope.sourceIcon = function (source) {
        var k = 'sourceKey_' + source.type + '_' + source.id;
        for (var i = 0; i < $scope.sourceDict.length; i++) {
            var currentPair = $scope.sourceDict[i];
            if (k == currentPair.key) {
                return currentPair.value ? 'button-tasknavOn' : 'button-tasknav';
            }
        }
        return 'button-tasknav';
    }
    $scope.getFormatDate = function (date) {
        //        return moment(date).format('YYYY-MM-DD HH:mm:ss');
        if (date == null)
            return '待定';
        return moment(date).format('MM-DD'); ;
    }
    $scope.openUrl = function (task) {
        if (task.isEditable) {
            return '/TaskInfo.htm?userId=' + userId + '&taskId=' + task.id;
        }
        else {
            return '/ExternalTaskInfo.htm?url=' + escape(task.relatedUrl);
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    //初始化页面
    function initPage(data) {
        var url = isPhp ? urls.map_url + '?_=' + new Date().getTime()
                : urls.map_url + '?url=' + urls.getRelatedTasks_call + '&_=' + new Date().getTime();

        $http({
            method: 'POST',
            url: url,
            data: $.param(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
            if (data.state == 0) {
                $scope.otherAssignToMe = data.data.otherAssignToMe;
                $scope.sources = data.data.sources;

                refreshSourceDictBySources($scope.sources);

                $scope.tasks = data.data.tasks;

                $('#optionPanel').show();
                $('#main-cooper').show();
            }
            else {
                alert(data.data);
            }
        })
        .error(function (data, status, headers, config) {
            alert('error:' + data);
        });
    }
    //重新刷新页面
    function reloadPage() {
        var sourcesJson = angular.toJson(toJsonSourceDictTrue());
        var key = $('#task-keyword').val();
        var data = {
            userId: userId,
            key: key,
            isCreator: $scope.isOtherAssignToMe ? false : null,
            externalTaskSourceJson: sourcesJson,
            call: urls.getRelatedTasks_call
        };
        initPage(data);
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    //事件绑定
    $('#task-keyword').keyup(function () {
        reloadPage();
    });
    ////////////////////////////////////////////////////////////////////////////////////////
    //外部来源筛选条件处理和判断
    function refreshSourceDictBySources(sources) {
        $.each($scope.sources, function (i, source) {
            if (source.type > 0) {
                var k = 'sourceKey_' + source.type + '_' + source.id;
                var i = 0;
                for (; i < $scope.sourceDict.length; i++) {
                    var currentPair = $scope.sourceDict[i];
                    if (k == currentPair.key) {
                        break;
                    }
                }
                if (i == $scope.sourceDict.length) {
                    var pair = { key: k, value: false };
                    $scope.sourceDict.push(pair);
                }
            }
        });
    }
    function switchSourceDictBySource(source) {
        var k = 'sourceKey_' + source.type + '_' + source.id;
        for (var i = 0; i < $scope.sourceDict.length; i++) {
            var currentPair = $scope.sourceDict[i];
            if (k == currentPair.key) {
                currentPair.value = !currentPair.value;
                break;
            }
        }
    }
    function toJsonSourceDictTrue() {
        var arr = [];
        for (var i = 0; i < $scope.sources.length; i++) {
            var source = $scope.sources[i];
            var k = 'sourceKey_' + source.type + '_' + source.id;
            var j = 0;
            for (; j < $scope.sourceDict.length; j++) {
                var currentPair = $scope.sourceDict[j];
                if (k == currentPair.key && currentPair.value == true) {
                    arr.push(source);
                    break;
                }
            }
        }
        return arr;
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    
    //外部来源索引
    $scope.sourceDict = [];
    $scope.isOtherAssignToMe = false;
    $scope.userId = userId;
    var data = {
        userId: userId,
        isCreator: null,
        key: '',
        externalTaskSourceJson: '',
        call: urls.getRelatedTasks_call
    };
    initPage(data);
}