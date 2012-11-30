
function ExternalTaskInfoCtrl($scope) {
    $scope.templateUrl = externalUrl;

    $scope.back = function () {
        parent.history.back();
        return false;
    };
}