
function ExternalTaskInfoCtrl($scope, userId) {
    $scope.templateUrl = externalUrl;
    if (isPhp) {
        $scope.returnUrl = "/task/todo";
    }
    else {
        $scope.returnUrl = "/GetTasksByAssignee.htm?userId=" + userId
    }

    $scope.back = function () {
        window.location = $scope.returnUrl;
    };
}