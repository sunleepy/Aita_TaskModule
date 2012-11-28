
function GetTasksByAssigneeCtrl($scope, $rootScope, $http, $location, $routeParams, $element, urls, userId, displayMode) {
    ////////////////////////////////////////////////////////////////////////////////////////
    //切换完成状态
    //并调用任务API - ChangeCompleted
    $scope.setIsCompleted = function (t, isCompleted) {
        if (t.isEditable) {
            t.isCompleted = isCompleted;
            var data = {
                id: t.id,
                isCompleted: isCompleted ? 1 : 0
            };
            $http.post(urls.map_url + '?url=' + urls.changeCompleted_url + '&_=' + new Date().getTime(), data)
                .success(function (data, status, headers, config) {
                    if (data.state != 0) {
                        alert(data.data);
                    }
                })
                .error(function (data, status, headers, config) {
                    alert('error:' + data);
                });
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
        switchSourceDictBySource(source);
        reloadPage();
    }
    //任务来源的图标
    $scope.sourceIcon = function (source) {
        var k = 'sourceKey_' + source.type + '_' + source.id;
        for (var i = 0; i < $scope.sourceDict.length; i++) {
            var currentPair = $scope.sourceDict[i];
            if (k == currentPair.key) {
                return currentPair.value ? 'btn btn-primary source' : 'btn source';
            }
        }
        return 'btn source';
    }
    $scope.getFormatDate = function (date) {
        //        return moment(date).format('YYYY-MM-DD HH:mm:ss');
        if (date == null)
            return '待定';
        return moment(date).format('MM-DD'); ;
    }
    $scope.getFormatPriority = function (priority) {
        if (priority == null)
            return '-1';
        return priority;
    }
    $scope.openDueTime = function (elementId) {
        openWdatePicker(elementId);
    }
    $scope.openUrl = function (task) {
        if (task.isEditable) {
            return '/TaskInfo.htm?userId=' + userId + '&taskId=' + task.id;
        }
        else {
            return task.relatedUrl;
        }
    }
    $scope.equalDisplayMode = function (d) {
        return displayMode == d;
    }
    $scope.showPriorityPanel = function (task) {
        $('#showPriority_' + task.id).show();

        $('#showPriority_' + task.id + ' img').unbind().bind('click', function () {
            var choosePriority = $(this).attr('tag');
            var data = {
                id: task.id,
                priority: choosePriority
            };
            $http.post(urls.map_url + '?url=' + urls.changePriority_url + '&_=' + new Date().getTime(), data)
                .success(function (data, status, headers, config) {
                    if (data.state != 0) {
                        alert(data.data);
                    }
                    $('#showPriority_' + task.id).hide();
                    $('#priority_' + task.id).attr('src', '/content/images/priority_' + choosePriority + '.png');
                })
                .error(function (data, status, headers, config) {
                    alert('error:' + data);
                    $('#showPriority_' + task.id).hide();
                });
        });
    }
    $scope.showPriorityPanel2 = function (task) {
        $('#showPriority2_' + task.id).show();

        $('#showPriority2_' + task.id + ' img').unbind().bind('click', function () {
            var choosePriority = $(this).attr('tag');
            var data = {
                id: task.id,
                priority: choosePriority
            };
            $http.post(urls.map_url + '?url=' + urls.changePriority_url + '&_=' + new Date().getTime(), data)
            .success(function (data, status, headers, config) {
                if (data.state != 0) {
                    alert(data.data);
                }
                $('#showPriority2_' + task.id).hide();
                $('#priority2_' + task.id).attr('src', '/content/images/priority_' + choosePriority + '.png');
            })
            .error(function (data, status, headers, config) {
                alert('error:' + data);
                $('#showPriority2_' + task.id).hide();
            });
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    //初始化页面
    function initPage(data) {

        if (displayMode == 1) {

            $http.post(urls.map_url + '?url=' + urls.getTasksByAssignee_url + '&_=' + new Date().getTime(), data)
                .success(function (data, status, headers, config) {
                    if (data.state == 0) {
                        $scope.meAssigntoMe = data.data.meAssigntoMe;
                        $scope.otherAssignToMe = data.data.otherAssignToMe;
                        $scope.sources = data.data.sources;

                        refreshSourceDictBySources($scope.sources);

                        $scope.tasks = data.data.tasks;

                        $('#main-cooper').show();
                        //$('#loading-cooper').hide();
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

        $http.post(urls.map_url + '?url=' + urls.getTasksByAssignee_url + '&_=' + new Date().getTime(), data)
                .success(function (data, status, headers, config) {
                    //TODO,排序group
                    if (data.state == 0) {
                        $scope.meAssigntoMe = data.data.meAssigntoMe;
                        $scope.otherAssignToMe = data.data.otherAssignToMe;
                        $scope.sources = data.data.sources;

                        refreshSourceDictBySources($scope.sources);

                        $scope.taskDict = data.data.taskDict;

                        $('#main-cooper').show();
                        //$('#loading-cooper').hide();
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
        var sourcesJson = angular.toJson(toJsonSourceDictTrue());
        var key = $('#keyWord').val();
        var data = {
            userId: userId,
            isCreator: $scope.isMeAssigntoMe,
            isOtherAssignedToMe: $scope.isOtherAssignToMe,
            isCompleted: $scope.isCompletedOption,
            key: key,
            externalTaskSourceJson: sourcesJson,
            syncExternalTask: '',
            displayMode: displayMode
        };
        initPage(data);
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    //事件绑定
    $('#keyWord').keyup(function () {
        reloadPage();
    });
    $('#displayMode button').unbind().bind('click', function () {
        var selDisplayMode = $(this).attr('displayMode');
        $('#displayMode button').removeClass();
        $('#displayMode button').addClass('btn');
        $(this).addClass('btn active');
        displayMode = selDisplayMode;
        reloadPage();
    });
    $('#hideCompletedOption').click( function () {
        if ($(this).attr('checked')) {
            $scope.isCompletedOption = 'false';
        }
        else {
            $scope.isCompletedOption = '';
        }
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
    $scope.isMeAssigntoMe = false;
    $scope.isOtherAssignToMe = false;
    $scope.isCompletedOption = '';
    $scope.userId = userId;
    if (displayMode == null 
        || displayMode == '') {
        displayMode = 1;
    }
    var data = {
        userId: userId,
        isCreator: 'false',
        isOtherAssignedToMe: 'false',
        isCompleted: '',
        key: '',
        externalTaskSourceJson: '',
        syncExternalTask: '',
        displayMode: displayMode
    };
    initPage(data);
}