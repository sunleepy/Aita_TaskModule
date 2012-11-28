
function GetTasksByCreatorCtrl($scope, $rootScope, $http, $location, $routeParams, $element, urls, userId) {

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
    $scope.chooseMeAssignToOther = function () {
        $scope.isMeAssignToOther = !$scope.isMeAssignToOther;

        reloadPage();
    }
    //分配他人的图标
    $scope.meAssignToOtherIcon = function () {
        return $scope.isMeAssignToOther ? 'btn btn-primary' : 'btn';
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
    ////////////////////////////////////////////////////////////////////////////////////////
    //初始化页面
    function initPage(params) {
        var url = urls.getTasksByCreator_url;
        url += '?userId=' + userId;
        url += params;
        url = escape(url);
        //$('#loading-cooper').show();
        //$('#main-cooper').hide();

        $http.get(urls.map_url + '?url=' + url + '&_=' + new Date().getTime())
        .success(function (data, status, headers, config) {
            if (data.state == 0) {
                $scope.meAssigntoMe = data.data.meAssigntoMe;
                $scope.meAssignToOther = data.data.meAssignToOther;
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
    //重新刷新页面
    function reloadPage() {
        var sourcesJson = angular.toJson(toJsonSourceDictTrue());
        var key = $('#keyWord').val();
        var params = '&key=' + key + '&isAssignee=' + $scope.isMeAssigntoMe + '&isAssignedToOther=' + $scope.isMeAssignToOther + '&externalTaskSourceJson=' + sourcesJson;
        initPage(params);
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    //事件绑定
    $('#keyWord').keyup(function () {
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
    $scope.isMeAssignToOther = false;
    initPage('&key=&isAssignee=false&isAssignedToOther=false&externalTaskSourceJson=');
}